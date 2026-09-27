// Cálculo de líneas y totales de una venta. El precio de cada producto se
// asume con impuesto incluido (igual que WizPOS: "Incluye Impuesto" = true),
// así que la tasa se usa para separar base/ISV del monto ya cobrado, no para
// sumarlo encima.
//
// Bucket fiscal por línea (simplificado para el MVP; el contador debe
// revisar esta clasificación antes de declarar):
//   - tasa > 0            → gravado_15
//   - tasa == 0 y el cliente tiene exento_impuestos → exento
//   - tasa == 0 en cualquier otro caso              → exonerado

export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calcularLineas(items, cliente) {
  return items.map((item) => {
    const cantidad = Number(item.cantidad);
    const precioUnitario = Number(item.precio_unitario);
    const descuento = Number(item.descuento || 0);
    const tasa = Number(item.impuesto_tasa ?? 0);
    const monto = round2(precioUnitario * cantidad - descuento);

    let bucket;
    if (tasa > 0) bucket = 'gravado_15';
    else if (cliente?.exento_impuestos) bucket = 'exento';
    else bucket = 'exonerado';

    const base = tasa > 0 ? round2(monto / (1 + tasa)) : monto;
    const isv = round2(monto - base);

    return {
      producto_id: item.producto_id,
      nombre_producto: item.nombre_producto,
      cantidad,
      precio_unitario: precioUnitario,
      descuento,
      impuesto_tasa: tasa,
      monto,
      base,
      isv,
      bucket,
    };
  });
}

export const PORCENTAJES_DESCUENTO = [0, 10, 25];

// El descuento global se reparte proporcionalmente entre las líneas ANTES de
// separar base/ISV — un descuento reduce la base gravable, así que el ISV
// declarado tiene que bajar en la misma proporción. (Restarlo sólo del total
// dejaba el ISV calculado sobre el precio completo: la factura declaraba más
// impuesto del que realmente se cobró.) El centavo de redondeo se ajusta en
// la última línea para que la suma cuadre exacta.
function repartirDescuento(lineas, descuento, cliente) {
  const totalBruto = round2(lineas.reduce((s, l) => s + l.monto, 0));
  let asignado = 0;
  return lineas.map((l, i) => {
    const esUltima = i === lineas.length - 1;
    const parte = esUltima
      ? round2(descuento - asignado)
      : totalBruto > 0
        ? round2((descuento * l.monto) / totalBruto)
        : 0;
    asignado = round2(asignado + parte);
    const monto = round2(l.monto - parte);
    const base = l.impuesto_tasa > 0 ? round2(monto / (1 + l.impuesto_tasa)) : monto;
    return {
      ...l,
      descuento: round2(l.descuento + parte),
      monto,
      base,
      isv: round2(monto - base),
      bucket: l.bucket ?? (cliente?.exento_impuestos ? 'exento' : 'exonerado'),
    };
  });
}

export function calcularTotales(items, cliente, descuentoGlobal = 0) {
  const brutas = calcularLineas(items, cliente);
  const totalBruto = round2(brutas.reduce((s, l) => s + l.monto, 0));
  const descuento = Math.min(totalBruto, Math.max(0, round2(Number(descuentoGlobal || 0))));
  const lineas = descuento > 0 ? repartirDescuento(brutas, descuento, cliente) : brutas;

  const totales = { subtotal_exento: 0, subtotal_exonerado: 0, subtotal_gravado_15: 0, isv_total: 0 };
  for (const l of lineas) {
    if (l.bucket === 'exento') totales.subtotal_exento += l.base;
    else if (l.bucket === 'exonerado') totales.subtotal_exonerado += l.base;
    else totales.subtotal_gravado_15 += l.base;
    totales.isv_total += l.isv;
  }

  return {
    lineas,
    subtotal_bruto: totalBruto,
    subtotal_exento: round2(totales.subtotal_exento),
    subtotal_exonerado: round2(totales.subtotal_exonerado),
    subtotal_gravado_15: round2(totales.subtotal_gravado_15),
    isv_total: round2(totales.isv_total),
    descuento,
    total: round2(lineas.reduce((s, l) => s + l.monto, 0)),
  };
}

// Descuento por porcentaje fijo (0/10/25) → monto en Lempiras sobre el bruto.
export function descuentoPorPorcentaje(items, cliente, porcentaje) {
  const brutas = calcularLineas(items, cliente);
  // Redondear el bruto ANTES del porcentaje, igual que el POS: si no, un
  // bruto que en coma flotante queda en ...4999 redondea distinto y la
  // pantalla y la factura difieren en un centavo.
  const totalBruto = round2(brutas.reduce((s, l) => s + l.monto, 0));
  return round2((totalBruto * porcentaje) / 100);
}

export function formatearNumeroFactura(puntoEmision, correlativo) {
  return [
    puntoEmision.punto_emision_codigo,
    puntoEmision.punto_venta_codigo,
    puntoEmision.tipo_documento_codigo,
    String(correlativo).padStart(8, '0'),
  ].join('-');
}

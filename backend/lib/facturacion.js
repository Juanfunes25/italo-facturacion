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

export function calcularTotales(items, cliente, descuentoGlobal = 0) {
  const lineas = calcularLineas(items, cliente);

  const totales = { subtotal_exento: 0, subtotal_exonerado: 0, subtotal_gravado_15: 0, isv_total: 0 };
  for (const l of lineas) {
    if (l.bucket === 'exento') totales.subtotal_exento += l.base;
    else if (l.bucket === 'exonerado') totales.subtotal_exonerado += l.base;
    else totales.subtotal_gravado_15 += l.base;
    totales.isv_total += l.isv;
  }

  const totalLineas = lineas.reduce((s, l) => s + l.monto, 0);
  const total = round2(totalLineas - Number(descuentoGlobal || 0));

  return {
    lineas,
    subtotal_exento: round2(totales.subtotal_exento),
    subtotal_exonerado: round2(totales.subtotal_exonerado),
    subtotal_gravado_15: round2(totales.subtotal_gravado_15),
    isv_total: round2(totales.isv_total),
    descuento: round2(Number(descuentoGlobal || 0)),
    total,
  };
}

export function formatearNumeroFactura(puntoEmision, correlativo) {
  return [
    puntoEmision.punto_emision_codigo,
    puntoEmision.punto_venta_codigo,
    puntoEmision.tipo_documento_codigo,
    String(correlativo).padStart(8, '0'),
  ].join('-');
}

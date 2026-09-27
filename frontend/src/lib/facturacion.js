// Espejo en el frontend de backend/lib/facturacion.js — sólo para mostrar
// el desglose Sub-Total/Impuesto antes de cobrar. El cálculo real y
// definitivo siempre lo hace el backend al guardar/cobrar la venta.
export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export const OPCIONES_DESCUENTO = [
  { porcentaje: 0, etiqueta: 'Sin descuento' },
  { porcentaje: 10, etiqueta: '10%' },
  { porcentaje: 25, etiqueta: '25% Tercera edad' },
];

function calcularLineas(items, cliente) {
  return items.map((item) => {
    const monto = round2(item.precio_unitario * item.cantidad - (item.descuento || 0));
    const tasa = Number(item.impuesto_tasa ?? 0.15);
    let bucket;
    if (tasa > 0) bucket = 'gravado_15';
    else if (cliente?.exento_impuestos) bucket = 'exento';
    else bucket = 'exonerado';
    return { monto, tasa, bucket };
  });
}

// Mismo reparto proporcional que el backend: el descuento reduce la base
// gravable de cada línea, así el ISV mostrado baja en la misma proporción.
export function calcularTotales(items, cliente, porcentajeDescuento = 0) {
  const lineas = calcularLineas(items, cliente);
  const bruto = round2(lineas.reduce((s, l) => s + l.monto, 0));
  const descuento = round2((bruto * porcentajeDescuento) / 100);

  const totales = { subtotal_exento: 0, subtotal_exonerado: 0, subtotal_gravado_15: 0, isv_total: 0 };
  let asignado = 0;
  let total = 0;
  lineas.forEach((l, i) => {
    const parte =
      i === lineas.length - 1 ? round2(descuento - asignado) : bruto > 0 ? round2((descuento * l.monto) / bruto) : 0;
    asignado = round2(asignado + parte);
    const monto = round2(l.monto - parte);
    const base = l.tasa > 0 ? round2(monto / (1 + l.tasa)) : monto;
    if (l.bucket === 'exento') totales.subtotal_exento += base;
    else if (l.bucket === 'exonerado') totales.subtotal_exonerado += base;
    else totales.subtotal_gravado_15 += base;
    totales.isv_total += round2(monto - base);
    total += monto;
  });

  return {
    subtotal_bruto: bruto,
    subtotal_exento: round2(totales.subtotal_exento),
    subtotal_exonerado: round2(totales.subtotal_exonerado),
    subtotal_gravado_15: round2(totales.subtotal_gravado_15),
    isv_total: round2(totales.isv_total),
    descuento,
    total: round2(total),
  };
}

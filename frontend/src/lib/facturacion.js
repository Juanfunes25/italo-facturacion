// Espejo en el frontend de backend/lib/facturacion.js — sólo para mostrar
// el desglose Sub-Total/Impuesto antes de cobrar. El cálculo real y
// definitivo siempre lo hace el backend al guardar/cobrar la venta.
export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calcularTotales(items, cliente, descuentoGlobal = 0) {
  const totales = { subtotal_exento: 0, subtotal_exonerado: 0, subtotal_gravado_15: 0, isv_total: 0 };
  let totalLineas = 0;

  for (const item of items) {
    const monto = round2(item.precio_unitario * item.cantidad - (item.descuento || 0));
    const tasa = Number(item.impuesto_tasa ?? 0.15);
    let bucket;
    if (tasa > 0) bucket = 'gravado_15';
    else if (cliente?.exento_impuestos) bucket = 'exento';
    else bucket = 'exonerado';

    const base = tasa > 0 ? round2(monto / (1 + tasa)) : monto;
    const isv = round2(monto - base);

    if (bucket === 'exento') totales.subtotal_exento += base;
    else if (bucket === 'exonerado') totales.subtotal_exonerado += base;
    else totales.subtotal_gravado_15 += base;
    totales.isv_total += isv;
    totalLineas += monto;
  }

  const descuento = round2(Number(descuentoGlobal || 0));
  return {
    subtotal_exento: round2(totales.subtotal_exento),
    subtotal_exonerado: round2(totales.subtotal_exonerado),
    subtotal_gravado_15: round2(totales.subtotal_gravado_15),
    isv_total: round2(totales.isv_total),
    descuento,
    total: round2(totalLineas - descuento),
  };
}

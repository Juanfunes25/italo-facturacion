// Ticket de texto plano para impresoras térmicas (Epson TM-T20II 48 col.,
// Bixolon/Star 40 col.) — mismo ancho que ya usan en las sucursales, para no
// tener que cambiar el hardware.

function centrar(texto, ancho) {
  const espacio = Math.max(0, ancho - texto.length);
  const izq = Math.floor(espacio / 2);
  return ' '.repeat(izq) + texto + ' '.repeat(espacio - izq);
}

function linea(caracter, ancho) {
  return caracter.repeat(ancho);
}

function filaMontoDerecha(etiqueta, monto, ancho) {
  const montoTexto = `L ${Number(monto).toFixed(2)}`;
  const espacio = Math.max(1, ancho - etiqueta.length - montoTexto.length);
  return etiqueta + ' '.repeat(espacio) + montoTexto;
}

export function formatearTicket(venta, ancho = 40) {
  const L = [];
  L.push(centrar('INVERSIONES MILANO S DE R.L.', ancho));
  L.push(centrar('ITALO GELATERIA', ancho));
  L.push(centrar(venta.sucursales?.nombre ?? '', ancho));
  L.push(linea('-', ancho));

  const puntoEmision = venta.puntos_emision;
  if (puntoEmision?.es_borrador) {
    L.push(centrar('*** DOCUMENTO SIN VALIDEZ FISCAL ***', ancho));
    L.push(centrar('(CAI pendiente de confirmar con el SAR)', ancho));
  } else {
    L.push(`CAI: ${puntoEmision?.cai ?? ''}`);
  }
  L.push(`Factura: ${venta.numero_factura ?? ''}`);
  L.push(`Fecha: ${new Date(venta.fecha_emision).toLocaleString('es-HN')}`);
  if (puntoEmision?.fecha_limite_emision) {
    L.push(`Vence: ${puntoEmision.fecha_limite_emision}`);
  }
  L.push(linea('-', ancho));

  L.push(`Cliente: ${venta.clientes?.nombre ?? 'Consumidor Final'}`);
  if (venta.clientes?.rtn) L.push(`RTN: ${venta.clientes.rtn}`);
  L.push(`Cajero: ${venta.perfiles?.nombre ?? ''}`);
  L.push(linea('-', ancho));

  for (const item of venta.detalle ?? []) {
    L.push(`${item.cantidad} ${item.nombre_producto}`);
    L.push(filaMontoDerecha(`  @ L${Number(item.precio_unitario).toFixed(2)}`, item.monto, ancho));
  }
  L.push(linea('-', ancho));

  L.push(filaMontoDerecha('Exento', venta.subtotal_exento, ancho));
  L.push(filaMontoDerecha('Exonerado', venta.subtotal_exonerado, ancho));
  L.push(filaMontoDerecha('Gravado 15%', venta.subtotal_gravado_15, ancho));
  L.push(filaMontoDerecha('ISV', venta.isv_total, ancho));
  L.push(filaMontoDerecha('Descuento', venta.descuento, ancho));
  L.push(linea('=', ancho));
  L.push(filaMontoDerecha('TOTAL', venta.total, ancho));
  L.push(linea('=', ancho));

  if (venta.efectivo_recibido != null) {
    L.push(filaMontoDerecha('Efectivo', venta.efectivo_recibido, ancho));
    L.push(filaMontoDerecha('Cambio', venta.cambio, ancho));
  }
  L.push('');
  L.push(centrar('Gracias por su compra', ancho));

  return L.join('\n');
}

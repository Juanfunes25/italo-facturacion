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

function escaparHtml(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Página mínima para abrir el ticket en el navegador y mandarlo a imprimir
// tal cual a la térmica (Ctrl+P / el botón imprime solo). El ancho en
// caracteres define el tamaño de fuente para que la línea no se corte en
// 40 u 48 columnas sin importar el zoom del navegador.
export function envolverTicketHtml(textoTicket, ancho) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Ticket</title>
<style>
  @page { margin: 2mm; }
  body { margin: 0; background: #fff; }
  pre {
    font-family: 'Courier New', monospace;
    font-size: ${ancho === 48 ? '11px' : '13px'};
    line-height: 1.25;
    white-space: pre-wrap;
    width: ${ancho}ch;
    margin: 4px auto;
    color: #000;
  }
  .imprimir {
    display: block;
    width: ${ancho}ch;
    margin: 8px auto;
    font-family: sans-serif;
    font-size: 13px;
    padding: 6px;
  }
  @media print {
    .imprimir { display: none; }
  }
</style>
</head>
<body>
<button class="imprimir" onclick="window.print()">Imprimir</button>
<pre>${escaparHtml(textoTicket)}</pre>
</body>
</html>`;
}

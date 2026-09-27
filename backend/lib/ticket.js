// Ticket para impresoras térmicas. Ancho en caracteres según el papel:
//   48 col → 80 mm (Epson TM-T20, Xprinter/3nStar de 80 mm, fuente A)
//   32 col → 58 mm (impresoras térmicas pequeñas/portátiles)
export const ANCHOS_TICKET = { 48: '80mm', 40: '76mm', 32: '58mm' };

export function anchoValido(columnas) {
  const n = Number(columnas);
  return ANCHOS_TICKET[n] ? n : 48;
}

function centrar(texto, ancho) {
  const recortado = texto.slice(0, ancho);
  const espacio = Math.max(0, ancho - recortado.length);
  const izq = Math.floor(espacio / 2);
  return ' '.repeat(izq) + recortado + ' '.repeat(espacio - izq);
}

function linea(caracter, ancho) {
  return caracter.repeat(ancho);
}

function filaMontoDerecha(etiqueta, monto, ancho) {
  const montoTexto = `L ${Number(monto).toFixed(2)}`;
  const espacio = Math.max(1, ancho - etiqueta.length - montoTexto.length);
  return etiqueta + ' '.repeat(espacio) + montoTexto;
}

// Parte un texto largo en renglones del ancho del papel, sin cortar
// palabras — salvo las que por sí solas no caben (ej. el CAI, que no tiene
// espacios y en papel de 58 mm es más ancho que el rollo).
function ajustar(texto, ancho) {
  const palabras = String(texto)
    .split(/\s+/)
    .flatMap((p) => (p.length > ancho ? p.match(new RegExp(`.{1,${ancho}}`, 'g')) : [p]));
  const renglones = [];
  let actual = '';
  for (const p of palabras) {
    if ((actual + ' ' + p).trim().length > ancho) {
      if (actual) renglones.push(actual);
      actual = p;
    } else {
      actual = (actual + ' ' + p).trim();
    }
  }
  if (actual) renglones.push(actual);
  return renglones;
}

export function etiquetaDescuento(venta) {
  const pct = Number(venta.descuento_porcentaje ?? 0);
  if (pct === 25) return 'Desc. 25% 3ra edad';
  if (pct > 0) return `Descuento ${pct}%`;
  return 'Descuento';
}

export function formatearTicket(venta, ancho = 48) {
  const L = [];
  L.push(centrar('INVERSIONES MILANO S DE R.L.', ancho));
  L.push(centrar('ITALO GELATERIA', ancho));
  for (const r of ajustar(venta.sucursales?.nombre ?? '', ancho)) L.push(centrar(r, ancho));
  L.push(linea('-', ancho));

  const puntoEmision = venta.puntos_emision;
  if (puntoEmision?.es_borrador) {
    L.push(centrar('*** SIN VALIDEZ FISCAL ***', ancho));
    L.push(centrar('(CAI pendiente)', ancho));
  } else {
    for (const r of ajustar(`CAI: ${puntoEmision?.cai ?? ''}`, ancho)) L.push(r);
  }
  L.push(`Factura: ${venta.numero_factura ?? ''}`);
  L.push(`Fecha: ${new Date(venta.fecha_emision).toLocaleString('es-HN', { timeZone: 'America/Tegucigalpa' })}`);
  if (puntoEmision?.fecha_limite_emision) {
    L.push(`Fecha limite emision: ${puntoEmision.fecha_limite_emision}`);
  }
  L.push(linea('-', ancho));

  for (const r of ajustar(`Cliente: ${venta.clientes?.nombre || 'Consumidor Final'}`, ancho)) L.push(r);
  if (venta.clientes?.rtn) L.push(`RTN: ${venta.clientes.rtn}`);
  L.push(`Cajero: ${venta.perfiles?.nombre ?? ''}`);
  L.push(linea('-', ancho));

  for (const item of venta.detalle ?? []) {
    for (const r of ajustar(`${Number(item.cantidad)} ${item.nombre_producto}`, ancho)) L.push(r);
    const bruto = Number(item.cantidad) * Number(item.precio_unitario);
    L.push(filaMontoDerecha(`  @ L${Number(item.precio_unitario).toFixed(2)}`, bruto, ancho));
  }
  L.push(linea('-', ancho));

  if (Number(venta.descuento) > 0) L.push(filaMontoDerecha(etiquetaDescuento(venta), -Number(venta.descuento), ancho));
  L.push(filaMontoDerecha('Exento', venta.subtotal_exento, ancho));
  L.push(filaMontoDerecha('Exonerado', venta.subtotal_exonerado, ancho));
  L.push(filaMontoDerecha('Gravado 15%', venta.subtotal_gravado_15, ancho));
  L.push(filaMontoDerecha('ISV 15%', venta.isv_total, ancho));
  L.push(linea('=', ancho));
  L.push(filaMontoDerecha('TOTAL', venta.total, ancho));
  L.push(linea('=', ancho));

  if (venta.efectivo_recibido != null) {
    L.push(filaMontoDerecha('Recibido', venta.efectivo_recibido, ancho));
    L.push(filaMontoDerecha('Cambio', venta.cambio, ancho));
  }
  L.push('');
  L.push(centrar('Gracias por su compra', ancho));
  L.push('');

  return L.join('\n');
}

export function formatearTicketPrueba(ancho, sucursal) {
  const L = [];
  L.push(centrar('ITALO GELATERIA', ancho));
  L.push(centrar('PRUEBA DE IMPRESORA', ancho));
  L.push(linea('-', ancho));
  if (sucursal) for (const r of ajustar(sucursal, ancho)) L.push(centrar(r, ancho));
  L.push(`Papel: ${ANCHOS_TICKET[ancho]} (${ancho} columnas)`);
  L.push(`Fecha: ${new Date().toLocaleString('es-HN', { timeZone: 'America/Tegucigalpa' })}`);
  L.push(linea('-', ancho));
  L.push('0123456789'.repeat(Math.ceil(ancho / 10)).slice(0, ancho));
  L.push(filaMontoDerecha('Si esta linea cabe completa', 123.45, ancho));
  L.push(linea('=', ancho));
  L.push(centrar('Si ve todo derecho y sin cortes,', ancho));
  L.push(centrar('la impresora quedo bien configurada.', ancho));
  L.push('');
  return L.join('\n');
}

function escaparHtml(texto) {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Área realmente imprimible de cada papel (el cabezal no llega al borde):
// 80 mm → 72 mm, 58 mm → 48 mm.
const IMPRIMIBLE_MM = { '80mm': 72, '76mm': 68, '58mm': 48 };

// Página del ticket. Siempre UNA copia. @page fija el ancho real del papel
// térmico para que el navegador no agregue márgenes ni escale la hoja, y el
// tamaño de letra se calcula para que las N columnas llenen exactamente el
// área imprimible (Courier: cada carácter mide 0.6 del tamaño de fuente).
export function envolverTicketHtml(textoTicket, ancho) {
  const papel = ANCHOS_TICKET[ancho] ?? '80mm';
  const imprimible = IMPRIMIBLE_MM[papel];
  const fuenteMm = (imprimible / (ancho * 0.6)).toFixed(2);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Ticket</title>
<style>
  @page { size: ${papel} auto; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  pre {
    font-family: 'Courier New', Courier, monospace;
    font-size: ${fuenteMm}mm;
    line-height: 1.2;
    white-space: pre;
    width: ${imprimible}mm;
    margin: 0 auto;
    padding: 2mm 0 8mm;
    color: #000;
    overflow: hidden;
  }
</style>
</head>
<body>
<pre>${escaparHtml(textoTicket)}</pre>
</body>
</html>`;
}

import PDFDocument from 'pdfkit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PassThrough } from 'node:stream';
import { EMPRESA, MARCA } from './empresa.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FUENTES = path.join(__dirname, '..', 'assets', 'fonts');
const DIAS_VALIDEZ = 15;

function money(n) {
  return `L ${Number(n ?? 0).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// "15:30:00" → "3:30 p. m."
function horaCorta(h) {
  if (!h) return '';
  const [hh, mm] = String(h).split(':').map(Number);
  const sufijo = hh >= 12 ? 'p. m.' : 'a. m.';
  return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${sufijo}`;
}

function fechaLarga(fecha) {
  if (!fecha) return 'Por confirmar';
  const d = typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? new Date(`${fecha}T12:00:00Z`) : new Date(fecha);
  return d.toLocaleDateString('es-HN', { timeZone: 'America/Tegucigalpa', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function fechaCorta(fecha) {
  return new Date(fecha).toLocaleDateString('es-HN', { timeZone: 'America/Tegucigalpa', day: 'numeric', month: 'long', year: 'numeric' });
}

function capitalizar(t) {
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
}

// Isotipo oficial Ítalo (BrandBook pág. 5): anillo + barra.
function isotipo(doc, x, y, tam, color) {
  const r = tam * 0.36;
  const grosor = tam * 0.13;
  const cx = x + tam / 2;
  const cy = y + tam * 0.43;
  doc.save();
  doc.lineWidth(grosor).strokeColor(color).circle(cx, cy, r - grosor / 2).stroke();
  doc.roundedRect(cx - tam * 0.3, cy + r + tam * 0.1, tam * 0.6, grosor, grosor * 0.2).fill(color);
  doc.restore();
}

// Wordmark "ITALO / GELATERIA" con la barra verde bajo la O, como en la
// señalética de las sucursales.
function wordmark(doc, x, y, tamano) {
  doc.font('PoppinsExtraBold').fontSize(tamano).fillColor(MARCA.blanco);
  const ital = 'ITAL';
  doc.text(ital, x, y, { lineBreak: false, characterSpacing: 0.5 });
  const anchoItal = doc.widthOfString(ital, { characterSpacing: 0.5 });
  doc.text('O', x + anchoItal, y, { lineBreak: false });
  const anchoO = doc.widthOfString('O');
  doc.roundedRect(x + anchoItal + anchoO * 0.14, y + tamano * 1.1, anchoO * 0.72, tamano * 0.08, 1.5).fill(MARCA.verde);
  doc
    .font('PoppinsSemiBold')
    .fontSize(tamano * 0.42)
    .fillColor(MARCA.verde)
    .text('GELATERIA', x + 1, y + tamano * 1.3, { characterSpacing: tamano * 0.07, lineBreak: false });
}

function etiqueta(doc, texto, x, y, color = MARCA.verdeProfundo) {
  doc.font('PoppinsSemiBold').fontSize(7.5).fillColor(color).text(texto.toUpperCase(), x, y, { characterSpacing: 1.6, lineBreak: false });
}

// Cotización de un evento (boda, cumpleaños, corporativo): copitas de
// gelato + servicio. Documento para el cliente con la identidad Ítalo del
// BrandBook: negro que predomina, verde que decora, crema de fondo.
export function generarPdfCotizacion(cotizacion, res) {
  const doc = new PDFDocument({
    size: 'LETTER',
    margin: 0,
    info: { Title: `Cotización ${cotizacion.nombre_evento ?? ''} — Ítalo Gelateria`, Author: EMPRESA.razonSocial },
  });
  doc.registerFont('Poppins', path.join(FUENTES, 'Poppins-Regular.ttf'));
  doc.registerFont('PoppinsMedium', path.join(FUENTES, 'Poppins-Medium.ttf'));
  doc.registerFont('PoppinsSemiBold', path.join(FUENTES, 'Poppins-SemiBold.ttf'));
  doc.registerFont('PoppinsBold', path.join(FUENTES, 'Poppins-Bold.ttf'));
  doc.registerFont('PoppinsExtraBold', path.join(FUENTES, 'Poppins-ExtraBold.ttf'));
  doc.pipe(res);

  const W = doc.page.width;
  const H = doc.page.height;
  const M = 48;
  const ancho = W - M * 2;
  const ALTO_PIE = 92;

  const emitida = cotizacion.created_at ? new Date(cotizacion.created_at) : new Date();
  const vence = new Date(emitida.getTime() + DIAS_VALIDEZ * 86400000);
  const numero = `No. ${String(cotizacion.numero ?? '').padStart(4, '0')}`;

  // ── Encabezado negro con isotipo + wordmark ──────────────────────────
  doc.rect(0, 0, W, 132).fill(MARCA.negro);
  // Arco decorativo (eco del anillo del isotipo) saliendo del borde.
  doc.save();
  doc.lineWidth(26).strokeOpacity(0.16).strokeColor(MARCA.verde).circle(W - 30, -20, 120).stroke();
  doc.restore();
  isotipo(doc, M, 30, 64, MARCA.verde);
  wordmark(doc, M + 78, 32, 30);

  doc.font('PoppinsSemiBold').fontSize(9).fillColor(MARCA.verde);
  doc.text('COTIZACIÓN DE EVENTO', W - M - 220, 36, { width: 220, align: 'right', characterSpacing: 1.8 });
  doc.font('PoppinsBold').fontSize(20).fillColor(MARCA.blanco).text(numero, W - M - 220, 50, { width: 220, align: 'right' });
  doc.font('Poppins').fontSize(8.5).fillColor('#B9B8AC');
  doc.text(`Emitida: ${fechaCorta(emitida)}`, W - M - 220, 82, { width: 220, align: 'right' });
  doc.text(`Válida hasta: ${fechaCorta(vence)}`, W - M - 220, 95, { width: 220, align: 'right' });
  doc.rect(0, 132, W, 5).fill(MARCA.verde);

  // Fondo crema del cuerpo
  doc.rect(0, 137, W, H - 137 - ALTO_PIE).fill(MARCA.crema);

  // ── Saludo ────────────────────────────────────────────────────────────
  let y = 158;
  const nombreCliente = cotizacion.nombre_cliente || 'Cliente';
  doc.font('PoppinsBold').fontSize(17).fillColor(MARCA.carbon).text(`Hola, ${nombreCliente.split(' ')[0]}`, M, y);
  y = doc.y + 2;
  doc
    .font('Poppins')
    .fontSize(9.5)
    .fillColor(MARCA.gris)
    .text(
      'Gracias por pensar en Ítalo para tu evento. Esta es nuestra propuesta de gelato artesanal, preparado en nuestra planta de San Pedro Sula y servido fresco para tus invitados.',
      M,
      y,
      { width: ancho * 0.8, lineGap: 1.5 }
    );
  y = doc.y + 16;

  // ── Tarjetas Cliente / Evento ────────────────────────────────────────
  const gap = 14;
  const anchoTarjeta = (ancho - gap) / 2;
  const altoTarjeta = 96;
  const tarjeta = (x, titulo, principal, lineas) => {
    doc.roundedRect(x, y, anchoTarjeta, altoTarjeta, 10).fill(MARCA.blanco);
    doc.rect(x, y + 14, 3, altoTarjeta - 28).fill(MARCA.verdeProfundo);
    etiqueta(doc, titulo, x + 16, y + 12);
    doc
      .font('PoppinsSemiBold')
      .fontSize(12)
      .fillColor(MARCA.carbon)
      .text(principal, x + 16, y + 26, { width: anchoTarjeta - 30, height: 18, ellipsis: true });
    let yl = y + 47;
    doc.font('Poppins').fontSize(8.8).fillColor(MARCA.gris);
    for (const l of lineas.filter(Boolean).slice(0, 3)) {
      doc.text(l, x + 16, yl, { width: anchoTarjeta - 30, height: 13, ellipsis: true });
      yl += 13.5;
    }
  };
  tarjeta(M, 'Preparada para', nombreCliente, [
    cotizacion.telefono_cliente && `Tel. ${cotizacion.telefono_cliente}`,
    cotizacion.email_cliente,
    cotizacion.rtn_cliente && `RTN ${cotizacion.rtn_cliente}`,
  ]);
  tarjeta(M + anchoTarjeta + gap, 'Tu evento', cotizacion.nombre_evento || 'Evento', [
    [capitalizar(fechaLarga(cotizacion.fecha_evento)), horaCorta(cotizacion.hora_evento)].filter(Boolean).join(' · '),
    cotizacion.lugar,
    `${Number(cotizacion.cantidad_copitas || 0).toLocaleString('es-HN')} copitas de gelato`,
  ]);
  y += altoTarjeta + 22;

  // ── Tabla ─────────────────────────────────────────────────────────────
  const cCant = M + ancho * 0.56;
  const cPrecio = M + ancho * 0.68;
  const cTotal = M + ancho * 0.82;
  const wNum = ancho * 0.12;
  const wTot = ancho * 0.18;

  doc.roundedRect(M, y, ancho, 26, 7).fill(MARCA.verdeProfundo);
  doc.font('PoppinsSemiBold').fontSize(8).fillColor(MARCA.blanco);
  doc.text('DESCRIPCIÓN', M + 14, y + 9, { characterSpacing: 1 });
  doc.text('CANT.', cCant, y + 9, { width: wNum, align: 'right', characterSpacing: 1 });
  doc.text('PRECIO', cPrecio, y + 9, { width: wNum + 4, align: 'right', characterSpacing: 1 });
  doc.text('TOTAL', cTotal, y + 9, { width: wTot - 14, align: 'right', characterSpacing: 1 });
  y += 26;

  const totalCopitas = Number(cotizacion.cantidad_copitas || 0) * Number(cotizacion.precio_copita || 0);
  const filas = [
    {
      titulo: 'Copitas de gelato artesanal',
      detalle: 'Sabores de nuestra vitrina a elección, porción individual en copita.',
      cantidad: Number(cotizacion.cantidad_copitas || 0).toLocaleString('es-HN'),
      precio: money(cotizacion.precio_copita),
      total: totalCopitas,
    },
  ];
  if (Number(cotizacion.costo_servicio) > 0) {
    filas.push({
      titulo: 'Servicio para el evento',
      detalle: 'Montaje, atención a los invitados y desmontaje por nuestro equipo.',
      cantidad: '1',
      precio: money(cotizacion.costo_servicio),
      total: Number(cotizacion.costo_servicio),
    });
  }

  filas.forEach((f, i) => {
    const alto = 44;
    doc.rect(M, y, ancho, alto).fill(i % 2 === 0 ? MARCA.blanco : '#FAF8F2');
    doc.font('PoppinsSemiBold').fontSize(10).fillColor(MARCA.carbon).text(f.titulo, M + 14, y + 8, { width: ancho * 0.52 });
    doc
      .font('Poppins')
      .fontSize(8)
      .fillColor(MARCA.gris)
      .text(f.detalle, M + 14, y + 23, { width: ancho * 0.52, height: 14, ellipsis: true });
    doc.font('PoppinsMedium').fontSize(10).fillColor(MARCA.carbon);
    doc.text(f.cantidad, cCant, y + 15, { width: wNum, align: 'right' });
    doc.text(f.precio, cPrecio, y + 15, { width: wNum + 4, align: 'right' });
    doc.font('PoppinsSemiBold').text(money(f.total), cTotal, y + 15, { width: wTot - 14, align: 'right' });
    y += alto;
  });
  doc.moveTo(M, y).lineTo(M + ancho, y).lineWidth(1.2).strokeColor(MARCA.verde).stroke();
  y += 16;

  // ── Condiciones (izquierda) + Totales (derecha) ──────────────────────
  const anchoTotales = 214;
  const xTot = M + ancho - anchoTotales;
  const subtotal = totalCopitas + Number(cotizacion.costo_servicio || 0);
  let yT = y;
  const filaTotal = (etq, valor, color = MARCA.carbon) => {
    doc.font('Poppins').fontSize(9.5).fillColor(MARCA.gris).text(etq, xTot, yT, { width: 110 });
    doc.font('PoppinsMedium').fillColor(color).text(valor, xTot + 100, yT, { width: anchoTotales - 100, align: 'right' });
    yT += 17;
  };
  filaTotal('Subtotal', money(subtotal));
  if (Number(cotizacion.descuento) > 0) filaTotal('Descuento', `− ${money(cotizacion.descuento)}`, MARCA.verdeProfundo);
  yT += 4;
  doc.roundedRect(xTot, yT, anchoTotales, 50, 10).fill(MARCA.negro);
  doc.font('PoppinsSemiBold').fontSize(8).fillColor(MARCA.verde).text('TOTAL DEL EVENTO', xTot + 16, yT + 10, { characterSpacing: 1.4 });
  doc
    .font('PoppinsBold')
    .fontSize(19)
    .fillColor(MARCA.blanco)
    .text(money(cotizacion.total), xTot + 16, yT + 21, { width: anchoTotales - 32, align: 'right' });
  doc.font('Poppins').fontSize(7.5).fillColor(MARCA.gris).text('ISV incluido', xTot, yT + 55, { width: anchoTotales, align: 'right' });
  const porCopita = Number(cotizacion.cantidad_copitas) > 0 ? Number(cotizacion.total) / Number(cotizacion.cantidad_copitas) : 0;
  if (porCopita > 0) {
    doc.text(`Equivale a ${money(porCopita)} por copita`, xTot, yT + 66, { width: anchoTotales, align: 'right' });
  }
  let finTotales = yT + 82;
  const anticipo = Number(cotizacion.anticipo || 0);
  if (anticipo > 0) {
    doc.font('PoppinsMedium').fontSize(8.5).fillColor(MARCA.verdeProfundo);
    doc.text(`Anticipo recibido: ${money(anticipo)}`, xTot, finTotales - 2, { width: anchoTotales, align: 'right' });
    doc.font('PoppinsSemiBold').fillColor(MARCA.carbon);
    doc.text(`Saldo pendiente: ${money(Math.max(0, Number(cotizacion.total) - anticipo))}`, xTot, finTotales + 10, {
      width: anchoTotales,
      align: 'right',
    });
    finTotales += 26;
  }

  const anchoCond = ancho - anchoTotales - 28;
  etiqueta(doc, 'Condiciones', M, y);
  let yc = y + 16;
  for (const c of EMPRESA.condicionesEventos) {
    doc.circle(M + 4, yc + 5.5, 3.2).fill(MARCA.verdeProfundo);
    doc.font('Poppins').fontSize(8.6).fillColor(MARCA.carbon).text(c, M + 14, yc, { width: anchoCond - 14, lineGap: 1 });
    yc = doc.y + 5;
  }
  y = Math.max(finTotales, yc) + 10;

  // ── Notas ─────────────────────────────────────────────────────────────
  if (cotizacion.notas) {
    doc.font('Poppins').fontSize(9);
    const altoNotas = Math.min(90, doc.heightOfString(cotizacion.notas, { width: ancho - 32 }) + 34);
    doc.roundedRect(M, y, ancho, altoNotas, 10).fill(MARCA.verdeClaro);
    etiqueta(doc, 'Notas', M + 16, y + 11, MARCA.verdeOscuro);
    doc
      .font('Poppins')
      .fontSize(9)
      .fillColor(MARCA.verdeOscuro)
      .text(cotizacion.notas, M + 16, y + 25, { width: ancho - 32, height: altoNotas - 30, ellipsis: true });
    y += altoNotas + 14;
  }

  // ── Aceptación ────────────────────────────────────────────────────────
  const yFirma = Math.max(y + 8, H - ALTO_PIE - 62);
  if (yFirma + 42 < H - ALTO_PIE) {
    const anchoFirma = (ancho - 40) / 2;
    doc.moveTo(M, yFirma + 26).lineTo(M + anchoFirma, yFirma + 26).lineWidth(0.8).strokeColor('#BDB8A6').stroke();
    doc.moveTo(M + anchoFirma + 40, yFirma + 26).lineTo(M + ancho, yFirma + 26).stroke();
    doc.font('Poppins').fontSize(7.8).fillColor(MARCA.gris);
    doc.text('Aceptación del cliente (firma y fecha)', M, yFirma + 31, { width: anchoFirma });
    doc.text(`Atendido por: ${cotizacion.perfiles?.nombre ?? 'Equipo Ítalo'}`, M + anchoFirma + 40, yFirma + 31, { width: anchoFirma });
  }

  // ── Pie negro con contacto ───────────────────────────────────────────
  const yPie = H - ALTO_PIE;
  doc.rect(0, yPie, W, ALTO_PIE).fill(MARCA.negro);
  doc.rect(0, yPie, W, 3).fill(MARCA.verde);
  isotipo(doc, M, yPie + 18, 36, MARCA.verde);
  doc.font('PoppinsBold').fontSize(11).fillColor(MARCA.blanco).text('Reserva tu fecha', M + 48, yPie + 21);
  doc.font('Poppins').fontSize(8.5).fillColor('#CFCDBF').text('Escríbenos o llámanos, con gusto te ayudamos.', M + 48, yPie + 37);

  doc.font('PoppinsSemiBold').fontSize(9.5).fillColor(MARCA.verde);
  doc.text(`Tel. / WhatsApp  ${EMPRESA.telefono}`, M + 250, yPie + 20, { width: ancho - 250, align: 'right' });
  doc.text(`Instagram  ${EMPRESA.instagram}`, M + 250, yPie + 35, { width: ancho - 250, align: 'right' });
  doc.font('Poppins').fontSize(7.6).fillColor('#A9A796');
  doc.text(`${EMPRESA.sucursales.map((s) => s.nombre).join('  ·  ')}  —  ${EMPRESA.ciudad}`, M, yPie + 61, {
    width: ancho,
    align: 'center',
  });
  doc.text(EMPRESA.razonSocial, M, yPie + 73, { width: ancho, align: 'center' });

  doc.end();
}

// Igual que generarPdfCotizacion pero devuelve el PDF como Buffer en
// memoria, para poder adjuntarlo a un correo en vez de escribirlo directo
// a una respuesta HTTP.
export function generarPdfCotizacionBuffer(cotizacion) {
  return new Promise((resolve, reject) => {
    const stream = new PassThrough();
    const partes = [];
    stream.on('data', (chunk) => partes.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(partes)));
    stream.on('error', reject);
    generarPdfCotizacion(cotizacion, stream);
  });
}

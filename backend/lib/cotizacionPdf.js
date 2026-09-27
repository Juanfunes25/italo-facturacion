import PDFDocument from 'pdfkit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FUENTES = path.join(__dirname, '..', 'assets', 'fonts');

const TERRACOTA = '#C5603C';
const GOLD = '#B08D28';
const CARBON = '#2B2420';
const GRIS = '#7A7168';
const CREMA = '#FBF8F3';

function money(n) {
  return `L ${Number(n).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fechaLarga(iso) {
  if (!iso) return 'A confirmar';
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-HN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Cotización de un evento (boda, cumpleaños, corporativo): cantidad de
// copitas de gelato + costo de servicio — el modelo de cobro real del
// negocio para catering de eventos. Pensada para descargar y enviar tal
// cual al cliente por correo o WhatsApp.
export function generarPdfCotizacion(cotizacion, res) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 0 });
  doc.registerFont('Titulo', path.join(FUENTES, 'BarlowCondensed-Bold.ttf'));
  doc.registerFont('Texto', path.join(FUENTES, 'Inter-Regular.ttf'));
  doc.registerFont('TextoSemibold', path.join(FUENTES, 'Inter-SemiBold.ttf'));
  doc.pipe(res);

  const anchoPagina = doc.page.width;
  const margen = 56;
  const anchoContenido = anchoPagina - margen * 2;

  // ── Banda superior ────────────────────────────────────────────────────
  doc.rect(0, 0, anchoPagina, 118).fill(TERRACOTA);
  doc.fillColor('#FFFFFF').font('Titulo').fontSize(36).text('ITALO GELATERIA', margen, 34, { characterSpacing: 1 });
  doc.font('Texto').fontSize(11).fillColor('#FBEFE7').text('Gelato artesanal para eventos', margen, 76);
  doc.rect(0, 118, anchoPagina, 4).fill(GOLD);

  // ── Encabezado del documento ─────────────────────────────────────────
  let y = 150;
  doc.fillColor(GRIS).font('TextoSemibold').fontSize(9).text('COTIZACIÓN DE EVENTO', margen, y, { characterSpacing: 1.5 });
  doc
    .fillColor(CARBON)
    .font('TextoSemibold')
    .fontSize(11)
    .text(`No. ${String(cotizacion.numero).padStart(4, '0')}`, margen, y + 14);
  doc
    .fillColor(GRIS)
    .font('Texto')
    .fontSize(10)
    .text(`Emitida el ${fechaLarga(cotizacion.created_at?.slice(0, 10))}`, margen, y + 30);

  // ── Cliente / Evento (dos columnas) ──────────────────────────────────
  y += 62;
  const colAncho = anchoContenido / 2 - 12;

  doc.font('TextoSemibold').fontSize(9).fillColor(TERRACOTA).text('CLIENTE', margen, y, { characterSpacing: 1 });
  doc
    .font('TextoSemibold')
    .fontSize(13)
    .fillColor(CARBON)
    .text(cotizacion.nombre_cliente, margen, y + 14, { width: colAncho });
  let yCliente = doc.y + 2;
  doc.font('Texto').fontSize(10).fillColor(GRIS);
  if (cotizacion.telefono_cliente) {
    doc.text(cotizacion.telefono_cliente, margen, yCliente, { width: colAncho });
    yCliente = doc.y + 2;
  }
  if (cotizacion.email_cliente) {
    doc.text(cotizacion.email_cliente, margen, yCliente, { width: colAncho });
  }

  const colDerecha = margen + colAncho + 24;
  doc.font('TextoSemibold').fontSize(9).fillColor(TERRACOTA).text('EVENTO', colDerecha, y, { characterSpacing: 1 });
  doc
    .font('TextoSemibold')
    .fontSize(13)
    .fillColor(CARBON)
    .text(cotizacion.nombre_evento, colDerecha, y + 14, { width: colAncho });
  let yEvento = doc.y + 2;
  doc.font('Texto').fontSize(10).fillColor(GRIS);
  doc.text(fechaLarga(cotizacion.fecha_evento), colDerecha, yEvento, { width: colAncho });
  yEvento = doc.y + 2;
  if (cotizacion.lugar) {
    doc.text(cotizacion.lugar, colDerecha, yEvento, { width: colAncho });
  }

  // ── Tabla de precios ──────────────────────────────────────────────────
  y = Math.max(yCliente, doc.y) + 34;
  const colConcepto = margen;
  const colCantidad = margen + anchoContenido * 0.5;
  const colPrecio = margen + anchoContenido * 0.68;
  const colTotal = margen + anchoContenido * 0.84;

  doc.font('TextoSemibold').fontSize(9).fillColor(GRIS);
  doc.text('CONCEPTO', colConcepto, y, { characterSpacing: 0.5 });
  doc.text('CANT.', colCantidad, y, { width: anchoContenido * 0.16, align: 'right', characterSpacing: 0.5 });
  doc.text('PRECIO', colPrecio, y, { width: anchoContenido * 0.14, align: 'right', characterSpacing: 0.5 });
  doc.text('TOTAL', colTotal, y, { width: anchoContenido * 0.16, align: 'right', characterSpacing: 0.5 });
  y += 16;
  doc.moveTo(margen, y).lineTo(margen + anchoContenido, y).lineWidth(1).strokeColor(GOLD).stroke();
  y += 12;

  const totalCopitas = Number(cotizacion.cantidad_copitas) * Number(cotizacion.precio_copita);
  const filas = [
    { concepto: 'Copitas de gelato artesanal', cantidad: cotizacion.cantidad_copitas, precio: cotizacion.precio_copita, total: totalCopitas },
    { concepto: 'Costo de servicio', cantidad: 1, precio: cotizacion.costo_servicio, total: cotizacion.costo_servicio },
  ];
  if (Number(cotizacion.descuento) > 0) {
    filas.push({ concepto: 'Descuento', cantidad: '', precio: '', total: -Number(cotizacion.descuento) });
  }

  doc.font('Texto').fontSize(10.5).fillColor(CARBON);
  for (const fila of filas) {
    doc.text(fila.concepto, colConcepto, y, { width: anchoContenido * 0.48 });
    doc.text(String(fila.cantidad), colCantidad, y, { width: anchoContenido * 0.16, align: 'right' });
    doc.text(fila.precio === '' ? '' : money(fila.precio), colPrecio, y, { width: anchoContenido * 0.14, align: 'right' });
    doc.text(money(fila.total), colTotal, y, { width: anchoContenido * 0.16, align: 'right' });
    y += 22;
  }

  y += 6;
  doc.moveTo(margen, y).lineTo(margen + anchoContenido, y).lineWidth(0.5).strokeColor('#E4DCD0').stroke();
  y += 18;

  // ── Total destacado ───────────────────────────────────────────────────
  const cajaTotalAncho = 210;
  doc.rect(margen + anchoContenido - cajaTotalAncho, y, cajaTotalAncho, 44, TERRACOTA).fill(TERRACOTA);
  doc
    .fillColor('#FBEFE7')
    .font('TextoSemibold')
    .fontSize(9)
    .text('TOTAL', margen + anchoContenido - cajaTotalAncho + 18, y + 10, { characterSpacing: 1 });
  doc
    .fillColor('#FFFFFF')
    .font('Titulo')
    .fontSize(22)
    .text(money(cotizacion.total), margen + anchoContenido - cajaTotalAncho, y + 8, {
      width: cajaTotalAncho - 18,
      align: 'right',
    });

  y += 70;

  // ── Notas ──────────────────────────────────────────────────────────────
  if (cotizacion.notas) {
    doc.font('TextoSemibold').fontSize(9).fillColor(GRIS).text('NOTAS', margen, y, { characterSpacing: 1 });
    y += 14;
    doc.font('Texto').fontSize(10).fillColor(CARBON).text(cotizacion.notas, margen, y, { width: anchoContenido });
    y = doc.y + 20;
  }

  // ── Pie de página ────────────────────────────────────────────────────
  const piePagina = doc.page.height - 90;
  doc.moveTo(margen, piePagina).lineTo(margen + anchoContenido, piePagina).lineWidth(1).strokeColor(GOLD).stroke();
  doc
    .font('Texto')
    .fontSize(9)
    .fillColor(GRIS)
    .text('Esta cotización es válida por 15 días a partir de la fecha de emisión.', margen, piePagina + 12, {
      width: anchoContenido,
      align: 'center',
    });
  doc
    .font('TextoSemibold')
    .fontSize(10)
    .fillColor(TERRACOTA)
    .text('Gracias por considerar Italo Gelateria para tu evento.', margen, piePagina + 28, {
      width: anchoContenido,
      align: 'center',
    });

  doc.end();
}

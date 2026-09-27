import PDFDocument from 'pdfkit';
import { PassThrough } from 'node:stream';

// Factura completa tamaño carta, para descargar o enviar por correo.
export function generarPdfFactura(venta, res) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
  doc.pipe(res);

  doc.fontSize(16).text('INVERSIONES MILANO S DE R.L.', { align: 'center' });
  doc.fontSize(12).text('Italo Gelateria', { align: 'center' });
  doc.fontSize(10).text(venta.sucursales?.nombre ?? '', { align: 'center' });
  doc.moveDown();

  const puntoEmision = venta.puntos_emision;
  if (puntoEmision?.es_borrador) {
    doc
      .fillColor('red')
      .fontSize(12)
      .text('DOCUMENTO SIN VALIDEZ FISCAL — CAI pendiente de confirmar con el SAR', { align: 'center' })
      .fillColor('black');
  } else {
    doc.fontSize(10).text(`CAI: ${puntoEmision?.cai ?? ''}`);
  }

  doc.fontSize(10);
  doc.text(`Factura No.: ${venta.numero_factura ?? ''}`);
  doc.text(`Fecha de emisión: ${new Date(venta.fecha_emision).toLocaleString('es-HN')}`);
  if (puntoEmision?.fecha_limite_emision) {
    doc.text(`Fecha límite de emisión del rango: ${puntoEmision.fecha_limite_emision}`);
  }
  doc.moveDown();

  doc.text(`Cliente: ${venta.clientes?.nombre ?? 'Consumidor Final'}`);
  doc.text(`RTN: ${venta.clientes?.rtn ?? 'N/A'}`);
  doc.text(`Cajero: ${venta.perfiles?.nombre ?? ''}`);
  doc.moveDown();

  const inicioTabla = doc.y;
  doc.font('Helvetica-Bold');
  doc.text('Producto', 50, inicioTabla, { width: 220 });
  doc.text('Cant.', 270, inicioTabla, { width: 50, align: 'right' });
  doc.text('Precio', 320, inicioTabla, { width: 80, align: 'right' });
  doc.text('Monto', 400, inicioTabla, { width: 100, align: 'right' });
  doc.font('Helvetica');
  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(500, doc.y).stroke();
  doc.moveDown(0.5);

  for (const item of venta.detalle ?? []) {
    const y = doc.y;
    doc.text(item.nombre_producto, 50, y, { width: 220 });
    doc.text(String(item.cantidad), 270, y, { width: 50, align: 'right' });
    doc.text(`L ${Number(item.precio_unitario).toFixed(2)}`, 320, y, { width: 80, align: 'right' });
    doc.text(`L ${Number(item.monto).toFixed(2)}`, 400, y, { width: 100, align: 'right' });
    doc.moveDown();
  }

  doc.moveTo(50, doc.y).lineTo(500, doc.y).stroke();
  doc.moveDown();

  const filaTotal = (etiqueta, monto) => {
    const y = doc.y;
    doc.text(etiqueta, 320, y, { width: 80, align: 'right' });
    doc.text(`L ${Number(monto).toFixed(2)}`, 400, y, { width: 100, align: 'right' });
    doc.moveDown();
  };

  filaTotal('Exento:', venta.subtotal_exento);
  filaTotal('Exonerado:', venta.subtotal_exonerado);
  filaTotal('Gravado 15%:', venta.subtotal_gravado_15);
  filaTotal('ISV:', venta.isv_total);
  filaTotal('Descuento:', venta.descuento);
  doc.font('Helvetica-Bold');
  filaTotal('TOTAL:', venta.total);
  doc.font('Helvetica');

  doc.end();
}

// Igual que generarPdfFactura pero devuelve el PDF como Buffer en memoria
// (para adjuntarlo a un correo) en vez de escribirlo directo a una
// respuesta HTTP.
export function generarPdfFacturaBuffer(venta) {
  return new Promise((resolve, reject) => {
    const stream = new PassThrough();
    const partes = [];
    stream.on('data', (chunk) => partes.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(partes)));
    stream.on('error', reject);
    generarPdfFactura(venta, stream);
  });
}

import nodemailer from 'nodemailer';

// Replica el "Resumen de Impuestos" que WizPOS manda solo tras cada cierre.
// No-op si no están configuradas las credenciales — no bloquea el cierre
// aunque falle o no esté configurado el correo.
function transportadorDisponible() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function crearTransportador() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
}

export async function enviarResumenCierre(cierre, sucursalNombre) {
  if (!transportadorDisponible()) return { enviado: false, motivo: 'GMAIL_USER/GMAIL_APP_PASSWORD no configurados' };

  const destinatario = process.env.RESUMEN_CIERRE_EMAIL || process.env.GMAIL_USER;
  const asunto = `Cierre de caja — ${sucursalNombre} — ${new Date(cierre.fecha_fin).toLocaleDateString('es-HN')}`;
  const cuerpo = `
    <h2>Cierre de caja — ${sucursalNombre}</h2>
    <p>Del ${new Date(cierre.fecha_inicio).toLocaleString('es-HN')} al ${new Date(cierre.fecha_fin).toLocaleString('es-HN')}</p>
    <table cellpadding="4" style="border-collapse:collapse">
      <tr><td>Facturas</td><td>${cierre.factura_desde ?? '—'} a ${cierre.factura_hasta ?? '—'}</td></tr>
      <tr><td>Total ventas</td><td>L ${Number(cierre.total_ventas ?? 0).toFixed(2)}</td></tr>
      <tr><td>Total esperado</td><td>L ${Number(cierre.total_esperado).toFixed(2)}</td></tr>
      <tr><td>Total contado</td><td>L ${Number(cierre.total_contado).toFixed(2)}</td></tr>
      <tr><td><strong>Diferencia</strong></td><td><strong>L ${Number(cierre.diferencia).toFixed(2)}</strong></td></tr>
    </table>
  `;

  try {
    await crearTransportador().sendMail({
      from: process.env.GMAIL_USER,
      to: destinatario,
      subject: asunto,
      html: cuerpo,
    });
    return { enviado: true };
  } catch (e) {
    return { enviado: false, motivo: e.message };
  }
}

// Manda la factura en PDF al correo del cliente apenas se cobra (si el
// cliente tiene correo registrado). Igual que el resumen de cierre: no-op
// si no hay credenciales, nunca bloquea el cobro.
export async function enviarFacturaCliente(venta, pdfBuffer) {
  if (!transportadorDisponible()) return { enviado: false, motivo: 'GMAIL_USER/GMAIL_APP_PASSWORD no configurados' };
  if (!venta.clientes?.email) return { enviado: false, motivo: 'El cliente no tiene correo registrado' };

  const esBorrador = venta.puntos_emision?.es_borrador;
  const asunto = `${esBorrador ? '[Documento interno] ' : ''}Factura ${venta.numero_factura} — Italo Gelateria`;
  const cuerpo = `
    <p>Hola ${venta.clientes?.nombre ?? ''},</p>
    <p>Gracias por tu compra en Italo Gelateria. Adjunto va tu factura ${venta.numero_factura}.</p>
    ${esBorrador ? '<p><strong>Nota:</strong> este documento es un comprobante interno, todavía sin validez fiscal.</p>' : ''}
    <p>Total: L ${Number(venta.total).toFixed(2)}</p>
  `;

  try {
    await crearTransportador().sendMail({
      from: process.env.GMAIL_USER,
      to: venta.clientes.email,
      subject: asunto,
      html: cuerpo,
      attachments: [{ filename: `factura-${venta.numero_factura}.pdf`, content: pdfBuffer }],
    });
    return { enviado: true };
  } catch (e) {
    return { enviado: false, motivo: e.message };
  }
}

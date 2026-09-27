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
  const L = (n) => `L ${Number(n ?? 0).toFixed(2)}`;
  const dif = (n) => {
    const d = Number(n ?? 0);
    const color = Math.abs(d) < 0.005 ? '#1a7a42' : '#b3261e';
    const texto = Math.abs(d) < 0.005 ? 'Cuadra' : d < 0 ? 'Faltante' : 'Sobrante';
    return `<strong style="color:${color}">${texto} ${L(Math.abs(d))}</strong>`;
  };
  const zona = { timeZone: 'America/Tegucigalpa' };
  const cuerpo = `
    <h2>Cierre de caja — ${sucursalNombre}</h2>
    <p>Del ${new Date(cierre.fecha_inicio).toLocaleString('es-HN', zona)} al ${new Date(cierre.fecha_fin).toLocaleString('es-HN', zona)}
       · Cajero: ${cierre.cajero?.nombre ?? ''}</p>
    <p>Facturas ${cierre.factura_desde ?? '—'} a ${cierre.factura_hasta ?? '—'} (${cierre.cantidad_facturas ?? 0}) · Total ventas ${L(cierre.total_ventas)}</p>
    <table cellpadding="6" style="border-collapse:collapse;border:1px solid #ddd">
      <tr style="background:#f4f4f4"><th align="left">Forma</th><th align="right">Sistema</th><th align="right">Reportado</th><th align="right">Diferencia</th></tr>
      <tr><td>Tarjeta (POS BAC ${L(cierre.pos_bac)} + Ficohsa ${L(cierre.pos_ficohsa)})</td>
          <td align="right">${L(cierre.tarjeta_sistema)}</td>
          <td align="right">${L(Number(cierre.pos_bac ?? 0) + Number(cierre.pos_ficohsa ?? 0))}</td>
          <td align="right">${dif(cierre.diferencia_tarjeta)}</td></tr>
      <tr><td>Efectivo (fondo ${L(cierre.fondo_caja)}, salidas ${L(cierre.salidas)})</td>
          <td align="right">${L(cierre.total_esperado)}</td>
          <td align="right">${L(cierre.efectivo_contado)}</td>
          <td align="right">${dif(cierre.diferencia_efectivo)}</td></tr>
      <tr><td>Transferencias</td><td align="right">${L(cierre.transferencia_sistema)}</td><td></td><td></td></tr>
      <tr style="background:#f4f4f4"><td><strong>Total</strong></td><td></td><td></td><td align="right">${dif(cierre.diferencia)}</td></tr>
    </table>
    ${cierre.observaciones ? `<p><strong>Observaciones:</strong> ${String(cierre.observaciones).replace(/</g, '&lt;')}</p>` : ''}
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

// Manda la cotización de evento en PDF al correo del cliente — a pedido
// (botón "Enviar por correo"), no automático como la factura.
export async function enviarCotizacionCliente(cotizacion, pdfBuffer, destinatario) {
  if (!transportadorDisponible()) return { enviado: false, motivo: 'GMAIL_USER/GMAIL_APP_PASSWORD no configurados' };
  if (!destinatario) return { enviado: false, motivo: 'El cliente no tiene correo registrado' };

  const asunto = `Cotización de evento — ${cotizacion.nombre_evento} — Italo Gelateria`;
  const cuerpo = `
    <p>Hola ${cotizacion.nombre_cliente ?? ''},</p>
    <p>Adjunto va la cotización para "${cotizacion.nombre_evento}". Cualquier duda, quedamos atentos.</p>
    <p>Total: L ${Number(cotizacion.total).toFixed(2)}</p>
  `;

  try {
    await crearTransportador().sendMail({
      from: process.env.GMAIL_USER,
      to: destinatario,
      subject: asunto,
      html: cuerpo,
      attachments: [{ filename: `cotizacion-evento-${cotizacion.numero}.pdf`, content: pdfBuffer }],
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

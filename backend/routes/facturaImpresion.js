import { Router } from 'express';
import { obtenerVentaCompleta } from './ventas.js';
import { formatearTicket, formatearTicketPrueba, envolverTicketHtml, anchoValido } from '../lib/ticket.js';
import { generarPdfFactura } from '../lib/pdf.js';
import { registrarAuditoria } from '../lib/auditoria.js';

export const facturaImpresion = Router();

// Ticket de prueba para configurar la impresora térmica en cada caja.
// (Va antes de "/:id/..." para que "prueba" no se tome como un id.)
facturaImpresion.get('/impresora/prueba', (req, res) => {
  const ancho = anchoValido(req.query.columnas);
  res.type('text/html').send(envolverTicketHtml(formatearTicketPrueba(ancho, req.query.sucursal ?? ''), ancho));
});

facturaImpresion.get('/:id/ticket', async (req, res) => {
  const venta = await obtenerVentaCompleta(req.params.id);
  if (!venta) return res.status(404).json({ error: 'Factura no encontrada' });
  if (venta.estado !== 'pagada') return res.status(409).json({ error: 'La orden todavía no tiene factura' });

  const ancho = anchoValido(req.query.columnas);
  const texto = formatearTicket(venta, ancho);

  await registrarAuditoria(req, {
    accion: req.query.motivo === 'reimpresion' ? 'venta.reimprimir_ticket' : 'venta.imprimir_ticket',
    entidad: 'venta',
    entidadId: venta.id,
    sucursalId: venta.sucursal_id,
    detalle: { numero_factura: venta.numero_factura, total: Number(venta.total) },
  });

  // ?formato=texto para integraciones/impresión directa por ESC-POS; por
  // default HTML listo para mandar a la térmica.
  if (req.query.formato === 'texto') return res.type('text/plain').send(texto);
  res.type('text/html').send(envolverTicketHtml(texto, ancho));
});

facturaImpresion.get('/:id/pdf', async (req, res) => {
  const venta = await obtenerVentaCompleta(req.params.id);
  if (!venta) return res.status(404).json({ error: 'Factura no encontrada' });
  if (venta.estado !== 'pagada') return res.status(409).json({ error: 'La orden todavía no tiene factura' });

  await registrarAuditoria(req, {
    accion: 'venta.ver_pdf',
    entidad: 'venta',
    entidadId: venta.id,
    sucursalId: venta.sucursal_id,
    detalle: { numero_factura: venta.numero_factura },
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="factura-${venta.numero_factura}.pdf"`);
  generarPdfFactura(venta, res);
});

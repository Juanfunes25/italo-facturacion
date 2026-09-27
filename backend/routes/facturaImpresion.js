import { Router } from 'express';
import { obtenerVentaCompleta } from './ventas.js';
import { formatearTicket, envolverTicketHtml } from '../lib/ticket.js';
import { generarPdfFactura } from '../lib/pdf.js';

export const facturaImpresion = Router();

facturaImpresion.get('/:id/ticket', async (req, res) => {
  const venta = await obtenerVentaCompleta(req.params.id);
  if (!venta) return res.status(404).json({ error: 'Factura no encontrada' });
  if (venta.estado !== 'pagada') return res.status(409).json({ error: 'La orden todavía no tiene factura' });

  const ancho = Number(req.query.columnas) === 48 ? 48 : 40;
  const texto = formatearTicket(venta, ancho);

  // ?formato=texto para integraciones/impresión directa por ESC-POS; por
  // default se abre como página lista para Ctrl+P desde el navegador.
  if (req.query.formato === 'texto') {
    return res.type('text/plain').send(texto);
  }
  res.type('text/html').send(
    envolverTicketHtml(texto, ancho, {
      copias: req.query.copias,
      autoimprimir: req.query.autoimprimir === '1',
    })
  );
});

facturaImpresion.get('/:id/pdf', async (req, res) => {
  const venta = await obtenerVentaCompleta(req.params.id);
  if (!venta) return res.status(404).json({ error: 'Factura no encontrada' });
  if (venta.estado !== 'pagada') return res.status(409).json({ error: 'La orden todavía no tiene factura' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="factura-${venta.numero_factura}.pdf"`);
  generarPdfFactura(venta, res);
});

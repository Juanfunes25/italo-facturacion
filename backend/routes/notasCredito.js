import { Router } from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/requireRole.js';
import { registrarAuditoria } from '../lib/auditoria.js';

export const notasCredito = Router();

// Sólo admin puede anular, igual de restrictivo que en WizPOS hoy (ni el
// propio Juan tiene ese permiso ahí). La numeración de la factura original
// no se toca — la nota de crédito es un documento aparte que la referencia.
notasCredito.post('/', requireRole('admin'), async (req, res) => {
  const { venta_id, motivo, monto } = req.body;
  if (!venta_id || !motivo || monto === undefined) {
    return res.status(400).json({ error: 'venta_id, motivo y monto son obligatorios' });
  }

  const { data: venta, error: errVenta } = await db.from('ventas').select('*').eq('id', venta_id).single();
  if (errVenta || !venta) return res.status(404).json({ error: 'Factura no encontrada' });
  if (venta.estado !== 'pagada') return res.status(409).json({ error: 'Sólo se anulan facturas ya pagadas' });
  if (venta.anulada) return res.status(409).json({ error: 'Esta factura ya está anulada' });

  const { data: notasPrevias } = await db.from('notas_credito').select('monto').eq('venta_id', venta_id);
  const yaAcreditado = (notasPrevias ?? []).reduce((s, n) => s + Number(n.monto), 0);
  const restante = Number(venta.total) - yaAcreditado;
  if (Number(monto) > restante + 0.01) {
    return res.status(400).json({ error: `El monto excede lo pendiente por acreditar (L ${restante.toFixed(2)})` });
  }

  const { data: nota, error } = await db
    .from('notas_credito')
    .insert({ venta_id, motivo, monto, usuario_id: req.perfil.id })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  const anulaTotal = Number(monto) >= restante - 0.01;
  if (anulaTotal) {
    await db.from('ventas').update({ anulada: true }).eq('id', venta_id);
  }

  await registrarAuditoria(req, {
    accion: anulaTotal ? 'venta.anular' : 'venta.nota_credito_parcial',
    entidad: 'venta',
    entidadId: venta_id,
    sucursalId: venta.sucursal_id,
    detalle: {
      numero_factura: venta.numero_factura,
      total_factura: Number(venta.total),
      monto_acreditado: Number(monto),
      motivo,
      nota_credito_id: nota.id,
    },
  });

  res.status(201).json(nota);
});

notasCredito.get('/', requireRole('admin', 'manager'), async (req, res) => {
  let query = db.from('notas_credito').select('*, ventas(numero_factura)').order('created_at', { ascending: false });
  if (req.query.venta_id) query = query.eq('venta_id', req.query.venta_id);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

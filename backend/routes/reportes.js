import { Router } from 'express';
import { db } from '../db.js';
import { round2 } from '../lib/facturacion.js';

export const reportes = Router();

async function ventasPagadasEnRango({ sucursal_id, fechaInicio, fechaFin }) {
  let query = db.from('ventas').select('*').eq('estado', 'pagada');
  if (sucursal_id) query = query.eq('sucursal_id', sucursal_id);
  if (fechaInicio) query = query.gte('fecha_emision', fechaInicio);
  if (fechaFin) query = query.lte('fecha_emision', fechaFin);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

reportes.get('/ventas', async (req, res) => {
  try {
    const ventasDb = await ventasPagadasEnRango(req.query);
    const porDia = new Map();
    for (const v of ventasDb) {
      const dia = (v.fecha_emision || '').slice(0, 10);
      const acc = porDia.get(dia) || { fecha: dia, cantidad_facturas: 0, total: 0 };
      acc.cantidad_facturas += 1;
      acc.total = round2(acc.total + Number(v.total));
      porDia.set(dia, acc);
    }
    const porDiaOrdenado = [...porDia.values()].sort((a, b) => a.fecha.localeCompare(b.fecha));
    const total = round2(ventasDb.reduce((s, v) => s + Number(v.total), 0));
    res.json({ total, cantidad_facturas: ventasDb.length, por_dia: porDiaOrdenado });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Base para la declaración mensual del ISV: desglose exento/exonerado/gravado.
reportes.get('/isv', async (req, res) => {
  try {
    const ventasDb = await ventasPagadasEnRango(req.query);
    const totales = ventasDb.reduce(
      (acc, v) => ({
        subtotal_exento: acc.subtotal_exento + Number(v.subtotal_exento),
        subtotal_exonerado: acc.subtotal_exonerado + Number(v.subtotal_exonerado),
        subtotal_gravado_15: acc.subtotal_gravado_15 + Number(v.subtotal_gravado_15),
        isv_total: acc.isv_total + Number(v.isv_total),
      }),
      { subtotal_exento: 0, subtotal_exonerado: 0, subtotal_gravado_15: 0, isv_total: 0 }
    );
    for (const k in totales) totales[k] = round2(totales[k]);
    res.json({ ...totales, cantidad_facturas: ventasDb.length });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

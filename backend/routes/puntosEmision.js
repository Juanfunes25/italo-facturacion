import { Router } from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/requireRole.js';

export const puntosEmision = Router();

const UMBRAL_ALERTA_PORCENTAJE = 0.9; // avisar cuando queda <10% del rango
const UMBRAL_ALERTA_DIAS = 15; // avisar cuando quedan <15 días para el vencimiento

function calcularEstado(pe) {
  const rango = pe.correlativo_hasta - pe.correlativo_desde + 1;
  const usados = pe.correlativo_actual - pe.correlativo_desde;
  const porcentaje_usado = rango > 0 ? Math.min(1, Math.max(0, usados / rango)) : 1;

  let dias_restantes = null;
  if (pe.fecha_limite_emision) {
    const hoy = new Date();
    const limite = new Date(pe.fecha_limite_emision);
    dias_restantes = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24));
  }

  const alerta_rango = porcentaje_usado >= UMBRAL_ALERTA_PORCENTAJE;
  const alerta_fecha = dias_restantes !== null && dias_restantes <= UMBRAL_ALERTA_DIAS;
  const agotado = pe.correlativo_actual > pe.correlativo_hasta;
  const vencido = dias_restantes !== null && dias_restantes < 0;

  return {
    ...pe,
    porcentaje_usado: Math.round(porcentaje_usado * 1000) / 10,
    dias_restantes,
    alerta: alerta_rango || alerta_fecha || agotado || vencido,
    agotado,
    vencido,
  };
}

puntosEmision.get('/estado', requireRole('admin', 'manager'), async (req, res) => {
  const { data, error } = await db
    .from('puntos_emision')
    .select('*, sucursales(nombre, alias)')
    .eq('activo', true);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(calcularEstado));
});

// Activar el CAI real cuando el contador lo confirme ante el SAR. Deja de
// ser borrador y las facturas emitidas desde ese momento son fiscales.
puntosEmision.put('/:id', requireRole('admin'), async (req, res) => {
  const { cai, correlativo_desde, correlativo_hasta, correlativo_actual, fecha_limite_emision, es_borrador } =
    req.body;
  const { data, error } = await db
    .from('puntos_emision')
    .update({ cai, correlativo_desde, correlativo_hasta, correlativo_actual, fecha_limite_emision, es_borrador })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(calcularEstado(data));
});

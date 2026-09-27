import { Router } from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/requireRole.js';

export const productos = Router();

productos.get('/', async (req, res) => {
  let query = db.from('productos').select('*, categorias(id, nombre)').order('nombre');
  if (req.query.categoria_id) query = query.eq('categoria_id', req.query.categoria_id);
  if (req.query.incluirInactivos !== 'true') query = query.eq('activo', true);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

productos.post('/', requireRole('admin', 'manager'), async (req, res) => {
  const { codigo, nombre, categoria_id, precio, impuesto1_tasa, impuesto2_tasa, impuesto3_tasa } = req.body;
  if (!nombre || precio === undefined) {
    return res.status(400).json({ error: 'nombre y precio son obligatorios' });
  }
  const { data, error } = await db
    .from('productos')
    .insert({
      codigo,
      nombre,
      categoria_id,
      precio,
      impuesto1_tasa: impuesto1_tasa ?? 0.15,
      impuesto2_tasa: impuesto2_tasa ?? 0,
      impuesto3_tasa: impuesto3_tasa ?? 0,
    })
    .select()
    .single();
  if (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: `Ya existe un producto con el código "${codigo}" — usa uno distinto.` });
    }
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

productos.put('/:id', requireRole('admin', 'manager'), async (req, res) => {
  const { codigo, nombre, categoria_id, precio, impuesto1_tasa, activo } = req.body;
  const { data, error } = await db
    .from('productos')
    .update({ codigo, nombre, categoria_id, precio, impuesto1_tasa, activo })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Sin borrado físico: WizPOS lo permite, pero acá alcanza con desactivar
// (una factura ya emitida no debe perder la referencia al producto).
productos.delete('/:id', requireRole('admin', 'manager'), async (req, res) => {
  const { error } = await db.from('productos').update({ activo: false }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

import { Router } from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/requireRole.js';

export const sucursales = Router();

sucursales.get('/', async (req, res) => {
  const { data, error } = await db.from('sucursales').select('*').eq('activo', true).order('nombre');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Alta de una sucursal nueva: crea también su punto de emisión en modo
// borrador (sin CAI todavía) con un código de punto de emisión sugerido
// (siguiente disponible). El esquema no tiene límite de sucursales — esto
// es lo único que hace falta para agregar la número 5, 6, etc.
sucursales.post('/', requireRole('admin'), async (req, res) => {
  const { nombre, alias, direccion } = req.body;
  if (!nombre || !alias || !direccion) {
    return res.status(400).json({ error: 'nombre, alias y dirección son obligatorios' });
  }

  const { data: sucursal, error } = await db
    .from('sucursales')
    .insert({ nombre, alias, direccion })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });

  const { count } = await db.from('puntos_emision').select('id', { count: 'exact', head: true });
  const siguienteCodigo = String((count ?? 0) + 1).padStart(3, '0');

  const { data: puntoEmision, error: errPunto } = await db
    .from('puntos_emision')
    .insert({
      sucursal_id: sucursal.id,
      punto_emision_codigo: siguienteCodigo,
      punto_venta_codigo: '001',
      tipo_documento_codigo: '01',
      cai: null,
      correlativo_desde: 1,
      correlativo_hasta: 99999999,
      correlativo_actual: 1,
      fecha_limite_emision: null,
      es_borrador: true,
    })
    .select()
    .single();
  if (errPunto) return res.status(500).json({ error: errPunto.message });

  res.status(201).json({ ...sucursal, punto_emision: puntoEmision });
});

sucursales.put('/:id', requireRole('admin'), async (req, res) => {
  const { nombre, direccion, activo } = req.body;
  const { data, error } = await db
    .from('sucursales')
    .update({ nombre, direccion, activo })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

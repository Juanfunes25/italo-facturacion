import { Router } from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/requireRole.js';
import { registrarAuditoria } from '../lib/auditoria.js';

export const productos = Router();

// '' → null (para que dos productos sin código no choquen con el índice
// único); undefined se respeta para no pisar el campo en ediciones parciales.
function limpiarCodigo(valor) {
  if (valor === undefined) return undefined;
  const texto = String(valor ?? '').trim();
  return texto === '' ? null : texto;
}

function errorDuplicado(error, { codigo, codigo_barras }) {
  const detalle = `${error.message} ${error.details ?? ''}`;
  if (detalle.includes('codigo_barras')) {
    return `Ya existe un producto con el código de barras "${codigo_barras}".`;
  }
  return `Ya existe un producto con el código "${codigo}" — usa uno distinto.`;
}

productos.get('/', async (req, res) => {
  let query = db.from('productos').select('*, categorias(id, nombre)').order('nombre');
  if (req.query.categoria_id) query = query.eq('categoria_id', req.query.categoria_id);
  if (req.query.incluirInactivos !== 'true') query = query.eq('activo', true);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

productos.post('/', requireRole('admin', 'manager'), async (req, res) => {
  const { nombre, categoria_id, precio, impuesto1_tasa, impuesto2_tasa, impuesto3_tasa } = req.body;
  const codigo = limpiarCodigo(req.body.codigo);
  const codigo_barras = limpiarCodigo(req.body.codigo_barras);
  if (!nombre || precio === undefined) {
    return res.status(400).json({ error: 'nombre y precio son obligatorios' });
  }
  const { data, error } = await db
    .from('productos')
    .insert({
      codigo,
      codigo_barras,
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
    if (error.code === '23505') return res.status(400).json({ error: errorDuplicado(error, { codigo, codigo_barras }) });
    return res.status(500).json({ error: error.message });
  }
  await registrarAuditoria(req, {
    accion: 'producto.crear',
    entidad: 'producto',
    entidadId: data.id,
    detalle: { nombre: data.nombre, precio: Number(data.precio), codigo_barras: data.codigo_barras },
  });
  res.status(201).json(data);
});

productos.put('/:id', requireRole('admin', 'manager'), async (req, res) => {
  const { nombre, categoria_id, precio, impuesto1_tasa, activo } = req.body;
  const codigo = limpiarCodigo(req.body.codigo);
  const codigo_barras = limpiarCodigo(req.body.codigo_barras);
  const { data: anterior } = await db.from('productos').select('*').eq('id', req.params.id).maybeSingle();

  const { data, error } = await db
    .from('productos')
    .update({ codigo, codigo_barras, nombre, categoria_id, precio, impuesto1_tasa, activo })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) {
    if (error.code === '23505') return res.status(400).json({ error: errorDuplicado(error, { codigo, codigo_barras }) });
    return res.status(500).json({ error: error.message });
  }

  // Un cambio de precio es de los primeros datos que pide una auditoría.
  if (anterior) {
    const cambios = {};
    for (const campo of ['nombre', 'precio', 'impuesto1_tasa', 'activo', 'codigo', 'codigo_barras']) {
      if (String(anterior[campo]) !== String(data[campo])) cambios[campo] = { antes: anterior[campo], despues: data[campo] };
    }
    if (Object.keys(cambios).length > 0) {
      await registrarAuditoria(req, {
        accion: 'producto.editar',
        entidad: 'producto',
        entidadId: data.id,
        detalle: { nombre: data.nombre, cambios },
      });
    }
  }
  res.json(data);
});

// Sin borrado físico: WizPOS lo permite, pero acá alcanza con desactivar
// (una factura ya emitida no debe perder la referencia al producto).
productos.delete('/:id', requireRole('admin', 'manager'), async (req, res) => {
  const { data, error } = await db
    .from('productos')
    .update({ activo: false })
    .eq('id', req.params.id)
    .select('id, nombre')
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  await registrarAuditoria(req, {
    accion: 'producto.desactivar',
    entidad: 'producto',
    entidadId: req.params.id,
    detalle: { nombre: data?.nombre },
  });
  res.status(204).end();
});

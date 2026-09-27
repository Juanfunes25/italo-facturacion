import { Router } from 'express';
import { db } from '../db.js';
import { round2 } from '../lib/facturacion.js';
import { generarPdfCotizacion, generarPdfCotizacionBuffer } from '../lib/cotizacionPdf.js';
import { enviarCotizacionCliente } from '../lib/correo.js';

export const cotizaciones = Router();

function calcularTotal(c) {
  return round2(Number(c.cantidad_copitas) * Number(c.precio_copita) + Number(c.costo_servicio || 0) - Number(c.descuento || 0));
}

const CAMPOS_EDITABLES = [
  'nombre_cliente',
  'telefono_cliente',
  'email_cliente',
  'nombre_evento',
  'fecha_evento',
  'lugar',
  'cantidad_copitas',
  'precio_copita',
  'costo_servicio',
  'descuento',
  'notas',
  'estado',
];

function limpiarBody(body) {
  const limpio = {};
  for (const campo of CAMPOS_EDITABLES) {
    if (body[campo] !== undefined) limpio[campo] = body[campo];
  }
  return limpio;
}

cotizaciones.get('/', async (req, res) => {
  const { estado } = req.query;
  let query = db.from('cotizaciones_eventos').select('*, perfiles(nombre)').order('created_at', { ascending: false });
  if (estado) query = query.eq('estado', estado);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map((c) => ({ ...c, total: calcularTotal(c) })));
});

cotizaciones.post('/', async (req, res) => {
  const datos = limpiarBody(req.body);
  if (!datos.nombre_cliente || !datos.nombre_evento || !datos.cantidad_copitas || datos.precio_copita === undefined) {
    return res.status(400).json({
      error: 'nombre_cliente, nombre_evento, cantidad_copitas y precio_copita son obligatorios',
    });
  }
  const { data, error } = await db
    .from('cotizaciones_eventos')
    .insert({ ...datos, usuario_id: req.perfil.id })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ ...data, total: calcularTotal(data) });
});

cotizaciones.get('/:id', async (req, res) => {
  const { data, error } = await db
    .from('cotizaciones_eventos')
    .select('*, perfiles(nombre)')
    .eq('id', req.params.id)
    .single();
  if (error || !data) return res.status(404).json({ error: 'Cotización no encontrada' });
  res.json({ ...data, total: calcularTotal(data) });
});

cotizaciones.put('/:id', async (req, res) => {
  const { data, error } = await db
    .from('cotizaciones_eventos')
    .update(limpiarBody(req.body))
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ...data, total: calcularTotal(data) });
});

cotizaciones.delete('/:id', async (req, res) => {
  const { data: cot } = await db.from('cotizaciones_eventos').select('estado').eq('id', req.params.id).single();
  if (!cot) return res.status(404).json({ error: 'Cotización no encontrada' });
  if (cot.estado !== 'borrador') return res.status(409).json({ error: 'Sólo se eliminan cotizaciones en borrador' });
  await db.from('cotizaciones_eventos').delete().eq('id', req.params.id);
  res.status(204).end();
});

cotizaciones.get('/:id/pdf', async (req, res) => {
  const { data, error } = await db
    .from('cotizaciones_eventos')
    .select('*, perfiles(nombre)')
    .eq('id', req.params.id)
    .single();
  if (error || !data) return res.status(404).json({ error: 'Cotización no encontrada' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="cotizacion-evento-${data.numero}.pdf"`);
  generarPdfCotizacion({ ...data, total: calcularTotal(data) }, res);
});

cotizaciones.post('/:id/enviar', async (req, res) => {
  try {
    const { data, error } = await db.from('cotizaciones_eventos').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ error: 'Cotización no encontrada' });
    const cotizacionCompleta = { ...data, total: calcularTotal(data) };
    const pdfBuffer = await generarPdfCotizacionBuffer(cotizacionCompleta);
    const resultado = await enviarCotizacionCliente(cotizacionCompleta, pdfBuffer, data.email_cliente);
    if (!resultado.enviado) return res.status(400).json({ error: resultado.motivo });
    if (data.estado === 'borrador') {
      await db.from('cotizaciones_eventos').update({ estado: 'enviada' }).eq('id', req.params.id);
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

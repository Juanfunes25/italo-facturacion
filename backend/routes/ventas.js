import { Router } from 'express';
import { db } from '../db.js';
import { calcularTotales, round2 } from '../lib/facturacion.js';

export const ventas = Router();

async function obtenerPuntoEmisionActivo(sucursal_id) {
  const { data, error } = await db
    .from('puntos_emision')
    .select('*')
    .eq('sucursal_id', sucursal_id)
    .eq('activo', true)
    .single();
  if (error) throw new Error('La sucursal no tiene un punto de emisión activo');
  return data;
}

async function obtenerCliente(cliente_id) {
  if (!cliente_id) {
    const { data } = await db.from('clientes').select('*').eq('es_consumidor_final', true).single();
    return data;
  }
  const { data } = await db.from('clientes').select('*').eq('id', cliente_id).single();
  return data;
}

async function construirItems(itemsSolicitados, puedeEditarPrecio) {
  const productoIds = itemsSolicitados.map((i) => i.producto_id);
  const { data: productosDb, error } = await db.from('productos').select('*').in('id', productoIds);
  if (error) throw new Error(error.message);
  const porId = new Map(productosDb.map((p) => [p.id, p]));

  return itemsSolicitados.map((item) => {
    const producto = porId.get(item.producto_id);
    if (!producto) throw new Error(`Producto ${item.producto_id} no existe o está inactivo`);
    const precio_unitario =
      puedeEditarPrecio && item.precio_unitario !== undefined ? Number(item.precio_unitario) : producto.precio;
    return {
      producto_id: producto.id,
      nombre_producto: producto.nombre,
      cantidad: Number(item.cantidad),
      precio_unitario,
      descuento: Number(item.descuento || 0),
      impuesto_tasa: producto.impuesto1_tasa,
    };
  });
}

async function guardarDetalle(venta_id, lineas) {
  await db.from('detalle_venta').delete().eq('venta_id', venta_id);
  const filas = lineas.map((l) => ({ venta_id, ...l }));
  const { error } = await db.from('detalle_venta').insert(filas);
  if (error) throw new Error(error.message);
}

ventas.post('/', async (req, res) => {
  try {
    const { sucursal_id, cliente_id, tipo_orden, items, descuento } = req.body;
    if (!sucursal_id) return res.status(400).json({ error: 'sucursal_id es obligatorio' });
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'La orden necesita al menos un producto' });
    }

    const puntoEmision = await obtenerPuntoEmisionActivo(sucursal_id);
    const cliente = await obtenerCliente(cliente_id);
    const puedeEditarPrecio = req.perfil.rol !== 'cajero';
    const lineas = await construirItems(items, puedeEditarPrecio);
    const totales = calcularTotales(lineas, cliente, descuento);

    const { data: venta, error } = await db
      .from('ventas')
      .insert({
        sucursal_id,
        punto_emision_id: puntoEmision.id,
        cliente_id: cliente?.id ?? null,
        cajero_id: req.perfil.id,
        tipo_orden: tipo_orden ?? null,
        estado: 'abierta',
        subtotal_exento: totales.subtotal_exento,
        subtotal_exonerado: totales.subtotal_exonerado,
        subtotal_gravado_15: totales.subtotal_gravado_15,
        descuento: totales.descuento,
        isv_total: totales.isv_total,
        total: totales.total,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    await guardarDetalle(venta.id, totales.lineas);
    res.status(201).json({ ...venta, es_borrador: puntoEmision.es_borrador });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

ventas.put('/:id', async (req, res) => {
  try {
    const { data: ventaActual, error: errBusqueda } = await db
      .from('ventas')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (errBusqueda || !ventaActual) return res.status(404).json({ error: 'Orden no encontrada' });
    if (ventaActual.estado !== 'abierta') {
      return res.status(409).json({ error: 'Sólo se pueden editar órdenes abiertas' });
    }

    const { cliente_id, tipo_orden, items, descuento } = req.body;
    const cliente = await obtenerCliente(cliente_id);
    const puedeEditarPrecio = req.perfil.rol !== 'cajero';
    const lineas = await construirItems(items, puedeEditarPrecio);
    const totales = calcularTotales(lineas, cliente, descuento);

    const { data: venta, error } = await db
      .from('ventas')
      .update({
        cliente_id: cliente?.id ?? null,
        tipo_orden: tipo_orden ?? null,
        subtotal_exento: totales.subtotal_exento,
        subtotal_exonerado: totales.subtotal_exonerado,
        subtotal_gravado_15: totales.subtotal_gravado_15,
        descuento: totales.descuento,
        isv_total: totales.isv_total,
        total: totales.total,
      })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw new Error(error.message);

    await guardarDetalle(venta.id, totales.lineas);
    res.json(venta);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

ventas.get('/', async (req, res) => {
  const { estado, sucursal_id, q, fechaInicio, fechaFin } = req.query;
  let query = db
    .from('ventas')
    .select('*, clientes(nombre, rtn), perfiles(nombre)')
    .order('created_at', { ascending: false })
    .limit(200);

  if (estado) query = query.eq('estado', estado);
  if (sucursal_id) query = query.eq('sucursal_id', sucursal_id);
  if (fechaInicio) query = query.gte('fecha_emision', fechaInicio);
  if (fechaFin) query = query.lte('fecha_emision', fechaFin);
  if (q) query = query.or(`numero_factura.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export async function obtenerVentaCompleta(id) {
  const { data: venta, error } = await db
    .from('ventas')
    .select('*, clientes(*), perfiles(nombre), sucursales(nombre, alias), puntos_emision(*)')
    .eq('id', id)
    .single();
  if (error || !venta) return null;

  const { data: detalle } = await db.from('detalle_venta').select('*').eq('venta_id', venta.id);
  return { ...venta, detalle };
}

ventas.get('/:id', async (req, res) => {
  const venta = await obtenerVentaCompleta(req.params.id);
  if (!venta) return res.status(404).json({ error: 'Orden no encontrada' });
  res.json(venta);
});

ventas.delete('/:id', async (req, res) => {
  const { data: venta } = await db.from('ventas').select('estado').eq('id', req.params.id).single();
  if (!venta) return res.status(404).json({ error: 'Orden no encontrada' });
  if (venta.estado !== 'abierta') {
    return res.status(409).json({ error: 'Sólo se pueden descartar órdenes abiertas' });
  }
  await db.from('detalle_venta').delete().eq('venta_id', req.params.id);
  await db.from('ventas').delete().eq('id', req.params.id);
  res.status(204).end();
});

ventas.post('/:id/pagar', async (req, res) => {
  try {
    const { efectivo_recibido, pagos } = req.body;
    if (!Array.isArray(pagos) || pagos.length === 0) {
      return res.status(400).json({ error: 'Debe indicar al menos una forma de pago' });
    }

    const { data: venta, error: errVenta } = await db
      .from('ventas')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (errVenta || !venta) return res.status(404).json({ error: 'Orden no encontrada' });

    const totalPagado = round2(pagos.reduce((s, p) => s + Number(p.monto), 0));
    if (totalPagado < venta.total) {
      return res.status(400).json({ error: `El pago (${totalPagado}) es menor al total (${venta.total})` });
    }
    const cambio = round2(totalPagado - venta.total);

    const { data: ventaFinal, error: errFinalizar } = await db.rpc('finalizar_venta', {
      p_venta_id: venta.id,
      p_efectivo: efectivo_recibido ?? totalPagado,
      p_cambio: cambio,
    });
    if (errFinalizar) return res.status(409).json({ error: errFinalizar.message });

    const filasPago = pagos.map((p) => ({ venta_id: venta.id, forma_pago_id: p.forma_pago_id, monto: p.monto }));
    await db.from('venta_pagos').insert(filasPago);

    const { data: puntoEmision } = await db
      .from('puntos_emision')
      .select('es_borrador')
      .eq('id', venta.punto_emision_id)
      .single();

    res.json({ ...ventaFinal, es_borrador: puntoEmision?.es_borrador ?? true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

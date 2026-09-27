import { Router } from 'express';
import { db } from '../db.js';
import {
  calcularTotales,
  descuentoPorPorcentaje,
  PORCENTAJES_DESCUENTO,
  round2,
} from '../lib/facturacion.js';
import { generarPdfFacturaBuffer } from '../lib/pdf.js';
import { enviarFacturaCliente } from '../lib/correo.js';
import { registrarAuditoria } from '../lib/auditoria.js';

export const ventas = Router();

// Monto a partir del cual se exige RTN del cliente (mismo criterio que el
// "limiteRTN" que ya usaba WizPOS para esta empresa: L10,000).
export const UMBRAL_RTN_OBLIGATORIO = 10000;

export async function obtenerPuntoEmisionActivo(sucursal_id) {
  const { data, error } = await db
    .from('puntos_emision')
    .select('*')
    .eq('sucursal_id', sucursal_id)
    .eq('activo', true)
    .single();
  if (error) throw new Error('La sucursal no tiene un punto de emisión activo');
  return data;
}

// Sin cliente (o con un id que ya no existe) la factura SIEMPRE sale a
// nombre de Consumidor Final — nunca queda una venta sin cliente asignado.
export async function obtenerCliente(cliente_id) {
  if (cliente_id) {
    const { data } = await db.from('clientes').select('*').eq('id', cliente_id).maybeSingle();
    if (data) return data;
  }
  const { data: consumidorFinal } = await db
    .from('clientes')
    .select('*')
    .eq('es_consumidor_final', true)
    .limit(1)
    .maybeSingle();
  if (!consumidorFinal) throw new Error('No existe el cliente "Consumidor Final" en la base de datos');
  return consumidorFinal;
}

function validarPorcentaje(valor) {
  const porcentaje = Number(valor ?? 0);
  if (!PORCENTAJES_DESCUENTO.includes(porcentaje)) {
    throw new Error('El descuento sólo puede ser 10% o 25% (tercera edad)');
  }
  return porcentaje;
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
      descuento: 0,
      impuesto_tasa: producto.impuesto1_tasa,
    };
  });
}

// calcularLineas() (backend/lib/facturacion.js) agrega "base", "isv" y
// "bucket" a cada línea para calcular los subtotales fiscales — son campos
// de trabajo, no columnas de la tabla, así que se arma la fila explícita.
export async function guardarDetalle(venta_id, lineas) {
  await db.from('detalle_venta').delete().eq('venta_id', venta_id);
  const filas = lineas.map((l) => ({
    venta_id,
    producto_id: l.producto_id ?? null,
    nombre_producto: l.nombre_producto,
    cantidad: l.cantidad,
    precio_unitario: l.precio_unitario,
    descuento: l.descuento,
    impuesto_tasa: l.impuesto_tasa,
    monto: l.monto,
  }));
  const { error } = await db.from('detalle_venta').insert(filas);
  if (error) throw new Error(error.message);
}

function resumenItems(lineas) {
  return lineas.map((l) => `${Number(l.cantidad)}× ${l.nombre_producto}`);
}

async function calcularOrden(req, { cliente_id, items, descuento_porcentaje }) {
  const porcentaje = validarPorcentaje(descuento_porcentaje);
  const cliente = await obtenerCliente(cliente_id);
  const puedeEditarPrecio = req.perfil.rol !== 'cajero';
  const lineas = await construirItems(items, puedeEditarPrecio);
  const descuento = descuentoPorPorcentaje(lineas, cliente, porcentaje);
  return { porcentaje, cliente, totales: calcularTotales(lineas, cliente, descuento) };
}

ventas.post('/', async (req, res) => {
  try {
    const { sucursal_id, tipo_orden, items, nota_interna } = req.body;
    if (!sucursal_id) return res.status(400).json({ error: 'sucursal_id es obligatorio' });
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'La orden necesita al menos un producto' });
    }

    const puntoEmision = await obtenerPuntoEmisionActivo(sucursal_id);
    const { porcentaje, cliente, totales } = await calcularOrden(req, req.body);

    const { data: venta, error } = await db
      .from('ventas')
      .insert({
        sucursal_id,
        punto_emision_id: puntoEmision.id,
        cliente_id: cliente.id,
        cajero_id: req.perfil.id,
        tipo_orden: tipo_orden ?? null,
        nota_interna: nota_interna || null,
        estado: 'abierta',
        subtotal_exento: totales.subtotal_exento,
        subtotal_exonerado: totales.subtotal_exonerado,
        subtotal_gravado_15: totales.subtotal_gravado_15,
        descuento: totales.descuento,
        descuento_porcentaje: porcentaje,
        isv_total: totales.isv_total,
        total: totales.total,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    try {
      await guardarDetalle(venta.id, totales.lineas);
    } catch (e) {
      // Sin detalle la orden no sirve: se borra para no dejar una orden
      // "abierta" vacía y huérfana en la lista de Órdenes Abiertas.
      await db.from('ventas').delete().eq('id', venta.id);
      throw e;
    }

    await registrarAuditoria(req, {
      accion: 'venta.crear_orden',
      entidad: 'venta',
      entidadId: venta.id,
      sucursalId: sucursal_id,
      detalle: { numero_orden: venta.numero_orden, total: venta.total, items: resumenItems(totales.lineas) },
    });
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

    const { tipo_orden, items, nota_interna } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'La orden necesita al menos un producto' });
    }
    const { porcentaje, cliente, totales } = await calcularOrden(req, req.body);
    const { data: detalleAnterior } = await db.from('detalle_venta').select('cantidad, nombre_producto').eq('venta_id', req.params.id);

    const { data: venta, error } = await db
      .from('ventas')
      .update({
        cliente_id: cliente.id,
        tipo_orden: tipo_orden ?? null,
        nota_interna: nota_interna || null,
        subtotal_exento: totales.subtotal_exento,
        subtotal_exonerado: totales.subtotal_exonerado,
        subtotal_gravado_15: totales.subtotal_gravado_15,
        descuento: totales.descuento,
        descuento_porcentaje: porcentaje,
        isv_total: totales.isv_total,
        total: totales.total,
      })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw new Error(error.message);

    await guardarDetalle(venta.id, totales.lineas);

    // El autoguardado llama esto seguido; sólo se registra cuando algo
    // realmente cambió (productos, total, cliente o descuento).
    const itemsAntes = resumenItems(detalleAnterior ?? []);
    const itemsDespues = resumenItems(totales.lineas);
    const cambio =
      JSON.stringify(itemsAntes) !== JSON.stringify(itemsDespues) ||
      Number(ventaActual.total) !== Number(venta.total) ||
      ventaActual.cliente_id !== venta.cliente_id;
    if (cambio) {
      await registrarAuditoria(req, {
        accion: 'venta.editar_orden',
        entidad: 'venta',
        entidadId: venta.id,
        sucursalId: venta.sucursal_id,
        detalle: {
          numero_orden: venta.numero_orden,
          total_anterior: Number(ventaActual.total),
          total_nuevo: Number(venta.total),
          descuento_porcentaje: porcentaje,
          cliente: cliente.nombre,
          items_antes: itemsAntes,
          items_despues: itemsDespues,
        },
      });
    }
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
  if (q) {
    // Además del No. de factura, busca por nombre del cliente — así no hay
    // que saber el número exacto para encontrar las facturas de alguien.
    const { data: clientesQueCoinciden } = await db.from('clientes').select('id').ilike('nombre', `%${q}%`);
    const idsCliente = (clientesQueCoinciden ?? []).map((c) => c.id);
    const filtroCliente = idsCliente.length > 0 ? `,cliente_id.in.(${idsCliente.join(',')})` : '';
    query = query.or(`numero_factura.ilike.%${q}%${filtroCliente}`);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Reenvía manualmente el correo de una factura ya emitida — para cuando
// falló la primera vez, o cuando el cliente pide que se le vuelva a mandar.
ventas.post('/:id/reenviar-correo', async (req, res) => {
  try {
    const ventaCompleta = await obtenerVentaCompleta(req.params.id);
    if (!ventaCompleta) return res.status(404).json({ error: 'Factura no encontrada' });
    if (ventaCompleta.estado !== 'pagada') {
      return res.status(409).json({ error: 'Sólo se puede enviar por correo una factura ya emitida' });
    }
    if (!ventaCompleta.clientes?.email) {
      return res.status(400).json({ error: 'El cliente de esta factura no tiene correo registrado' });
    }
    const pdfBuffer = await generarPdfFacturaBuffer(ventaCompleta);
    const resultado = await enviarFacturaCliente(ventaCompleta, pdfBuffer);
    await db
      .from('ventas')
      .update({ correo_enviado: resultado.enviado, correo_error: resultado.motivo ?? null })
      .eq('id', ventaCompleta.id);
    await registrarAuditoria(req, {
      accion: 'venta.reenviar_correo',
      entidad: 'venta',
      entidadId: ventaCompleta.id,
      sucursalId: ventaCompleta.sucursal_id,
      detalle: {
        numero_factura: ventaCompleta.numero_factura,
        destinatario: ventaCompleta.clientes.email,
        enviado: resultado.enviado,
      },
    });
    if (!resultado.enviado) return res.status(400).json({ error: resultado.motivo });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
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
  const venta = await obtenerVentaCompleta(req.params.id);
  if (!venta) return res.status(404).json({ error: 'Orden no encontrada' });
  if (venta.estado !== 'abierta') {
    return res.status(409).json({ error: 'Sólo se pueden descartar órdenes abiertas' });
  }
  await db.from('detalle_venta').delete().eq('venta_id', req.params.id);
  await db.from('ventas').delete().eq('id', req.params.id);

  // Descartar una orden con productos es exactamente lo que se usaría para
  // ocultar un cobro en efectivo — queda la foto completa de lo que tenía.
  await registrarAuditoria(req, {
    accion: 'venta.descartar_orden',
    entidad: 'venta',
    entidadId: venta.id,
    sucursalId: venta.sucursal_id,
    detalle: {
      numero_orden: venta.numero_orden,
      total: Number(venta.total),
      cliente: venta.clientes?.nombre ?? 'Consumidor Final',
      items: resumenItems(venta.detalle ?? []),
    },
  });
  res.status(204).end();
});

// Emite la factura de una venta: correlativo del CAI (atómico), pagos,
// bitácora y correo. Lo usan el POS (/pagar) y la conversión de una
// cotización de evento en factura.
export async function facturarVenta(req, ventaId, { pagos, efectivo_recibido, origen = 'pos' }) {
  if (!Array.isArray(pagos) || pagos.length === 0) {
    throw Object.assign(new Error('Debe indicar al menos una forma de pago'), { status: 400 });
  }

  const { data: venta, error: errVenta } = await db
    .from('ventas')
    .select('*, clientes(nombre, rtn, email, exento_impuestos)')
    .eq('id', ventaId)
    .single();
  if (errVenta || !venta) throw Object.assign(new Error('Orden no encontrada'), { status: 404 });

  if (Number(venta.total) > UMBRAL_RTN_OBLIGATORIO && !venta.clientes?.rtn) {
    throw Object.assign(
      new Error(`Se requiere el RTN del cliente para ventas mayores a L${UMBRAL_RTN_OBLIGATORIO.toLocaleString('es-HN')}`),
      { status: 400 }
    );
  }

  const totalPagado = round2(pagos.reduce((s, p) => s + Number(p.monto), 0));
  if (totalPagado < Number(venta.total)) {
    throw Object.assign(new Error(`El pago (${totalPagado}) es menor al total (${venta.total})`), { status: 400 });
  }
  const cambio = round2(totalPagado - Number(venta.total));

  const { data: ventaFinal, error: errFinalizar } = await db.rpc('finalizar_venta', {
    p_venta_id: venta.id,
    p_efectivo: efectivo_recibido ?? totalPagado,
    p_cambio: cambio,
  });
  if (errFinalizar) throw Object.assign(new Error(errFinalizar.message), { status: 409 });

  const filasPago = pagos.map((p) => ({ venta_id: venta.id, forma_pago_id: p.forma_pago_id, monto: p.monto }));
  await db.from('venta_pagos').insert(filasPago);

  const { data: puntoEmision } = await db
    .from('puntos_emision')
    .select('es_borrador, cai, fecha_limite_emision')
    .eq('id', venta.punto_emision_id)
    .single();

  const { data: formas } = await db.from('formas_pago').select('id, nombre');
  const nombreForma = new Map((formas ?? []).map((f) => [f.id, f.nombre]));
  await registrarAuditoria(req, {
    accion: 'venta.facturar',
    entidad: 'venta',
    entidadId: venta.id,
    sucursalId: venta.sucursal_id,
    detalle: {
      origen,
      numero_factura: ventaFinal.numero_factura,
      numero_orden: venta.numero_orden,
      total: Number(venta.total),
      descuento_porcentaje: venta.descuento_porcentaje,
      cliente: venta.clientes?.nombre ?? 'Consumidor Final',
      pagos: pagos.map((p) => ({ forma: nombreForma.get(p.forma_pago_id) ?? p.forma_pago_id, monto: Number(p.monto) })),
      borrador: puntoEmision?.es_borrador ?? true,
    },
  });

  // Correo con el PDF adjunto si el cliente tiene correo — no bloquea la
  // respuesta del cobro. El resultado se guarda en la venta para poder
  // avisar en el listado de facturas si falló, en vez de fallar en silencio.
  if (venta.clientes?.email) {
    obtenerVentaCompleta(venta.id)
      .then(async (ventaCompleta) => {
        const pdfBuffer = await generarPdfFacturaBuffer(ventaCompleta);
        const resultado = await enviarFacturaCliente(ventaCompleta, pdfBuffer);
        await db
          .from('ventas')
          .update({ correo_enviado: resultado.enviado, correo_error: resultado.motivo ?? null })
          .eq('id', venta.id);
      })
      .catch((e) => {
        db.from('ventas').update({ correo_enviado: false, correo_error: e.message }).eq('id', venta.id).then(
          () => {},
          () => {}
        );
      });
  }

  return {
    ...ventaFinal,
    cliente_nombre: venta.clientes?.nombre ?? 'Consumidor Final',
    es_borrador: puntoEmision?.es_borrador ?? true,
  };
}

ventas.post('/:id/pagar', async (req, res) => {
  try {
    const resultado = await facturarVenta(req, req.params.id, req.body);
    res.json(resultado);
  } catch (e) {
    res.status(e.status ?? 400).json({ error: e.message });
  }
});

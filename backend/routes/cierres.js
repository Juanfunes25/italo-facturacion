import { Router } from 'express';
import { db } from '../db.js';
import { round2 } from '../lib/facturacion.js';
import { enviarResumenCierre } from '../lib/correo.js';
import { registrarAuditoria } from '../lib/auditoria.js';

export const cierres = Router();

cierres.post('/', async (req, res) => {
  try {
    const {
      sucursal_id,
      cajero_id,
      fecha_inicio,
      fecha_fin,
      efectivo_contado,
      fondo_caja,
      salidas,
      propinas,
      descuentos,
    } = req.body;
    if (!sucursal_id || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'sucursal_id, fecha_inicio y fecha_fin son obligatorios' });
    }

    // Evita cerrar dos veces el mismo turno (o turnos que se traslapan) en la
    // misma sucursal — eso duplicaría las facturas contadas en el total.
    const { data: solapados, error: errSolape } = await db
      .from('cierres_caja')
      .select('id, fecha_inicio, fecha_fin')
      .eq('sucursal_id', sucursal_id)
      .lt('fecha_inicio', fecha_fin)
      .gt('fecha_fin', fecha_inicio);
    if (errSolape) throw new Error(errSolape.message);
    if (solapados.length > 0) {
      const c = solapados[0];
      return res.status(409).json({
        error: `Ya existe un cierre en ese rango (del ${new Date(c.fecha_inicio).toLocaleString('es-HN')} al ${new Date(c.fecha_fin).toLocaleString('es-HN')}). Ajusta las fechas para no contar las mismas facturas dos veces.`,
      });
    }

    const { data: ventasDelTurno, error } = await db
      .from('ventas')
      .select('id, total, numero_factura, correlativo, anulada')
      .eq('sucursal_id', sucursal_id)
      .eq('estado', 'pagada')
      .gte('fecha_emision', fecha_inicio)
      .lte('fecha_emision', fecha_fin)
      .order('correlativo', { ascending: true });
    if (error) throw new Error(error.message);

    // El correlativo emitido cuenta igual (nunca se le quita el número a una
    // factura anulada), pero el efectivo que se devolvió al anularla no debe
    // sumar al total esperado en caja.
    const ventasValidas = ventasDelTurno.filter((v) => !v.anulada);
    const totalVentas = round2(ventasValidas.reduce((s, v) => s + Number(v.total), 0));
    const factura_desde = ventasDelTurno[0]?.numero_factura ?? null;
    const factura_hasta = ventasDelTurno[ventasDelTurno.length - 1]?.numero_factura ?? null;

    // Desglose por forma de pago (efectivo/tarjeta/transferencia) del turno.
    let desglosePagos = [];
    if (ventasValidas.length > 0) {
      const { data: pagosDb, error: errPagos } = await db
        .from('venta_pagos')
        .select('monto, formas_pago(nombre)')
        .in(
          'venta_id',
          ventasValidas.map((v) => v.id)
        );
      if (errPagos) throw new Error(errPagos.message);
      const porForma = new Map();
      for (const p of pagosDb) {
        const nombre = p.formas_pago?.nombre ?? 'Otro';
        porForma.set(nombre, round2((porForma.get(nombre) || 0) + Number(p.monto)));
      }
      desglosePagos = [...porForma.entries()].map(([nombre, monto]) => ({ nombre, monto }));
    }

    const total_esperado = round2(totalVentas + Number(fondo_caja || 0) - Number(salidas || 0));
    const total_contado = round2(Number(efectivo_contado || 0));
    const diferencia = round2(total_contado - total_esperado);

    const { data: cierre, error: errInsert } = await db
      .from('cierres_caja')
      .insert({
        sucursal_id,
        cajero_id: cajero_id ?? req.perfil.id,
        elaboro_id: req.perfil.id,
        fecha_inicio,
        fecha_fin,
        efectivo_contado: total_contado,
        fondo_caja: fondo_caja || 0,
        salidas: salidas || 0,
        propinas: propinas || 0,
        descuentos: descuentos || 0,
        factura_desde,
        factura_hasta,
        total_esperado,
        total_contado,
        diferencia,
        desglose_pagos: desglosePagos,
        cierre_ciego: req.perfil.cierre_ciego,
        estado: 'cerrado',
      })
      .select()
      .single();
    if (errInsert) throw new Error(errInsert.message);

    const { data: sucursal } = await db.from('sucursales').select('nombre').eq('id', sucursal_id).single();
    const resultado = { ...cierre, cantidad_facturas: ventasDelTurno.length, total_ventas: totalVentas };
    await registrarAuditoria(req, {
      accion: 'cierre.crear',
      entidad: 'cierre',
      entidadId: cierre.id,
      sucursalId: sucursal_id,
      detalle: {
        factura_desde,
        factura_hasta,
        total_esperado,
        total_contado,
        diferencia,
      },
    });
    // No bloquea la respuesta del cierre si el correo falla o no está
    // configurado — es una utilidad extra, no una condición para cerrar.
    enviarResumenCierre(resultado, sucursal?.nombre ?? '').catch(() => {});

    res.status(201).json(resultado);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

cierres.get('/', async (req, res) => {
  const { sucursal_id, fechaInicio, fechaFin } = req.query;
  let query = db
    .from('cierres_caja')
    .select('*, sucursales(nombre, alias), cajero:cajero_id(nombre), elaboro:elaboro_id(nombre)')
    .order('fecha_fin', { ascending: false });
  if (sucursal_id) query = query.eq('sucursal_id', sucursal_id);
  if (fechaInicio) query = query.gte('fecha_inicio', fechaInicio);
  if (fechaFin) query = query.lte('fecha_fin', fechaFin);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

cierres.get('/:id', async (req, res) => {
  const { data, error } = await db
    .from('cierres_caja')
    .select('*, sucursales(nombre, alias), cajero:cajero_id(nombre), elaboro:elaboro_id(nombre)')
    .eq('id', req.params.id)
    .single();
  if (error || !data) return res.status(404).json({ error: 'Cierre no encontrado' });
  res.json(data);
});

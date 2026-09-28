import { Router } from 'express';
import { db } from '../db.js';
import { round2 } from '../lib/facturacion.js';
import { traerTodo } from '../lib/consultas.js';
import { fechaHn, filtrarRango, horaHn } from '../lib/fechas.js';
import { registrarAuditoria } from '../lib/auditoria.js';
import { requireRole } from '../middleware/requireRole.js';
import { alertaFueraDeHorario } from '../lib/antifraude.js';
import { destinatariosAdmins } from '../lib/correo.js';

export const antifraude = Router();

// ── Eventos que manda la app (navegación, carrito, búsquedas) ───────────
// Cualquier usuario logueado; sólo prefijos permitidos y detalle acotado,
// para que nadie pueda usar esto para llenar la bitácora de basura.
const PREFIJOS_EVENTO = ['sesion.', 'pantalla.', 'orden.', 'factura.', 'reporte.', 'cierre.ver'];
const eventosPorUsuario = new Map();

function limitarDetalle(detalle) {
  const limpio = {};
  for (const [k, v] of Object.entries(detalle ?? {}).slice(0, 12)) {
    if (v === null || ['string', 'number', 'boolean'].includes(typeof v)) {
      limpio[String(k).slice(0, 40)] = typeof v === 'string' ? v.slice(0, 200) : v;
    }
  }
  return limpio;
}

antifraude.post('/evento', async (req, res) => {
  const { accion, detalle, sucursal_id } = req.body ?? {};
  if (typeof accion !== 'string' || !PREFIJOS_EVENTO.some((p) => accion.startsWith(p)) || accion.length > 60) {
    return res.status(400).json({ error: 'Evento no permitido' });
  }
  // Máximo 120 eventos por minuto por usuario.
  const minuto = Math.floor(Date.now() / 60000);
  const clave = `${req.perfil.id}:${minuto}`;
  const cuenta = (eventosPorUsuario.get(clave) ?? 0) + 1;
  eventosPorUsuario.set(clave, cuenta);
  if (eventosPorUsuario.size > 5000) eventosPorUsuario.clear();
  if (cuenta > 120) return res.status(429).json({ error: 'Demasiados eventos' });

  await registrarAuditoria(req, {
    accion,
    entidad: accion.split('.')[0],
    sucursalId: sucursal_id || req.perfil.sucursal_id || null,
    detalle: limitarDetalle(detalle),
  });
  if (accion === 'sesion.inicio' || accion === 'pantalla.ver') alertaFueraDeHorario(req, accion);
  res.status(204).end();
});

// ── Estado del correo de alertas ────────────────────────────────────────
antifraude.get('/correo', requireRole('admin'), async (req, res) => {
  const configurado = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
  res.json({ configurado, destinatarios: configurado ? await destinatariosAdmins() : [] });
});

// ── Alertas ─────────────────────────────────────────────────────────────
antifraude.get('/alertas/pendientes', requireRole('admin'), async (req, res) => {
  const { count, error } = await db.from('alertas').select('id', { count: 'exact', head: true }).eq('revisada', false);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ pendientes: count ?? 0 });
});

antifraude.get('/alertas', requireRole('admin'), async (req, res) => {
  let q = db
    .from('alertas')
    .select('*, sucursales(nombre), revisor:revisada_por(nombre)')
    .order('revisada', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(300);
  if (req.query.solo_pendientes === '1') q = q.eq('revisada', false);
  if (req.query.sucursal_id) q = q.eq('sucursal_id', req.query.sucursal_id);
  q = filtrarRango(q, 'created_at', req.query.desde, req.query.hasta);
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

antifraude.put('/alertas/:id/revisar', requireRole('admin'), async (req, res) => {
  const nota = String(req.body?.nota ?? '').trim().slice(0, 500) || null;
  const { data, error } = await db
    .from('alertas')
    .update({ revisada: true, revisada_por: req.perfil.id, revisada_at: new Date().toISOString(), nota_revision: nota })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  await registrarAuditoria(req, {
    accion: 'alerta.revisar',
    entidad: 'alerta',
    entidadId: data.id,
    sucursalId: data.sucursal_id,
    detalle: { titulo: data.titulo, nota },
  });
  res.json(data);
});

// ── Indicadores por cajero y huecos sin facturar ────────────────────────
const ACCIONES_RIESGO = [
  'venta.descartar_orden',
  'venta.editar_orden',
  'orden.quitar_producto',
  'venta.imprimir_ticket',
  'venta.reimprimir_ticket',
  'acceso.denegado',
  'sesion.inicio',
  'pantalla.ver',
];

const HUECO_MINUTOS = 45;
const HORA_ABRE = 11;
const HORA_CIERRA = 21;

function minutosHn(iso) {
  const d = new Date(iso);
  return horaHn(iso) * 60 + d.getUTCMinutes();
}

antifraude.get('/indicadores', requireRole('admin'), async (req, res) => {
  try {
    const { desde, hasta, sucursal_id } = req.query;
    if (!desde || !hasta) return res.status(400).json({ error: 'Elige el rango de fechas' });

    const [ventas, eventos, cierres, perfiles] = await Promise.all([
      traerTodo(() => {
        let q = db
          .from('ventas')
          .select('id, cajero_id, sucursal_id, numero_factura, total, anulada, descuento, cambio, fecha_emision, venta_pagos(monto, formas_pago(nombre)), detalle_venta(descuento, descuento_porcentaje)')
          .eq('estado', 'pagada');
        if (sucursal_id) q = q.eq('sucursal_id', sucursal_id);
        return filtrarRango(q, 'fecha_emision', desde, hasta).order('fecha_emision').order('id');
      }),
      traerTodo(() => {
        let q = db.from('auditoria').select('id, created_at, usuario_id, usuario_nombre, accion, entidad_id, sucursal_id, detalle').in('accion', ACCIONES_RIESGO);
        if (sucursal_id) q = q.eq('sucursal_id', sucursal_id);
        return filtrarRango(q, 'created_at', desde, hasta).order('id');
      }),
      traerTodo(() => {
        let q = db.from('cierres_caja').select('id, cajero_id, sucursal_id, diferencia_efectivo, diferencia_tarjeta, fecha_fin');
        if (sucursal_id) q = q.eq('sucursal_id', sucursal_id);
        return filtrarRango(q, 'fecha_fin', desde, hasta).order('id');
      }),
      db.from('perfiles').select('id, nombre, rol, sin_horario').then((r) => r.data ?? []),
    ]);

    const nombreDe = new Map(perfiles.map((p) => [p.id, p.nombre]));
    const porCajero = new Map();
    const fila = (id) => {
      if (!porCajero.has(id)) {
        porCajero.set(id, {
          cajero_id: id,
          nombre: nombreDe.get(id) ?? 'Desconocido',
          facturas: 0,
          total: 0,
          efectivo: 0,
          con_descuento: 0,
          desc_25: 0,
          desc_10: 0,
          monto_descuentos: 0,
          anuladas: 0,
          monto_anulado: 0,
          descartadas: 0,
          monto_descartado: 0,
          quitados: 0,
          monto_quitado: 0,
          reimpresiones: 0,
          no_impresas: 0,
          faltantes: 0,
          monto_faltante: 0,
          accesos_denegados: 0,
          fuera_horario: 0,
          pantallas: 0,
        });
      }
      return porCajero.get(id);
    };

    const impresas = new Set(eventos.filter((e) => e.accion === 'venta.imprimir_ticket' || e.accion === 'venta.reimprimir_ticket').map((e) => e.entidad_id));

    for (const v of ventas) {
      const f = fila(v.cajero_id);
      if (v.anulada) {
        f.anuladas += 1;
        f.monto_anulado += Number(v.total);
        continue;
      }
      f.facturas += 1;
      f.total += Number(v.total);
      let ef = 0;
      for (const p of v.venta_pagos ?? []) if (p.formas_pago?.nombre === 'Efectivo') ef += Number(p.monto);
      f.efectivo += ef > 0 ? ef - Number(v.cambio ?? 0) : 0;
      const lineasDesc = (v.detalle_venta ?? []).filter((d) => Number(d.descuento) > 0);
      if (lineasDesc.length > 0) f.con_descuento += 1;
      f.desc_25 += lineasDesc.filter((d) => Number(d.descuento_porcentaje) === 25).length;
      f.desc_10 += lineasDesc.filter((d) => Number(d.descuento_porcentaje) === 10).length;
      f.monto_descuentos += Number(v.descuento ?? 0);
      if (!impresas.has(v.id)) f.no_impresas += 1;
    }

    const recientes = [];
    for (const e of eventos) {
      if (!e.usuario_id) continue;
      const f = fila(e.usuario_id);
      const d = e.detalle ?? {};
      if (e.accion === 'venta.descartar_orden') {
        f.descartadas += 1;
        f.monto_descartado += Number(d.total ?? 0);
      } else if (e.accion === 'orden.quitar_producto') {
        f.quitados += Number(d.cantidad ?? 1);
        f.monto_quitado += Number(d.monto ?? 0);
      } else if (e.accion === 'venta.reimprimir_ticket') {
        f.reimpresiones += 1;
      } else if (e.accion === 'acceso.denegado') {
        f.accesos_denegados += 1;
      } else if (e.accion === 'pantalla.ver') {
        f.pantallas += 1;
      }
      if ((e.accion === 'sesion.inicio' || e.accion === 'pantalla.ver') && (horaHn(e.created_at) < 9 || horaHn(e.created_at) >= 24)) {
        f.fuera_horario += 1;
      }
      if (['venta.descartar_orden', 'orden.quitar_producto', 'venta.reimprimir_ticket', 'acceso.denegado'].includes(e.accion)) {
        recientes.push(e);
      }
    }

    for (const c of cierres) {
      if (Number(c.diferencia_efectivo) <= -1) {
        const f = fila(c.cajero_id);
        f.faltantes += 1;
        f.monto_faltante += Math.abs(Number(c.diferencia_efectivo));
      }
    }

    // Señales: comparan a cada cajero contra el promedio del grupo, para no
    // marcar a todos en un día de muchos descuentos legítimos.
    const filas = [...porCajero.values()].filter((f) => f.facturas + f.anuladas + f.descartadas + f.quitados + f.accesos_denegados + f.pantallas > 0);
    const conVentas = filas.filter((f) => f.facturas > 0);
    const promedio = (fn) => (conVentas.length ? conVentas.reduce((s, f) => s + fn(f), 0) / conVentas.length : 0);
    const promDesc = promedio((f) => f.con_descuento / f.facturas);
    const promAnul = promedio((f) => f.anuladas / (f.facturas || 1));

    for (const f of filas) {
      const s = [];
      const pctDesc = f.facturas ? f.con_descuento / f.facturas : 0;
      if (f.facturas >= 10 && pctDesc > Math.max(0.15, promDesc * 2)) s.push({ nivel: 'alta', texto: `${Math.round(pctDesc * 100)}% de sus facturas llevan descuento` });
      if (f.anuladas >= 2 && f.anuladas / (f.facturas || 1) > promAnul * 1.5) s.push({ nivel: 'alta', texto: `${f.anuladas} facturas anuladas` });
      if (f.descartadas >= 5 || f.monto_descartado > Math.max(500, f.total * 0.03)) s.push({ nivel: 'media', texto: `${f.descartadas} órdenes descartadas (L ${round2(f.monto_descartado)})` });
      if (f.quitados >= 8 || f.monto_quitado > Math.max(400, f.total * 0.02)) s.push({ nivel: 'media', texto: `${f.quitados} productos quitados de órdenes (L ${round2(f.monto_quitado)})` });
      if (f.no_impresas >= 3 && f.no_impresas > f.facturas * 0.03) s.push({ nivel: 'alta', texto: `${f.no_impresas} facturas nunca se imprimieron (¿el cliente recibió factura?)` });
      if (f.reimpresiones >= 3) s.push({ nivel: 'media', texto: `${f.reimpresiones} reimpresiones de facturas` });
      if (f.faltantes >= 1) s.push({ nivel: 'alta', texto: `${f.faltantes} cierre(s) con faltante (L ${round2(f.monto_faltante)})` });
      if (f.accesos_denegados >= 1) s.push({ nivel: 'media', texto: `${f.accesos_denegados} intento(s) de entrar a funciones sin permiso` });
      if (f.fuera_horario >= 1) s.push({ nivel: 'baja', texto: `${f.fuera_horario} uso(s) del sistema fuera de horario` });
      f.senales = s;
      f.riesgo = s.reduce((acc, x) => acc + (x.nivel === 'alta' ? 3 : x.nivel === 'media' ? 2 : 1), 0);
      for (const k of Object.keys(f)) if (typeof f[k] === 'number' && !Number.isInteger(f[k])) f[k] = round2(f[k]);
      f.ticket_promedio = f.facturas ? round2(f.total / f.facturas) : 0;
      f.pct_efectivo = f.total ? Math.round((f.efectivo / f.total) * 100) : 0;
      f.pct_descuento = Math.round(pctDesc * 100);
    }
    filas.sort((a, b) => b.riesgo - a.riesgo || b.total - a.total);

    // Huecos: más de 45 min sin facturar con la tienda abierta. Puede ser
    // un rato flojo… o ventas que no se están facturando.
    const porSucursalDia = new Map();
    for (const v of ventas) {
      const clave = `${v.sucursal_id}|${fechaHn(v.fecha_emision)}`;
      if (!porSucursalDia.has(clave)) porSucursalDia.set(clave, []);
      porSucursalDia.get(clave).push(v.fecha_emision);
    }
    const { data: sucursales } = await db.from('sucursales').select('id, nombre');
    const nombreSucursal = new Map((sucursales ?? []).map((s) => [s.id, s.nombre]));
    const huecos = [];
    for (const [clave, fechas] of porSucursalDia) {
      if (fechas.length < 5) continue;
      const [sid, dia] = clave.split('|');
      const mins = fechas.map(minutosHn).sort((a, b) => a - b);
      const puntos = [HORA_ABRE * 60, ...mins.filter((m) => m >= HORA_ABRE * 60 && m <= HORA_CIERRA * 60), HORA_CIERRA * 60];
      for (let i = 1; i < puntos.length; i++) {
        const gap = puntos[i] - puntos[i - 1];
        if (gap >= HUECO_MINUTOS) {
          const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
          huecos.push({ sucursal: nombreSucursal.get(sid) ?? '', fecha: dia, desde: hhmm(puntos[i - 1]), hasta: hhmm(puntos[i]), minutos: gap, facturas_dia: fechas.length });
        }
      }
    }
    huecos.sort((a, b) => b.minutos - a.minutos);

    res.json({
      cajeros: filas,
      huecos: huecos.slice(0, 60),
      recientes: recientes.sort((a, b) => b.id - a.id).slice(0, 100),
      totales: { facturas: ventas.filter((v) => !v.anulada).length, eventos: eventos.length },
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

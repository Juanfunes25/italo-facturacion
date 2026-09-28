import { Router } from 'express';
import { db } from '../db.js';
import { calcularTotales, round2 } from '../lib/facturacion.js';
import { generarPdfCotizacion, generarPdfCotizacionBuffer } from '../lib/cotizacionPdf.js';
import { enviarCotizacionCliente } from '../lib/correo.js';
import { registrarAuditoria } from '../lib/auditoria.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  facturarVenta,
  guardarDetalle,
  obtenerPuntoEmisionActivo,
  UMBRAL_RTN_OBLIGATORIO,
} from './ventas.js';

export const cotizaciones = Router();

function calcularTotal(c) {
  return round2(Number(c.cantidad_copitas) * Number(c.precio_copita) + Number(c.costo_servicio || 0) - Number(c.descuento || 0));
}

function rtnLuceValido(rtn) {
  return /^\d{13,14}$/.test(String(rtn).replace(/[-\s]/g, ''));
}

const CAMPOS_EDITABLES = [
  'nombre_cliente',
  'telefono_cliente',
  'email_cliente',
  'rtn_cliente',
  'nombre_evento',
  'fecha_evento',
  'lugar',
  'cantidad_copitas',
  'precio_copita',
  'costo_servicio',
  'descuento',
  'notas',
  'estado',
  'hora_evento',
  'sucursal_id',
  'anticipo',
  'notas_seguimiento',
];

// Lista de control de un evento aceptado, en el orden en que suele ocurrir.
export const ITEMS_CHECKLIST = [
  { clave: 'anticipo', etiqueta: 'Anticipo recibido' },
  { clave: 'sabores', etiqueta: 'Sabores y cantidades confirmados' },
  { clave: 'produccion', etiqueta: 'Producción programada' },
  { clave: 'logistica', etiqueta: 'Transporte, carrito y equipo listos' },
  { clave: 'entrega', etiqueta: 'Montaje / entrega realizada' },
  { clave: 'cobro', etiqueta: 'Saldo cobrado' },
];
const CLAVES_CHECKLIST = new Set(ITEMS_CHECKLIST.map((i) => i.clave));

function fechaValida(f) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(f)) && !Number.isNaN(new Date(`${f}T00:00:00`).getTime());
}

function horaValida(h) {
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(String(h));
}

// Normaliza hora/fecha/anticipo vacíos a null/0 y valida formatos.
function validarAgenda(cambios, totalCotizado) {
  if (cambios.fecha_evento === '') cambios.fecha_evento = null;
  if (cambios.hora_evento === '') cambios.hora_evento = null;
  if (cambios.sucursal_id === '') cambios.sucursal_id = null;
  if (cambios.anticipo === '' || cambios.anticipo === null) cambios.anticipo = 0;
  if (cambios.fecha_evento && !fechaValida(cambios.fecha_evento)) return 'Fecha del evento inválida';
  if (cambios.hora_evento && !horaValida(cambios.hora_evento)) return 'Hora del evento inválida';
  if (cambios.anticipo !== undefined) {
    const anticipo = Number(cambios.anticipo);
    if (!Number.isFinite(anticipo) || anticipo < 0) return 'Anticipo inválido';
    if (totalCotizado !== undefined && anticipo > totalCotizado + 0.001) {
      return 'El anticipo no puede ser mayor que el total de la cotización';
    }
  }
  return null;
}

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
  const errorAgenda = validarAgenda(datos, calcularTotal(datos));
  if (errorAgenda) return res.status(400).json({ error: errorAgenda });
  if (datos.estado === 'facturada') delete datos.estado;
  if (datos.estado === 'aceptada') {
    if (!datos.fecha_evento) return res.status(400).json({ error: 'Para aceptar la cotización indica la fecha del evento' });
    datos.aceptada_at = new Date().toISOString();
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
  const { data: actual } = await db.from('cotizaciones_eventos').select('*').eq('id', req.params.id).maybeSingle();
  if (!actual) return res.status(404).json({ error: 'Cotización no encontrada' });
  if (actual.estado === 'facturada') {
    return res.status(409).json({ error: 'Una cotización ya facturada no se puede modificar' });
  }
  const cambios = limpiarBody(req.body);
  if (cambios.estado === 'facturada') {
    return res.status(400).json({ error: 'Para facturar usa el botón "Facturar", que emite la factura real' });
  }
  const errorAgenda = validarAgenda(cambios, calcularTotal({ ...actual, ...cambios }));
  if (errorAgenda) return res.status(400).json({ error: errorAgenda });

  const seAcepta = cambios.estado === 'aceptada' && actual.estado !== 'aceptada';
  if (seAcepta) {
    const fecha = cambios.fecha_evento !== undefined ? cambios.fecha_evento : actual.fecha_evento;
    if (!fecha) {
      return res.status(400).json({ error: 'Para aceptar la cotización indica la fecha del evento (se agenda en el calendario)' });
    }
    cambios.aceptada_at = new Date().toISOString();
    if (Number(cambios.anticipo ?? actual.anticipo) > 0) {
      const checklist = { ...(actual.checklist || {}) };
      if (!checklist.anticipo?.hecho) {
        checklist.anticipo = { hecho: true, por: req.perfil.nombre, fecha: cambios.aceptada_at };
      }
      cambios.checklist = checklist;
    }
  }

  const { data, error } = await db
    .from('cotizaciones_eventos')
    .update(cambios)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  if (cambios.estado && cambios.estado !== actual.estado) {
    await registrarAuditoria(req, {
      accion: seAcepta ? 'cotizacion.aceptada' : 'cotizacion.cambio_estado',
      entidad: 'cotizacion',
      entidadId: actual.id,
      sucursalId: data.sucursal_id,
      detalle: {
        numero: actual.numero,
        de: actual.estado,
        a: cambios.estado,
        fecha_evento: data.fecha_evento,
        total: calcularTotal(data),
        anticipo: Number(data.anticipo || 0),
      },
    });
  }
  res.json({ ...data, total: calcularTotal(data) });
});

// Seguimiento del evento en el calendario: checklist, hora, sucursal que lo
// atiende, anticipo, notas y reprogramación. Se permite también en
// cotizaciones ya facturadas (se factura antes de que ocurra el evento).
cotizaciones.put('/:id/seguimiento', async (req, res) => {
  const { data: actual } = await db.from('cotizaciones_eventos').select('*').eq('id', req.params.id).maybeSingle();
  if (!actual) return res.status(404).json({ error: 'Cotización no encontrada' });
  if (!['aceptada', 'facturada'].includes(actual.estado)) {
    return res.status(409).json({ error: 'Sólo las cotizaciones aceptadas o facturadas tienen seguimiento en el calendario' });
  }

  const cambios = {};
  for (const campo of ['fecha_evento', 'hora_evento', 'sucursal_id', 'anticipo', 'notas_seguimiento', 'lugar']) {
    if (req.body[campo] !== undefined) cambios[campo] = req.body[campo];
  }
  if (cambios.fecha_evento === '' || cambios.fecha_evento === null) {
    return res.status(400).json({ error: 'Un evento aceptado debe tener fecha' });
  }
  if (cambios.anticipo !== undefined && actual.estado === 'facturada' && Number(cambios.anticipo) !== Number(actual.anticipo)) {
    return res.status(409).json({ error: 'La cotización ya está facturada: el anticipo quedó cerrado en la factura' });
  }
  const errorAgenda = validarAgenda(cambios, calcularTotal(actual));
  if (errorAgenda) return res.status(400).json({ error: errorAgenda });

  const { item, hecho } = req.body;
  if (item !== undefined) {
    if (!CLAVES_CHECKLIST.has(item)) return res.status(400).json({ error: 'Paso de seguimiento desconocido' });
    const checklist = { ...(actual.checklist || {}) };
    checklist[item] = hecho ? { hecho: true, por: req.perfil.nombre, fecha: new Date().toISOString() } : { hecho: false };
    cambios.checklist = checklist;
  }
  if (req.body.realizado !== undefined) cambios.realizado = Boolean(req.body.realizado);
  if (Object.keys(cambios).length === 0) return res.status(400).json({ error: 'Nada que actualizar' });

  const { data, error } = await db
    .from('cotizaciones_eventos')
    .update(cambios)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  const detalle = { numero: actual.numero, evento: actual.nombre_evento };
  if (item !== undefined) detalle.paso = { item, hecho: Boolean(hecho) };
  if (cambios.fecha_evento && cambios.fecha_evento !== actual.fecha_evento) {
    detalle.reprogramado = { de: actual.fecha_evento, a: cambios.fecha_evento };
  }
  for (const campo of ['hora_evento', 'sucursal_id', 'anticipo', 'realizado', 'lugar']) {
    if (cambios[campo] !== undefined && String(cambios[campo] ?? '') !== String(actual[campo] ?? '')) {
      detalle[campo] = { de: actual[campo], a: cambios[campo] };
    }
  }
  if (cambios.notas_seguimiento !== undefined && cambios.notas_seguimiento !== actual.notas_seguimiento) {
    detalle.notas = true;
  }
  await registrarAuditoria(req, {
    accion: detalle.reprogramado ? 'evento.reprogramado' : 'evento.seguimiento',
    entidad: 'cotizacion',
    entidadId: actual.id,
    sucursalId: data.sucursal_id,
    detalle,
  });

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

// Busca el cliente de la cotización en el catálogo de clientes (por RTN, o
// por correo si no hay RTN) y si no existe lo crea — así la factura queda a
// su nombre sin volver a digitar nada.
async function clienteDeCotizacion(cot, rtn) {
  if (rtn) {
    const { data } = await db.from('clientes').select('*').eq('rtn', rtn).limit(1).maybeSingle();
    if (data) return data;
  } else if (cot.email_cliente) {
    const { data } = await db.from('clientes').select('*').ilike('email', cot.email_cliente).limit(1).maybeSingle();
    if (data) return data;
  }
  const { data: nuevo, error } = await db
    .from('clientes')
    .insert({
      nombre: cot.nombre_cliente,
      rtn: rtn || null,
      telefono: cot.telefono_cliente || null,
      email: cot.email_cliente || null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return nuevo;
}

const NOMBRE_FORMA = { efectivo: 'Efectivo', tarjeta: 'Tarjeta', transferencia: 'Transferencia' };

// Cotización → factura en un solo paso: arma las líneas con los mismos
// precios cotizados (copitas + servicio, menos el descuento), emite la
// factura con el correlativo del CAI de la sucursal y marca la cotización
// como facturada. Precios con ISV incluido, igual que el resto del catálogo.
cotizaciones.post('/:id/facturar', requireRole('admin', 'manager'), async (req, res) => {
  let ventaCreadaId = null;
  try {
    const { sucursal_id, forma_pago } = req.body;
    if (!sucursal_id) return res.status(400).json({ error: 'Falta la sucursal que emite la factura' });
    if (!NOMBRE_FORMA[forma_pago]) return res.status(400).json({ error: 'Forma de pago inválida' });

    const { data: cot, error } = await db.from('cotizaciones_eventos').select('*').eq('id', req.params.id).single();
    if (error || !cot) return res.status(404).json({ error: 'Cotización no encontrada' });
    if (cot.venta_id || cot.estado === 'facturada') {
      return res.status(409).json({ error: 'Esta cotización ya fue facturada' });
    }
    if (cot.estado === 'rechazada') {
      return res.status(409).json({ error: 'No se puede facturar una cotización rechazada' });
    }

    const rtn = String(req.body.rtn ?? cot.rtn_cliente ?? '').trim();
    if (rtn && !rtnLuceValido(rtn)) {
      return res.status(400).json({ error: 'El RTN hondureño debe tener 13-14 dígitos — revísalo.' });
    }
    const totalCotizado = calcularTotal(cot);
    if (totalCotizado > UMBRAL_RTN_OBLIGATORIO && !rtn) {
      return res.status(400).json({
        error: `Esta cotización supera L${UMBRAL_RTN_OBLIGATORIO.toLocaleString('es-HN')}: se necesita el RTN del cliente para facturarla.`,
      });
    }
    if (rtn && rtn !== cot.rtn_cliente) {
      await db.from('cotizaciones_eventos').update({ rtn_cliente: rtn }).eq('id', cot.id);
    }

    const cliente = await clienteDeCotizacion(cot, rtn);
    const puntoEmision = await obtenerPuntoEmisionActivo(sucursal_id);

    const lineas = [
      {
        producto_id: null,
        nombre_producto: `Copitas de gelato - ${cot.nombre_evento}`,
        cantidad: Number(cot.cantidad_copitas),
        precio_unitario: Number(cot.precio_copita),
        descuento: 0,
        impuesto_tasa: 0.15,
      },
    ];
    if (Number(cot.costo_servicio) > 0) {
      lineas.push({
        producto_id: null,
        nombre_producto: 'Servicio de evento',
        cantidad: 1,
        precio_unitario: Number(cot.costo_servicio),
        descuento: 0,
        impuesto_tasa: 0.15,
      });
    }
    const totales = calcularTotales(lineas, cliente, Number(cot.descuento || 0));

    const { data: venta, error: errVenta } = await db
      .from('ventas')
      .insert({
        sucursal_id,
        punto_emision_id: puntoEmision.id,
        cliente_id: cliente.id,
        cajero_id: req.perfil.id,
        estado: 'abierta',
        nota_interna: `Cotización de evento No. ${String(cot.numero).padStart(4, '0')}`,
        subtotal_exento: totales.subtotal_exento,
        subtotal_exonerado: totales.subtotal_exonerado,
        subtotal_gravado_15: totales.subtotal_gravado_15,
        descuento: totales.descuento,
        isv_total: totales.isv_total,
        total: totales.total,
      })
      .select()
      .single();
    if (errVenta) throw new Error(errVenta.message);
    ventaCreadaId = venta.id;
    await guardarDetalle(venta.id, totales.lineas);

    const { data: forma } = await db.from('formas_pago').select('id').eq('nombre', NOMBRE_FORMA[forma_pago]).single();
    const factura = await facturarVenta(req, venta.id, {
      pagos: [{ forma_pago_id: forma.id, monto: totales.total }],
      efectivo_recibido: forma_pago === 'efectivo' ? totales.total : 0,
      origen: 'cotizacion',
    });
    ventaCreadaId = null; // ya es una factura emitida: nunca se borra

    await db
      .from('cotizaciones_eventos')
      .update({
        estado: 'facturada',
        venta_id: venta.id,
        aceptada_at: cot.aceptada_at ?? new Date().toISOString(),
        sucursal_id: cot.sucursal_id ?? sucursal_id,
        // Facturar registra el pago completo: el saldo queda cobrado.
        checklist: {
          ...(cot.checklist || {}),
          cobro: { hecho: true, por: req.perfil.nombre, fecha: new Date().toISOString(), factura: factura.numero_factura },
        },
      })
      .eq('id', cot.id);
    await registrarAuditoria(req, {
      accion: 'cotizacion.convertir_factura',
      entidad: 'cotizacion',
      entidadId: cot.id,
      sucursalId: sucursal_id,
      detalle: {
        numero_cotizacion: cot.numero,
        numero_factura: factura.numero_factura,
        venta_id: venta.id,
        total: totales.total,
        cliente: cliente.nombre,
      },
    });

    res.status(201).json(factura);
  } catch (e) {
    // Si la factura no llegó a emitirse (ej. CAI vencido), no se deja la
    // orden a medio crear en Órdenes Abiertas.
    if (ventaCreadaId) {
      await db.from('detalle_venta').delete().eq('venta_id', ventaCreadaId);
      await db.from('ventas').delete().eq('id', ventaCreadaId).eq('estado', 'abierta');
    }
    res.status(e.status ?? 400).json({ error: e.message });
  }
});

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
  const { data: actual } = await db.from('cotizaciones_eventos').select('estado').eq('id', req.params.id).maybeSingle();
  if (actual?.estado === 'facturada') {
    return res.status(409).json({ error: 'Una cotización ya facturada no se puede modificar' });
  }
  const cambios = limpiarBody(req.body);
  if (cambios.estado === 'facturada') {
    return res.status(400).json({ error: 'Para facturar usa el botón "Facturar", que emite la factura real' });
  }
  const { data, error } = await db
    .from('cotizaciones_eventos')
    .update(cambios)
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

    await db.from('cotizaciones_eventos').update({ estado: 'facturada', venta_id: venta.id }).eq('id', cot.id);
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

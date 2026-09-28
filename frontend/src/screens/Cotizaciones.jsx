import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { colorSucursal } from '../lib/coloresSucursal.js';
import { descargarPdf, imprimirTicket, leerConfigImpresora, verPdf } from '../lib/documentos.js';
import CalendarioEventos, { ModalAceptar, horaCorta, situacionEvento } from '../components/CalendarioEventos.jsx';

const UMBRAL_RTN_OBLIGATORIO = 10000;

const VACIO = {
  nombre_cliente: '',
  rtn_cliente: '',
  telefono_cliente: '',
  email_cliente: '',
  nombre_evento: '',
  fecha_evento: '',
  hora_evento: '',
  lugar: '',
  cantidad_copitas: '',
  precio_copita: '',
  costo_servicio: '',
  descuento: '',
  notas: '',
};

// Estados que se pueden elegir a mano. "Facturada" sólo se alcanza con el
// botón Facturar, que emite la factura real.
const ETIQUETA_ESTADO = {
  borrador: 'Borrador',
  enviada: 'Enviada',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
};

const FORMAS_PAGO = [
  { valor: 'efectivo', etiqueta: '💵 Efectivo' },
  { valor: 'tarjeta', etiqueta: '💳 Tarjeta' },
  { valor: 'transferencia', etiqueta: '🏦 Transferencia' },
];

function fmtL(n) {
  return `L ${Number(n || 0).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function calcularTotal(f) {
  const total =
    Number(f.cantidad_copitas || 0) * Number(f.precio_copita || 0) +
    Number(f.costo_servicio || 0) -
    Number(f.descuento || 0);
  return Number.isFinite(total) ? total : 0;
}

function rtnLuceValido(rtn) {
  return /^\d{13,14}$/.test(String(rtn).replace(/[-\s]/g, ''));
}

// Evento dentro de los próximos 7 días que todavía no se confirmó.
function eventoProximo(c) {
  if (!c.fecha_evento || !['borrador', 'enviada'].includes(c.estado)) return false;
  const dias = (new Date(`${c.fecha_evento}T00:00:00`) - new Date()) / 86400000;
  return dias >= 0 && dias <= 7;
}

function ModalFacturar({ cotizacion, sucursal, session, onCerrar, onFacturada }) {
  const [forma, setForma] = useState('transferencia');
  const [rtn, setRtn] = useState(cotizacion.rtn_cliente ?? '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const total = Number(cotizacion.total);
  const requiereRtn = total > UMBRAL_RTN_OBLIGATORIO;
  const rtnInvalido = rtn.trim() !== '' && !rtnLuceValido(rtn);
  const puedeFacturar = !guardando && !rtnInvalido && (!requiereRtn || rtn.trim() !== '');

  async function facturar() {
    setGuardando(true);
    setError('');
    try {
      const factura = await api.post(`/cotizaciones/${cotizacion.id}/facturar`, session, {
        sucursal_id: sucursal.id,
        forma_pago: forma,
        rtn: rtn.trim() || null,
      });
      onFacturada(factura);
    } catch (e) {
      setError(e.message);
      setGuardando(false);
    }
  }

  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="tarjeta" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        <h2>Facturar cotización #{String(cotizacion.numero).padStart(4, '0')}</h2>
        <p style={{ color: 'var(--text-dim)', marginTop: -8 }}>
          Se emite la factura con los mismos productos y precios cotizados — no hay que volver a digitar nada.
        </p>
        {error && <div className="error">{error}</div>}

        <div className="resumen-conversion">
          <div>
            <span>Cliente</span>
            <strong>{cotizacion.nombre_cliente}</strong>
          </div>
          <div>
            <span>Evento</span>
            <strong>{cotizacion.nombre_evento}</strong>
          </div>
          <div>
            <span>{Number(cotizacion.cantidad_copitas).toLocaleString('es-HN')} copitas × {fmtL(cotizacion.precio_copita)}</span>
            <strong>{fmtL(Number(cotizacion.cantidad_copitas) * Number(cotizacion.precio_copita))}</strong>
          </div>
          {Number(cotizacion.costo_servicio) > 0 && (
            <div>
              <span>Servicio de evento</span>
              <strong>{fmtL(cotizacion.costo_servicio)}</strong>
            </div>
          )}
          {Number(cotizacion.descuento) > 0 && (
            <div>
              <span>Descuento</span>
              <strong>-{fmtL(cotizacion.descuento)}</strong>
            </div>
          )}
          <div className="total">
            <span>Total a facturar</span>
            <strong>{fmtL(total)}</strong>
          </div>
        </div>
        {Number(cotizacion.anticipo) > 0 && (
          <p className="aviso-ok" style={{ cursor: 'default' }}>
            Ya se recibió un anticipo de <strong>{fmtL(cotizacion.anticipo)}</strong>: cobra ahora solo el saldo de{' '}
            <strong>{fmtL(Math.max(0, total - Number(cotizacion.anticipo)))}</strong>. La factura sale por el total del evento.
          </p>
        )}

        <div className="sucursal-emisora">
          <span className="leyenda-punto" style={{ background: colorSucursal(sucursal.id) }} />
          Se factura en <strong>{sucursal.nombre}</strong>
        </div>

        <input
          placeholder={requiereRtn ? 'RTN del cliente (obligatorio, supera L10,000)' : 'RTN del cliente (opcional)'}
          value={rtn}
          onChange={(e) => setRtn(e.target.value)}
        />
        {rtnInvalido && (
          <p style={{ color: 'var(--aviso)', fontSize: '0.8em', marginTop: -8 }}>El RTN hondureño tiene 13-14 dígitos.</p>
        )}

        <div style={{ fontSize: '0.85em', color: 'var(--text-dim)', marginBottom: 6 }}>Forma de pago</div>
        <div className="opciones-segmentadas">
          {FORMAS_PAGO.map((f) => (
            <button key={f.valor} className={forma === f.valor ? 'activo' : ''} onClick={() => setForma(f.valor)}>
              {f.etiqueta}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="boton-secundario" onClick={onCerrar} disabled={guardando}>
            Cancelar
          </button>
          <button disabled={!puedeFacturar} onClick={facturar}>
            {guardando ? 'Emitiendo…' : `Emitir factura ${fmtL(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cotizaciones({ session, sucursales, sucursalId }) {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [enviandoId, setEnviandoId] = useState(null);
  const [facturando, setFacturando] = useState(null);
  const [aceptando, setAceptando] = useState(null);
  const [pestana, setPestana] = useState('calendario');
  const [abrirEnCalendario, setAbrirEnCalendario] = useState(null);

  const sucursalActiva = sucursales.find((s) => s.id === sucursalId);

  const cotizacionesVisibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return cotizaciones.filter((c) => {
      const coincideTexto =
        !q || c.nombre_cliente.toLowerCase().includes(q) || c.nombre_evento.toLowerCase().includes(q);
      const coincideEstado = !estadoFiltro || c.estado === estadoFiltro;
      return coincideTexto && coincideEstado;
    });
  }, [cotizaciones, busqueda, estadoFiltro]);

  async function cargar() {
    setCotizaciones(await api.get('/cotizaciones', session));
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function accionDocumento(promesa) {
    promesa.catch((e) => setError(e.message));
  }

  async function enviarPorCorreo(c) {
    setEnviandoId(c.id);
    setError('');
    try {
      await api.post(`/cotizaciones/${c.id}/enviar`, session, {});
      setAviso(`Cotización enviada a ${c.email_cliente}.`);
      cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviandoId(null);
    }
  }

  async function crear() {
    setError('');
    setGuardando(true);
    try {
      await api.post('/cotizaciones', session, {
        ...form,
        rtn_cliente: form.rtn_cliente.trim() || null,
        fecha_evento: form.fecha_evento || null,
        hora_evento: form.hora_evento || null,
      });
      setForm(VACIO);
      cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(cot, estado) {
    // Aceptar agenda el evento: se piden fecha, hora, sucursal y anticipo.
    if (estado === 'aceptada') {
      setAceptando(cot);
      return;
    }
    try {
      await api.put(`/cotizaciones/${cot.id}`, session, { estado });
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  async function eliminar(cot) {
    if (!window.confirm(`¿Eliminar la cotización #${String(cot.numero).padStart(4, '0')}?`)) return;
    try {
      await api.del(`/cotizaciones/${cot.id}`, session);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  function alFacturar(factura) {
    setFacturando(null);
    setAviso(`Factura ${factura.numero_factura} emitida${factura.es_borrador ? ' (sin validez fiscal: CAI pendiente)' : ''}.`);
    cargar();
    if (leerConfigImpresora().autoImprimir) {
      imprimirTicket(factura.id, session).catch((e) => setError(`La factura se emitió, pero no se pudo imprimir: ${e.message}`));
    }
  }

  const total = calcularTotal(form);

  function reemplazar(c) {
    setCotizaciones((lista) => lista.map((x) => (x.id === c.id ? { ...x, ...c } : x)));
  }

  const porAtender = cotizaciones.filter((c) => ['urgente', 'vencido'].includes(situacionEvento(c)?.tipo)).length;

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {aviso && (
        <div className="aviso-ok" onClick={() => setAviso('')}>
          {aviso}
        </div>
      )}

      {aceptando && (
        <ModalAceptar
          cotizacion={aceptando}
          sucursales={sucursales}
          sucursalIdDefecto={sucursalId}
          session={session}
          onCerrar={() => setAceptando(null)}
          onAceptada={(c) => {
            setAceptando(null);
            reemplazar(c);
            setAviso(`Cotización #${String(c.numero).padStart(4, '0')} aceptada y agendada en el calendario.`);
          }}
        />
      )}

      <div className="rep-pestanas" role="tablist">
        <button role="tab" aria-selected={pestana === 'calendario'} className={pestana === 'calendario' ? 'activa' : ''} onClick={() => setPestana('calendario')}>
          📅 Calendario de eventos
          {porAtender > 0 && <span className="rep-contador">{porAtender}</span>}
        </button>
        <button role="tab" aria-selected={pestana === 'lista'} className={pestana === 'lista' ? 'activa' : ''} onClick={() => setPestana('lista')}>
          Cotizaciones
        </button>
      </div>

      {pestana === 'calendario' && (
        <CalendarioEventos
          cotizaciones={cotizaciones}
          sucursales={sucursales}
          sucursalIdDefecto={sucursalId}
          session={session}
          abrirId={abrirEnCalendario}
          onAbierto={() => setAbrirEnCalendario(null)}
          onActualizada={reemplazar}
          onFacturar={(c) => (sucursalActiva ? setFacturando(c) : setError('Elige la sucursal que emite la factura'))}
          onVerPdf={(c) => accionDocumento(verPdf(`/cotizaciones/${c.id}/pdf`, session))}
        />
      )}

      {facturando && sucursalActiva && (
        <ModalFacturar
          cotizacion={facturando}
          sucursal={sucursalActiva}
          session={session}
          onCerrar={() => setFacturando(null)}
          onFacturada={alFacturar}
        />
      )}

      {pestana === 'lista' && (
      <>
      <div className="panel">
        <h2>Nueva cotización de evento</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9em', marginTop: -8 }}>
          Cantidad de copitas + costo de servicio — igual a como se cobra hoy. Precios con ISV incluido.
        </p>
        <div className="toolbar">
          <input
            placeholder="Nombre del cliente"
            value={form.nombre_cliente}
            onChange={(e) => setForm({ ...form, nombre_cliente: e.target.value })}
          />
          <input
            placeholder="RTN (si pedirá factura con RTN)"
            value={form.rtn_cliente}
            onChange={(e) => setForm({ ...form, rtn_cliente: e.target.value })}
          />
          <input
            placeholder="Teléfono"
            value={form.telefono_cliente}
            onChange={(e) => setForm({ ...form, telefono_cliente: e.target.value })}
          />
          <input
            placeholder="Correo"
            value={form.email_cliente}
            onChange={(e) => setForm({ ...form, email_cliente: e.target.value })}
          />
        </div>
        <div className="toolbar">
          <input
            placeholder="Nombre del evento (ej. Boda García)"
            value={form.nombre_evento}
            onChange={(e) => setForm({ ...form, nombre_evento: e.target.value })}
          />
          <input
            type="date"
            value={form.fecha_evento}
            onChange={(e) => setForm({ ...form, fecha_evento: e.target.value })}
          />
          <input
            type="time"
            title="Hora del evento"
            value={form.hora_evento}
            onChange={(e) => setForm({ ...form, hora_evento: e.target.value })}
          />
          <input placeholder="Lugar" value={form.lugar} onChange={(e) => setForm({ ...form, lugar: e.target.value })} />
        </div>
        <div className="toolbar">
          <input
            type="number"
            placeholder="Cantidad de copitas"
            value={form.cantidad_copitas}
            onChange={(e) => setForm({ ...form, cantidad_copitas: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio por copita"
            value={form.precio_copita}
            onChange={(e) => setForm({ ...form, precio_copita: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Costo de servicio"
            value={form.costo_servicio}
            onChange={(e) => setForm({ ...form, costo_servicio: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Descuento (L)"
            value={form.descuento}
            onChange={(e) => setForm({ ...form, descuento: e.target.value })}
          />
        </div>
        <textarea
          placeholder="Notas (sabores incluidos, requisitos del lugar, etc.)"
          value={form.notas}
          onChange={(e) => setForm({ ...form, notas: e.target.value })}
          rows={2}
          style={{ fontFamily: 'inherit' }}
        />
        <div className="pos-totales-fila total" style={{ marginBottom: 12 }}>
          <span>Total</span>
          <span>{fmtL(total)}</span>
        </div>
        <button
          disabled={guardando || !form.nombre_cliente || !form.nombre_evento || !form.cantidad_copitas || !form.precio_copita}
          onClick={crear}
        >
          {guardando ? 'Guardando…' : 'Crear cotización'}
        </button>
      </div>

      <div className="panel">
        <h2>Cotizaciones</h2>
        <div className="toolbar">
          <input
            placeholder="Buscar por cliente o evento…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
            <option value="">Todos los estados</option>
            {Object.entries(ETIQUETA_ESTADO).map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>
                {etiqueta}
              </option>
            ))}
            <option value="facturada">Facturada</option>
          </select>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tabla">
            <thead>
              <tr>
                <th>No.</th>
                <th>Cliente</th>
                <th>Evento</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cotizacionesVisibles.map((c) => {
                const facturada = c.estado === 'facturada';
                return (
                  <tr key={c.id}>
                    <td>{String(c.numero).padStart(4, '0')}</td>
                    <td>
                      {c.nombre_cliente}
                      {c.rtn_cliente && (
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.8em' }}>RTN {c.rtn_cliente}</div>
                      )}
                    </td>
                    <td>{c.nombre_evento}</td>
                    <td>
                      {c.fecha_evento ? (
                        <button
                          className="cal-fecha-enlace"
                          title="Ver en el calendario"
                          onClick={() => {
                            setAbrirEnCalendario(c.id);
                            setPestana('calendario');
                          }}
                        >
                          📅 {c.fecha_evento}
                          {c.hora_evento && ` · ${horaCorta(c.hora_evento)}`}
                        </button>
                      ) : (
                        '—'
                      )}
                      {eventoProximo(c) && (
                        <span className="chip" style={{ marginLeft: 6, fontSize: '0.75em', color: 'var(--aviso)', borderColor: 'var(--aviso)' }}>
                          Evento próximo
                        </span>
                      )}
                    </td>
                    <td>{fmtL(c.total)}</td>
                    <td>
                      {facturada ? (
                        <span className="chip" style={{ color: 'var(--ok)', borderColor: 'var(--ok)', marginTop: 0 }}>
                          ✓ Facturada
                        </span>
                      ) : (
                        <select value={c.estado} onChange={(e) => cambiarEstado(c, e.target.value)} style={{ marginBottom: 0 }}>
                          {Object.entries(ETIQUETA_ESTADO).map(([valor, etiqueta]) => (
                            <option key={valor} value={valor}>
                              {etiqueta}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {!facturada && c.estado !== 'rechazada' && (
                        <button className="boton-sm" disabled={!sucursalActiva} onClick={() => setFacturando(c)}>
                          Facturar
                        </button>
                      )}{' '}
                      <button
                        className="boton-sm boton-secundario"
                        onClick={() => accionDocumento(verPdf(`/cotizaciones/${c.id}/pdf`, session))}
                      >
                        Ver PDF
                      </button>{' '}
                      <button
                        className="boton-sm boton-secundario"
                        title="Descargar PDF"
                        onClick={() =>
                          accionDocumento(
                            descargarPdf(`/cotizaciones/${c.id}/pdf`, session, `cotizacion-evento-${c.numero}.pdf`)
                          )
                        }
                      >
                        ⬇
                      </button>{' '}
                      {c.email_cliente && !facturada && (
                        <button
                          className="boton-sm boton-secundario"
                          disabled={enviandoId === c.id}
                          onClick={() => enviarPorCorreo(c)}
                        >
                          {enviandoId === c.id ? 'Enviando…' : 'Enviar por correo'}
                        </button>
                      )}{' '}
                      {c.estado === 'borrador' && (
                        <button className="boton-sm boton-secundario" onClick={() => eliminar(c)}>
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

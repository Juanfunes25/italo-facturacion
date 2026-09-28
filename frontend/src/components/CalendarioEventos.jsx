import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { colorSucursal } from '../lib/coloresSucursal.js';

// Pasos de control de un evento aceptado (mismo orden y claves que el backend).
export const ITEMS_CHECKLIST = [
  { clave: 'anticipo', etiqueta: 'Anticipo recibido' },
  { clave: 'sabores', etiqueta: 'Sabores y cantidades confirmados' },
  { clave: 'produccion', etiqueta: 'Producción programada' },
  { clave: 'logistica', etiqueta: 'Transporte, carrito y equipo listos' },
  { clave: 'entrega', etiqueta: 'Montaje / entrega realizada' },
  { clave: 'cobro', etiqueta: 'Saldo cobrado' },
];

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const CONFIRMADOS = ['aceptada', 'facturada'];

const ETIQUETA_ESTADO = {
  borrador: 'Borrador',
  enviada: 'Enviada',
  aceptada: 'Aceptada',
  facturada: 'Facturada',
  rechazada: 'Rechazada',
};

function fmtL(n) {
  return `L ${Number(n || 0).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function num(n) {
  return Number(n || 0).toLocaleString('es-HN');
}

function claveFecha(anio, mes, dia) {
  return `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

export function hoyClave() {
  const d = new Date();
  return claveFecha(d.getFullYear(), d.getMonth(), d.getDate());
}

function diasHasta(fecha) {
  const [a, m, d] = fecha.split('-').map(Number);
  const [ha, hm, hd] = hoyClave().split('-').map(Number);
  return Math.round((Date.UTC(a, m - 1, d) - Date.UTC(ha, hm - 1, hd)) / 86400000);
}

export function horaCorta(h) {
  if (!h) return '';
  const [hh, mm] = String(h).split(':').map(Number);
  return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${hh >= 12 ? 'p. m.' : 'a. m.'}`;
}

function fechaLarga(fecha) {
  if (!fecha) return 'Sin fecha';
  const [a, m, d] = fecha.split('-').map(Number);
  const texto = new Date(a, m - 1, d).toLocaleDateString('es-HN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Lo que falta cobrar: una cotización facturada o con "Saldo cobrado" ya no debe nada.
export function saldoPendiente(c) {
  if (c.estado === 'facturada' || c.checklist?.cobro?.hecho) return 0;
  return Math.max(0, Number(c.total) - Number(c.anticipo || 0));
}

export function pasosHechos(c) {
  return ITEMS_CHECKLIST.filter((i) => c.checklist?.[i.clave]?.hecho).length;
}

// Situación de un evento confirmado para colorearlo y avisar a tiempo.
export function situacionEvento(c) {
  if (!CONFIRMADOS.includes(c.estado) || !c.fecha_evento) return null;
  const dias = diasHasta(c.fecha_evento);
  const faltan = ITEMS_CHECKLIST.length - pasosHechos(c);
  if (c.realizado && faltan === 0) return { tipo: 'cerrado', texto: 'Evento cerrado' };
  if (dias < 0) return { tipo: 'vencido', texto: c.realizado ? `Realizado · faltan ${faltan} pasos` : 'Pasó la fecha: ciérralo' };
  if (dias <= 3 && faltan > 0) return { tipo: 'urgente', texto: dias === 0 ? `Hoy · faltan ${faltan} pasos` : `En ${dias} día${dias === 1 ? '' : 's'} · faltan ${faltan} pasos` };
  if (faltan === 0) return { tipo: 'listo', texto: 'Todo listo' };
  return { tipo: 'en-curso', texto: `${ITEMS_CHECKLIST.length - faltan}/${ITEMS_CHECKLIST.length} pasos` };
}

function enlaceGoogleCalendar(c) {
  const f = c.fecha_evento.replaceAll('-', '');
  let fechas;
  if (c.hora_evento) {
    const [hh, mm] = c.hora_evento.split(':').map(Number);
    const inicio = `${f}T${String(hh).padStart(2, '0')}${String(mm).padStart(2, '0')}00`;
    const finH = Math.min(hh + 4, 23);
    const fin = `${f}T${String(finH).padStart(2, '0')}${String(mm).padStart(2, '0')}00`;
    fechas = `${inicio}/${fin}`;
  } else {
    const [a, m, d] = c.fecha_evento.split('-').map(Number);
    const sig = new Date(Date.UTC(a, m - 1, d + 1)).toISOString().slice(0, 10).replaceAll('-', '');
    fechas = `${f}/${sig}`;
  }
  const detalles = [
    `Cotización #${String(c.numero).padStart(4, '0')} · ${num(c.cantidad_copitas)} copitas`,
    `Cliente: ${c.nombre_cliente}${c.telefono_cliente ? ` · Tel. ${c.telefono_cliente}` : ''}`,
    `Total: ${fmtL(c.total)}${Number(c.anticipo) > 0 ? ` · Anticipo ${fmtL(c.anticipo)}` : ''}`,
    c.notas || '',
  ]
    .filter(Boolean)
    .join('\n');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Ítalo · ${c.nombre_evento}`,
    dates: fechas,
    ctz: 'America/Tegucigalpa',
    details: detalles,
    location: c.lugar || '',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function enlaceWhatsApp(telefono) {
  let digitos = String(telefono || '').replace(/\D/g, '');
  if (digitos.length === 8) digitos = `504${digitos}`;
  return digitos ? `https://wa.me/${digitos}` : null;
}

// ─────────────────────────────────────────────────────────────────────────
// Modal para aceptar una cotización: la fecha es obligatoria porque el
// evento se agenda en el calendario.
export function ModalAceptar({ cotizacion, sucursales, sucursalIdDefecto, session, onCerrar, onAceptada }) {
  const [fecha, setFecha] = useState(cotizacion.fecha_evento ?? '');
  const [hora, setHora] = useState(cotizacion.hora_evento?.slice(0, 5) ?? '');
  const [sucursalId, setSucursalId] = useState(cotizacion.sucursal_id ?? sucursalIdDefecto ?? '');
  const [anticipo, setAnticipo] = useState(Number(cotizacion.anticipo) > 0 ? String(cotizacion.anticipo) : '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const anticipoNum = Number(anticipo || 0);
  const anticipoInvalido = anticipoNum < 0 || anticipoNum > Number(cotizacion.total) + 0.001;

  async function aceptar() {
    setGuardando(true);
    setError('');
    try {
      const actualizada = await api.put(`/cotizaciones/${cotizacion.id}`, session, {
        estado: 'aceptada',
        fecha_evento: fecha,
        hora_evento: hora || null,
        sucursal_id: sucursalId || null,
        anticipo: anticipoNum,
      });
      onAceptada(actualizada);
    } catch (e) {
      setError(e.message);
      setGuardando(false);
    }
  }

  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="tarjeta" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <h2>Aceptar y agendar evento</h2>
        <p style={{ color: 'var(--text-dim)', marginTop: -8 }}>
          #{String(cotizacion.numero).padStart(4, '0')} · {cotizacion.nombre_evento} · {cotizacion.nombre_cliente} ·{' '}
          <strong>{fmtL(cotizacion.total)}</strong>
        </p>
        {error && <div className="error">{error}</div>}
        <label className="cal-campo">
          <span>Fecha del evento *</span>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </label>
        <label className="cal-campo">
          <span>Hora</span>
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
        </label>
        <label className="cal-campo">
          <span>Sucursal que atiende el evento</span>
          <select value={sucursalId} onChange={(e) => setSucursalId(e.target.value)}>
            <option value="">Sin asignar</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="cal-campo">
          <span>Anticipo recibido (L)</span>
          <input type="number" step="0.01" min="0" placeholder="0.00" value={anticipo} onChange={(e) => setAnticipo(e.target.value)} />
        </label>
        {anticipoInvalido && <p style={{ color: 'var(--aviso)', fontSize: '0.8em', marginTop: -6 }}>El anticipo no puede superar el total.</p>}
        {anticipoNum > 0 && !anticipoInvalido && (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85em', marginTop: -6 }}>
            Saldo pendiente: <strong>{fmtL(Number(cotizacion.total) - anticipoNum)}</strong>
          </p>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="boton-secundario" onClick={onCerrar} disabled={guardando}>
            Cancelar
          </button>
          <button disabled={guardando || !fecha || anticipoInvalido} onClick={aceptar}>
            {guardando ? 'Agendando…' : 'Aceptar y agendar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Ficha de control de un evento: checklist, reprogramación, anticipo, notas.
function ModalEvento({ cotizacion, sucursales, session, onCerrar, onActualizada, onFacturar, onVerPdf, onAceptar }) {
  const [c, setC] = useState(cotizacion);
  const [fecha, setFecha] = useState(cotizacion.fecha_evento ?? '');
  const [hora, setHora] = useState(cotizacion.hora_evento?.slice(0, 5) ?? '');
  const [lugar, setLugar] = useState(cotizacion.lugar ?? '');
  const [anticipo, setAnticipo] = useState(String(Number(cotizacion.anticipo || 0)));
  const [notas, setNotas] = useState(cotizacion.notas_seguimiento ?? '');
  const [guardando, setGuardando] = useState('');
  const [error, setError] = useState('');

  useEffect(() => setC(cotizacion), [cotizacion]);

  const confirmado = CONFIRMADOS.includes(c.estado);
  const facturada = c.estado === 'facturada';
  const hechos = pasosHechos(c);
  const saldo = saldoPendiente(c);
  const situacion = situacionEvento(c);
  const whatsapp = enlaceWhatsApp(c.telefono_cliente);
  const agendaCambiada =
    fecha !== (c.fecha_evento ?? '') ||
    hora !== (c.hora_evento?.slice(0, 5) ?? '') ||
    lugar !== (c.lugar ?? '') ||
    Number(anticipo || 0) !== Number(c.anticipo || 0);

  async function guardar(cambios, etiqueta) {
    setGuardando(etiqueta);
    setError('');
    try {
      const actualizada = await api.put(`/cotizaciones/${c.id}/seguimiento`, session, cambios);
      setC(actualizada);
      onActualizada(actualizada);
      return actualizada;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setGuardando('');
    }
  }

  function guardarAgenda() {
    const cambios = { fecha_evento: fecha, hora_evento: hora || null, lugar };
    if (!facturada) cambios.anticipo = Number(anticipo || 0);
    if (fecha !== c.fecha_evento && !window.confirm(`¿Reprogramar el evento para el ${fechaLarga(fecha)}?`)) return;
    guardar(cambios, 'agenda');
  }

  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="tarjeta cal-ficha" onClick={(e) => e.stopPropagation()}>
        <div className="cal-ficha-cabecera" style={{ '--c-evento': c.sucursal_id ? colorSucursal(c.sucursal_id) : 'var(--primario)' }}>
          <div>
            <div className="cal-ficha-numero">
              Cotización #{String(c.numero).padStart(4, '0')} · <span className={`cal-estado cal-estado-${c.estado}`}>{ETIQUETA_ESTADO[c.estado]}</span>
            </div>
            <h2>{c.nombre_evento}</h2>
            <div className="cal-ficha-fecha">
              {fechaLarga(c.fecha_evento)}
              {c.hora_evento && ` · ${horaCorta(c.hora_evento)}`}
              {c.lugar && ` · ${c.lugar}`}
            </div>
          </div>
          <button className="boton-sm boton-secundario" onClick={onCerrar} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {situacion && <div className={`cal-situacion cal-sit-${situacion.tipo}`}>{situacion.texto}</div>}

        <div className="cal-ficha-grid">
          <div className="cal-dato">
            <span>Cliente</span>
            <strong>{c.nombre_cliente}</strong>
            {c.telefono_cliente && (
              <div className="cal-contacto">
                <a href={`tel:${c.telefono_cliente}`}>📞 {c.telefono_cliente}</a>
                {whatsapp && (
                  <a href={whatsapp} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                )}
              </div>
            )}
            {c.email_cliente && <div className="cal-sub">{c.email_cliente}</div>}
          </div>
          <div className="cal-dato">
            <span>Pedido</span>
            <strong>{num(c.cantidad_copitas)} copitas</strong>
            <div className="cal-sub">
              Total {fmtL(c.total)}
              {Number(c.costo_servicio) > 0 && ` · incluye servicio ${fmtL(c.costo_servicio)}`}
            </div>
          </div>
          <div className="cal-dato">
            <span>Cobro</span>
            <strong>{saldo > 0 ? `Saldo ${fmtL(saldo)}` : 'Cobrado completo'}</strong>
            <div className="cal-sub">
              Anticipo {fmtL(c.anticipo)}
              {facturada && ' · facturada'}
            </div>
          </div>
        </div>

        {c.notas && (
          <div className="cal-notas-cliente">
            <span>Notas de la cotización</span>
            {c.notas}
          </div>
        )}

        {!confirmado ? (
          <div className="cal-tentativo">
            <p>
              Esta cotización todavía está <strong>{ETIQUETA_ESTADO[c.estado].toLowerCase()}</strong>: aparece en el calendario como
              tentativa. Al aceptarla queda confirmada y se habilita la lista de control.
            </p>
            {c.estado !== 'rechazada' && <button onClick={() => onAceptar(c)}>Aceptar y agendar</button>}
          </div>
        ) : (
          <>
            <div className="cal-seccion-titulo">
              Lista de control <span>{hechos}/{ITEMS_CHECKLIST.length}</span>
            </div>
            <div className="cal-progreso">
              <div style={{ width: `${(hechos / ITEMS_CHECKLIST.length) * 100}%` }} />
            </div>
            <div className="cal-checklist">
              {ITEMS_CHECKLIST.map((item) => {
                const estado = c.checklist?.[item.clave];
                const hecho = Boolean(estado?.hecho);
                return (
                  <button
                    key={item.clave}
                    className={`cal-paso ${hecho ? 'hecho' : ''}`}
                    disabled={guardando !== ''}
                    onClick={() => guardar({ item: item.clave, hecho: !hecho }, item.clave)}
                  >
                    <span className="cal-paso-check">{hecho ? '✓' : ''}</span>
                    <span className="cal-paso-texto">
                      {item.etiqueta}
                      {hecho && estado.por && (
                        <small>
                          {estado.por} · {new Date(estado.fecha).toLocaleString('es-HN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                        </small>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="cal-seccion-titulo">Agenda</div>
            <div className="cal-agenda-form">
              <label className="cal-campo">
                <span>Fecha</span>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </label>
              <label className="cal-campo">
                <span>Hora</span>
                <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
              </label>
              <label className="cal-campo">
                <span>Anticipo (L)</span>
                <input type="number" step="0.01" min="0" value={anticipo} disabled={facturada} onChange={(e) => setAnticipo(e.target.value)} />
              </label>
              <label className="cal-campo cal-campo-ancho">
                <span>Lugar</span>
                <input value={lugar} onChange={(e) => setLugar(e.target.value)} />
              </label>
            </div>
            {agendaCambiada && (
              <button className="boton-sm" disabled={!fecha || guardando !== ''} onClick={guardarAgenda} style={{ marginBottom: 12 }}>
                {guardando === 'agenda' ? 'Guardando…' : 'Guardar cambios de agenda'}
              </button>
            )}

            <label className="cal-campo">
              <span>Sucursal que atiende</span>
              <select value={c.sucursal_id ?? ''} disabled={guardando !== ''} onChange={(e) => guardar({ sucursal_id: e.target.value || null }, 'sucursal')}>
                <option value="">Sin asignar</option>
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="cal-campo">
              <span>Notas de seguimiento (internas)</span>
              <textarea rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Ej. el salón abre a las 2 p. m., llevar 2 carritos, contacto del planner…" style={{ fontFamily: 'inherit' }} />
            </label>
            {notas !== (c.notas_seguimiento ?? '') && (
              <button className="boton-sm" disabled={guardando !== ''} onClick={() => guardar({ notas_seguimiento: notas }, 'notas')} style={{ marginBottom: 12 }}>
                {guardando === 'notas' ? 'Guardando…' : 'Guardar notas'}
              </button>
            )}

            <label className="cal-realizado">
              <input type="checkbox" checked={Boolean(c.realizado)} disabled={guardando !== ''} onChange={(e) => guardar({ realizado: e.target.checked }, 'realizado')} />
              El evento ya se realizó
            </label>
          </>
        )}

        <div className="cal-ficha-acciones">
          <button className="boton-sm boton-secundario" onClick={() => onVerPdf(c)}>
            Ver PDF
          </button>
          {c.fecha_evento && (
            <a className="boton-sm boton-secundario cal-enlace-boton" href={enlaceGoogleCalendar(c)} target="_blank" rel="noreferrer">
              + Google Calendar
            </a>
          )}
          {c.estado === 'aceptada' && (
            <button className="boton-sm" onClick={() => onFacturar(c)}>
              Facturar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
export default function CalendarioEventos({ cotizaciones, sucursales, sucursalIdDefecto, session, abrirId, onAbierto, onActualizada, onFacturar, onVerPdf }) {
  const hoy = hoyClave();
  const [mes, setMes] = useState(() => {
    const d = new Date();
    return { anio: d.getFullYear(), mes: d.getMonth() };
  });
  const [verTentativos, setVerTentativos] = useState(true);
  const [filtroSucursal, setFiltroSucursal] = useState('');
  const [diaSeleccionado, setDiaSeleccionado] = useState(hoy);
  const [abierta, setAbierta] = useState(null);
  const [aceptando, setAceptando] = useState(null);

  // Abrir una cotización puntual desde la lista (clic en su fecha).
  useEffect(() => {
    if (!abrirId) return;
    const c = cotizaciones.find((x) => x.id === abrirId);
    if (c?.fecha_evento) {
      const [a, m] = c.fecha_evento.split('-').map(Number);
      setMes({ anio: a, mes: m - 1 });
      setDiaSeleccionado(c.fecha_evento);
      setAbierta(c);
    }
    onAbierto?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abrirId]);

  // Mantener la ficha abierta sincronizada con la lista recargada.
  useEffect(() => {
    if (!abierta) return;
    const fresca = cotizaciones.find((x) => x.id === abierta.id);
    if (fresca && fresca !== abierta) setAbierta(fresca);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cotizaciones]);

  const visibles = useMemo(
    () =>
      cotizaciones.filter((c) => {
        if (!c.fecha_evento || c.estado === 'rechazada') return false;
        if (!verTentativos && !CONFIRMADOS.includes(c.estado)) return false;
        if (filtroSucursal && c.sucursal_id !== filtroSucursal) return false;
        return true;
      }),
    [cotizaciones, verTentativos, filtroSucursal]
  );

  const porDia = useMemo(() => {
    const mapa = new Map();
    for (const c of visibles) {
      if (!mapa.has(c.fecha_evento)) mapa.set(c.fecha_evento, []);
      mapa.get(c.fecha_evento).push(c);
    }
    for (const lista of mapa.values()) {
      lista.sort((a, b) => (CONFIRMADOS.includes(b.estado) - CONFIRMADOS.includes(a.estado)) || String(a.hora_evento ?? '99').localeCompare(String(b.hora_evento ?? '99')));
    }
    return mapa;
  }, [visibles]);

  // Celdas del mes: semanas de lunes a domingo, con días de relleno.
  const celdas = useMemo(() => {
    const primero = new Date(mes.anio, mes.mes, 1);
    const offset = (primero.getDay() + 6) % 7;
    const diasMes = new Date(mes.anio, mes.mes + 1, 0).getDate();
    const total = Math.ceil((offset + diasMes) / 7) * 7;
    return Array.from({ length: total }, (_, i) => {
      const d = new Date(mes.anio, mes.mes, i - offset + 1);
      return { clave: claveFecha(d.getFullYear(), d.getMonth(), d.getDate()), dia: d.getDate(), delMes: d.getMonth() === mes.mes };
    });
  }, [mes]);

  const prefijoMes = `${mes.anio}-${String(mes.mes + 1).padStart(2, '0')}`;
  const kpis = useMemo(() => {
    const delMes = visibles.filter((c) => c.fecha_evento.startsWith(prefijoMes));
    const confirmados = delMes.filter((c) => CONFIRMADOS.includes(c.estado));
    const tentativos = delMes.filter((c) => !CONFIRMADOS.includes(c.estado));
    const monto = confirmados.reduce((s, c) => s + Number(c.total), 0);
    const anticipos = confirmados.reduce((s, c) => s + Number(c.anticipo || 0), 0);
    return {
      confirmados: confirmados.length,
      tentativos: tentativos.length,
      montoTentativo: tentativos.reduce((s, c) => s + Number(c.total), 0),
      copitas: confirmados.reduce((s, c) => s + Number(c.cantidad_copitas), 0),
      monto,
      anticipos,
      saldo: confirmados.reduce((s, c) => s + saldoPendiente(c), 0),
    };
  }, [visibles, prefijoMes]);

  // Próximos 14 días + eventos vencidos sin cerrar: lo que hay que atender.
  const agenda = useMemo(
    () =>
      cotizaciones
        .filter((c) => CONFIRMADOS.includes(c.estado) && c.fecha_evento && (!filtroSucursal || c.sucursal_id === filtroSucursal))
        .filter((c) => {
          const dias = diasHasta(c.fecha_evento);
          const sit = situacionEvento(c);
          return (dias >= 0 && dias <= 14) || (dias < 0 && sit?.tipo === 'vencido');
        })
        .sort((a, b) => a.fecha_evento.localeCompare(b.fecha_evento) || String(a.hora_evento ?? '').localeCompare(String(b.hora_evento ?? ''))),
    [cotizaciones, filtroSucursal]
  );

  function moverMes(delta) {
    setMes(({ anio, mes: m }) => {
      const d = new Date(anio, m + delta, 1);
      return { anio: d.getFullYear(), mes: d.getMonth() };
    });
  }

  function irAHoy() {
    const d = new Date();
    setMes({ anio: d.getFullYear(), mes: d.getMonth() });
    setDiaSeleccionado(hoy);
  }

  function alActualizar(c) {
    setAbierta(c);
    onActualizada(c);
  }

  const delDia = porDia.get(diaSeleccionado) ?? [];

  return (
    <div className="cal">
      {abierta && !aceptando && (
        <ModalEvento
          cotizacion={abierta}
          sucursales={sucursales}
          session={session}
          onCerrar={() => setAbierta(null)}
          onActualizada={alActualizar}
          onFacturar={(c) => {
            setAbierta(null);
            onFacturar(c);
          }}
          onVerPdf={onVerPdf}
          onAceptar={(c) => setAceptando(c)}
        />
      )}
      {aceptando && (
        <ModalAceptar
          cotizacion={aceptando}
          sucursales={sucursales}
          sucursalIdDefecto={sucursalIdDefecto}
          session={session}
          onCerrar={() => setAceptando(null)}
          onAceptada={(c) => {
            setAceptando(null);
            alActualizar(c);
          }}
        />
      )}

      <div className="rep-kpis">
        <div className="rep-kpi">
          <span className="rep-kpi-titulo">Eventos confirmados · {MESES[mes.mes]}</span>
          <strong className="rep-kpi-valor">{kpis.confirmados}</strong>
          <span className="rep-kpi-pie">
            {kpis.tentativos > 0 ? `${kpis.tentativos} tentativos por ${fmtL(kpis.montoTentativo)}` : 'Sin tentativos pendientes'}
          </span>
        </div>
        <div className="rep-kpi">
          <span className="rep-kpi-titulo">Copitas a producir</span>
          <strong className="rep-kpi-valor">{num(kpis.copitas)}</strong>
          <span className="rep-kpi-pie">Solo eventos confirmados</span>
        </div>
        <div className="rep-kpi">
          <span className="rep-kpi-titulo">Monto confirmado</span>
          <strong className="rep-kpi-valor">{fmtL(kpis.monto)}</strong>
          <span className="rep-kpi-pie">Anticipos {fmtL(kpis.anticipos)}</span>
        </div>
        <div className="rep-kpi">
          <span className="rep-kpi-titulo">Saldo por cobrar</span>
          <strong className="rep-kpi-valor">{fmtL(kpis.saldo)}</strong>
          <span className="rep-kpi-pie">Confirmados del mes aún sin cobrar</span>
        </div>
      </div>

      <div className="cal-layout">
        <div className="panel cal-panel-mes">
          <div className="cal-barra">
            <div className="cal-nav">
              <button className="boton-sm boton-secundario" onClick={() => moverMes(-1)} aria-label="Mes anterior">
                ‹
              </button>
              <h2>
                {MESES[mes.mes]} {mes.anio}
              </h2>
              <button className="boton-sm boton-secundario" onClick={() => moverMes(1)} aria-label="Mes siguiente">
                ›
              </button>
              <button className="boton-sm boton-secundario" onClick={irAHoy}>
                Hoy
              </button>
            </div>
            <div className="cal-filtros">
              <select value={filtroSucursal} onChange={(e) => setFiltroSucursal(e.target.value)}>
                <option value="">Todas las sucursales</option>
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
              <label className="cal-toggle">
                <input type="checkbox" checked={verTentativos} onChange={(e) => setVerTentativos(e.target.checked)} />
                Ver tentativos
              </label>
            </div>
          </div>

          <div className="cal-grid cal-grid-cabecera">
            {DIAS.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="cal-grid">
            {celdas.map((celda) => {
              const eventos = porDia.get(celda.clave) ?? [];
              const confirmadosDia = eventos.filter((c) => CONFIRMADOS.includes(c.estado));
              const copitasDia = confirmadosDia.reduce((s, c) => s + Number(c.cantidad_copitas), 0);
              const clases = ['cal-celda'];
              if (!celda.delMes) clases.push('fuera');
              if (celda.clave === hoy) clases.push('hoy');
              if (celda.clave === diaSeleccionado) clases.push('seleccionada');
              if (celda.clave < hoy) clases.push('pasada');
              return (
                <div key={celda.clave} className={clases.join(' ')} onClick={() => setDiaSeleccionado(celda.clave)}>
                  <div className="cal-celda-cabecera">
                    <span className="cal-dia">{celda.dia}</span>
                    {confirmadosDia.length > 1 && <span className="cal-multiple" title="Varios eventos el mismo día">{confirmadosDia.length}</span>}
                  </div>
                  {eventos.slice(0, 3).map((c) => {
                    const sit = situacionEvento(c);
                    return (
                      <button
                        key={c.id}
                        className={`cal-pill ${CONFIRMADOS.includes(c.estado) ? 'confirmado' : 'tentativo'} ${sit ? `cal-sit-${sit.tipo}` : ''}`}
                        style={{ '--c-evento': c.sucursal_id ? colorSucursal(c.sucursal_id) : 'var(--primario)' }}
                        title={`${c.nombre_evento} · ${c.nombre_cliente} · ${num(c.cantidad_copitas)} copitas${sit ? ` · ${sit.texto}` : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDiaSeleccionado(celda.clave);
                          setAbierta(c);
                        }}
                      >
                        {c.hora_evento && <b>{horaCorta(c.hora_evento).replace(' ', '').replace('. m.', '')}</b>} {c.nombre_evento}
                      </button>
                    );
                  })}
                  {eventos.length > 3 && <span className="cal-mas">+{eventos.length - 3} más</span>}
                  {copitasDia > 0 && <span className="cal-copitas">{num(copitasDia)} copitas</span>}
                </div>
              );
            })}
          </div>
          <div className="cal-leyenda">
            <span>
              <i className="cal-l-confirmado" /> Confirmado
            </span>
            <span>
              <i className="cal-l-tentativo" /> Tentativo (borrador / enviada)
            </span>
            <span>
              <i className="cal-l-urgente" /> Faltan pasos a ≤3 días
            </span>
            <span>
              <i className="cal-l-listo" /> Todo listo
            </span>
          </div>
        </div>

        <div className="cal-lateral">
          <div className="panel">
            <h2 className="cal-lateral-titulo">{fechaLarga(diaSeleccionado)}</h2>
            {delDia.length === 0 ? (
              <p className="cal-vacio">Sin eventos este día.</p>
            ) : (
              delDia.map((c) => <TarjetaEvento key={c.id} c={c} onAbrir={() => setAbierta(c)} />)
            )}
          </div>
          <div className="panel">
            <h2 className="cal-lateral-titulo">Por atender · próximos 14 días</h2>
            {agenda.length === 0 ? (
              <p className="cal-vacio">No hay eventos confirmados en los próximos 14 días.</p>
            ) : (
              agenda.map((c) => <TarjetaEvento key={c.id} c={c} conFecha onAbrir={() => setAbierta(c)} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TarjetaEvento({ c, conFecha, onAbrir }) {
  const sit = situacionEvento(c);
  const hechos = pasosHechos(c);
  const confirmado = CONFIRMADOS.includes(c.estado);
  return (
    <button className={`cal-tarjeta ${confirmado ? '' : 'tentativo'}`} style={{ '--c-evento': c.sucursal_id ? colorSucursal(c.sucursal_id) : 'var(--primario)' }} onClick={onAbrir}>
      <div className="cal-tarjeta-fila">
        <strong>{c.nombre_evento}</strong>
        <span className={`cal-estado cal-estado-${c.estado}`}>{ETIQUETA_ESTADO[c.estado]}</span>
      </div>
      <div className="cal-sub">
        {conFecha && `${fechaLarga(c.fecha_evento).split(',').slice(0, 2).join(',')} · `}
        {c.hora_evento ? horaCorta(c.hora_evento) : 'Sin hora'} · {num(c.cantidad_copitas)} copitas · {fmtL(c.total)}
      </div>
      {confirmado && (
        <>
          <div className="cal-progreso cal-progreso-mini">
            <div style={{ width: `${(hechos / ITEMS_CHECKLIST.length) * 100}%` }} />
          </div>
          {sit && <div className={`cal-situacion-mini cal-sit-${sit.tipo}`}>{sit.texto}</div>}
        </>
      )}
    </button>
  );
}

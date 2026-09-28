import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { nombreCortoSucursal } from '../lib/coloresSucursal.js';
import { hoyHn, sumarDias } from '../lib/rangosFecha.js';
import { useCambiosEnVivo } from '../lib/tiempoReal.js';

const ZONA = 'America/Tegucigalpa';
const fechaHora = (iso) => new Date(iso).toLocaleString('es-HN', { timeZone: ZONA, dateStyle: 'short', timeStyle: 'short' });
const L = (n) => `L ${Number(n ?? 0).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ETIQUETA_TIPO = {
  'cierre.descuadre': 'Descuadre de caja',
  'venta.anular': 'Factura anulada',
  'venta.nota_credito': 'Nota de crédito',
  'venta.descartar_orden': 'Orden descartada',
  'acceso.denegado': 'Acceso sin permiso',
  'horario.fuera': 'Fuera de horario',
};

const ETIQUETA_EVENTO = {
  'venta.descartar_orden': 'Descartó una orden',
  'orden.quitar_producto': 'Quitó producto de una orden',
  'venta.reimprimir_ticket': 'Reimprimió factura',
  'acceso.denegado': 'Intentó entrar sin permiso',
};

function resumenEvento(e) {
  const d = e.detalle ?? {};
  if (e.accion === 'orden.quitar_producto') return `${d.cantidad ?? 1} × ${d.producto ?? ''} (${L(d.monto)})`;
  if (e.accion === 'venta.descartar_orden') return `${L(d.total)} · ${(d.items ?? []).join(', ')}`;
  if (e.accion === 'acceso.denegado') return `${d.metodo ?? ''} ${d.ruta ?? ''}${d.motivo ? ` (${d.motivo})` : ''}`;
  if (e.accion === 'venta.reimprimir_ticket') return d.numero_factura ?? '';
  return '';
}

function Alerta({ a, onRevisar }) {
  const [abierta, setAbierta] = useState(false);
  const detalle = Object.entries(a.detalle ?? {}).filter(([, v]) => v !== null && typeof v !== 'object');
  return (
    <div className={`af-alerta af-${a.severidad}${a.revisada ? ' af-revisada' : ''}`}>
      <div className="af-alerta-fila" onClick={() => setAbierta(!abierta)}>
        <span className={`af-sev af-sev-${a.severidad}`}>{a.severidad}</span>
        <div className="af-alerta-texto">
          <strong>{a.titulo}</strong>
          <span>
            {ETIQUETA_TIPO[a.tipo] ?? a.tipo} · {nombreCortoSucursal(a.sucursales?.nombre ?? '') || 'Sin sucursal'} · {a.usuario_nombre ?? '—'} ·{' '}
            {fechaHora(a.created_at)}
          </span>
        </div>
        {!a.revisada ? (
          <button
            className="boton-sm boton-secundario"
            onClick={(e) => {
              e.stopPropagation();
              onRevisar(a);
            }}
          >
            Marcar revisada
          </button>
        ) : (
          <span className="af-revisada-por" title={a.nota_revision ?? ''}>
            ✓ {a.revisor?.nombre ?? ''}
          </span>
        )}
      </div>
      {abierta && (
        <div className="af-alerta-detalle">
          {detalle.map(([k, v]) => (
            <div key={k}>
              <span>{k.replace(/_/g, ' ')}</span>
              <strong>{String(v)}</strong>
            </div>
          ))}
          {a.nota_revision && (
            <div>
              <span>nota de revisión</span>
              <strong>{a.nota_revision}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Antifraude({ session, sucursales }) {
  const [filtros, setFiltros] = useState(() => ({ desde: sumarDias(hoyHn(), -6), hasta: hoyHn(), sucursal_id: '' }));
  const [alertas, setAlertas] = useState([]);
  const [soloPendientes, setSoloPendientes] = useState(true);
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [correo, setCorreo] = useState(null);

  useEffect(() => {
    api.get('/antifraude/correo', session).then(setCorreo).catch(() => {});
  }, [session]);

  const cargarAlertas = useCallback(async () => {
    const params = new URLSearchParams();
    if (soloPendientes) params.set('solo_pendientes', '1');
    if (filtros.sucursal_id) params.set('sucursal_id', filtros.sucursal_id);
    setAlertas(await api.get(`/antifraude/alertas?${params.toString()}`, session));
  }, [session, soloPendientes, filtros.sucursal_id]);

  const cargarIndicadores = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const params = new URLSearchParams({ desde: filtros.desde, hasta: filtros.hasta });
      if (filtros.sucursal_id) params.set('sucursal_id', filtros.sucursal_id);
      setDatos(await api.get(`/antifraude/indicadores?${params.toString()}`, session));
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [session, filtros]);

  useEffect(() => {
    cargarAlertas().catch((e) => setError(e.message));
  }, [cargarAlertas]);

  useEffect(() => {
    cargarIndicadores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Una anulación o un descuadre en cualquier sucursal aparece acá sin recargar.
  useCambiosEnVivo(['ventas', 'cierres_caja'], () => cargarAlertas().catch(() => {}), { retrasoMs: 2500 });

  async function revisar(a) {
    const nota = window.prompt(`Revisar: ${a.titulo}\n\n¿Qué encontraste / qué se hizo? (opcional)`, '');
    if (nota === null) return;
    try {
      await api.put(`/antifraude/alertas/${a.id}/revisar`, session, { nota });
      cargarAlertas();
    } catch (e) {
      setError(e.message);
    }
  }

  const pendientes = alertas.filter((a) => !a.revisada).length;

  return (
    <div className="antifraude">
      {error && <div className="error">{error}</div>}

      <div className="panel">
        <h2>Antifraude</h2>
        <p className="af-intro">
          Todo lo que se hace en el sistema queda en la bitácora inalterable: pantallas abiertas, productos quitados de
          órdenes, descuentos, reimpresiones, anulaciones y accesos sin permiso. Aquí se resume lo que merece revisión.
        </p>
        {correo && !correo.configurado && (
          <div className="alerta">
            El envío de correos no está configurado en el servidor: las alertas se ven aquí pero no llegan por correo. Hay que
            agregar GMAIL_USER y GMAIL_APP_PASSWORD en Render.
          </div>
        )}
        {correo?.configurado && (
          <p className="af-intro">Las alertas graves (descuadres, anulaciones) llegan por correo a: {correo.destinatarios.join(', ')}</p>
        )}
        <div className="toolbar">
          <select value={filtros.sucursal_id} onChange={(e) => setFiltros({ ...filtros, sucursal_id: e.target.value })}>
            <option value="">Todas las sucursales</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {nombreCortoSucursal(s.nombre)}
              </option>
            ))}
          </select>
          <input type="date" value={filtros.desde} max={hoyHn()} onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })} />
          <input type="date" value={filtros.hasta} max={hoyHn()} onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })} />
          <button className="boton-sm" onClick={() => { cargarIndicadores(); cargarAlertas(); }} disabled={cargando}>
            {cargando ? 'Analizando…' : 'Analizar'}
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="af-titulo">
          <h2>Alertas {pendientes > 0 && <span className="nav-contador">{pendientes}</span>}</h2>
          <label className="rep-check">
            <input type="checkbox" checked={soloPendientes} onChange={(e) => setSoloPendientes(e.target.checked)} />
            Sólo pendientes
          </label>
        </div>
        {alertas.length === 0 && <p className="rep-vacio">Sin alertas {soloPendientes ? 'pendientes' : ''}. 👌</p>}
        {alertas.map((a) => (
          <Alerta key={a.id} a={a} onRevisar={revisar} />
        ))}
      </div>

      {datos && (
        <>
          <div className="panel">
            <h2>Señales por cajero</h2>
            <p className="af-intro">
              Cada cajero se compara con el promedio del grupo en el mismo período. Una señal no prueba un robo: indica dónde
              mirar primero (cámaras, bitácora y arqueo sorpresa).
            </p>
            <div className="tabla-scroll">
              <table className="tabla af-tabla">
                <thead>
                  <tr>
                    <th>Cajero</th>
                    <th className="rep-num">Facturas</th>
                    <th className="rep-num">Vendido</th>
                    <th className="rep-num">% efect.</th>
                    <th className="rep-num">% c/desc.</th>
                    <th className="rep-num">3ª edad</th>
                    <th className="rep-num">Anuladas</th>
                    <th className="rep-num">Descartadas</th>
                    <th className="rep-num">Quitados</th>
                    <th className="rep-num">Reimpr.</th>
                    <th className="rep-num">Sin imprimir</th>
                    <th className="rep-num">Faltantes</th>
                    <th className="rep-num">Sin permiso</th>
                    <th>Señales</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.cajeros.length === 0 && (
                    <tr>
                      <td colSpan={14} className="rep-vacio">
                        Sin actividad en el rango.
                      </td>
                    </tr>
                  )}
                  {datos.cajeros.map((c) => (
                    <tr key={c.cajero_id} className={c.riesgo >= 5 ? 'af-fila-alta' : c.riesgo >= 2 ? 'af-fila-media' : ''}>
                      <td>
                        <strong>{c.nombre}</strong>
                      </td>
                      <td className="rep-num">{c.facturas}</td>
                      <td className="rep-num">{L(c.total)}</td>
                      <td className="rep-num">{c.pct_efectivo}%</td>
                      <td className="rep-num">{c.pct_descuento}%</td>
                      <td className="rep-num">{c.desc_25}</td>
                      <td className="rep-num">{c.anuladas}</td>
                      <td className="rep-num" title={L(c.monto_descartado)}>{c.descartadas}</td>
                      <td className="rep-num" title={L(c.monto_quitado)}>{c.quitados}</td>
                      <td className="rep-num">{c.reimpresiones}</td>
                      <td className="rep-num">{c.no_impresas}</td>
                      <td className="rep-num" title={L(c.monto_faltante)}>{c.faltantes}</td>
                      <td className="rep-num">{c.accesos_denegados}</td>
                      <td>
                        <div className="af-senales">
                          {c.senales.length === 0 && <span className="af-ok">Sin señales</span>}
                          {c.senales.map((s) => (
                            <span key={s.texto} className={`af-senal af-senal-${s.nivel}`}>
                              {s.texto}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rep-dos-columnas">
            <div className="panel">
              <h2>Huecos sin facturar</h2>
              <p className="af-intro">
                Más de 45 minutos sin una sola factura con la tienda abierta (11 a. m. – 9 p. m.). Si en ese rato hubo
                clientes (cámaras), hubo ventas sin facturar.
              </p>
              <table className="tabla rep-tabla">
                <thead>
                  <tr>
                    <th>Sucursal</th>
                    <th>Día</th>
                    <th>Entre</th>
                    <th className="rep-num">Minutos</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.huecos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="rep-vacio">
                        Sin huecos largos.
                      </td>
                    </tr>
                  )}
                  {datos.huecos.map((h, i) => (
                    <tr key={i}>
                      <td>{nombreCortoSucursal(h.sucursal)}</td>
                      <td>{h.fecha}</td>
                      <td>
                        {h.desde} – {h.hasta}
                      </td>
                      <td className="rep-num">
                        <strong className={h.minutos >= 90 ? 'rep-alerta' : ''}>{h.minutos}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel">
              <h2>Movimientos sensibles recientes</h2>
              <div className="af-feed">
                {datos.recientes.length === 0 && <p className="rep-vacio">Nada que reportar.</p>}
                {datos.recientes.map((e) => (
                  <div key={e.id} className="af-evento">
                    <span className="af-evento-hora">{fechaHora(e.created_at)}</span>
                    <span>
                      <strong>{e.usuario_nombre}</strong> · {ETIQUETA_EVENTO[e.accion] ?? e.accion}
                      <br />
                      <span className="rep-tenue">{resumenEvento(e)}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel af-consejos">
            <h2>Controles que más ayudan en caja</h2>
            <ul>
              <li>
                <strong>Letrero en caja:</strong> “Si no recibes tu factura, tu gelato es gratis”. Convierte a cada cliente en
                auditor; es el control más efectivo contra ventas sin facturar.
              </li>
              <li>
                <strong>Impresión automática siempre activa</strong> (Impresora → Imprimir al cobrar) y ningún cobro sin ticket;
                la columna “Sin imprimir” delata facturas que no se entregaron.
              </li>
              <li>
                <strong>Cierre ciego</strong> para los cajeros (Usuarios → Cierre ciego): cuentan sin ver cuánto debería haber.
              </li>
              <li>
                <strong>Arqueos sorpresa</strong> a media tarde, sobre todo después de un hueco largo sin facturar.
              </li>
              <li>
                <strong>Cuadre de producto:</strong> bandejas/kg de gelato despachados a la sucursal contra copas y bolas
                facturadas. Si sale más gelato del que se factura, la diferencia se vendió sin factura.
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

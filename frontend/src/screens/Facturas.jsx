import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { colorSucursal } from '../lib/coloresSucursal.js';
import { descargarCsv } from '../lib/csv.js';

export default function Facturas({ session, perfil, sucursales }) {
  const [filtros, setFiltros] = useState({ sucursal_id: '', fechaInicio: '', fechaFin: '', q: '' });
  const [cajeroFiltro, setCajeroFiltro] = useState('');
  const [facturas, setFacturas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [error, setError] = useState('');
  const [motivoAnulacion, setMotivoAnulacion] = useState('');
  const [montoAnulacion, setMontoAnulacion] = useState('');
  const [notasCredito, setNotasCredito] = useState([]);

  const cajerosDisponibles = useMemo(
    () => [...new Set(facturas.map((f) => f.perfiles?.nombre).filter(Boolean))].sort(),
    [facturas]
  );
  const facturasVisibles = useMemo(
    () => (cajeroFiltro ? facturas.filter((f) => f.perfiles?.nombre === cajeroFiltro) : facturas),
    [facturas, cajeroFiltro]
  );

  function exportarCsv() {
    descargarCsv(
      `facturas-${new Date().toISOString().slice(0, 10)}.csv`,
      facturasVisibles,
      [
        { titulo: 'No. Orden', valor: (f) => f.numero_orden },
        { titulo: 'Fecha', valor: (f) => (f.fecha_emision ? new Date(f.fecha_emision).toLocaleString('es-HN') : '') },
        { titulo: 'No. Factura', valor: (f) => f.numero_factura },
        { titulo: 'Cliente', valor: (f) => f.clientes?.nombre ?? 'Consumidor Final' },
        { titulo: 'RTN', valor: (f) => f.clientes?.rtn ?? '' },
        { titulo: 'Impuesto', valor: (f) => Number(f.isv_total).toFixed(2) },
        { titulo: 'Total', valor: (f) => Number(f.total).toFixed(2) },
        { titulo: 'Cajero', valor: (f) => f.perfiles?.nombre ?? '' },
        { titulo: 'Anulada', valor: (f) => (f.anulada ? 'Sí' : 'No') },
      ]
    );
  }

  async function buscar() {
    const params = new URLSearchParams({ estado: 'pagada' });
    if (filtros.sucursal_id) params.set('sucursal_id', filtros.sucursal_id);
    if (filtros.fechaInicio) params.set('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.set('fechaFin', filtros.fechaFin);
    if (filtros.q) params.set('q', filtros.q);
    setFacturas(await api.get(`/ventas?${params.toString()}`, session));
  }

  useEffect(() => {
    buscar().catch((e) => setError(e.message));
  }, []);

  async function verDetalle(id) {
    const detalle = await api.get(`/ventas/${id}`, session);
    setSeleccionada(detalle);
    setMotivoAnulacion('');
    setMontoAnulacion(detalle.total);
    setNotasCredito(perfil.rol === 'cajero' ? [] : await api.get(`/notas-credito?venta_id=${id}`, session));
  }

  async function anular() {
    if (!motivoAnulacion.trim() || !montoAnulacion) return;
    try {
      await api.post('/notas-credito', session, {
        venta_id: seleccionada.id,
        motivo: motivoAnulacion,
        monto: Number(montoAnulacion),
      });
      setSeleccionada(null);
      buscar();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="panel">
        <h2>Listado de facturas</h2>
        <div className="toolbar">
          <select value={filtros.sucursal_id} onChange={(e) => setFiltros({ ...filtros, sucursal_id: e.target.value })}>
            <option value="">Todas las sucursales</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
          <input type="date" value={filtros.fechaInicio} onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })} />
          <input type="date" value={filtros.fechaFin} onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })} />
          <input placeholder="Buscar No. de factura" value={filtros.q} onChange={(e) => setFiltros({ ...filtros, q: e.target.value })} />
          <button className="boton-sm" onClick={buscar}>
            Buscar
          </button>
          {cajerosDisponibles.length > 1 && (
            <select value={cajeroFiltro} onChange={(e) => setCajeroFiltro(e.target.value)}>
              <option value="">Todos los cajeros</option>
              {cajerosDisponibles.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
          <button className="boton-sm boton-secundario" onClick={exportarCsv} disabled={facturasVisibles.length === 0}>
            Exportar CSV
          </button>
        </div>

        <table className="tabla">
          <thead>
            <tr>
              <th>Sucursal</th>
              <th>No. Orden</th>
              <th>Fecha</th>
              <th>No. Factura</th>
              <th>Cliente</th>
              <th>RTN</th>
              <th>Impuesto</th>
              <th>Total</th>
              <th>Cajero</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {facturasVisibles.map((f) => (
              <tr key={f.id} style={f.anulada ? { opacity: 0.5, textDecoration: 'line-through' } : undefined}>
                <td>
                  <span
                    className="leyenda-punto"
                    style={{ background: colorSucursal(f.sucursal_id), display: 'inline-block' }}
                    title="Sucursal"
                  />
                </td>
                <td>{f.numero_orden}</td>
                <td>{f.fecha_emision ? new Date(f.fecha_emision).toLocaleString('es-HN') : '—'}</td>
                <td>{f.numero_factura}</td>
                <td>{f.clientes?.nombre ?? 'Consumidor Final'}</td>
                <td>{f.clientes?.rtn ?? '—'}</td>
                <td>L {Number(f.isv_total).toFixed(2)}</td>
                <td>L {Number(f.total).toFixed(2)}</td>
                <td>{f.perfiles?.nombre ?? '—'}</td>
                <td>
                  <button className="boton-sm boton-secundario" onClick={() => verDetalle(f.id)}>
                    Ver
                  </button>
                  {f.correo_enviado === false && (
                    <span title={`No se pudo enviar el correo: ${f.correo_error ?? ''}`} style={{ marginLeft: 6 }}>
                      ✉️⚠️
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {seleccionada && (
        <div className="overlay" onClick={() => setSeleccionada(null)}>
          <div className="tarjeta" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            {seleccionada.puntos_emision?.es_borrador && (
              <div className="badge-borrador">Sin validez fiscal — CAI pendiente</div>
            )}
            <h2>{seleccionada.numero_factura}</h2>
            <p>
              {seleccionada.clientes?.nombre ?? 'Consumidor Final'}
              {seleccionada.clientes?.rtn ? ` · RTN ${seleccionada.clientes.rtn}` : ''}
            </p>
            {(seleccionada.detalle || []).map((d) => (
              <div key={d.id} className="pos-orden-linea">
                <span>
                  {d.cantidad} × {d.nombre_producto}
                </span>
                <span>L {Number(d.monto).toFixed(2)}</span>
              </div>
            ))}
            <div className="pos-totales-fila total">
              <span>Total</span>
              <span>L {Number(seleccionada.total).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, margin: '10px 0' }}>
              <a
                className="boton-secundario boton-sm"
                style={{ textAlign: 'center', textDecoration: 'none', flex: 1 }}
                href={`/api/ventas/${seleccionada.id}/ticket`}
                target="_blank"
                rel="noreferrer"
              >
                Ticket
              </a>
              <a
                className="boton-secundario boton-sm"
                style={{ textAlign: 'center', textDecoration: 'none', flex: 1 }}
                href={`/api/ventas/${seleccionada.id}/pdf`}
                target="_blank"
                rel="noreferrer"
              >
                PDF
              </a>
            </div>

            {notasCredito.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginBottom: 10 }}>
                <strong style={{ fontSize: '0.9em', color: 'var(--text-dim)' }}>Notas de crédito emitidas</strong>
                {notasCredito.map((n) => (
                  <div key={n.id} className="pos-orden-linea">
                    <span>{n.motivo}</span>
                    <span>L {Number(n.monto).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {perfil.rol === 'admin' && !seleccionada.anulada && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <input
                  placeholder="Motivo de la nota de crédito"
                  value={motivoAnulacion}
                  onChange={(e) => setMotivoAnulacion(e.target.value)}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Monto a anular"
                  value={montoAnulacion}
                  onChange={(e) => setMontoAnulacion(e.target.value)}
                />
                <p style={{ fontSize: '0.8em', color: 'var(--text-dim)', marginTop: -6 }}>
                  Si el monto es igual al total, la factura queda marcada como anulada. Si es menor, se
                  registra como nota de crédito parcial (el correlativo de la factura no se toca).
                </p>
                <button
                  className="boton-peligro"
                  disabled={!motivoAnulacion.trim() || !montoAnulacion}
                  onClick={anular}
                >
                  Emitir nota de crédito
                </button>
              </div>
            )}
            {seleccionada.anulada && <div className="alerta">Esta factura ya fue anulada.</div>}

            <button className="boton-secundario" onClick={() => setSeleccionada(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Facturas({ session, perfil, sucursales }) {
  const [filtros, setFiltros] = useState({ sucursal_id: '', fechaInicio: '', fechaFin: '', q: '' });
  const [facturas, setFacturas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [error, setError] = useState('');
  const [motivoAnulacion, setMotivoAnulacion] = useState('');

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
  }

  async function anular() {
    if (!motivoAnulacion.trim()) return;
    try {
      await api.post('/notas-credito', session, {
        venta_id: seleccionada.id,
        motivo: motivoAnulacion,
        monto: seleccionada.total,
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
        </div>

        <table className="tabla">
          <thead>
            <tr>
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
            {facturas.map((f) => (
              <tr key={f.id} style={f.anulada ? { opacity: 0.5, textDecoration: 'line-through' } : undefined}>
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

            {perfil.rol === 'admin' && !seleccionada.anulada && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <input
                  placeholder="Motivo de anulación"
                  value={motivoAnulacion}
                  onChange={(e) => setMotivoAnulacion(e.target.value)}
                />
                <button className="boton-peligro" disabled={!motivoAnulacion.trim()} onClick={anular}>
                  Anular factura
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

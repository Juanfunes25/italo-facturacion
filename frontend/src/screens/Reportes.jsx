import { useState } from 'react';
import { api } from '../api.js';
import { descargarCsv } from '../lib/csv.js';
import { ATAJOS_FECHA } from '../lib/rangosFecha.js';

function primerDiaMes() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

export default function Reportes({ session, sucursales }) {
  const [filtros, setFiltros] = useState({ sucursal_id: '', fechaInicio: primerDiaMes(), fechaFin: '' });
  const [ventas, setVentas] = useState(null);
  const [isv, setIsv] = useState(null);
  const [error, setError] = useState('');

  async function generar() {
    setError('');
    const params = new URLSearchParams();
    if (filtros.sucursal_id) params.set('sucursal_id', filtros.sucursal_id);
    if (filtros.fechaInicio) params.set('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.set('fechaFin', filtros.fechaFin);
    try {
      setVentas(await api.get(`/reportes/ventas?${params.toString()}`, session));
      setIsv(await api.get(`/reportes/isv?${params.toString()}`, session));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="panel">
        <h2>Reportes</h2>
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
          {ATAJOS_FECHA.map((a) => (
            <button
              key={a.etiqueta}
              className="boton-sm boton-secundario"
              onClick={() => setFiltros({ ...filtros, ...a.calcular() })}
            >
              {a.etiqueta}
            </button>
          ))}
          <button className="boton-sm" onClick={generar}>
            Generar
          </button>
        </div>
      </div>

      {ventas && (
        <div className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Ventas</h2>
            <button
              className="boton-sm boton-secundario"
              onClick={() =>
                descargarCsv(`ventas-${filtros.fechaInicio}-a-${filtros.fechaFin || 'hoy'}.csv`, ventas.por_dia, [
                  { titulo: 'Día', valor: (d) => d.fecha },
                  { titulo: 'Facturas', valor: (d) => d.cantidad_facturas },
                  { titulo: 'Total', valor: (d) => Number(d.total).toFixed(2) },
                ])
              }
            >
              Exportar CSV
            </button>
          </div>
          <p>
            Total: <strong>L {Number(ventas.total).toFixed(2)}</strong> · {ventas.cantidad_facturas} facturas
          </p>
          <table className="tabla">
            <thead>
              <tr>
                <th>Día</th>
                <th>Facturas</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {ventas.por_dia.map((d) => (
                <tr key={d.fecha}>
                  <td>{d.fecha}</td>
                  <td>{d.cantidad_facturas}</td>
                  <td>L {Number(d.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isv && (
        <div className="panel">
          <h2>ISV — base para declaración mensual</h2>
          <table className="tabla">
            <tbody>
              <tr>
                <td>Exento</td>
                <td>L {Number(isv.subtotal_exento).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Exonerado</td>
                <td>L {Number(isv.subtotal_exonerado).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Gravado 15%</td>
                <td>L {Number(isv.subtotal_gravado_15).toFixed(2)}</td>
              </tr>
              <tr>
                <td>
                  <strong>ISV a declarar</strong>
                </td>
                <td>
                  <strong>L {Number(isv.isv_total).toFixed(2)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

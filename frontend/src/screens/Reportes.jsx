import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { descargarCsv } from '../lib/csv.js';
import { ATAJOS_FECHA } from '../lib/rangosFecha.js';

function primerDiaMes() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

const FILTROS_GUARDADOS_KEY = 'italo-facturacion:reportes:filtros';

function cargarFiltrosGuardados() {
  try {
    const guardado = localStorage.getItem(FILTROS_GUARDADOS_KEY);
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
}

// Rango anterior de la misma duración, para comparar (ej. "este mes" vs
// "el mes pasado" en días, no en meses calendario — más simple y sirve
// igual para comparar cualquier rango, no sólo meses completos).
function rangoAnterior(fechaInicio, fechaFin) {
  const inicio = new Date(`${fechaInicio}T00:00:00`);
  const fin = new Date(`${fechaFin || fechaInicio}T00:00:00`);
  const dias = Math.round((fin - inicio) / 86400000) + 1;
  const finAnterior = new Date(inicio);
  finAnterior.setDate(finAnterior.getDate() - 1);
  const inicioAnterior = new Date(finAnterior);
  inicioAnterior.setDate(inicioAnterior.getDate() - (dias - 1));
  const iso = (d) => d.toISOString().slice(0, 10);
  return { fechaInicio: iso(inicioAnterior), fechaFin: iso(finAnterior) };
}

export default function Reportes({ session, sucursales }) {
  const [filtros, setFiltros] = useState(
    () => cargarFiltrosGuardados() ?? { sucursal_id: '', fechaInicio: primerDiaMes(), fechaFin: '' }
  );
  const [ventas, setVentas] = useState(null);
  const [ventasAnterior, setVentasAnterior] = useState(null);
  const [isv, setIsv] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  async function generar() {
    setError('');
    try {
      localStorage.setItem(FILTROS_GUARDADOS_KEY, JSON.stringify(filtros));
    } catch {
      // localStorage puede fallar (privado/bloqueado) — no es crítico, se sigue sin recordar filtros.
    }
    const params = new URLSearchParams();
    if (filtros.sucursal_id) params.set('sucursal_id', filtros.sucursal_id);
    if (filtros.fechaInicio) params.set('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.set('fechaFin', filtros.fechaFin);
    try {
      setVentas(await api.get(`/reportes/ventas?${params.toString()}`, session));
      setIsv(await api.get(`/reportes/isv?${params.toString()}`, session));
      setProductos(await api.get(`/reportes/productos?${params.toString()}`, session));

      if (filtros.fechaInicio) {
        const anterior = rangoAnterior(filtros.fechaInicio, filtros.fechaFin || filtros.fechaInicio);
        const paramsAnterior = new URLSearchParams(params);
        paramsAnterior.set('fechaInicio', anterior.fechaInicio);
        paramsAnterior.set('fechaFin', anterior.fechaFin);
        setVentasAnterior(await api.get(`/reportes/ventas?${paramsAnterior.toString()}`, session));
      } else {
        setVentasAnterior(null);
      }
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    generar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const variacion =
    ventas && ventasAnterior && ventasAnterior.total > 0
      ? Math.round(((ventas.total - ventasAnterior.total) / ventasAnterior.total) * 100)
      : null;

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
            {variacion !== null && (
              <span style={{ color: variacion >= 0 ? '#7ee787' : '#ff8080', marginLeft: 8 }}>
                {variacion >= 0 ? '▲' : '▼'} {Math.abs(variacion)}% vs. el mismo período anterior (L{' '}
                {Number(ventasAnterior.total).toFixed(2)})
              </span>
            )}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>ISV — base para declaración mensual</h2>
            <button
              className="boton-sm boton-secundario"
              onClick={() =>
                descargarCsv(`isv-${filtros.fechaInicio}-a-${filtros.fechaFin || 'hoy'}.csv`, [isv], [
                  { titulo: 'Exento', valor: (d) => Number(d.subtotal_exento).toFixed(2) },
                  { titulo: 'Exonerado', valor: (d) => Number(d.subtotal_exonerado).toFixed(2) },
                  { titulo: 'Gravado 15%', valor: (d) => Number(d.subtotal_gravado_15).toFixed(2) },
                  { titulo: 'ISV a declarar', valor: (d) => Number(d.isv_total).toFixed(2) },
                ])
              }
            >
              Exportar CSV
            </button>
          </div>
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

      {productos.length > 0 && (
        <div className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Top 10 productos vendidos</h2>
            <button
              className="boton-sm boton-secundario"
              onClick={() =>
                descargarCsv(`top-productos-${filtros.fechaInicio}-a-${filtros.fechaFin || 'hoy'}.csv`, productos, [
                  { titulo: 'Producto', valor: (p) => p.nombre },
                  { titulo: 'Cantidad', valor: (p) => p.cantidad },
                  { titulo: 'Total', valor: (p) => Number(p.total).toFixed(2) },
                ])
              }
            >
              Exportar CSV
            </button>
          </div>
          <table className="tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.nombre}>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>L {Number(p.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

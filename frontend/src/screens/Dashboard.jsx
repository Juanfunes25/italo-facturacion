import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { BarraHorizontal, BarrasVerticales, Leyenda } from '../components/Graficas.jsx';

const PALETA = ['var(--serie-1)', 'var(--serie-2)', 'var(--serie-3)', 'var(--serie-4)'];
const COLOR_FORMA_PAGO = { Efectivo: 'var(--serie-1)', Tarjeta: 'var(--serie-2)', Transferencia: 'var(--serie-3)' };

function primerDiaMes() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

const fmtL = (n) => `L ${Number(n).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtEntero = (n) => Number(n).toLocaleString('es-HN');

export default function Dashboard({ session, sucursales }) {
  const [filtros, setFiltros] = useState({ sucursal_id: '', fechaInicio: primerDiaMes(), fechaFin: '' });
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Color fijo por sucursal, estable entre renders (no depende del orden
  // por total, que cambia según el rango de fechas consultado).
  const colorPorSucursal = useMemo(() => {
    const mapa = new Map();
    sucursales.forEach((s, i) => mapa.set(s.id, PALETA[i % PALETA.length]));
    return mapa;
  }, [sucursales]);

  async function consultar() {
    setCargando(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filtros.sucursal_id) params.set('sucursal_id', filtros.sucursal_id);
      if (filtros.fechaInicio) params.set('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin) params.set('fechaFin', filtros.fechaFin);
      setDatos(await api.get(`/dashboard?${params.toString()}`, session));
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    consultar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="panel">
        <h2>Dashboard</h2>
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
          <button className="boton-sm" disabled={cargando} onClick={consultar}>
            {cargando ? 'Consultando…' : 'Consultar'}
          </button>
        </div>
      </div>

      {datos && (
        <>
          <div className="kpi-row">
            <div className="kpi-tile">
              <div className="kpi-label">Total ventas</div>
              <div className="kpi-valor">{fmtL(datos.total)}</div>
            </div>
            <div className="kpi-tile">
              <div className="kpi-label">Facturas</div>
              <div className="kpi-valor">{fmtEntero(datos.cantidad_facturas)}</div>
            </div>
            <div className="kpi-tile">
              <div className="kpi-label">Ticket promedio</div>
              <div className="kpi-valor">{fmtL(datos.ticket_promedio)}</div>
            </div>
            <div className="kpi-tile">
              <div className="kpi-label">ISV</div>
              <div className="kpi-valor">{fmtL(datos.isv_total)}</div>
            </div>
          </div>

          <div className="panel">
            <h2>Formas de pago</h2>
            <Leyenda
              items={datos.formas_pago.map((f) => ({
                nombre: `${f.nombre} · ${f.porcentaje}%`,
                color: COLOR_FORMA_PAGO[f.nombre] ?? 'var(--serie-4)',
              }))}
            />
            <BarraHorizontal
              datos={datos.formas_pago.map((f) => ({ ...f, color: COLOR_FORMA_PAGO[f.nombre] ?? 'var(--serie-4)' }))}
              valorClave="monto"
              etiquetaClave="nombre"
              formatear={fmtL}
            />
          </div>

          <div className="panel">
            <h2>Por sucursal</h2>
            <Leyenda
              items={datos.por_sucursal.map((s) => ({
                nombre: s.nombre,
                color: colorPorSucursal.get(s.sucursal_id) ?? 'var(--serie-1)',
              }))}
            />
            <BarraHorizontal
              datos={datos.por_sucursal.map((s) => ({
                ...s,
                color: colorPorSucursal.get(s.sucursal_id) ?? 'var(--serie-1)',
              }))}
              valorClave="total"
              etiquetaClave="nombre"
              formatear={fmtL}
            />
            <table className="tabla" style={{ marginTop: 12 }}>
              <thead>
                <tr>
                  <th>Sucursal</th>
                  <th>Facturas</th>
                  <th>Ticket promedio</th>
                </tr>
              </thead>
              <tbody>
                {datos.por_sucursal.map((s) => (
                  <tr key={s.sucursal_id}>
                    <td>{s.nombre}</td>
                    <td>{s.facturas}</td>
                    <td>{fmtL(s.ticket_promedio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <h2>Tendencia de ventas</h2>
            <BarrasVerticales
              datos={datos.tendencia_diaria.map((d) => ({
                etiqueta: d.fecha.slice(5),
                valor: d.total,
                color: 'var(--serie-1)',
              }))}
              formatear={fmtL}
            />
          </div>

          <div className="dos-columnas">
            <div className="panel">
              <h2>Top 10 productos</h2>
              <BarraHorizontal
                datos={datos.top_productos.map((p) => ({ ...p, color: 'var(--serie-1)' }))}
                valorClave="cantidad"
                etiquetaClave="nombre"
                formatear={fmtEntero}
              />
            </div>
            <div className="panel">
              <h2>Por categoría</h2>
              <BarraHorizontal
                datos={datos.por_categoria.map((c) => ({ ...c, color: 'var(--serie-2)' }))}
                valorClave="total"
                etiquetaClave="nombre"
                formatear={fmtL}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

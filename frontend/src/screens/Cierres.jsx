import { useEffect, useState } from 'react';
import { api } from '../api.js';

function hoyISO() {
  return new Date().toISOString().slice(0, 16);
}

export default function Cierres({ session, perfil, sucursales }) {
  const [form, setForm] = useState({
    sucursal_id: perfil.sucursal_id ?? sucursales[0]?.id ?? '',
    fecha_inicio: hoyISO(),
    fecha_fin: hoyISO(),
    efectivo_contado: '',
    fondo_caja: '',
    salidas: '',
    propinas: '',
    descuentos: '',
  });
  const [resultado, setResultado] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const puedeVerHistorial = perfil.rol !== 'cajero';

  async function cargarHistorial() {
    if (!puedeVerHistorial) return;
    setHistorial(await api.get('/cierres', session));
  }

  useEffect(() => {
    cargarHistorial().catch((e) => setError(e.message));
  }, []);

  async function cerrar() {
    setGuardando(true);
    setError('');
    try {
      const cierre = await api.post('/cierres', session, {
        ...form,
        efectivo_contado: Number(form.efectivo_contado || 0),
        fondo_caja: Number(form.fondo_caja || 0),
        salidas: Number(form.salidas || 0),
        propinas: Number(form.propinas || 0),
        descuentos: Number(form.descuentos || 0),
      });
      setResultado(cierre);
      cargarHistorial();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="panel">
        <h2>Cierre de caja</h2>
        <div className="toolbar">
          <select value={form.sucursal_id} onChange={(e) => setForm({ ...form, sucursal_id: e.target.value })}>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
          <label style={{ color: 'var(--text-dim)', fontSize: '0.85em' }}>
            Desde
            <input type="datetime-local" value={form.fecha_inicio} onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} />
          </label>
          <label style={{ color: 'var(--text-dim)', fontSize: '0.85em' }}>
            Hasta
            <input type="datetime-local" value={form.fecha_fin} onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} />
          </label>
        </div>
        <div className="toolbar">
          <input
            type="number"
            step="0.01"
            placeholder="Efectivo contado"
            value={form.efectivo_contado}
            onChange={(e) => setForm({ ...form, efectivo_contado: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Fondo de caja"
            value={form.fondo_caja}
            onChange={(e) => setForm({ ...form, fondo_caja: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Salidas"
            value={form.salidas}
            onChange={(e) => setForm({ ...form, salidas: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Propinas"
            value={form.propinas}
            onChange={(e) => setForm({ ...form, propinas: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Descuentos"
            value={form.descuentos}
            onChange={(e) => setForm({ ...form, descuentos: e.target.value })}
          />
        </div>
        {perfil.cierre_ciego && (
          <div className="alerta">Tienes Cierre Ciego activo: no verás el total esperado, sólo lo contado.</div>
        )}
        <button disabled={guardando || !form.efectivo_contado} onClick={cerrar}>
          {guardando ? 'Cerrando…' : 'Cerrar caja'}
        </button>

        {resultado && (
          <div className="alerta" style={{ marginTop: 12 }}>
            Cierre registrado. Facturas {resultado.factura_desde ?? '—'} a {resultado.factura_hasta ?? '—'} (
            {resultado.cantidad_facturas} facturas, L {Number(resultado.total_ventas).toFixed(2)}).
            {!perfil.cierre_ciego && (
              <>
                {' '}
                Esperado: L {Number(resultado.total_esperado).toFixed(2)} · Diferencia: L{' '}
                {Number(resultado.diferencia).toFixed(2)}
              </>
            )}
          </div>
        )}
      </div>

      {puedeVerHistorial && (
        <div className="panel">
          <h2>Historial de cierres</h2>
          <table className="tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Sucursal</th>
                <th>Cajero</th>
                <th>De factura</th>
                <th>A factura</th>
                <th>Esperado</th>
                <th>Contado</th>
                <th>Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.fecha_fin).toLocaleDateString('es-HN')}</td>
                  <td>{c.sucursales?.nombre}</td>
                  <td>{c.cajero?.nombre ?? '—'}</td>
                  <td>{c.factura_desde ?? '—'}</td>
                  <td>{c.factura_hasta ?? '—'}</td>
                  <td>L {Number(c.total_esperado).toFixed(2)}</td>
                  <td>L {Number(c.total_contado).toFixed(2)}</td>
                  <td style={{ color: Number(c.diferencia) !== 0 ? '#ff8080' : undefined }}>
                    L {Number(c.diferencia).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

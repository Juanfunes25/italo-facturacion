import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { colorSucursal } from '../lib/coloresSucursal.js';
import { descargarCsv } from '../lib/csv.js';

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
  const [detalleCierre, setDetalleCierre] = useState(null);
  const [facturasDetalle, setFacturasDetalle] = useState([]);

  const puedeVerHistorial = perfil.rol !== 'cajero';

  async function cargarHistorial() {
    if (!puedeVerHistorial) return;
    setHistorial(await api.get('/cierres', session));
  }

  async function verDetalleCierre(c) {
    setDetalleCierre(c);
    try {
      // Las fechas de un cierre son timestamptz completos (con zona horaria,
      // ej. "+00:00") — hay que codificarlas, si no el "+" se pierde y el
      // rango llega mal al backend.
      const params = new URLSearchParams({
        estado: 'pagada',
        sucursal_id: c.sucursal_id,
        fechaInicio: c.fecha_inicio,
        fechaFin: c.fecha_fin,
      });
      const facturas = await api.get(`/ventas?${params.toString()}`, session);
      setFacturasDetalle(facturas);
    } catch (e) {
      setError(e.message);
    }
  }

  function exportarHistorialCsv() {
    descargarCsv(`cierres-${new Date().toISOString().slice(0, 10)}.csv`, historial, [
      { titulo: 'Fecha', valor: (c) => new Date(c.fecha_fin).toLocaleDateString('es-HN') },
      { titulo: 'Sucursal', valor: (c) => c.sucursales?.nombre ?? '' },
      { titulo: 'Cajero', valor: (c) => c.cajero?.nombre ?? '' },
      { titulo: 'De factura', valor: (c) => c.factura_desde ?? '' },
      { titulo: 'A factura', valor: (c) => c.factura_hasta ?? '' },
      { titulo: 'Esperado', valor: (c) => Number(c.total_esperado).toFixed(2) },
      { titulo: 'Contado', valor: (c) => Number(c.total_contado).toFixed(2) },
      { titulo: 'Diferencia', valor: (c) => Number(c.diferencia).toFixed(2) },
    ]);
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
          <span
            className="leyenda-punto"
            style={{ background: colorSucursal(form.sucursal_id), display: 'inline-block' }}
            title="Color de la sucursal"
          />
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
            {(Number(resultado.propinas) > 0 || Number(resultado.descuentos) > 0) && (
              <>
                {' '}
                · Propinas: L {Number(resultado.propinas).toFixed(2)} · Descuentos: L{' '}
                {Number(resultado.descuentos).toFixed(2)}
              </>
            )}
            {resultado.desglose_pagos?.length > 0 && (
              <div style={{ marginTop: 6 }}>
                {resultado.desglose_pagos.map((p) => (
                  <span key={p.nombre} className="chip" style={{ marginRight: 6 }}>
                    {p.nombre}: L {Number(p.monto).toFixed(2)}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {puedeVerHistorial && (
        <div className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Historial de cierres</h2>
            <button className="boton-sm boton-secundario" onClick={exportarHistorialCsv} disabled={historial.length === 0}>
              Exportar CSV
            </button>
          </div>
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
                <th>Formas de pago</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {historial.map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.fecha_fin).toLocaleDateString('es-HN')}</td>
                  <td>
                    <span
                      className="leyenda-punto"
                      style={{ background: colorSucursal(c.sucursal_id), display: 'inline-block', marginRight: 6 }}
                    />
                    {c.sucursales?.nombre}
                  </td>
                  <td>{c.cajero?.nombre ?? '—'}</td>
                  <td>{c.factura_desde ?? '—'}</td>
                  <td>{c.factura_hasta ?? '—'}</td>
                  <td>L {Number(c.total_esperado).toFixed(2)}</td>
                  <td>L {Number(c.total_contado).toFixed(2)}</td>
                  <td style={{ color: Number(c.diferencia) !== 0 ? '#ff8080' : undefined }}>
                    L {Number(c.diferencia).toFixed(2)}
                  </td>
                  <td style={{ fontSize: '0.85em', color: 'var(--text-dim)' }}>
                    {(c.desglose_pagos ?? []).map((p) => `${p.nombre}: L${Number(p.monto).toFixed(0)}`).join(' · ') ||
                      '—'}
                  </td>
                  <td>
                    <button className="boton-sm boton-secundario" onClick={() => verDetalleCierre(c)}>
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detalleCierre && (
        <div className="overlay" onClick={() => setDetalleCierre(null)}>
          <div className="tarjeta" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <h2>Facturas del cierre</h2>
            <p style={{ color: 'var(--text-dim)' }}>
              {detalleCierre.sucursales?.nombre} · {new Date(detalleCierre.fecha_fin).toLocaleDateString('es-HN')}
            </p>
            {facturasDetalle.length === 0 && <p style={{ color: 'var(--text-dim)' }}>Sin facturas en este rango.</p>}
            {facturasDetalle.map((f) => (
              <div key={f.id} className="pos-orden-linea" style={f.anulada ? { opacity: 0.5, textDecoration: 'line-through' } : undefined}>
                <span>
                  {f.numero_factura} · {f.clientes?.nombre ?? 'Consumidor Final'}
                </span>
                <span>L {Number(f.total).toFixed(2)}</span>
              </div>
            ))}
            <button className="boton-secundario" style={{ marginTop: 10 }} onClick={() => setDetalleCierre(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

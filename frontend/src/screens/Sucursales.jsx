import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { colorSucursal } from '../lib/coloresSucursal.js';

export default function Sucursales({ session, sucursales, onCreada }) {
  const [form, setForm] = useState({ nombre: '', alias: '', direccion: '' });
  const [error, setError] = useState('');
  const [ultimaCreada, setUltimaCreada] = useState(null);
  const [estadosCai, setEstadosCai] = useState([]);

  useEffect(() => {
    api
      .get('/puntos-emision/estado', session)
      .then(setEstadosCai)
      .catch(() => {});
  }, []);

  function estadoCaiDe(sucursalId) {
    return estadosCai.find((e) => e.sucursal_id === sucursalId);
  }

  async function crear() {
    setError('');
    try {
      const sucursal = await api.post('/sucursales', session, form);
      setUltimaCreada(sucursal);
      setForm({ nombre: '', alias: '', direccion: '' });
      onCreada?.();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="panel">
        <h2>Sucursales</h2>
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Alias</th>
              <th>Dirección</th>
              <th>CAI</th>
            </tr>
          </thead>
          <tbody>
            {sucursales.map((s) => {
              const estado = estadoCaiDe(s.id);
              return (
                <tr key={s.id}>
                  <td>
                    <span
                      className="leyenda-punto"
                      style={{ background: colorSucursal(s.id), display: 'inline-block', marginRight: 6 }}
                    />
                    {s.nombre}
                  </td>
                  <td>{s.alias}</td>
                  <td>{s.direccion}</td>
                  <td>
                    {estado?.es_borrador && <span className="badge-borrador">Borrador</span>}
                    {estado && !estado.es_borrador && !estado.alerta && (
                      <span className="chip" style={{ color: '#7ee787', borderColor: '#7ee787' }}>
                        Activo
                      </span>
                    )}
                    {estado && !estado.es_borrador && estado.alerta && (
                      <span className="chip" style={{ color: '#ffb86b', borderColor: '#ffb86b' }}>
                        Por vencer/agotarse
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h2>Nueva sucursal</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9em' }}>
          Se crea con su propio punto de emisión en modo borrador (sin CAI todavía) — lo activas
          después desde "CAI / Puntos de emisión" en cuanto tengas el rango real del SAR.
        </p>
        <div className="toolbar">
          <input
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <input
            placeholder="Alias corto (ej. bulevar)"
            value={form.alias}
            onChange={(e) => setForm({ ...form, alias: e.target.value })}
          />
          <input
            placeholder="Dirección"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
          <button className="boton-sm" disabled={!form.nombre || !form.alias || !form.direccion} onClick={crear}>
            Crear sucursal
          </button>
        </div>
        {ultimaCreada && (
          <div className="alerta">
            Sucursal "{ultimaCreada.nombre}" creada con punto de emisión{' '}
            {ultimaCreada.punto_emision.punto_emision_codigo} en modo borrador.
          </div>
        )}
      </div>
    </div>
  );
}

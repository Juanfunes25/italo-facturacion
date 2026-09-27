import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { colorSucursal } from '../lib/coloresSucursal.js';

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VACIO = {
  email: '',
  password: '',
  nombre: '',
  rol: 'cajero',
  sucursal_id: '',
  cierre_ciego: false,
  sin_horario: false,
};

export default function Usuarios({ session, sucursales }) {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [creando, setCreando] = useState(false);

  async function cargar() {
    setUsuarios(await api.get('/usuarios', session));
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
  }, []);

  async function crear() {
    setError('');
    setCreando(true);
    try {
      await api.post('/usuarios', session, { ...form, sucursal_id: form.sucursal_id || null });
      setForm(VACIO);
      cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setCreando(false);
    }
  }

  async function actualizar(u, cambios) {
    await api.put(`/usuarios/${u.id}`, session, { ...u, ...cambios, sucursal_id: u.sucursal_id ?? null });
    cargar();
  }

  async function restablecerContrasena(u) {
    const nueva = window.prompt(`Nueva contraseña para ${u.nombre} (mínimo 6 caracteres):`);
    if (!nueva) return;
    try {
      await api.post(`/usuarios/${u.id}/reset-password`, session, { password: nueva });
      window.alert('Contraseña actualizada.');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="panel">
        <h2>Nuevo usuario</h2>
        <div className="toolbar">
          <input placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
            <option value="cajero">Cajero</option>
            <option value="manager">Manager</option>
            <option value="admin">Administrador</option>
          </select>
          <select value={form.sucursal_id} onChange={(e) => setForm({ ...form, sucursal_id: e.target.value })}>
            <option value="">Todas las sucursales</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-dim)' }}>
            <input
              type="checkbox"
              style={{ width: 'auto' }}
              checked={form.cierre_ciego}
              onChange={(e) => setForm({ ...form, cierre_ciego: e.target.checked })}
            />
            Cierre ciego
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-dim)' }}>
            <input
              type="checkbox"
              style={{ width: 'auto' }}
              checked={form.sin_horario}
              onChange={(e) => setForm({ ...form, sin_horario: e.target.checked })}
            />
            Sin horario
          </label>
          <button
            className="boton-sm"
            disabled={creando || !CORREO_VALIDO.test(form.email) || form.password.length < 6 || !form.nombre}
            onClick={crear}
          >
            Crear usuario
          </button>
          {form.email && !CORREO_VALIDO.test(form.email) && (
            <span style={{ color: '#ffb86b', fontSize: '0.85em', alignSelf: 'center' }}>Correo inválido</span>
          )}
        </div>
      </div>

      <div className="panel">
        <h2>Usuarios</h2>
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Sucursal</th>
              <th>Cierre ciego</th>
              <th>Activo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.rol}</td>
                <td>
                  {u.sucursal_id && (
                    <span
                      className="leyenda-punto"
                      style={{ background: colorSucursal(u.sucursal_id), display: 'inline-block', marginRight: 6 }}
                    />
                  )}
                  {u.sucursales?.nombre ?? 'Todas'}
                </td>
                <td>{u.cierre_ciego ? 'Sí' : 'No'}</td>
                <td>{u.activo ? 'Sí' : 'No'}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button
                    className="boton-sm boton-secundario"
                    onClick={() => actualizar(u, { activo: !u.activo })}
                  >
                    {u.activo ? 'Desactivar' : 'Activar'}
                  </button>{' '}
                  <button className="boton-sm boton-secundario" onClick={() => restablecerContrasena(u)}>
                    Contraseña
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

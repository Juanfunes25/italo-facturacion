import { useEffect, useState } from 'react';
import { api } from '../api.js';

const VACIO = { nombre: '', rtn: '', direccion: '', telefono: '', email: '', exento_impuestos: false };

export default function Clientes({ session }) {
  const [busqueda, setBusqueda] = useState('');
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');

  async function cargar() {
    setClientes(await api.get(`/clientes?q=${encodeURIComponent(busqueda)}`, session));
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
  }, [busqueda]);

  function editar(c) {
    setEditandoId(c.id);
    setForm({
      nombre: c.nombre,
      rtn: c.rtn ?? '',
      direccion: c.direccion ?? '',
      telefono: c.telefono ?? '',
      email: c.email ?? '',
      exento_impuestos: c.exento_impuestos,
    });
  }

  async function guardar() {
    setError('');
    try {
      if (editandoId) await api.put(`/clientes/${editandoId}`, session, form);
      else await api.post('/clientes', session, form);
      setForm(VACIO);
      setEditandoId(null);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="panel">
        <h2>{editandoId ? 'Editar cliente' : 'Nuevo cliente'}</h2>
        <div className="toolbar">
          <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <input placeholder="RTN" value={form.rtn} onChange={(e) => setForm({ ...form, rtn: e.target.value })} />
          <input
            placeholder="Dirección"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
          <input
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />
          <input placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-dim)' }}>
            <input
              type="checkbox"
              style={{ width: 'auto' }}
              checked={form.exento_impuestos}
              onChange={(e) => setForm({ ...form, exento_impuestos: e.target.checked })}
            />
            Exento de impuestos
          </label>
          <button className="boton-sm" disabled={!form.nombre} onClick={guardar}>
            {editandoId ? 'Guardar' : 'Agregar'}
          </button>
          {editandoId && (
            <button
              className="boton-sm boton-secundario"
              onClick={() => {
                setEditandoId(null);
                setForm(VACIO);
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="panel">
        <h2>Clientes</h2>
        <div className="toolbar">
          <input placeholder="Buscar por nombre o RTN…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RTN</th>
              <th>Teléfono</th>
              <th>Exento</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.rtn ?? '—'}</td>
                <td>{c.telefono ?? '—'}</td>
                <td>{c.exento_impuestos ? 'Sí' : 'No'}</td>
                <td>
                  {!c.es_consumidor_final && (
                    <button className="boton-sm boton-secundario" onClick={() => editar(c)}>
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

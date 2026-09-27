import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';

const fmtL = (n) => `L ${Number(n).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Catalogo({ session }) {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [form, setForm] = useState({ codigo: '', nombre: '', categoria_id: '', precio: '', impuesto1_tasa: '0.15' });
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');

  const productosVisibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter(
      (p) => p.nombre.toLowerCase().includes(q) || (p.codigo ?? '').toLowerCase().includes(q)
    );
  }, [productos, busqueda]);

  async function cargar() {
    setCategorias(await api.get('/categorias', session));
    setProductos(await api.get('/productos?incluirInactivos=true', session));
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
  }, []);

  async function crearCategoria() {
    if (!nuevaCategoria.trim()) return;
    await api.post('/categorias', session, { nombre: nuevaCategoria.trim() });
    setNuevaCategoria('');
    cargar();
  }

  function editar(producto) {
    setEditandoId(producto.id);
    setForm({
      codigo: producto.codigo ?? '',
      nombre: producto.nombre,
      categoria_id: producto.categoria_id ?? '',
      precio: producto.precio,
      impuesto1_tasa: producto.impuesto1_tasa,
    });
  }

  async function guardarProducto() {
    setError('');
    const body = {
      codigo: form.codigo || null,
      nombre: form.nombre,
      categoria_id: form.categoria_id || null,
      precio: Number(form.precio),
      impuesto1_tasa: Number(form.impuesto1_tasa),
    };
    try {
      if (editandoId) await api.put(`/productos/${editandoId}`, session, body);
      else await api.post('/productos', session, body);
      setForm({ codigo: '', nombre: '', categoria_id: '', precio: '', impuesto1_tasa: '0.15' });
      setEditandoId(null);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  async function alternarActivo(producto) {
    if (producto.activo) await api.del(`/productos/${producto.id}`, session);
    else await api.put(`/productos/${producto.id}`, session, { activo: true });
    cargar();
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="panel">
        <h2>Categorías</h2>
        <div className="toolbar">
          {categorias.map((c) => (
            <span key={c.id} className="chip">
              {c.nombre}
            </span>
          ))}
        </div>
        <div className="toolbar">
          <input placeholder="Nueva categoría" value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} />
          <button className="boton-sm" onClick={crearCategoria}>
            Agregar
          </button>
        </div>
      </div>

      <div className="panel">
        <h2>{editandoId ? 'Editar producto' : 'Nuevo producto'}</h2>
        <div className="toolbar">
          <input placeholder="Código" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}>
            <option value="">Sin categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Tasa ISV (0.15)"
            value={form.impuesto1_tasa}
            onChange={(e) => setForm({ ...form, impuesto1_tasa: e.target.value })}
          />
          <button className="boton-sm" disabled={!form.nombre || !form.precio} onClick={guardarProducto}>
            {editandoId ? 'Guardar' : 'Agregar'}
          </button>
          {editandoId && (
            <button
              className="boton-sm boton-secundario"
              onClick={() => {
                setEditandoId(null);
                setForm({ codigo: '', nombre: '', categoria_id: '', precio: '', impuesto1_tasa: '0.15' });
              }}
            >
              Cancelar
            </button>
          )}
        </div>

        <div className="toolbar">
          <input
            placeholder="Buscar por nombre o código…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <table className="tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>ISV</th>
              <th>Activo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productosVisibles.map((p) => (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{p.categorias?.nombre ?? '—'}</td>
                <td>{fmtL(p.precio)}</td>
                <td>{(p.impuesto1_tasa * 100).toFixed(0)}%</td>
                <td>{p.activo ? 'Sí' : 'No'}</td>
                <td>
                  <button className="boton-sm boton-secundario" onClick={() => editar(p)}>
                    Editar
                  </button>{' '}
                  <button className="boton-sm boton-secundario" onClick={() => alternarActivo(p)}>
                    {p.activo ? 'Desactivar' : 'Activar'}
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

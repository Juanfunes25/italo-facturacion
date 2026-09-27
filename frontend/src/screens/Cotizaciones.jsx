import { useEffect, useState } from 'react';
import { api } from '../api.js';

const VACIO = {
  nombre_cliente: '',
  telefono_cliente: '',
  email_cliente: '',
  nombre_evento: '',
  fecha_evento: '',
  lugar: '',
  cantidad_copitas: '',
  precio_copita: '',
  costo_servicio: '',
  descuento: '',
  notas: '',
};

const ETIQUETA_ESTADO = {
  borrador: 'Borrador',
  enviada: 'Enviada',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
};

function calcularTotal(f) {
  const total =
    Number(f.cantidad_copitas || 0) * Number(f.precio_copita || 0) +
    Number(f.costo_servicio || 0) -
    Number(f.descuento || 0);
  return Number.isFinite(total) ? total : 0;
}

export default function Cotizaciones({ session }) {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setCotizaciones(await api.get('/cotizaciones', session));
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
  }, []);

  async function crear() {
    setError('');
    setGuardando(true);
    try {
      await api.post('/cotizaciones', session, form);
      setForm(VACIO);
      cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(cot, estado) {
    await api.put(`/cotizaciones/${cot.id}`, session, { estado });
    cargar();
  }

  async function eliminar(cot) {
    try {
      await api.del(`/cotizaciones/${cot.id}`, session);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  const total = calcularTotal(form);

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="panel">
        <h2>Nueva cotización de evento</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9em', marginTop: -8 }}>
          Cantidad de copitas + costo de servicio — igual a como se cobra hoy.
        </p>
        <div className="toolbar">
          <input
            placeholder="Nombre del cliente"
            value={form.nombre_cliente}
            onChange={(e) => setForm({ ...form, nombre_cliente: e.target.value })}
          />
          <input
            placeholder="Teléfono"
            value={form.telefono_cliente}
            onChange={(e) => setForm({ ...form, telefono_cliente: e.target.value })}
          />
          <input
            placeholder="Correo"
            value={form.email_cliente}
            onChange={(e) => setForm({ ...form, email_cliente: e.target.value })}
          />
        </div>
        <div className="toolbar">
          <input
            placeholder="Nombre del evento (ej. Boda García)"
            value={form.nombre_evento}
            onChange={(e) => setForm({ ...form, nombre_evento: e.target.value })}
          />
          <input
            type="date"
            value={form.fecha_evento}
            onChange={(e) => setForm({ ...form, fecha_evento: e.target.value })}
          />
          <input placeholder="Lugar" value={form.lugar} onChange={(e) => setForm({ ...form, lugar: e.target.value })} />
        </div>
        <div className="toolbar">
          <input
            type="number"
            placeholder="Cantidad de copitas"
            value={form.cantidad_copitas}
            onChange={(e) => setForm({ ...form, cantidad_copitas: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio por copita"
            value={form.precio_copita}
            onChange={(e) => setForm({ ...form, precio_copita: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Costo de servicio"
            value={form.costo_servicio}
            onChange={(e) => setForm({ ...form, costo_servicio: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Descuento"
            value={form.descuento}
            onChange={(e) => setForm({ ...form, descuento: e.target.value })}
          />
        </div>
        <textarea
          placeholder="Notas (sabores incluidos, requisitos del lugar, etc.)"
          value={form.notas}
          onChange={(e) => setForm({ ...form, notas: e.target.value })}
          rows={2}
          style={{
            width: '100%',
            padding: '10px 12px',
            marginBottom: 12,
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--navy)',
            color: 'var(--text)',
            fontFamily: 'inherit',
          }}
        />
        <div className="pos-totales-fila total" style={{ marginBottom: 12 }}>
          <span>Total</span>
          <span>L {total.toFixed(2)}</span>
        </div>
        <button
          disabled={guardando || !form.nombre_cliente || !form.nombre_evento || !form.cantidad_copitas || !form.precio_copita}
          onClick={crear}
        >
          {guardando ? 'Guardando…' : 'Crear cotización'}
        </button>
      </div>

      <div className="panel">
        <h2>Cotizaciones</h2>
        <table className="tabla">
          <thead>
            <tr>
              <th>No.</th>
              <th>Cliente</th>
              <th>Evento</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones.map((c) => (
              <tr key={c.id}>
                <td>{String(c.numero).padStart(4, '0')}</td>
                <td>{c.nombre_cliente}</td>
                <td>{c.nombre_evento}</td>
                <td>{c.fecha_evento ?? '—'}</td>
                <td>L {Number(c.total).toFixed(2)}</td>
                <td>
                  <select value={c.estado} onChange={(e) => cambiarEstado(c, e.target.value)} style={{ marginBottom: 0 }}>
                    {Object.entries(ETIQUETA_ESTADO).map(([valor, etiqueta]) => (
                      <option key={valor} value={valor}>
                        {etiqueta}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <a
                    className="boton-sm boton-secundario"
                    style={{ display: 'inline-block', textDecoration: 'none' }}
                    href={`/api/cotizaciones/${c.id}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    PDF
                  </a>{' '}
                  {c.estado === 'borrador' && (
                    <button className="boton-sm boton-secundario" onClick={() => eliminar(c)}>
                      Eliminar
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

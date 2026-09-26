import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function CajaChica({ session, perfil, sucursales }) {
  const [movimientos, setMovimientos] = useState([]);
  const [form, setForm] = useState({
    sucursal_id: perfil.sucursal_id ?? sucursales[0]?.id ?? '',
    tipo: 'Otros gastos',
    monto: '',
    concepto: '',
  });
  const [error, setError] = useState('');

  async function cargar() {
    setMovimientos(await api.get(`/caja-chica?sucursal_id=${form.sucursal_id}`, session));
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.sucursal_id]);

  async function registrar() {
    setError('');
    try {
      await api.post('/caja-chica', session, { ...form, monto: Number(form.monto) });
      setForm({ ...form, monto: '', concepto: '' });
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="panel">
        <h2>Caja chica</h2>
        <div className="toolbar">
          <select value={form.sucursal_id} onChange={(e) => setForm({ ...form, sucursal_id: e.target.value })}>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
          <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
            {['Agua', 'Alquileres', 'Otros gastos', 'Publicidad y RRPP', 'Reparaciones y conservación', 'Sueldos y salarios', 'Telefonía e internet', 'Transportes'].map(
              (t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              )
            )}
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Monto"
            value={form.monto}
            onChange={(e) => setForm({ ...form, monto: e.target.value })}
          />
          <input
            placeholder="Concepto"
            value={form.concepto}
            onChange={(e) => setForm({ ...form, concepto: e.target.value })}
          />
          <button className="boton-sm" disabled={!form.monto} onClick={registrar}>
            Registrar
          </button>
        </div>

        <table className="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m) => (
              <tr key={m.id}>
                <td>{m.fecha}</td>
                <td>{m.tipo}</td>
                <td>{m.concepto}</td>
                <td>L {Number(m.monto).toFixed(2)}</td>
                <td>{m.perfiles?.nombre ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

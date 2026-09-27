import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function PuntosEmision({ session, perfil }) {
  const [puntos, setPuntos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [eraBorrador, setEraBorrador] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  async function cargar() {
    setPuntos(await api.get('/puntos-emision/estado', session));
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
  }, []);

  function editar(pe) {
    setEditando(pe.id);
    setEraBorrador(pe.es_borrador);
    setForm({
      cai: pe.cai ?? '',
      correlativo_desde: pe.correlativo_desde,
      correlativo_hasta: pe.correlativo_hasta,
      correlativo_actual: pe.correlativo_actual,
      fecha_limite_emision: pe.fecha_limite_emision ?? '',
      es_borrador: pe.es_borrador,
    });
  }

  async function guardar() {
    setError('');
    if (eraBorrador && !form.es_borrador) {
      const confirmado = window.confirm(
        'Vas a activar el CAI como REAL (deja de ser borrador). Desde ese momento, todas las facturas de esta sucursal tendrán validez fiscal. ¿Confirmaste el CAI, el rango y la fecha límite con tu contador? Esto no se puede deshacer fácilmente.'
      );
      if (!confirmado) return;
    }
    try {
      await api.put(`/puntos-emision/${editando}`, session, {
        ...form,
        correlativo_desde: Number(form.correlativo_desde),
        correlativo_hasta: Number(form.correlativo_hasta),
        correlativo_actual: Number(form.correlativo_actual),
        fecha_limite_emision: form.fecha_limite_emision || null,
      });
      setEditando(null);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="panel">
        <h2>Puntos de emisión (CAI)</h2>
        {puntos.map((pe) => (
          <div key={pe.id} className="panel" style={{ background: 'var(--navy)' }}>
            <strong>{pe.sucursales?.nombre}</strong>
            {pe.es_borrador && <div className="badge-borrador">Modo borrador — sin CAI confirmado</div>}
            {pe.alerta && !pe.es_borrador && (
              <div className="alerta">
                {pe.agotado && 'El rango de correlativos está agotado. '}
                {pe.vencido && 'La fecha límite de emisión ya venció. '}
                {!pe.agotado && !pe.vencido && `Quedan ${pe.dias_restantes ?? '?'} días o ${100 - pe.porcentaje_usado}% del rango.`}
              </div>
            )}
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9em' }}>
              CAI: {pe.cai ?? 'sin confirmar'} · Correlativo actual: {pe.correlativo_actual} de {pe.correlativo_desde}–
              {pe.correlativo_hasta} ({pe.porcentaje_usado}% usado) · Vence:{' '}
              {pe.fecha_limite_emision ?? 'sin definir'}
            </p>

            {perfil.rol === 'admin' &&
              (editando === pe.id ? (
                <div className="toolbar">
                  <input placeholder="CAI" value={form.cai} onChange={(e) => setForm({ ...form, cai: e.target.value })} />
                  <input
                    type="number"
                    placeholder="Desde"
                    value={form.correlativo_desde}
                    onChange={(e) => setForm({ ...form, correlativo_desde: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Hasta"
                    value={form.correlativo_hasta}
                    onChange={(e) => setForm({ ...form, correlativo_hasta: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Correlativo actual"
                    value={form.correlativo_actual}
                    onChange={(e) => setForm({ ...form, correlativo_actual: e.target.value })}
                  />
                  <input
                    type="date"
                    value={form.fecha_limite_emision}
                    onChange={(e) => setForm({ ...form, fecha_limite_emision: e.target.value })}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-dim)' }}>
                    <input
                      type="checkbox"
                      style={{ width: 'auto' }}
                      checked={form.es_borrador}
                      onChange={(e) => setForm({ ...form, es_borrador: e.target.checked })}
                    />
                    Modo borrador
                  </label>
                  <button className="boton-sm" onClick={guardar}>
                    Guardar
                  </button>
                  <button className="boton-sm boton-secundario" onClick={() => setEditando(null)}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <button className="boton-sm boton-secundario" onClick={() => editar(pe)}>
                  {pe.es_borrador ? 'Activar CAI real' : 'Editar'}
                </button>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

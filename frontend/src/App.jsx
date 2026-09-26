import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient.js';

async function llamarApi(path, session) {
  const res = await fetch(`/api${path}`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error de red');
  return res.json();
}

function PantallaLogin({ onEntrar }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setCargando(false);
    if (error) return setError(error.message);
    onEntrar(data.session);
  }

  return (
    <div className="pantalla">
      <form className="tarjeta" onSubmit={entrar}>
        <h1>Italo Facturación</h1>
        {error && <div className="error">{error}</div>}
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={cargando} type="submit">
          {cargando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

function PantallaHome({ session, onSalir }) {
  const [perfil, setPerfil] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([llamarApi('/perfil', session), llamarApi('/sucursales', session)])
      .then(([perfil, sucursales]) => {
        setPerfil(perfil);
        setSucursales(sucursales);
      })
      .catch((e) => setError(e.message));
  }, [session]);

  return (
    <div className="pantalla">
      <div className="tarjeta" style={{ maxWidth: 480 }}>
        <h1>Italo Facturación</h1>
        {error && <div className="error">{error}</div>}
        {perfil && (
          <p>
            {perfil.nombre} · <span className="chip">{perfil.rol}</span>
          </p>
        )}
        <h2>Sucursales</h2>
        <ul>
          {sucursales.map((s) => (
            <li key={s.id}>{s.nombre}</li>
          ))}
        </ul>
        <button onClick={onSalir}>Salir</button>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!session) return <PantallaLogin onEntrar={setSession} />;
  return <PantallaHome session={session} onSalir={() => supabase.auth.signOut()} />;
}

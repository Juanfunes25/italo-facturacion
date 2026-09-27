import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient.js';
import { api } from './api.js';
import Pos from './screens/Pos.jsx';
import Facturas from './screens/Facturas.jsx';
import Catalogo from './screens/Catalogo.jsx';
import Clientes from './screens/Clientes.jsx';
import Usuarios from './screens/Usuarios.jsx';
import Cierres from './screens/Cierres.jsx';
import Reportes from './screens/Reportes.jsx';
import PuntosEmision from './screens/PuntosEmision.jsx';
import CajaChica from './screens/CajaChica.jsx';
import Sucursales from './screens/Sucursales.jsx';
import Dashboard from './screens/Dashboard.jsx';
import Cotizaciones from './screens/Cotizaciones.jsx';

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
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
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

const PANTALLAS = [
  { id: 'dashboard', etiqueta: 'Dashboard', roles: ['admin', 'manager'], Componente: Dashboard },
  { id: 'pos', etiqueta: 'Facturación', roles: ['admin', 'manager', 'cajero'], Componente: Pos },
  { id: 'facturas', etiqueta: 'Facturas', roles: ['admin', 'manager', 'cajero'], Componente: Facturas },
  { id: 'cotizaciones', etiqueta: 'Cotización de Eventos', roles: ['admin', 'manager'], Componente: Cotizaciones },
  { id: 'cierres', etiqueta: 'Cierre de caja', roles: ['admin', 'manager', 'cajero'], Componente: Cierres },
  { id: 'catalogo', etiqueta: 'Catálogo', roles: ['admin', 'manager'], Componente: Catalogo },
  { id: 'clientes', etiqueta: 'Clientes', roles: ['admin', 'manager'], Componente: Clientes },
  { id: 'reportes', etiqueta: 'Reportes', roles: ['admin', 'manager'], Componente: Reportes },
  { id: 'caja-chica', etiqueta: 'Caja chica', roles: ['admin', 'manager'], Componente: CajaChica },
  { id: 'puntos-emision', etiqueta: 'CAI / Puntos de emisión', roles: ['admin', 'manager'], Componente: PuntosEmision },
  { id: 'usuarios', etiqueta: 'Usuarios', roles: ['admin'], Componente: Usuarios },
  { id: 'sucursales', etiqueta: 'Sucursales', roles: ['admin'], Componente: Sucursales },
];

function PantallaApp({ session, onSalir }) {
  const [perfil, setPerfil] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  const [error, setError] = useState('');
  const [pantallaActiva, setPantallaActiva] = useState('pos');

  function recargarSucursales() {
    api.get('/sucursales', session).then(setSucursales).catch((e) => setError(e.message));
  }

  useEffect(() => {
    Promise.all([api.get('/perfil', session), api.get('/sucursales', session)])
      .then(([perfil, sucursales]) => {
        setPerfil(perfil);
        setSucursales(sucursales);
      })
      .catch((e) => setError(e.message));
  }, [session]);

  if (error) {
    return (
      <div className="pantalla">
        <div className="tarjeta">
          <div className="error">{error}</div>
          <button onClick={onSalir}>Salir</button>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="pantalla">
        <p>Cargando…</p>
      </div>
    );
  }

  const pantallasVisibles = PANTALLAS.filter((p) => p.roles.includes(perfil.rol));
  const actual = pantallasVisibles.find((p) => p.id === pantallaActiva) ?? pantallasVisibles[0];
  const Componente = actual.Componente;

  return (
    <div className="app-shell">
      <nav className="nav">
        <span className="marca">Italo Facturación</span>
        {pantallasVisibles.map((p) => (
          <button
            key={p.id}
            className={pantallaActiva === p.id ? 'activo' : ''}
            onClick={() => setPantallaActiva(p.id)}
          >
            {p.etiqueta}
          </button>
        ))}
        <button className="salir" onClick={onSalir}>
          {perfil.nombre} · Salir
        </button>
      </nav>
      <div className="contenido">
        <Componente
          session={session}
          perfil={perfil}
          sucursales={sucursales}
          onCreada={recargarSucursales}
          onIrA={setPantallaActiva}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="pantalla">
        <p>Cargando…</p>
      </div>
    );
  }
  if (!session) return <PantallaLogin onEntrar={setSession} />;
  return <PantallaApp session={session} onSalir={() => supabase.auth.signOut()} />;
}

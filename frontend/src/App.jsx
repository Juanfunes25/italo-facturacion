import { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabaseClient.js';
import { api } from './api.js';
import { colorSucursal, nombreCortoSucursal, registrarColoresSucursales } from './lib/coloresSucursal.js';
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
import Impresora from './screens/Impresora.jsx';
import Bitacora from './screens/Bitacora.jsx';
import { useConexionEnVivo } from './lib/tiempoReal.js';
import { accesoAEmail, claveInterna } from './lib/acceso.js';

function PantallaLogin({ onEntrar }) {
  const [acceso, setAcceso] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: await accesoAEmail(acceso),
      password: claveInterna(password),
    });
    setCargando(false);
    if (error) {
      return setError(
        /invalid login credentials/i.test(error.message) ? 'Usuario o contraseña incorrectos' : error.message
      );
    }
    onEntrar(data.session);
  }

  return (
    <div className="pantalla">
      <form className="tarjeta" onSubmit={entrar}>
        <h1>Italo Facturación</h1>
        {error && <div className="error">{error}</div>}
        <input
          placeholder="Usuario o correo"
          autoComplete="username"
          autoCapitalize="none"
          value={acceso}
          onChange={(e) => setAcceso(e.target.value)}
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
  { id: 'bitacora', etiqueta: 'Bitácora', roles: ['admin'], Componente: Bitacora },
  { id: 'impresora', etiqueta: 'Impresora', roles: ['admin', 'manager', 'cajero'], Componente: Impresora },
];

function IndicadorVivo() {
  const conectado = useConexionEnVivo();
  return (
    <span
      className={`nav-vivo ${conectado ? 'conectado' : ''}`}
      title={
        conectado
          ? 'Sincronizado en tiempo real: las ventas y precios de todas las sucursales se actualizan al instante'
          : 'Reconectando la sincronización en tiempo real…'
      }
    >
      <span className="nav-vivo-punto" />
      {conectado ? 'En vivo' : 'Conectando…'}
    </span>
  );
}

function PantallaApp({ session, onSalir }) {
  const [perfil, setPerfil] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  const [error, setError] = useState('');
  const [pantallaActiva, setPantallaActiva] = useState('pos');
  const [filtroFacturas, setFiltroFacturas] = useState(null);
  // Sucursal en la que se está facturando ahora mismo — vive acá (no
  // dentro de cada pantalla) para que el color se pueda aplicar a toda la
  // app (barra de navegación incluida) y no se pierda al cambiar de
  // pantalla y volver.
  const [sucursalActivaId, setSucursalActivaId] = useState('');
  // Facturación avisa cuando hay una orden en curso, para no permitir
  // cambiar de sucursal a medio cobro y mezclar la venta con el punto de
  // emisión de otra sucursal.
  const [carritoOcupado, setCarritoOcupado] = useState(false);

  // "Ver facturas" desde Clientes (y similares) navegan a otra pantalla
  // llevando un filtro ya armado, en vez de que el cajero tenga que
  // volver a escribirlo.
  function irA(id, payload) {
    if (id === 'facturas' && payload) setFiltroFacturas(payload);
    setPantallaActiva(id);
  }

  // El color de cada sucursal viene de la base de datos: se registra antes
  // de guardar la lista para que el primer render ya lo use.
  function fijarSucursales(lista) {
    registrarColoresSucursales(lista);
    setSucursales(lista);
  }

  function recargarSucursales() {
    api.get('/sucursales', session).then(fijarSucursales).catch((e) => setError(e.message));
  }

  useEffect(() => {
    Promise.all([api.get('/perfil', session), api.get('/sucursales', session)])
      .then(([perfil, sucursales]) => {
        setPerfil(perfil);
        fijarSucursales(sucursales);
        setSucursalActivaId((actual) => actual || perfil.sucursal_id || sucursales[0]?.id || '');
      })
      .catch((e) => setError(e.message));
  }, [session]);

  // Un cajero con sucursal fija (perfil.sucursal_id) NUNCA puede cambiarla
  // — así no hay forma de cobrar por error en otra sucursal. Sólo admin/
  // manager sin sucursal fija pueden, y se les pide confirmar cada vez
  // porque es una acción poco frecuente y con consecuencias (factura mal
  // emitida en la sucursal equivocada).
  function cambiarSucursalActiva(nuevoId) {
    const nombre = sucursales.find((s) => s.id === nuevoId)?.nombre ?? '';
    if (!window.confirm(`¿Cambiar a "${nombre}"? Vas a facturar ahí hasta que la cambies de nuevo.`)) return;
    setSucursalActivaId(nuevoId);
  }

  const sucursalActiva = sucursales.find((s) => s.id === sucursalActivaId);
  const colorActivo = useMemo(
    () => colorSucursal(sucursalActivaId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sucursalActivaId, sucursales]
  );

  // Pestaña del navegador y barra de color del sistema (en tablets y
  // celulares) también dicen en qué sucursal se está — útil cuando hay
  // varias ventanas abiertas.
  useEffect(() => {
    const corto = nombreCortoSucursal(sucursalActiva?.nombre);
    document.title = corto ? `${corto} · Italo Facturación` : 'Italo Facturación';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && colorActivo.startsWith('#')) meta.setAttribute('content', colorActivo);
  }, [sucursalActiva?.nombre, colorActivo]);

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
  const puedeCambiarSucursal = !perfil.sucursal_id && sucursales.length > 1;

  return (
    <div className="app-shell" style={{ '--color-sucursal': colorActivo }}>
      <nav className="nav">
        <span className="marca">Italo Facturación</span>

        {sucursalActiva && (
          <div className="nav-sucursal" title="Sucursal activa">
            <span className="nav-sucursal-punto" />
            {puedeCambiarSucursal ? (
              <select
                className="nav-sucursal-select"
                value={sucursalActivaId}
                disabled={carritoOcupado}
                title={carritoOcupado ? 'Termina o descarta la orden en curso para cambiar de sucursal' : undefined}
                onChange={(e) => cambiarSucursalActiva(e.target.value)}
              >
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {nombreCortoSucursal(s.nombre)}
                  </option>
                ))}
              </select>
            ) : (
              <span className="nav-sucursal-nombre">{nombreCortoSucursal(sucursalActiva.nombre)}</span>
            )}
          </div>
        )}

        {pantallasVisibles.map((p) => (
          <button
            key={p.id}
            className={pantallaActiva === p.id ? 'activo' : ''}
            onClick={() => setPantallaActiva(p.id)}
          >
            {p.etiqueta}
          </button>
        ))}
        <IndicadorVivo />
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
          onIrA={irA}
          filtroInicial={actual.id === 'facturas' ? filtroFacturas : null}
          onFiltroInicialUsado={() => setFiltroFacturas(null)}
          sucursalId={sucursalActivaId}
          onCambiarSucursalId={setSucursalActivaId}
          onCarritoOcupado={setCarritoOcupado}
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

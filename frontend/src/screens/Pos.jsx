import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api.js';
import { calcularTotales } from '../lib/facturacion.js';

const CONSUMIDOR_FINAL_NOMBRE = 'Consumidor Final';
const UMBRAL_RTN_OBLIGATORIO = 10000;
const DENOMINACIONES_EFECTIVO = [20, 50, 100, 200, 500, 1000];

function fmtL(n) {
  return `L ${Number(n || 0).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function rtnLuceValido(rtn) {
  if (!rtn) return true; // no bloquea si está vacío, eso lo maneja el umbral obligatorio
  return /^\d{13,14}$/.test(rtn.replace(/[-\s]/g, ''));
}

function SelectorCliente({ session, clienteId, clienteNombre, clienteExento, onSeleccionar }) {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [creando, setCreando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoRtn, setNuevoRtn] = useState('');

  useEffect(() => {
    if (busqueda.trim().length < 2) return setResultados([]);
    const t = setTimeout(() => {
      api.get(`/clientes?q=${encodeURIComponent(busqueda)}`, session).then(setResultados).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [busqueda]);

  async function crearCliente() {
    const cliente = await api.post('/clientes', session, { nombre: nuevoNombre, rtn: nuevoRtn || null });
    onSeleccionar(cliente);
    setCreando(false);
    setNuevoNombre('');
    setNuevoRtn('');
    setBusqueda('');
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: '0.85em', color: 'var(--text-dim)' }}>Cliente</div>
      <div style={{ fontWeight: 600 }}>
        {clienteNombre || CONSUMIDOR_FINAL_NOMBRE}
        {clienteExento && (
          <span className="chip" style={{ marginLeft: 8, fontSize: '0.7em' }}>
            Exento de impuestos
          </span>
        )}
      </div>
      {!creando && (
        <>
          <input
            placeholder="Buscar cliente por nombre o RTN…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {resultados.map((c) => (
            <div
              key={c.id}
              className="boton-sm boton-secundario"
              style={{ width: '100%', marginBottom: 4, cursor: 'pointer' }}
              onClick={() => {
                onSeleccionar(c);
                setBusqueda('');
                setResultados([]);
              }}
            >
              {c.nombre} {c.rtn ? `· ${c.rtn}` : ''}
            </div>
          ))}
          <button className="boton-sm boton-secundario" onClick={() => setCreando(true)}>
            + Nuevo cliente
          </button>
        </>
      )}
      {creando && (
        <>
          <input placeholder="Nombre" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} />
          <input placeholder="RTN (opcional)" value={nuevoRtn} onChange={(e) => setNuevoRtn(e.target.value)} />
          {nuevoRtn && !rtnLuceValido(nuevoRtn) && (
            <p style={{ color: '#ffb86b', fontSize: '0.8em', marginTop: -8 }}>
              El RTN hondureño suele tener 13-14 dígitos — revísalo.
            </p>
          )}
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="boton-sm" disabled={!nuevoNombre} onClick={crearCliente}>
              Guardar
            </button>
            <button className="boton-sm boton-secundario" onClick={() => setCreando(false)}>
              Cancelar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ModalPago({ total, requiereRtn, onCancelar, onConfirmar, guardando }) {
  const [pagos, setPagos] = useState([{ forma: 'efectivo', monto: total.toFixed(2) }]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const totalPagado = pagos.reduce((s, p) => s + Number(p.monto || 0), 0);
  const cambio = Math.max(0, totalPagado - total);
  const puedeConfirmar = !requiereRtn && totalPagado >= total - 0.005;

  function actualizarPago(i, cambios) {
    setPagos((actual) => actual.map((p, idx) => (idx === i ? { ...p, ...cambios } : p)));
  }

  function agregarFormaPago() {
    setPagos((actual) => [...actual, { forma: 'tarjeta', monto: Math.max(0, total - totalPagado).toFixed(2) }]);
  }

  function quitarFormaPago(i) {
    setPagos((actual) => actual.filter((_, idx) => idx !== i));
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') onCancelar();
    if (e.key === 'Enter' && puedeConfirmar && !guardando) confirmar();
  }

  function confirmar() {
    const efectivo = pagos.filter((p) => p.forma === 'efectivo').reduce((s, p) => s + Number(p.monto || 0), 0);
    onConfirmar({ pagos, efectivo });
  }

  return (
    <div className="overlay" onKeyDown={onKeyDown}>
      <div className="tarjeta" style={{ maxWidth: 380 }}>
        <h2>Procesar pago</h2>
        <div className="pos-totales-fila total">
          <span>Total</span>
          <span>{fmtL(total)}</span>
        </div>
        {requiereRtn && (
          <div className="alerta">
            Esta venta supera L{UMBRAL_RTN_OBLIGATORIO.toLocaleString('es-HN')} — se necesita el RTN del cliente
            antes de cobrar.
          </div>
        )}

        {pagos.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 6 }}>
            <select
              value={p.forma}
              onChange={(e) => actualizarPago(i, { forma: e.target.value })}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
            <input
              ref={i === 0 ? inputRef : undefined}
              type="number"
              step="0.01"
              value={p.monto}
              onChange={(e) => actualizarPago(i, { monto: e.target.value })}
              style={{ flex: 1, marginBottom: 0 }}
            />
            {pagos.length > 1 && (
              <button className="boton-secundario boton-sm" onClick={() => quitarFormaPago(i)}>
                ✕
              </button>
            )}
          </div>
        ))}

        {pagos[0]?.forma === 'efectivo' && pagos.length === 1 && (
          <div className="toolbar" style={{ marginTop: 4 }}>
            {DENOMINACIONES_EFECTIVO.filter((d) => d >= total).slice(0, 3).map((d) => (
              <button key={d} className="boton-sm boton-secundario" onClick={() => actualizarPago(0, { monto: d.toFixed(2) })}>
                L{d}
              </button>
            ))}
            <button className="boton-sm boton-secundario" onClick={() => actualizarPago(0, { monto: total.toFixed(2) })}>
              Exacto
            </button>
          </div>
        )}

        <button className="boton-sm boton-secundario" style={{ marginTop: 8 }} onClick={agregarFormaPago}>
          + Dividir el pago
        </button>

        <div className="pos-totales-fila" style={{ marginTop: 10 }}>
          <span>Pagado</span>
          <span>{fmtL(totalPagado)}</span>
        </div>
        <div className="pos-totales-fila">
          <span>Cambio</span>
          <span>{fmtL(cambio)}</span>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="boton-secundario" onClick={onCancelar} disabled={guardando}>
            Cancelar (Esc)
          </button>
          <button disabled={guardando || !puedeConfirmar} onClick={confirmar}>
            {guardando ? 'Procesando…' : 'Confirmar (Enter)'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalOrdenesAbiertas({ ordenes, cargando, onSeleccionar, onCerrar }) {
  return (
    <div className="overlay">
      <div className="tarjeta" style={{ maxWidth: 420 }}>
        <h2>Órdenes abiertas</h2>
        {cargando && <p style={{ color: 'var(--text-dim)' }}>Cargando…</p>}
        {!cargando && ordenes.length === 0 && <p style={{ color: 'var(--text-dim)' }}>No hay órdenes abiertas.</p>}
        {ordenes.map((o) => (
          <div
            key={o.id}
            className="boton-secundario boton-sm"
            style={{ width: '100%', marginBottom: 6, cursor: 'pointer', textAlign: 'left' }}
            onClick={() => onSeleccionar(o)}
          >
            Orden #{o.numero_orden} · {o.clientes?.nombre ?? CONSUMIDOR_FINAL_NOMBRE} · {fmtL(o.total)}
          </div>
        ))}
        <button className="boton-secundario" onClick={onCerrar}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default function Pos({ session, perfil, sucursales, onIrA }) {
  const [sucursalId, setSucursalId] = useState(perfil.sucursal_id ?? sucursales[0]?.id ?? '');
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaActivaId, setCategoriaActivaId] = useState(null);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [descuento, setDescuento] = useState('');
  const [notaInterna, setNotaInterna] = useState('');
  const [ventaId, setVentaId] = useState(null);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [guardandoPago, setGuardandoPago] = useState(false);
  const [mostrarOrdenes, setMostrarOrdenes] = useState(false);
  const [cargandoOrdenes, setCargandoOrdenes] = useState(false);
  const [ordenesAbiertas, setOrdenesAbiertas] = useState([]);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [resultadoFactura, setResultadoFactura] = useState(null);
  const [estadoPuntoEmision, setEstadoPuntoEmision] = useState(null);
  const [enLinea, setEnLinea] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [copias, setCopias] = useState(1);
  const primerCambio = useRef(true);
  const ultimaVentaRef = useRef(null);
  const buscadorRef = useRef(null);

  useEffect(() => {
    setCargandoCatalogo(true);
    Promise.all([api.get('/categorias', session), api.get('/productos', session)])
      .then(([cats, prods]) => {
        setCategorias(cats);
        setProductos(prods);
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargandoCatalogo(false));
  }, []);

  // #31 — el cajero puede empezar a escribir el producto apenas entra.
  useEffect(() => {
    buscadorRef.current?.focus();
  }, []);

  // #32 — indicador de conexión: el autoguardado depende de la red.
  useEffect(() => {
    const marcarEnLinea = () => setEnLinea(true);
    const marcarSinConexion = () => setEnLinea(false);
    window.addEventListener('online', marcarEnLinea);
    window.addEventListener('offline', marcarSinConexion);
    return () => {
      window.removeEventListener('online', marcarEnLinea);
      window.removeEventListener('offline', marcarSinConexion);
    };
  }, []);

  // #11/#24/#35 — estado del CAI de la sucursal activa, visible antes de cobrar.
  useEffect(() => {
    if (!sucursalId) return;
    api
      .get(`/puntos-emision/sucursal/${sucursalId}/estado`, session)
      .then(setEstadoPuntoEmision)
      .catch(() => setEstadoPuntoEmision({ error: true }));
  }, [sucursalId]);

  function mostrarToast(texto) {
    setToast(texto);
    setTimeout(() => setToast(''), 1400);
  }

  const productosVisibles = useMemo(() => {
    let lista = productos.filter((p) => !categoriaActivaId || p.categoria_id === categoriaActivaId);
    const q = busquedaProducto.trim().toLowerCase();
    if (q) {
      lista = productos.filter(
        (p) => p.nombre.toLowerCase().includes(q) || (p.codigo ?? '').toLowerCase().includes(q)
      );
    }
    return lista;
  }, [productos, categoriaActivaId, busquedaProducto]);

  // #3/#12 — mismo cálculo de impuestos que el backend, para que el
  // desglose que ve el cajero coincida exacto con lo que se va a cobrar.
  const totales = useMemo(() => {
    const items = carrito.map((l) => ({
      precio_unitario: l.precio_unitario,
      cantidad: l.cantidad,
      descuento: 0,
      impuesto_tasa: l.impuesto_tasa,
    }));
    return calcularTotales(items, cliente, descuento);
  }, [carrito, cliente, descuento]);

  const requiereRtn = totales.total > UMBRAL_RTN_OBLIGATORIO && !cliente?.rtn;
  const carritoTieneLineasInvalidas = carrito.some(
    (l) => !Number.isFinite(l.cantidad) || l.cantidad <= 0 || !Number.isFinite(l.precio_unitario) || l.precio_unitario < 0
  );
  const sinPuntoEmision = estadoPuntoEmision?.error;

  // Auto-guarda la orden como "abierta" cada vez que cambia el carrito —
  // así "Ordenes Abiertas" siempre puede recuperarla, igual que en WizPOS.
  // #33 — si falla por red, reintenta una vez a los 2s en vez de perder el cambio.
  useEffect(() => {
    if (primerCambio.current) {
      primerCambio.current = false;
      return;
    }
    if (carrito.length === 0) return;
    const t = setTimeout(() => {
      guardarOrden().catch(() => {
        setTimeout(() => guardarOrden().catch(() => {}), 2000);
      });
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carrito, cliente, sucursalId, descuento, notaInterna]);

  async function guardarOrden() {
    const body = {
      sucursal_id: sucursalId,
      cliente_id: cliente?.id ?? null,
      descuento: Number(descuento || 0),
      nota_interna: notaInterna || null,
      items: carrito.map((l) => ({
        producto_id: l.producto_id,
        cantidad: l.cantidad,
        descuento: 0,
      })),
    };
    try {
      if (ventaId) {
        await api.put(`/ventas/${ventaId}`, session, body);
        setError('');
        return ventaId;
      }
      const venta = await api.post('/ventas', session, body);
      setVentaId(venta.id);
      setError('');
      return venta.id;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  function agregarProducto(producto) {
    if (!producto.precio && producto.precio !== 0) return; // #22
    setResultadoFactura(null);
    setCarrito((actual) => {
      const existente = actual.find((l) => l.producto_id === producto.id);
      if (existente) {
        return actual.map((l) => (l.producto_id === producto.id ? { ...l, cantidad: l.cantidad + 1 } : l));
      }
      return [
        ...actual,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          precio_unitario: producto.precio,
          impuesto_tasa: producto.impuesto1_tasa,
          cantidad: 1,
        },
      ];
    });
    mostrarToast(`+ ${producto.nombre}`); // #30
  }

  function cambiarCantidad(producto_id, delta) {
    setCarrito((actual) =>
      actual
        .map((l) => (l.producto_id === producto_id ? { ...l, cantidad: l.cantidad + delta } : l))
        .filter((l) => l.cantidad > 0)
    );
  }

  function establecerCantidad(producto_id, valor) {
    const cantidad = Math.max(1, Math.floor(Number(valor) || 1)); // #27
    setCarrito((actual) => actual.map((l) => (l.producto_id === producto_id ? { ...l, cantidad } : l)));
  }

  function quitarLinea(producto_id) {
    setCarrito((actual) => actual.filter((l) => l.producto_id !== producto_id));
  }

  async function nuevaOrden({ confirmar = true } = {}) {
    if (confirmar && carrito.length > 0) {
      if (!window.confirm('¿Descartar esta orden? Los productos agregados se van a perder.')) return; // #5
    }
    if (ventaId) {
      await api.del(`/ventas/${ventaId}`, session).catch(() => {});
    }
    setCarrito([]);
    setCliente(null);
    setDescuento('');
    setNotaInterna('');
    setVentaId(null);
    setResultadoFactura(null);
    setError('');
    buscadorRef.current?.focus();
  }

  async function abrirOrdenesAbiertas() {
    setMostrarOrdenes(true);
    setCargandoOrdenes(true);
    try {
      const ordenes = await api.get(`/ventas?estado=abierta&sucursal_id=${sucursalId}`, session);
      setOrdenesAbiertas(ordenes);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargandoOrdenes(false);
    }
  }

  async function recuperarOrden(orden) {
    try {
      const detalle = await api.get(`/ventas/${orden.id}`, session);
      setVentaId(detalle.id);
      setCliente(detalle.clientes?.es_consumidor_final ? null : detalle.clientes);
      setDescuento(detalle.descuento > 0 ? String(detalle.descuento) : '');
      setCarrito(
        (detalle.detalle || []).map((d) => ({
          producto_id: d.producto_id,
          nombre: d.nombre_producto,
          precio_unitario: d.precio_unitario,
          impuesto_tasa: d.impuesto_tasa,
          cantidad: d.cantidad,
        }))
      );
      setSucursalId(detalle.sucursal_id);
      setMostrarOrdenes(false);
    } catch (e) {
      setError(e.message);
    }
  }

  function repetirUltimaVenta() {
    if (!ultimaVentaRef.current) return;
    setCliente(ultimaVentaRef.current.cliente);
    setCarrito(ultimaVentaRef.current.carrito);
    setResultadoFactura(null);
    mostrarToast('Pedido repetido — revisa y cobra');
  }

  async function confirmarPago({ pagos, efectivo }) {
    setGuardandoPago(true);
    setError('');
    try {
      const idParaPagar = ventaId ?? (await guardarOrden());
      const mapaFormas = { efectivo: 'Efectivo', tarjeta: 'Tarjeta', transferencia: 'Transferencia' };
      const formasPago = await api.get('/formas-pago', session);
      const pagosConId = pagos.map((p) => ({
        forma_pago_id: formasPago.find((f) => f.nombre === mapaFormas[p.forma])?.id,
        monto: Number(p.monto),
      }));
      const venta = await api.post(`/ventas/${idParaPagar}/pagar`, session, {
        efectivo_recibido: efectivo,
        pagos: pagosConId,
      });
      ultimaVentaRef.current = { cliente, carrito }; // #23
      setResultadoFactura(venta);
      setMostrarPago(false);
      setCarrito([]);
      setCliente(null);
      setDescuento('');
      setNotaInterna('');
      setVentaId(null);

      // #15 — abre el ticket listo para imprimir apenas se cobra.
      window.open(`/api/ventas/${venta.id}/ticket?autoimprimir=1&copias=${copias}`, '_blank');
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardandoPago(false);
    }
  }

  const sucursalActual = sucursales.find((s) => s.id === sucursalId);

  return (
    <div className="pos-grid">
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 12,
            right: 12,
            background: 'var(--terracota)',
            color: 'white',
            padding: '8px 14px',
            borderRadius: 8,
            zIndex: 50,
            fontSize: '0.9em',
          }}
        >
          {toast}
        </div>
      )}

      {resultadoFactura && (
        <div className="overlay">
          <div className="tarjeta" style={{ maxWidth: 380 }}>
            <h2>{resultadoFactura.es_borrador ? 'Orden registrada' : 'Factura emitida'}</h2>
            {resultadoFactura.es_borrador && (
              <div className="badge-borrador">Sin validez fiscal — CAI pendiente</div>
            )}
            <p>
              Número: <strong>{resultadoFactura.numero_factura}</strong>
            </p>
            <p>Cambio: {fmtL(resultadoFactura.cambio ?? 0)}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <a
                className="boton-secundario boton-sm"
                style={{ textAlign: 'center', textDecoration: 'none', flex: 1 }}
                href={`/api/ventas/${resultadoFactura.id}/ticket`}
                target="_blank"
                rel="noreferrer"
              >
                Ver ticket
              </a>
              <a
                className="boton-secundario boton-sm"
                style={{ textAlign: 'center', textDecoration: 'none', flex: 1 }}
                href={`/api/ventas/${resultadoFactura.id}/pdf`}
                target="_blank"
                rel="noreferrer"
              >
                Ver PDF
              </a>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="boton-secundario" onClick={repetirUltimaVenta}>
                Repetir pedido
              </button>
              <button onClick={() => setResultadoFactura(null)}>Nueva orden</button>
            </div>
          </div>
        </div>
      )}

      {mostrarPago && (
        <ModalPago
          total={totales.total}
          requiereRtn={requiereRtn}
          guardando={guardandoPago}
          onCancelar={() => setMostrarPago(false)}
          onConfirmar={confirmarPago}
        />
      )}
      {mostrarOrdenes && (
        <ModalOrdenesAbiertas
          ordenes={ordenesAbiertas}
          cargando={cargandoOrdenes}
          onSeleccionar={recuperarOrden}
          onCerrar={() => setMostrarOrdenes(false)}
        />
      )}

      <div className="pos-panel">
        {error && <div className="error">{error}</div>}
        {!enLinea && <div className="alerta">Sin conexión — se reintentará guardar cuando vuelva.</div>}
        <button
          className={`pos-categoria ${!categoriaActivaId ? 'activa' : ''}`}
          onClick={() => setCategoriaActivaId(null)}
        >
          Todas
        </button>
        {categorias.map((c) => (
          <button
            key={c.id}
            className={`pos-categoria ${categoriaActivaId === c.id ? 'activa' : ''}`}
            onClick={() => setCategoriaActivaId(c.id)}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      <div className="pos-panel">
        <input
          ref={buscadorRef}
          placeholder="Buscar producto por nombre o código…"
          value={busquedaProducto}
          onChange={(e) => setBusquedaProducto(e.target.value)}
        />
        {cargandoCatalogo && <p style={{ color: 'var(--text-dim)' }}>Cargando catálogo…</p>}
        <div className="pos-productos">
          {productosVisibles.map((p) => (
            <button key={p.id} className="pos-producto" onClick={() => agregarProducto(p)}>
              <strong>{p.nombre}</strong>
              {fmtL(p.precio)}
            </button>
          ))}
        </div>
        {!cargandoCatalogo && productosVisibles.length === 0 && (
          <p style={{ color: 'var(--text-dim)' }}>Sin productos que coincidan.</p>
        )}
      </div>

      <div className="pos-panel">
        {sucursalActual && <div style={{ fontWeight: 700, color: 'var(--gold)', marginBottom: 6 }}>{sucursalActual.nombre}</div>}
        {sucursales.length > 1 && (
          <select
            value={sucursalId}
            disabled={carrito.length > 0}
            onChange={(e) => setSucursalId(e.target.value)}
          >
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        )}
        {sinPuntoEmision && (
          <div className="alerta">Esta sucursal no tiene un punto de emisión activo — no se puede facturar.</div>
        )}
        {estadoPuntoEmision?.alerta && !sinPuntoEmision && (
          <div className="alerta">
            {estadoPuntoEmision.agotado && 'El rango de facturas está agotado. '}
            {estadoPuntoEmision.vencido && 'El CAI ya venció. '}
            {!estadoPuntoEmision.agotado && !estadoPuntoEmision.vencido && 'El CAI está por vencer o agotarse — avisa al dueño.'}
          </div>
        )}

        <SelectorCliente
          session={session}
          clienteId={cliente?.id}
          clienteNombre={cliente?.nombre}
          clienteExento={cliente?.exento_impuestos}
          onSeleccionar={setCliente}
        />

        <div style={{ maxHeight: '30vh', overflowY: 'auto' }}>
          {carrito.length === 0 && <p style={{ color: 'var(--text-dim)' }}>Sin productos todavía.</p>}
          {carrito.map((l) => (
            <div key={l.producto_id} className="pos-orden-linea">
              <span>
                {l.nombre}
                <br />
                <span style={{ color: 'var(--text-dim)' }}>{fmtL(l.precio_unitario)} c/u</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button className="boton-secundario" onClick={() => cambiarCantidad(l.producto_id, -1)}>
                  −
                </button>
                <input
                  type="number"
                  value={l.cantidad}
                  onChange={(e) => establecerCantidad(l.producto_id, e.target.value)}
                  style={{ width: 44, textAlign: 'center', marginBottom: 0, padding: '4px' }}
                />
                <button className="boton-secundario" onClick={() => cambiarCantidad(l.producto_id, 1)}>
                  +
                </button>
                <button className="boton-secundario" title="Quitar" onClick={() => quitarLinea(l.producto_id)}>
                  🗑
                </button>
              </span>
            </div>
          ))}
        </div>

        <div className="toolbar" style={{ marginTop: 8 }}>
          <input
            type="number"
            step="0.01"
            placeholder="Descuento (L)"
            value={descuento}
            onChange={(e) => setDescuento(e.target.value)}
            style={{ marginBottom: 0, flex: 1 }}
          />
          <select
            value={copias}
            onChange={(e) => setCopias(Number(e.target.value))}
            title="Copias del ticket"
            style={{ marginBottom: 0, width: 90 }}
          >
            <option value={1}>1 copia</option>
            <option value={2}>2 copias</option>
          </select>
        </div>
        <input
          placeholder="Nota interna (no sale en la factura)"
          value={notaInterna}
          onChange={(e) => setNotaInterna(e.target.value)}
        />

        <div className="pos-totales-fila">
          <span>Sub-Total</span>
          <span>{fmtL(totales.subtotal_exento + totales.subtotal_exonerado + totales.subtotal_gravado_15)}</span>
        </div>
        <div className="pos-totales-fila">
          <span>Impuesto</span>
          <span>{fmtL(totales.isv_total)}</span>
        </div>
        {totales.descuento > 0 && (
          <div className="pos-totales-fila">
            <span>Descuento</span>
            <span>-{fmtL(totales.descuento)}</span>
          </div>
        )}
        <div className="pos-totales-fila total">
          <span>Total</span>
          <span>{fmtL(totales.total)}</span>
        </div>
        {requiereRtn && (
          <p style={{ color: '#ffb86b', fontSize: '0.82em' }}>
            Se necesita RTN del cliente para cobrar (venta mayor a L{UMBRAL_RTN_OBLIGATORIO.toLocaleString('es-HN')}).
          </p>
        )}

        <div className="pos-acciones">
          <button className="boton-secundario" onClick={() => nuevaOrden()}>
            Nueva
          </button>
          <button className="boton-secundario" onClick={abrirOrdenesAbiertas}>
            Órdenes Abiertas
          </button>
          {onIrA && (
            <button className="boton-secundario" onClick={() => onIrA('facturas')} style={{ gridColumn: '1 / -1' }}>
              Buscar
            </button>
          )}
          <button
            disabled={carrito.length === 0 || carritoTieneLineasInvalidas || sinPuntoEmision}
            onClick={() => setMostrarPago(true)}
            style={{ gridColumn: '1 / -1' }}
          >
            Procesar Pago
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api.js';

const CONSUMIDOR_FINAL_NOMBRE = 'Consumidor Final';

function SelectorCliente({ session, clienteId, clienteNombre, onSeleccionar }) {
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
      <div style={{ fontWeight: 600 }}>{clienteNombre || CONSUMIDOR_FINAL_NOMBRE}</div>
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

function ModalPago({ total, onCancelar, onConfirmar, guardando }) {
  const [formaPago, setFormaPago] = useState('efectivo');
  const [efectivo, setEfectivo] = useState(total.toFixed(2));
  const cambio = Math.max(0, Number(efectivo || 0) - total);

  return (
    <div className="overlay">
      <div className="tarjeta" style={{ maxWidth: 360 }}>
        <h2>Procesar pago</h2>
        <div className="pos-totales-fila total">
          <span>Total</span>
          <span>L {total.toFixed(2)}</span>
        </div>
        <label style={{ fontSize: '0.85em', color: 'var(--text-dim)' }}>Forma de pago</label>
        <select value={formaPago} onChange={(e) => setFormaPago(e.target.value)}>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
        </select>
        {formaPago === 'efectivo' && (
          <>
            <label style={{ fontSize: '0.85em', color: 'var(--text-dim)' }}>Efectivo recibido</label>
            <input type="number" step="0.01" value={efectivo} onChange={(e) => setEfectivo(e.target.value)} />
            <div className="pos-totales-fila">
              <span>Cambio</span>
              <span>L {cambio.toFixed(2)}</span>
            </div>
          </>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="boton-secundario" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </button>
          <button
            disabled={guardando || (formaPago === 'efectivo' && Number(efectivo) < total)}
            onClick={() => onConfirmar({ formaPago, efectivo: Number(efectivo) })}
          >
            {guardando ? 'Procesando…' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalOrdenesAbiertas({ ordenes, onSeleccionar, onCerrar }) {
  return (
    <div className="overlay">
      <div className="tarjeta" style={{ maxWidth: 420 }}>
        <h2>Órdenes abiertas</h2>
        {ordenes.length === 0 && <p style={{ color: 'var(--text-dim)' }}>No hay órdenes abiertas.</p>}
        {ordenes.map((o) => (
          <div
            key={o.id}
            className="boton-secundario boton-sm"
            style={{ width: '100%', marginBottom: 6, cursor: 'pointer', textAlign: 'left' }}
            onClick={() => onSeleccionar(o)}
          >
            Orden #{o.numero_orden} · {o.clientes?.nombre ?? CONSUMIDOR_FINAL_NOMBRE} · L{' '}
            {Number(o.total).toFixed(2)}
          </div>
        ))}
        <button className="boton-secundario" onClick={onCerrar}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default function Pos({ session, perfil, sucursales }) {
  const [sucursalId, setSucursalId] = useState(perfil.sucursal_id ?? sucursales[0]?.id ?? '');
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaActivaId, setCategoriaActivaId] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [ventaId, setVentaId] = useState(null);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [guardandoPago, setGuardandoPago] = useState(false);
  const [mostrarOrdenes, setMostrarOrdenes] = useState(false);
  const [ordenesAbiertas, setOrdenesAbiertas] = useState([]);
  const [error, setError] = useState('');
  const [resultadoFactura, setResultadoFactura] = useState(null);
  const primerCambio = useRef(true);

  useEffect(() => {
    api.get('/categorias', session).then(setCategorias).catch((e) => setError(e.message));
    api.get('/productos', session).then(setProductos).catch((e) => setError(e.message));
  }, []);

  const productosVisibles = useMemo(
    () => productos.filter((p) => !categoriaActivaId || p.categoria_id === categoriaActivaId),
    [productos, categoriaActivaId]
  );

  const total = useMemo(
    () => carrito.reduce((s, l) => s + l.precio_unitario * l.cantidad - (l.descuento || 0), 0),
    [carrito]
  );

  // Auto-guarda la orden como "abierta" cada vez que cambia el carrito —
  // así "Ordenes Abiertas" siempre puede recuperarla, igual que en WizPOS.
  useEffect(() => {
    if (primerCambio.current) {
      primerCambio.current = false;
      return;
    }
    if (carrito.length === 0) return;
    const t = setTimeout(() => guardarOrden(), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carrito, cliente, sucursalId]);

  async function guardarOrden() {
    const body = {
      sucursal_id: sucursalId,
      cliente_id: cliente?.id ?? null,
      items: carrito.map((l) => ({
        producto_id: l.producto_id,
        cantidad: l.cantidad,
        descuento: l.descuento || 0,
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
          cantidad: 1,
          descuento: 0,
        },
      ];
    });
  }

  function cambiarCantidad(producto_id, delta) {
    setCarrito((actual) =>
      actual
        .map((l) => (l.producto_id === producto_id ? { ...l, cantidad: l.cantidad + delta } : l))
        .filter((l) => l.cantidad > 0)
    );
  }

  async function nuevaOrden() {
    if (ventaId) {
      await api.del(`/ventas/${ventaId}`, session).catch(() => {});
    }
    setCarrito([]);
    setCliente(null);
    setVentaId(null);
    setResultadoFactura(null);
    setError('');
  }

  async function abrirOrdenesAbiertas() {
    const ordenes = await api.get(`/ventas?estado=abierta&sucursal_id=${sucursalId}`, session);
    setOrdenesAbiertas(ordenes);
    setMostrarOrdenes(true);
  }

  async function recuperarOrden(orden) {
    const detalle = await api.get(`/ventas/${orden.id}`, session);
    setVentaId(detalle.id);
    setCliente(detalle.clientes?.es_consumidor_final ? null : detalle.clientes);
    setCarrito(
      (detalle.detalle || []).map((d) => ({
        producto_id: d.producto_id,
        nombre: d.nombre_producto,
        precio_unitario: d.precio_unitario,
        cantidad: d.cantidad,
        descuento: d.descuento,
      }))
    );
    setSucursalId(detalle.sucursal_id);
    setMostrarOrdenes(false);
  }

  async function confirmarPago({ formaPago, efectivo }) {
    setGuardandoPago(true);
    setError('');
    try {
      const idParaPagar = ventaId ?? (await guardarOrden());
      const mapaFormas = { efectivo: 'Efectivo', tarjeta: 'Tarjeta', transferencia: 'Transferencia' };
      const formasPago = await api.get('/formas-pago', session);
      const formaPagoId = formasPago.find((f) => f.nombre === mapaFormas[formaPago])?.id;
      const venta = await api.post(`/ventas/${idParaPagar}/pagar`, session, {
        efectivo_recibido: formaPago === 'efectivo' ? efectivo : total,
        pagos: [{ forma_pago_id: formaPagoId, monto: total }],
      });
      setResultadoFactura(venta);
      setMostrarPago(false);
      setCarrito([]);
      setCliente(null);
      setVentaId(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardandoPago(false);
    }
  }

  return (
    <div className="pos-grid">
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
            <p>Cambio: L {Number(resultadoFactura.cambio ?? 0).toFixed(2)}</p>
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
            <button style={{ marginTop: 10 }} onClick={() => setResultadoFactura(null)}>
              Nueva orden
            </button>
          </div>
        </div>
      )}

      {mostrarPago && (
        <ModalPago
          total={total}
          guardando={guardandoPago}
          onCancelar={() => setMostrarPago(false)}
          onConfirmar={confirmarPago}
        />
      )}
      {mostrarOrdenes && (
        <ModalOrdenesAbiertas
          ordenes={ordenesAbiertas}
          onSeleccionar={recuperarOrden}
          onCerrar={() => setMostrarOrdenes(false)}
        />
      )}

      <div className="pos-panel">
        {error && <div className="error">{error}</div>}
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
        <div className="pos-productos">
          {productosVisibles.map((p) => (
            <button key={p.id} className="pos-producto" onClick={() => agregarProducto(p)}>
              <strong>{p.nombre}</strong>
              L {Number(p.precio).toFixed(2)}
            </button>
          ))}
        </div>
      </div>

      <div className="pos-panel">
        {sucursales.length > 1 && (
          <select value={sucursalId} onChange={(e) => setSucursalId(e.target.value)}>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        )}
        <SelectorCliente
          session={session}
          clienteId={cliente?.id}
          clienteNombre={cliente?.nombre}
          onSeleccionar={setCliente}
        />

        <div style={{ maxHeight: '38vh', overflowY: 'auto' }}>
          {carrito.length === 0 && <p style={{ color: 'var(--text-dim)' }}>Sin productos todavía.</p>}
          {carrito.map((l) => (
            <div key={l.producto_id} className="pos-orden-linea">
              <span>
                {l.nombre}
                <br />
                <span style={{ color: 'var(--text-dim)' }}>L {l.precio_unitario.toFixed(2)} c/u</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button className="boton-secundario" onClick={() => cambiarCantidad(l.producto_id, -1)}>
                  −
                </button>
                {l.cantidad}
                <button className="boton-secundario" onClick={() => cambiarCantidad(l.producto_id, 1)}>
                  +
                </button>
              </span>
            </div>
          ))}
        </div>

        <div className="pos-totales-fila total">
          <span>Total</span>
          <span>L {total.toFixed(2)}</span>
        </div>

        <div className="pos-acciones">
          <button className="boton-secundario" onClick={nuevaOrden}>
            Nueva
          </button>
          <button className="boton-secundario" onClick={abrirOrdenesAbiertas}>
            Órdenes Abiertas
          </button>
          <button disabled={carrito.length === 0} onClick={() => setMostrarPago(true)} style={{ gridColumn: '1 / -1' }}>
            Procesar Pago
          </button>
        </div>
      </div>
    </div>
  );
}

# Guía de replicación — Italo Facturación

> **Para qué sirve este documento.** Resume toda la lógica, las decisiones y el
> código de `italo-facturacion` (el sistema de facturación, cierres,
> cotizaciones y antifraude de Ítalo Gelateria) para **replicarlo en otro
> negocio**: la fábrica de piedra de enchape. Está escrito para que una sesión
> nueva de Claude Code lo lea y construya la versión nueva sin repetir los
> errores que aquí ya se resolvieron.
>
> Documentos que lo acompañan:
>
> - `docs/CODIGO-COMPLETO.md`: **todo el código fuente** en un solo archivo
>   (backend, frontend, migraciones SQL y configuración). Se regenera con
>   `node scripts/generar-codigo-completo.mjs`.
> - El repositorio mismo: `github.com/Juanfunes25/italo-facturacion`. Es la
>   mejor referencia: en la sesión nueva, pide agregarlo como repositorio de
>   referencia (solo lectura) para que Claude pueda leer cualquier archivo.
>
> Estado al 28-sep-2026: commit `44b1a15` en `main`, en producción en
> https://italo-facturacion.onrender.com.

---

## Índice

1. [Qué hace el sistema](#1-qué-hace-el-sistema)
2. [Arquitectura y stack](#2-arquitectura-y-stack)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Infraestructura y despliegue](#4-infraestructura-y-despliegue)
5. [Modelo de datos](#5-modelo-de-datos)
6. [Usuarios, roles y seguridad](#6-usuarios-roles-y-seguridad)
7. [Motor fiscal Honduras (SAR / CAI / ISV)](#7-motor-fiscal-honduras-sar--cai--isv)
8. [Punto de venta (POS)](#8-punto-de-venta-pos)
9. [Impresión térmica y PDFs](#9-impresión-térmica-y-pdfs)
10. [Cierre de caja](#10-cierre-de-caja)
11. [Cotizaciones y calendario de eventos](#11-cotizaciones-y-calendario-de-eventos)
12. [Reportes y dashboard](#12-reportes-y-dashboard)
13. [Antifraude y bitácora](#13-antifraude-y-bitácora)
14. [Tiempo real, PWA y actualización](#14-tiempo-real-pwa-y-actualización)
15. [Fechas, paginación y otros detalles técnicos](#15-fechas-paginación-y-otros-detalles-técnicos)
16. [Sistema de diseño](#16-sistema-de-diseño)
17. [Correo](#17-correo)
18. [Lecciones aprendidas (bugs ya resueltos)](#18-lecciones-aprendidas-bugs-ya-resueltos)
19. [Adaptación a la fábrica de piedra de enchape](#19-adaptación-a-la-fábrica-de-piedra-de-enchape)
20. [Prompt inicial para la sesión nueva](#20-prompt-inicial-para-la-sesión-nueva)
21. [Lista de puesta en marcha](#21-lista-de-puesta-en-marcha)

---

## 1. Qué hace el sistema

Sistema de facturación propio que reemplaza a WizPOS en 4 sucursales activas
de Ítalo Gelateria en San Pedro Sula. Cumple con el régimen de facturación
del SAR (CAI, rangos autorizados, correlativo, ISV).

| Módulo | Qué hace | Roles |
|---|---|---|
| **Facturación (POS)** | Órdenes abiertas, carrito, descuentos por línea (tercera edad), cobro en efectivo/tarjeta/transferencia/mixto, emisión con correlativo CAI, impresión térmica automática | admin, manager, cajero |
| **Facturas** | Listado con filtros (fecha, sucursal, forma de pago), detalle, reimpresión con motivo, PDF, reenvío por correo, notas de crédito/anulación | todos (anular: admin) |
| **Cierre de caja** | Extrae ventas del turno, total por forma de pago; el cajero digita POS BAC, POS Ficohsa y efectivo contado; calcula el cuadre; alerta y envía correo si hay descuadre; imprime el desglose | todos |
| **Cotización de eventos** | Cotización con PDF de marca, envío por correo, aceptación con fecha, **calendario mensual con lista de control**, conversión a factura en un clic | admin, manager |
| **Dashboard / Reportes** | KPIs, comparativos, ISV, productos, horas, cajeros, sucursales, CSV | admin, manager |
| **Catálogo / Clientes / Caja chica** | CRUD con código de barras, RTN y exentos; entradas y salidas de caja chica | admin, manager |
| **Antifraude** | Alertas en tiempo real, señales por cajero, línea de tiempo, arqueo sorpresa, reglas configurables | admin |
| **Bitácora** | Registro inmutable (cadena de hashes) de todo lo que pasa | admin |
| **CAI / Emisión** | Puntos de emisión por sucursal, rango, fecha límite, modo borrador | admin, manager |
| **Usuarios / Sucursales / Impresora** | Usuarios con nombre libre, color por sucursal, papel de 80/58 mm | según pantalla |

---

## 2. Arquitectura y stack

```
Navegador (PWA React)  ──Bearer JWT──►  Express (Render, 1 servicio)  ──service_role──►  Supabase Postgres
      │                                   │  sirve también frontend/dist                     ▲
      └── login directo con Supabase Auth ┘                                                   │
      └── Realtime (postgres_changes, solo lectura) ─────────────────────────────────────────┘
```

- **Backend:** Node 22 + Express 4, ES modules. Dependencias:
  `@supabase/supabase-js`, `cors`, `dotenv`, `express`, `nodemailer`, `pdfkit`.
- **Frontend:** React 18 + Vite 5 + `vite-plugin-pwa`. **Sin librerías de UI**:
  CSS propio en `index.css` y gráficas en SVG hechas a mano
  (`components/Graficas.jsx`).
- **Base de datos:** Supabase (Postgres + Auth + Realtime), plan gratis.
- **Hosting:** Render, plan free: un solo *web service* que compila el
  frontend y lo sirve desde Express. Se despliega solo con cada push a `main`.

**Principio clave:** toda escritura de negocio pasa por el backend con la
`service_role` key. El frontend nunca escribe directo en la base. Así el
correlativo fiscal, los permisos y la bitácora quedan bajo control. El
frontend usa Supabase solo para el login y para escuchar cambios en tiempo
real.

---

## 3. Estructura de carpetas

```
render.yaml                     # blueprint de Render (build + start + env vars)
backend/
  server.js                     # rutas, guardas por rol, estáticos, no-cache, vigilancia
  db.js                         # cliente Supabase con service_role
  middleware/auth.js            # valida JWT, carga perfil, vigila dispositivo
  middleware/requireRole.js     # guarda por rol + bitácora + alerta si se niega
  lib/
    facturacion.js              # cálculo de líneas, ISV incluido, descuentos, número de factura
    fechas.js                   # zona horaria Honduras (UTC-6) para rangos
    consultas.js                # paginación >1000 filas, lotes por ids, filtros seguros
    acceso.js                   # usuario libre → correo interno de Supabase
    auditoria.js                # registrarAuditoria()
    alertas.js                  # crearAlerta() (+ correo a admins si es grave)
    antifraude.js               # reglas de detección y vigilancia periódica
    reglas.js                   # umbrales configurables (config_antifraude)
    cierre.js                   # totales por forma, cuadre, desglose del turno
    ticket.js                   # ticket térmico de texto (48/40/32 columnas)
    pdf.js                      # factura PDF
    cotizacionPdf.js            # cotización PDF de marca (Poppins)
    correo.js                   # nodemailer Gmail: facturas, cotizaciones, alertas, cierres
    empresa.js                  # datos de marca, teléfonos, condiciones, colores
  routes/                       # un archivo por recurso (ventas, cierres, cotizaciones, ...)
  assets/fonts/                 # Poppins TTF para PDFs
frontend/
  vite.config.js                # PWA con autoUpdate + proxy /api a :4200
  src/
    App.jsx                     # shell: login, sidebar por grupos/roles, tema, sucursal activa
    api.js                      # fetch con Bearer + X-Dispositivo
    supabaseClient.js
    lib/                        # facturacion (espejo del backend), documentos (imprimir/PDF),
                                # tiempoReal, actualizacion (PWA), rangosFecha, eventos, csv...
    components/                 # Icono, Graficas, BloqueoInactividad, NotificacionesAlertas,
                                # CalendarioEventos
    screens/                    # Pos, Facturas, Cierres, Cotizaciones, Dashboard, Reportes,
                                # Catalogo, Clientes, CajaChica, Antifraude, Bitacora,
                                # PuntosEmision, Usuarios, Sucursales, Impresora
supabase/migrations/0001..0015  # esquema completo, en orden
```

---

## 4. Infraestructura y despliegue

### Variables de entorno (Render)

| Variable | Uso |
|---|---|
| `SUPABASE_URL` | URL del proyecto |
| `SUPABASE_SERVICE_ROLE_KEY` | solo backend; salta las políticas RLS |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | se incrustan en el build del frontend (login y realtime) |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` | opcional: correos (facturas, cotizaciones, alertas, cierres) |
| `RESUMEN_CIERRE_EMAIL` | opcional: destinatario del resumen de cada cierre |

### Render (`render.yaml`)

```yaml
buildCommand: npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend
startCommand: node backend/server.js
```

- `GET /api/health` y `GET /api/health/db` sirven para diagnosticar sin login
  (el segundo confirma que la service_role key funciona).
- Render free se duerme tras unos 15 minutos sin tráfico; la primera carga
  tarda unos 30 a 50 segundos. Para cajas en operación conviene un plan pagado
  o un ping periódico.

### Supabase

- Crear el proyecto y aplicar las migraciones `0001` → `0015` **en orden**.
- RLS está activado en todas las tablas. El backend entra con service_role.
  El frontend solo tiene políticas de lectura donde hace falta realtime.
- Realtime publicado para `ventas`, `productos` y `categorias`. Para escuchar
  otra tabla, agrégala a `supabase_realtime` y dale una política de lectura.
- Las funciones sensibles (`finalizar_venta`, `verificar_auditoria`, hash de
  bitácora) tienen `revoke execute ... from public, anon, authenticated` y
  `grant ... to service_role`. **Ojo:** Postgres da EXECUTE a PUBLIC por
  defecto, así que no basta con revocarlo solo a anon/authenticated.

### Desarrollo local

```bash
cd backend && cp .env.example .env && npm i && npm run dev      # :4200
cd frontend && npm i && npm run dev                            # :5174 (proxy /api → :4200)
```

---

## 5. Modelo de datos

Tablas en `public` (estado real de producción):

| Tabla | Columnas clave | Notas |
|---|---|---|
| `sucursales` | nombre, alias, direccion, color, activo | el color tiñe toda la interfaz |
| `perfiles` | id (=auth.users.id), sucursal_id, nombre, rol (`admin`/`manager`/`cajero`), cierre_ciego, sin_horario, activo | `sucursal_id` null = puede cambiar de sucursal |
| `puntos_emision` | sucursal_id, punto_emision_codigo, punto_venta_codigo, tipo_documento_codigo, cai, correlativo_desde/hasta/actual, fecha_limite_emision, es_borrador, activo | un `check` impide salirse del rango |
| `categorias` / `productos` | codigo, codigo_barras, nombre, precio (ISV incluido), impuesto1/2/3_tasa, activo | |
| `clientes` | nombre, rtn, direccion, telefono, email, exento_impuestos, es_consumidor_final | fila fija "Consumidor Final" |
| `formas_pago` | nombre (Efectivo, Tarjeta, Transferencia) | |
| `ventas` | numero_orden, sucursal_id, punto_emision_id, numero_factura, correlativo, cliente_id, cajero_id, estado (`abierta`/`pagada`/`anulada`/`borrador`), subtotal_exento/exonerado/gravado_15, descuento, isv_total, total, efectivo_recibido, cambio, fecha_emision, anulada, nota_interna, correo_enviado, tercera_edad_nombre/identidad, impresiones, reimpresiones | cabecera de orden **y** de factura |
| `detalle_venta` | venta_id, producto_id, nombre_producto, cantidad, precio_unitario, descuento, descuento_porcentaje (0/10/25), impuesto_tasa, monto | guarda una copia del nombre y el precio al momento de la venta |
| `venta_pagos` | venta_id, forma_pago_id, monto | permite pago mixto |
| `notas_credito` | venta_id, numero_nota, motivo, usuario_id, monto, estado | anulación total o parcial |
| `cierres_caja` | sucursal_id, cajero_id, fecha_inicio/fin, fondo_caja, salidas, efectivo/tarjeta/transferencia_sistema, pos_bac, pos_ficohsa, efectivo_contado, diferencia_tarjeta/efectivo/total, desglose_pagos, factura_desde/hasta, cantidad_facturas, total_ventas, cierre_ciego, observaciones | |
| `caja_chica` | sucursal_id, tipo (entrada/salida), monto, concepto, fecha | se sugiere como "salidas" en el cierre |
| `cotizaciones_eventos` | numero, cliente (nombre/rtn/tel/email), nombre_evento, fecha_evento, **hora_evento**, lugar, cantidad_copitas, precio_copita, costo_servicio, descuento, estado (`borrador`/`enviada`/`aceptada`/`rechazada`/`facturada`), venta_id, **sucursal_id, anticipo, checklist (jsonb), notas_seguimiento, aceptada_at, realizado** | |
| `auditoria` | usuario, accion, entidad, entidad_id, sucursal_id, detalle, ip, hash_anterior, hash | **inmutable** |
| `alertas` | tipo, severidad, titulo, detalle, sucursal_id, usuario, entidad, estado (`pendiente`/`investigando`/`resuelta`/`falso_positivo`), nota_revision | |
| `config_antifraude` | id=1, reglas (jsonb) | umbrales editables |
| `arqueos` | sucursal_id, desde, fondo_caja, efectivo_sistema, salidas, esperado, contado, diferencia, cajeros_turno | arqueo sorpresa |
| `dispositivos_usuario` | usuario_id, dispositivo_id, navegador, ip, primera_vez, ultima_vez | |

### Migraciones (qué introdujo cada una)

| # | Contenido |
|---|---|
| 0001 | Esquema base: sucursales, perfiles, puntos_emision, catálogo, clientes, formas de pago, ventas, detalle, pagos, notas de crédito, cierres, caja chica |
| 0002 | Correlativo atómico (`finalizar_venta`), numero_orden, anulada |
| 0003 | Desglose de pagos en cierre |
| 0004 | Cotizaciones de eventos |
| 0005 | Nota interna en ventas |
| 0006 | Estado del correo de la factura |
| 0007 | Código de barras, descuento %, **bitácora con cadena de hashes**, realtime, cotización facturada |
| 0008 | Permisos de funciones de bitácora (revoke PUBLIC) |
| 0009 | `finalizar_venta` endurecida |
| 0010 | Color de sucursal y cierre detallado (POS BAC/Ficohsa) |
| 0011 | Numeración `BORRADOR-` para CAI de prueba |
| 0012 | Descuento por línea (0/10/25) |
| 0013 | Tabla de alertas e índices de auditoría |
| 0014 | Antifraude avanzado: datos de tercera edad, impresiones, estados de alerta, config, arqueos, dispositivos |
| 0015 | Calendario de eventos (hora, sucursal, anticipo, checklist, seguimiento) |

---

## 6. Usuarios, roles y seguridad

### Usuario libre en lugar de correo (`lib/acceso.js`, espejo en el frontend)

Supabase Auth exige un correo y una contraseña de 6 caracteres o más. Los
cajeros entran con cualquier nombre y cualquier contraseña. La traducción es
determinística y se hace **igual en el frontend y en el backend**:

- `"cajero1"` → `cajero1@italo.local`
- `"María López"` → `u-<sha256[0:32]>@italo.local` (sin tildes ni mayúsculas)
- `"ana@gmail.com"` → queda igual
- Una contraseña de menos de 6 caracteres se completa con el sufijo fijo
  `~italo~` (el usuario nunca lo ve).
- El nombre original se guarda en `user_metadata.usuario` para mostrarlo.

### Autenticación y autorización

- `requireAuth`: valida el JWT con `db.auth.getUser(token)`, carga `perfiles`
  y rechaza a los usuarios inactivos. Pone el perfil en `req.perfil`.
- `requireRole(...roles)`: si el rol no alcanza, responde 403, **escribe
  `acceso.denegado` en la bitácora y crea una alerta**. Es el rastro de quien
  "curiosea" el sistema.
- Guardas por módulo en `server.js`: reportes, dashboard, caja chica y
  cotizaciones solo para admin y manager. Las pantallas se ocultan en el
  frontend según `roles`, pero **la seguridad real está en el backend**.
- `sucursalAjena(perfil, sucursalId)`: un cajero con sucursal fija no puede
  ver ni tocar órdenes, facturas o cierres de otra sucursal.
- **Cierre ciego** (`perfiles.cierre_ciego`): el servidor ni siquiera envía los
  totales del sistema a ese cajero; no basta con esconderlos en la pantalla.
- **Bloqueo por inactividad** (frontend): a los 10 minutos para cajeros y a
  los 20 para los demás (configurable). Se desbloquea con la contraseña.
- **Dispositivo** (`X-Dispositivo`, un id aleatorio en localStorage): avisa
  cuando un usuario entra desde un dispositivo nuevo o desde dos a la vez.
- **Login fallido:** endpoint público `/api/sesion/login-fallido`, limitado por
  IP; al pasar el umbral de intentos se crea una alerta.

---

## 7. Motor fiscal Honduras (SAR / CAI / ISV)

> Validar todo con el contador antes de emitir facturas reales.

### Punto de emisión y número de factura

- Formato: `PPP-VVV-TT-NNNNNNNN`, es decir punto de emisión, punto de venta,
  tipo de documento (`01` = factura) y correlativo de 8 dígitos.
- Cada sucursal tiene su punto de emisión con **CAI, rango autorizado
  (desde/hasta) y fecha límite de emisión**.
- **Correlativo atómico** con la función SQL `finalizar_venta(p_venta_id, p_efectivo, p_cambio)`:
  1. Bloquea la venta y el punto de emisión (`for update`).
  2. Valida el estado, que el punto esté activo, la fecha límite y que el
     rango no esté agotado.
  3. Toma `correlativo_actual`, arma el número y le suma 1.
  4. Marca la venta como `pagada`, con número, fecha de emisión, efectivo y
     cambio.

  Así dos cajas nunca emiten el mismo número.
- **Modo borrador** (`es_borrador=true`): sirve para operar sin CAI real. Los
  números llevan el prefijo `BORRADOR-` y no chocan con los fiscales al
  activar el CAI. Activarlo significa poner el CAI real, el rango del SAR,
  `correlativo_actual = desde` y `es_borrador=false`. El cambio de CAI queda
  en la bitácora y genera una alerta.
- Alertas en pantalla cuando el rango está por agotarse o la fecha límite está
  por vencer.

### ISV incluido en el precio (`lib/facturacion.js`)

- Todos los precios del catálogo **incluyen ISV**. La tasa sirve para
  **separar** base e impuesto, no para sumarlo encima:
  `base = round2(monto / (1 + tasa))`, `isv = monto − base`.
- Cada línea cae en un grupo: tasa > 0 → `gravado_15`; tasa 0 con cliente
  exento → `exento`; tasa 0 en cualquier otro caso → `exonerado`.
- **Descuento por línea** (0, 10 o 25 %) con
  `descuentoDeLinea(precio, cantidad, pct) = round2(round2(precio*cant) * pct / 100)`.
  Se resta **antes** de separar base e ISV. Así el ISV declarado baja en la
  misma proporción que el precio.
- **Descuento global** (monto): se reparte entre las líneas en proporción a su
  monto, y el centavo de redondeo se ajusta en la última línea.
- **Tercera edad (25 %):** se aplica solo a la línea de la persona (en una
  mesa de dos, solo una puede ser de tercera edad). Pide **nombre y número de
  identidad o carné**. El antifraude vigila cuántas veces se usa el mismo
  carné por día y cuántos descuentos de tercera edad hay por día.
- **La lógica de cálculo vive dos veces**, en el frontend
  (`src/lib/facturacion.js`, para mostrar) y en el backend (para emitir), y
  **deben coincidir**. Se comprobaron con 20 000 casos aleatorios: 0
  diferencias. El backend siempre recalcula; nunca confía en los totales que
  manda el navegador.

### Reglas

- **RTN obligatorio** en ventas mayores a L 10 000 (`UMBRAL_RTN_OBLIGATORIO`).
  El RTN se valida con 13 o 14 dígitos.
- Cliente por defecto: **Consumidor Final**.
- **Anulación:** solo admin, con nota de crédito que referencia la factura. El
  número original **no se reutiliza**. Las facturas anuladas conservan su
  número en el rango del cierre pero no suman dinero.
- **Reimpresión:** pide motivo; el ticket sale con encabezado **COPIA** y un
  contador. A partir de 2 reimpresiones de la misma factura se crea una
  alerta.

---

## 8. Punto de venta (POS)

- Pantalla de 3 paneles: categorías y productos, carrito y totales/cobro.
  Admite lector de código de barras (el Enter del lector agrega el producto).
- **Órdenes abiertas:** la orden se guarda como `ventas.estado='abierta'`
  (**una** fila por orden, con sus líneas en `detalle_venta`) y se retoma
  después. Descartar una orden pide motivo, queda en la bitácora y genera una
  alerta si supera el monto configurado.
- **Cobro:** botones directos **Efectivo** y **Tarjeta**, además de
  transferencia y pago mixto. El efectivo recibido calcula el cambio.
  `POST /api/ventas/:id/pagar` → `facturarVenta()`:
  1. Valida los pagos (la suma cubre el total; no hay cambio si no hay
     efectivo).
  2. Valida el RTN si pasa del umbral.
  3. Llama a `finalizar_venta` (RPC).
  4. Guarda los pagos.
  5. Escribe en la bitácora.
  6. Revisa si hay doble factura o abuso de tercera edad.
- **Impresión automática** del ticket en la térmica al emitir (se configura
  por caja).
- "÷ Separar 1": divide una línea para aplicar el descuento a una sola
  unidad.
- La sucursal activa se elige en la barra lateral (si el perfil no tiene
  sucursal fija) y colorea la interfaz.

---

## 9. Impresión térmica y PDFs

- **Ticket = texto monoespaciado** generado en el backend (`lib/ticket.js`)
  para 48 columnas (80 mm), 40 (76 mm) o 32 (58 mm). Se envuelve en un HTML
  mínimo (`envolverTicketHtml`) y el frontend lo imprime desde un iframe
  oculto (`imprimirHtml`). Funciona con cualquier impresora térmica
  instalada en Windows o Android como impresora del sistema, **sin drivers
  ESC/POS ni programas extra**.
- La configuración de impresora (papel e impresión automática) se guarda **por
  computadora** en localStorage, porque cada caja puede tener una impresora
  distinta.
- Los PDF (factura y cotización) se generan con `pdfkit` en el servidor. La
  cotización usa las fuentes Poppins de `backend/assets/fonts` e incluye el
  isotipo y la marca.
- **PDF con autenticación:** un `<a href="/api/...">` no envía el
  encabezado Bearer. Por eso se pide con `fetch`, se convierte en blob y la
  ventana se abre **en el mismo clic, antes del await**, para que el
  bloqueador de ventanas emergentes no la frene
  (`lib/documentos.js: verPdf/descargarPdf`).
- El ticket del cierre incluye el desglose por forma de pago, las facturas de
  tarjeta y transferencia una por una (para cotejarlas con los vouchers), las
  anuladas, los descuentos y, si hubo descuadre, un recuadro **DESCUADRE**.

---

## 10. Cierre de caja

Flujo (`routes/cierres.js`, `lib/cierre.js`, `screens/Cierres.jsx`):

1. El turno empieza donde terminó el último cierre de la sucursal
   (`GET /cierres/ultimo`). Se sugiere el mismo fondo de caja.
2. El sistema **extrae las facturas del rango** (con paginación, porque puede
   haber más de 1000) y calcula los totales **por forma de pago**:
   - **El efectivo es neto del cambio:** si pagan L 500 por una venta de
     L 206.25, a la gaveta entran L 206.25.
   - Las anuladas cuentan en el rango de números pero no en el dinero.
3. El cajero **digita a mano** POS BAC, POS Ficohsa, efectivo contado y
   salidas (se sugieren las salidas de caja chica).
4. **Cuadre:**
   - Tarjeta: `(POS BAC + POS Ficohsa) − tarjeta según sistema`
   - Efectivo: `contado − (fondo + efectivo según sistema − salidas)`
   - Positivo es sobrante y negativo es faltante.
5. Si hay descuadre: se crea la alerta `cierre.descuadre` y se envía un
   **correo a todos los admins**.
6. Se imprime automáticamente el **ticket del cierre** con el desglose.
7. Patrones que revisa en varios cierres:
   - **Desvío tarjeta→efectivo:** el POS da menos y la gaveta más.
   - **Reincidencia:** el mismo cajero con faltantes seguidos.
   - **Facturas del turno que nunca se imprimieron.**

Propinas y descuentos se **quitaron** del formulario de cierre porque no se
usan (las columnas siguen en la tabla por compatibilidad).

---

## 11. Cotizaciones y calendario de eventos

- Una cotización tiene cantidad × precio unitario (copitas), costo de
  servicio y descuento. Total = `cant × precio + servicio − descuento`, con
  ISV incluido.
- **PDF de marca:** logo, paleta verde de Ítalo, teléfono 3149-3755, las
  condiciones de eventos (`empresa.js`), hora, anticipo y saldo. Se envía por
  correo al cliente, y la cotización pasa de `borrador` a `enviada`.
- **Aceptar** (`PUT /cotizaciones/:id` con `estado: 'aceptada'`) exige
  **fecha del evento**. También pide hora, sucursal que atiende y anticipo
  (que no puede superar el total). Guarda `aceptada_at`. Si hay anticipo, el
  paso "Anticipo recibido" queda marcado.
- **Calendario** (`components/CalendarioEventos.jsx`):
  - Vista mensual de lunes a domingo. Los eventos confirmados se ven sólidos
    con el color de su sucursal; los tentativos (borrador/enviada) con borde
    punteado.
  - Cada día muestra cuántas copitas hay que producir y avisa si hay varios
    eventos.
  - Cuatro indicadores del mes: eventos confirmados, copitas a producir, monto
    confirmado y saldo por cobrar.
  - Lista **"Por atender"** con los próximos 14 días y los eventos que ya
    pasaron sin cerrarse.
  - Filtro por sucursal y opción para ver u ocultar los tentativos.
- **Ficha del evento** (`PUT /cotizaciones/:id/seguimiento`, permitido
  también cuando ya está facturada):
  - Lista de control de 6 pasos: anticipo, sabores, producción, logística,
    entrega y cobro. Cada paso guarda quién lo marcó y cuándo.
  - Reprogramar fecha y hora, cambiar lugar, anticipo y sucursal.
  - Notas internas y "evento realizado".
  - Llamar o escribir por WhatsApp al cliente y agregar a Google Calendar
    (enlace de plantilla, sin API).
  - Estado del evento: *urgente* (faltan pasos y quedan 3 días o menos),
    *vencido* (pasó la fecha sin cerrarse), *listo* y *cerrado*.
- **Facturar** (`POST /cotizaciones/:id/facturar`): crea la venta con las
  líneas cotizadas, la emite con el CAI de la sucursal, la marca `facturada`
  con `venta_id` y marca el paso **cobro**. Si falla (por ejemplo, un CAI
  vencido), borra la orden a medio crear.
- Todo queda en la bitácora: `cotizacion.aceptada`,
  `cotizacion.cambio_estado`, `evento.seguimiento`, `evento.reprogramado` y
  `cotizacion.convertir_factura`.

---

## 12. Reportes y dashboard

- `GET /reportes/completo?desde&hasta&sucursal_id`: una sola llamada devuelve
  todo lo del periodo y el periodo anterior equivalente:
  - ventas, ticket promedio y facturas;
  - comparativo con porcentaje de variación;
  - ventas por día, por hora y por día de la semana;
  - por sucursal y por cajero;
  - por forma de pago;
  - top de productos y categorías;
  - descuentos (tercera edad);
  - anuladas y notas de crédito;
  - ISV (exento, exonerado, gravado, ISV);
  - caja chica.
- Atajos de fecha: hoy, ayer, esta semana, la semana pasada, este mes, el mes
  pasado, los últimos 30 días y este año, siempre en hora de Honduras.
- Exportación a CSV desde el navegador (`lib/csv.js`, con BOM para que Excel
  respete las tildes).
- El dashboard muestra KPIs y gráficas SVG propias.

---

## 13. Antifraude y bitácora

### Bitácora inmutable (`auditoria`)

- Cada fila guarda el **SHA-256 de su contenido más el hash de la fila
  anterior**, igual que un libro contable encadenado. Un trigger
  `before insert` lo calcula dentro de un `pg_advisory_xact_lock` para que
  el orden sea serial.
- Otro trigger **prohíbe UPDATE y DELETE**.
- `verificar_auditoria()` recorre toda la cadena y dice si está íntegra. La
  vigilancia la corre cada 10 minutos y crea la alerta `bitacora.alterada` si
  encuentra una ruptura.
- `registrarAuditoria(req, {accion, entidad, entidadId, sucursalId, detalle})`
  nunca rompe la operación si falla; solo lo registra en consola.
- El frontend también registra eventos de navegación y acciones sensibles con
  `POST /antifraude/evento` (`lib/eventos.js`).

### Alertas (`alertas` + `lib/alertas.js`)

`crearAlerta(req, {tipo, severidad, titulo, detalle, sucursalId, entidad, entidadId, correo})`.
Con `correo: true` (se usa en descuadres, cambios de CAI y otras alertas
graves) también se envía un correo a todos los admins. Las alertas tienen un flujo de estados: `pendiente` →
`investigando` → `resuelta` o `falso_positivo`, con nota. En la barra
lateral, "Antifraude" muestra un contador de pendientes, y los admins reciben
avisos emergentes (`/alertas/nuevas?desde_id=`).

Catálogo de alertas que existen hoy:

| Tipo | Disparador |
|---|---|
| `acceso.denegado` | alguien intenta usar algo que su rol no permite |
| `sesion.login_fallido` | N intentos fallidos |
| `sesion.dispositivo_nuevo` / `sesion.simultanea` | dispositivo desconocido, o dos a la vez |
| `horario.fuera` | operación fuera del horario configurado |
| `venta.descartar_orden` | orden descartada con monto alto |
| `venta.doble_factura` | mismos productos y total en la misma sucursal en pocos minutos |
| `venta.reimpresion_repetida` | 2 reimpresiones o más de una factura |
| `orden.estacionada` | orden abierta por más de N minutos (¿se cobró sin facturar?) |
| `tercera_edad.exceso` / `tercera_edad.carne_repetido` | demasiados descuentos al día, o el mismo carné repetido |
| `producto.baja_precio` | alguien baja el precio de un producto |
| `cai.cambio` | cambio de CAI o rango |
| `usuario.crear` / `usuario.permisos` / `usuario.contrasena` | cambios de usuarios |
| `cierre.descuadre` / `cierre.patron_desvio` / `cierre.reincidencia` / `cierre.sin_imprimir` | cierres |
| `arqueo.descuadre` | arqueo sorpresa con diferencia |
| `bitacora.alterada` | la cadena de hashes no cuadra |

### Reglas configurables (`config_antifraude`, `lib/reglas.js`)

`monto_alerta_descarte` 150 · `max_tercera_edad_dia` 10 ·
`max_usos_carne_dia` 3 · `minutos_orden_estacionada` 60 ·
`minutos_doble_factura` 5 · `minutos_hueco` 45 · `umbral_sobrante` 50 ·
`faltantes_reincidencia` 2 · `minutos_bloqueo_cajero` 10 ·
`minutos_bloqueo_otros` 20 · `intentos_login` 5 · `hora_apertura` 9 ·
`hora_cierre` 24 · `exigir_carne_tercera_edad` · `exigir_motivo_reimpresion` ·
`exigir_motivo_descarte` · `leyenda_factura_gratis` (desactivada por defecto:
es una promesa comercial). Tienen caché de 60 segundos.

### Pantalla Antifraude (solo admin)

- **Alertas:** filtros y cambio de estado con nota.
- **Señales por cajero:** puntaje de riesgo que combina descartes,
  reimpresiones, faltantes, tercera edad y horarios.
- **Línea de tiempo:** todo lo que hizo un usuario en un rango.
- **Arqueo sorpresa:** contar la gaveta en cualquier momento contra lo que
  dice el sistema.
- **Reglas.**

### Por qué así

Los robos típicos en caja son:

- no facturar (se cobra y se descarta la orden, o se deja estacionada);
- doble factura;
- entregar al cliente una factura que no corresponde;
- desviar pagos de tarjeta a efectivo;
- abusar de descuentos;
- reimprimir facturas viejas para entregarlas como nuevas;
- curiosear el sistema buscando huecos.

Cada módulo cubre uno de esos caminos.

---

## 14. Tiempo real, PWA y actualización

- `useCambiosEnVivo(tablas, callback)` escucha `postgres_changes` de Supabase
  Realtime, con un retraso para agrupar cambios seguidos. Las facturas,
  catálogos y alertas se actualizan solas en todas las cajas.
- **PWA:** `registerType: 'autoUpdate'`, `injectRegister: false`, y en
  workbox `skipWaiting`, `clientsClaim` y `cleanupOutdatedCaches`. El
  registro manual está en `lib/actualizacion.js`: cuando el service worker
  nuevo toma control (`controllerchange`), la app **se recarga sola si no
  hay una venta en curso**; si la hay, muestra "Actualizar ya".
- El servidor manda `Cache-Control: no-cache` para `index.html`, `sw.js` y el
  manifest. Sin esto, las cajas se quedaron días con la versión vieja: así
  apareció un cierre viejo que "no mostraba dónde llenar".
- La fecha del build (`__VERSION__`) se muestra en la app para saber qué
  versión tiene cada caja.

---

## 15. Fechas, paginación y otros detalles técnicos

- **Honduras es UTC−6 todo el año (sin horario de verano).** Los filtros "del
  día" se calculan con `inicioDelDia` y `finDelDia` en hora de Honduras
  (`lib/fechas.js`). Usar UTC corría las ventas de 6 p. m. en adelante al día
  siguiente.
- **PostgREST devuelve 1000 filas como máximo:** `traerTodo()` pagina con
  `.range()`, y `traerPorIds()` consulta por lotes de 150 ids (una URL larga
  revienta).
- `textoSeguroFiltro()` limpia el texto antes de meterlo en `.or()` (las
  comas y los paréntesis rompen el filtro).
- Montos con `numeric(12,2)` y `round2()` con `Number.EPSILON`.
- Las respuestas de error siempre son `{ error: 'mensaje en español' }`, y el
  frontend lo muestra tal cual.

---

## 16. Sistema de diseño

- Paleta "Ítalo Moderno" (tokens en `:root` de `index.css`):
  - `--navy` #f2f4ee (fondo) y `--navy-panel` #fff;
  - `--primario` #2f5d3a (verde profundo) y `--salvia` #c5d288;
  - barra lateral oscura #141a12;
  - estados `--ok`, `--aviso`, `--peligro` e `--info`, cada uno con su
    `*-fondo`.
- **Modo oscuro** con `:root[data-tema='oscuro']` (un botón en la barra
  lateral).
- Tipografía: **Poppins** para títulos y **Inter** para texto; Barlow
  Condensed para cifras de KPIs.
- **Color por sucursal:** `--color-sucursal` cambia según la sucursal activa
  (bordes de paneles, pestañas activas, encabezados de tabla).
- Barra lateral por grupos (Operación, Negocio, Control, Ajustes), filtrada
  por rol, con modo compacto (solo íconos). Íconos SVG propios
  (`components/Icono.jsx`).
- Botones de hover con `filter: brightness()`: nunca sobrescribir el
  `background` global, porque se pierden los colores de botones especiales
  como Efectivo y Tarjeta.

---

## 17. Correo

- `nodemailer` con Gmail y una contraseña de aplicación (`GMAIL_USER`,
  `GMAIL_APP_PASSWORD`). Si no están configuradas, los envíos se saltan con
  un motivo claro y la operación sigue.
- Los destinatarios de alertas son todos los perfiles admin activos con
  correo real (`destinatariosAdmins`).
- Hay plantillas HTML de marca para factura (con PDF adjunto), cotización
  (con PDF), alerta y resumen de cierre.

---

## 18. Lecciones aprendidas (bugs ya resueltos)

1. **Órdenes duplicadas:** se creaba una orden por producto. Una orden es
   **una** fila en `ventas`; sus líneas van en `detalle_venta`.
2. **`guardarDetalle` insertaba columnas que no existían**: se cayó la
   facturación. Siempre hay que validar contra el esquema real.
3. **El descuento global solo se restaba del total**, y el ISV quedaba
   calculado sobre el precio completo. Hay que repartirlo antes de separar
   base e ISV.
4. **El efectivo del cierre sumaba el pago bruto** e inflaba lo esperado.
   Debe ser neto del cambio.
5. **Las facturas anuladas sumaban** en el cierre y en los reportes.
6. **Rangos de fecha en UTC** movían ventas al día siguiente. Usar la hora de
   Honduras.
7. **Más de 1000 filas truncadas** sin aviso. Paginar.
8. **La numeración de borrador chocaba** con la fiscal al activar el CAI. Se
   resolvió con el prefijo `BORRADOR-`.
9. **Una caché vieja de la PWA** dejaba cajas con versiones antiguas. Se
   resolvió con no-cache en el servidor más la actualización automática.
10. **Un cajero podía pedir reportes de todas las sucursales** por la API
    (solo se ocultaba en pantalla). Toda regla de rol va en el backend.
11. **Revocar EXECUTE solo a anon/authenticated no alcanza.** Hay que
    revocarlo a PUBLIC.
12. **Los PDF con `<a href>` daban 401.** Se piden con fetch, se convierten en
    blob y la ventana se abre antes del await.
13. **El hover global de los botones** borraba los colores de Efectivo y
    Tarjeta. Usar `filter`.
14. **`desde_id=0` en las alertas nuevas** notificaba todas las viejas. El
    filtro `gt` se aplica siempre que venga el parámetro.
15. **La leyenda "si no recibe su factura es GRATIS"** es una promesa
    comercial: queda como opción, apagada por defecto.

---

## 19. Adaptación a la fábrica de piedra de enchape

> Los supuestos van marcados con **[SUPUESTO]**; hay que confirmarlos con
> Juan y con el contador antes de construir.

### Qué se reutiliza tal cual

- Arquitectura completa (Express + React PWA + Supabase + Render), usuarios
  libres, roles, `requireRole` con bitácora, bloqueo por inactividad y
  dispositivos.
- Motor fiscal: CAI, puntos de emisión, `finalizar_venta`, modo borrador,
  ISV incluido o separado, RTN, notas de crédito y reimpresión con COPIA.
  **[SUPUESTO]** La fábrica es otra persona jurídica, con su propio RTN y sus
  propios CAI.
- Bitácora inmutable, alertas, reglas configurables, arqueo sorpresa y la
  pantalla Antifraude.
- Cierre de caja con cuadre por forma de pago (cambiar "POS BAC/Ficohsa" por
  los POS y bancos que use la fábrica).
- Cotización con PDF de marca, calendario y lista de control. Aquí es donde
  más valor aporta: **proyectos y entregas**.
- Reportes, dashboard, CSV, tiempo real, sistema de diseño (con otra paleta)
  y la actualización de la PWA.
- `lib/fechas.js`, `lib/consultas.js` y todas las lecciones de la sección 18.

### Qué cambia

| Italo (gelato) | Fábrica de piedra de enchape |
|---|---|
| Producto por unidad o copita | Producto por **m²**, **pieza**, **caja** y **metro lineal** (esquineros). Hay que guardar `unidad_venta` y la conversión (m² por caja, piezas por m²) **[SUPUESTO]** |
| Precio con ISV incluido (consumidor final) | Se vende mucho a constructoras y ferreterías: probablemente **precio + ISV aparte**. Conviene un flag por lista de precios o cliente **[SUPUESTO]** |
| Cotización = copitas + servicio | Cotización de **proyecto u obra con varias líneas**: modelo, color, m², % de desperdicio (sugerir un 5 a 10 %), accesorios (esquineros, pegamento, sellador), flete e instalación. Generalizar a `cotizaciones` + `cotizacion_lineas` |
| Calendario de eventos | Calendario de **producción, despachos e instalaciones**. Lista de control por pedido: anticipo, programado en producción, moldeado, curado (N días), empacado, despachado, instalado y saldo cobrado |
| Tercera edad 25 % | **Descuentos por volumen o por cliente** (contratistas, distribuidores) con topes por rol; los descuentos que pasen el tope piden autorización de un manager |
| Venta de mostrador inmediata | **Pedidos con anticipo** (típico 50 %) y saldo contra entrega; **crédito** a clientes aprobados con límite y días de plazo → **cuentas por cobrar** con antigüedad de saldos |
| Sin inventario | **Inventario** de producto terminado por modelo, color y lote, y de materia prima (cemento, arena, agregados, pigmentos, moldes, cajas). Movimientos: producción (+PT, −MP), venta o despacho (−PT), merma, ajuste con motivo |

### Módulos nuevos sugeridos

1. **Órdenes de producción:** modelo, color, m² o piezas, lote, fecha de
   colado, días de curado y fecha disponible. Consumo teórico de materia prima
   por m² (receta) contra el consumo real, para detectar desperdicio o robo.
2. **Despachos / guías de remisión:** nada sale de la planta sin una guía
   ligada a una factura o a un pedido con anticipo. Incluye vehículo,
   conductor, peso o cantidad, y la firma o foto de recibido.
3. **Cuentas por cobrar:** estado de cuenta por cliente, abonos, recibos y
   alertas por vencimiento.
4. **Control de calidad y mermas:** piezas rotas o de segunda, con motivo y
   responsable.

### Antifraude específico para fábrica

- Despachos sin factura ni pedido: **alerta crítica**.
- Diferencia entre lo producido y lo que entró a inventario, y entre la
  materia prima consumida y la receta.
- Ajustes de inventario sin motivo, o repetidos por el mismo usuario.
- Ventas a precio menor que la lista, o descuentos por encima del tope del
  rol.
- Clientes de crédito que pasan su límite, y abonos registrados en efectivo
  sin recibo.
- Mermas por encima del porcentaje normal.
- Conteos físicos sorpresa de inventario (el equivalente al arqueo sorpresa).

### Preguntas para el contador

- ¿Precios con ISV incluido o separado? ¿Hay ventas exentas o exoneradas
  (proyectos con exoneración)?
- ¿Retenciones que aplican los clientes grandes? ¿Se necesita un documento de
  retención?
- ¿Guía de remisión como documento fiscal con su propio CAI?
- ¿Anticipos: se factura el anticipo o todo contra entrega?

---

## 20. Prompt inicial para la sesión nueva

Pega esto en la sesión nueva de Claude Code, después de crear el repositorio
nuevo (por ejemplo `piedra-facturacion`) y de agregar `italo-facturacion` como
referencia:

```
Vamos a construir el sistema de facturación, producción y despachos para
nuestra fábrica de piedra de enchape en San Pedro Sula, replicando la
arquitectura y la lógica de nuestro sistema italo-facturacion (repositorio
Juanfunes25/italo-facturacion, agrégalo como referencia de solo lectura).

1. Lee primero docs/GUIA-REPLICACION.md de italo-facturacion completo, y usa
   docs/CODIGO-COMPLETO.md o el repo para ver el código exacto.
2. Mismo stack: Node/Express + React/Vite PWA + Supabase (proyecto nuevo) +
   Render free, un solo servicio. Repositorio nuevo: <nombre>.
3. Reutiliza tal cual: usuarios libres, roles y requireRole con bitácora,
   motor CAI (finalizar_venta, modo borrador), cálculo de ISV, bitácora
   inmutable con cadena de hashes, alertas y reglas antifraude, cierre de
   caja con cuadre, PDF de marca, calendario con lista de control,
   actualización de la PWA, fechas en hora de Honduras, paginación >1000
   filas. Respeta todas las lecciones de la sección 18.
4. Adapta según la sección 19: productos por m², pieza, caja y metro lineal;
   cotizaciones de proyecto con líneas; pedidos con anticipo y crédito;
   inventario de producto terminado y materia prima; órdenes de producción;
   despachos con guía; antifraude de fábrica.
5. Antes de programar, dame el esquema de datos propuesto y la lista de
   preguntas pendientes (contador, CAI, unidades de venta, POS/bancos) en una
   sola tanda. Luego construye por fases, haciendo commit y push a main en
   cada fase.
6. Estética: la misma calidad visual (barra lateral, tokens, modo oscuro),
   con la paleta de la marca de la fábrica, que te voy a pasar.
```

---

## 21. Lista de puesta en marcha

1. Crear el repo en GitHub y el proyecto en Supabase (región `us-east-1`).
2. Aplicar las migraciones base (adaptadas) y sembrar sucursales o plantas,
   formas de pago, "Consumidor Final" y el catálogo.
3. Crear el primer usuario admin en Supabase Auth y su fila en `perfiles`
   con `rol='admin'`.
4. Crear el servicio en Render desde `render.yaml` y cargar las variables de
   entorno.
5. Configurar los puntos de emisión en **modo borrador**. Activarlos con el
   CAI real cuando el SAR lo entregue.
6. Configurar Gmail (contraseña de aplicación) para los correos de alertas.
7. Probar en cada caja: impresión térmica (página de prueba en
   Ajustes → Impresora), una venta, una reimpresión, una anulación, un cierre
   con descuadre intencional y un arqueo sorpresa.
8. Revisar Antifraude → Reglas y ajustar los umbrales a la operación real.

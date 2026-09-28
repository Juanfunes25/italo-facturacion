# Código completo — Italo Facturación

Todo el código fuente del proyecto en un solo documento, en orden de lectura
(configuración → base de datos → backend → frontend). La explicación de la
lógica, las decisiones y cómo adaptarlo a otro negocio está en
`docs/GUIA-REPLICACION.md`: léela primero.

- Archivos: 92 · Líneas: 19,394
- No se incluyen: `node_modules`, el build (`dist`), `package-lock.json`
  ni las fuentes TTF de `backend/assets/fonts` (Poppins, Inter y Barlow
  Condensed, gratuitas en Google Fonts).
- Regenerar: `node scripts/generar-codigo-completo.mjs`

## Índice

- **Configuración y despliegue**
  - `render.yaml` (25 líneas)
  - `README.md` (93 líneas)
  - `backend/package.json` (18 líneas)
  - `backend/.env.example` (10 líneas)
  - `frontend/package.json` (21 líneas)
  - `frontend/vite.config.js` (40 líneas)
  - `frontend/index.html` (20 líneas)
- **Base de datos (migraciones Supabase, en orden)**
  - `supabase/migrations/0001_init.sql` (266 líneas)
  - `supabase/migrations/0002_correlativo.sql` (64 líneas)
  - `supabase/migrations/0003_cierre_desglose_pagos.sql` (4 líneas)
  - `supabase/migrations/0004_cotizaciones_eventos.sql` (30 líneas)
  - `supabase/migrations/0005_nota_interna.sql` (3 líneas)
  - `supabase/migrations/0006_estado_correo_factura.sql` (4 líneas)
  - `supabase/migrations/0007_barras_descuento_auditoria_realtime.sql` (201 líneas)
  - `supabase/migrations/0008_auditoria_permisos_funciones.sql` (9 líneas)
  - `supabase/migrations/0009_finalizar_venta_endurecer.sql` (7 líneas)
  - `supabase/migrations/0010_color_sucursal_y_cierre_detallado.sql` (28 líneas)
  - `supabase/migrations/0011_numeracion_borrador.sql` (84 líneas)
  - `supabase/migrations/0012_descuento_por_linea.sql` (12 líneas)
  - `supabase/migrations/0013_alertas_antifraude.sql` (29 líneas)
  - `supabase/migrations/0014_antifraude_avanzado.sql` (58 líneas)
  - `supabase/migrations/0015_calendario_eventos.sql` (18 líneas)
- **Backend: servidor, conexión y middleware**
  - `backend/server.js` (119 líneas)
  - `backend/db.js` (16 líneas)
  - `backend/middleware/auth.js` (33 líneas)
  - `backend/middleware/requireRole.js` (20 líneas)
- **Backend: librerías de negocio**
  - `backend/lib/acceso.js` (51 líneas)
  - `backend/lib/alertas.js` (31 líneas)
  - `backend/lib/antifraude.js` (271 líneas)
  - `backend/lib/auditoria.js` (31 líneas)
  - `backend/lib/cierre.js` (104 líneas)
  - `backend/lib/consultas.js` (36 líneas)
  - `backend/lib/correo.js` (188 líneas)
  - `backend/lib/cotizacionPdf.js` (324 líneas)
  - `backend/lib/empresa.js` (40 líneas)
  - `backend/lib/facturacion.js` (123 líneas)
  - `backend/lib/fechas.js` (53 líneas)
  - `backend/lib/pdf.js` (102 líneas)
  - `backend/lib/reglas.js` (53 líneas)
  - `backend/lib/ticket.js` (304 líneas)
- **Backend: rutas de la API**
  - `backend/routes/antifraude.js` (514 líneas)
  - `backend/routes/auditoria.js` (34 líneas)
  - `backend/routes/cajaChica.js` (34 líneas)
  - `backend/routes/categorias.js` (35 líneas)
  - `backend/routes/cierres.js` (402 líneas)
  - `backend/routes/clientes.js` (55 líneas)
  - `backend/routes/cotizaciones.js` (445 líneas)
  - `backend/routes/dashboard.js` (128 líneas)
  - `backend/routes/facturaImpresion.js` (83 líneas)
  - `backend/routes/notasCredito.js` (94 líneas)
  - `backend/routes/productos.js` (134 líneas)
  - `backend/routes/puntosEmision.js` (204 líneas)
  - `backend/routes/reportes.js` (408 líneas)
  - `backend/routes/sucursales.js` (108 líneas)
  - `backend/routes/usuarios.js` (154 líneas)
  - `backend/routes/ventas.js` (562 líneas)
- **Frontend: shell y utilidades**
  - `frontend/src/main.jsx` (9 líneas)
  - `frontend/src/App.jsx` (448 líneas)
  - `frontend/src/api.js` (31 líneas)
  - `frontend/src/supabaseClient.js` (6 líneas)
  - `frontend/src/lib/acceso.js` (33 líneas)
  - `frontend/src/lib/actualizacion.js` (55 líneas)
  - `frontend/src/lib/cierre.js` (45 líneas)
  - `frontend/src/lib/coloresSucursal.js` (53 líneas)
  - `frontend/src/lib/csv.js` (20 líneas)
  - `frontend/src/lib/dispositivo.js` (19 líneas)
  - `frontend/src/lib/documentos.js` (156 líneas)
  - `frontend/src/lib/eventos.js` (33 líneas)
  - `frontend/src/lib/facturacion.js` (59 líneas)
  - `frontend/src/lib/rangosFecha.js` (83 líneas)
  - `frontend/src/lib/tiempoReal.js` (52 líneas)
- **Frontend: componentes**
  - `frontend/src/components/BloqueoInactividad.jsx` (88 líneas)
  - `frontend/src/components/CalendarioEventos.jsx` (753 líneas)
  - `frontend/src/components/Graficas.jsx` (60 líneas)
  - `frontend/src/components/Icono.jsx` (61 líneas)
  - `frontend/src/components/NotificacionesAlertas.jsx` (102 líneas)
- **Frontend: pantallas**
  - `frontend/src/screens/Antifraude.jsx` (765 líneas)
  - `frontend/src/screens/Bitacora.jsx` (286 líneas)
  - `frontend/src/screens/CajaChica.jsx` (135 líneas)
  - `frontend/src/screens/Catalogo.jsx` (372 líneas)
  - `frontend/src/screens/Cierres.jsx` (644 líneas)
  - `frontend/src/screens/Clientes.jsx` (153 líneas)
  - `frontend/src/screens/Cotizaciones.jsx` (569 líneas)
  - `frontend/src/screens/Dashboard.jsx` (233 líneas)
  - `frontend/src/screens/Facturas.jsx` (405 líneas)
  - `frontend/src/screens/Impresora.jsx` (118 líneas)
  - `frontend/src/screens/Pos.jsx` (1038 líneas)
  - `frontend/src/screens/PuntosEmision.jsx` (279 líneas)
  - `frontend/src/screens/Reportes.jsx` (976 líneas)
  - `frontend/src/screens/Sucursales.jsx` (234 líneas)
  - `frontend/src/screens/Usuarios.jsx` (213 líneas)
- **Frontend: estilos**
  - `frontend/src/index.css` (4471 líneas)

## Configuración y despliegue

### `render.yaml`

```yaml
services:
  - type: web
    name: italo-facturacion
    runtime: node
    plan: free
    branch: main
    buildCommand: npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend
    startCommand: node backend/server.js
    envVars:
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: VITE_SUPABASE_URL
        sync: false
      - key: VITE_SUPABASE_ANON_KEY
        sync: false
      # Opcionales: correo de resumen tras cada cierre. Sin esto el cierre
      # funciona igual, solo no manda el correo.
      - key: GMAIL_USER
        sync: false
      - key: GMAIL_APP_PASSWORD
        sync: false
      - key: RESUMEN_CIERRE_EMAIL
        sync: false
```

### `README.md`

````markdown
# Italo Facturación

Sistema propio de punto de venta + facturación fiscal para las 4 sucursales activas
de Italo Gelateria (Los Andes, 10 Calle EXPRESS, Mackey, Próceres), pensado para
reemplazar por completo a WizPOS.

Ver `docs/ENTREGABLE-1.md` para el detalle del esquema de datos, el plan de
despliegue y las preguntas fiscales que hay que resolver antes de emitir facturas
reales (CAI/SAR).

## Estado

Todas las fases del MVP están implementadas en código (backend + frontend):

1. Esquema Supabase + autenticación/roles.
2. Catálogo (categorías/productos) + clientes.
3. Punto de venta: 3 paneles, órdenes abiertas (autoguardado), búsqueda.
4. Motor de CAI: correlativo atómico (`finalizar_venta`), alertas de rango
   vencido/agotado, activación del CAI real desde la pantalla de admin.
5. Ticket de texto 40/48 columnas para térmica + PDF tamaño carta.
6. Cierre de caja (con `factura_desde`/`factura_hasta`) y reportes de
   ventas/ISV.

Además: CRUD de sucursales (para agregar una quinta, sexta, etc. sin tocar
código), y datos de prueba ya cargados (usuario admin + un CAI ficticio por
sucursal, ver `supabase/seed_datos_prueba.sql`).

**No emite facturas con validez fiscal todavía** — los puntos de emisión
están en modo borrador (`es_borrador = true`) a propósito, aunque ya tienen
un CAI de prueba cargado para poder testear el flujo completo. Hasta
confirmar el RTN y el CAI real con el contador, el ticket/PDF sigue
mostrando "sin validez fiscal" (ver `docs/ENTREGABLE-1.md`).

**Desplegado en Render** (https://italo-facturacion.onrender.com), deploy
automático en cada push a `main`. Falta un solo paso manual: pegar la
`SUPABASE_SERVICE_ROLE_KEY` real en las variables de entorno del servicio en
Render (Dashboard → italo-facturacion → Environment) — ese valor es secreto
y ninguna herramienta puede leerlo por mí, sólo se ve en el dashboard de
Supabase (Project Settings → API → service_role → Reveal). Sin eso el
backend no puede escribir en la base y el servicio no arranca.

## Desarrollo local

Backend (puerto 4200):

```bash
cd backend
npm install
cp .env.example .env   # completar SUPABASE_SERVICE_ROLE_KEY
npm run dev
```

Frontend (puerto 5174), en otra terminal:

```bash
cd frontend
npm install
cp .env.example .env   # completar VITE_SUPABASE_ANON_KEY
npm run dev
```

Abrir `http://localhost:5174`.

Las claves del proyecto Supabase (`italo-facturacion`, ref `bxifnabilsyqpmhqkeiw`)
están en el dashboard de Supabase → Project Settings → API.

## Usuario admin

Ya está creado (ver `supabase/seed_datos_prueba.sql`): `juancarlosocchiena@gmail.com`,
rol `admin`, sin sucursal fija (opera sobre las 4). La contraseña se la pasó
Claude a Juan por chat al crearlo — cámbiala desde Supabase → Authentication
→ Users en cuanto puedas.

Para crear cajeros nuevos ya no hace falta el SQL Editor: la pantalla
"Usuarios" del sistema (sólo admin) crea el login de Auth y el perfil en un
solo paso.

## Despliegue en Render

Ya está creado el servicio `italo-facturacion` (https://italo-facturacion.onrender.com),
apuntando a este repo, rama `main`, deploy automático en cada push. Variables
de entorno ya configuradas salvo una:

- `SUPABASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — puestas.
- `SUPABASE_SERVICE_ROLE_KEY` — pendiente. Sacarla de Supabase → Project
  Settings → API → service_role → Reveal, y pegarla en Render → el servicio
  → Environment. Es el único paso que nadie puede automatizar por ser un
  secreto.

## Tests

Pendiente (se agregan junto con la lógica de negocio de facturación en la
Fase 4 — motor de correlativo/CAI).
````

### `backend/package.json`

```json
{
  "name": "italo-facturacion-backend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node --watch server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "nodemailer": "^10.0.10",
    "pdfkit": "^0.15.0"
  }
}
```

### `backend/.env.example`

```bash
PORT=4200
SUPABASE_URL=https://bxifnabilsyqpmhqkeiw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=

# Opcionales: si se completan, cada cierre de caja manda un correo de
# resumen (igual al "Resumen de Impuestos" de WizPOS). Si se dejan vacíos,
# el cierre funciona igual, simplemente no manda el correo.
GMAIL_USER=
GMAIL_APP_PASSWORD=
RESUMEN_CIERRE_EMAIL=
```

### `frontend/package.json`

```json
{
  "name": "italo-facturacion-frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0",
    "vite-plugin-pwa": "^0.20.5"
  }
}
```

### `frontend/vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Fecha del build: se muestra en la app para saber qué versión tiene cada caja.
  define: { __VERSION__: JSON.stringify(new Date().toISOString()) },
  plugins: [
    react(),
    VitePWA({
      // El service worker nuevo se activa apenas se descarga (skipWaiting)
      // y el registro es manual (src/lib/actualizacion.js): la app recarga
      // sola cuando no hay una venta en curso. Antes las cajas se quedaban
      // días con la versión vieja en caché (así apareció el cierre viejo
      // con propinas y descuentos).
      registerType: 'autoUpdate',
      injectRegister: false,
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallbackDenylist: [/^\/api\//],
      },
      manifest: {
        name: 'Italo Facturación',
        short_name: 'Facturación',
        theme_color: '#3e5a34',
        background_color: '#efddb7',
        display: 'standalone',
        icons: [],
      },
    }),
  ],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:4200',
    },
  },
});
```

### `frontend/index.html`

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#141a12" />
    <title>Italo Facturación</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/src/index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## Base de datos (migraciones Supabase, en orden)

### `supabase/migrations/0001_init.sql`

```sql
-- Esquema inicial: sistema de facturación fiscal Italo Gelateria
-- Fase 1 del proyecto (esquema + auth). No fija CAI real todavía: los puntos_emision
-- se crean en modo borrador (es_borrador = true, cai = null) hasta que el contador
-- confirme los datos del SAR (ver preguntas 1 y 3 del entregable).

create extension if not exists "pgcrypto";

create type rol_usuario as enum ('admin', 'manager', 'cajero');
create type estado_venta as enum ('abierta', 'pagada', 'anulada', 'borrador');
create type tipo_orden_venta as enum ('restaurante', 'para_llevar');
create type estado_cierre as enum ('abierto', 'cerrado');
create type estado_nota_credito as enum ('emitida', 'anulada');

-- ─────────────────────────────────────────────────────────────────────────
-- Sucursales
-- ─────────────────────────────────────────────────────────────────────────
create table sucursales (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  alias text not null unique,
  direccion text not null,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- Puntos de emisión: CAI + rango de correlativos por sucursal.
-- Mientras no haya CAI confirmado por el SAR, es_borrador = true y cai = null:
-- el sistema sigue asignando correlativo interno pero la factura se marca
-- como documento sin validez fiscal (ver preguntas 1 y 3).
-- ─────────────────────────────────────────────────────────────────────────
create table puntos_emision (
  id uuid primary key default gen_random_uuid(),
  sucursal_id uuid not null references sucursales(id),
  punto_emision_codigo text not null,
  punto_venta_codigo text not null,
  tipo_documento_codigo text not null default '01',
  cai text,
  correlativo_desde bigint not null,
  correlativo_hasta bigint not null,
  correlativo_actual bigint not null,
  fecha_limite_emision date,
  es_borrador boolean not null default true,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  constraint rango_valido check (correlativo_hasta >= correlativo_desde),
  constraint correlativo_en_rango check (
    correlativo_actual >= correlativo_desde and correlativo_actual <= correlativo_hasta + 1
  )
);
create unique index puntos_emision_sucursal_activo_idx on puntos_emision(sucursal_id) where activo;

-- ─────────────────────────────────────────────────────────────────────────
-- Perfiles (usuarios ligados a Supabase Auth)
-- ─────────────────────────────────────────────────────────────────────────
create table perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  sucursal_id uuid references sucursales(id),
  nombre text not null,
  rol rol_usuario not null default 'cajero',
  cierre_ciego boolean not null default false,
  sin_horario boolean not null default false,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- Catálogo: categorías y productos
-- ─────────────────────────────────────────────────────────────────────────
create table categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  orden int not null default 0,
  activo boolean not null default true
);

create table productos (
  id uuid primary key default gen_random_uuid(),
  codigo text unique,
  nombre text not null,
  categoria_id uuid references categorias(id),
  precio numeric(12, 2) not null check (precio >= 0),
  impuesto1_tasa numeric(5, 4) not null default 0.15,
  impuesto2_tasa numeric(5, 4) not null default 0,
  impuesto3_tasa numeric(5, 4) not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- Clientes
-- ─────────────────────────────────────────────────────────────────────────
create table clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null default 'Consumidor Final',
  rtn text,
  direccion text,
  telefono text,
  email text,
  exento_impuestos boolean not null default false,
  es_consumidor_final boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- Formas de pago
-- ─────────────────────────────────────────────────────────────────────────
create table formas_pago (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique
);

-- ─────────────────────────────────────────────────────────────────────────
-- Ventas (cabecera de factura) y detalle
-- ─────────────────────────────────────────────────────────────────────────
create table ventas (
  id uuid primary key default gen_random_uuid(),
  numero_orden bigint not null,
  sucursal_id uuid not null references sucursales(id),
  punto_emision_id uuid references puntos_emision(id),
  numero_factura text,
  correlativo bigint,
  cliente_id uuid references clientes(id),
  cajero_id uuid references perfiles(id),
  tipo_orden tipo_orden_venta,
  estado estado_venta not null default 'abierta',
  subtotal_exento numeric(12, 2) not null default 0,
  subtotal_exonerado numeric(12, 2) not null default 0,
  subtotal_gravado_15 numeric(12, 2) not null default 0,
  descuento numeric(12, 2) not null default 0,
  isv_total numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  efectivo_recibido numeric(12, 2),
  cambio numeric(12, 2),
  fecha_emision timestamptz,
  created_at timestamptz not null default now()
);
create index ventas_sucursal_fecha_idx on ventas(sucursal_id, fecha_emision);
create unique index ventas_numero_factura_idx on ventas(numero_factura) where numero_factura is not null;

create table detalle_venta (
  id uuid primary key default gen_random_uuid(),
  venta_id uuid not null references ventas(id) on delete cascade,
  producto_id uuid references productos(id),
  nombre_producto text not null,
  cantidad numeric(12, 3) not null check (cantidad > 0),
  precio_unitario numeric(12, 2) not null,
  descuento numeric(12, 2) not null default 0,
  impuesto_tasa numeric(5, 4) not null default 0.15,
  monto numeric(12, 2) not null
);

create table venta_pagos (
  id uuid primary key default gen_random_uuid(),
  venta_id uuid not null references ventas(id) on delete cascade,
  forma_pago_id uuid not null references formas_pago(id),
  monto numeric(12, 2) not null check (monto > 0)
);

-- ─────────────────────────────────────────────────────────────────────────
-- Cierres de caja
-- ─────────────────────────────────────────────────────────────────────────
create table cierres_caja (
  id uuid primary key default gen_random_uuid(),
  sucursal_id uuid not null references sucursales(id),
  cajero_id uuid references perfiles(id),
  elaboro_id uuid references perfiles(id),
  fecha_inicio timestamptz not null,
  fecha_fin timestamptz not null,
  efectivo_contado numeric(12, 2),
  fondo_caja numeric(12, 2) not null default 0,
  salidas numeric(12, 2) not null default 0,
  propinas numeric(12, 2) not null default 0,
  descuentos numeric(12, 2) not null default 0,
  factura_desde text,
  factura_hasta text,
  total_esperado numeric(12, 2),
  total_contado numeric(12, 2),
  diferencia numeric(12, 2),
  cierre_ciego boolean not null default false,
  estado estado_cierre not null default 'abierto',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- Notas de crédito / anulaciones
-- ─────────────────────────────────────────────────────────────────────────
create table notas_credito (
  id uuid primary key default gen_random_uuid(),
  venta_id uuid not null references ventas(id),
  numero_nota text,
  motivo text not null,
  usuario_id uuid references perfiles(id),
  monto numeric(12, 2) not null,
  estado estado_nota_credito not null default 'emitida',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- Caja chica (fase posterior; tabla incluida desde ya en el esquema)
-- ─────────────────────────────────────────────────────────────────────────
create table caja_chica (
  id uuid primary key default gen_random_uuid(),
  sucursal_id uuid not null references sucursales(id),
  tipo text not null,
  monto numeric(12, 2) not null,
  concepto text,
  usuario_id uuid references perfiles(id),
  fecha date not null default current_date
);

-- ─────────────────────────────────────────────────────────────────────────
-- RLS: el backend usa la service_role key (bypassa RLS) para toda la
-- lógica de negocio. Estas policies son defensa en profundidad para el uso
-- futuro de clientes autenticados directos contra Supabase.
-- ─────────────────────────────────────────────────────────────────────────
alter table sucursales enable row level security;
alter table puntos_emision enable row level security;
alter table perfiles enable row level security;
alter table categorias enable row level security;
alter table productos enable row level security;
alter table clientes enable row level security;
alter table formas_pago enable row level security;
alter table ventas enable row level security;
alter table detalle_venta enable row level security;
alter table venta_pagos enable row level security;
alter table cierres_caja enable row level security;
alter table notas_credito enable row level security;
alter table caja_chica enable row level security;

create policy "perfiles: usuario ve su propio perfil"
  on perfiles for select
  using (id = auth.uid());

create policy "catalogo: lectura para autenticados"
  on categorias for select to authenticated using (true);
create policy "productos: lectura para autenticados"
  on productos for select to authenticated using (true);
create policy "sucursales: lectura para autenticados"
  on sucursales for select to authenticated using (true);
create policy "formas_pago: lectura para autenticados"
  on formas_pago for select to authenticated using (true);

-- ─────────────────────────────────────────────────────────────────────────
-- Seed mínimo
-- ─────────────────────────────────────────────────────────────────────────
insert into clientes (nombre, es_consumidor_final, exento_impuestos)
values ('Consumidor Final', true, false);

insert into formas_pago (nombre) values ('Efectivo'), ('Tarjeta'), ('Transferencia');

insert into sucursales (nombre, alias, direccion) values
  ('Inversiones Milano S de R.L. - Los Andes', 'los_andes', 'Los Andes, San Pedro Sula'),
  ('Inversiones Milano S de R.L. - 10 Calle', '10_calle_express', '10 Calle, San Pedro Sula'),
  ('Inversiones Milano S de R.L. - Mackey', 'mackey', 'Mackey, San Pedro Sula'),
  ('Inversiones Milano S de R.L. - Próceres', 'proceres', 'Próceres, San Pedro Sula');

-- Un punto de emisión "borrador" por sucursal: sin CAI, correlativo interno
-- arrancando en 1. Reemplazar cai/correlativo_desde/correlativo_hasta/
-- fecha_limite_emision en cuanto el contador confirme los datos del SAR.
insert into puntos_emision (
  sucursal_id, punto_emision_codigo, punto_venta_codigo, tipo_documento_codigo,
  cai, correlativo_desde, correlativo_hasta, correlativo_actual, fecha_limite_emision, es_borrador
)
select id, '001', '001', '01', null, 1, 99999999, 1, null, true
from sucursales;
```

### `supabase/migrations/0002_correlativo.sql`

```sql
-- Fase 4: motor de correlativo/CAI. finalizar_venta() hace en una sola
-- transacción: lock del punto_emision, validación de rango/fecha límite,
-- incremento atómico del correlativo y actualización de la venta. Así nunca
-- se puede saltar ni repetir un número, ni siquiera con dos cajeros
-- procesando pago al mismo tiempo en la misma sucursal.

create sequence if not exists ventas_numero_orden_seq;
alter table ventas alter column numero_orden set default nextval('ventas_numero_orden_seq');
alter sequence ventas_numero_orden_seq owned by ventas.numero_orden;

alter table ventas add column if not exists anulada boolean not null default false;

create or replace function finalizar_venta(
  p_venta_id uuid,
  p_efectivo numeric,
  p_cambio numeric
) returns ventas as $$
declare
  v_venta ventas%rowtype;
  v_pe puntos_emision%rowtype;
  v_correlativo bigint;
  v_numero text;
begin
  select * into v_venta from ventas where id = p_venta_id for update;
  if v_venta is null then
    raise exception 'Venta no encontrada';
  end if;
  if v_venta.estado not in ('abierta', 'borrador') then
    raise exception 'La venta ya fue procesada (estado actual: %)', v_venta.estado;
  end if;
  if v_venta.punto_emision_id is null then
    raise exception 'La venta no tiene punto de emisión asignado';
  end if;

  select * into v_pe from puntos_emision where id = v_venta.punto_emision_id for update;
  if v_pe is null or not v_pe.activo then
    raise exception 'Punto de emisión no encontrado o inactivo';
  end if;
  if v_pe.fecha_limite_emision is not null and v_pe.fecha_limite_emision < current_date then
    raise exception 'El rango autorizado de facturación venció el %', v_pe.fecha_limite_emision;
  end if;
  if v_pe.correlativo_actual > v_pe.correlativo_hasta then
    raise exception 'El rango de correlativos autorizado está agotado';
  end if;

  v_correlativo := v_pe.correlativo_actual;
  v_numero := v_pe.punto_emision_codigo || '-' || v_pe.punto_venta_codigo || '-'
              || v_pe.tipo_documento_codigo || '-' || lpad(v_correlativo::text, 8, '0');

  update puntos_emision set correlativo_actual = correlativo_actual + 1 where id = v_pe.id;

  update ventas set
    estado = 'pagada',
    numero_factura = v_numero,
    correlativo = v_correlativo,
    fecha_emision = now(),
    efectivo_recibido = p_efectivo,
    cambio = p_cambio
  where id = p_venta_id
  returning * into v_venta;

  return v_venta;
end;
$$ language plpgsql;
```

### `supabase/migrations/0003_cierre_desglose_pagos.sql`

```sql
-- Desglose por forma de pago (efectivo/tarjeta/transferencia) dentro del
-- turno, calculado al cerrar y guardado junto con el cierre para que el
-- historial no tenga que recalcularlo después.
alter table cierres_caja add column if not exists desglose_pagos jsonb;
```

### `supabase/migrations/0004_cotizaciones_eventos.sql`

```sql
-- Cotización de eventos (bodas, cumpleaños, corporativos): cantidad de
-- copitas + costo de servicio, con un PDF presentable para enviar al
-- cliente. No es un documento fiscal — no usa correlativo de CAI.

create type estado_cotizacion as enum ('borrador', 'enviada', 'aceptada', 'rechazada');

create sequence if not exists cotizaciones_eventos_numero_seq;

create table cotizaciones_eventos (
  id uuid primary key default gen_random_uuid(),
  numero bigint not null default nextval('cotizaciones_eventos_numero_seq'),
  nombre_cliente text not null,
  telefono_cliente text,
  email_cliente text,
  nombre_evento text not null,
  fecha_evento date,
  lugar text,
  cantidad_copitas int not null check (cantidad_copitas > 0),
  precio_copita numeric(12, 2) not null check (precio_copita >= 0),
  costo_servicio numeric(12, 2) not null default 0 check (costo_servicio >= 0),
  descuento numeric(12, 2) not null default 0 check (descuento >= 0),
  notas text,
  estado estado_cotizacion not null default 'borrador',
  usuario_id uuid references perfiles(id),
  created_at timestamptz not null default now()
);

alter sequence cotizaciones_eventos_numero_seq owned by cotizaciones_eventos.numero;

alter table cotizaciones_eventos enable row level security;
```

### `supabase/migrations/0005_nota_interna.sql`

```sql
-- Nota interna por orden (para cocina/caja) — nunca aparece en el ticket ni
-- en el PDF de la factura, es sólo para uso interno.
alter table ventas add column if not exists nota_interna text;
```

### `supabase/migrations/0006_estado_correo_factura.sql`

```sql
-- Para poder avisar en el listado de facturas si el envío automático del
-- PDF al cliente falló, en vez de fallar en silencio como antes.
alter table ventas add column if not exists correo_enviado boolean;
alter table ventas add column if not exists correo_error text;
```

### `supabase/migrations/0007_barras_descuento_auditoria_realtime.sql`

```sql
-- ─────────────────────────────────────────────────────────────────────────
-- Código de barras por producto (lector de barras en el POS).
-- ─────────────────────────────────────────────────────────────────────────
alter table productos add column if not exists codigo_barras text;
create unique index if not exists productos_codigo_barras_idx
  on productos(codigo_barras) where codigo_barras is not null;

-- ─────────────────────────────────────────────────────────────────────────
-- Descuento sólo por porcentaje fijo: 0, 10 o 25 (25 = tercera edad).
-- El monto en ventas.descuento se sigue guardando (lo calcula el backend),
-- pero el porcentaje queda registrado para reportar descuentos de tercera
-- edad por separado.
-- ─────────────────────────────────────────────────────────────────────────
alter table ventas add column if not exists descuento_porcentaje smallint not null default 0;
alter table ventas drop constraint if exists ventas_descuento_porcentaje_check;
alter table ventas add constraint ventas_descuento_porcentaje_check
  check (descuento_porcentaje in (0, 10, 25));

-- ─────────────────────────────────────────────────────────────────────────
-- Conversión cotización → factura en un clic.
-- ─────────────────────────────────────────────────────────────────────────
alter type estado_cotizacion add value if not exists 'facturada';
alter table cotizaciones_eventos add column if not exists rtn_cliente text;
alter table cotizaciones_eventos add column if not exists venta_id uuid references ventas(id);

-- ─────────────────────────────────────────────────────────────────────────
-- Bitácora de auditoría inalterable.
--
-- Tres capas:
--   1. Nadie (ni la service_role del backend) puede UPDATE/DELETE/TRUNCATE:
--      privilegios revocados + triggers que abortan la operación.
--   2. Cadena de hashes (como un libro contable): cada fila guarda el
--      SHA-256 de su contenido + el hash de la fila anterior. Si alguien
--      con acceso de superusuario alterara o borrara una fila, la cadena se
--      rompe desde ese punto y verificar_auditoria() lo detecta.
--   3. La fecha la pone la base de datos, no el cliente.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists auditoria (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  usuario_id uuid references perfiles(id),
  usuario_nombre text,
  accion text not null,
  entidad text not null,
  entidad_id text,
  sucursal_id uuid references sucursales(id),
  detalle jsonb not null default '{}'::jsonb,
  ip text,
  hash_anterior text,
  hash text not null
);

create index if not exists auditoria_created_idx on auditoria(created_at desc);
create index if not exists auditoria_entidad_idx on auditoria(entidad, entidad_id);
create index if not exists auditoria_usuario_idx on auditoria(usuario_id);

alter table auditoria enable row level security;

create or replace function auditoria_calcular_hash(
  p_id bigint,
  p_created_at timestamptz,
  p_usuario_id uuid,
  p_accion text,
  p_entidad text,
  p_entidad_id text,
  p_sucursal_id uuid,
  p_detalle jsonb,
  p_ip text,
  p_hash_anterior text
) returns text
language sql immutable
set search_path = ''
as $$
  select encode(
    extensions.digest(
      concat_ws('|',
        p_id::text,
        to_char(p_created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US'),
        coalesce(p_usuario_id::text, ''),
        p_accion,
        p_entidad,
        coalesce(p_entidad_id, ''),
        coalesce(p_sucursal_id::text, ''),
        p_detalle::text,
        coalesce(p_ip, ''),
        coalesce(p_hash_anterior, 'GENESIS')
      ),
      'sha256'
    ),
    'hex'
  );
$$;

create or replace function auditoria_antes_insertar() returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_anterior text;
begin
  -- Serializa las inserciones para que la cadena nunca se bifurque aunque
  -- dos sucursales registren eventos en el mismo milisegundo.
  perform pg_advisory_xact_lock(hashtext('auditoria_cadena'));

  new.created_at := now();
  select a.hash into v_anterior from public.auditoria a order by a.id desc limit 1;
  new.hash_anterior := v_anterior;
  new.hash := public.auditoria_calcular_hash(
    new.id, new.created_at, new.usuario_id, new.accion, new.entidad,
    new.entidad_id, new.sucursal_id, new.detalle, new.ip, new.hash_anterior
  );
  return new;
end;
$$;

create or replace function auditoria_prohibir_cambios() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'La bitácora de auditoría es inalterable: no se permite % sobre sus registros', tg_op;
end;
$$;

drop trigger if exists auditoria_hash on auditoria;
create trigger auditoria_hash
  before insert on auditoria
  for each row execute function auditoria_antes_insertar();

drop trigger if exists auditoria_sin_update on auditoria;
create trigger auditoria_sin_update
  before update or delete on auditoria
  for each row execute function auditoria_prohibir_cambios();

drop trigger if exists auditoria_sin_truncate on auditoria;
create trigger auditoria_sin_truncate
  before truncate on auditoria
  for each statement execute function auditoria_prohibir_cambios();

revoke update, delete, truncate on auditoria from anon, authenticated, service_role;

-- Recorre la cadena completa y devuelve la primera fila alterada (o null
-- si todo está íntegro).
create or replace function verificar_auditoria()
returns table (integra boolean, total bigint, primer_id_alterado bigint)
language plpgsql
set search_path = ''
as $$
declare
  r record;
  v_anterior text := null;
  v_total bigint := 0;
begin
  for r in select * from public.auditoria order by id loop
    v_total := v_total + 1;
    if r.hash_anterior is distinct from v_anterior
       or r.hash <> public.auditoria_calcular_hash(
         r.id, r.created_at, r.usuario_id, r.accion, r.entidad,
         r.entidad_id, r.sucursal_id, r.detalle, r.ip, r.hash_anterior
       ) then
      return query select false, v_total, r.id;
      return;
    end if;
    v_anterior := r.hash;
  end loop;
  return query select true, v_total, null::bigint;
end;
$$;

revoke execute on function verificar_auditoria() from anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- Tiempo real (Supabase Realtime, sobre WebSockets): las pantallas reciben
-- los cambios de ventas y catálogo al instante, sin recargar.
-- Realtime respeta RLS, así que cada usuario sólo recibe eventos de lo que
-- puede ver: un cajero con sucursal fija, sólo su sucursal.
-- ─────────────────────────────────────────────────────────────────────────
drop policy if exists "ventas: lectura segun sucursal del perfil" on ventas;
create policy "ventas: lectura segun sucursal del perfil"
  on ventas for select to authenticated
  using (
    exists (
      select 1 from perfiles p
      where p.id = (select auth.uid())
        and p.activo
        and (p.rol <> 'cajero' or p.sucursal_id is null or p.sucursal_id = ventas.sucursal_id)
    )
  );

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'ventas') then
    alter publication supabase_realtime add table ventas;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'productos') then
    alter publication supabase_realtime add table productos;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'categorias') then
    alter publication supabase_realtime add table categorias;
  end if;
end $$;
```

### `supabase/migrations/0008_auditoria_permisos_funciones.sql`

```sql
-- "revoke ... from anon, authenticated" no alcanza: Postgres da EXECUTE a
-- PUBLIC por defecto en toda función nueva. Sólo el backend (service_role)
-- verifica la bitácora.
revoke execute on function verificar_auditoria() from public, anon, authenticated;
grant execute on function verificar_auditoria() to service_role;
revoke execute on function auditoria_calcular_hash(bigint, timestamptz, uuid, text, text, text, uuid, jsonb, text, text) from public, anon, authenticated;
grant execute on function auditoria_calcular_hash(bigint, timestamptz, uuid, text, text, text, uuid, jsonb, text, text) to service_role;
revoke execute on function auditoria_antes_insertar() from public, anon, authenticated;
revoke execute on function auditoria_prohibir_cambios() from public, anon, authenticated;
```

### `supabase/migrations/0009_finalizar_venta_endurecer.sql`

```sql
-- finalizar_venta asigna el correlativo del CAI: sólo el backend debe poder
-- llamarla, y con search_path fijo (aviso del linter de seguridad de
-- Supabase). Con la lectura de ventas abierta a usuarios autenticados para
-- el tiempo real (migración 0007), se cierra también por la vía de RPC.
alter function public.finalizar_venta(uuid, numeric, numeric) set search_path = public, pg_temp;
revoke execute on function public.finalizar_venta(uuid, numeric, numeric) from public, anon, authenticated;
grant execute on function public.finalizar_venta(uuid, numeric, numeric) to service_role;
```

### `supabase/migrations/0010_color_sucursal_y_cierre_detallado.sql`

```sql
-- ─────────────────────────────────────────────────────────────────────────
-- Color de cada sucursal guardado en la base de datos (antes se derivaba
-- de un hash del id sobre 4 colores: con una 5ª sucursal se repetiría un
-- color). Se conservan exactamente los colores que ya tenían.
-- ─────────────────────────────────────────────────────────────────────────
alter table sucursales add column if not exists color text;
alter table sucursales drop constraint if exists sucursales_color_formato;
alter table sucursales add constraint sucursales_color_formato check (color is null or color ~ '^#[0-9a-fA-F]{6}$');

update sucursales set color = '#6c7fd6' where alias = '10_calle_express' and color is null;
update sucursales set color = '#c5603c' where alias = 'los_andes' and color is null;
update sucursales set color = '#b08d28' where alias = 'mackey' and color is null;
update sucursales set color = '#2e9e8f' where alias = 'proceres' and color is null;

-- ─────────────────────────────────────────────────────────────────────────
-- Cierre de caja con cuadre por forma de pago: lo que dice el sistema
-- contra lo que reportan los dos POS (BAC y Ficohsa) y el efectivo contado.
-- ─────────────────────────────────────────────────────────────────────────
alter table cierres_caja add column if not exists efectivo_sistema numeric(12, 2);
alter table cierres_caja add column if not exists tarjeta_sistema numeric(12, 2);
alter table cierres_caja add column if not exists transferencia_sistema numeric(12, 2);
alter table cierres_caja add column if not exists pos_bac numeric(12, 2);
alter table cierres_caja add column if not exists pos_ficohsa numeric(12, 2);
alter table cierres_caja add column if not exists diferencia_tarjeta numeric(12, 2);
alter table cierres_caja add column if not exists diferencia_efectivo numeric(12, 2);
alter table cierres_caja add column if not exists cantidad_facturas integer;
alter table cierres_caja add column if not exists total_ventas numeric(12, 2);
alter table cierres_caja add column if not exists observaciones text;
```

### `supabase/migrations/0011_numeracion_borrador.sql`

```sql
-- Facturas emitidas en modo borrador (sin CAI real) llevan el prefijo
-- "BORRADOR-". Antes usaban el mismo formato que las fiscales
-- (002-001-01-00000001), y al activar el CAI real con el rango del SAR
-- empezando en 1, la primera factura real chocaba con el índice único de
-- numero_factura contra la de prueba. Además así nadie confunde un
-- comprobante interno con una factura fiscal.

create or replace function public.finalizar_venta(p_venta_id uuid, p_efectivo numeric, p_cambio numeric)
returns ventas
language plpgsql
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_venta ventas%rowtype;
  v_pe puntos_emision%rowtype;
  v_correlativo bigint;
  v_numero text;
begin
  select * into v_venta from ventas where id = p_venta_id for update;
  if v_venta is null then
    raise exception 'Venta no encontrada';
  end if;
  if v_venta.estado not in ('abierta', 'borrador') then
    raise exception 'La venta ya fue procesada (estado actual: %)', v_venta.estado;
  end if;
  if v_venta.punto_emision_id is null then
    raise exception 'La venta no tiene punto de emisión asignado';
  end if;

  select * into v_pe from puntos_emision where id = v_venta.punto_emision_id for update;
  if v_pe is null or not v_pe.activo then
    raise exception 'Punto de emisión no encontrado o inactivo';
  end if;
  if v_pe.fecha_limite_emision is not null and v_pe.fecha_limite_emision < current_date then
    raise exception 'El rango autorizado de facturación venció el %', v_pe.fecha_limite_emision;
  end if;
  if v_pe.correlativo_actual > v_pe.correlativo_hasta then
    raise exception 'El rango de correlativos autorizado está agotado';
  end if;

  v_correlativo := v_pe.correlativo_actual;
  v_numero := v_pe.punto_emision_codigo || '-' || v_pe.punto_venta_codigo || '-'
              || v_pe.tipo_documento_codigo || '-' || lpad(v_correlativo::text, 8, '0');
  if v_pe.es_borrador then
    v_numero := 'BORRADOR-' || v_numero;
  end if;

  update puntos_emision set correlativo_actual = correlativo_actual + 1 where id = v_pe.id;

  update ventas set
    estado = 'pagada',
    numero_factura = v_numero,
    correlativo = v_correlativo,
    fecha_emision = now(),
    efectivo_recibido = p_efectivo,
    cambio = p_cambio
  where id = p_venta_id
  returning * into v_venta;

  return v_venta;
end;
$function$;

revoke execute on function public.finalizar_venta(uuid, numeric, numeric) from public, anon, authenticated;
grant execute on function public.finalizar_venta(uuid, numeric, numeric) to service_role;

-- Renombrar las facturas de prueba ya emitidas en modo borrador (y los
-- rangos de los cierres que las citan).
update cierres_caja c set
  factura_desde = case when c.factura_desde is not null and c.factura_desde not like 'BORRADOR-%'
                       and exists (select 1 from ventas v join puntos_emision pe on pe.id = v.punto_emision_id
                                   where v.numero_factura = c.factura_desde and pe.es_borrador)
                  then 'BORRADOR-' || c.factura_desde else c.factura_desde end,
  factura_hasta = case when c.factura_hasta is not null and c.factura_hasta not like 'BORRADOR-%'
                       and exists (select 1 from ventas v join puntos_emision pe on pe.id = v.punto_emision_id
                                   where v.numero_factura = c.factura_hasta and pe.es_borrador)
                  then 'BORRADOR-' || c.factura_hasta else c.factura_hasta end;

update ventas v set numero_factura = 'BORRADOR-' || v.numero_factura
from puntos_emision pe
where pe.id = v.punto_emision_id
  and pe.es_borrador
  and v.numero_factura is not null
  and v.numero_factura not like 'BORRADOR-%';
```

### `supabase/migrations/0012_descuento_por_linea.sql`

```sql
-- Descuento por producto: cada línea guarda su propio porcentaje (0, 10 o
-- 25 tercera edad). ventas.descuento_porcentaje queda como resumen (el
-- mayor porcentaje aplicado en la orden) para filtros y compatibilidad.
alter table detalle_venta add column if not exists descuento_porcentaje smallint not null default 0;
alter table detalle_venta drop constraint if exists detalle_venta_descuento_porcentaje_check;
alter table detalle_venta add constraint detalle_venta_descuento_porcentaje_check check (descuento_porcentaje in (0, 10, 25));

-- Órdenes ya emitidas con descuento general: se marca cada línea con ese
-- porcentaje (el monto ya estaba repartido proporcionalmente en "descuento").
update detalle_venta d set descuento_porcentaje = v.descuento_porcentaje
from ventas v
where v.id = d.venta_id and coalesce(v.descuento_porcentaje, 0) in (10, 25) and d.descuento > 0 and d.descuento_porcentaje = 0;
```

### `supabase/migrations/0013_alertas_antifraude.sql`

```sql
-- Alertas para el dueño: descuadres de caja, anulaciones, órdenes
-- descartadas, intentos de entrar a lo que no le corresponde, etc. Se
-- generan en el backend y se revisan en la pantalla Antifraude.
create table if not exists alertas (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  tipo text not null,
  severidad text not null default 'media' check (severidad in ('baja', 'media', 'alta')),
  titulo text not null,
  detalle jsonb not null default '{}'::jsonb,
  sucursal_id uuid references sucursales(id),
  usuario_id uuid references perfiles(id),
  usuario_nombre text,
  entidad text,
  entidad_id text,
  revisada boolean not null default false,
  revisada_por uuid references perfiles(id),
  revisada_at timestamptz,
  nota_revision text
);
create index if not exists alertas_pendientes_idx on alertas (revisada, created_at desc);
create index if not exists alertas_fecha_idx on alertas (created_at desc);
alter table alertas enable row level security;
-- Sin políticas: sólo el backend (service_role) lee y escribe.

-- La bitácora ahora registra también navegación y eventos de caja: índices
-- para las consultas del panel antifraude.
create index if not exists auditoria_accion_fecha_idx on auditoria (accion, created_at desc);
create index if not exists auditoria_usuario_fecha_idx on auditoria (usuario_id, created_at desc);
```

### `supabase/migrations/0014_antifraude_avanzado.sql`

```sql
-- Antifraude avanzado.

-- Tercera edad: quién recibió el 25% (nombre + No. de identidad/carné).
alter table ventas add column if not exists tercera_edad_nombre text;
alter table ventas add column if not exists tercera_edad_identidad text;
create index if not exists ventas_tercera_edad_idx on ventas (tercera_edad_identidad, fecha_emision) where tercera_edad_identidad is not null;

-- Conteo de impresiones del ticket: la reimpresión sale marcada como COPIA.
alter table ventas add column if not exists impresiones integer not null default 0;
alter table ventas add column if not exists reimpresiones integer not null default 0;

-- Estados de seguimiento de las alertas.
alter table alertas add column if not exists estado text not null default 'pendiente';
alter table alertas drop constraint if exists alertas_estado_check;
alter table alertas add constraint alertas_estado_check check (estado in ('pendiente', 'investigando', 'resuelta', 'falso_positivo'));
update alertas set estado = 'resuelta' where revisada and estado = 'pendiente';
create index if not exists alertas_estado_idx on alertas (estado, created_at desc);

-- Reglas y umbrales configurables (una sola fila).
create table if not exists config_antifraude (
  id smallint primary key default 1 check (id = 1),
  reglas jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references perfiles(id)
);
insert into config_antifraude (id) values (1) on conflict (id) do nothing;
alter table config_antifraude enable row level security;

-- Arqueos sorpresa (conteo a mitad de turno).
create table if not exists arqueos (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  sucursal_id uuid not null references sucursales(id),
  usuario_id uuid references perfiles(id),
  desde timestamptz not null,
  fondo_caja numeric(12,2) not null default 0,
  efectivo_sistema numeric(12,2) not null default 0,
  salidas numeric(12,2) not null default 0,
  esperado numeric(12,2) not null,
  contado numeric(12,2) not null,
  diferencia numeric(12,2) not null,
  cajeros_turno text,
  nota text
);
create index if not exists arqueos_fecha_idx on arqueos (created_at desc);
alter table arqueos enable row level security;

-- Dispositivos (navegador/computadora) desde los que entra cada usuario.
create table if not exists dispositivos_usuario (
  usuario_id uuid not null references perfiles(id),
  dispositivo_id text not null,
  primera_vez timestamptz not null default now(),
  ultima_vez timestamptz not null default now(),
  navegador text,
  ip text,
  primary key (usuario_id, dispositivo_id)
);
alter table dispositivos_usuario enable row level security;
```

### `supabase/migrations/0015_calendario_eventos.sql`

```sql
-- Calendario de eventos: una cotización aceptada se convierte en un evento
-- agendado con hora, sucursal que lo atiende, anticipo y una lista de
-- control (checklist) para darle seguimiento hasta que se realiza y se cobra.

alter table cotizaciones_eventos add column if not exists hora_evento time;
alter table cotizaciones_eventos add column if not exists sucursal_id uuid references sucursales(id);
alter table cotizaciones_eventos add column if not exists anticipo numeric(12, 2) not null default 0 check (anticipo >= 0);
alter table cotizaciones_eventos add column if not exists checklist jsonb not null default '{}'::jsonb;
alter table cotizaciones_eventos add column if not exists notas_seguimiento text;
alter table cotizaciones_eventos add column if not exists aceptada_at timestamptz;
alter table cotizaciones_eventos add column if not exists realizado boolean not null default false;

-- Las ya aceptadas/facturadas quedan con su fecha de aceptación aproximada.
update cotizaciones_eventos
set aceptada_at = created_at
where aceptada_at is null and estado in ('aceptada', 'facturada');

create index if not exists cotizaciones_eventos_fecha_idx on cotizaciones_eventos (fecha_evento);
```

## Backend: servidor, conexión y middleware

### `backend/server.js`

```js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './db.js';
import { requireAuth } from './middleware/auth.js';
import { categorias } from './routes/categorias.js';
import { productos } from './routes/productos.js';
import { clientes } from './routes/clientes.js';
import { puntosEmision } from './routes/puntosEmision.js';
import { ventas } from './routes/ventas.js';
import { notasCredito } from './routes/notasCredito.js';
import { cierres } from './routes/cierres.js';
import { reportes } from './routes/reportes.js';
import { cajaChica } from './routes/cajaChica.js';
import { usuarios } from './routes/usuarios.js';
import { facturaImpresion } from './routes/facturaImpresion.js';
import { sucursales } from './routes/sucursales.js';
import { dashboard } from './routes/dashboard.js';
import { cotizaciones } from './routes/cotizaciones.js';
import { auditoria } from './routes/auditoria.js';
import { antifraude } from './routes/antifraude.js';
import { requireRole } from './middleware/requireRole.js';
import { iniciarVigilancia, registrarLoginFallido } from './lib/antifraude.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Diagnóstico sin login: confirma si SUPABASE_SERVICE_ROLE_KEY quedó bien
// configurada en el entorno de despliegue, sin tener que entrar a la app.
app.get('/api/health/db', async (req, res) => {
  const { error } = await db.from('sucursales').select('id').limit(1);
  if (error) return res.status(500).json({ ok: false, error: error.message });
  res.json({ ok: true });
});

// Intentos fallidos de inicio de sesión (el login lo hace Supabase desde
// el navegador; la pantalla avisa aquí cuando falla). Sin token, con tope
// por IP para que no se pueda abusar.
const fallidosPorIp = new Map();
app.post('/api/sesion/login-fallido', async (req, res) => {
  const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '').split(',')[0].trim();
  const minuto = Math.floor(Date.now() / 60000);
  const clave = `${ip}:${minuto}`;
  const n = (fallidosPorIp.get(clave) ?? 0) + 1;
  fallidosPorIp.set(clave, n);
  if (fallidosPorIp.size > 5000) fallidosPorIp.clear();
  if (n > 20) return res.status(429).end();
  await registrarLoginFallido(req, req.body?.acceso);
  res.status(204).end();
});

app.use('/api', requireAuth);

// Perfil propio: sucursal, rol y flags (cierre ciego, sin horario)
app.get('/api/perfil', (req, res) => res.json(req.perfil));

app.get('/api/formas-pago', async (req, res) => {
  const { data, error } = await db.from('formas_pago').select('*').order('nombre');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.use('/api/sucursales', sucursales);
app.use('/api/categorias', categorias);
app.use('/api/productos', productos);
app.use('/api/clientes', clientes);
app.use('/api/puntos-emision', puntosEmision);
app.use('/api/ventas', ventas);
app.use('/api/ventas', facturaImpresion); // /api/ventas/:id/ticket, /api/ventas/:id/pdf
app.use('/api/notas-credito', notasCredito);
app.use('/api/cierres', cierres);
// Reportes, dashboard y caja chica son de gerencia: antes cualquier cajero
// logueado podía pedir las ventas de todas las sucursales por la API.
app.use('/api/reportes', requireRole('admin', 'manager'), reportes);
app.use('/api/caja-chica', requireRole('admin', 'manager'), cajaChica);
app.use('/api/usuarios', usuarios);
app.use('/api/dashboard', requireRole('admin', 'manager'), dashboard);
app.use('/api/cotizaciones', requireRole('admin', 'manager'), cotizaciones);
app.use('/api/auditoria', auditoria);
app.use('/api/antifraude', antifraude);

// Sirve el build del frontend (mismo patrón que italo-reposicion: un solo
// servicio Render, backend + frontend estático).
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
// index.html y el service worker nunca se cachean en el navegador: así
// cada caja detecta la versión nueva apenas se publica.
app.use(
  express.static(frontendDist, {
    setHeaders(res, ruta) {
      if (/(index\.html|sw\.js|registerSW\.js|manifest\.webmanifest)$/.test(ruta)) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  })
);
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.use('/api', (req, res) => res.status(404).json({ error: 'No encontrado' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno' });
});

const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log(`italo-facturacion backend escuchando en :${port}`);
  iniciarVigilancia();
});
```

### `backend/db.js`

```js
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error('Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en el entorno');
}

// Cliente admin: usa la service_role key y por lo tanto bypassa RLS.
// Toda escritura de negocio (ventas, cierres, notas de crédito) pasa por el
// backend, nunca directo desde el frontend — así se controla el correlativo
// del CAI de forma atómica.
export const db = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
```

### `backend/middleware/auth.js`

```js
import { db } from '../db.js';
import { vigilarDispositivo } from '../lib/antifraude.js';

// Verifica el JWT de Supabase Auth (enviado por el frontend en Authorization:
// Bearer <token>) y adjunta el perfil (sucursal, rol, flags) a req.perfil.
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Falta el token de autenticación' });

  const { data: userData, error: userError } = await db.auth.getUser(token);
  if (userError || !userData?.user) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  const { data: perfil, error: perfilError } = await db
    .from('perfiles')
    .select('*')
    .eq('id', userData.user.id)
    .single();

  if (perfilError || !perfil) {
    return res.status(403).json({ error: 'Usuario sin perfil asignado' });
  }
  if (!perfil.activo) {
    return res.status(403).json({ error: 'Usuario inactivo' });
  }

  req.perfil = perfil;
  // Dispositivo nuevo / uso simultáneo: nunca frena la petición.
  vigilarDispositivo(req).catch(() => {});
  next();
}
```

### `backend/middleware/requireRole.js`

```js
import { registrarAuditoria } from '../lib/auditoria.js';
import { alertaAccesoDenegado } from '../lib/antifraude.js';

// Uso: requireRole('admin', 'manager')
//
// Cada intento de entrar a algo que no le corresponde queda en la bitácora
// (acceso.denegado) y genera una alerta: es exactamente el rastro que deja
// alguien "curioseando" el sistema para buscar huecos.
export function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.perfil) return res.status(401).json({ error: 'No autenticado' });
    if (!rolesPermitidos.includes(req.perfil.rol)) {
      const detalle = { metodo: req.method, ruta: req.originalUrl.split('?')[0], rol: req.perfil.rol, requiere: rolesPermitidos };
      registrarAuditoria(req, { accion: 'acceso.denegado', entidad: 'sistema', sucursalId: req.perfil.sucursal_id ?? null, detalle });
      alertaAccesoDenegado(req, detalle);
      return res.status(403).json({ error: 'No tiene permiso para esta acción' });
    }
    next();
  };
}
```

## Backend: librerías de negocio

### `backend/lib/acceso.js`

```js
import { createHash } from 'node:crypto';

// Supabase Auth siempre pide un correo y una contraseña de 6+ caracteres.
// Los cajeros entran con un nombre de usuario libre (con espacios, tildes,
// lo que sea) y contraseñas de cualquier largo, así que se traducen a lo
// que Supabase acepta. La pantalla de login (frontend/src/lib/acceso.js)
// hace EXACTAMENTE la misma traducción — si se cambia aquí, cambiar allá.
//
//   "cajero1"       → cajero1@italo.local        (nombres simples, como antes)
//   "María López"   → u-<hash>@italo.local        (cualquier otro nombre)
//   "ana@gmail.com" → ana@gmail.com               (correo real, tal cual)
//
// El nombre tal como se escribió se guarda en user_metadata.usuario para
// mostrarlo en la lista de usuarios (el hash no se puede revertir).
export const DOMINIO_USUARIOS = 'italo.local';
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USUARIO_SIMPLE = /^[a-z0-9_-]+(\.[a-z0-9_-]+)*$/;
const SUFIJO_CLAVE = '~italo~';

export function normalizarUsuario(acceso) {
  // Sin tildes ni mayúsculas: "María López" y "maria lopez" son el mismo usuario.
  return String(acceso ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export function accesoAEmail(acceso) {
  const texto = normalizarUsuario(acceso);
  if (!texto) throw new Error('Escribe un usuario o correo');
  if (CORREO_VALIDO.test(texto)) return texto;
  if (USUARIO_SIMPLE.test(texto) && texto.length <= 60) return `${texto}@${DOMINIO_USUARIOS}`;
  const hash = createHash('sha256').update(texto, 'utf8').digest('hex').slice(0, 32);
  return `u-${hash}@${DOMINIO_USUARIOS}`;
}

// Contraseñas cortas se completan con un sufijo fijo sólo para cumplir el
// mínimo de Supabase; el usuario nunca lo ve ni lo escribe.
export function claveInterna(password) {
  const p = String(password ?? '');
  return p.length >= 6 ? p : p + SUFIJO_CLAVE;
}

export function accesoVisible(usuario) {
  if (!usuario?.email) return null;
  if (usuario.user_metadata?.usuario) return usuario.user_metadata.usuario;
  const email = usuario.email;
  return email.endsWith(`@${DOMINIO_USUARIOS}`) ? email.slice(0, -(DOMINIO_USUARIOS.length + 1)) : email;
}
```

### `backend/lib/alertas.js`

```js
import { db } from '../db.js';
import { enviarAlertaAdmins } from './correo.js';

// Crea una alerta para el dueño (pantalla Antifraude) y, si es seria, la
// manda por correo a todos los administradores. Nunca hace fallar la
// operación que la origina.
export async function crearAlerta(req, { tipo, severidad = 'media', titulo, detalle = {}, sucursalId = null, entidad = null, entidadId = null, correo = false }) {
  try {
    const { data, error } = await db
      .from('alertas')
      .insert({
        tipo,
        severidad,
        titulo,
        detalle,
        sucursal_id: sucursalId,
        usuario_id: req?.perfil?.id ?? null,
        usuario_nombre: req?.perfil?.nombre ?? null,
        entidad,
        entidad_id: entidadId != null ? String(entidadId) : null,
      })
      .select('*, sucursales(nombre)')
      .single();
    if (error) throw new Error(error.message);
    if (correo) enviarAlertaAdmins(data).catch((e) => console.error('[alertas] correo', e.message));
    return data;
  } catch (e) {
    console.error('[alertas] no se pudo crear', tipo, e.message);
    return null;
  }
}
```

### `backend/lib/antifraude.js`

```js
import { crearAlerta } from './alertas.js';
import { db } from '../db.js';
import { fechaHn, horaHn, inicioDelDia, finDelDia, hoyHn } from './fechas.js';
import { obtenerReglas } from './reglas.js';
import { registrarAuditoria } from './auditoria.js';

// Una alerta por usuario y tipo cada 30 min como máximo: si alguien prueba
// 20 pantallas seguidas no se llena la bandeja (la bitácora sí guarda todo).
const ultimaAlerta = new Map();
function throttled(clave, minutos = 30) {
  const ahora = Date.now();
  const previa = ultimaAlerta.get(clave) ?? 0;
  if (ahora - previa < minutos * 60 * 1000) return true;
  ultimaAlerta.set(clave, ahora);
  return false;
}

export function alertaAccesoDenegado(req, detalle) {
  if (throttled(`denegado:${req.perfil?.id}`)) return;
  crearAlerta(req, {
    tipo: 'acceso.denegado',
    severidad: 'media',
    titulo: `${req.perfil?.nombre ?? 'Un usuario'} intentó entrar a una función sin permiso`,
    sucursalId: req.perfil?.sucursal_id ?? null,
    detalle: { ruta: detalle.ruta, metodo: detalle.metodo, rol: detalle.rol },
  });
}

// Horario en que normalmente hay operación (las sucursales abren 11 a. m.
// y la última cierra 11 p. m.; se deja margen para apertura y cierre).
export const HORA_APERTURA = 9;
export const HORA_CIERRE = 24;

export function fueraDeHorario(iso = new Date().toISOString()) {
  const h = horaHn(iso);
  return h < HORA_APERTURA || h >= HORA_CIERRE;
}

export async function alertaFueraDeHorario(req, accion) {
  if (req.perfil?.sin_horario || req.perfil?.rol === 'admin') return;
  const reglas = await obtenerReglas();
  const h = horaHn(new Date().toISOString());
  if (h >= reglas.hora_apertura && h < reglas.hora_cierre) return;
  if (throttled(`horario:${req.perfil?.id}`, 120)) return;
  crearAlerta(req, {
    tipo: 'horario.fuera',
    severidad: 'media',
    titulo: `${req.perfil?.nombre ?? 'Un usuario'} usó el sistema fuera de horario`,
    sucursalId: req.perfil?.sucursal_id ?? null,
    detalle: { accion, hora: new Date().toLocaleTimeString('es-HN', { timeZone: 'America/Tegucigalpa' }) },
  });
}

export { throttled };

// ── Dispositivos: cada navegador tiene un identificador propio ─────────
// (lo genera la app y lo manda en X-Dispositivo). Primer uso de un
// dispositivo nuevo y uso simultáneo desde dos dispositivos → alerta.
const dispositivosConocidos = new Set();
const ultimoDispositivo = new Map();

export async function vigilarDispositivo(req) {
  const perfil = req.perfil;
  const dispositivo = String(req.headers['x-dispositivo'] ?? '').slice(0, 64);
  if (!perfil || !dispositivo) return;
  const clave = `${perfil.id}|${dispositivo}`;

  // Uso simultáneo: otro dispositivo activo hace menos de 3 minutos.
  const previo = ultimoDispositivo.get(perfil.id);
  const ahora = Date.now();
  if (previo && previo.dispositivo !== dispositivo && ahora - previo.ts < 3 * 60 * 1000 && !throttled(`simultaneo:${perfil.id}`, 60)) {
    crearAlerta(req, {
      tipo: 'sesion.simultanea',
      severidad: 'alta',
      titulo: `${perfil.nombre} está usando el sistema en dos dispositivos a la vez`,
      sucursalId: perfil.sucursal_id ?? null,
      detalle: { dispositivo_actual: dispositivo.slice(0, 8), otro_dispositivo: previo.dispositivo.slice(0, 8), nota: '¿Alguien más conoce su contraseña?' },
    });
  }
  ultimoDispositivo.set(perfil.id, { dispositivo, ts: ahora });

  if (dispositivosConocidos.has(clave)) return;
  dispositivosConocidos.add(clave);
  const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '').split(',')[0].trim();
  const navegador = String(req.headers['user-agent'] ?? '').slice(0, 200);
  const { data: existente } = await db
    .from('dispositivos_usuario')
    .select('dispositivo_id')
    .eq('usuario_id', perfil.id)
    .eq('dispositivo_id', dispositivo)
    .maybeSingle();
  if (existente) {
    await db.from('dispositivos_usuario').update({ ultima_vez: new Date().toISOString(), ip }).eq('usuario_id', perfil.id).eq('dispositivo_id', dispositivo);
    return;
  }
  const { count } = await db.from('dispositivos_usuario').select('dispositivo_id', { count: 'exact', head: true }).eq('usuario_id', perfil.id);
  await db.from('dispositivos_usuario').insert({ usuario_id: perfil.id, dispositivo_id: dispositivo, navegador, ip });
  registrarAuditoria(req, { accion: 'sesion.dispositivo_nuevo', entidad: 'sesion', sucursalId: perfil.sucursal_id ?? null, detalle: { dispositivo: dispositivo.slice(0, 8), navegador: navegador.slice(0, 120) } });
  if ((count ?? 0) > 0) {
    crearAlerta(req, {
      tipo: 'sesion.dispositivo_nuevo',
      severidad: perfil.rol === 'admin' ? 'alta' : 'media',
      titulo: `${perfil.nombre} entró desde un dispositivo nuevo`,
      sucursalId: perfil.sucursal_id ?? null,
      correo: perfil.rol === 'admin',
      detalle: { dispositivo: dispositivo.slice(0, 8), navegador: navegador.slice(0, 120), ip, dispositivos_previos: count },
    });
  }
}

// ── Intentos fallidos de inicio de sesión ──────────────────────────────
const fallidos = new Map();

export async function registrarLoginFallido(req, acceso) {
  const reglas = await obtenerReglas();
  const clave = String(acceso ?? '').trim().toLowerCase().slice(0, 80) || '(vacío)';
  const ventana = 15 * 60 * 1000;
  const ahora = Date.now();
  const lista = (fallidos.get(clave) ?? []).filter((t) => ahora - t < ventana);
  lista.push(ahora);
  fallidos.set(clave, lista);
  if (fallidos.size > 2000) fallidos.clear();
  const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '').split(',')[0].trim();
  await registrarAuditoria(req, { accion: 'sesion.login_fallido', entidad: 'sesion', detalle: { acceso: clave, intentos_15min: lista.length, ip } });
  if (lista.length >= reglas.intentos_login && !throttled(`fallido:${clave}`, 30)) {
    await crearAlerta(req, {
      tipo: 'sesion.login_fallido',
      severidad: 'alta',
      titulo: `${lista.length} intentos fallidos de entrar como "${clave}" en 15 minutos`,
      correo: true,
      detalle: { usuario_intentado: clave, intentos: lista.length, ip },
    });
  }
}

// ── Revisión periódica (cada 10 min mientras el servidor está activo) ──
// Órdenes estacionadas: una orden abierta mucho tiempo puede estarse
// usando como "cuenta" para cobrar en efectivo y luego descartarla.
async function revisarOrdenesEstacionadas() {
  const reglas = await obtenerReglas();
  const limite = new Date(Date.now() - reglas.minutos_orden_estacionada * 60 * 1000).toISOString();
  const { data: ordenes } = await db
    .from('ventas')
    .select('id, numero_orden, total, created_at, sucursal_id, perfiles(nombre)')
    .eq('estado', 'abierta')
    .lt('created_at', limite)
    .gt('total', 0)
    .limit(50);
  for (const o of ordenes ?? []) {
    const { count } = await db.from('alertas').select('id', { count: 'exact', head: true }).eq('tipo', 'orden.estacionada').eq('entidad_id', o.id);
    if (count) continue;
    const minutos = Math.round((Date.now() - new Date(o.created_at).getTime()) / 60000);
    await crearAlerta(null, {
      tipo: 'orden.estacionada',
      severidad: 'media',
      titulo: `Orden #${o.numero_orden} abierta hace ${minutos} min sin cobrar (L ${Number(o.total).toFixed(2)})`,
      sucursalId: o.sucursal_id,
      entidad: 'venta',
      entidadId: o.id,
      detalle: { orden: o.numero_orden, total: Number(o.total), cajero: o.perfiles?.nombre ?? '', minutos_abierta: minutos },
    });
  }
}

// La bitácora es inalterable por diseño; si alguien con acceso directo a la
// base la manipulara, la cadena de hashes se rompe y esto lo detecta.
let ultimaVerificacion = 0;
async function verificarIntegridadBitacora() {
  if (Date.now() - ultimaVerificacion < 6 * 60 * 60 * 1000) return;
  ultimaVerificacion = Date.now();
  const { data } = await db.rpc('verificar_auditoria');
  const r = Array.isArray(data) ? data[0] : data;
  if (r && r.integra === false) {
    await crearAlerta(null, {
      tipo: 'bitacora.alterada',
      severidad: 'alta',
      titulo: 'La bitácora de auditoría fue alterada directamente en la base de datos',
      correo: true,
      detalle: { primer_registro_alterado: r.primer_id_alterado, total_registros: Number(r.total) },
    });
  }
}

export function iniciarVigilancia() {
  const ciclo = () => {
    revisarOrdenesEstacionadas().catch((e) => console.error('[vigilancia] ordenes', e.message));
    verificarIntegridadBitacora().catch((e) => console.error('[vigilancia] bitacora', e.message));
  };
  setTimeout(ciclo, 30 * 1000);
  setInterval(ciclo, 10 * 60 * 1000);
}

// ── Doble factura: mismos productos y total en la misma sucursal, en
// pocos minutos. Clásico: se cobra dos veces, o se entrega a un cliente
// la factura de otro.
export async function revisarDobleFactura(req, venta) {
  const reglas = await obtenerReglas();
  const desde = new Date(Date.now() - reglas.minutos_doble_factura * 60 * 1000).toISOString();
  const { data: parecidas } = await db
    .from('ventas')
    .select('id, numero_factura, fecha_emision, detalle_venta(producto_id, cantidad)')
    .eq('sucursal_id', venta.sucursal_id)
    .eq('estado', 'pagada')
    .eq('total', venta.total)
    .neq('id', venta.id)
    .gte('fecha_emision', desde);
  if (!parecidas?.length) return;
  const firma = (lineas) => (lineas ?? []).map((d) => `${d.producto_id}:${Number(d.cantidad)}`).sort().join('|');
  const { data: propia } = await db.from('detalle_venta').select('producto_id, cantidad').eq('venta_id', venta.id);
  const miFirma = firma(propia);
  const gemela = parecidas.find((p) => firma(p.detalle_venta) === miFirma);
  if (!gemela) return;
  await crearAlerta(req, {
    tipo: 'venta.doble_factura',
    severidad: 'media',
    titulo: `Posible doble factura: ${venta.numero_factura} y ${gemela.numero_factura} son idénticas`,
    sucursalId: venta.sucursal_id,
    entidad: 'venta',
    entidadId: venta.id,
    detalle: { factura: venta.numero_factura, gemela: gemela.numero_factura, total: Number(venta.total), cajero: req.perfil?.nombre ?? '' },
  });
}

// ── Tercera edad: carné reutilizado y exceso de descuentos por cajero ──
export async function revisarTerceraEdad(req, venta) {
  const reglas = await obtenerReglas();
  const hoy = hoyHn();
  if (venta.tercera_edad_identidad) {
    const { count } = await db
      .from('ventas')
      .select('id', { count: 'exact', head: true })
      .eq('estado', 'pagada')
      .eq('tercera_edad_identidad', venta.tercera_edad_identidad)
      .gte('fecha_emision', inicioDelDia(hoy))
      .lte('fecha_emision', finDelDia(hoy));
    if ((count ?? 0) > reglas.max_usos_carne_dia && !throttled(`carne:${venta.tercera_edad_identidad}:${hoy}`, 24 * 60)) {
      await crearAlerta(req, {
        tipo: 'tercera_edad.carne_repetido',
        severidad: 'alta',
        titulo: `El carné ${venta.tercera_edad_identidad} se usó ${count} veces hoy para el descuento de tercera edad`,
        sucursalId: venta.sucursal_id,
        entidad: 'venta',
        entidadId: venta.id,
        detalle: { identidad: venta.tercera_edad_identidad, nombre: venta.tercera_edad_nombre ?? '', usos_hoy: count, cajero: req.perfil?.nombre ?? '' },
      });
    }
  }
  const { count: delCajero } = await db
    .from('ventas')
    .select('id', { count: 'exact', head: true })
    .eq('estado', 'pagada')
    .eq('cajero_id', req.perfil.id)
    .not('tercera_edad_identidad', 'is', null)
    .gte('fecha_emision', inicioDelDia(hoy))
    .lte('fecha_emision', finDelDia(hoy));
  if ((delCajero ?? 0) > reglas.max_tercera_edad_dia && !throttled(`te-cajero:${req.perfil.id}:${hoy}`, 24 * 60)) {
    await crearAlerta(req, {
      tipo: 'tercera_edad.exceso',
      severidad: 'media',
      titulo: `${req.perfil.nombre} lleva ${delCajero} facturas con descuento de tercera edad hoy`,
      sucursalId: venta.sucursal_id,
      detalle: { facturas_hoy: delCajero, limite: reglas.max_tercera_edad_dia },
    });
  }
}

export function normalizarIdentidad(valor) {
  return String(valor ?? '').replace(/[^0-9A-Za-z]/g, '').toUpperCase().slice(0, 20);
}

export { fechaHn };
```

### `backend/lib/auditoria.js`

```js
import { db } from '../db.js';

function ipDe(req) {
  const reenviada = req.headers['x-forwarded-for'];
  if (reenviada) return String(reenviada).split(',')[0].trim();
  return req.socket?.remoteAddress ?? null;
}

// Registra un evento en la bitácora inalterable (tabla auditoria: sin
// UPDATE/DELETE y con cadena de hashes — ver migración 0007). La fecha y el
// hash los pone la base de datos, no este código.
//
// Nunca hace fallar la operación de negocio: si la bitácora no pudiera
// escribirse, se deja constancia en el log del servidor y la venta sigue.
export async function registrarAuditoria(req, { accion, entidad, entidadId = null, sucursalId = null, detalle = {} }) {
  try {
    const { error } = await db.from('auditoria').insert({
      usuario_id: req.perfil?.id ?? null,
      usuario_nombre: req.perfil?.nombre ?? null,
      accion,
      entidad,
      entidad_id: entidadId != null ? String(entidadId) : null,
      sucursal_id: sucursalId,
      detalle,
      ip: ipDe(req),
    });
    if (error) console.error('[auditoria] no se pudo registrar', accion, error.message);
  } catch (e) {
    console.error('[auditoria] no se pudo registrar', accion, e.message);
  }
}
```

### `backend/lib/cierre.js`

```js
import { round2 } from './facturacion.js';

// Totales del turno según el sistema, por forma de pago.
//
// El efectivo es NETO del cambio: si el cliente paga L500 por una venta de
// L206.25, en venta_pagos queda "Efectivo L500" pero en la gaveta sólo se
// quedaron L206.25 (los L293.75 salieron como cambio). Sumar el pago bruto
// inflaba el efectivo esperado del cierre.
//
// Las facturas anuladas conservan su número (cuentan en el rango) pero no
// suman dinero.
export function totalesPorForma(ventas) {
  const t = { efectivo: 0, tarjeta: 0, transferencia: 0, otros: 0, total_ventas: 0, anuladas: 0, monto_anulado: 0 };
  for (const v of ventas) {
    if (v.anulada) {
      t.anuladas += 1;
      t.monto_anulado += Number(v.total);
      continue;
    }
    t.total_ventas += Number(v.total);
    let efectivoVenta = 0;
    for (const p of v.venta_pagos ?? []) {
      const nombre = (p.formas_pago?.nombre ?? '').toLowerCase();
      const monto = Number(p.monto);
      if (nombre === 'efectivo') efectivoVenta += monto;
      else if (nombre === 'tarjeta') t.tarjeta += monto;
      else if (nombre === 'transferencia') t.transferencia += monto;
      else t.otros += monto;
    }
    // El cambio siempre sale de la gaveta, aunque el sobrepago haya sido con tarjeta.
    t.efectivo += efectivoVenta - Number(v.cambio ?? 0);
  }
  for (const k of Object.keys(t)) if (k !== 'anuladas') t[k] = round2(t[k]);
  return t;
}

// Cuadre: lo que reportan los POS y el efectivo contado contra el sistema.
//   Tarjeta:  (POS BAC + POS Ficohsa) − tarjeta según sistema
//   Efectivo: contado en gaveta − (fondo + ventas en efectivo − salidas)
// Diferencia positiva = sobrante; negativa = faltante.
export function calcularCuadre(sistema, entradas) {
  const n = (v) => round2(Number(v || 0));
  const posBac = n(entradas.pos_bac);
  const posFicohsa = n(entradas.pos_ficohsa);
  const fondo = n(entradas.fondo_caja);
  const salidas = n(entradas.salidas);
  const contado = n(entradas.efectivo_contado);

  const tarjetaReportada = round2(posBac + posFicohsa);
  const diferenciaTarjeta = round2(tarjetaReportada - sistema.tarjeta);
  const efectivoEsperado = round2(fondo + sistema.efectivo - salidas);
  const diferenciaEfectivo = round2(contado - efectivoEsperado);

  return {
    pos_bac: posBac,
    pos_ficohsa: posFicohsa,
    tarjeta_reportada: tarjetaReportada,
    diferencia_tarjeta: diferenciaTarjeta,
    fondo_caja: fondo,
    salidas,
    efectivo_contado: contado,
    efectivo_esperado: efectivoEsperado,
    diferencia_efectivo: diferenciaEfectivo,
    diferencia_total: round2(diferenciaTarjeta + diferenciaEfectivo),
  };
}

// Desglose del turno para el ticket del cierre: cuántas facturas y cuánto
// por forma de pago, las de tarjeta/transferencia una por una (para
// cotejarlas con los vouchers del POS y la banca), anuladas y descuentos.
export function desgloseTurno(ventas) {
  const formas = {};
  const tarjeta = [];
  const transferencia = [];
  const anuladas = [];
  const descuentos = {};
  for (const v of ventas) {
    if (v.anulada) {
      anuladas.push({ numero: v.numero_factura, total: Number(v.total) });
      continue;
    }
    const porForma = {};
    for (const p of v.venta_pagos ?? []) {
      const nombre = p.formas_pago?.nombre ?? 'Otro';
      porForma[nombre] = (porForma[nombre] ?? 0) + Number(p.monto);
    }
    if (porForma.Efectivo !== undefined) porForma.Efectivo -= Number(v.cambio ?? 0);
    for (const [nombre, monto] of Object.entries(porForma)) {
      formas[nombre] = formas[nombre] ?? { facturas: 0, monto: 0 };
      formas[nombre].facturas += 1;
      formas[nombre].monto = round2(formas[nombre].monto + monto);
      if (nombre === 'Tarjeta') tarjeta.push({ numero: v.numero_factura, monto: round2(monto) });
      if (nombre === 'Transferencia') transferencia.push({ numero: v.numero_factura, monto: round2(monto) });
    }
    for (const d of v.detalle_venta ?? []) {
      if (Number(d.descuento) <= 0) continue;
      const pct = Number(d.descuento_porcentaje ?? 0);
      descuentos[pct] = descuentos[pct] ?? { lineas: 0, monto: 0 };
      descuentos[pct].lineas += 1;
      descuentos[pct].monto = round2(descuentos[pct].monto + Number(d.descuento));
    }
  }
  return { formas, tarjeta, transferencia, anuladas, descuentos };
}
```

### `backend/lib/consultas.js`

```js
// Supabase (PostgREST) devuelve como máximo 1000 filas por consulta. Un mes
// de 5 sucursales pasa de sobra ese número, y los reportes quedaban
// cortados en silencio. traerTodo() pide por páginas hasta agotar.
//
// crearQuery debe devolver una consulta NUEVA en cada llamada (el builder de
// Supabase no se puede reusar) y con un orden estable.
export async function traerTodo(crearQuery, tamanoPagina = 1000) {
  const filas = [];
  for (let desde = 0; ; desde += tamanoPagina) {
    const { data, error } = await crearQuery().range(desde, desde + tamanoPagina - 1);
    if (error) throw new Error(error.message);
    filas.push(...data);
    if (data.length < tamanoPagina) return filas;
  }
}

// .in('col', ids) con miles de ids arma una URL demasiado larga; se parte
// en lotes y se juntan los resultados.
export async function traerPorIds(crearQuery, columna, ids, tamanoLote = 150) {
  const unicos = [...new Set(ids)].filter(Boolean);
  const filas = [];
  for (let i = 0; i < unicos.length; i += tamanoLote) {
    const lote = unicos.slice(i, i + tamanoLote);
    filas.push(...(await traerTodo(() => crearQuery().in(columna, lote))));
  }
  return filas;
}

// Texto libre del usuario dentro de un filtro .or() de PostgREST: comas,
// paréntesis y comillas cambian la estructura del filtro, así que se quitan.
export function textoSeguroFiltro(texto) {
  return String(texto ?? '')
    .replace(/[,()"'\\*%:]/g, ' ')
    .trim()
    .slice(0, 60);
}
```

### `backend/lib/correo.js`

```js
import nodemailer from 'nodemailer';
import { db } from '../db.js';

// Replica el "Resumen de Impuestos" que WizPOS manda solo tras cada cierre.
// No-op si no están configuradas las credenciales — no bloquea el cierre
// aunque falle o no esté configurado el correo.
function transportadorDisponible() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function crearTransportador() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
}

// Correos de todos los administradores activos (los usuarios con nombre de
// usuario tienen un correo interno @italo.local que no recibe mensajes) más
// RESUMEN_CIERRE_EMAIL si está configurado.
export async function destinatariosAdmins() {
  const lista = new Set();
  if (process.env.RESUMEN_CIERRE_EMAIL) {
    for (const c of process.env.RESUMEN_CIERRE_EMAIL.split(',')) if (c.trim()) lista.add(c.trim().toLowerCase());
  }
  try {
    const { data: admins } = await db.from('perfiles').select('id').eq('rol', 'admin').eq('activo', true);
    const ids = new Set((admins ?? []).map((a) => a.id));
    const { data } = await db.auth.admin.listUsers({ perPage: 200 });
    for (const u of data?.users ?? []) {
      if (ids.has(u.id) && u.email && !u.email.endsWith('@italo.local')) lista.add(u.email.toLowerCase());
    }
  } catch (e) {
    console.error('[correo] destinatarios', e.message);
  }
  if (lista.size === 0 && process.env.GMAIL_USER) lista.add(process.env.GMAIL_USER);
  return [...lista];
}

const COLOR_SEVERIDAD = { alta: '#b3261e', media: '#9a6a00', baja: '#1f6096' };

export async function enviarAlertaAdmins(alerta) {
  if (!transportadorDisponible()) return { enviado: false, motivo: 'GMAIL_USER/GMAIL_APP_PASSWORD no configurados' };
  const destinatarios = await destinatariosAdmins();
  if (destinatarios.length === 0) return { enviado: false, motivo: 'Sin destinatarios' };
  const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const filas = Object.entries(alerta.detalle ?? {})
    .filter(([, v]) => v !== null && typeof v !== 'object')
    .map(([k, v]) => `<tr><td style="color:#6b6a5e;padding:3px 12px 3px 0">${esc(k.replace(/_/g, ' '))}</td><td style="padding:3px 0"><strong>${esc(v)}</strong></td></tr>`)
    .join('');
  const cuando = new Date(alerta.created_at).toLocaleString('es-HN', { timeZone: 'America/Tegucigalpa' });
  await crearTransportador().sendMail({
    from: process.env.GMAIL_USER,
    to: destinatarios.join(', '),
    subject: `⚠ ${alerta.titulo}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px">
        <div style="border-left:5px solid ${COLOR_SEVERIDAD[alerta.severidad] ?? '#9a6a00'};padding:10px 16px;background:#faf6ec">
          <div style="font-size:12px;color:#6b6a5e">ALERTA ${esc(alerta.severidad).toUpperCase()} · ${esc(alerta.sucursales?.nombre ?? '')} · ${cuando}</div>
          <h2 style="margin:6px 0">${esc(alerta.titulo)}</h2>
          <div style="color:#6b6a5e">Usuario: ${esc(alerta.usuario_nombre ?? '—')}</div>
        </div>
        <table style="margin-top:12px;font-size:14px">${filas}</table>
        <p style="font-size:12px;color:#6b6a5e;margin-top:16px">Revísala en Italo Facturación → Antifraude.</p>
      </div>`,
  });
  return { enviado: true };
}

export async function enviarResumenCierre(cierre, sucursalNombre) {
  if (!transportadorDisponible()) return { enviado: false, motivo: 'GMAIL_USER/GMAIL_APP_PASSWORD no configurados' };

  const destinatario = (await destinatariosAdmins()).join(', ');
  const asunto = `Cierre de caja — ${sucursalNombre} — ${new Date(cierre.fecha_fin).toLocaleDateString('es-HN')}`;
  const L = (n) => `L ${Number(n ?? 0).toFixed(2)}`;
  const dif = (n) => {
    const d = Number(n ?? 0);
    const color = Math.abs(d) < 0.005 ? '#1a7a42' : '#b3261e';
    const texto = Math.abs(d) < 0.005 ? 'Cuadra' : d < 0 ? 'Faltante' : 'Sobrante';
    return `<strong style="color:${color}">${texto} ${L(Math.abs(d))}</strong>`;
  };
  const zona = { timeZone: 'America/Tegucigalpa' };
  const cuerpo = `
    <h2>Cierre de caja — ${sucursalNombre}</h2>
    <p>Del ${new Date(cierre.fecha_inicio).toLocaleString('es-HN', zona)} al ${new Date(cierre.fecha_fin).toLocaleString('es-HN', zona)}
       · Cajero: ${cierre.cajero?.nombre ?? ''}</p>
    <p>Facturas ${cierre.factura_desde ?? '—'} a ${cierre.factura_hasta ?? '—'} (${cierre.cantidad_facturas ?? 0}) · Total ventas ${L(cierre.total_ventas)}</p>
    <table cellpadding="6" style="border-collapse:collapse;border:1px solid #ddd">
      <tr style="background:#f4f4f4"><th align="left">Forma</th><th align="right">Sistema</th><th align="right">Reportado</th><th align="right">Diferencia</th></tr>
      <tr><td>Tarjeta (POS BAC ${L(cierre.pos_bac)} + Ficohsa ${L(cierre.pos_ficohsa)})</td>
          <td align="right">${L(cierre.tarjeta_sistema)}</td>
          <td align="right">${L(Number(cierre.pos_bac ?? 0) + Number(cierre.pos_ficohsa ?? 0))}</td>
          <td align="right">${dif(cierre.diferencia_tarjeta)}</td></tr>
      <tr><td>Efectivo (fondo ${L(cierre.fondo_caja)}, salidas ${L(cierre.salidas)})</td>
          <td align="right">${L(cierre.total_esperado)}</td>
          <td align="right">${L(cierre.efectivo_contado)}</td>
          <td align="right">${dif(cierre.diferencia_efectivo)}</td></tr>
      <tr><td>Transferencias</td><td align="right">${L(cierre.transferencia_sistema)}</td><td></td><td></td></tr>
      <tr style="background:#f4f4f4"><td><strong>Total</strong></td><td></td><td></td><td align="right">${dif(cierre.diferencia)}</td></tr>
    </table>
    ${cierre.observaciones ? `<p><strong>Observaciones:</strong> ${String(cierre.observaciones).replace(/</g, '&lt;')}</p>` : ''}
  `;

  try {
    await crearTransportador().sendMail({
      from: process.env.GMAIL_USER,
      to: destinatario,
      subject: asunto,
      html: cuerpo,
    });
    return { enviado: true };
  } catch (e) {
    return { enviado: false, motivo: e.message };
  }
}

// Manda la cotización de evento en PDF al correo del cliente — a pedido
// (botón "Enviar por correo"), no automático como la factura.
export async function enviarCotizacionCliente(cotizacion, pdfBuffer, destinatario) {
  if (!transportadorDisponible()) return { enviado: false, motivo: 'GMAIL_USER/GMAIL_APP_PASSWORD no configurados' };
  if (!destinatario) return { enviado: false, motivo: 'El cliente no tiene correo registrado' };

  const asunto = `Tu cotización para ${cotizacion.nombre_evento} — Ítalo Gelateria`;
  const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const total = `L ${Number(cotizacion.total).toLocaleString('es-HN', { minimumFractionDigits: 2 })}`;
  const cuerpo = `
  <div style="background:#F4F1EA;padding:24px 0;font-family:Poppins,Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
      <tr><td style="background:#000;padding:22px 28px;border-bottom:4px solid #C5D288">
        <div style="color:#fff;font-size:26px;font-weight:800;letter-spacing:1px">ITALO</div>
        <div style="color:#C5D288;font-size:12px;font-weight:600;letter-spacing:4px">GELATERIA</div>
      </td></tr>
      <tr><td style="padding:26px 28px;color:#1C1C18">
        <p style="font-size:18px;font-weight:700;margin:0 0 8px">Hola, ${esc((cotizacion.nombre_cliente ?? '').split(' ')[0])}</p>
        <p style="font-size:14px;color:#6B6A5E;line-height:1.5;margin:0 0 18px">Gracias por pensar en Ítalo para <strong style="color:#1C1C18">${esc(cotizacion.nombre_evento)}</strong>. Te adjuntamos la cotización en PDF.</p>
        <div style="background:#000;border-radius:10px;padding:14px 18px;color:#fff">
          <span style="color:#C5D288;font-size:11px;letter-spacing:2px">TOTAL DEL EVENTO</span><br>
          <span style="font-size:24px;font-weight:700">${total}</span> <span style="color:#A9A796;font-size:12px">ISV incluido</span>
        </div>
        <p style="font-size:13px;color:#6B6A5E;margin:18px 0 0">¿Dudas o quieres reservar la fecha? Escríbenos al <strong style="color:#3E5A34">3149-3755</strong> (llamada o WhatsApp) o en Instagram <strong style="color:#3E5A34">@italogelateria</strong>.</p>
      </td></tr>
      <tr><td style="background:#17210F;color:#DCE6B8;font-size:11px;text-align:center;padding:12px">Los Andes · 10 Calle EXPRESS · Mackey · Próceres — San Pedro Sula</td></tr>
    </table>
  </div>`;

  try {
    await crearTransportador().sendMail({
      from: process.env.GMAIL_USER,
      to: destinatario,
      subject: asunto,
      html: cuerpo,
      attachments: [{ filename: `cotizacion-evento-${cotizacion.numero}.pdf`, content: pdfBuffer }],
    });
    return { enviado: true };
  } catch (e) {
    return { enviado: false, motivo: e.message };
  }
}

// Manda la factura en PDF al correo del cliente apenas se cobra (si el
// cliente tiene correo registrado). Igual que el resumen de cierre: no-op
// si no hay credenciales, nunca bloquea el cobro.
export async function enviarFacturaCliente(venta, pdfBuffer) {
  if (!transportadorDisponible()) return { enviado: false, motivo: 'GMAIL_USER/GMAIL_APP_PASSWORD no configurados' };
  if (!venta.clientes?.email) return { enviado: false, motivo: 'El cliente no tiene correo registrado' };

  const esBorrador = venta.puntos_emision?.es_borrador;
  const asunto = `${esBorrador ? '[Documento interno] ' : ''}Factura ${venta.numero_factura} — Italo Gelateria`;
  const cuerpo = `
    <p>Hola ${venta.clientes?.nombre ?? ''},</p>
    <p>Gracias por tu compra en Italo Gelateria. Adjunto va tu factura ${venta.numero_factura}.</p>
    ${esBorrador ? '<p><strong>Nota:</strong> este documento es un comprobante interno, todavía sin validez fiscal.</p>' : ''}
    <p>Total: L ${Number(venta.total).toFixed(2)}</p>
  `;

  try {
    await crearTransportador().sendMail({
      from: process.env.GMAIL_USER,
      to: venta.clientes.email,
      subject: asunto,
      html: cuerpo,
      attachments: [{ filename: `factura-${venta.numero_factura}.pdf`, content: pdfBuffer }],
    });
    return { enviado: true };
  } catch (e) {
    return { enviado: false, motivo: e.message };
  }
}
```

### `backend/lib/cotizacionPdf.js`

```js
import PDFDocument from 'pdfkit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PassThrough } from 'node:stream';
import { EMPRESA, MARCA } from './empresa.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FUENTES = path.join(__dirname, '..', 'assets', 'fonts');
const DIAS_VALIDEZ = 15;

function money(n) {
  return `L ${Number(n ?? 0).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// "15:30:00" → "3:30 p. m."
function horaCorta(h) {
  if (!h) return '';
  const [hh, mm] = String(h).split(':').map(Number);
  const sufijo = hh >= 12 ? 'p. m.' : 'a. m.';
  return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${sufijo}`;
}

function fechaLarga(fecha) {
  if (!fecha) return 'Por confirmar';
  const d = typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? new Date(`${fecha}T12:00:00Z`) : new Date(fecha);
  return d.toLocaleDateString('es-HN', { timeZone: 'America/Tegucigalpa', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function fechaCorta(fecha) {
  return new Date(fecha).toLocaleDateString('es-HN', { timeZone: 'America/Tegucigalpa', day: 'numeric', month: 'long', year: 'numeric' });
}

function capitalizar(t) {
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
}

// Isotipo oficial Ítalo (BrandBook pág. 5): anillo + barra.
function isotipo(doc, x, y, tam, color) {
  const r = tam * 0.36;
  const grosor = tam * 0.13;
  const cx = x + tam / 2;
  const cy = y + tam * 0.43;
  doc.save();
  doc.lineWidth(grosor).strokeColor(color).circle(cx, cy, r - grosor / 2).stroke();
  doc.roundedRect(cx - tam * 0.3, cy + r + tam * 0.1, tam * 0.6, grosor, grosor * 0.2).fill(color);
  doc.restore();
}

// Wordmark "ITALO / GELATERIA" con la barra verde bajo la O, como en la
// señalética de las sucursales.
function wordmark(doc, x, y, tamano) {
  doc.font('PoppinsExtraBold').fontSize(tamano).fillColor(MARCA.blanco);
  const ital = 'ITAL';
  doc.text(ital, x, y, { lineBreak: false, characterSpacing: 0.5 });
  const anchoItal = doc.widthOfString(ital, { characterSpacing: 0.5 });
  doc.text('O', x + anchoItal, y, { lineBreak: false });
  const anchoO = doc.widthOfString('O');
  doc.roundedRect(x + anchoItal + anchoO * 0.14, y + tamano * 1.1, anchoO * 0.72, tamano * 0.08, 1.5).fill(MARCA.verde);
  doc
    .font('PoppinsSemiBold')
    .fontSize(tamano * 0.42)
    .fillColor(MARCA.verde)
    .text('GELATERIA', x + 1, y + tamano * 1.3, { characterSpacing: tamano * 0.07, lineBreak: false });
}

function etiqueta(doc, texto, x, y, color = MARCA.verdeProfundo) {
  doc.font('PoppinsSemiBold').fontSize(7.5).fillColor(color).text(texto.toUpperCase(), x, y, { characterSpacing: 1.6, lineBreak: false });
}

// Cotización de un evento (boda, cumpleaños, corporativo): copitas de
// gelato + servicio. Documento para el cliente con la identidad Ítalo del
// BrandBook: negro que predomina, verde que decora, crema de fondo.
export function generarPdfCotizacion(cotizacion, res) {
  const doc = new PDFDocument({
    size: 'LETTER',
    margin: 0,
    info: { Title: `Cotización ${cotizacion.nombre_evento ?? ''} — Ítalo Gelateria`, Author: EMPRESA.razonSocial },
  });
  doc.registerFont('Poppins', path.join(FUENTES, 'Poppins-Regular.ttf'));
  doc.registerFont('PoppinsMedium', path.join(FUENTES, 'Poppins-Medium.ttf'));
  doc.registerFont('PoppinsSemiBold', path.join(FUENTES, 'Poppins-SemiBold.ttf'));
  doc.registerFont('PoppinsBold', path.join(FUENTES, 'Poppins-Bold.ttf'));
  doc.registerFont('PoppinsExtraBold', path.join(FUENTES, 'Poppins-ExtraBold.ttf'));
  doc.pipe(res);

  const W = doc.page.width;
  const H = doc.page.height;
  const M = 48;
  const ancho = W - M * 2;
  const ALTO_PIE = 92;

  const emitida = cotizacion.created_at ? new Date(cotizacion.created_at) : new Date();
  const vence = new Date(emitida.getTime() + DIAS_VALIDEZ * 86400000);
  const numero = `No. ${String(cotizacion.numero ?? '').padStart(4, '0')}`;

  // ── Encabezado negro con isotipo + wordmark ──────────────────────────
  doc.rect(0, 0, W, 132).fill(MARCA.negro);
  // Arco decorativo (eco del anillo del isotipo) saliendo del borde.
  doc.save();
  doc.lineWidth(26).strokeOpacity(0.16).strokeColor(MARCA.verde).circle(W - 30, -20, 120).stroke();
  doc.restore();
  isotipo(doc, M, 30, 64, MARCA.verde);
  wordmark(doc, M + 78, 32, 30);

  doc.font('PoppinsSemiBold').fontSize(9).fillColor(MARCA.verde);
  doc.text('COTIZACIÓN DE EVENTO', W - M - 220, 36, { width: 220, align: 'right', characterSpacing: 1.8 });
  doc.font('PoppinsBold').fontSize(20).fillColor(MARCA.blanco).text(numero, W - M - 220, 50, { width: 220, align: 'right' });
  doc.font('Poppins').fontSize(8.5).fillColor('#B9B8AC');
  doc.text(`Emitida: ${fechaCorta(emitida)}`, W - M - 220, 82, { width: 220, align: 'right' });
  doc.text(`Válida hasta: ${fechaCorta(vence)}`, W - M - 220, 95, { width: 220, align: 'right' });
  doc.rect(0, 132, W, 5).fill(MARCA.verde);

  // Fondo crema del cuerpo
  doc.rect(0, 137, W, H - 137 - ALTO_PIE).fill(MARCA.crema);

  // ── Saludo ────────────────────────────────────────────────────────────
  let y = 158;
  const nombreCliente = cotizacion.nombre_cliente || 'Cliente';
  doc.font('PoppinsBold').fontSize(17).fillColor(MARCA.carbon).text(`Hola, ${nombreCliente.split(' ')[0]}`, M, y);
  y = doc.y + 2;
  doc
    .font('Poppins')
    .fontSize(9.5)
    .fillColor(MARCA.gris)
    .text(
      'Gracias por pensar en Ítalo para tu evento. Esta es nuestra propuesta de gelato artesanal, preparado en nuestra planta de San Pedro Sula y servido fresco para tus invitados.',
      M,
      y,
      { width: ancho * 0.8, lineGap: 1.5 }
    );
  y = doc.y + 16;

  // ── Tarjetas Cliente / Evento ────────────────────────────────────────
  const gap = 14;
  const anchoTarjeta = (ancho - gap) / 2;
  const altoTarjeta = 96;
  const tarjeta = (x, titulo, principal, lineas) => {
    doc.roundedRect(x, y, anchoTarjeta, altoTarjeta, 10).fill(MARCA.blanco);
    doc.rect(x, y + 14, 3, altoTarjeta - 28).fill(MARCA.verdeProfundo);
    etiqueta(doc, titulo, x + 16, y + 12);
    doc
      .font('PoppinsSemiBold')
      .fontSize(12)
      .fillColor(MARCA.carbon)
      .text(principal, x + 16, y + 26, { width: anchoTarjeta - 30, height: 18, ellipsis: true });
    let yl = y + 47;
    doc.font('Poppins').fontSize(8.8).fillColor(MARCA.gris);
    for (const l of lineas.filter(Boolean).slice(0, 3)) {
      doc.text(l, x + 16, yl, { width: anchoTarjeta - 30, height: 13, ellipsis: true });
      yl += 13.5;
    }
  };
  tarjeta(M, 'Preparada para', nombreCliente, [
    cotizacion.telefono_cliente && `Tel. ${cotizacion.telefono_cliente}`,
    cotizacion.email_cliente,
    cotizacion.rtn_cliente && `RTN ${cotizacion.rtn_cliente}`,
  ]);
  tarjeta(M + anchoTarjeta + gap, 'Tu evento', cotizacion.nombre_evento || 'Evento', [
    [capitalizar(fechaLarga(cotizacion.fecha_evento)), horaCorta(cotizacion.hora_evento)].filter(Boolean).join(' · '),
    cotizacion.lugar,
    `${Number(cotizacion.cantidad_copitas || 0).toLocaleString('es-HN')} copitas de gelato`,
  ]);
  y += altoTarjeta + 22;

  // ── Tabla ─────────────────────────────────────────────────────────────
  const cCant = M + ancho * 0.56;
  const cPrecio = M + ancho * 0.68;
  const cTotal = M + ancho * 0.82;
  const wNum = ancho * 0.12;
  const wTot = ancho * 0.18;

  doc.roundedRect(M, y, ancho, 26, 7).fill(MARCA.verdeProfundo);
  doc.font('PoppinsSemiBold').fontSize(8).fillColor(MARCA.blanco);
  doc.text('DESCRIPCIÓN', M + 14, y + 9, { characterSpacing: 1 });
  doc.text('CANT.', cCant, y + 9, { width: wNum, align: 'right', characterSpacing: 1 });
  doc.text('PRECIO', cPrecio, y + 9, { width: wNum + 4, align: 'right', characterSpacing: 1 });
  doc.text('TOTAL', cTotal, y + 9, { width: wTot - 14, align: 'right', characterSpacing: 1 });
  y += 26;

  const totalCopitas = Number(cotizacion.cantidad_copitas || 0) * Number(cotizacion.precio_copita || 0);
  const filas = [
    {
      titulo: 'Copitas de gelato artesanal',
      detalle: 'Sabores de nuestra vitrina a elección, porción individual en copita.',
      cantidad: Number(cotizacion.cantidad_copitas || 0).toLocaleString('es-HN'),
      precio: money(cotizacion.precio_copita),
      total: totalCopitas,
    },
  ];
  if (Number(cotizacion.costo_servicio) > 0) {
    filas.push({
      titulo: 'Servicio para el evento',
      detalle: 'Montaje, atención a los invitados y desmontaje por nuestro equipo.',
      cantidad: '1',
      precio: money(cotizacion.costo_servicio),
      total: Number(cotizacion.costo_servicio),
    });
  }

  filas.forEach((f, i) => {
    const alto = 44;
    doc.rect(M, y, ancho, alto).fill(i % 2 === 0 ? MARCA.blanco : '#FAF8F2');
    doc.font('PoppinsSemiBold').fontSize(10).fillColor(MARCA.carbon).text(f.titulo, M + 14, y + 8, { width: ancho * 0.52 });
    doc
      .font('Poppins')
      .fontSize(8)
      .fillColor(MARCA.gris)
      .text(f.detalle, M + 14, y + 23, { width: ancho * 0.52, height: 14, ellipsis: true });
    doc.font('PoppinsMedium').fontSize(10).fillColor(MARCA.carbon);
    doc.text(f.cantidad, cCant, y + 15, { width: wNum, align: 'right' });
    doc.text(f.precio, cPrecio, y + 15, { width: wNum + 4, align: 'right' });
    doc.font('PoppinsSemiBold').text(money(f.total), cTotal, y + 15, { width: wTot - 14, align: 'right' });
    y += alto;
  });
  doc.moveTo(M, y).lineTo(M + ancho, y).lineWidth(1.2).strokeColor(MARCA.verde).stroke();
  y += 16;

  // ── Condiciones (izquierda) + Totales (derecha) ──────────────────────
  const anchoTotales = 214;
  const xTot = M + ancho - anchoTotales;
  const subtotal = totalCopitas + Number(cotizacion.costo_servicio || 0);
  let yT = y;
  const filaTotal = (etq, valor, color = MARCA.carbon) => {
    doc.font('Poppins').fontSize(9.5).fillColor(MARCA.gris).text(etq, xTot, yT, { width: 110 });
    doc.font('PoppinsMedium').fillColor(color).text(valor, xTot + 100, yT, { width: anchoTotales - 100, align: 'right' });
    yT += 17;
  };
  filaTotal('Subtotal', money(subtotal));
  if (Number(cotizacion.descuento) > 0) filaTotal('Descuento', `− ${money(cotizacion.descuento)}`, MARCA.verdeProfundo);
  yT += 4;
  doc.roundedRect(xTot, yT, anchoTotales, 50, 10).fill(MARCA.negro);
  doc.font('PoppinsSemiBold').fontSize(8).fillColor(MARCA.verde).text('TOTAL DEL EVENTO', xTot + 16, yT + 10, { characterSpacing: 1.4 });
  doc
    .font('PoppinsBold')
    .fontSize(19)
    .fillColor(MARCA.blanco)
    .text(money(cotizacion.total), xTot + 16, yT + 21, { width: anchoTotales - 32, align: 'right' });
  doc.font('Poppins').fontSize(7.5).fillColor(MARCA.gris).text('ISV incluido', xTot, yT + 55, { width: anchoTotales, align: 'right' });
  const porCopita = Number(cotizacion.cantidad_copitas) > 0 ? Number(cotizacion.total) / Number(cotizacion.cantidad_copitas) : 0;
  if (porCopita > 0) {
    doc.text(`Equivale a ${money(porCopita)} por copita`, xTot, yT + 66, { width: anchoTotales, align: 'right' });
  }
  let finTotales = yT + 82;
  const anticipo = Number(cotizacion.anticipo || 0);
  if (anticipo > 0) {
    doc.font('PoppinsMedium').fontSize(8.5).fillColor(MARCA.verdeProfundo);
    doc.text(`Anticipo recibido: ${money(anticipo)}`, xTot, finTotales - 2, { width: anchoTotales, align: 'right' });
    doc.font('PoppinsSemiBold').fillColor(MARCA.carbon);
    doc.text(`Saldo pendiente: ${money(Math.max(0, Number(cotizacion.total) - anticipo))}`, xTot, finTotales + 10, {
      width: anchoTotales,
      align: 'right',
    });
    finTotales += 26;
  }

  const anchoCond = ancho - anchoTotales - 28;
  etiqueta(doc, 'Condiciones', M, y);
  let yc = y + 16;
  for (const c of EMPRESA.condicionesEventos) {
    doc.circle(M + 4, yc + 5.5, 3.2).fill(MARCA.verdeProfundo);
    doc.font('Poppins').fontSize(8.6).fillColor(MARCA.carbon).text(c, M + 14, yc, { width: anchoCond - 14, lineGap: 1 });
    yc = doc.y + 5;
  }
  y = Math.max(finTotales, yc) + 10;

  // ── Notas ─────────────────────────────────────────────────────────────
  if (cotizacion.notas) {
    doc.font('Poppins').fontSize(9);
    const altoNotas = Math.min(90, doc.heightOfString(cotizacion.notas, { width: ancho - 32 }) + 34);
    doc.roundedRect(M, y, ancho, altoNotas, 10).fill(MARCA.verdeClaro);
    etiqueta(doc, 'Notas', M + 16, y + 11, MARCA.verdeOscuro);
    doc
      .font('Poppins')
      .fontSize(9)
      .fillColor(MARCA.verdeOscuro)
      .text(cotizacion.notas, M + 16, y + 25, { width: ancho - 32, height: altoNotas - 30, ellipsis: true });
    y += altoNotas + 14;
  }

  // ── Aceptación ────────────────────────────────────────────────────────
  const yFirma = Math.max(y + 8, H - ALTO_PIE - 62);
  if (yFirma + 42 < H - ALTO_PIE) {
    const anchoFirma = (ancho - 40) / 2;
    doc.moveTo(M, yFirma + 26).lineTo(M + anchoFirma, yFirma + 26).lineWidth(0.8).strokeColor('#BDB8A6').stroke();
    doc.moveTo(M + anchoFirma + 40, yFirma + 26).lineTo(M + ancho, yFirma + 26).stroke();
    doc.font('Poppins').fontSize(7.8).fillColor(MARCA.gris);
    doc.text('Aceptación del cliente (firma y fecha)', M, yFirma + 31, { width: anchoFirma });
    doc.text(`Atendido por: ${cotizacion.perfiles?.nombre ?? 'Equipo Ítalo'}`, M + anchoFirma + 40, yFirma + 31, { width: anchoFirma });
  }

  // ── Pie negro con contacto ───────────────────────────────────────────
  const yPie = H - ALTO_PIE;
  doc.rect(0, yPie, W, ALTO_PIE).fill(MARCA.negro);
  doc.rect(0, yPie, W, 3).fill(MARCA.verde);
  isotipo(doc, M, yPie + 18, 36, MARCA.verde);
  doc.font('PoppinsBold').fontSize(11).fillColor(MARCA.blanco).text('Reserva tu fecha', M + 48, yPie + 21);
  doc.font('Poppins').fontSize(8.5).fillColor('#CFCDBF').text('Escríbenos o llámanos, con gusto te ayudamos.', M + 48, yPie + 37);

  doc.font('PoppinsSemiBold').fontSize(9.5).fillColor(MARCA.verde);
  doc.text(`Tel. / WhatsApp  ${EMPRESA.telefono}`, M + 250, yPie + 20, { width: ancho - 250, align: 'right' });
  doc.text(`Instagram  ${EMPRESA.instagram}`, M + 250, yPie + 35, { width: ancho - 250, align: 'right' });
  doc.font('Poppins').fontSize(7.6).fillColor('#A9A796');
  doc.text(`${EMPRESA.sucursales.map((s) => s.nombre).join('  ·  ')}  —  ${EMPRESA.ciudad}`, M, yPie + 61, {
    width: ancho,
    align: 'center',
  });
  doc.text(EMPRESA.razonSocial, M, yPie + 73, { width: ancho, align: 'center' });

  doc.end();
}

// Igual que generarPdfCotizacion pero devuelve el PDF como Buffer en
// memoria, para poder adjuntarlo a un correo en vez de escribirlo directo
// a una respuesta HTTP.
export function generarPdfCotizacionBuffer(cotizacion) {
  return new Promise((resolve, reject) => {
    const stream = new PassThrough();
    const partes = [];
    stream.on('data', (chunk) => partes.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(partes)));
    stream.on('error', reject);
    generarPdfCotizacion(cotizacion, stream);
  });
}
```

### `backend/lib/empresa.js`

```js
// Datos de la marca que salen en documentos para clientes (cotizaciones de
// eventos, correos). Fuente: BrandBook Ítalo (paleta e isotipo, tomados de
// italo-ruleta) y la base de conocimiento del chatbot (teléfono,
// direcciones, horarios, políticas de eventos).
export const EMPRESA = {
  marca: 'Ítalo Gelateria',
  razonSocial: 'Inversiones Milano S. de R.L.',
  ciudad: 'San Pedro Sula, Honduras',
  telefono: '3149-3755',
  whatsapp: '3149-3755',
  instagram: '@italogelateria',
  sucursales: [
    { nombre: 'Los Andes', direccion: '12 Avenida, 9 Calle, Barrio Los Andes' },
    { nombre: '10 Calle EXPRESS', direccion: '10 Calle, frente a Espresso Americano' },
    { nombre: 'Mackey', direccion: 'Plaza Montecarlo, Bulevar Mackey' },
    { nombre: 'Próceres', direccion: 'Paseo Próceres' },
  ],
  // Políticas de eventos publicadas por el negocio (chatbot).
  condicionesEventos: [
    'Precios en Lempiras, con ISV incluido.',
    'Formato vitrina: mínimo 80 personas. Formato carrito: mínimo 150 personas.',
    'Reserva tu fecha con al menos 1 semana de anticipación.',
    'Aceptamos efectivo, tarjeta y transferencia.',
    'Cotización válida por 15 días a partir de su emisión.',
  ],
};

// Paleta oficial del BrandBook: negro predomina, verde decora, blanco rellena.
export const MARCA = {
  negro: '#000000',
  carbon: '#1C1C18',
  verde: '#C5D288',
  verdeClaro: '#DCE6B8',
  verdeProfundo: '#3E5A34',
  verdeOscuro: '#17210F',
  crema: '#F4F1EA',
  crema2: '#E8E2CF',
  gris: '#6B6A5E',
  blanco: '#FFFFFF',
};
```

### `backend/lib/facturacion.js`

```js
// Cálculo de líneas y totales de una venta. El precio de cada producto se
// asume con impuesto incluido (igual que WizPOS: "Incluye Impuesto" = true),
// así que la tasa se usa para separar base/ISV del monto ya cobrado, no para
// sumarlo encima.
//
// Bucket fiscal por línea (simplificado para el MVP; el contador debe
// revisar esta clasificación antes de declarar):
//   - tasa > 0            → gravado_15
//   - tasa == 0 y el cliente tiene exento_impuestos → exento
//   - tasa == 0 en cualquier otro caso              → exonerado

export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calcularLineas(items, cliente) {
  return items.map((item) => {
    const cantidad = Number(item.cantidad);
    const precioUnitario = Number(item.precio_unitario);
    const descuento = Number(item.descuento || 0);
    const tasa = Number(item.impuesto_tasa ?? 0);
    const monto = round2(precioUnitario * cantidad - descuento);

    let bucket;
    if (tasa > 0) bucket = 'gravado_15';
    else if (cliente?.exento_impuestos) bucket = 'exento';
    else bucket = 'exonerado';

    const base = tasa > 0 ? round2(monto / (1 + tasa)) : monto;
    const isv = round2(monto - base);

    return {
      producto_id: item.producto_id,
      nombre_producto: item.nombre_producto,
      cantidad,
      precio_unitario: precioUnitario,
      descuento,
      descuento_porcentaje: Number(item.descuento_porcentaje || 0),
      impuesto_tasa: tasa,
      monto,
      base,
      isv,
      bucket,
    };
  });
}

export const PORCENTAJES_DESCUENTO = [0, 10, 25];

// El descuento global se reparte proporcionalmente entre las líneas ANTES de
// separar base/ISV — un descuento reduce la base gravable, así que el ISV
// declarado tiene que bajar en la misma proporción. (Restarlo sólo del total
// dejaba el ISV calculado sobre el precio completo: la factura declaraba más
// impuesto del que realmente se cobró.) El centavo de redondeo se ajusta en
// la última línea para que la suma cuadre exacta.
function repartirDescuento(lineas, descuento, cliente) {
  const totalBruto = round2(lineas.reduce((s, l) => s + l.monto, 0));
  let asignado = 0;
  return lineas.map((l, i) => {
    const esUltima = i === lineas.length - 1;
    const parte = esUltima
      ? round2(descuento - asignado)
      : totalBruto > 0
        ? round2((descuento * l.monto) / totalBruto)
        : 0;
    asignado = round2(asignado + parte);
    const monto = round2(l.monto - parte);
    const base = l.impuesto_tasa > 0 ? round2(monto / (1 + l.impuesto_tasa)) : monto;
    return {
      ...l,
      descuento: round2(l.descuento + parte),
      monto,
      base,
      isv: round2(monto - base),
      bucket: l.bucket ?? (cliente?.exento_impuestos ? 'exento' : 'exonerado'),
    };
  });
}

// Descuento POR PRODUCTO (línea): en una misma orden puede haber una
// persona de tercera edad y otra que no, así que el 25% se aplica sólo a
// lo que consume esa persona. El monto de cada línea se calcula aquí y
// calcularLineas() ya lo resta antes de separar base/ISV.
export function descuentoDeLinea(precioUnitario, cantidad, porcentaje) {
  return round2((round2(Number(precioUnitario) * Number(cantidad)) * Number(porcentaje || 0)) / 100);
}

export function calcularTotales(items, cliente, descuentoGlobal = 0) {
  const brutas = calcularLineas(items, cliente);
  const totalBruto = round2(brutas.reduce((s, l) => s + l.monto, 0));
  const descuento = Math.min(totalBruto, Math.max(0, round2(Number(descuentoGlobal || 0))));
  const lineas = descuento > 0 ? repartirDescuento(brutas, descuento, cliente) : brutas;
  const descuentoLineas = round2(brutas.reduce((s, l) => s + Number(l.descuento || 0), 0));

  const totales = { subtotal_exento: 0, subtotal_exonerado: 0, subtotal_gravado_15: 0, isv_total: 0 };
  for (const l of lineas) {
    if (l.bucket === 'exento') totales.subtotal_exento += l.base;
    else if (l.bucket === 'exonerado') totales.subtotal_exonerado += l.base;
    else totales.subtotal_gravado_15 += l.base;
    totales.isv_total += l.isv;
  }

  return {
    lineas,
    // Sub-total antes de cualquier descuento (precio × cantidad).
    subtotal_bruto: round2(totalBruto + descuentoLineas),
    subtotal_exento: round2(totales.subtotal_exento),
    subtotal_exonerado: round2(totales.subtotal_exonerado),
    subtotal_gravado_15: round2(totales.subtotal_gravado_15),
    isv_total: round2(totales.isv_total),
    descuento: round2(descuento + descuentoLineas),
    total: round2(lineas.reduce((s, l) => s + l.monto, 0)),
  };
}

export function formatearNumeroFactura(puntoEmision, correlativo) {
  return [
    puntoEmision.punto_emision_codigo,
    puntoEmision.punto_venta_codigo,
    puntoEmision.tipo_documento_codigo,
    String(correlativo).padStart(8, '0'),
  ].join('-');
}
```

### `backend/lib/fechas.js`

```js
// Honduras usa UTC-6 todo el año (sin horario de verano). Las fechas de los
// filtros llegan como "YYYY-MM-DD" (días de calendario en Honduras) y la
// base guarda timestamptz en UTC. Comparar "2026-09-27" directo contra
// fecha_emision tenía dos errores:
//   1. "hasta 2026-09-27" era "hasta 2026-09-27 00:00 UTC": dejaba fuera
//      TODO el último día del rango.
//   2. El día empezaba y terminaba 6 horas antes de lo real, así que las
//      ventas de la noche (después de las 6 p. m.) caían en el día siguiente.
export const ZONA_HN = 'America/Tegucigalpa';
const OFFSET_HN = '-06:00';
const SOLO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

export function inicioDelDia(valor) {
  if (!valor) return null;
  return SOLO_FECHA.test(valor) ? new Date(`${valor}T00:00:00${OFFSET_HN}`).toISOString() : valor;
}

export function finDelDia(valor) {
  if (!valor) return null;
  return SOLO_FECHA.test(valor) ? new Date(`${valor}T23:59:59.999${OFFSET_HN}`).toISOString() : valor;
}

// Aplica el rango a una consulta de Supabase sobre una columna timestamptz.
export function filtrarRango(query, columna, fechaInicio, fechaFin) {
  const desde = inicioDelDia(fechaInicio);
  const hasta = finDelDia(fechaFin);
  if (desde) query = query.gte(columna, desde);
  if (hasta) query = query.lte(columna, hasta);
  return query;
}

const formatoFecha = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_HN, year: 'numeric', month: '2-digit', day: '2-digit' });
const formatoHora = new Intl.DateTimeFormat('en-US', { timeZone: ZONA_HN, hour: '2-digit', hourCycle: 'h23' });
const formatoDiaSemana = new Intl.DateTimeFormat('en-US', { timeZone: ZONA_HN, weekday: 'short' });
const DIAS = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

// Día de calendario en Honduras (YYYY-MM-DD) de un timestamp.
export function fechaHn(iso) {
  return formatoFecha.format(new Date(iso));
}

export function horaHn(iso) {
  return Number(formatoHora.format(new Date(iso))) % 24;
}

// 0 = lunes … 6 = domingo
export function diaSemanaHn(iso) {
  return DIAS[formatoDiaSemana.format(new Date(iso))];
}

export function hoyHn() {
  return fechaHn(new Date().toISOString());
}
```

### `backend/lib/pdf.js`

```js
import PDFDocument from 'pdfkit';
import { PassThrough } from 'node:stream';
import { etiquetaDescuento, etiquetaPorcentaje } from './ticket.js';

// Factura completa tamaño carta, para descargar o enviar por correo.
export function generarPdfFactura(venta, res) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
  doc.pipe(res);

  doc.fontSize(16).text('INVERSIONES MILANO S DE R.L.', { align: 'center' });
  doc.fontSize(12).text('Italo Gelateria', { align: 'center' });
  doc.fontSize(10).text(venta.sucursales?.nombre ?? '', { align: 'center' });
  doc.moveDown();

  const puntoEmision = venta.puntos_emision;
  if (puntoEmision?.es_borrador) {
    doc
      .fillColor('red')
      .fontSize(12)
      .text('DOCUMENTO SIN VALIDEZ FISCAL — CAI pendiente de confirmar con el SAR', { align: 'center' })
      .fillColor('black');
  } else {
    doc.fontSize(10).text(`CAI: ${puntoEmision?.cai ?? ''}`);
  }

  doc.fontSize(10);
  doc.text(`Factura No.: ${venta.numero_factura ?? ''}`);
  doc.text(`Fecha de emisión: ${new Date(venta.fecha_emision).toLocaleString('es-HN')}`);
  if (puntoEmision?.fecha_limite_emision) {
    doc.text(`Fecha límite de emisión del rango: ${puntoEmision.fecha_limite_emision}`);
  }
  doc.moveDown();

  doc.text(`Cliente: ${venta.clientes?.nombre || 'Consumidor Final'}`);
  doc.text(`RTN: ${venta.clientes?.rtn || 'N/A'}`);
  doc.text(`Cajero: ${venta.perfiles?.nombre ?? ''}`);
  doc.moveDown();

  const inicioTabla = doc.y;
  doc.font('Helvetica-Bold');
  doc.text('Producto', 50, inicioTabla, { width: 220 });
  doc.text('Cant.', 270, inicioTabla, { width: 50, align: 'right' });
  doc.text('Precio', 320, inicioTabla, { width: 80, align: 'right' });
  doc.text('Monto', 400, inicioTabla, { width: 100, align: 'right' });
  doc.font('Helvetica');
  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(500, doc.y).stroke();
  doc.moveDown(0.5);

  for (const item of venta.detalle ?? []) {
    const y = doc.y;
    doc.text(item.nombre_producto, 50, y, { width: 220 });
    doc.text(String(item.cantidad), 270, y, { width: 50, align: 'right' });
    doc.text(`L ${Number(item.precio_unitario).toFixed(2)}`, 320, y, { width: 80, align: 'right' });
    const bruto = Number(item.cantidad) * Number(item.precio_unitario);
    doc.text(`L ${bruto.toFixed(2)}`, 400, y, { width: 100, align: 'right' });
    doc.moveDown();
    if (Number(item.descuento) > 0) {
      const yd = doc.y;
      doc.fontSize(8.5).fillColor('#555');
      doc.text(`   ${etiquetaPorcentaje(item.descuento_porcentaje)}`, 50, yd, { width: 300 });
      doc.text(`-L ${Number(item.descuento).toFixed(2)}`, 400, yd, { width: 100, align: 'right' });
      doc.fillColor('black').fontSize(10);
      doc.moveDown(0.6);
    }
  }

  doc.moveTo(50, doc.y).lineTo(500, doc.y).stroke();
  doc.moveDown();

  const filaTotal = (etiqueta, monto) => {
    const y = doc.y;
    doc.text(etiqueta, 220, y, { width: 180, align: 'right' });
    doc.text(`L ${Number(monto).toFixed(2)}`, 400, y, { width: 100, align: 'right' });
    doc.moveDown();
  };

  if (Number(venta.descuento) > 0) filaTotal(`${etiquetaDescuento(venta)}:`, -Number(venta.descuento));
  filaTotal('Exento:', venta.subtotal_exento);
  filaTotal('Exonerado:', venta.subtotal_exonerado);
  filaTotal('Gravado 15%:', venta.subtotal_gravado_15);
  filaTotal('ISV 15%:', venta.isv_total);
  doc.font('Helvetica-Bold');
  filaTotal('TOTAL:', venta.total);
  doc.font('Helvetica');

  doc.end();
}

// Igual que generarPdfFactura pero devuelve el PDF como Buffer en memoria
// (para adjuntarlo a un correo) en vez de escribirlo directo a una
// respuesta HTTP.
export function generarPdfFacturaBuffer(venta) {
  return new Promise((resolve, reject) => {
    const stream = new PassThrough();
    const partes = [];
    stream.on('data', (chunk) => partes.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(partes)));
    stream.on('error', reject);
    generarPdfFactura(venta, stream);
  });
}
```

### `backend/lib/reglas.js`

```js
import { db } from '../db.js';

// Umbrales del antifraude. El admin los ajusta en Antifraude → Reglas;
// estos son los valores de fábrica.
export const REGLAS_POR_DEFECTO = {
  monto_alerta_descarte: 150,
  max_tercera_edad_dia: 10,
  max_usos_carne_dia: 3,
  minutos_orden_estacionada: 60,
  minutos_doble_factura: 5,
  minutos_hueco: 45,
  umbral_sobrante: 50,
  faltantes_reincidencia: 2,
  minutos_bloqueo_cajero: 10,
  minutos_bloqueo_otros: 20,
  intentos_login: 5,
  hora_apertura: 9,
  hora_cierre: 24,
  exigir_carne_tercera_edad: true,
  exigir_motivo_reimpresion: true,
  exigir_motivo_descarte: true,
  leyenda_factura_gratis: false,
};

let cache = null;
let cacheHasta = 0;

export async function obtenerReglas() {
  if (cache && Date.now() < cacheHasta) return cache;
  const { data } = await db.from('config_antifraude').select('reglas').eq('id', 1).maybeSingle();
  cache = { ...REGLAS_POR_DEFECTO, ...(data?.reglas ?? {}) };
  cacheHasta = Date.now() + 60 * 1000;
  return cache;
}

export async function guardarReglas(nuevas, usuarioId) {
  const limpias = {};
  for (const [k, def] of Object.entries(REGLAS_POR_DEFECTO)) {
    if (nuevas[k] === undefined) continue;
    if (typeof def === 'boolean') limpias[k] = Boolean(nuevas[k]);
    else {
      const n = Number(nuevas[k]);
      if (Number.isFinite(n) && n >= 0) limpias[k] = n;
    }
  }
  const actuales = await obtenerReglas();
  const reglas = { ...actuales, ...limpias };
  const { error } = await db.from('config_antifraude').upsert({ id: 1, reglas, updated_at: new Date().toISOString(), updated_by: usuarioId });
  if (error) throw new Error(error.message);
  cache = reglas;
  cacheHasta = Date.now() + 60 * 1000;
  return reglas;
}
```

### `backend/lib/ticket.js`

```js
// Ticket para impresoras térmicas. Ancho en caracteres según el papel:
//   48 col → 80 mm (Epson TM-T20, Xprinter/3nStar de 80 mm, fuente A)
//   32 col → 58 mm (impresoras térmicas pequeñas/portátiles)
export const ANCHOS_TICKET = { 48: '80mm', 40: '76mm', 32: '58mm' };

export function anchoValido(columnas) {
  const n = Number(columnas);
  return ANCHOS_TICKET[n] ? n : 48;
}

function centrar(texto, ancho) {
  const recortado = texto.slice(0, ancho);
  const espacio = Math.max(0, ancho - recortado.length);
  const izq = Math.floor(espacio / 2);
  return ' '.repeat(izq) + recortado + ' '.repeat(espacio - izq);
}

function linea(caracter, ancho) {
  return caracter.repeat(ancho);
}

function filaMontoDerecha(etiqueta, monto, ancho) {
  const montoTexto = `L ${Number(monto).toFixed(2)}`;
  const espacio = Math.max(1, ancho - etiqueta.length - montoTexto.length);
  return etiqueta + ' '.repeat(espacio) + montoTexto;
}

// Parte un texto largo en renglones del ancho del papel, sin cortar
// palabras — salvo las que por sí solas no caben (ej. el CAI, que no tiene
// espacios y en papel de 58 mm es más ancho que el rollo).
function ajustar(texto, ancho) {
  const palabras = String(texto)
    .split(/\s+/)
    .flatMap((p) => (p.length > ancho ? p.match(new RegExp(`.{1,${ancho}}`, 'g')) : [p]));
  const renglones = [];
  let actual = '';
  for (const p of palabras) {
    if ((actual + ' ' + p).trim().length > ancho) {
      if (actual) renglones.push(actual);
      actual = p;
    } else {
      actual = (actual + ' ' + p).trim();
    }
  }
  if (actual) renglones.push(actual);
  return renglones;
}

export function etiquetaPorcentaje(pct) {
  const n = Number(pct ?? 0);
  if (n === 25) return 'Desc. 25% 3ra edad';
  if (n > 0) return `Descuento ${n}%`;
  return 'Descuento';
}

// Con descuento por producto, una orden puede mezclar 10% y 25%: el total
// se rotula genérico y el detalle va debajo de cada producto.
export function etiquetaDescuento(venta) {
  const porcentajes = new Set((venta.detalle ?? []).filter((d) => Number(d.descuento) > 0).map((d) => Number(d.descuento_porcentaje ?? 0)));
  if (porcentajes.size > 1) return 'Total descuentos';
  if (porcentajes.size === 1) return etiquetaPorcentaje([...porcentajes][0]);
  return etiquetaPorcentaje(venta.descuento_porcentaje);
}

export function formatearTicket(venta, ancho = 48, { copia = 0, leyendaGratis = false } = {}) {
  const L = [];
  L.push(centrar('INVERSIONES MILANO S DE R.L.', ancho));
  L.push(centrar('ITALO GELATERIA', ancho));
  for (const r of ajustar(venta.sucursales?.nombre ?? '', ancho)) L.push(centrar(r, ancho));
  L.push(linea('-', ancho));

  if (copia > 0) {
    L.push(centrar('*** COPIA ***', ancho));
    L.push(centrar(`REIMPRESION #${copia} - NO ES ORIGINAL`, ancho));
    L.push(linea('-', ancho));
  }

  const puntoEmision = venta.puntos_emision;
  if (puntoEmision?.es_borrador) {
    L.push(centrar('*** SIN VALIDEZ FISCAL ***', ancho));
    L.push(centrar('(CAI pendiente)', ancho));
  } else {
    for (const r of ajustar(`CAI: ${puntoEmision?.cai ?? ''}`, ancho)) L.push(r);
  }
  L.push(`Factura: ${venta.numero_factura ?? ''}`);
  L.push(`Fecha: ${new Date(venta.fecha_emision).toLocaleString('es-HN', { timeZone: 'America/Tegucigalpa' })}`);
  if (puntoEmision?.fecha_limite_emision) {
    L.push(`Fecha limite emision: ${puntoEmision.fecha_limite_emision}`);
  }
  L.push(linea('-', ancho));

  for (const r of ajustar(`Cliente: ${venta.clientes?.nombre || 'Consumidor Final'}`, ancho)) L.push(r);
  if (venta.clientes?.rtn) L.push(`RTN: ${venta.clientes.rtn}`);
  L.push(`Cajero: ${venta.perfiles?.nombre ?? ''}`);
  L.push(linea('-', ancho));

  for (const item of venta.detalle ?? []) {
    for (const r of ajustar(`${Number(item.cantidad)} ${item.nombre_producto}`, ancho)) L.push(r);
    const bruto = Number(item.cantidad) * Number(item.precio_unitario);
    L.push(filaMontoDerecha(`  @ L${Number(item.precio_unitario).toFixed(2)}`, bruto, ancho));
    if (Number(item.descuento) > 0) {
      L.push(filaMontoDerecha(`  ${etiquetaPorcentaje(item.descuento_porcentaje)}`, -Number(item.descuento), ancho));
    }
  }
  L.push(linea('-', ancho));

  if (Number(venta.descuento) > 0) L.push(filaMontoDerecha(etiquetaDescuento(venta), -Number(venta.descuento), ancho));
  L.push(filaMontoDerecha('Exento', venta.subtotal_exento, ancho));
  L.push(filaMontoDerecha('Exonerado', venta.subtotal_exonerado, ancho));
  L.push(filaMontoDerecha('Gravado 15%', venta.subtotal_gravado_15, ancho));
  L.push(filaMontoDerecha('ISV 15%', venta.isv_total, ancho));
  L.push(linea('=', ancho));
  L.push(filaMontoDerecha('TOTAL', venta.total, ancho));
  L.push(linea('=', ancho));

  if (venta.efectivo_recibido != null) {
    L.push(filaMontoDerecha('Recibido', venta.efectivo_recibido, ancho));
    L.push(filaMontoDerecha('Cambio', venta.cambio, ancho));
  }
  if (venta.tercera_edad_identidad) {
    for (const r of ajustar(`Desc. 3ra edad: ${venta.tercera_edad_nombre ?? ''} ID ${venta.tercera_edad_identidad}`, ancho)) L.push(r);
  }
  L.push('');
  L.push(centrar('Gracias por su compra', ancho));
  // Opcional (Antifraude → Reglas): convierte a cada cliente en auditor.
  if (leyendaGratis) for (const r of ajustar('Si no recibe su factura, su compra es GRATIS', ancho)) L.push(centrar(r, ancho));
  L.push('');

  return L.join('\n');
}

function fechaCorta(iso) {
  return new Date(iso).toLocaleString('es-HN', {
    timeZone: 'America/Tegucigalpa',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function etiquetaDiferencia(dif) {
  const d = Number(dif ?? 0);
  if (Math.abs(d) < 0.005) return 'CUADRA';
  return d < 0 ? 'FALTANTE' : 'SOBRANTE';
}

// Ticket del cierre de caja, para engrapar con los cierres de lote de los
// dos POS. Con cierre ciego (ocultarSistema) sólo imprime lo contado.
export function formatearCierre(cierre, ancho = 48, { ocultarSistema = false, desglose = null } = {}) {
  const L = [];
  const fila = (etiqueta, monto) => L.push(filaMontoDerecha(etiqueta, monto, ancho));
  L.push(centrar('ITALO GELATERIA', ancho));
  L.push(centrar('CIERRE DE CAJA', ancho));
  for (const r of ajustar(cierre.sucursales?.nombre ?? '', ancho)) L.push(centrar(r, ancho));
  L.push(linea('-', ancho));
  L.push(`Desde: ${fechaCorta(cierre.fecha_inicio)}`);
  L.push(`Hasta: ${fechaCorta(cierre.fecha_fin)}`);
  L.push(`Cajero: ${cierre.cajero?.nombre ?? ''}`);
  if (cierre.elaboro?.nombre && cierre.elaboro.nombre !== cierre.cajero?.nombre) L.push(`Elaboro: ${cierre.elaboro.nombre}`);
  if (cierre.factura_desde) {
    for (const r of ajustar(`Facturas: ${cierre.factura_desde} a ${cierre.factura_hasta}`, ancho)) L.push(r);
  }
  if (cierre.cantidad_facturas != null) L.push(`Cantidad de facturas: ${cierre.cantidad_facturas}`);
  L.push(linea('=', ancho));

  L.push('TARJETA');
  fila('  POS BAC', cierre.pos_bac ?? 0);
  fila('  POS Ficohsa', cierre.pos_ficohsa ?? 0);
  fila('  Total POS', Number(cierre.pos_bac ?? 0) + Number(cierre.pos_ficohsa ?? 0));
  if (!ocultarSistema) {
    fila('  Segun sistema', cierre.tarjeta_sistema ?? 0);
    fila(`  ${etiquetaDiferencia(cierre.diferencia_tarjeta)}`, Math.abs(cierre.diferencia_tarjeta ?? 0));
  }
  L.push(linea('-', ancho));

  L.push('EFECTIVO');
  fila('  Contado en caja', cierre.efectivo_contado ?? 0);
  fila('  Fondo de caja', cierre.fondo_caja ?? 0);
  if (Number(cierre.salidas) > 0) fila('  Salidas de caja', cierre.salidas);
  if (!ocultarSistema) {
    fila('  Ventas en efectivo', cierre.efectivo_sistema ?? 0);
    fila('  Esperado en caja', cierre.total_esperado ?? 0);
    fila(`  ${etiquetaDiferencia(cierre.diferencia_efectivo)}`, Math.abs(cierre.diferencia_efectivo ?? 0));
  }
  L.push(linea('-', ancho));

  if (!ocultarSistema) {
    fila('TRANSFERENCIAS', cierre.transferencia_sistema ?? 0);
    L.push(linea('=', ancho));
    fila('TOTAL VENTAS', cierre.total_ventas ?? 0);
    fila(`${etiquetaDiferencia(cierre.diferencia)} TOTAL`, Math.abs(cierre.diferencia ?? 0));
    L.push(linea('=', ancho));
    if (Math.abs(Number(cierre.diferencia_tarjeta ?? 0)) >= 1 || Math.abs(Number(cierre.diferencia_efectivo ?? 0)) >= 1) {
      L.push(centrar('*** DESCUADRE ***', ancho));
      L.push(centrar('Notificado a administracion', ancho));
      L.push(linea('=', ancho));
    }
  }

  if (desglose) {
    L.push('DESGLOSE DEL TURNO');
    for (const [nombre, f] of Object.entries(desglose.formas)) {
      fila(`  ${nombre} x${f.facturas}`, f.monto);
    }
    const listar = (titulo, lista) => {
      if (lista.length === 0) return;
      L.push(linea('-', ancho));
      L.push(`${titulo} (${lista.length})`);
      for (const x of lista) fila(`  ${String(x.numero ?? '').slice(-8)}`, x.monto ?? x.total);
    };
    // Una por una, para cotejar contra los vouchers del POS y la banca.
    listar('FACTURAS CON TARJETA', desglose.tarjeta);
    listar('TRANSFERENCIAS', desglose.transferencia);
    listar('ANULADAS', desglose.anuladas);
    const descuentos = Object.entries(desglose.descuentos);
    if (descuentos.length > 0) {
      L.push(linea('-', ancho));
      L.push('DESCUENTOS APLICADOS');
      for (const [pct, d] of descuentos) {
        fila(`  ${Number(pct) === 25 ? '25% 3ra edad' : `${pct}%`} (${d.lineas} prod.)`, d.monto);
      }
    }
    L.push(linea('=', ancho));
  }

  if (cierre.observaciones) {
    L.push('Observaciones:');
    for (const r of ajustar(cierre.observaciones, ancho)) L.push(r);
  }
  L.push('');
  L.push('');
  L.push(centrar('______________________', ancho));
  L.push(centrar('Firma cajero', ancho));
  L.push('');
  L.push('');
  L.push(centrar('______________________', ancho));
  L.push(centrar('Firma supervisor', ancho));
  L.push('');
  return L.join('\n');
}

export function formatearTicketPrueba(ancho, sucursal) {
  const L = [];
  L.push(centrar('ITALO GELATERIA', ancho));
  L.push(centrar('PRUEBA DE IMPRESORA', ancho));
  L.push(linea('-', ancho));
  if (sucursal) for (const r of ajustar(sucursal, ancho)) L.push(centrar(r, ancho));
  L.push(`Papel: ${ANCHOS_TICKET[ancho]} (${ancho} columnas)`);
  L.push(`Fecha: ${new Date().toLocaleString('es-HN', { timeZone: 'America/Tegucigalpa' })}`);
  L.push(linea('-', ancho));
  L.push('0123456789'.repeat(Math.ceil(ancho / 10)).slice(0, ancho));
  L.push(filaMontoDerecha('Si esta linea cabe completa', 123.45, ancho));
  L.push(linea('=', ancho));
  L.push(centrar('Si ve todo derecho y sin cortes,', ancho));
  L.push(centrar('la impresora quedo bien configurada.', ancho));
  L.push('');
  return L.join('\n');
}

function escaparHtml(texto) {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Área realmente imprimible de cada papel (el cabezal no llega al borde):
// 80 mm → 72 mm, 58 mm → 48 mm.
const IMPRIMIBLE_MM = { '80mm': 72, '76mm': 68, '58mm': 48 };

// Página del ticket. Siempre UNA copia. @page fija el ancho real del papel
// térmico para que el navegador no agregue márgenes ni escale la hoja, y el
// tamaño de letra se calcula para que las N columnas llenen exactamente el
// área imprimible (Courier: cada carácter mide 0.6 del tamaño de fuente).
export function envolverTicketHtml(textoTicket, ancho) {
  const papel = ANCHOS_TICKET[ancho] ?? '80mm';
  const imprimible = IMPRIMIBLE_MM[papel];
  const fuenteMm = (imprimible / (ancho * 0.6)).toFixed(2);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Ticket</title>
<style>
  @page { size: ${papel} auto; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  pre {
    font-family: 'Courier New', Courier, monospace;
    font-size: ${fuenteMm}mm;
    line-height: 1.2;
    white-space: pre;
    width: ${imprimible}mm;
    margin: 0 auto;
    padding: 2mm 0 8mm;
    color: #000;
    overflow: hidden;
  }
</style>
</head>
<body>
<pre>${escaparHtml(textoTicket)}</pre>
</body>
</html>`;
}
```

## Backend: rutas de la API

### `backend/routes/antifraude.js`

```js
import { Router } from 'express';
import { db } from '../db.js';
import { round2 } from '../lib/facturacion.js';
import { traerTodo } from '../lib/consultas.js';
import { fechaHn, filtrarRango, horaHn } from '../lib/fechas.js';
import { registrarAuditoria } from '../lib/auditoria.js';
import { requireRole } from '../middleware/requireRole.js';
import { alertaFueraDeHorario } from '../lib/antifraude.js';
import { destinatariosAdmins } from '../lib/correo.js';
import { crearAlerta } from '../lib/alertas.js';
import { guardarReglas, obtenerReglas } from '../lib/reglas.js';
import { hoyHn, inicioDelDia } from '../lib/fechas.js';
import { totalesPorForma } from '../lib/cierre.js';
import { ventasDelTurno } from './cierres.js';

export const antifraude = Router();

// ── Eventos que manda la app (navegación, carrito, búsquedas) ───────────
// Cualquier usuario logueado; sólo prefijos permitidos y detalle acotado,
// para que nadie pueda usar esto para llenar la bitácora de basura.
const PREFIJOS_EVENTO = ['sesion.', 'pantalla.', 'orden.', 'factura.', 'reporte.', 'cierre.ver'];
const eventosPorUsuario = new Map();

function limitarDetalle(detalle) {
  const limpio = {};
  for (const [k, v] of Object.entries(detalle ?? {}).slice(0, 12)) {
    if (v === null || ['string', 'number', 'boolean'].includes(typeof v)) {
      limpio[String(k).slice(0, 40)] = typeof v === 'string' ? v.slice(0, 200) : v;
    }
  }
  return limpio;
}

antifraude.post('/evento', async (req, res) => {
  const { accion, detalle, sucursal_id } = req.body ?? {};
  if (typeof accion !== 'string' || !PREFIJOS_EVENTO.some((p) => accion.startsWith(p)) || accion.length > 60) {
    return res.status(400).json({ error: 'Evento no permitido' });
  }
  // Máximo 120 eventos por minuto por usuario.
  const minuto = Math.floor(Date.now() / 60000);
  const clave = `${req.perfil.id}:${minuto}`;
  const cuenta = (eventosPorUsuario.get(clave) ?? 0) + 1;
  eventosPorUsuario.set(clave, cuenta);
  if (eventosPorUsuario.size > 5000) eventosPorUsuario.clear();
  if (cuenta > 120) return res.status(429).json({ error: 'Demasiados eventos' });

  await registrarAuditoria(req, {
    accion,
    entidad: accion.split('.')[0],
    sucursalId: sucursal_id || req.perfil.sucursal_id || null,
    detalle: limitarDetalle(detalle),
  });
  if (accion === 'sesion.inicio' || accion === 'pantalla.ver') alertaFueraDeHorario(req, accion);
  res.status(204).end();
});

// ── Estado del correo de alertas ────────────────────────────────────────
antifraude.get('/correo', requireRole('admin'), async (req, res) => {
  const configurado = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
  res.json({ configurado, destinatarios: configurado ? await destinatariosAdmins() : [] });
});

// ── Alertas ─────────────────────────────────────────────────────────────
// Estados: pendiente → investigando → resuelta / falso_positivo.
const ESTADOS_ALERTA = ['pendiente', 'investigando', 'resuelta', 'falso_positivo'];
const ABIERTAS = ['pendiente', 'investigando'];

antifraude.get('/alertas/pendientes', requireRole('admin'), async (req, res) => {
  const { count, error } = await db.from('alertas').select('id', { count: 'exact', head: true }).in('estado', ABIERTAS);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ pendientes: count ?? 0 });
});

// Para las notificaciones en vivo: alertas nuevas desde el último id visto.
antifraude.get('/alertas/nuevas', requireRole('admin'), async (req, res) => {
  const desdeId = Number(req.query.desde_id ?? 0);
  let q = db.from('alertas').select('id, titulo, severidad, tipo, created_at, sucursales(nombre)').order('id', { ascending: false }).limit(10);
  if (req.query.desde_id !== undefined && Number.isFinite(desdeId)) q = q.gt('id', desdeId);
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

antifraude.get('/alertas', requireRole('admin'), async (req, res) => {
  let q = db
    .from('alertas')
    .select('*, sucursales(nombre), revisor:revisada_por(nombre)')
    .order('revisada', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(300);
  if (req.query.solo_pendientes === '1') q = q.in('estado', ABIERTAS);
  if (req.query.estado && ESTADOS_ALERTA.includes(req.query.estado)) q = q.eq('estado', req.query.estado);
  if (req.query.sucursal_id) q = q.eq('sucursal_id', req.query.sucursal_id);
  q = filtrarRango(q, 'created_at', req.query.desde, req.query.hasta);
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

async function cambiarEstadoAlerta(req, res, estado) {
  if (!ESTADOS_ALERTA.includes(estado)) return res.status(400).json({ error: 'Estado inválido' });
  const nota = String(req.body?.nota ?? '').trim().slice(0, 500) || null;
  const cerrada = estado === 'resuelta' || estado === 'falso_positivo';
  const { data, error } = await db
    .from('alertas')
    .update({
      estado,
      revisada: cerrada,
      revisada_por: req.perfil.id,
      revisada_at: new Date().toISOString(),
      ...(nota ? { nota_revision: nota } : {}),
    })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  await registrarAuditoria(req, {
    accion: 'alerta.revisar',
    entidad: 'alerta',
    entidadId: data.id,
    sucursalId: data.sucursal_id,
    detalle: { titulo: data.titulo, estado, nota },
  });
  res.json(data);
}

antifraude.put('/alertas/:id/revisar', requireRole('admin'), (req, res) => cambiarEstadoAlerta(req, res, 'resuelta'));
antifraude.put('/alertas/:id/estado', requireRole('admin'), (req, res) => cambiarEstadoAlerta(req, res, req.body?.estado));

// ── Reglas y umbrales ───────────────────────────────────────────────────
// Lectura para cualquier usuario (la app necesita, p. ej., los minutos de
// bloqueo por inactividad); sólo el admin las cambia.
antifraude.get('/reglas', async (req, res) => {
  res.json(await obtenerReglas());
});

antifraude.put('/reglas', requireRole('admin'), async (req, res) => {
  try {
    const antes = await obtenerReglas();
    const reglas = await guardarReglas(req.body ?? {}, req.perfil.id);
    const cambios = Object.keys(reglas)
      .filter((k) => String(antes[k]) !== String(reglas[k]))
      .map((k) => `${k}: ${antes[k]} → ${reglas[k]}`);
    await registrarAuditoria(req, { accion: 'antifraude.reglas', entidad: 'sistema', detalle: { cambios: cambios.join(' · ') } });
    res.json(reglas);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ── Arqueo sorpresa ─────────────────────────────────────────────────────
// Conteo a mitad de turno SIN mostrar antes cuánto debería haber: se
// cuenta, se guarda y recién entonces el sistema dice si cuadra.
antifraude.post('/arqueos', requireRole('admin', 'manager'), async (req, res) => {
  try {
    const { sucursal_id, contado, nota } = req.body ?? {};
    if (!sucursal_id) return res.status(400).json({ error: 'Elige la sucursal' });
    const efectivoContado = Number(contado);
    if (!Number.isFinite(efectivoContado) || efectivoContado < 0) return res.status(400).json({ error: 'Monto contado inválido' });

    const { data: ultimo } = await db
      .from('cierres_caja')
      .select('fecha_fin, fondo_caja')
      .eq('sucursal_id', sucursal_id)
      .order('fecha_fin', { ascending: false })
      .limit(1)
      .maybeSingle();
    const desde = ultimo?.fecha_fin ?? inicioDelDia(hoyHn());
    const fondo = req.body.fondo_caja !== undefined && req.body.fondo_caja !== '' ? Number(req.body.fondo_caja) : Number(ultimo?.fondo_caja ?? 0);
    const ventas = await ventasDelTurno(sucursal_id, desde, new Date().toISOString());
    const sistema = totalesPorForma(ventas);
    const { data: gastos } = await db.from('caja_chica').select('monto').eq('sucursal_id', sucursal_id).eq('fecha', hoyHn());
    const salidas = round2((gastos ?? []).reduce((s, g) => s + Number(g.monto), 0));
    const esperado = round2(fondo + sistema.efectivo - salidas);
    const diferencia = round2(efectivoContado - esperado);
    const idsCajeros = [...new Set(ventas.map((v) => v.cajero_id).filter(Boolean))];
    const { data: cajeros } = idsCajeros.length ? await db.from('perfiles').select('nombre').in('id', idsCajeros) : { data: [] };
    const cajerosTurno = (cajeros ?? []).map((c) => c.nombre).join(', ');

    const { data, error } = await db
      .from('arqueos')
      .insert({
        sucursal_id,
        usuario_id: req.perfil.id,
        desde,
        fondo_caja: fondo,
        efectivo_sistema: sistema.efectivo,
        salidas,
        esperado,
        contado: efectivoContado,
        diferencia,
        cajeros_turno: cajerosTurno || null,
        nota: String(nota ?? '').trim().slice(0, 300) || null,
      })
      .select('*, sucursales(nombre)')
      .single();
    if (error) throw new Error(error.message);

    await registrarAuditoria(req, {
      accion: 'arqueo.sorpresa',
      entidad: 'arqueo',
      entidadId: data.id,
      sucursalId: sucursal_id,
      detalle: { esperado, contado: efectivoContado, diferencia, cajeros: cajerosTurno },
    });
    if (Math.abs(diferencia) >= 1) {
      await crearAlerta(req, {
        tipo: 'arqueo.descuadre',
        severidad: diferencia <= -1 ? 'alta' : 'media',
        titulo: `Arqueo sorpresa en ${data.sucursales?.nombre ?? 'sucursal'}: ${diferencia < 0 ? 'faltan' : 'sobran'} L ${Math.abs(diferencia).toFixed(2)}`,
        sucursalId: sucursal_id,
        entidad: 'arqueo',
        entidadId: data.id,
        correo: diferencia <= -1,
        detalle: { esperado, contado: efectivoContado, diferencia, cajeros_en_turno: cajerosTurno, conto: req.perfil.nombre },
      });
    }
    res.status(201).json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

antifraude.get('/arqueos', requireRole('admin', 'manager'), async (req, res) => {
  const { data, error } = await db
    .from('arqueos')
    .select('*, sucursales(nombre), usuario:usuario_id(nombre)')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── Línea de tiempo de un usuario en un día (reconstrucción del turno) ──
antifraude.get('/usuarios', requireRole('admin'), async (req, res) => {
  const { data, error } = await db.from('perfiles').select('id, nombre, rol, sucursal_id').order('nombre');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

antifraude.get('/linea-tiempo', requireRole('admin'), async (req, res) => {
  try {
    const { usuario_id, fecha } = req.query;
    if (!usuario_id || !fecha) return res.status(400).json({ error: 'Elige el usuario y el día' });
    const [eventos, ventas] = await Promise.all([
      traerTodo(() =>
        filtrarRango(db.from('auditoria').select('id, created_at, accion, detalle, entidad_id, ip, sucursales(nombre)').eq('usuario_id', usuario_id), 'created_at', fecha, fecha).order('id')
      ),
      traerTodo(() =>
        filtrarRango(
          db.from('ventas').select('id, numero_factura, total, anulada, impresiones, reimpresiones, fecha_emision, tercera_edad_identidad, venta_pagos(monto, formas_pago(nombre))').eq('cajero_id', usuario_id).eq('estado', 'pagada'),
          'fecha_emision',
          fecha,
          fecha
        ).order('fecha_emision').order('id')
      ),
    ]);
    const facturadas = new Set(eventos.filter((e) => e.accion === 'venta.facturar').map((e) => e.entidad_id));
    const items = [
      ...eventos.map((e) => ({ tipo: 'evento', momento: e.created_at, accion: e.accion, detalle: e.detalle, sucursal: e.sucursales?.nombre ?? '', ip: e.ip })),
      // Facturas cuyo evento no quedó en la bitácora (versiones viejas).
      ...ventas
        .filter((v) => !facturadas.has(v.id))
        .map((v) => ({ tipo: 'factura', momento: v.fecha_emision, accion: 'venta.facturar', detalle: { numero_factura: v.numero_factura, total: Number(v.total) } })),
    ].sort((a, b) => a.momento.localeCompare(b.momento));
    const resumen = {
      facturas: ventas.filter((v) => !v.anulada).length,
      total: round2(ventas.filter((v) => !v.anulada).reduce((s, v) => s + Number(v.total), 0)),
      sin_imprimir: ventas.filter((v) => !v.anulada && Number(v.impresiones ?? 0) === 0).length,
      reimpresiones: ventas.reduce((s, v) => s + Number(v.reimpresiones ?? 0), 0),
      tercera_edad: ventas.filter((v) => v.tercera_edad_identidad).length,
      primer_movimiento: items[0]?.momento ?? null,
      ultimo_movimiento: items[items.length - 1]?.momento ?? null,
    };
    res.json({ resumen, items });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ── Tendencia de riesgo: últimas 4 semanas por cajero ───────────────────
const TIPOS_RIESGO = new Set([
  'cierre.descuadre',
  'cierre.patron_desvio',
  'cierre.reincidencia',
  'cierre.sin_imprimir',
  'venta.descartar_orden',
  'venta.reimpresion_repetida',
  'venta.doble_factura',
  'tercera_edad.carne_repetido',
  'tercera_edad.exceso',
  'acceso.denegado',
  'arqueo.descuadre',
  'orden.estacionada',
  'sesion.simultanea',
]);

antifraude.get('/tendencia', requireRole('admin'), async (req, res) => {
  const desde = new Date(Date.now() - 28 * 86400000).toISOString();
  const alertas = await traerTodo(() => db.from('alertas').select('id, tipo, created_at, usuario_id, usuario_nombre, estado').gte('created_at', desde).order('id'));
  const porUsuario = new Map();
  for (const a of alertas) {
    if (!TIPOS_RIESGO.has(a.tipo) || !a.usuario_id || a.estado === 'falso_positivo') continue;
    const semana = Math.min(3, Math.floor((Date.now() - new Date(a.created_at).getTime()) / (7 * 86400000)));
    const fila = porUsuario.get(a.usuario_id) ?? { usuario_id: a.usuario_id, nombre: a.usuario_nombre ?? '', semanas: [0, 0, 0, 0], total: 0 };
    fila.semanas[3 - semana] += 1;
    fila.total += 1;
    porUsuario.set(a.usuario_id, fila);
  }
  res.json([...porUsuario.values()].sort((a, b) => b.total - a.total));
});

// ── Indicadores por cajero y huecos sin facturar ────────────────────────
const ACCIONES_RIESGO = [
  'venta.descartar_orden',
  'venta.editar_orden',
  'orden.quitar_producto',
  'venta.imprimir_ticket',
  'venta.reimprimir_ticket',
  'acceso.denegado',
  'sesion.inicio',
  'pantalla.ver',
];

const HUECO_MINUTOS = 45;
const HORA_ABRE = 11;
const HORA_CIERRA = 21;

function minutosHn(iso) {
  const d = new Date(iso);
  return horaHn(iso) * 60 + d.getUTCMinutes();
}

antifraude.get('/indicadores', requireRole('admin'), async (req, res) => {
  try {
    const { desde, hasta, sucursal_id } = req.query;
    if (!desde || !hasta) return res.status(400).json({ error: 'Elige el rango de fechas' });
    const reglas = await obtenerReglas();

    const [ventas, eventos, cierres, perfiles] = await Promise.all([
      traerTodo(() => {
        let q = db
          .from('ventas')
          .select('id, cajero_id, sucursal_id, numero_factura, total, anulada, descuento, cambio, fecha_emision, venta_pagos(monto, formas_pago(nombre)), detalle_venta(descuento, descuento_porcentaje)')
          .eq('estado', 'pagada');
        if (sucursal_id) q = q.eq('sucursal_id', sucursal_id);
        return filtrarRango(q, 'fecha_emision', desde, hasta).order('fecha_emision').order('id');
      }),
      traerTodo(() => {
        let q = db.from('auditoria').select('id, created_at, usuario_id, usuario_nombre, accion, entidad_id, sucursal_id, detalle').in('accion', ACCIONES_RIESGO);
        if (sucursal_id) q = q.eq('sucursal_id', sucursal_id);
        return filtrarRango(q, 'created_at', desde, hasta).order('id');
      }),
      traerTodo(() => {
        let q = db.from('cierres_caja').select('id, cajero_id, sucursal_id, diferencia_efectivo, diferencia_tarjeta, fecha_fin');
        if (sucursal_id) q = q.eq('sucursal_id', sucursal_id);
        return filtrarRango(q, 'fecha_fin', desde, hasta).order('id');
      }),
      db.from('perfiles').select('id, nombre, rol, sin_horario').then((r) => r.data ?? []),
    ]);

    const nombreDe = new Map(perfiles.map((p) => [p.id, p.nombre]));
    const porCajero = new Map();
    const fila = (id) => {
      if (!porCajero.has(id)) {
        porCajero.set(id, {
          cajero_id: id,
          nombre: nombreDe.get(id) ?? 'Desconocido',
          facturas: 0,
          total: 0,
          efectivo: 0,
          con_descuento: 0,
          desc_25: 0,
          desc_10: 0,
          monto_descuentos: 0,
          anuladas: 0,
          monto_anulado: 0,
          descartadas: 0,
          monto_descartado: 0,
          quitados: 0,
          monto_quitado: 0,
          reimpresiones: 0,
          no_impresas: 0,
          faltantes: 0,
          monto_faltante: 0,
          accesos_denegados: 0,
          fuera_horario: 0,
          pantallas: 0,
        });
      }
      return porCajero.get(id);
    };

    const impresas = new Set(eventos.filter((e) => e.accion === 'venta.imprimir_ticket' || e.accion === 'venta.reimprimir_ticket').map((e) => e.entidad_id));

    for (const v of ventas) {
      const f = fila(v.cajero_id);
      if (v.anulada) {
        f.anuladas += 1;
        f.monto_anulado += Number(v.total);
        continue;
      }
      f.facturas += 1;
      f.total += Number(v.total);
      let ef = 0;
      for (const p of v.venta_pagos ?? []) if (p.formas_pago?.nombre === 'Efectivo') ef += Number(p.monto);
      f.efectivo += ef > 0 ? ef - Number(v.cambio ?? 0) : 0;
      const lineasDesc = (v.detalle_venta ?? []).filter((d) => Number(d.descuento) > 0);
      if (lineasDesc.length > 0) f.con_descuento += 1;
      f.desc_25 += lineasDesc.filter((d) => Number(d.descuento_porcentaje) === 25).length;
      f.desc_10 += lineasDesc.filter((d) => Number(d.descuento_porcentaje) === 10).length;
      f.monto_descuentos += Number(v.descuento ?? 0);
      if (!impresas.has(v.id)) f.no_impresas += 1;
    }

    const recientes = [];
    for (const e of eventos) {
      if (!e.usuario_id) continue;
      const f = fila(e.usuario_id);
      const d = e.detalle ?? {};
      if (e.accion === 'venta.descartar_orden') {
        f.descartadas += 1;
        f.monto_descartado += Number(d.total ?? 0);
      } else if (e.accion === 'orden.quitar_producto') {
        f.quitados += Number(d.cantidad ?? 1);
        f.monto_quitado += Number(d.monto ?? 0);
      } else if (e.accion === 'venta.reimprimir_ticket') {
        f.reimpresiones += 1;
      } else if (e.accion === 'acceso.denegado') {
        f.accesos_denegados += 1;
      } else if (e.accion === 'pantalla.ver') {
        f.pantallas += 1;
      }
      if ((e.accion === 'sesion.inicio' || e.accion === 'pantalla.ver') && (horaHn(e.created_at) < reglas.hora_apertura || horaHn(e.created_at) >= reglas.hora_cierre)) {
        f.fuera_horario += 1;
      }
      if (['venta.descartar_orden', 'orden.quitar_producto', 'venta.reimprimir_ticket', 'acceso.denegado'].includes(e.accion)) {
        recientes.push(e);
      }
    }

    for (const c of cierres) {
      if (Number(c.diferencia_efectivo) <= -1) {
        const f = fila(c.cajero_id);
        f.faltantes += 1;
        f.monto_faltante += Math.abs(Number(c.diferencia_efectivo));
      }
    }

    // Señales: comparan a cada cajero contra el promedio del grupo, para no
    // marcar a todos en un día de muchos descuentos legítimos.
    const filas = [...porCajero.values()].filter((f) => f.facturas + f.anuladas + f.descartadas + f.quitados + f.accesos_denegados + f.pantallas > 0);
    const conVentas = filas.filter((f) => f.facturas > 0);
    const promedio = (fn) => (conVentas.length ? conVentas.reduce((s, f) => s + fn(f), 0) / conVentas.length : 0);
    const promDesc = promedio((f) => f.con_descuento / f.facturas);
    const promAnul = promedio((f) => f.anuladas / (f.facturas || 1));

    for (const f of filas) {
      const s = [];
      const pctDesc = f.facturas ? f.con_descuento / f.facturas : 0;
      if (f.facturas >= 10 && pctDesc > Math.max(0.15, promDesc * 2)) s.push({ nivel: 'alta', texto: `${Math.round(pctDesc * 100)}% de sus facturas llevan descuento` });
      if (f.anuladas >= 2 && f.anuladas / (f.facturas || 1) > promAnul * 1.5) s.push({ nivel: 'alta', texto: `${f.anuladas} facturas anuladas` });
      if (f.descartadas >= 5 || f.monto_descartado > Math.max(500, f.total * 0.03)) s.push({ nivel: 'media', texto: `${f.descartadas} órdenes descartadas (L ${round2(f.monto_descartado)})` });
      if (f.quitados >= 8 || f.monto_quitado > Math.max(400, f.total * 0.02)) s.push({ nivel: 'media', texto: `${f.quitados} productos quitados de órdenes (L ${round2(f.monto_quitado)})` });
      if (f.no_impresas >= 3 && f.no_impresas > f.facturas * 0.03) s.push({ nivel: 'alta', texto: `${f.no_impresas} facturas nunca se imprimieron (¿el cliente recibió factura?)` });
      if (f.reimpresiones >= 3) s.push({ nivel: 'media', texto: `${f.reimpresiones} reimpresiones de facturas` });
      if (f.faltantes >= 1) s.push({ nivel: 'alta', texto: `${f.faltantes} cierre(s) con faltante (L ${round2(f.monto_faltante)})` });
      if (f.accesos_denegados >= 1) s.push({ nivel: 'media', texto: `${f.accesos_denegados} intento(s) de entrar a funciones sin permiso` });
      if (f.fuera_horario >= 1) s.push({ nivel: 'baja', texto: `${f.fuera_horario} uso(s) del sistema fuera de horario` });
      f.senales = s;
      f.riesgo = s.reduce((acc, x) => acc + (x.nivel === 'alta' ? 3 : x.nivel === 'media' ? 2 : 1), 0);
      for (const k of Object.keys(f)) if (typeof f[k] === 'number' && !Number.isInteger(f[k])) f[k] = round2(f[k]);
      f.ticket_promedio = f.facturas ? round2(f.total / f.facturas) : 0;
      f.pct_efectivo = f.total ? Math.round((f.efectivo / f.total) * 100) : 0;
      f.pct_descuento = Math.round(pctDesc * 100);
    }
    filas.sort((a, b) => b.riesgo - a.riesgo || b.total - a.total);

    // Huecos: más de 45 min sin facturar con la tienda abierta. Puede ser
    // un rato flojo… o ventas que no se están facturando.
    const porSucursalDia = new Map();
    for (const v of ventas) {
      const clave = `${v.sucursal_id}|${fechaHn(v.fecha_emision)}`;
      if (!porSucursalDia.has(clave)) porSucursalDia.set(clave, []);
      porSucursalDia.get(clave).push(v.fecha_emision);
    }
    const { data: sucursales } = await db.from('sucursales').select('id, nombre');
    const nombreSucursal = new Map((sucursales ?? []).map((s) => [s.id, s.nombre]));
    const huecos = [];
    for (const [clave, fechas] of porSucursalDia) {
      if (fechas.length < 5) continue;
      const [sid, dia] = clave.split('|');
      const mins = fechas.map(minutosHn).sort((a, b) => a - b);
      const puntos = [HORA_ABRE * 60, ...mins.filter((m) => m >= HORA_ABRE * 60 && m <= HORA_CIERRA * 60), HORA_CIERRA * 60];
      for (let i = 1; i < puntos.length; i++) {
        const gap = puntos[i] - puntos[i - 1];
        if (gap >= reglas.minutos_hueco) {
          const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
          huecos.push({ sucursal: nombreSucursal.get(sid) ?? '', fecha: dia, desde: hhmm(puntos[i - 1]), hasta: hhmm(puntos[i]), minutos: gap, facturas_dia: fechas.length });
        }
      }
    }
    huecos.sort((a, b) => b.minutos - a.minutos);

    res.json({
      cajeros: filas,
      huecos: huecos.slice(0, 60),
      recientes: recientes.sort((a, b) => b.id - a.id).slice(0, 100),
      totales: { facturas: ventas.filter((v) => !v.anulada).length, eventos: eventos.length },
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
```

### `backend/routes/auditoria.js`

```js
import { Router } from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/requireRole.js';
import { filtrarRango } from '../lib/fechas.js';

export const auditoria = Router();

// Sólo lectura: la tabla no admite UPDATE/DELETE (ver migración 0007), y
// este router no expone ninguna forma de escribir en ella.
auditoria.get('/', requireRole('admin'), async (req, res) => {
  const { accion, usuario_id, sucursal_id, entidad_id, desde, hasta } = req.query;
  let query = db
    .from('auditoria')
    .select('id, created_at, usuario_id, usuario_nombre, accion, entidad, entidad_id, sucursal_id, detalle, ip, hash, sucursales(nombre)')
    .order('id', { ascending: false })
    .limit(300);
  if (accion) query = query.like('accion', `${accion}%`);
  if (usuario_id) query = query.eq('usuario_id', usuario_id);
  if (sucursal_id) query = query.eq('sucursal_id', sucursal_id);
  if (entidad_id) query = query.eq('entidad_id', entidad_id);
  query = filtrarRango(query, 'created_at', desde, hasta); // días en hora de Honduras
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Recalcula la cadena de hashes completa: si alguien hubiera alterado o
// borrado un registro directo en la base de datos, lo señala.
auditoria.get('/verificar', requireRole('admin'), async (req, res) => {
  const { data, error } = await db.rpc('verificar_auditoria');
  if (error) return res.status(500).json({ error: error.message });
  const r = Array.isArray(data) ? data[0] : data;
  res.json({ integra: r.integra, total: Number(r.total), primer_id_alterado: r.primer_id_alterado });
});
```

### `backend/routes/cajaChica.js`

```js
import { Router } from 'express';
import { db } from '../db.js';
import { hoyHn } from '../lib/fechas.js';

export const cajaChica = Router();

cajaChica.get('/', async (req, res) => {
  const { sucursal_id, fechaInicio, fechaFin } = req.query;
  let query = db.from('caja_chica').select('*, perfiles(nombre)').order('fecha', { ascending: false });
  if (sucursal_id) query = query.eq('sucursal_id', sucursal_id);
  if (fechaInicio) query = query.gte('fecha', fechaInicio);
  if (fechaFin) query = query.lte('fecha', fechaFin);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

cajaChica.post('/', async (req, res) => {
  const { sucursal_id, tipo, monto, concepto, fecha } = req.body;
  if (!sucursal_id || !tipo || monto === undefined) {
    return res.status(400).json({ error: 'sucursal_id, tipo y monto son obligatorios' });
  }
  if (!Number.isFinite(Number(monto)) || Number(monto) <= 0) {
    return res.status(400).json({ error: 'El monto debe ser mayor que 0' });
  }
  if (fecha && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return res.status(400).json({ error: 'Fecha inválida' });
  const { data, error } = await db
    .from('caja_chica')
    .insert({ sucursal_id, tipo, monto: Number(monto), concepto, fecha: fecha || hoyHn(), usuario_id: req.perfil.id })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});
```

### `backend/routes/categorias.js`

```js
import { Router } from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/requireRole.js';

export const categorias = Router();

categorias.get('/', async (req, res) => {
  const { data, error } = await db.from('categorias').select('*').order('orden');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

categorias.post('/', requireRole('admin', 'manager'), async (req, res) => {
  const { nombre, orden } = req.body;
  if (!nombre) return res.status(400).json({ error: 'nombre es obligatorio' });
  const { data, error } = await db
    .from('categorias')
    .insert({ nombre, orden: orden ?? 0 })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

categorias.put('/:id', requireRole('admin', 'manager'), async (req, res) => {
  const { nombre, orden, activo } = req.body;
  const { data, error } = await db
    .from('categorias')
    .update({ nombre, orden, activo })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
```

### `backend/routes/cierres.js`

```js
import { Router } from 'express';
import { db } from '../db.js';
import { round2 } from '../lib/facturacion.js';
import { calcularCuadre, desgloseTurno, totalesPorForma } from '../lib/cierre.js';
import { enviarResumenCierre } from '../lib/correo.js';
import { registrarAuditoria } from '../lib/auditoria.js';
import { crearAlerta } from '../lib/alertas.js';
import { obtenerReglas } from '../lib/reglas.js';
import { requireRole } from '../middleware/requireRole.js';
import { anchoValido, envolverTicketHtml, formatearCierre } from '../lib/ticket.js';

export const cierres = Router();

const ZONA = 'America/Tegucigalpa';
const CAMPOS_SISTEMA = [
  'efectivo_sistema',
  'tarjeta_sistema',
  'transferencia_sistema',
  'total_esperado',
  'diferencia',
  'diferencia_tarjeta',
  'diferencia_efectivo',
  'total_ventas',
  'desglose_pagos',
];
const SELECT_CIERRE = '*, sucursales(nombre, alias), cajero:cajero_id(nombre), elaboro:elaboro_id(nombre)';

// Cierre ciego: el cajero cuenta sin ver cuánto "debería" haber, para que
// no ajuste el conteo al número del sistema. El servidor ni siquiera le
// manda esas cifras (no basta con esconderlas en pantalla).
function esCiego(perfil) {
  return perfil.cierre_ciego && perfil.rol === 'cajero';
}

function sinSistema(cierre) {
  const copia = { ...cierre };
  for (const campo of CAMPOS_SISTEMA) delete copia[campo];
  return copia;
}

// Un cajero con sucursal fija sólo puede cerrar la suya.
function sucursalPermitida(perfil, sucursalId) {
  return !(perfil.rol === 'cajero' && perfil.sucursal_id && perfil.sucursal_id !== sucursalId);
}

function fechaLocal(iso) {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: ZONA }); // YYYY-MM-DD
}

// Supabase devuelve máximo 1000 filas por consulta: un día de mucho
// movimiento puede pasarse, así que se pide por páginas.
export async function ventasDelTurno(sucursal_id, desde, hasta) {
  const todas = [];
  for (let desdeFila = 0; ; desdeFila += 1000) {
    const { data, error } = await db
      .from('ventas')
      .select('id, total, numero_factura, correlativo, anulada, cambio, descuento, impresiones, cajero_id, venta_pagos(monto, formas_pago(nombre)), detalle_venta(descuento, descuento_porcentaje)')
      .eq('sucursal_id', sucursal_id)
      .eq('estado', 'pagada')
      .gte('fecha_emision', desde)
      .lte('fecha_emision', hasta)
      .order('correlativo', { ascending: true })
      .range(desdeFila, desdeFila + 999);
    if (error) throw new Error(error.message);
    todas.push(...data);
    if (data.length < 1000) return todas;
  }
}

async function resumenTurno(sucursal_id, desde, hasta) {
  const ventas = await ventasDelTurno(sucursal_id, desde, hasta);
  const t = totalesPorForma(ventas);

  // Salidas sugeridas: lo registrado en caja chica esos días (editable).
  const { data: gastos } = await db
    .from('caja_chica')
    .select('monto')
    .eq('sucursal_id', sucursal_id)
    .gte('fecha', fechaLocal(desde))
    .lte('fecha', fechaLocal(hasta));

  return {
    ...t,
    cantidad_facturas: ventas.length,
    factura_desde: ventas[0]?.numero_factura ?? null,
    factura_hasta: ventas[ventas.length - 1]?.numero_factura ?? null,
    salidas_sugeridas: round2((gastos ?? []).reduce((s, g) => s + Number(g.monto), 0)),
  };
}

// Patrones sospechosos que un solo cierre no muestra a simple vista:
//  - Desvío tarjeta→efectivo: el cliente paga en efectivo pero se registra
//    como tarjeta; el POS da de menos y la gaveta de más (sobrante que se
//    lo lleva quien cierra).
//  - Reincidencia: el mismo cajero con faltantes en varios cierres recientes.
//  - Facturas del turno que nunca se imprimieron (¿el cliente recibió factura?).
async function patronesDeCierre(req, cierre, cuadre, sucursalId, desde, hasta) {
  const reglas = await obtenerReglas();
  const nombre = cierre.sucursales?.nombre ?? 'sucursal';

  if (cuadre.diferencia_efectivo >= 1 && cuadre.diferencia_tarjeta <= -1) {
    await crearAlerta(req, {
      tipo: 'cierre.patron_desvio',
      severidad: 'alta',
      titulo: `Patrón de desvío en ${nombre}: sobra efectivo (L ${cuadre.diferencia_efectivo.toFixed(2)}) y falta tarjeta (L ${Math.abs(cuadre.diferencia_tarjeta).toFixed(2)})`,
      sucursalId,
      entidad: 'cierre',
      entidadId: cierre.id,
      correo: true,
      detalle: {
        cajero: req.perfil.nombre,
        sobrante_efectivo: cuadre.diferencia_efectivo,
        faltante_tarjeta: cuadre.diferencia_tarjeta,
        explicacion: 'Ventas cobradas en efectivo pero registradas como tarjeta',
      },
    });
  }

  if (cuadre.diferencia_efectivo <= -1) {
    const hace7 = new Date(Date.now() - 7 * 86400000).toISOString();
    const { data: previos } = await db
      .from('cierres_caja')
      .select('id, diferencia_efectivo')
      .eq('cajero_id', req.perfil.id)
      .lte('diferencia_efectivo', -1)
      .gte('fecha_fin', hace7);
    const cantidad = previos?.length ?? 0;
    if (cantidad >= reglas.faltantes_reincidencia) {
      const total = (previos ?? []).reduce((s, c) => s + Math.abs(Number(c.diferencia_efectivo)), 0);
      await crearAlerta(req, {
        tipo: 'cierre.reincidencia',
        severidad: 'alta',
        titulo: `${req.perfil.nombre} acumula ${cantidad} cierres con faltante en 7 días (L ${total.toFixed(2)})`,
        sucursalId,
        entidad: 'cierre',
        entidadId: cierre.id,
        correo: true,
        detalle: { cajero: req.perfil.nombre, cierres_con_faltante: cantidad, monto_total: round2(total) },
      });
    }
  }

  const ventas = await ventasDelTurno(sucursalId, desde, hasta);
  const sinImprimir = ventas.filter((v) => !v.anulada && Number(v.impresiones ?? 0) === 0);
  if (sinImprimir.length > 0) {
    await crearAlerta(req, {
      tipo: 'cierre.sin_imprimir',
      severidad: sinImprimir.length >= 3 ? 'alta' : 'media',
      titulo: `${sinImprimir.length} factura(s) del turno en ${nombre} nunca se imprimieron`,
      sucursalId,
      entidad: 'cierre',
      entidadId: cierre.id,
      detalle: {
        cajero: req.perfil.nombre,
        facturas: sinImprimir.slice(0, 15).map((v) => v.numero_factura).join(', '),
        monto: round2(sinImprimir.reduce((s, v) => s + Number(v.total), 0)),
      },
    });
  }
}

function validarRango(desde, hasta) {
  if (!desde || !hasta) return 'Faltan las fechas del turno';
  const a = new Date(desde);
  const b = new Date(hasta);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 'Fechas del turno inválidas';
  if (b <= a) return 'La hora de cierre debe ser posterior a la de apertura';
  if (b.getTime() > Date.now() + 5 * 60 * 1000) return 'La hora de cierre no puede estar en el futuro';
  return null;
}

// Último cierre de la sucursal: de ahí arranca el turno siguiente y se
// sugiere el mismo fondo de caja.
cierres.get('/ultimo', async (req, res) => {
  const { sucursal_id } = req.query;
  if (!sucursal_id) return res.status(400).json({ error: 'Falta la sucursal' });
  const { data, error } = await db
    .from('cierres_caja')
    .select('fecha_fin, fondo_caja')
    .eq('sucursal_id', sucursal_id)
    .order('fecha_fin', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data ?? null);
});

cierres.get('/resumen', async (req, res) => {
  try {
    const { sucursal_id, desde, hasta } = req.query;
    if (!sucursal_id) return res.status(400).json({ error: 'Falta la sucursal' });
    if (!sucursalPermitida(req.perfil, sucursal_id)) return res.status(403).json({ error: 'No puedes cerrar otra sucursal' });
    const problema = validarRango(desde, hasta);
    if (problema) return res.status(400).json({ error: problema });

    const resumen = await resumenTurno(sucursal_id, desde, hasta);
    if (esCiego(req.perfil)) {
      return res.json({
        ciego: true,
        cantidad_facturas: resumen.cantidad_facturas,
        factura_desde: resumen.factura_desde,
        factura_hasta: resumen.factura_hasta,
        salidas_sugeridas: resumen.salidas_sugeridas,
      });
    }
    res.json({ ciego: false, ...resumen });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

cierres.post('/', async (req, res) => {
  try {
    const { sucursal_id, fecha_inicio, fecha_fin, observaciones } = req.body;
    if (!sucursal_id) return res.status(400).json({ error: 'Falta la sucursal' });
    if (!sucursalPermitida(req.perfil, sucursal_id)) return res.status(403).json({ error: 'No puedes cerrar otra sucursal' });
    const problema = validarRango(fecha_inicio, fecha_fin);
    if (problema) return res.status(400).json({ error: problema });

    for (const campo of ['pos_bac', 'pos_ficohsa', 'efectivo_contado', 'fondo_caja', 'salidas']) {
      const v = req.body[campo];
      if (v === undefined || v === null || v === '') {
        if (['pos_bac', 'pos_ficohsa', 'efectivo_contado'].includes(campo)) {
          return res.status(400).json({ error: 'Llena POS BAC, POS Ficohsa y el efectivo contado (usa 0 si no hubo)' });
        }
        continue;
      }
      if (!Number.isFinite(Number(v)) || Number(v) < 0) return res.status(400).json({ error: `Monto inválido en ${campo}` });
    }

    // Evita cerrar dos veces el mismo turno (o turnos que se traslapan) en la
    // misma sucursal — eso duplicaría las facturas contadas en el total.
    const { data: solapados, error: errSolape } = await db
      .from('cierres_caja')
      .select('id, fecha_inicio, fecha_fin')
      .eq('sucursal_id', sucursal_id)
      .lt('fecha_inicio', fecha_fin)
      .gt('fecha_fin', fecha_inicio);
    if (errSolape) throw new Error(errSolape.message);
    if (solapados.length > 0) {
      const c = solapados[0];
      const fmt = (f) => new Date(f).toLocaleString('es-HN', { timeZone: ZONA });
      return res.status(409).json({
        error: `Ya existe un cierre en ese rango (del ${fmt(c.fecha_inicio)} al ${fmt(c.fecha_fin)}). Ajusta las fechas para no contar las mismas facturas dos veces.`,
      });
    }

    // El sistema se recalcula acá, nunca se toma lo que mande la pantalla.
    const sistema = await resumenTurno(sucursal_id, fecha_inicio, fecha_fin);
    const cuadre = calcularCuadre(sistema, req.body);

    const noCuadra = Math.abs(cuadre.diferencia_tarjeta) >= 1 || Math.abs(cuadre.diferencia_efectivo) >= 1;
    if (noCuadra && !esCiego(req.perfil) && !String(observaciones ?? '').trim()) {
      return res.status(400).json({ error: 'El cierre no cuadra: escribe en Observaciones qué pasó con la diferencia' });
    }

    const { data: cierre, error: errInsert } = await db
      .from('cierres_caja')
      .insert({
        sucursal_id,
        cajero_id: req.perfil.id,
        elaboro_id: req.perfil.id,
        fecha_inicio,
        fecha_fin,
        efectivo_contado: cuadre.efectivo_contado,
        fondo_caja: cuadre.fondo_caja,
        salidas: cuadre.salidas,
        factura_desde: sistema.factura_desde,
        factura_hasta: sistema.factura_hasta,
        cantidad_facturas: sistema.cantidad_facturas,
        total_ventas: sistema.total_ventas,
        efectivo_sistema: sistema.efectivo,
        tarjeta_sistema: sistema.tarjeta,
        transferencia_sistema: sistema.transferencia,
        pos_bac: cuadre.pos_bac,
        pos_ficohsa: cuadre.pos_ficohsa,
        diferencia_tarjeta: cuadre.diferencia_tarjeta,
        diferencia_efectivo: cuadre.diferencia_efectivo,
        total_esperado: cuadre.efectivo_esperado,
        total_contado: cuadre.efectivo_contado,
        diferencia: cuadre.diferencia_total,
        desglose_pagos: [
          { nombre: 'Efectivo', monto: sistema.efectivo },
          { nombre: 'Tarjeta', monto: sistema.tarjeta },
          { nombre: 'Transferencia', monto: sistema.transferencia },
        ],
        observaciones: String(observaciones ?? '').trim() || null,
        cierre_ciego: req.perfil.cierre_ciego,
        estado: 'cerrado',
      })
      .select(SELECT_CIERRE)
      .single();
    if (errInsert) throw new Error(errInsert.message);

    await registrarAuditoria(req, {
      accion: 'cierre.crear',
      entidad: 'cierre',
      entidadId: cierre.id,
      sucursalId: sucursal_id,
      detalle: {
        factura_desde: sistema.factura_desde,
        factura_hasta: sistema.factura_hasta,
        total_esperado: cuadre.efectivo_esperado,
        total_contado: cuadre.efectivo_contado,
        diferencia: cuadre.diferencia_total,
        diferencia_tarjeta: cuadre.diferencia_tarjeta,
        diferencia_efectivo: cuadre.diferencia_efectivo,
        pos_bac: cuadre.pos_bac,
        pos_ficohsa: cuadre.pos_ficohsa,
      },
    });
    // Descuadre (L 1 o más en tarjeta o efectivo): alerta en Antifraude y
    // correo inmediato a todos los administradores.
    let alertaDescuadre = false;
    if (noCuadra) {
      const d = cuadre.diferencia_total;
      const tipoDif = (x) => (x < 0 ? `faltante L ${Math.abs(x).toFixed(2)}` : `sobrante L ${x.toFixed(2)}`);
      const partes = [];
      if (Math.abs(cuadre.diferencia_tarjeta) >= 1) partes.push(`tarjeta ${tipoDif(cuadre.diferencia_tarjeta)}`);
      if (Math.abs(cuadre.diferencia_efectivo) >= 1) partes.push(`efectivo ${tipoDif(cuadre.diferencia_efectivo)}`);
      alertaDescuadre = Boolean(
        await crearAlerta(req, {
          tipo: 'cierre.descuadre',
          severidad: Math.abs(d) >= 100 || Math.abs(cuadre.diferencia_efectivo) >= 100 ? 'alta' : 'media',
          titulo: `Descuadre en cierre de ${cierre.sucursales?.nombre ?? 'sucursal'}: ${partes.join(', ')}`,
          sucursalId: sucursal_id,
          entidad: 'cierre',
          entidadId: cierre.id,
          correo: true,
          detalle: {
            cajero: req.perfil.nombre,
            desde: new Date(fecha_inicio).toLocaleString('es-HN', { timeZone: ZONA }),
            hasta: new Date(fecha_fin).toLocaleString('es-HN', { timeZone: ZONA }),
            tarjeta_sistema: sistema.tarjeta,
            pos_bac: cuadre.pos_bac,
            pos_ficohsa: cuadre.pos_ficohsa,
            diferencia_tarjeta: cuadre.diferencia_tarjeta,
            efectivo_esperado: cuadre.efectivo_esperado,
            efectivo_contado: cuadre.efectivo_contado,
            diferencia_efectivo: cuadre.diferencia_efectivo,
            transferencias: sistema.transferencia,
            diferencia_total: d,
            observaciones: String(observaciones ?? '').trim() || '(sin observaciones)',
          },
        })
      );
    }
    await patronesDeCierre(req, cierre, cuadre, sucursal_id, fecha_inicio, fecha_fin).catch((e) =>
      console.error('[cierre] patrones', e.message)
    );
    // No bloquea el cierre si el correo falla o no está configurado.
    enviarResumenCierre(cierre, cierre.sucursales?.nombre ?? '').catch(() => {});

    const respuesta = esCiego(req.perfil) ? sinSistema(cierre) : cierre;
    res.status(201).json({ ...respuesta, descuadre: Boolean(noCuadra), alerta_enviada: alertaDescuadre });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

cierres.get('/', requireRole('admin', 'manager'), async (req, res) => {
  const { sucursal_id, fechaInicio, fechaFin } = req.query;
  let query = db.from('cierres_caja').select(SELECT_CIERRE).order('fecha_fin', { ascending: false }).limit(200);
  if (sucursal_id) query = query.eq('sucursal_id', sucursal_id);
  if (fechaInicio) query = query.gte('fecha_inicio', fechaInicio);
  if (fechaFin) query = query.lte('fecha_fin', fechaFin);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

async function cierrePermitido(req) {
  const { data } = await db.from('cierres_caja').select(SELECT_CIERRE).eq('id', req.params.id).maybeSingle();
  if (!data) return null;
  if (req.perfil.rol === 'cajero' && data.cajero_id !== req.perfil.id) return null;
  return data;
}

cierres.get('/:id/ticket', async (req, res) => {
  const cierre = await cierrePermitido(req);
  if (!cierre) return res.status(404).json({ error: 'Cierre no encontrado' });
  const ancho = anchoValido(req.query.columnas);
  const ocultarSistema = esCiego(req.perfil);
  // Desglose con las facturas reales del turno (igual que la factura, el
  // ticket del cierre sale en la térmica).
  let desglose = null;
  if (!ocultarSistema) {
    try {
      desglose = desgloseTurno(await ventasDelTurno(cierre.sucursal_id, cierre.fecha_inicio, cierre.fecha_fin));
    } catch (e) {
      console.error('[cierre ticket] desglose', e.message);
    }
  }
  await registrarAuditoria(req, { accion: 'cierre.imprimir', entidad: 'cierre', entidadId: cierre.id, sucursalId: cierre.sucursal_id });
  res.type('text/html').send(envolverTicketHtml(formatearCierre(cierre, ancho, { ocultarSistema, desglose }), ancho));
});

cierres.get('/:id', async (req, res) => {
  const cierre = await cierrePermitido(req);
  if (!cierre) return res.status(404).json({ error: 'Cierre no encontrado' });
  res.json(esCiego(req.perfil) ? sinSistema(cierre) : cierre);
});
```

### `backend/routes/clientes.js`

```js
import { Router } from 'express';
import { db } from '../db.js';

export const clientes = Router();

// Mismo criterio que el RTN hondureño en el POS: 13-14 dígitos, ignorando
// guiones/espacios. No bloquea si viene vacío (el RTN es opcional acá).
function rtnLuceValido(rtn) {
  if (!rtn) return true;
  return /^\d{13,14}$/.test(String(rtn).replace(/[-\s]/g, ''));
}

clientes.get('/', async (req, res) => {
  const busqueda = req.query.q?.trim();
  let query = db.from('clientes').select('*').order('nombre');
  if (busqueda) {
    query = query.or(
      `nombre.ilike.%${busqueda}%,rtn.ilike.%${busqueda}%,telefono.ilike.%${busqueda}%,email.ilike.%${busqueda}%`
    );
  }
  const { data, error } = await query.limit(50);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

clientes.post('/', async (req, res) => {
  const { nombre, rtn, direccion, telefono, email, exento_impuestos } = req.body;
  if (!nombre) return res.status(400).json({ error: 'nombre es obligatorio' });
  if (!rtnLuceValido(rtn)) {
    return res.status(400).json({ error: 'El RTN hondureño debe tener 13-14 dígitos — revísalo.' });
  }
  const { data, error } = await db
    .from('clientes')
    .insert({ nombre, rtn, direccion, telefono, email, exento_impuestos: !!exento_impuestos })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

clientes.put('/:id', async (req, res) => {
  const { nombre, rtn, direccion, telefono, email, exento_impuestos } = req.body;
  if (!rtnLuceValido(rtn)) {
    return res.status(400).json({ error: 'El RTN hondureño debe tener 13-14 dígitos — revísalo.' });
  }
  const { data, error } = await db
    .from('clientes')
    .update({ nombre, rtn, direccion, telefono, email, exento_impuestos })
    .eq('id', req.params.id)
    .eq('es_consumidor_final', false)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
```

### `backend/routes/cotizaciones.js`

```js
import { Router } from 'express';
import { db } from '../db.js';
import { calcularTotales, round2 } from '../lib/facturacion.js';
import { generarPdfCotizacion, generarPdfCotizacionBuffer } from '../lib/cotizacionPdf.js';
import { enviarCotizacionCliente } from '../lib/correo.js';
import { registrarAuditoria } from '../lib/auditoria.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  facturarVenta,
  guardarDetalle,
  obtenerPuntoEmisionActivo,
  UMBRAL_RTN_OBLIGATORIO,
} from './ventas.js';

export const cotizaciones = Router();

function calcularTotal(c) {
  return round2(Number(c.cantidad_copitas) * Number(c.precio_copita) + Number(c.costo_servicio || 0) - Number(c.descuento || 0));
}

function rtnLuceValido(rtn) {
  return /^\d{13,14}$/.test(String(rtn).replace(/[-\s]/g, ''));
}

const CAMPOS_EDITABLES = [
  'nombre_cliente',
  'telefono_cliente',
  'email_cliente',
  'rtn_cliente',
  'nombre_evento',
  'fecha_evento',
  'lugar',
  'cantidad_copitas',
  'precio_copita',
  'costo_servicio',
  'descuento',
  'notas',
  'estado',
  'hora_evento',
  'sucursal_id',
  'anticipo',
  'notas_seguimiento',
];

// Lista de control de un evento aceptado, en el orden en que suele ocurrir.
export const ITEMS_CHECKLIST = [
  { clave: 'anticipo', etiqueta: 'Anticipo recibido' },
  { clave: 'sabores', etiqueta: 'Sabores y cantidades confirmados' },
  { clave: 'produccion', etiqueta: 'Producción programada' },
  { clave: 'logistica', etiqueta: 'Transporte, carrito y equipo listos' },
  { clave: 'entrega', etiqueta: 'Montaje / entrega realizada' },
  { clave: 'cobro', etiqueta: 'Saldo cobrado' },
];
const CLAVES_CHECKLIST = new Set(ITEMS_CHECKLIST.map((i) => i.clave));

function fechaValida(f) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(f)) && !Number.isNaN(new Date(`${f}T00:00:00`).getTime());
}

function horaValida(h) {
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(String(h));
}

// Normaliza hora/fecha/anticipo vacíos a null/0 y valida formatos.
function validarAgenda(cambios, totalCotizado) {
  if (cambios.fecha_evento === '') cambios.fecha_evento = null;
  if (cambios.hora_evento === '') cambios.hora_evento = null;
  if (cambios.sucursal_id === '') cambios.sucursal_id = null;
  if (cambios.anticipo === '' || cambios.anticipo === null) cambios.anticipo = 0;
  if (cambios.fecha_evento && !fechaValida(cambios.fecha_evento)) return 'Fecha del evento inválida';
  if (cambios.hora_evento && !horaValida(cambios.hora_evento)) return 'Hora del evento inválida';
  if (cambios.anticipo !== undefined) {
    const anticipo = Number(cambios.anticipo);
    if (!Number.isFinite(anticipo) || anticipo < 0) return 'Anticipo inválido';
    if (totalCotizado !== undefined && anticipo > totalCotizado + 0.001) {
      return 'El anticipo no puede ser mayor que el total de la cotización';
    }
  }
  return null;
}

function limpiarBody(body) {
  const limpio = {};
  for (const campo of CAMPOS_EDITABLES) {
    if (body[campo] !== undefined) limpio[campo] = body[campo];
  }
  return limpio;
}

cotizaciones.get('/', async (req, res) => {
  const { estado } = req.query;
  let query = db.from('cotizaciones_eventos').select('*, perfiles(nombre)').order('created_at', { ascending: false });
  if (estado) query = query.eq('estado', estado);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map((c) => ({ ...c, total: calcularTotal(c) })));
});

cotizaciones.post('/', async (req, res) => {
  const datos = limpiarBody(req.body);
  if (!datos.nombre_cliente || !datos.nombre_evento || !datos.cantidad_copitas || datos.precio_copita === undefined) {
    return res.status(400).json({
      error: 'nombre_cliente, nombre_evento, cantidad_copitas y precio_copita son obligatorios',
    });
  }
  const errorAgenda = validarAgenda(datos, calcularTotal(datos));
  if (errorAgenda) return res.status(400).json({ error: errorAgenda });
  if (datos.estado === 'facturada') delete datos.estado;
  if (datos.estado === 'aceptada') {
    if (!datos.fecha_evento) return res.status(400).json({ error: 'Para aceptar la cotización indica la fecha del evento' });
    datos.aceptada_at = new Date().toISOString();
  }
  const { data, error } = await db
    .from('cotizaciones_eventos')
    .insert({ ...datos, usuario_id: req.perfil.id })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ ...data, total: calcularTotal(data) });
});

cotizaciones.get('/:id', async (req, res) => {
  const { data, error } = await db
    .from('cotizaciones_eventos')
    .select('*, perfiles(nombre)')
    .eq('id', req.params.id)
    .single();
  if (error || !data) return res.status(404).json({ error: 'Cotización no encontrada' });
  res.json({ ...data, total: calcularTotal(data) });
});

cotizaciones.put('/:id', async (req, res) => {
  const { data: actual } = await db.from('cotizaciones_eventos').select('*').eq('id', req.params.id).maybeSingle();
  if (!actual) return res.status(404).json({ error: 'Cotización no encontrada' });
  if (actual.estado === 'facturada') {
    return res.status(409).json({ error: 'Una cotización ya facturada no se puede modificar' });
  }
  const cambios = limpiarBody(req.body);
  if (cambios.estado === 'facturada') {
    return res.status(400).json({ error: 'Para facturar usa el botón "Facturar", que emite la factura real' });
  }
  const errorAgenda = validarAgenda(cambios, calcularTotal({ ...actual, ...cambios }));
  if (errorAgenda) return res.status(400).json({ error: errorAgenda });

  const seAcepta = cambios.estado === 'aceptada' && actual.estado !== 'aceptada';
  if (seAcepta) {
    const fecha = cambios.fecha_evento !== undefined ? cambios.fecha_evento : actual.fecha_evento;
    if (!fecha) {
      return res.status(400).json({ error: 'Para aceptar la cotización indica la fecha del evento (se agenda en el calendario)' });
    }
    cambios.aceptada_at = new Date().toISOString();
    if (Number(cambios.anticipo ?? actual.anticipo) > 0) {
      const checklist = { ...(actual.checklist || {}) };
      if (!checklist.anticipo?.hecho) {
        checklist.anticipo = { hecho: true, por: req.perfil.nombre, fecha: cambios.aceptada_at };
      }
      cambios.checklist = checklist;
    }
  }

  const { data, error } = await db
    .from('cotizaciones_eventos')
    .update(cambios)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  if (cambios.estado && cambios.estado !== actual.estado) {
    await registrarAuditoria(req, {
      accion: seAcepta ? 'cotizacion.aceptada' : 'cotizacion.cambio_estado',
      entidad: 'cotizacion',
      entidadId: actual.id,
      sucursalId: data.sucursal_id,
      detalle: {
        numero: actual.numero,
        de: actual.estado,
        a: cambios.estado,
        fecha_evento: data.fecha_evento,
        total: calcularTotal(data),
        anticipo: Number(data.anticipo || 0),
      },
    });
  }
  res.json({ ...data, total: calcularTotal(data) });
});

// Seguimiento del evento en el calendario: checklist, hora, sucursal que lo
// atiende, anticipo, notas y reprogramación. Se permite también en
// cotizaciones ya facturadas (se factura antes de que ocurra el evento).
cotizaciones.put('/:id/seguimiento', async (req, res) => {
  const { data: actual } = await db.from('cotizaciones_eventos').select('*').eq('id', req.params.id).maybeSingle();
  if (!actual) return res.status(404).json({ error: 'Cotización no encontrada' });
  if (!['aceptada', 'facturada'].includes(actual.estado)) {
    return res.status(409).json({ error: 'Sólo las cotizaciones aceptadas o facturadas tienen seguimiento en el calendario' });
  }

  const cambios = {};
  for (const campo of ['fecha_evento', 'hora_evento', 'sucursal_id', 'anticipo', 'notas_seguimiento', 'lugar']) {
    if (req.body[campo] !== undefined) cambios[campo] = req.body[campo];
  }
  if (cambios.fecha_evento === '' || cambios.fecha_evento === null) {
    return res.status(400).json({ error: 'Un evento aceptado debe tener fecha' });
  }
  if (cambios.anticipo !== undefined && actual.estado === 'facturada' && Number(cambios.anticipo) !== Number(actual.anticipo)) {
    return res.status(409).json({ error: 'La cotización ya está facturada: el anticipo quedó cerrado en la factura' });
  }
  const errorAgenda = validarAgenda(cambios, calcularTotal(actual));
  if (errorAgenda) return res.status(400).json({ error: errorAgenda });

  const { item, hecho } = req.body;
  if (item !== undefined) {
    if (!CLAVES_CHECKLIST.has(item)) return res.status(400).json({ error: 'Paso de seguimiento desconocido' });
    const checklist = { ...(actual.checklist || {}) };
    checklist[item] = hecho ? { hecho: true, por: req.perfil.nombre, fecha: new Date().toISOString() } : { hecho: false };
    cambios.checklist = checklist;
  }
  if (req.body.realizado !== undefined) cambios.realizado = Boolean(req.body.realizado);
  if (Object.keys(cambios).length === 0) return res.status(400).json({ error: 'Nada que actualizar' });

  const { data, error } = await db
    .from('cotizaciones_eventos')
    .update(cambios)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  const detalle = { numero: actual.numero, evento: actual.nombre_evento };
  if (item !== undefined) detalle.paso = { item, hecho: Boolean(hecho) };
  if (cambios.fecha_evento && cambios.fecha_evento !== actual.fecha_evento) {
    detalle.reprogramado = { de: actual.fecha_evento, a: cambios.fecha_evento };
  }
  for (const campo of ['hora_evento', 'sucursal_id', 'anticipo', 'realizado', 'lugar']) {
    if (cambios[campo] !== undefined && String(cambios[campo] ?? '') !== String(actual[campo] ?? '')) {
      detalle[campo] = { de: actual[campo], a: cambios[campo] };
    }
  }
  if (cambios.notas_seguimiento !== undefined && cambios.notas_seguimiento !== actual.notas_seguimiento) {
    detalle.notas = true;
  }
  await registrarAuditoria(req, {
    accion: detalle.reprogramado ? 'evento.reprogramado' : 'evento.seguimiento',
    entidad: 'cotizacion',
    entidadId: actual.id,
    sucursalId: data.sucursal_id,
    detalle,
  });

  res.json({ ...data, total: calcularTotal(data) });
});

cotizaciones.delete('/:id', async (req, res) => {
  const { data: cot } = await db.from('cotizaciones_eventos').select('estado').eq('id', req.params.id).single();
  if (!cot) return res.status(404).json({ error: 'Cotización no encontrada' });
  if (cot.estado !== 'borrador') return res.status(409).json({ error: 'Sólo se eliminan cotizaciones en borrador' });
  await db.from('cotizaciones_eventos').delete().eq('id', req.params.id);
  res.status(204).end();
});

cotizaciones.get('/:id/pdf', async (req, res) => {
  const { data, error } = await db
    .from('cotizaciones_eventos')
    .select('*, perfiles(nombre)')
    .eq('id', req.params.id)
    .single();
  if (error || !data) return res.status(404).json({ error: 'Cotización no encontrada' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="cotizacion-evento-${data.numero}.pdf"`);
  generarPdfCotizacion({ ...data, total: calcularTotal(data) }, res);
});

cotizaciones.post('/:id/enviar', async (req, res) => {
  try {
    const { data, error } = await db.from('cotizaciones_eventos').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ error: 'Cotización no encontrada' });
    const cotizacionCompleta = { ...data, total: calcularTotal(data) };
    const pdfBuffer = await generarPdfCotizacionBuffer(cotizacionCompleta);
    const resultado = await enviarCotizacionCliente(cotizacionCompleta, pdfBuffer, data.email_cliente);
    if (!resultado.enviado) return res.status(400).json({ error: resultado.motivo });
    if (data.estado === 'borrador') {
      await db.from('cotizaciones_eventos').update({ estado: 'enviada' }).eq('id', req.params.id);
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Busca el cliente de la cotización en el catálogo de clientes (por RTN, o
// por correo si no hay RTN) y si no existe lo crea — así la factura queda a
// su nombre sin volver a digitar nada.
async function clienteDeCotizacion(cot, rtn) {
  if (rtn) {
    const { data } = await db.from('clientes').select('*').eq('rtn', rtn).limit(1).maybeSingle();
    if (data) return data;
  } else if (cot.email_cliente) {
    const { data } = await db.from('clientes').select('*').ilike('email', cot.email_cliente).limit(1).maybeSingle();
    if (data) return data;
  }
  const { data: nuevo, error } = await db
    .from('clientes')
    .insert({
      nombre: cot.nombre_cliente,
      rtn: rtn || null,
      telefono: cot.telefono_cliente || null,
      email: cot.email_cliente || null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return nuevo;
}

const NOMBRE_FORMA = { efectivo: 'Efectivo', tarjeta: 'Tarjeta', transferencia: 'Transferencia' };

// Cotización → factura en un solo paso: arma las líneas con los mismos
// precios cotizados (copitas + servicio, menos el descuento), emite la
// factura con el correlativo del CAI de la sucursal y marca la cotización
// como facturada. Precios con ISV incluido, igual que el resto del catálogo.
cotizaciones.post('/:id/facturar', requireRole('admin', 'manager'), async (req, res) => {
  let ventaCreadaId = null;
  try {
    const { sucursal_id, forma_pago } = req.body;
    if (!sucursal_id) return res.status(400).json({ error: 'Falta la sucursal que emite la factura' });
    if (!NOMBRE_FORMA[forma_pago]) return res.status(400).json({ error: 'Forma de pago inválida' });

    const { data: cot, error } = await db.from('cotizaciones_eventos').select('*').eq('id', req.params.id).single();
    if (error || !cot) return res.status(404).json({ error: 'Cotización no encontrada' });
    if (cot.venta_id || cot.estado === 'facturada') {
      return res.status(409).json({ error: 'Esta cotización ya fue facturada' });
    }
    if (cot.estado === 'rechazada') {
      return res.status(409).json({ error: 'No se puede facturar una cotización rechazada' });
    }

    const rtn = String(req.body.rtn ?? cot.rtn_cliente ?? '').trim();
    if (rtn && !rtnLuceValido(rtn)) {
      return res.status(400).json({ error: 'El RTN hondureño debe tener 13-14 dígitos — revísalo.' });
    }
    const totalCotizado = calcularTotal(cot);
    if (totalCotizado > UMBRAL_RTN_OBLIGATORIO && !rtn) {
      return res.status(400).json({
        error: `Esta cotización supera L${UMBRAL_RTN_OBLIGATORIO.toLocaleString('es-HN')}: se necesita el RTN del cliente para facturarla.`,
      });
    }
    if (rtn && rtn !== cot.rtn_cliente) {
      await db.from('cotizaciones_eventos').update({ rtn_cliente: rtn }).eq('id', cot.id);
    }

    const cliente = await clienteDeCotizacion(cot, rtn);
    const puntoEmision = await obtenerPuntoEmisionActivo(sucursal_id);

    const lineas = [
      {
        producto_id: null,
        nombre_producto: `Copitas de gelato - ${cot.nombre_evento}`,
        cantidad: Number(cot.cantidad_copitas),
        precio_unitario: Number(cot.precio_copita),
        descuento: 0,
        impuesto_tasa: 0.15,
      },
    ];
    if (Number(cot.costo_servicio) > 0) {
      lineas.push({
        producto_id: null,
        nombre_producto: 'Servicio de evento',
        cantidad: 1,
        precio_unitario: Number(cot.costo_servicio),
        descuento: 0,
        impuesto_tasa: 0.15,
      });
    }
    const totales = calcularTotales(lineas, cliente, Number(cot.descuento || 0));

    const { data: venta, error: errVenta } = await db
      .from('ventas')
      .insert({
        sucursal_id,
        punto_emision_id: puntoEmision.id,
        cliente_id: cliente.id,
        cajero_id: req.perfil.id,
        estado: 'abierta',
        nota_interna: `Cotización de evento No. ${String(cot.numero).padStart(4, '0')}`,
        subtotal_exento: totales.subtotal_exento,
        subtotal_exonerado: totales.subtotal_exonerado,
        subtotal_gravado_15: totales.subtotal_gravado_15,
        descuento: totales.descuento,
        isv_total: totales.isv_total,
        total: totales.total,
      })
      .select()
      .single();
    if (errVenta) throw new Error(errVenta.message);
    ventaCreadaId = venta.id;
    await guardarDetalle(venta.id, totales.lineas);

    const { data: forma } = await db.from('formas_pago').select('id').eq('nombre', NOMBRE_FORMA[forma_pago]).single();
    const factura = await facturarVenta(req, venta.id, {
      pagos: [{ forma_pago_id: forma.id, monto: totales.total }],
      efectivo_recibido: forma_pago === 'efectivo' ? totales.total : 0,
      origen: 'cotizacion',
    });
    ventaCreadaId = null; // ya es una factura emitida: nunca se borra

    await db
      .from('cotizaciones_eventos')
      .update({
        estado: 'facturada',
        venta_id: venta.id,
        aceptada_at: cot.aceptada_at ?? new Date().toISOString(),
        sucursal_id: cot.sucursal_id ?? sucursal_id,
        // Facturar registra el pago completo: el saldo queda cobrado.
        checklist: {
          ...(cot.checklist || {}),
          cobro: { hecho: true, por: req.perfil.nombre, fecha: new Date().toISOString(), factura: factura.numero_factura },
        },
      })
      .eq('id', cot.id);
    await registrarAuditoria(req, {
      accion: 'cotizacion.convertir_factura',
      entidad: 'cotizacion',
      entidadId: cot.id,
      sucursalId: sucursal_id,
      detalle: {
        numero_cotizacion: cot.numero,
        numero_factura: factura.numero_factura,
        venta_id: venta.id,
        total: totales.total,
        cliente: cliente.nombre,
      },
    });

    res.status(201).json(factura);
  } catch (e) {
    // Si la factura no llegó a emitirse (ej. CAI vencido), no se deja la
    // orden a medio crear en Órdenes Abiertas.
    if (ventaCreadaId) {
      await db.from('detalle_venta').delete().eq('venta_id', ventaCreadaId);
      await db.from('ventas').delete().eq('id', ventaCreadaId).eq('estado', 'abierta');
    }
    res.status(e.status ?? 400).json({ error: e.message });
  }
});
```

### `backend/routes/dashboard.js`

```js
import { Router } from 'express';
import { db } from '../db.js';
import { round2 } from '../lib/facturacion.js';
import { traerPorIds, traerTodo } from '../lib/consultas.js';
import { fechaHn, filtrarRango } from '../lib/fechas.js';

export const dashboard = Router();

// Un solo endpoint agregado: KPIs + formas de pago + comparativo por
// sucursal + top productos + ventas por categoría (incluye Ristoris) +
// tendencia diaria. Todo calculado en memoria sobre las ventas del rango —
// suficiente para el volumen de una gelatería de 4 sucursales; si el
// negocio crece mucho, esto es lo primero que habría que mover a vistas
// materializadas en Postgres.
dashboard.get('/', async (req, res) => {
  try {
    const { sucursal_id, fechaInicio, fechaFin } = req.query;

    // Fechas en hora de Honduras (fin de día incluido) y por páginas: antes
    // se perdía el último día del rango y todo lo que pasara de 1000 facturas.
    const ventas = await traerTodo(() => {
      let q = db
        .from('ventas')
        .select('id, sucursal_id, total, isv_total, cambio, fecha_emision, sucursales(nombre, alias)')
        .eq('estado', 'pagada')
        .eq('anulada', false);
      if (sucursal_id) q = q.eq('sucursal_id', sucursal_id);
      q = filtrarRango(q, 'fecha_emision', fechaInicio, fechaFin);
      return q.order('fecha_emision').order('id');
    });

    const ventaIds = ventas.map((v) => v.id);
    const total = round2(ventas.reduce((s, v) => s + Number(v.total), 0));
    const cantidadFacturas = ventas.length;
    const isvTotal = round2(ventas.reduce((s, v) => s + Number(v.isv_total), 0));
    const ticketPromedio = cantidadFacturas > 0 ? round2(total / cantidadFacturas) : 0;

    let pagos = [];
    let detalle = [];
    if (ventaIds.length > 0) {
      [pagos, detalle] = await Promise.all([
        traerPorIds(() => db.from('venta_pagos').select('id, venta_id, monto, formas_pago(nombre)').order('id'), 'venta_id', ventaIds),
        traerPorIds(
          () => db.from('detalle_venta').select('id, venta_id, cantidad, monto, productos(nombre, categorias(nombre))').order('id'),
          'venta_id',
          ventaIds
        ),
      ]);
    }

    // Formas de pago
    const porFormaPago = new Map();
    for (const p of pagos) {
      const nombre = p.formas_pago?.nombre ?? 'Otro';
      const acc = porFormaPago.get(nombre) || { nombre, monto: 0 };
      acc.monto = round2(acc.monto + Number(p.monto));
      porFormaPago.set(nombre, acc);
    }
    // El efectivo recibido incluye el billete completo; el cambio devuelto
    // no es venta en efectivo.
    const cambioTotal = ventas.reduce((s, v) => s + Number(v.cambio ?? 0), 0);
    if (cambioTotal > 0 && porFormaPago.has('Efectivo')) {
      const ef = porFormaPago.get('Efectivo');
      ef.monto = round2(ef.monto - cambioTotal);
    }
    const totalPagos = round2([...porFormaPago.values()].reduce((s, f) => s + f.monto, 0));
    const formasPago = [...porFormaPago.values()]
      .map((f) => ({ ...f, porcentaje: totalPagos > 0 ? round2((f.monto / totalPagos) * 100) : 0 }))
      .sort((a, b) => b.monto - a.monto);

    // Por sucursal
    const porSucursal = new Map();
    for (const v of ventas) {
      const nombre = v.sucursales?.nombre ?? 'Sin sucursal';
      const acc = porSucursal.get(v.sucursal_id) || { sucursal_id: v.sucursal_id, nombre, total: 0, facturas: 0 };
      acc.total = round2(acc.total + Number(v.total));
      acc.facturas += 1;
      porSucursal.set(v.sucursal_id, acc);
    }
    const sucursales = [...porSucursal.values()]
      .map((s) => ({ ...s, ticket_promedio: s.facturas > 0 ? round2(s.total / s.facturas) : 0 }))
      .sort((a, b) => b.total - a.total);

    // Top productos y por categoría (misma pasada sobre detalle_venta)
    const porProducto = new Map();
    const porCategoria = new Map();
    for (const d of detalle) {
      const nombreProducto = d.productos?.nombre ?? 'Producto eliminado';
      const accP = porProducto.get(nombreProducto) || { nombre: nombreProducto, cantidad: 0, total: 0 };
      accP.cantidad += Number(d.cantidad);
      accP.total = round2(accP.total + Number(d.monto));
      porProducto.set(nombreProducto, accP);

      const nombreCategoria = d.productos?.categorias?.nombre ?? 'Sin categoría';
      const accC = porCategoria.get(nombreCategoria) || { nombre: nombreCategoria, cantidad: 0, total: 0 };
      accC.cantidad += Number(d.cantidad);
      accC.total = round2(accC.total + Number(d.monto));
      porCategoria.set(nombreCategoria, accC);
    }
    const topProductos = [...porProducto.values()].sort((a, b) => b.cantidad - a.cantidad).slice(0, 10);
    const porCategoriaArr = [...porCategoria.values()].sort((a, b) => b.total - a.total);

    // Tendencia diaria
    const porDia = new Map();
    for (const v of ventas) {
      const dia = fechaHn(v.fecha_emision);
      const acc = porDia.get(dia) || { fecha: dia, total: 0, facturas: 0 };
      acc.total = round2(acc.total + Number(v.total));
      acc.facturas += 1;
      porDia.set(dia, acc);
    }
    const tendenciaDiaria = [...porDia.values()].sort((a, b) => a.fecha.localeCompare(b.fecha));

    res.json({
      total,
      cantidad_facturas: cantidadFacturas,
      ticket_promedio: ticketPromedio,
      isv_total: isvTotal,
      formas_pago: formasPago,
      por_sucursal: sucursales,
      top_productos: topProductos,
      por_categoria: porCategoriaArr,
      tendencia_diaria: tendenciaDiaria,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
```

### `backend/routes/facturaImpresion.js`

```js
import { Router } from 'express';
import { obtenerVentaCompleta } from './ventas.js';
import { formatearTicket, formatearTicketPrueba, envolverTicketHtml, anchoValido } from '../lib/ticket.js';
import { generarPdfFactura } from '../lib/pdf.js';
import { registrarAuditoria } from '../lib/auditoria.js';
import { crearAlerta } from '../lib/alertas.js';
import { obtenerReglas } from '../lib/reglas.js';
import { db } from '../db.js';

export const facturaImpresion = Router();

// Ticket de prueba para configurar la impresora térmica en cada caja.
// (Va antes de "/:id/..." para que "prueba" no se tome como un id.)
facturaImpresion.get('/impresora/prueba', (req, res) => {
  const ancho = anchoValido(req.query.columnas);
  res.type('text/html').send(envolverTicketHtml(formatearTicketPrueba(ancho, req.query.sucursal ?? ''), ancho));
});

facturaImpresion.get('/:id/ticket', async (req, res) => {
  const venta = await obtenerVentaCompleta(req.params.id);
  if (!venta) return res.status(404).json({ error: 'Factura no encontrada' });
  if (venta.estado !== 'pagada') return res.status(409).json({ error: 'La orden todavía no tiene factura' });

  const ancho = anchoValido(req.query.columnas);
  // La primera impresión es el original. Cualquier otra —aunque la pidan
  // como "primera"— sale marcada COPIA: así una factura reimpresa no se
  // puede entregar como original a otro cliente.
  const esReimpresion = req.query.motivo === 'reimpresion' || Number(venta.impresiones ?? 0) > 0;
  const razon = String(req.query.razon ?? '').trim().slice(0, 200);
  if (req.query.motivo === 'reimpresion') {
    const reglas = await obtenerReglas();
    if (reglas.exigir_motivo_reimpresion && !razon) {
      return res.status(400).json({ error: 'Indica el motivo de la reimpresión' });
    }
  }
  const impresiones = Number(venta.impresiones ?? 0) + 1;
  const reimpresiones = Number(venta.reimpresiones ?? 0) + (esReimpresion ? 1 : 0);
  await db.from('ventas').update({ impresiones, reimpresiones }).eq('id', venta.id);
  const reglasTicket = await obtenerReglas();
  const texto = formatearTicket(venta, ancho, { copia: esReimpresion ? reimpresiones : 0, leyendaGratis: reglasTicket.leyenda_factura_gratis });

  await registrarAuditoria(req, {
    accion: esReimpresion ? 'venta.reimprimir_ticket' : 'venta.imprimir_ticket',
    entidad: 'venta',
    entidadId: venta.id,
    sucursalId: venta.sucursal_id,
    detalle: { numero_factura: venta.numero_factura, total: Number(venta.total), reimpresion_no: esReimpresion ? reimpresiones : 0, motivo: razon || null },
  });
  if (esReimpresion && reimpresiones >= 2) {
    await crearAlerta(req, {
      tipo: 'venta.reimpresion_repetida',
      severidad: reimpresiones >= 3 ? 'alta' : 'media',
      titulo: `Factura ${venta.numero_factura} reimpresa ${reimpresiones} veces`,
      sucursalId: venta.sucursal_id,
      entidad: 'venta',
      entidadId: venta.id,
      detalle: { factura: venta.numero_factura, total: Number(venta.total), reimpresiones, ultimo_motivo: razon || '(sin motivo)', por: req.perfil.nombre },
    });
  }

  // ?formato=texto para integraciones/impresión directa por ESC-POS; por
  // default HTML listo para mandar a la térmica.
  if (req.query.formato === 'texto') return res.type('text/plain').send(texto);
  res.type('text/html').send(envolverTicketHtml(texto, ancho));
});

facturaImpresion.get('/:id/pdf', async (req, res) => {
  const venta = await obtenerVentaCompleta(req.params.id);
  if (!venta) return res.status(404).json({ error: 'Factura no encontrada' });
  if (venta.estado !== 'pagada') return res.status(409).json({ error: 'La orden todavía no tiene factura' });

  await registrarAuditoria(req, {
    accion: 'venta.ver_pdf',
    entidad: 'venta',
    entidadId: venta.id,
    sucursalId: venta.sucursal_id,
    detalle: { numero_factura: venta.numero_factura },
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="factura-${venta.numero_factura}.pdf"`);
  generarPdfFactura(venta, res);
});
```

### `backend/routes/notasCredito.js`

```js
import { Router } from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/requireRole.js';
import { registrarAuditoria } from '../lib/auditoria.js';
import { crearAlerta } from '../lib/alertas.js';
import { fechaHn, hoyHn } from '../lib/fechas.js';

export const notasCredito = Router();

// Sólo admin puede anular, igual de restrictivo que en WizPOS hoy (ni el
// propio Juan tiene ese permiso ahí). La numeración de la factura original
// no se toca — la nota de crédito es un documento aparte que la referencia.
notasCredito.post('/', requireRole('admin'), async (req, res) => {
  const { venta_id, motivo, monto } = req.body;
  if (!venta_id || !String(motivo ?? '').trim() || monto === undefined) {
    return res.status(400).json({ error: 'venta_id, motivo y monto son obligatorios' });
  }
  if (!Number.isFinite(Number(monto)) || Number(monto) <= 0) {
    return res.status(400).json({ error: 'El monto de la nota de crédito debe ser mayor que 0' });
  }

  const { data: venta, error: errVenta } = await db.from('ventas').select('*').eq('id', venta_id).single();
  if (errVenta || !venta) return res.status(404).json({ error: 'Factura no encontrada' });
  if (venta.estado !== 'pagada') return res.status(409).json({ error: 'Sólo se anulan facturas ya pagadas' });
  if (venta.anulada) return res.status(409).json({ error: 'Esta factura ya está anulada' });

  const { data: notasPrevias } = await db.from('notas_credito').select('monto').eq('venta_id', venta_id).neq('estado', 'anulada');
  const yaAcreditado = (notasPrevias ?? []).reduce((s, n) => s + Number(n.monto), 0);
  const restante = Number(venta.total) - yaAcreditado;
  if (Number(monto) > restante + 0.01) {
    return res.status(400).json({ error: `El monto excede lo pendiente por acreditar (L ${restante.toFixed(2)})` });
  }

  const { data: nota, error } = await db
    .from('notas_credito')
    .insert({ venta_id, motivo, monto, usuario_id: req.perfil.id })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  const anulaTotal = Number(monto) >= restante - 0.01;
  if (anulaTotal) {
    await db.from('ventas').update({ anulada: true }).eq('id', venta_id);
  }

  await registrarAuditoria(req, {
    accion: anulaTotal ? 'venta.anular' : 'venta.nota_credito_parcial',
    entidad: 'venta',
    entidadId: venta_id,
    sucursalId: venta.sucursal_id,
    detalle: {
      numero_factura: venta.numero_factura,
      total_factura: Number(venta.total),
      monto_acreditado: Number(monto),
      motivo,
      nota_credito_id: nota.id,
    },
  });

  // Anular o acreditar dinero de una factura ya cobrada es de los puntos
  // más sensibles: alerta + correo a los administradores.
  // Anular una factura de OTRO día (ya cerrada en caja) es más grave: el
  // dinero de ese día ya se contó, así que la anulación "libera" efectivo.
  const diaFactura = fechaHn(venta.fecha_emision);
  const deOtroDia = diaFactura !== hoyHn();
  await crearAlerta(req, {
    tipo: anulaTotal ? 'venta.anular' : 'venta.nota_credito',
    severidad: anulaTotal || deOtroDia ? 'alta' : 'media',
    titulo: `${anulaTotal ? 'Factura anulada' : 'Nota de crédito'}: ${venta.numero_factura} por L ${Number(monto).toFixed(2)}${deOtroDia ? ` (emitida el ${diaFactura})` : ''}`,
    sucursalId: venta.sucursal_id,
    entidad: 'venta',
    entidadId: venta_id,
    correo: true,
    detalle: {
      factura: venta.numero_factura,
      emitida: diaFactura,
      de_otro_dia: deOtroDia ? 'SÍ' : 'no',
      total_factura: Number(venta.total),
      monto_acreditado: Number(monto),
      motivo,
      autorizo: req.perfil.nombre,
    },
  });

  res.status(201).json(nota);
});

notasCredito.get('/', requireRole('admin', 'manager'), async (req, res) => {
  let query = db.from('notas_credito').select('*, ventas(numero_factura)').order('created_at', { ascending: false });
  if (req.query.venta_id) query = query.eq('venta_id', req.query.venta_id);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
```

### `backend/routes/productos.js`

```js
import { Router } from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/requireRole.js';
import { registrarAuditoria } from '../lib/auditoria.js';
import { crearAlerta } from '../lib/alertas.js';

export const productos = Router();

// '' → null (para que dos productos sin código no choquen con el índice
// único); undefined se respeta para no pisar el campo en ediciones parciales.
function limpiarCodigo(valor) {
  if (valor === undefined) return undefined;
  const texto = String(valor ?? '').trim();
  return texto === '' ? null : texto;
}

function errorDuplicado(error, { codigo, codigo_barras }) {
  const detalle = `${error.message} ${error.details ?? ''}`;
  if (detalle.includes('codigo_barras')) {
    return `Ya existe un producto con el código de barras "${codigo_barras}".`;
  }
  return `Ya existe un producto con el código "${codigo}" — usa uno distinto.`;
}

productos.get('/', async (req, res) => {
  let query = db.from('productos').select('*, categorias(id, nombre)').order('nombre');
  if (req.query.categoria_id) query = query.eq('categoria_id', req.query.categoria_id);
  if (req.query.incluirInactivos !== 'true') query = query.eq('activo', true);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

productos.post('/', requireRole('admin', 'manager'), async (req, res) => {
  const { nombre, categoria_id, precio, impuesto1_tasa, impuesto2_tasa, impuesto3_tasa } = req.body;
  const codigo = limpiarCodigo(req.body.codigo);
  const codigo_barras = limpiarCodigo(req.body.codigo_barras);
  if (!nombre || precio === undefined) {
    return res.status(400).json({ error: 'nombre y precio son obligatorios' });
  }
  const { data, error } = await db
    .from('productos')
    .insert({
      codigo,
      codigo_barras,
      nombre,
      categoria_id,
      precio,
      impuesto1_tasa: impuesto1_tasa ?? 0.15,
      impuesto2_tasa: impuesto2_tasa ?? 0,
      impuesto3_tasa: impuesto3_tasa ?? 0,
    })
    .select()
    .single();
  if (error) {
    if (error.code === '23505') return res.status(400).json({ error: errorDuplicado(error, { codigo, codigo_barras }) });
    return res.status(500).json({ error: error.message });
  }
  await registrarAuditoria(req, {
    accion: 'producto.crear',
    entidad: 'producto',
    entidadId: data.id,
    detalle: { nombre: data.nombre, precio: Number(data.precio), codigo_barras: data.codigo_barras },
  });
  res.status(201).json(data);
});

productos.put('/:id', requireRole('admin', 'manager'), async (req, res) => {
  const { nombre, categoria_id, precio, impuesto1_tasa, activo } = req.body;
  const codigo = limpiarCodigo(req.body.codigo);
  const codigo_barras = limpiarCodigo(req.body.codigo_barras);
  const { data: anterior } = await db.from('productos').select('*').eq('id', req.params.id).maybeSingle();

  const { data, error } = await db
    .from('productos')
    .update({ codigo, codigo_barras, nombre, categoria_id, precio, impuesto1_tasa, activo })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) {
    if (error.code === '23505') return res.status(400).json({ error: errorDuplicado(error, { codigo, codigo_barras }) });
    return res.status(500).json({ error: error.message });
  }

  // Un cambio de precio es de los primeros datos que pide una auditoría.
  if (anterior) {
    const cambios = {};
    for (const campo of ['nombre', 'precio', 'impuesto1_tasa', 'activo', 'codigo', 'codigo_barras']) {
      if (String(anterior[campo]) !== String(data[campo])) cambios[campo] = { antes: anterior[campo], despues: data[campo] };
    }
    if (Object.keys(cambios).length > 0) {
      await registrarAuditoria(req, {
        accion: 'producto.editar',
        entidad: 'producto',
        entidadId: data.id,
        detalle: { nombre: data.nombre, cambios },
      });
    }
    // Bajar un precio es una forma silenciosa de "regalar" producto (o de
    // cobrar el precio real y facturar el rebajado): siempre genera alerta.
    const antes = Number(anterior.precio);
    const despues = Number(data.precio);
    if (Number.isFinite(antes) && despues < antes) {
      await crearAlerta(req, {
        tipo: 'producto.baja_precio',
        severidad: despues < antes * 0.8 ? 'alta' : 'media',
        titulo: `Bajó el precio de ${data.nombre}: L ${antes.toFixed(2)} → L ${despues.toFixed(2)}`,
        entidad: 'producto',
        entidadId: data.id,
        detalle: { producto: data.nombre, antes, despues, rebaja_pct: Math.round((1 - despues / antes) * 100), por: req.perfil.nombre },
      });
    }
  }
  res.json(data);
});

// Sin borrado físico: WizPOS lo permite, pero acá alcanza con desactivar
// (una factura ya emitida no debe perder la referencia al producto).
productos.delete('/:id', requireRole('admin', 'manager'), async (req, res) => {
  const { data, error } = await db
    .from('productos')
    .update({ activo: false })
    .eq('id', req.params.id)
    .select('id, nombre')
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  await registrarAuditoria(req, {
    accion: 'producto.desactivar',
    entidad: 'producto',
    entidadId: req.params.id,
    detalle: { nombre: data?.nombre },
  });
  res.status(204).end();
});
```

### `backend/routes/puntosEmision.js`

```js
import { Router } from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/requireRole.js';
import { registrarAuditoria } from '../lib/auditoria.js';
import { crearAlerta } from '../lib/alertas.js';

export const puntosEmision = Router();

const UMBRAL_ALERTA_PORCENTAJE = 0.9; // avisar cuando queda <10% del rango
const UMBRAL_ALERTA_DIAS = 15; // avisar cuando quedan <15 días para el vencimiento

function calcularEstado(pe) {
  const rango = pe.correlativo_hasta - pe.correlativo_desde + 1;
  const usados = pe.correlativo_actual - pe.correlativo_desde;
  const porcentaje_usado = rango > 0 ? Math.min(1, Math.max(0, usados / rango)) : 1;

  let dias_restantes = null;
  if (pe.fecha_limite_emision) {
    const hoy = new Date();
    const limite = new Date(pe.fecha_limite_emision);
    dias_restantes = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24));
  }

  const alerta_rango = porcentaje_usado >= UMBRAL_ALERTA_PORCENTAJE;
  const alerta_fecha = dias_restantes !== null && dias_restantes <= UMBRAL_ALERTA_DIAS;
  const agotado = pe.correlativo_actual > pe.correlativo_hasta;
  const vencido = dias_restantes !== null && dias_restantes < 0;

  return {
    ...pe,
    porcentaje_usado: Math.round(porcentaje_usado * 1000) / 10,
    dias_restantes,
    alerta: alerta_rango || alerta_fecha || agotado || vencido,
    agotado,
    vencido,
  };
}

puntosEmision.get('/estado', requireRole('admin', 'manager'), async (req, res) => {
  const { data, error } = await db
    .from('puntos_emision')
    .select('*, sucursales(nombre, alias)')
    .eq('activo', true);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(calcularEstado));
});

// Versión reducida y accesible para cualquier rol (incluye cajero): sólo el
// estado del punto de emisión de SU sucursal, para avisarle en el POS antes
// de cobrar si el CAI está por vencer o agotarse — sin exponerle el estado
// de las otras sucursales.
puntosEmision.get('/sucursal/:sucursal_id/estado', async (req, res) => {
  const { data, error } = await db
    .from('puntos_emision')
    .select('id, es_borrador, cai, fecha_limite_emision, correlativo_desde, correlativo_hasta, correlativo_actual, activo')
    .eq('sucursal_id', req.params.sucursal_id)
    .eq('activo', true)
    .single();
  if (error || !data) return res.status(404).json({ error: 'Sin punto de emisión activo para esta sucursal' });
  res.json(calcularEstado(data));
});

// CAI del SAR: 32 caracteres hexadecimales en grupos 6-6-6-6-6-2.
const CAI_VALIDO = /^[0-9A-F]{6}(-[0-9A-F]{6}){4}-[0-9A-F]{2}$/;

// Acepta el CAI pegado con o sin guiones/espacios y lo deja con el formato oficial.
function normalizarCai(valor) {
  const texto = String(valor ?? '').toUpperCase().replace(/[\s-]/g, '');
  if (!texto) return null;
  if (/^[0-9A-F]{32}$/.test(texto)) return texto.match(/.{1,6}/g).join('-');
  return String(valor).trim().toUpperCase();
}
const CAMPOS_EDITABLES = [
  'cai',
  'punto_emision_codigo',
  'punto_venta_codigo',
  'tipo_documento_codigo',
  'correlativo_desde',
  'correlativo_hasta',
  'correlativo_actual',
  'fecha_limite_emision',
  'es_borrador',
];

function numeroFactura(pe, correlativo) {
  return `${pe.punto_emision_codigo}-${pe.punto_venta_codigo}-${pe.tipo_documento_codigo}-${String(correlativo).padStart(8, '0')}`;
}

// Revisa que el punto de emisión quede en un estado que el SAR acepte antes
// de guardarlo como fiscal (no borrador).
function problemaCaiReal(pe) {
  if (!pe.cai || !CAI_VALIDO.test(pe.cai)) {
    return 'El CAI debe tener el formato del SAR: 32 caracteres en grupos 6-6-6-6-6-2 (ej. 2F4851-96A881-B76670-CE6CCE-48D250-32)';
  }
  if (!/^\d{3}$/.test(pe.punto_emision_codigo ?? '')) return 'El código de establecimiento debe tener 3 dígitos (ej. 001)';
  if (!/^\d{3}$/.test(pe.punto_venta_codigo ?? '')) return 'El código de punto de emisión debe tener 3 dígitos (ej. 001)';
  if (!/^\d{2}$/.test(pe.tipo_documento_codigo ?? '')) return 'El tipo de documento debe tener 2 dígitos (01 = factura)';
  const desde = Number(pe.correlativo_desde);
  const hasta = Number(pe.correlativo_hasta);
  const actual = Number(pe.correlativo_actual);
  if (!Number.isInteger(desde) || desde < 1) return 'El rango autorizado "desde" debe ser un número entero mayor que 0';
  if (!Number.isInteger(hasta) || hasta < desde) return 'El rango autorizado "hasta" debe ser mayor o igual que "desde"';
  if (!Number.isInteger(actual) || actual < desde || actual > hasta) {
    return `La próxima factura debe estar dentro del rango autorizado (${desde} a ${hasta})`;
  }
  if (!pe.fecha_limite_emision) return 'Falta la fecha límite de emisión que aparece en la resolución del SAR';
  const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Tegucigalpa' });
  if (pe.fecha_limite_emision < hoy) return 'La fecha límite de emisión ya pasó';
  return null;
}

// Editar el CAI y, sobre todo, ACTIVARLO: al pasar es_borrador de true a
// false las facturas de la sucursal empiezan a tener validez fiscal. Sólo
// se cambian los campos que vienen en el cuerpo (los demás se conservan).
puntosEmision.put('/:id', requireRole('admin'), async (req, res) => {
  const { data: anterior, error: errAnterior } = await db
    .from('puntos_emision')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();
  if (errAnterior) return res.status(500).json({ error: errAnterior.message });
  if (!anterior) return res.status(404).json({ error: 'Punto de emisión no encontrado' });

  const cambiosPedidos = {};
  for (const campo of CAMPOS_EDITABLES) {
    if (req.body[campo] === undefined) continue;
    let valor = req.body[campo];
    if (['correlativo_desde', 'correlativo_hasta', 'correlativo_actual'].includes(campo)) valor = Number(valor);
    if (campo === 'es_borrador') valor = valor === true || valor === 'true';
    if (campo === 'cai') valor = normalizarCai(valor);
    if (campo === 'fecha_limite_emision') valor = valor || null;
    if (['punto_emision_codigo', 'punto_venta_codigo', 'tipo_documento_codigo'].includes(campo)) valor = String(valor).trim();
    cambiosPedidos[campo] = valor;
  }
  const resultante = { ...anterior, ...cambiosPedidos };

  if (!resultante.es_borrador) {
    const problema = problemaCaiReal(resultante);
    if (problema) return res.status(400).json({ error: problema });

    // Ningún número del rango que queda por usar puede existir ya (las de
    // prueba llevan el prefijo BORRADOR-, así que no chocan).
    const { data: repetida, error: errRepetida } = await db
      .from('ventas')
      .select('numero_factura')
      .gte('numero_factura', numeroFactura(resultante, resultante.correlativo_actual))
      .lte('numero_factura', numeroFactura(resultante, resultante.correlativo_hasta))
      .limit(1);
    if (errRepetida) return res.status(500).json({ error: errRepetida.message });
    if (repetida.length > 0) {
      return res.status(409).json({
        error: `La factura ${repetida[0].numero_factura} ya existe. Sube "próxima factura" a un número que no se haya usado.`,
      });
    }
  }

  const { data, error } = await db
    .from('puntos_emision')
    .update(cambiosPedidos)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) {
    const duplicado = /duplicate|unique/i.test(error.message);
    return res.status(duplicado ? 409 : 500).json({
      error: duplicado ? 'Ese CAI ya está registrado en otro punto de emisión' : error.message,
    });
  }

  // Mover el correlativo o el CAI a mano es lo más delicado fiscalmente —
  // queda registrado quién lo hizo y qué valores había antes.
  if (anterior) {
    const cambios = {};
    for (const campo of CAMPOS_EDITABLES) {
      if (String(anterior[campo]) !== String(data[campo])) cambios[campo] = { antes: anterior[campo], despues: data[campo] };
    }
    if (Object.keys(cambios).length > 0) {
      await registrarAuditoria(req, {
        accion: anterior.es_borrador && !data.es_borrador ? 'cai.activar' : 'cai.editar',
        entidad: 'punto_emision',
        entidadId: data.id,
        sucursalId: data.sucursal_id,
        detalle: { cambios },
      });
      // Mover el correlativo hacia atrás permitiría repetir números de
      // factura; cualquier cambio fiscal se avisa por correo.
      const resumen = Object.entries(cambios)
        .map(([k, c]) => `${k}: ${c.antes ?? '—'} → ${c.despues ?? '—'}`)
        .join(' · ');
      const retroceso = cambios.correlativo_actual && Number(cambios.correlativo_actual.despues) < Number(cambios.correlativo_actual.antes);
      await crearAlerta(req, {
        tipo: 'cai.cambio',
        severidad: 'alta',
        titulo: `${retroceso ? 'Correlativo movido HACIA ATRÁS' : 'Cambio en CAI / correlativo'} (${req.perfil.nombre})`,
        sucursalId: data.sucursal_id,
        entidad: 'punto_emision',
        entidadId: data.id,
        correo: true,
        detalle: { cambios: resumen, por: req.perfil.nombre },
      });
    }
  }
  res.json(calcularEstado(data));
});
```

### `backend/routes/reportes.js`

```js
import { Router } from 'express';
import { db } from '../db.js';
import { round2 } from '../lib/facturacion.js';
import { traerPorIds, traerTodo } from '../lib/consultas.js';
import { diaSemanaHn, fechaHn, filtrarRango, finDelDia, horaHn, inicioDelDia } from '../lib/fechas.js';

export const reportes = Router();

const SELECT_VENTA = [
  'id, sucursal_id, numero_factura, correlativo, cliente_id, cajero_id',
  'subtotal_exento, subtotal_exonerado, subtotal_gravado_15, descuento, descuento_porcentaje',
  'isv_total, total, cambio, fecha_emision, anulada',
  'sucursales(nombre), clientes(nombre, rtn, es_consumidor_final), perfiles(nombre), puntos_emision(es_borrador)',
  'venta_pagos(monto, formas_pago(nombre))',
  'detalle_venta(producto_id, nombre_producto, cantidad, monto, descuento, descuento_porcentaje)',
].join(', ');

const n = (v) => Number(v ?? 0);
const pct = (parte, total) => (total > 0 ? round2((parte / total) * 100) : 0);

function sumar(mapa, clave, inicial, fn) {
  const acc = mapa.get(clave) ?? inicial();
  fn(acc);
  mapa.set(clave, acc);
}

function redondearTodo(obj) {
  for (const k of Object.keys(obj)) if (typeof obj[k] === 'number' && !Number.isInteger(obj[k])) obj[k] = round2(obj[k]);
  return obj;
}

async function ventasDelRango({ sucursal_id, fechaInicio, fechaFin }) {
  return traerTodo(() => {
    let q = db.from('ventas').select(SELECT_VENTA).eq('estado', 'pagada');
    if (sucursal_id) q = q.eq('sucursal_id', sucursal_id);
    q = filtrarRango(q, 'fecha_emision', fechaInicio, fechaFin);
    return q.order('fecha_emision', { ascending: true }).order('id', { ascending: true });
  });
}

// Notas de crédito del período (cuentan en el mes en que se emiten, que es
// como se declaran). Las de anulación total ya salen del reporte porque la
// factura queda "anulada"; aquí interesan sobre todo las parciales.
async function notasDelRango({ sucursal_id, fechaInicio, fechaFin }) {
  const notas = await traerTodo(() => {
    let q = db
      .from('notas_credito')
      .select('id, venta_id, numero_nota, motivo, monto, estado, created_at, usuario:usuario_id(nombre), ventas(numero_factura, sucursal_id, total, isv_total, anulada, sucursales(nombre), puntos_emision(es_borrador))')
      .neq('estado', 'anulada');
    q = filtrarRango(q, 'created_at', fechaInicio, fechaFin);
    return q.order('created_at', { ascending: true }).order('id', { ascending: true });
  });
  return sucursal_id ? notas.filter((nc) => nc.ventas?.sucursal_id === sucursal_id) : notas;
}

async function categoriasPorProducto(ids) {
  if (ids.length === 0) return new Map();
  const productos = await traerPorIds(
    () => db.from('productos').select('id, categorias(nombre)').order('id'),
    'id',
    ids
  );
  return new Map(productos.map((p) => [p.id, p.categorias?.nombre ?? 'Sin categoría']));
}

async function gastosDelRango({ sucursal_id, fechaInicio, fechaFin }) {
  return traerTodo(() => {
    let q = db.from('caja_chica').select('id, sucursal_id, tipo, monto, fecha');
    if (sucursal_id) q = q.eq('sucursal_id', sucursal_id);
    if (fechaInicio) q = q.gte('fecha', fechaInicio.slice(0, 10));
    if (fechaFin) q = q.lte('fecha', fechaFin.slice(0, 10));
    return q.order('fecha').order('id');
  });
}

function formaDePago(nombre) {
  const t = String(nombre ?? '').toLowerCase();
  if (t === 'efectivo') return 'Efectivo';
  if (t === 'tarjeta') return 'Tarjeta';
  if (t === 'transferencia') return 'Transferencia';
  return nombre || 'Otro';
}

function kpis(validas, anuladas, notasParciales) {
  const ventas = validas.reduce((s, v) => s + n(v.total), 0);
  const descuentos = validas.reduce((s, v) => s + n(v.descuento), 0);
  const nc = notasParciales.reduce((s, x) => s + n(x.monto), 0);
  const unidades = validas.reduce((s, v) => s + (v.detalle_venta ?? []).reduce((a, d) => a + n(d.cantidad), 0), 0);
  return redondearTodo({
    ventas_brutas: ventas + descuentos,
    descuentos,
    ventas,
    notas_credito: nc,
    ventas_netas: ventas - nc,
    isv: validas.reduce((s, v) => s + n(v.isv_total), 0),
    facturas: validas.length,
    ticket_promedio: validas.length > 0 ? ventas / validas.length : 0,
    unidades,
    anuladas: anuladas.length,
    monto_anulado: anuladas.reduce((s, v) => s + n(v.total), 0),
  });
}

// Resumen fiscal de un grupo de facturas (fiscales o borrador) con el rango
// de numeración emitido por sucursal — lo que pide el contador para la
// declaración.
function resumenFiscal(lista, notas) {
  const validas = lista.filter((v) => !v.anulada);
  const ncIsv = notas.reduce((s, nc) => {
    const total = n(nc.ventas?.total);
    return s + (total > 0 ? (n(nc.monto) * n(nc.ventas?.isv_total)) / total : 0);
  }, 0);
  // Rango por sucursal y serie (prefijo sin los 8 dígitos del correlativo),
  // comparando el correlativo como número y no como texto.
  const rangos = new Map();
  for (const v of lista) {
    if (!v.numero_factura) continue;
    const serie = v.numero_factura.slice(0, -8);
    const correlativo = n(v.correlativo) || Number(v.numero_factura.slice(-8));
    sumar(rangos, `${v.sucursal_id}|${serie}`, () => ({ sucursal: v.sucursales?.nombre ?? '', serie, min: correlativo, max: correlativo, emitidas: 0, anuladas: 0 }), (r) => {
      r.min = Math.min(r.min, correlativo);
      r.max = Math.max(r.max, correlativo);
      r.emitidas += 1;
      if (v.anulada) r.anuladas += 1;
    });
  }
  const listaRangos = [...rangos.values()].map(({ serie, min, max, ...r }) => ({
    ...r,
    desde: `${serie}${String(min).padStart(8, '0')}`,
    hasta: `${serie}${String(max).padStart(8, '0')}`,
    // Si emitidas < (hasta − desde + 1) hay números del rango que no aparecen
    // en el período (p. ej. se emitieron fuera de las fechas filtradas).
    huecos: Math.max(0, max - min + 1 - r.emitidas),
  }));
  const porMes = new Map();
  for (const v of validas) {
    const mes = fechaHn(v.fecha_emision).slice(0, 7);
    sumar(porMes, mes, () => ({ mes, exento: 0, exonerado: 0, gravado_15: 0, isv: 0, total: 0, facturas: 0 }), (m) => {
      m.exento += n(v.subtotal_exento);
      m.exonerado += n(v.subtotal_exonerado);
      m.gravado_15 += n(v.subtotal_gravado_15);
      m.isv += n(v.isv_total);
      m.total += n(v.total);
      m.facturas += 1;
    });
  }
  return {
    ...redondearTodo({
      exento: validas.reduce((s, v) => s + n(v.subtotal_exento), 0),
      exonerado: validas.reduce((s, v) => s + n(v.subtotal_exonerado), 0),
      gravado_15: validas.reduce((s, v) => s + n(v.subtotal_gravado_15), 0),
      isv: validas.reduce((s, v) => s + n(v.isv_total), 0),
      total: validas.reduce((s, v) => s + n(v.total), 0),
      notas_credito: notas.reduce((s, nc) => s + n(nc.monto), 0),
      isv_notas_credito: ncIsv,
    }),
    isv_neto: round2(validas.reduce((s, v) => s + n(v.isv_total), 0) - ncIsv),
    facturas: validas.length,
    anuladas: lista.length - validas.length,
    rangos: listaRangos.sort((a, b) => a.sucursal.localeCompare(b.sucursal) || a.desde.localeCompare(b.desde)),
    por_mes: [...porMes.values()].map(redondearTodo).sort((a, b) => a.mes.localeCompare(b.mes)),
  };
}

async function construirReporte(filtros) {
  const [ventas, notas, gastos] = await Promise.all([ventasDelRango(filtros), notasDelRango(filtros), gastosDelRango(filtros)]);
  const validas = ventas.filter((v) => !v.anulada);
  const anuladas = ventas.filter((v) => v.anulada);
  const notasParciales = notas.filter((nc) => !nc.ventas?.anulada);

  const idsProducto = validas.flatMap((v) => (v.detalle_venta ?? []).map((d) => d.producto_id));
  const categoriaDe = await categoriasPorProducto(idsProducto);

  const total = validas.reduce((s, v) => s + n(v.total), 0);

  const porDia = new Map();
  const porHora = Array.from({ length: 24 }, (_, hora) => ({ hora, facturas: 0, total: 0 }));
  const calor = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
  const porDiaSemana = Array.from({ length: 7 }, (_, dia) => ({ dia, facturas: 0, total: 0, fechas: new Set() }));
  const porSucursal = new Map();
  const porForma = new Map();
  const porCajero = new Map();
  const porProducto = new Map();
  const porCategoria = new Map();
  const porCliente = new Map();
  const descuentos = new Map();

  for (const v of ventas) {
    const sucursal = v.sucursales?.nombre ?? 'Sin sucursal';
    const cajero = v.perfiles?.nombre ?? 'Sin cajero';
    sumar(porSucursal, v.sucursal_id, () => ({ sucursal_id: v.sucursal_id, nombre: sucursal, facturas: 0, total: 0, descuentos: 0, anuladas: 0, monto_anulado: 0 }), (s) => {
      if (v.anulada) {
        s.anuladas += 1;
        s.monto_anulado += n(v.total);
      } else {
        s.facturas += 1;
        s.total += n(v.total);
        s.descuentos += n(v.descuento);
      }
    });
    sumar(porCajero, v.cajero_id ?? 'x', () => ({ nombre: cajero, facturas: 0, total: 0, con_descuento: 0, descuentos: 0, anuladas: 0 }), (c) => {
      if (v.anulada) c.anuladas += 1;
      else {
        c.facturas += 1;
        c.total += n(v.total);
        if (n(v.descuento) > 0) {
          c.con_descuento += 1;
          c.descuentos += n(v.descuento);
        }
      }
    });
    if (v.anulada) continue;

    const fecha = fechaHn(v.fecha_emision);
    const hora = horaHn(v.fecha_emision);
    const dia = diaSemanaHn(v.fecha_emision);
    sumar(porDia, fecha, () => ({ fecha, dia_semana: dia, facturas: 0, total: 0, descuentos: 0 }), (d) => {
      d.facturas += 1;
      d.total += n(v.total);
      d.descuentos += n(v.descuento);
    });
    porHora[hora].facturas += 1;
    porHora[hora].total += n(v.total);
    calor[dia][hora] += n(v.total);
    porDiaSemana[dia].facturas += 1;
    porDiaSemana[dia].total += n(v.total);
    porDiaSemana[dia].fechas.add(fecha);

    // Efectivo neto del cambio (el cambio sale de la gaveta).
    let efectivoVenta = 0;
    for (const p of v.venta_pagos ?? []) {
      const forma = formaDePago(p.formas_pago?.nombre);
      if (forma === 'Efectivo') {
        efectivoVenta += n(p.monto);
        continue;
      }
      sumar(porForma, forma, () => ({ nombre: forma, monto: 0, facturas: 0 }), (f) => {
        f.monto += n(p.monto);
        f.facturas += 1;
      });
    }
    if (efectivoVenta > 0 || n(v.cambio) > 0) {
      sumar(porForma, 'Efectivo', () => ({ nombre: 'Efectivo', monto: 0, facturas: 0 }), (f) => {
        f.monto += efectivoVenta - n(v.cambio);
        f.facturas += 1;
      });
    }

    for (const d of v.detalle_venta ?? []) {
      const clave = d.producto_id ?? d.nombre_producto;
      const categoria = categoriaDe.get(d.producto_id) ?? 'Sin categoría';
      sumar(porProducto, clave, () => ({ nombre: d.nombre_producto, categoria, cantidad: 0, total: 0, facturas: 0 }), (p) => {
        p.cantidad += n(d.cantidad);
        p.total += n(d.monto);
        p.facturas += 1;
      });
      sumar(porCategoria, categoria, () => ({ nombre: categoria, cantidad: 0, total: 0 }), (c) => {
        c.cantidad += n(d.cantidad);
        c.total += n(d.monto);
      });
    }

    if (v.clientes && !v.clientes.es_consumidor_final) {
      sumar(porCliente, v.cliente_id, () => ({ nombre: v.clientes.nombre, rtn: v.clientes.rtn ?? '', facturas: 0, total: 0, ultima: v.fecha_emision }), (c) => {
        c.facturas += 1;
        c.total += n(v.total);
        c.ultima = v.fecha_emision;
      });
    }

    // Descuento por producto: se agrupa por el porcentaje de cada línea
    // (una misma factura puede tener 10% y 25% de tercera edad).
    const lineasConDescuento = (v.detalle_venta ?? []).filter((d) => n(d.descuento) > 0);
    const porcentajesVenta = new Set();
    for (const d of lineasConDescuento) {
      const pctDesc = n(d.descuento_porcentaje) || n(v.descuento_porcentaje);
      sumar(descuentos, pctDesc, () => ({ porcentaje: pctDesc, facturas: 0, monto: 0, ventas: 0, unidades: 0 }), (x) => {
        if (!porcentajesVenta.has(pctDesc)) x.facturas += 1;
        x.monto += n(d.descuento);
        x.ventas += n(d.monto);
        x.unidades += n(d.cantidad);
      });
      porcentajesVenta.add(pctDesc);
    }
    if (lineasConDescuento.length === 0 && n(v.descuento) > 0) {
      const pctDesc = n(v.descuento_porcentaje);
      sumar(descuentos, pctDesc, () => ({ porcentaje: pctDesc, facturas: 0, monto: 0, ventas: 0, unidades: 0 }), (x) => {
        x.facturas += 1;
        x.monto += n(v.descuento);
        x.ventas += n(v.total);
      });
    }
  }

  const totalFormas = [...porForma.values()].reduce((s, f) => s + f.monto, 0);
  const gastosTotal = gastos.reduce((s, g) => s + n(g.monto), 0);
  const gastosPorTipo = new Map();
  for (const g of gastos) sumar(gastosPorTipo, g.tipo ?? 'Otros', () => ({ tipo: g.tipo ?? 'Otros', monto: 0, movimientos: 0 }), (t) => {
    t.monto += n(g.monto);
    t.movimientos += 1;
  });

  const esBorrador = (v) => v.puntos_emision?.es_borrador ?? true;
  const fiscales = ventas.filter((v) => !esBorrador(v));
  const borrador = ventas.filter(esBorrador);
  const ncFiscales = notasParciales.filter((nc) => !(nc.ventas?.puntos_emision?.es_borrador ?? true));
  const ncBorrador = notasParciales.filter((nc) => nc.ventas?.puntos_emision?.es_borrador ?? true);

  return {
    kpis: kpis(validas, anuladas, notasParciales),
    por_dia: [...porDia.values()].map((d) => redondearTodo({ ...d, ticket_promedio: d.facturas ? d.total / d.facturas : 0 })).sort((a, b) => a.fecha.localeCompare(b.fecha)),
    por_hora: porHora.map(redondearTodo),
    calor: calor.map((fila) => fila.map(round2)),
    por_dia_semana: porDiaSemana.map(({ fechas, ...d }) =>
      redondearTodo({ ...d, dias: fechas.size, promedio_dia: fechas.size ? d.total / fechas.size : 0 })
    ),
    por_sucursal: [...porSucursal.values()]
      .map((s) => redondearTodo({ ...s, ticket_promedio: s.facturas ? s.total / s.facturas : 0, participacion: pct(s.total, total) }))
      .sort((a, b) => b.total - a.total),
    por_forma_pago: [...porForma.values()]
      .map((f) => redondearTodo({ ...f, participacion: pct(f.monto, totalFormas) }))
      .sort((a, b) => b.monto - a.monto),
    por_cajero: [...porCajero.values()]
      .map((c) => redondearTodo({ ...c, ticket_promedio: c.facturas ? c.total / c.facturas : 0 }))
      .sort((a, b) => b.total - a.total),
    productos: [...porProducto.values()]
      .map((p) => redondearTodo({ ...p, precio_promedio: p.cantidad ? p.total / p.cantidad : 0, participacion: pct(p.total, total) }))
      .sort((a, b) => b.total - a.total),
    por_categoria: [...porCategoria.values()]
      .map((c) => redondearTodo({ ...c, participacion: pct(c.total, total) }))
      .sort((a, b) => b.total - a.total),
    clientes: [...porCliente.values()].map(redondearTodo).sort((a, b) => b.total - a.total).slice(0, 50),
    descuentos: [...descuentos.values()].map(redondearTodo).sort((a, b) => a.porcentaje - b.porcentaje),
    anuladas: anuladas.map((v) => ({
      numero_factura: v.numero_factura,
      fecha: v.fecha_emision,
      sucursal: v.sucursales?.nombre ?? '',
      cliente: v.clientes?.nombre ?? 'Consumidor Final',
      cajero: v.perfiles?.nombre ?? '',
      total: n(v.total),
    })),
    notas_credito: notas.map((nc) => ({
      numero_nota: nc.numero_nota,
      numero_factura: nc.ventas?.numero_factura ?? '',
      sucursal: nc.ventas?.sucursales?.nombre ?? '',
      fecha: nc.created_at,
      monto: n(nc.monto),
      motivo: nc.motivo,
      usuario: nc.usuario?.nombre ?? '',
      tipo: nc.ventas?.anulada ? 'Anulación total' : 'Parcial',
    })),
    isv: { fiscal: resumenFiscal(fiscales, ncFiscales), borrador: resumenFiscal(borrador, ncBorrador) },
    gastos: redondearTodo({ total: gastosTotal, movimientos: gastos.length }),
    gastos_por_tipo: [...gastosPorTipo.values()].map(redondearTodo).sort((a, b) => b.monto - a.monto),
    libro_ventas: ventas.map((v) => ({
      fecha: v.fecha_emision,
      numero_factura: v.numero_factura,
      sucursal: v.sucursales?.nombre ?? '',
      cliente: v.clientes?.nombre ?? 'Consumidor Final',
      rtn: v.clientes?.rtn ?? '',
      cajero: v.perfiles?.nombre ?? '',
      exento: n(v.subtotal_exento),
      exonerado: n(v.subtotal_exonerado),
      gravado_15: n(v.subtotal_gravado_15),
      isv: n(v.isv_total),
      descuento: n(v.descuento),
      total: n(v.total),
      anulada: v.anulada,
      borrador: esBorrador(v),
    })),
  };
}

// Mismo número de días inmediatamente antes (ej. 1–27 sep → 5–31 ago).
function rangoAnterior(fechaInicio, fechaFin) {
  const DIA = 86400000;
  const inicio = new Date(inicioDelDia(fechaInicio));
  const fin = new Date(finDelDia(fechaFin));
  const dias = Math.max(1, Math.round((fin - inicio) / DIA));
  const finAnterior = new Date(inicio.getTime() - 1);
  const inicioAnterior = new Date(inicio.getTime() - dias * DIA);
  return { fechaInicio: inicioAnterior.toISOString(), fechaFin: finAnterior.toISOString(), dias };
}

reportes.get('/completo', async (req, res) => {
  try {
    const { sucursal_id, fechaInicio, fechaFin } = req.query;
    if (!fechaInicio || !fechaFin) return res.status(400).json({ error: 'Elige el rango de fechas' });
    if (fechaFin < fechaInicio) return res.status(400).json({ error: 'La fecha final es anterior a la inicial' });
    const filtros = { sucursal_id: sucursal_id || null, fechaInicio, fechaFin };
    const anterior = rangoAnterior(fechaInicio, fechaFin);

    const [reporte, previo] = await Promise.all([
      construirReporte(filtros),
      Promise.all([ventasDelRango({ ...filtros, ...anterior }), notasDelRango({ ...filtros, ...anterior })]),
    ]);
    const [ventasPrevias, notasPrevias] = previo;
    reporte.kpis_anterior = kpis(
      ventasPrevias.filter((v) => !v.anulada),
      ventasPrevias.filter((v) => v.anulada),
      notasPrevias.filter((nc) => !nc.ventas?.anulada)
    );
    reporte.rango_anterior = { desde: fechaHn(anterior.fechaInicio), hasta: fechaHn(anterior.fechaFin) };
    res.json(reporte);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
```

### `backend/routes/sucursales.js`

```js
import { Router } from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/requireRole.js';
import { registrarAuditoria } from '../lib/auditoria.js';

export const sucursales = Router();

const COLOR_VALIDO = /^#[0-9a-fA-F]{6}$/;

// El color existe justamente para no confundir sucursales: dos sucursales
// activas nunca pueden compartirlo.
async function colorEnUso(color, excepto) {
  let query = db.from('sucursales').select('id, nombre').eq('activo', true).ilike('color', color);
  if (excepto) query = query.neq('id', excepto);
  const { data } = await query.limit(1);
  return data?.[0] ?? null;
}

sucursales.get('/', async (req, res) => {
  const { data, error } = await db.from('sucursales').select('*').eq('activo', true).order('nombre');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Alta de una sucursal nueva: crea también su punto de emisión en modo
// borrador (sin CAI todavía) con un código de punto de emisión sugerido
// (siguiente disponible). El esquema no tiene límite de sucursales — esto
// es lo único que hace falta para agregar la número 5, 6, etc.
sucursales.post('/', requireRole('admin'), async (req, res) => {
  const { nombre, alias, direccion, color } = req.body;
  if (!nombre || !alias || !direccion) {
    return res.status(400).json({ error: 'nombre, alias y dirección son obligatorios' });
  }
  if (color && !COLOR_VALIDO.test(color)) return res.status(400).json({ error: 'Color inválido' });
  if (color) {
    const otra = await colorEnUso(color);
    if (otra) return res.status(409).json({ error: `Ese color ya lo usa "${otra.nombre}" — elige otro.` });
  }

  const { data: sucursal, error } = await db
    .from('sucursales')
    .insert({ nombre, alias, direccion, color: color ?? null })
    .select()
    .single();
  if (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: `Ya existe una sucursal con el alias "${alias}" — usa uno distinto.` });
    }
    return res.status(400).json({ error: error.message });
  }

  const { count } = await db.from('puntos_emision').select('id', { count: 'exact', head: true });
  const siguienteCodigo = String((count ?? 0) + 1).padStart(3, '0');

  const { data: puntoEmision, error: errPunto } = await db
    .from('puntos_emision')
    .insert({
      sucursal_id: sucursal.id,
      punto_emision_codigo: siguienteCodigo,
      punto_venta_codigo: '001',
      tipo_documento_codigo: '01',
      cai: null,
      correlativo_desde: 1,
      correlativo_hasta: 99999999,
      correlativo_actual: 1,
      fecha_limite_emision: null,
      es_borrador: true,
    })
    .select()
    .single();
  if (errPunto) return res.status(500).json({ error: errPunto.message });

  res.status(201).json({ ...sucursal, punto_emision: puntoEmision });
});

sucursales.put('/:id', requireRole('admin'), async (req, res) => {
  const { nombre, direccion, activo, color } = req.body;
  if (color !== undefined && !COLOR_VALIDO.test(color)) return res.status(400).json({ error: 'Color inválido' });
  if (color) {
    const otra = await colorEnUso(color, req.params.id);
    if (otra) return res.status(409).json({ error: `Ese color ya lo usa "${otra.nombre}" — elige otro.` });
  }
  const { data: anterior } = await db.from('sucursales').select('*').eq('id', req.params.id).maybeSingle();
  const { data, error } = await db
    .from('sucursales')
    .update({ nombre, direccion, activo, color })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  if (anterior) {
    const cambios = {};
    for (const campo of ['nombre', 'direccion', 'activo', 'color']) {
      if (String(anterior[campo]) !== String(data[campo])) cambios[campo] = { antes: anterior[campo], despues: data[campo] };
    }
    if (Object.keys(cambios).length > 0) {
      await registrarAuditoria(req, {
        accion: 'sucursal.editar',
        entidad: 'sucursal',
        entidadId: data.id,
        sucursalId: data.id,
        detalle: { nombre: data.nombre, cambios },
      });
    }
  }
  res.json(data);
});
```

### `backend/routes/usuarios.js`

```js
import { Router } from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/requireRole.js';
import { registrarAuditoria } from '../lib/auditoria.js';
import { accesoAEmail, accesoVisible, claveInterna } from '../lib/acceso.js';
import { crearAlerta } from '../lib/alertas.js';

export const usuarios = Router();

usuarios.get('/', requireRole('admin'), async (req, res) => {
  const { data, error } = await db.from('perfiles').select('*, sucursales(nombre)').order('nombre');
  if (error) return res.status(500).json({ error: error.message });

  const { data: authData } = await db.auth.admin.listUsers({ perPage: 200 });
  const authPorId = new Map((authData?.users ?? []).map((u) => [u.id, u]));
  res.json(data.map((u) => ({ ...u, acceso: accesoVisible(authPorId.get(u.id)) })));
});

// Crea el usuario en Supabase Auth y su perfil en un solo paso — así Juan no
// depende del dashboard de Supabase para dar de alta a un cajero nuevo.
usuarios.post('/', requireRole('admin'), async (req, res) => {
  const { acceso, password, nombre, rol, sucursal_id, cierre_ciego, sin_horario } = req.body;
  if (!String(acceso ?? '').trim() || !password || !String(nombre ?? '').trim()) {
    return res.status(400).json({ error: 'Usuario (o correo), contraseña y nombre son obligatorios' });
  }
  // Sin mínimo de largo ni restricción de caracteres: decisión de Juan.
  const usuarioEscrito = String(acceso).normalize('NFC').trim().replace(/\s+/g, ' ');

  let email;
  try {
    email = accesoAEmail(acceso);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  const { data: authData, error: authError } = await db.auth.admin.createUser({
    email,
    password: claveInterna(password),
    email_confirm: true,
    user_metadata: { usuario: usuarioEscrito.includes('@') ? usuarioEscrito.toLowerCase() : usuarioEscrito },
  });
  if (authError) {
    const yaExiste = /already|registered|exists/i.test(authError.message);
    return res.status(400).json({ error: yaExiste ? `Ya existe un usuario "${usuarioEscrito}"` : authError.message });
  }
  const accesoMostrado = accesoVisible(authData.user);

  const { data: perfil, error: perfilError } = await db
    .from('perfiles')
    .insert({
      id: authData.user.id,
      nombre,
      rol: rol ?? 'cajero',
      sucursal_id: sucursal_id ?? null,
      cierre_ciego: !!cierre_ciego,
      sin_horario: !!sin_horario,
    })
    .select()
    .single();
  if (perfilError) {
    await db.auth.admin.deleteUser(authData.user.id);
    return res.status(500).json({ error: perfilError.message });
  }

  await registrarAuditoria(req, {
    accion: 'usuario.crear',
    entidad: 'usuario',
    entidadId: perfil.id,
    sucursalId: perfil.sucursal_id,
    detalle: { nombre, acceso: accesoMostrado, rol: perfil.rol },
  });
  // Altas, cambios de rol y de contraseña: quien controla usuarios controla
  // todo el sistema. Siempre avisa a los administradores.
  await crearAlerta(req, {
    tipo: 'usuario.crear',
    severidad: perfil.rol === 'cajero' ? 'media' : 'alta',
    titulo: `Nuevo usuario "${accesoMostrado}" (${perfil.rol}) creado por ${req.perfil.nombre}`,
    sucursalId: perfil.sucursal_id,
    entidad: 'usuario',
    entidadId: perfil.id,
    correo: perfil.rol !== 'cajero',
    detalle: { nombre, usuario: accesoMostrado, rol: perfil.rol },
  });
  res.status(201).json({ ...perfil, acceso: accesoMostrado });
});

usuarios.put('/:id', requireRole('admin'), async (req, res) => {
  const { nombre, rol, sucursal_id, cierre_ciego, sin_horario, activo } = req.body;
  const { data: anterior } = await db.from('perfiles').select('*').eq('id', req.params.id).maybeSingle();
  const { data, error } = await db
    .from('perfiles')
    .update({ nombre, rol, sucursal_id, cierre_ciego, sin_horario, activo })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  if (anterior) {
    const cambios = {};
    for (const campo of ['nombre', 'rol', 'sucursal_id', 'cierre_ciego', 'sin_horario', 'activo']) {
      if (String(anterior[campo]) !== String(data[campo])) cambios[campo] = { antes: anterior[campo], despues: data[campo] };
    }
    if (Object.keys(cambios).length > 0) {
      await registrarAuditoria(req, {
        accion: 'usuario.editar',
        entidad: 'usuario',
        entidadId: data.id,
        sucursalId: data.sucursal_id,
        detalle: { nombre: data.nombre, cambios },
      });
      const sensible = cambios.rol || cambios.sin_horario || cambios.cierre_ciego || cambios.activo;
      if (sensible) {
        const partes = Object.entries(cambios).map(([k, c]) => `${k}: ${c.antes ?? '—'} → ${c.despues ?? '—'}`);
        await crearAlerta(req, {
          tipo: 'usuario.permisos',
          severidad: cambios.rol ? 'alta' : 'media',
          titulo: `Cambió permisos de ${data.nombre} (${partes.join(', ')})`,
          sucursalId: data.sucursal_id,
          entidad: 'usuario',
          entidadId: data.id,
          correo: Boolean(cambios.rol),
          detalle: { usuario: data.nombre, cambios: partes.join(' · '), por: req.perfil.nombre },
        });
      }
    }
  }
  res.json(data);
});

// Para que Juan pueda resetear la contraseña de un cajero sin tener que
// entrar al dashboard de Supabase.
usuarios.post('/:id/reset-password', requireRole('admin'), async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Escribe la contraseña nueva' });
  const { error } = await db.auth.admin.updateUserById(req.params.id, { password: claveInterna(password) });
  if (error) return res.status(400).json({ error: error.message });
  await registrarAuditoria(req, {
    accion: 'usuario.cambiar_contrasena',
    entidad: 'usuario',
    entidadId: req.params.id,
  });
  const { data: afectado } = await db.from('perfiles').select('nombre, sucursal_id, rol').eq('id', req.params.id).maybeSingle();
  await crearAlerta(req, {
    tipo: 'usuario.contrasena',
    severidad: afectado?.rol === 'admin' ? 'alta' : 'media',
    titulo: `Se cambió la contraseña de ${afectado?.nombre ?? 'un usuario'} (por ${req.perfil.nombre})`,
    sucursalId: afectado?.sucursal_id ?? null,
    entidad: 'usuario',
    entidadId: req.params.id,
    correo: afectado?.rol === 'admin',
    detalle: { usuario: afectado?.nombre ?? '', por: req.perfil.nombre },
  });
  res.json({ ok: true });
});
```

### `backend/routes/ventas.js`

```js
import { Router } from 'express';
import { db } from '../db.js';
import {
  calcularTotales,
  descuentoDeLinea,
  PORCENTAJES_DESCUENTO,
  round2,
} from '../lib/facturacion.js';
import { generarPdfFacturaBuffer } from '../lib/pdf.js';
import { enviarFacturaCliente } from '../lib/correo.js';
import { registrarAuditoria } from '../lib/auditoria.js';
import { crearAlerta } from '../lib/alertas.js';
import { normalizarIdentidad, revisarDobleFactura, revisarTerceraEdad } from '../lib/antifraude.js';
import { obtenerReglas } from '../lib/reglas.js';
import { textoSeguroFiltro } from '../lib/consultas.js';
import { filtrarRango } from '../lib/fechas.js';

export const ventas = Router();

// Monto a partir del cual se exige RTN del cliente (mismo criterio que el
// "limiteRTN" que ya usaba WizPOS para esta empresa: L10,000).
export const UMBRAL_RTN_OBLIGATORIO = 10000;

// Sucursal fija de un cajero (null para admin/manager o cajero "flotante").
export function sucursalDelCajero(perfil) {
  return perfil?.rol === 'cajero' && perfil.sucursal_id ? perfil.sucursal_id : null;
}

function sucursalAjena(perfil, sucursalId) {
  const propia = sucursalDelCajero(perfil);
  return Boolean(propia && sucursalId && propia !== sucursalId);
}

// Un cajero tocando órdenes de otra sucursal: se bloquea y queda registrado.
function registrarSucursalAjena(req, sucursalId) {
  registrarAuditoria(req, {
    accion: 'acceso.denegado',
    entidad: 'sistema',
    sucursalId: req.perfil.sucursal_id,
    detalle: { metodo: req.method, ruta: req.originalUrl.split('?')[0], motivo: 'otra sucursal', sucursal_intentada: sucursalId },
  });
}

export async function obtenerPuntoEmisionActivo(sucursal_id) {
  const { data, error } = await db
    .from('puntos_emision')
    .select('*')
    .eq('sucursal_id', sucursal_id)
    .eq('activo', true)
    .single();
  if (error) throw new Error('La sucursal no tiene un punto de emisión activo');
  return data;
}

// Sin cliente (o con un id que ya no existe) la factura SIEMPRE sale a
// nombre de Consumidor Final — nunca queda una venta sin cliente asignado.
export async function obtenerCliente(cliente_id) {
  if (cliente_id) {
    const { data } = await db.from('clientes').select('*').eq('id', cliente_id).maybeSingle();
    if (data) return data;
  }
  const { data: consumidorFinal } = await db
    .from('clientes')
    .select('*')
    .eq('es_consumidor_final', true)
    .limit(1)
    .maybeSingle();
  if (!consumidorFinal) throw new Error('No existe el cliente "Consumidor Final" en la base de datos');
  return consumidorFinal;
}

function validarPorcentaje(valor) {
  const porcentaje = Number(valor ?? 0);
  if (!PORCENTAJES_DESCUENTO.includes(porcentaje)) {
    throw new Error('El descuento sólo puede ser 10% o 25% (tercera edad)');
  }
  return porcentaje;
}

// porcentajeGeneral: compatibilidad con cajas que aún mandan un solo
// descuento para toda la orden (versión anterior de la app).
async function construirItems(itemsSolicitados, puedeEditarPrecio, porcentajeGeneral = 0) {
  const productoIds = itemsSolicitados.map((i) => i.producto_id);
  const { data: productosDb, error } = await db.from('productos').select('*').in('id', productoIds);
  if (error) throw new Error(error.message);
  const porId = new Map(productosDb.map((p) => [p.id, p]));

  return itemsSolicitados.map((item) => {
    const producto = porId.get(item.producto_id);
    if (!producto) throw new Error(`Producto ${item.producto_id} no existe o está inactivo`);
    // Una cantidad negativa o cero bajaba el total de la factura (y el ISV).
    const cantidad = Number(item.cantidad);
    if (!Number.isFinite(cantidad) || cantidad <= 0 || cantidad > 9999) {
      throw new Error(`Cantidad inválida para ${producto.nombre}`);
    }
    const precio_unitario =
      puedeEditarPrecio && item.precio_unitario !== undefined ? Number(item.precio_unitario) : producto.precio;
    if (!Number.isFinite(Number(precio_unitario)) || Number(precio_unitario) < 0) {
      throw new Error(`Precio inválido para ${producto.nombre}`);
    }
    const porcentaje = validarPorcentaje(item.descuento_porcentaje ?? porcentajeGeneral);
    return {
      producto_id: producto.id,
      nombre_producto: producto.nombre,
      cantidad,
      precio_unitario: Number(precio_unitario),
      descuento: descuentoDeLinea(precio_unitario, cantidad, porcentaje),
      descuento_porcentaje: porcentaje,
      impuesto_tasa: producto.impuesto1_tasa,
    };
  });
}

// calcularLineas() (backend/lib/facturacion.js) agrega "base", "isv" y
// "bucket" a cada línea para calcular los subtotales fiscales — son campos
// de trabajo, no columnas de la tabla, así que se arma la fila explícita.
export async function guardarDetalle(venta_id, lineas) {
  await db.from('detalle_venta').delete().eq('venta_id', venta_id);
  const filas = lineas.map((l) => ({
    venta_id,
    producto_id: l.producto_id ?? null,
    nombre_producto: l.nombre_producto,
    cantidad: l.cantidad,
    precio_unitario: l.precio_unitario,
    descuento: l.descuento,
    descuento_porcentaje: l.descuento_porcentaje ?? 0,
    impuesto_tasa: l.impuesto_tasa,
    monto: l.monto,
  }));
  const { error } = await db.from('detalle_venta').insert(filas);
  if (error) throw new Error(error.message);
}

function resumenItems(lineas) {
  return lineas.map(
    (l) => `${Number(l.cantidad)}× ${l.nombre_producto}${Number(l.descuento_porcentaje) ? ` (-${Number(l.descuento_porcentaje)}%)` : ''}`
  );
}

// Quién recibe el descuento de tercera edad (nombre + No. de identidad o
// carné). Se guarda en la venta y se exige al cobrar.
function datosTerceraEdad(body) {
  const te = body?.tercera_edad ?? {};
  const identidad = normalizarIdentidad(te.identidad);
  const nombre = String(te.nombre ?? '').trim().slice(0, 120);
  return { tercera_edad_identidad: identidad || null, tercera_edad_nombre: nombre || null };
}

async function calcularOrden(req, { cliente_id, items, descuento_porcentaje }) {
  const porcentajeGeneral = validarPorcentaje(descuento_porcentaje);
  const cliente = await obtenerCliente(cliente_id);
  const puedeEditarPrecio = req.perfil.rol !== 'cajero';
  const lineas = await construirItems(items, puedeEditarPrecio, porcentajeGeneral);
  // Resumen para la venta: el mayor porcentaje aplicado en alguna línea.
  const porcentaje = Math.max(0, ...lineas.map((l) => l.descuento_porcentaje));
  return { porcentaje, cliente, totales: calcularTotales(lineas, cliente, 0) };
}

ventas.post('/', async (req, res) => {
  try {
    const { sucursal_id, tipo_orden, items, nota_interna } = req.body;
    if (!sucursal_id) return res.status(400).json({ error: 'sucursal_id es obligatorio' });
    if (sucursalAjena(req.perfil, sucursal_id)) {
      registrarSucursalAjena(req, sucursal_id);
      return res.status(403).json({ error: 'No puedes facturar en otra sucursal' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'La orden necesita al menos un producto' });
    }

    const puntoEmision = await obtenerPuntoEmisionActivo(sucursal_id);
    const { porcentaje, cliente, totales } = await calcularOrden(req, req.body);

    const { data: venta, error } = await db
      .from('ventas')
      .insert({
        sucursal_id,
        punto_emision_id: puntoEmision.id,
        cliente_id: cliente.id,
        cajero_id: req.perfil.id,
        tipo_orden: tipo_orden ?? null,
        nota_interna: nota_interna || null,
        estado: 'abierta',
        subtotal_exento: totales.subtotal_exento,
        subtotal_exonerado: totales.subtotal_exonerado,
        subtotal_gravado_15: totales.subtotal_gravado_15,
        descuento: totales.descuento,
        descuento_porcentaje: porcentaje,
        isv_total: totales.isv_total,
        total: totales.total,
        ...datosTerceraEdad(req.body),
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    try {
      await guardarDetalle(venta.id, totales.lineas);
    } catch (e) {
      // Sin detalle la orden no sirve: se borra para no dejar una orden
      // "abierta" vacía y huérfana en la lista de Órdenes Abiertas.
      await db.from('ventas').delete().eq('id', venta.id);
      throw e;
    }

    await registrarAuditoria(req, {
      accion: 'venta.crear_orden',
      entidad: 'venta',
      entidadId: venta.id,
      sucursalId: sucursal_id,
      detalle: { numero_orden: venta.numero_orden, total: venta.total, items: resumenItems(totales.lineas) },
    });
    res.status(201).json({ ...venta, es_borrador: puntoEmision.es_borrador });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

ventas.put('/:id', async (req, res) => {
  try {
    const { data: ventaActual, error: errBusqueda } = await db
      .from('ventas')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (errBusqueda || !ventaActual) return res.status(404).json({ error: 'Orden no encontrada' });
    if (sucursalAjena(req.perfil, ventaActual.sucursal_id)) {
      registrarSucursalAjena(req, ventaActual.sucursal_id);
      return res.status(403).json({ error: 'Esa orden es de otra sucursal' });
    }
    if (ventaActual.estado !== 'abierta') {
      return res.status(409).json({ error: 'Sólo se pueden editar órdenes abiertas' });
    }

    const { tipo_orden, items, nota_interna } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'La orden necesita al menos un producto' });
    }
    const { porcentaje, cliente, totales } = await calcularOrden(req, req.body);
    const { data: detalleAnterior } = await db.from('detalle_venta').select('cantidad, nombre_producto').eq('venta_id', req.params.id);

    const { data: venta, error } = await db
      .from('ventas')
      .update({
        cliente_id: cliente.id,
        tipo_orden: tipo_orden ?? null,
        nota_interna: nota_interna || null,
        subtotal_exento: totales.subtotal_exento,
        subtotal_exonerado: totales.subtotal_exonerado,
        subtotal_gravado_15: totales.subtotal_gravado_15,
        descuento: totales.descuento,
        descuento_porcentaje: porcentaje,
        isv_total: totales.isv_total,
        total: totales.total,
        ...datosTerceraEdad(req.body),
      })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw new Error(error.message);

    await guardarDetalle(venta.id, totales.lineas);

    // El autoguardado llama esto seguido; sólo se registra cuando algo
    // realmente cambió (productos, total, cliente o descuento).
    const itemsAntes = resumenItems(detalleAnterior ?? []);
    const itemsDespues = resumenItems(totales.lineas);
    const cambio =
      JSON.stringify(itemsAntes) !== JSON.stringify(itemsDespues) ||
      Number(ventaActual.total) !== Number(venta.total) ||
      ventaActual.cliente_id !== venta.cliente_id;
    if (cambio) {
      await registrarAuditoria(req, {
        accion: 'venta.editar_orden',
        entidad: 'venta',
        entidadId: venta.id,
        sucursalId: venta.sucursal_id,
        detalle: {
          numero_orden: venta.numero_orden,
          total_anterior: Number(ventaActual.total),
          total_nuevo: Number(venta.total),
          descuento_porcentaje: porcentaje,
          cliente: cliente.nombre,
          items_antes: itemsAntes,
          items_despues: itemsDespues,
        },
      });
    }
    res.json(venta);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

ventas.get('/', async (req, res) => {
  const { estado, q: qCruda, fechaInicio, fechaFin } = req.query;
  // Un cajero con sucursal fija sólo ve las facturas de su sucursal.
  const sucursal_id = sucursalDelCajero(req.perfil) ?? req.query.sucursal_id;
  const q = textoSeguroFiltro(qCruda);
  let query = db
    .from('ventas')
    .select('*, clientes(nombre, rtn), perfiles(nombre), venta_pagos(monto, formas_pago(nombre))')
    .order('created_at', { ascending: false })
    // Con rango de fechas (ej. detalle de un cierre de caja) se permiten más
    // filas; sin rango, las 200 más recientes bastan para la pantalla.
    .limit(fechaInicio && fechaFin ? 1000 : 200);

  if (estado) query = query.eq('estado', estado);
  if (sucursal_id) query = query.eq('sucursal_id', sucursal_id);
  query = filtrarRango(query, 'fecha_emision', fechaInicio, fechaFin);
  if (q) {
    // Además del No. de factura, busca por nombre del cliente — así no hay
    // que saber el número exacto para encontrar las facturas de alguien.
    const { data: clientesQueCoinciden } = await db.from('clientes').select('id').ilike('nombre', `%${q}%`);
    const idsCliente = (clientesQueCoinciden ?? []).map((c) => c.id);
    const filtroCliente = idsCliente.length > 0 ? `,cliente_id.in.(${idsCliente.join(',')})` : '';
    query = query.or(`numero_factura.ilike.%${q}%${filtroCliente}`);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Reenvía manualmente el correo de una factura ya emitida — para cuando
// falló la primera vez, o cuando el cliente pide que se le vuelva a mandar.
ventas.post('/:id/reenviar-correo', async (req, res) => {
  try {
    const ventaCompleta = await obtenerVentaCompleta(req.params.id);
    if (!ventaCompleta) return res.status(404).json({ error: 'Factura no encontrada' });
    if (ventaCompleta.estado !== 'pagada') {
      return res.status(409).json({ error: 'Sólo se puede enviar por correo una factura ya emitida' });
    }
    if (!ventaCompleta.clientes?.email) {
      return res.status(400).json({ error: 'El cliente de esta factura no tiene correo registrado' });
    }
    const pdfBuffer = await generarPdfFacturaBuffer(ventaCompleta);
    const resultado = await enviarFacturaCliente(ventaCompleta, pdfBuffer);
    await db
      .from('ventas')
      .update({ correo_enviado: resultado.enviado, correo_error: resultado.motivo ?? null })
      .eq('id', ventaCompleta.id);
    await registrarAuditoria(req, {
      accion: 'venta.reenviar_correo',
      entidad: 'venta',
      entidadId: ventaCompleta.id,
      sucursalId: ventaCompleta.sucursal_id,
      detalle: {
        numero_factura: ventaCompleta.numero_factura,
        destinatario: ventaCompleta.clientes.email,
        enviado: resultado.enviado,
      },
    });
    if (!resultado.enviado) return res.status(400).json({ error: resultado.motivo });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export async function obtenerVentaCompleta(id) {
  const { data: venta, error } = await db
    .from('ventas')
    .select('*, clientes(*), perfiles(nombre), sucursales(nombre, alias), puntos_emision(*), venta_pagos(monto, formas_pago(nombre))')
    .eq('id', id)
    .single();
  if (error || !venta) return null;

  const { data: detalle } = await db.from('detalle_venta').select('*').eq('venta_id', venta.id);
  return { ...venta, detalle };
}

ventas.get('/:id', async (req, res) => {
  const venta = await obtenerVentaCompleta(req.params.id);
  if (!venta || sucursalAjena(req.perfil, venta.sucursal_id)) return res.status(404).json({ error: 'Orden no encontrada' });
  res.json(venta);
});

ventas.delete('/:id', async (req, res) => {
  const venta = await obtenerVentaCompleta(req.params.id);
  if (!venta || sucursalAjena(req.perfil, venta.sucursal_id)) return res.status(404).json({ error: 'Orden no encontrada' });
  if (venta.estado !== 'abierta') {
    return res.status(409).json({ error: 'Sólo se pueden descartar órdenes abiertas' });
  }
  const reglas = await obtenerReglas();
  const motivo = String(req.query.motivo ?? '').trim().slice(0, 200);
  if (reglas.exigir_motivo_descarte && Number(venta.total) > 0 && !motivo) {
    return res.status(400).json({ error: 'Indica el motivo para descartar la orden' });
  }
  await db.from('detalle_venta').delete().eq('venta_id', req.params.id);
  await db.from('ventas').delete().eq('id', req.params.id);

  // Descartar una orden con productos es exactamente lo que se usaría para
  // ocultar un cobro en efectivo — queda la foto completa de lo que tenía.
  await registrarAuditoria(req, {
    accion: 'venta.descartar_orden',
    entidad: 'venta',
    entidadId: venta.id,
    sucursalId: venta.sucursal_id,
    detalle: {
      numero_orden: venta.numero_orden,
      total: Number(venta.total),
      cliente: venta.clientes?.nombre ?? 'Consumidor Final',
      items: resumenItems(venta.detalle ?? []),
      motivo: motivo || null,
    },
  });
  // Descartar una orden ya armada es la forma clásica de cobrar sin
  // facturar: si pasa de L 150 queda como alerta para revisar.
  if (Number(venta.total) >= reglas.monto_alerta_descarte) {
    await crearAlerta(req, {
      tipo: 'venta.descartar_orden',
      severidad: Number(venta.total) >= 500 ? 'alta' : 'media',
      titulo: `Orden descartada de L ${Number(venta.total).toFixed(2)} (${req.perfil.nombre})`,
      sucursalId: venta.sucursal_id,
      entidad: 'venta',
      entidadId: venta.id,
      detalle: { orden: venta.numero_orden, total: Number(venta.total), motivo: motivo || '(sin motivo)', productos: resumenItems(venta.detalle ?? []).join(', ') },
    });
  }
  res.status(204).end();
});

// Emite la factura de una venta: correlativo del CAI (atómico), pagos,
// bitácora y correo. Lo usan el POS (/pagar) y la conversión de una
// cotización de evento en factura.
export async function facturarVenta(req, ventaId, { pagos, efectivo_recibido, origen = 'pos' }) {
  if (!Array.isArray(pagos) || pagos.length === 0) {
    throw Object.assign(new Error('Debe indicar al menos una forma de pago'), { status: 400 });
  }

  const { data: venta, error: errVenta } = await db
    .from('ventas')
    .select('*, clientes(nombre, rtn, email, exento_impuestos)')
    .eq('id', ventaId)
    .single();
  if (errVenta || !venta) throw Object.assign(new Error('Orden no encontrada'), { status: 404 });
  if (sucursalAjena(req.perfil, venta.sucursal_id)) {
    throw Object.assign(new Error('Esa orden es de otra sucursal'), { status: 403 });
  }
  const { data: formasValidas } = await db.from('formas_pago').select('id');
  const idsFormas = new Set((formasValidas ?? []).map((f) => f.id));
  for (const p of pagos) {
    const monto = Number(p.monto);
    // Un monto negativo en una forma de pago inflaba otra (ej. efectivo) y
    // descuadraba el cierre.
    if (!Number.isFinite(monto) || monto <= 0) throw Object.assign(new Error('Cada pago debe ser mayor que 0'), { status: 400 });
    if (!idsFormas.has(p.forma_pago_id)) throw Object.assign(new Error('Forma de pago inválida'), { status: 400 });
  }

  if (Number(venta.total) > UMBRAL_RTN_OBLIGATORIO && !venta.clientes?.rtn) {
    throw Object.assign(
      new Error(`Se requiere el RTN del cliente para ventas mayores a L${UMBRAL_RTN_OBLIGATORIO.toLocaleString('es-HN')}`),
      { status: 400 }
    );
  }

  const reglas = await obtenerReglas();
  if (reglas.exigir_carne_tercera_edad) {
    const { data: lineas25 } = await db.from('detalle_venta').select('id').eq('venta_id', venta.id).eq('descuento_porcentaje', 25).limit(1);
    if (lineas25?.length && (!venta.tercera_edad_identidad || String(venta.tercera_edad_identidad).length < 5 || !venta.tercera_edad_nombre)) {
      throw Object.assign(new Error('Para el descuento de tercera edad escribe el nombre y el No. de identidad o carné del adulto mayor'), { status: 400 });
    }
  }

  const totalPagado = round2(pagos.reduce((s, p) => s + Number(p.monto), 0));
  if (totalPagado < Number(venta.total)) {
    throw Object.assign(new Error(`El pago (${totalPagado}) es menor al total (${venta.total})`), { status: 400 });
  }
  const cambio = round2(totalPagado - Number(venta.total));

  const { data: ventaFinal, error: errFinalizar } = await db.rpc('finalizar_venta', {
    p_venta_id: venta.id,
    p_efectivo: efectivo_recibido ?? totalPagado,
    p_cambio: cambio,
  });
  if (errFinalizar) throw Object.assign(new Error(errFinalizar.message), { status: 409 });

  const filasPago = pagos.map((p) => ({ venta_id: venta.id, forma_pago_id: p.forma_pago_id, monto: round2(Number(p.monto)) }));
  const { error: errPagos } = await db.from('venta_pagos').insert(filasPago);
  if (errPagos) {
    // La factura ya tiene número: no se revierte (rompería el correlativo),
    // pero queda en la bitácora para corregir los pagos a mano.
    console.error('venta_pagos', venta.id, errPagos.message);
    await registrarAuditoria(req, {
      accion: 'venta.error_pagos',
      entidad: 'venta',
      entidadId: venta.id,
      sucursalId: venta.sucursal_id,
      detalle: { numero_factura: ventaFinal.numero_factura, error: errPagos.message, pagos: filasPago },
    });
  }

  const { data: puntoEmision } = await db
    .from('puntos_emision')
    .select('es_borrador, cai, fecha_limite_emision')
    .eq('id', venta.punto_emision_id)
    .single();

  const { data: formas } = await db.from('formas_pago').select('id, nombre');
  const nombreForma = new Map((formas ?? []).map((f) => [f.id, f.nombre]));
  await registrarAuditoria(req, {
    accion: 'venta.facturar',
    entidad: 'venta',
    entidadId: venta.id,
    sucursalId: venta.sucursal_id,
    detalle: {
      origen,
      numero_factura: ventaFinal.numero_factura,
      numero_orden: venta.numero_orden,
      total: Number(venta.total),
      descuento_porcentaje: venta.descuento_porcentaje,
      cliente: venta.clientes?.nombre ?? 'Consumidor Final',
      pagos: pagos.map((p) => ({ forma: nombreForma.get(p.forma_pago_id) ?? p.forma_pago_id, monto: Number(p.monto) })),
      borrador: puntoEmision?.es_borrador ?? true,
    },
  });

  // Detecciones antifraude posteriores al cobro (no frenan la venta).
  revisarDobleFactura(req, { ...ventaFinal, sucursal_id: venta.sucursal_id }).catch((e) => console.error('[antifraude] doble', e.message));
  if (venta.tercera_edad_identidad) {
    revisarTerceraEdad(req, { ...ventaFinal, sucursal_id: venta.sucursal_id, tercera_edad_identidad: venta.tercera_edad_identidad, tercera_edad_nombre: venta.tercera_edad_nombre }).catch((e) =>
      console.error('[antifraude] tercera edad', e.message)
    );
  }

  // Correo con el PDF adjunto si el cliente tiene correo — no bloquea la
  // respuesta del cobro. El resultado se guarda en la venta para poder
  // avisar en el listado de facturas si falló, en vez de fallar en silencio.
  if (venta.clientes?.email) {
    obtenerVentaCompleta(venta.id)
      .then(async (ventaCompleta) => {
        const pdfBuffer = await generarPdfFacturaBuffer(ventaCompleta);
        const resultado = await enviarFacturaCliente(ventaCompleta, pdfBuffer);
        await db
          .from('ventas')
          .update({ correo_enviado: resultado.enviado, correo_error: resultado.motivo ?? null })
          .eq('id', venta.id);
      })
      .catch((e) => {
        db.from('ventas').update({ correo_enviado: false, correo_error: e.message }).eq('id', venta.id).then(
          () => {},
          () => {}
        );
      });
  }

  return {
    ...ventaFinal,
    cliente_nombre: venta.clientes?.nombre ?? 'Consumidor Final',
    es_borrador: puntoEmision?.es_borrador ?? true,
  };
}

ventas.post('/:id/pagar', async (req, res) => {
  try {
    const resultado = await facturarVenta(req, req.params.id, req.body);
    res.json(resultado);
  } catch (e) {
    res.status(e.status ?? 400).json({ error: e.message });
  }
});
```

## Frontend: shell y utilidades

### `frontend/src/main.jsx`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `frontend/src/App.jsx`

```jsx
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
import Icono, { IsotipoItalo } from './components/Icono.jsx';
import { accesoAEmail, claveInterna } from './lib/acceso.js';
import { useActualizacion } from './lib/actualizacion.js';
import { fijarSesionEventos, registrarEvento, reportarLoginFallido } from './lib/eventos.js';
import Antifraude from './screens/Antifraude.jsx';
import BloqueoInactividad from './components/BloqueoInactividad.jsx';
import NotificacionesAlertas from './components/NotificacionesAlertas.jsx';

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
      // Varios intentos fallidos seguidos generan alerta para el dueño.
      if (/invalid login credentials/i.test(error.message)) reportarLoginFallido(acceso);
      return setError(
        /invalid login credentials/i.test(error.message) ? 'Usuario o contraseña incorrectos' : error.message
      );
    }
    onEntrar(data.session);
  }

  return (
    <div className="pantalla">
      <form className="tarjeta" onSubmit={entrar}>
        <div className="login-marca">
          <span style={{ background: '#141a12', borderRadius: 14, padding: 9, display: 'inline-flex' }}>
            <IsotipoItalo tam={34} color="#C5D288" />
          </span>
          <span>
            <strong>ITALO</strong>
            <small>Facturación</small>
          </span>
        </div>
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
  { id: 'pos', etiqueta: 'Facturación', grupo: 'Operación', roles: ['admin', 'manager', 'cajero'], Componente: Pos },
  { id: 'facturas', etiqueta: 'Facturas', grupo: 'Operación', roles: ['admin', 'manager', 'cajero'], Componente: Facturas },
  { id: 'cierres', etiqueta: 'Cierre de caja', grupo: 'Operación', roles: ['admin', 'manager', 'cajero'], Componente: Cierres },
  { id: 'cotizaciones', etiqueta: 'Cotización de eventos', grupo: 'Operación', roles: ['admin', 'manager'], Componente: Cotizaciones },
  { id: 'dashboard', etiqueta: 'Dashboard', grupo: 'Negocio', roles: ['admin', 'manager'], Componente: Dashboard },
  { id: 'reportes', etiqueta: 'Reportes', grupo: 'Negocio', roles: ['admin', 'manager'], Componente: Reportes },
  { id: 'catalogo', etiqueta: 'Catálogo', grupo: 'Negocio', roles: ['admin', 'manager'], Componente: Catalogo },
  { id: 'clientes', etiqueta: 'Clientes', grupo: 'Negocio', roles: ['admin', 'manager'], Componente: Clientes },
  { id: 'caja-chica', etiqueta: 'Caja chica', grupo: 'Negocio', roles: ['admin', 'manager'], Componente: CajaChica },
  { id: 'antifraude', etiqueta: 'Antifraude', grupo: 'Control', roles: ['admin'], Componente: Antifraude },
  { id: 'bitacora', etiqueta: 'Bitácora', grupo: 'Control', roles: ['admin'], Componente: Bitacora },
  { id: 'puntos-emision', etiqueta: 'CAI / Emisión', grupo: 'Control', roles: ['admin', 'manager'], Componente: PuntosEmision },
  { id: 'usuarios', etiqueta: 'Usuarios', grupo: 'Control', roles: ['admin'], Componente: Usuarios },
  { id: 'sucursales', etiqueta: 'Sucursales', grupo: 'Control', roles: ['admin'], Componente: Sucursales },
  { id: 'impresora', etiqueta: 'Impresora', grupo: 'Ajustes', roles: ['admin', 'manager', 'cajero'], Componente: Impresora },
];

const GRUPOS = ['Operación', 'Negocio', 'Control', 'Ajustes'];

// Preferencias visuales por computadora (tema y barra lateral compacta).
function leerPreferencia(clave, porDefecto) {
  try {
    return localStorage.getItem(`italo-facturacion:${clave}`) ?? porDefecto;
  } catch {
    return porDefecto;
  }
}

function guardarPreferencia(clave, valor) {
  try {
    localStorage.setItem(`italo-facturacion:${clave}`, valor);
  } catch {
    // modo privado: no se recuerda
  }
}

function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', tema === 'oscuro' ? '#0f130e' : '#141a12');
}
aplicarTema(leerPreferencia('tema', 'claro'));


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
  const [tema, setTema] = useState(() => leerPreferencia('tema', 'claro'));
  const [compacta, setCompacta] = useState(() => leerPreferencia('barra-compacta', window.innerWidth < 1500 ? '1' : '0') === '1');
  const [menuMovil, setMenuMovil] = useState(false);

  function cambiarTema() {
    const nuevo = tema === 'oscuro' ? 'claro' : 'oscuro';
    setTema(nuevo);
    aplicarTema(nuevo);
    guardarPreferencia('tema', nuevo);
  }

  function alternarCompacta() {
    setCompacta((c) => {
      guardarPreferencia('barra-compacta', c ? '0' : '1');
      return !c;
    });
  }
  const { hayNueva, actualizarAhora } = useActualizacion(carritoOcupado);

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

  fijarSesionEventos(session);
  const [alertasPendientes, setAlertasPendientes] = useState(0);

  // Bitácora de uso: inicio de sesión (una vez por sesión) y cada pantalla
  // que se abre. Sirve para ver quién anda "curioseando" el sistema.
  useEffect(() => {
    if (!perfil) return;
    try {
      const clave = `italo-facturacion:sesion-registrada:${session.user?.id}:${session.expires_at ?? ''}`;
      if (!sessionStorage.getItem(clave)) {
        registrarEvento('sesion.inicio', { navegador: navigator.userAgent.slice(0, 120), pantalla: `${window.screen.width}x${window.screen.height}` });
        sessionStorage.setItem(clave, '1');
      }
    } catch {
      registrarEvento('sesion.inicio', {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil?.id]);

  useEffect(() => {
    if (perfil) registrarEvento('pantalla.ver', { pantalla: pantallaActiva }, sucursalActivaId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pantallaActiva, perfil?.id]);

  // Contador de alertas antifraude sin revisar (sólo administradores).
  useEffect(() => {
    if (perfil?.rol !== 'admin') return undefined;
    const revisar = () =>
      api
        .get('/antifraude/alertas/pendientes', session)
        .then((r) => setAlertasPendientes(r.pendientes))
        .catch(() => {});
    revisar();
    const t = setInterval(revisar, 60 * 1000);
    return () => clearInterval(t);
  }, [perfil?.rol, session, pantallaActiva]);

  function salir() {
    registrarEvento('sesion.fin', { pantalla: pantallaActiva });
    setTimeout(onSalir, 150);
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
  }, [sucursalActiva?.nombre]);

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
    <div className={`app-shell${compacta ? ' barra-compacta' : ''}${menuMovil ? ' menu-abierto' : ''}`} style={{ '--color-sucursal': colorActivo }}>
      <header className="barra-movil">
        <button className="boton-icono" onClick={() => setMenuMovil(true)} aria-label="Abrir menú">
          <Icono nombre="menu" />
        </button>
        <span className="barra-movil-titulo">{actual.etiqueta}</span>
        {sucursalActiva && <span className="barra-movil-sucursal">{nombreCortoSucursal(sucursalActiva.nombre)}</span>}
      </header>
      {menuMovil && <div className="sidebar-velo" onClick={() => setMenuMovil(false)} />}
      <aside className="sidebar">
        <div className="sidebar-marca">
          <IsotipoItalo tam={28} color="#C5D288" />
          <span className="sidebar-marca-texto">
            <strong>ITALO</strong>
            <small>Facturación</small>
          </span>
          <button className="boton-icono sidebar-colapsar" onClick={alternarCompacta} title={compacta ? 'Expandir menú' : 'Compactar menú'}>
            <Icono nombre={compacta ? 'expandir' : 'colapsar'} tam={18} />
          </button>
        </div>

        {sucursalActiva && (
          <div className="sidebar-sucursal" title={sucursalActiva.nombre}>
            <span className="sidebar-sucursal-etiqueta">Sucursal</span>
            {puedeCambiarSucursal ? (
              <select
                className="sidebar-sucursal-select"
                value={sucursalActivaId}
                disabled={carritoOcupado}
                title={carritoOcupado ? 'Termina o descarta la orden en curso para cambiar de sucursal' : 'Cambiar sucursal'}
                onChange={(e) => cambiarSucursalActiva(e.target.value)}
              >
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {nombreCortoSucursal(s.nombre)}
                  </option>
                ))}
              </select>
            ) : (
              <strong className="sidebar-sucursal-nombre">{nombreCortoSucursal(sucursalActiva.nombre)}</strong>
            )}
            <span className="sidebar-sucursal-inicial" aria-hidden="true">
              {nombreCortoSucursal(sucursalActiva.nombre).slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        <nav className="sidebar-nav">
          {GRUPOS.map((grupo) => {
            const items = pantallasVisibles.filter((p) => p.grupo === grupo);
            if (items.length === 0) return null;
            return (
              <div key={grupo} className="sidebar-grupo">
                <span className="sidebar-grupo-titulo">{grupo}</span>
                {items.map((p) => (
                  <button
                    key={p.id}
                    className={`sidebar-item${actual.id === p.id ? ' activo' : ''}`}
                    onClick={() => {
                      setPantallaActiva(p.id);
                      setMenuMovil(false);
                    }}
                    title={compacta ? p.etiqueta : undefined}
                  >
                    <Icono nombre={p.id} />
                    <span className="sidebar-item-texto">{p.etiqueta}</span>
                    {p.id === 'antifraude' && alertasPendientes > 0 && <span className="nav-contador">{alertasPendientes}</span>}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-pie">
          <IndicadorVivo />
          <button className="sidebar-item" onClick={cambiarTema} title={tema === 'oscuro' ? 'Modo claro' : 'Modo noche'}>
            <Icono nombre={tema === 'oscuro' ? 'sol' : 'luna'} />
            <span className="sidebar-item-texto">{tema === 'oscuro' ? 'Modo claro' : 'Modo noche'}</span>
          </button>
          <div className="sidebar-usuario" title={`Versión ${new Date(__VERSION__).toLocaleString('es-HN', { timeZone: 'America/Tegucigalpa' })}`}>
            <span className="sidebar-avatar">{(perfil.nombre ?? '?').trim().slice(0, 1).toUpperCase()}</span>
            <span className="sidebar-usuario-texto">
              <strong>{perfil.nombre}</strong>
              <small>{{ admin: 'Administrador', manager: 'Manager', cajero: 'Cajero' }[perfil.rol] ?? perfil.rol}</small>
            </span>
            <button className="boton-icono" onClick={salir} title="Cerrar sesión" aria-label="Cerrar sesión">
              <Icono nombre="salir" tam={18} />
            </button>
          </div>
        </div>
      </aside>
      <main className="principal">
      {hayNueva && (
        <div className="aviso-version">
          Hay una versión nueva del sistema. Se instalará sola al terminar esta venta.
          <button className="boton-sm" onClick={actualizarAhora}>
            Actualizar ya
          </button>
        </div>
      )}
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
      </main>
      <BloqueoInactividad session={session} perfil={perfil} />
      {perfil.rol === 'admin' && <NotificacionesAlertas session={session} onVer={() => setPantallaActiva('antifraude')} />}
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
```

### `frontend/src/api.js`

```js
import { idDispositivo } from './lib/dispositivo.js';

async function llamar(method, path, session, body) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
        'X-Dispositivo': idDispositivo(),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch falla por completo (sin internet, servidor caído) antes de
    // llegar a responder — sin esto se veía "Failed to fetch" en inglés.
    throw new Error('Sin conexión con el servidor. Revisa el internet e intenta de nuevo.');
  }
  const texto = await res.text();
  const datos = texto ? JSON.parse(texto) : null;
  if (!res.ok) throw new Error(datos?.error || `Error ${res.status}`);
  return datos;
}

export const api = {
  get: (path, session) => llamar('GET', path, session),
  post: (path, session, body) => llamar('POST', path, session, body),
  put: (path, session, body) => llamar('PUT', path, session, body),
  del: (path, session) => llamar('DELETE', path, session),
};
```

### `frontend/src/supabaseClient.js`

```js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### `frontend/src/lib/acceso.js`

```js
// Espejo de backend/lib/acceso.js: traduce el usuario libre (con espacios,
// tildes, etc.) y la contraseña de cualquier largo a lo que pide Supabase
// Auth. Tiene que dar EXACTAMENTE el mismo resultado que el backend, si no
// el usuario creado no podría entrar.
const DOMINIO_USUARIOS = 'italo.local';
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USUARIO_SIMPLE = /^[a-z0-9_-]+(\.[a-z0-9_-]+)*$/;
const SUFIJO_CLAVE = '~italo~';

export function normalizarUsuario(acceso) {
  // Sin tildes ni mayúsculas: "María López" y "maria lopez" son el mismo usuario.
  return String(acceso ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export async function accesoAEmail(acceso) {
  const texto = normalizarUsuario(acceso);
  if (CORREO_VALIDO.test(texto)) return texto;
  if (USUARIO_SIMPLE.test(texto) && texto.length <= 60) return `${texto}@${DOMINIO_USUARIOS}`;
  const bytes = new TextEncoder().encode(texto);
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  const hash = [...digest].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
  return `u-${hash}@${DOMINIO_USUARIOS}`;
}

export function claveInterna(password) {
  const p = String(password ?? '');
  return p.length >= 6 ? p : p + SUFIJO_CLAVE;
}
```

### `frontend/src/lib/actualizacion.js`

```js
import { useEffect, useRef, useState } from 'react';

// Versiones nuevas de la app: el service worker nuevo se activa solo
// (skipWaiting) y aquí se recarga la página para usarlo:
//  - revisa cada 2 minutos y cada vez que la pestaña vuelve a primer plano;
//  - si no hay una venta en curso, recarga de inmediato;
//  - si hay una venta en curso, espera a que termine y mientras muestra un aviso.
let hayVersionNueva = false;
let avisar = () => {};

if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
  const teniaControlador = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // La primera instalación también dispara este evento: ahí no hay nada que recargar.
    if (!teniaControlador) return;
    hayVersionNueva = true;
    avisar();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registro) => {
        const revisar = () => registro.update().catch(() => {});
        setInterval(revisar, 2 * 60 * 1000);
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') revisar();
        });
      })
      .catch(() => {});
  });
}

export function useActualizacion(ventaEnCurso) {
  const [hayNueva, setHayNueva] = useState(hayVersionNueva);
  const ventaRef = useRef(ventaEnCurso);
  ventaRef.current = ventaEnCurso;

  useEffect(() => {
    avisar = () => setHayNueva(true);
    if (hayVersionNueva) setHayNueva(true);
    return () => {
      avisar = () => {};
    };
  }, []);

  useEffect(() => {
    if (hayNueva && !ventaEnCurso) {
      const t = setTimeout(() => window.location.reload(), 1200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [hayNueva, ventaEnCurso]);

  return { hayNueva, actualizarAhora: () => window.location.reload() };
}
```

### `frontend/src/lib/cierre.js`

```js
// Espejo de backend/lib/cierre.js (calcularCuadre) para mostrar las
// diferencias en vivo mientras se llenan los montos. El cierre definitivo
// lo recalcula el servidor con las facturas reales del turno.
import { round2 } from './facturacion.js';

export function calcularCuadre(sistema, entradas) {
  const n = (v) => round2(Number(v || 0));
  const tarjetaReportada = round2(n(entradas.pos_bac) + n(entradas.pos_ficohsa));
  const diferenciaTarjeta = round2(tarjetaReportada - n(sistema.tarjeta));
  const efectivoEsperado = round2(n(entradas.fondo_caja) + n(sistema.efectivo) - n(entradas.salidas));
  const diferenciaEfectivo = round2(n(entradas.efectivo_contado) - efectivoEsperado);
  return {
    tarjeta_reportada: tarjetaReportada,
    diferencia_tarjeta: diferenciaTarjeta,
    efectivo_esperado: efectivoEsperado,
    diferencia_efectivo: diferenciaEfectivo,
    diferencia_total: round2(diferenciaTarjeta + diferenciaEfectivo),
  };
}

export function estadoDiferencia(dif) {
  const d = Number(dif ?? 0);
  if (Math.abs(d) < 0.005) return { clase: 'cuadra', texto: 'Cuadra' };
  if (Math.abs(d) < 1) return { clase: 'centavos', texto: d < 0 ? 'Faltan centavos' : 'Sobran centavos' };
  return d < 0 ? { clase: 'faltante', texto: 'Faltante' } : { clase: 'sobrante', texto: 'Sobrante' };
}

// <input type="datetime-local"> trabaja en hora local sin zona; el servidor
// guarda timestamptz. Convertir explícitamente evita el desfase de 6 horas
// (UTC vs. Honduras) al filtrar las facturas del turno.
export function isoAInputLocal(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function inputLocalAIso(valor) {
  return new Date(valor).toISOString();
}

export function inicioDeHoyIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
```

### `frontend/src/lib/coloresSucursal.js`

```js
// Color fijo por sucursal, para que un cajero nunca confunda en cuál está
// facturando. El color se guarda en la base de datos (sucursales.color) y
// se elige en la pantalla Sucursales; App.jsx lo registra acá apenas carga
// la lista, y toda la app lo lee con colorSucursal(id).

// Paleta validada contra el fondo navy: todos >= 4.3:1 como texto sobre el
// panel y >= 4.5:1 sobre navy. Sobre un relleno de estos colores el texto va
// oscuro (--navy), que contrasta mejor que el blanco.
export const PALETA_SUCURSALES = [
  { color: '#c5603c', nombre: 'Terracota' },
  { color: '#2e9e8f', nombre: 'Verde azulado' },
  { color: '#b08d28', nombre: 'Dorado' },
  { color: '#6c7fd6', nombre: 'Azul' },
  { color: '#d2567a', nombre: 'Frambuesa' },
  { color: '#3d9fd6', nombre: 'Celeste' },
  { color: '#7fa83e', nombre: 'Lima' },
  { color: '#a47bd6', nombre: 'Lila' },
];

const registrados = new Map();

export function registrarColoresSucursales(sucursales) {
  registrados.clear();
  for (const s of sucursales) if (s.color) registrados.set(s.id, s.color);
}

// Respaldo si una sucursal todavía no tiene color guardado.
function hashEstable(texto) {
  let h = 0;
  for (let i = 0; i < texto.length; i++) {
    h = (h * 31 + texto.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function colorSucursal(sucursalId) {
  if (!sucursalId) return 'var(--text-dim)';
  return registrados.get(sucursalId) ?? PALETA_SUCURSALES[hashEstable(sucursalId) % 4].color;
}

// "Inversiones Milano S de R.L. - 10 Calle" → "10 Calle": la parte que
// realmente distingue una sucursal de otra, para mostrarla en grande.
export function nombreCortoSucursal(nombre) {
  if (!nombre) return '';
  const partes = nombre.split(' - ');
  return partes.length > 1 ? partes.slice(1).join(' - ') : nombre;
}

// Primer color de la paleta que ninguna sucursal está usando.
export function colorLibre(sucursales) {
  const usados = new Set(sucursales.map((s) => s.color).filter(Boolean));
  return PALETA_SUCURSALES.find((p) => !usados.has(p.color))?.color ?? PALETA_SUCURSALES[0].color;
}
```

### `frontend/src/lib/csv.js`

```js
// Exportar una lista de objetos a CSV y descargarla — sin dependencias,
// para el contador (facturas, reportes de ventas/ISV, etc.).
export function descargarCsv(nombreArchivo, filas, columnas) {
  const escapar = (valor) => {
    const texto = valor === null || valor === undefined ? '' : String(valor);
    return /[",\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
  };

  const encabezado = columnas.map((c) => escapar(c.titulo)).join(',');
  const lineas = filas.map((fila) => columnas.map((c) => escapar(c.valor(fila))).join(','));
  const csv = [encabezado, ...lineas].join('\n');

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(url);
}
```

### `frontend/src/lib/dispositivo.js`

```js
// Identificador de este navegador/computadora. Se manda en cada petición
// (X-Dispositivo) para detectar entradas desde dispositivos nuevos y el uso
// de una misma cuenta en dos equipos a la vez.
const CLAVE = 'italo-facturacion:dispositivo';
let id = null;

export function idDispositivo() {
  if (id) return id;
  try {
    id = localStorage.getItem(CLAVE);
    if (!id) {
      id = (crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`).replace(/-/g, '');
      localStorage.setItem(CLAVE, id);
    }
  } catch {
    id = id ?? `tmp${Math.random().toString(36).slice(2)}`;
  }
  return id;
}
```

### `frontend/src/lib/documentos.js`

```js
// PDFs y tickets requieren el token de sesión (Authorization: Bearer), así
// que NO se pueden abrir con un <a href="/api/..."> directo: el navegador no
// manda ese encabezado y el servidor responde 401. Por eso se piden con
// fetch y se muestran/imprimen desde un blob.

import { idDispositivo } from './dispositivo.js';

const CLAVE_CONFIG = 'italo-facturacion:impresora';
const CONFIG_DEFECTO = { columnas: 48, autoImprimir: true };

export const PAPELES = [
  { columnas: 48, etiqueta: '80 mm (el más común)' },
  { columnas: 32, etiqueta: '58 mm (impresora pequeña)' },
];

// La configuración es por computadora/caja (cada sucursal puede tener una
// impresora distinta), por eso vive en el navegador y no en la base de datos.
export function leerConfigImpresora() {
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE_CONFIG) ?? 'null');
    return { ...CONFIG_DEFECTO, ...(guardada ?? {}) };
  } catch {
    return { ...CONFIG_DEFECTO };
  }
}

export function guardarConfigImpresora(config) {
  try {
    localStorage.setItem(CLAVE_CONFIG, JSON.stringify(config));
  } catch {
    // Navegador en modo privado o sin almacenamiento: se usa la de defecto.
  }
}

async function pedir(path, session) {
  let res;
  try {
    res = await fetch(`/api${path}`, { headers: { Authorization: `Bearer ${session.access_token}`, 'X-Dispositivo': idDispositivo() } });
  } catch {
    throw new Error('Sin conexión con el servidor. Revisa el internet e intenta de nuevo.');
  }
  if (!res.ok) {
    let mensaje = `Error ${res.status}`;
    try {
      mensaje = (await res.json()).error ?? mensaje;
    } catch {
      // respuesta sin JSON
    }
    throw new Error(mensaje);
  }
  return res;
}

// La ventana se abre en el mismo clic (antes de esperar al servidor) —
// si se abriera después del await, el bloqueador de ventanas emergentes la
// frenaría.
export async function verPdf(path, session) {
  const ventana = window.open('', '_blank');
  if (ventana) {
    ventana.document.title = 'Cargando…';
    ventana.document.body.style.cssText = 'font-family:sans-serif;padding:32px;color:#555';
    ventana.document.body.textContent = 'Cargando documento…';
  }
  try {
    const blob = await (await pedir(path, session)).blob();
    const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
    if (ventana) ventana.location.href = url;
    else window.location.href = url;
    setTimeout(() => URL.revokeObjectURL(url), 5 * 60 * 1000);
  } catch (e) {
    ventana?.close();
    throw e;
  }
}

export async function descargarPdf(path, session, nombreArchivo) {
  const blob = await (await pedir(path, session)).blob();
  const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
}

// Imprime HTML en un iframe invisible dentro de la misma página: no abre
// pestañas nuevas ni lo frena el bloqueador de ventanas. Con Chrome abierto
// con --kiosk-printing, imprime directo en la térmica sin mostrar diálogo.
export function imprimirHtml(html) {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    let terminado = false;
    const limpiar = () => {
      if (terminado) return;
      terminado = true;
      setTimeout(() => iframe.remove(), 500);
      resolve();
    };
    iframe.onload = () => {
      const w = iframe.contentWindow;
      w.addEventListener('afterprint', limpiar);
      w.focus();
      w.print();
      setTimeout(limpiar, 60 * 1000);
    };
    iframe.srcdoc = html;
    document.body.appendChild(iframe);
  });
}

const MOTIVOS_REIMPRESION = ['El cliente la pidió de nuevo', 'El papel se trabó o salió mal', 'El cliente perdió la factura'];

// Toda reimpresión pide un motivo (queda en la bitácora) y el ticket sale
// marcado como COPIA. Devuelve null si el usuario cancela.
export function pedirMotivo(titulo, opciones) {
  const lista = opciones.map((o, i) => `${i + 1}. ${o}`).join('\n');
  const r = window.prompt(`${titulo}\n\n${lista}\n${opciones.length + 1}. Otro (escríbelo)\n\nEscribe el número o el motivo:`);
  if (r === null) return null;
  const texto = r.trim();
  if (!texto) return null;
  const n = Number(texto);
  if (Number.isInteger(n) && n >= 1 && n <= opciones.length) return opciones[n - 1];
  if (n === opciones.length + 1) return pedirMotivo(titulo, opciones);
  return texto.slice(0, 200);
}

export async function imprimirTicket(ventaId, session, { reimpresion = false, razon } = {}) {
  const { columnas } = leerConfigImpresora();
  let motivo = '';
  if (reimpresion) {
    const r = razon ?? pedirMotivo('Motivo de la reimpresión (saldrá marcada como COPIA)', MOTIVOS_REIMPRESION);
    if (!r) return false;
    motivo = `&motivo=reimpresion&razon=${encodeURIComponent(r)}`;
  }
  const html = await (await pedir(`/ventas/${ventaId}/ticket?columnas=${columnas}${motivo}`, session)).text();
  await imprimirHtml(html);
  return true;
}

export async function imprimirCierre(cierreId, session) {
  const { columnas } = leerConfigImpresora();
  const html = await (await pedir(`/cierres/${cierreId}/ticket?columnas=${columnas}`, session)).text();
  await imprimirHtml(html);
}

export async function imprimirPrueba(session, sucursal) {
  const { columnas } = leerConfigImpresora();
  const html = await (
    await pedir(`/ventas/impresora/prueba?columnas=${columnas}&sucursal=${encodeURIComponent(sucursal ?? '')}`, session)
  ).text();
  await imprimirHtml(html);
}
```

### `frontend/src/lib/eventos.js`

```js
// Registra en la bitácora lo que se hace dentro de la app (pantallas que
// se abren, productos que se quitan de una orden, búsquedas…). Nunca
// bloquea ni muestra errores: si falla, la operación sigue igual.
import { idDispositivo } from './dispositivo.js';

let sesionActual = null;

export function fijarSesionEventos(session) {
  sesionActual = session;
}

export function registrarEvento(accion, detalle = {}, sucursalId = null) {
  if (!sesionActual?.access_token) return;
  fetch('/api/antifraude/evento', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesionActual.access_token}`,
      'X-Dispositivo': idDispositivo(),
    },
    body: JSON.stringify({ accion, detalle, sucursal_id: sucursalId || undefined }),
    keepalive: true,
  }).catch(() => {});
}

// Intento fallido de inicio de sesión (no hay sesión todavía).
export function reportarLoginFallido(acceso) {
  fetch('/api/sesion/login-fallido', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Dispositivo': idDispositivo() },
    body: JSON.stringify({ acceso }),
  }).catch(() => {});
}
```

### `frontend/src/lib/facturacion.js`

```js
// Espejo en el frontend de backend/lib/facturacion.js — sólo para mostrar
// el desglose Sub-Total/Impuesto antes de cobrar. El cálculo real y
// definitivo siempre lo hace el backend al guardar/cobrar la venta.
export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export const OPCIONES_DESCUENTO = [
  { porcentaje: 0, etiqueta: 'Sin descuento', corta: '—' },
  { porcentaje: 10, etiqueta: '10%', corta: '10%' },
  { porcentaje: 25, etiqueta: '25% Tercera edad', corta: '25% 3ª edad' },
];

// Mismo cálculo que backend/lib/facturacion.js descuentoDeLinea().
export function descuentoDeLinea(precioUnitario, cantidad, porcentaje) {
  return round2((round2(Number(precioUnitario) * Number(cantidad)) * Number(porcentaje || 0)) / 100);
}

function calcularLineas(items, cliente) {
  return items.map((item) => {
    const descuento = descuentoDeLinea(item.precio_unitario, item.cantidad, item.descuento_porcentaje);
    const monto = round2(item.precio_unitario * item.cantidad - descuento);
    const tasa = Number(item.impuesto_tasa ?? 0.15);
    let bucket;
    if (tasa > 0) bucket = 'gravado_15';
    else if (cliente?.exento_impuestos) bucket = 'exento';
    else bucket = 'exonerado';
    return { monto, tasa, bucket, descuento, porcentaje: Number(item.descuento_porcentaje || 0) };
  });
}

// Descuento POR PRODUCTO: cada línea trae su porcentaje (0/10/25) y el
// monto se resta antes de separar base/ISV, igual que el backend.
export function calcularTotales(items, cliente) {
  const lineas = calcularLineas(items, cliente);
  const totales = { subtotal_exento: 0, subtotal_exonerado: 0, subtotal_gravado_15: 0, isv_total: 0 };
  let total = 0;
  const porPorcentaje = {};
  for (const l of lineas) {
    const base = l.tasa > 0 ? round2(l.monto / (1 + l.tasa)) : l.monto;
    if (l.bucket === 'exento') totales.subtotal_exento += base;
    else if (l.bucket === 'exonerado') totales.subtotal_exonerado += base;
    else totales.subtotal_gravado_15 += base;
    totales.isv_total += round2(l.monto - base);
    total += l.monto;
    if (l.descuento > 0) porPorcentaje[l.porcentaje] = round2((porPorcentaje[l.porcentaje] ?? 0) + l.descuento);
  }
  const descuento = round2(lineas.reduce((s, l) => s + l.descuento, 0));
  return {
    subtotal_bruto: round2(total + descuento),
    subtotal_exento: round2(totales.subtotal_exento),
    subtotal_exonerado: round2(totales.subtotal_exonerado),
    subtotal_gravado_15: round2(totales.subtotal_gravado_15),
    isv_total: round2(totales.isv_total),
    descuento,
    descuentos_por_porcentaje: porPorcentaje,
    total: round2(total),
  };
}
```

### `frontend/src/lib/rangosFecha.js`

```js
// Rangos de fechas en días de calendario de HONDURAS. Antes se usaba
// toISOString() (UTC): después de las 6 p. m. "Hoy" ya era mañana y el
// reporte de "hoy" salía vacío.
const ZONA = 'America/Tegucigalpa';
const formato = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' });

export function fechaHn(d = new Date()) {
  return formato.format(d);
}

// Suma días a una fecha "YYYY-MM-DD" sin pasar por la zona del navegador.
export function sumarDias(fecha, dias) {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

function diaSemana(fecha) {
  return (new Date(`${fecha}T12:00:00Z`).getUTCDay() + 6) % 7; // lunes = 0
}

export function hoyHn() {
  return fechaHn();
}

export function primerDiaMesHn() {
  return `${hoyHn().slice(0, 7)}-01`;
}

export function rangoHoy() {
  const hoy = hoyHn();
  return { fechaInicio: hoy, fechaFin: hoy };
}

export function rangoAyer() {
  const ayer = sumarDias(hoyHn(), -1);
  return { fechaInicio: ayer, fechaFin: ayer };
}

export function rangoEstaSemana() {
  const hoy = hoyHn();
  return { fechaInicio: sumarDias(hoy, -diaSemana(hoy)), fechaFin: hoy };
}

export function rangoSemanaPasada() {
  const lunes = sumarDias(hoyHn(), -diaSemana(hoyHn()) - 7);
  return { fechaInicio: lunes, fechaFin: sumarDias(lunes, 6) };
}

export function rangoEsteMes() {
  return { fechaInicio: primerDiaMesHn(), fechaFin: hoyHn() };
}

export function rangoMesPasado() {
  const finMesPasado = sumarDias(primerDiaMesHn(), -1);
  return { fechaInicio: `${finMesPasado.slice(0, 7)}-01`, fechaFin: finMesPasado };
}

export function rangoUltimos30() {
  const hoy = hoyHn();
  return { fechaInicio: sumarDias(hoy, -29), fechaFin: hoy };
}

export function rangoEsteAno() {
  return { fechaInicio: `${hoyHn().slice(0, 4)}-01-01`, fechaFin: hoyHn() };
}

export const ATAJOS_FECHA = [
  { etiqueta: 'Hoy', calcular: rangoHoy },
  { etiqueta: 'Esta semana', calcular: rangoEstaSemana },
  { etiqueta: 'Este mes', calcular: rangoEsteMes },
];

export const ATAJOS_REPORTES = [
  { etiqueta: 'Hoy', calcular: rangoHoy },
  { etiqueta: 'Ayer', calcular: rangoAyer },
  { etiqueta: 'Esta semana', calcular: rangoEstaSemana },
  { etiqueta: 'Semana pasada', calcular: rangoSemanaPasada },
  { etiqueta: 'Este mes', calcular: rangoEsteMes },
  { etiqueta: 'Mes pasado', calcular: rangoMesPasado },
  { etiqueta: 'Últimos 30 días', calcular: rangoUltimos30 },
  { etiqueta: 'Este año', calcular: rangoEsteAno },
];
```

### `frontend/src/lib/tiempoReal.js`

```js
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient.js';

// Sincronización en tiempo real con Supabase Realtime (WebSockets sobre
// los cambios de Postgres): cuando una sucursal factura, cambia un precio
// o se abre/cierra una orden, las demás pantallas se enteran al instante,
// sin recargar. Respeta RLS: un cajero sólo recibe eventos de su sucursal.
//
// Las ráfagas (ej. 5 productos agregados seguidos) se agrupan en una sola
// recarga para no martillar al servidor.
export function useCambiosEnVivo(tablas, alCambiar, { filtro, retrasoMs = 300, activo = true } = {}) {
  const callbackRef = useRef(alCambiar);
  callbackRef.current = alCambiar;
  const clave = `${tablas.join(',')}|${filtro ?? ''}`;

  useEffect(() => {
    if (!activo) return undefined;
    let temporizador;
    const canal = supabase.channel(`vivo:${clave}:${Math.random().toString(36).slice(2, 8)}`);
    for (const tabla of tablas) {
      canal.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tabla, ...(filtro ? { filter: filtro } : {}) },
        (payload) => {
          clearTimeout(temporizador);
          temporizador = setTimeout(() => callbackRef.current(payload), retrasoMs);
        }
      );
    }
    canal.subscribe();
    return () => {
      clearTimeout(temporizador);
      supabase.removeChannel(canal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, activo]);
}

// Estado de la conexión en vivo, para el indicador de la barra superior.
export function useConexionEnVivo() {
  const [conectado, setConectado] = useState(false);
  useEffect(() => {
    const canal = supabase
      .channel(`estado-vivo:${Math.random().toString(36).slice(2, 8)}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ventas' }, () => {})
      .subscribe((estado) => setConectado(estado === 'SUBSCRIBED'));
    return () => {
      supabase.removeChannel(canal);
    };
  }, []);
  return conectado;
}
```

## Frontend: componentes

### `frontend/src/components/BloqueoInactividad.jsx`

```jsx
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import { api } from '../api.js';
import { claveInterna } from '../lib/acceso.js';
import { registrarEvento } from '../lib/eventos.js';
import { IsotipoItalo } from './Icono.jsx';

// Pantalla bloqueada tras X minutos sin uso: evita que otra persona use la
// sesión abierta de un compañero (y que las ventas queden a su nombre).
// Para seguir hay que volver a escribir la contraseña; la orden en curso
// no se pierde.
export default function BloqueoInactividad({ session, perfil }) {
  const [bloqueada, setBloqueada] = useState(false);
  const [minutos, setMinutos] = useState(perfil.rol === 'cajero' ? 10 : 20);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [intentos, setIntentos] = useState(0);
  const ultimaActividad = useRef(Date.now());

  useEffect(() => {
    api
      .get('/antifraude/reglas', session)
      .then((r) => setMinutos(perfil.rol === 'cajero' ? r.minutos_bloqueo_cajero : r.minutos_bloqueo_otros))
      .catch(() => {});
  }, [session, perfil.rol]);

  useEffect(() => {
    if (!minutos) return undefined;
    const marcar = () => {
      ultimaActividad.current = Date.now();
    };
    const eventos = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    eventos.forEach((e) => window.addEventListener(e, marcar, { passive: true }));
    const t = setInterval(() => {
      if (!bloqueada && Date.now() - ultimaActividad.current > minutos * 60 * 1000) {
        setBloqueada(true);
        registrarEvento('sesion.bloqueo', { minutos_inactivo: minutos });
      }
    }, 15 * 1000);
    return () => {
      eventos.forEach((e) => window.removeEventListener(e, marcar));
      clearInterval(t);
    };
  }, [minutos, bloqueada]);

  async function desbloquear(e) {
    e.preventDefault();
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: claveInterna(password),
    });
    if (err) {
      const n = intentos + 1;
      setIntentos(n);
      registrarEvento('sesion.desbloqueo_fallido', { intento: n });
      setError('Contraseña incorrecta');
      if (n >= 5) supabase.auth.signOut();
      return;
    }
    registrarEvento('sesion.desbloqueo', {});
    setPassword('');
    setIntentos(0);
    ultimaActividad.current = Date.now();
    setBloqueada(false);
  }

  if (!bloqueada) return null;
  return (
    <div className="bloqueo">
      <form className="bloqueo-tarjeta" onSubmit={desbloquear}>
        <span className="bloqueo-logo">
          <IsotipoItalo tam={40} color="#C5D288" />
        </span>
        <h2>Pantalla bloqueada</h2>
        <p>
          Sesión de <strong>{perfil.nombre}</strong>. Se bloqueó por {minutos} minutos sin uso.
        </p>
        {error && <div className="error">{error}</div>}
        <input type="password" autoFocus placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Desbloquear</button>
        <button type="button" className="boton-secundario" onClick={() => supabase.auth.signOut()}>
          Cambiar de usuario
        </button>
      </form>
    </div>
  );
}
```

### `frontend/src/components/CalendarioEventos.jsx`

```jsx
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { colorSucursal } from '../lib/coloresSucursal.js';

// Pasos de control de un evento aceptado (mismo orden y claves que el backend).
export const ITEMS_CHECKLIST = [
  { clave: 'anticipo', etiqueta: 'Anticipo recibido' },
  { clave: 'sabores', etiqueta: 'Sabores y cantidades confirmados' },
  { clave: 'produccion', etiqueta: 'Producción programada' },
  { clave: 'logistica', etiqueta: 'Transporte, carrito y equipo listos' },
  { clave: 'entrega', etiqueta: 'Montaje / entrega realizada' },
  { clave: 'cobro', etiqueta: 'Saldo cobrado' },
];

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const CONFIRMADOS = ['aceptada', 'facturada'];

const ETIQUETA_ESTADO = {
  borrador: 'Borrador',
  enviada: 'Enviada',
  aceptada: 'Aceptada',
  facturada: 'Facturada',
  rechazada: 'Rechazada',
};

function fmtL(n) {
  return `L ${Number(n || 0).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function num(n) {
  return Number(n || 0).toLocaleString('es-HN');
}

function claveFecha(anio, mes, dia) {
  return `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

export function hoyClave() {
  const d = new Date();
  return claveFecha(d.getFullYear(), d.getMonth(), d.getDate());
}

function diasHasta(fecha) {
  const [a, m, d] = fecha.split('-').map(Number);
  const [ha, hm, hd] = hoyClave().split('-').map(Number);
  return Math.round((Date.UTC(a, m - 1, d) - Date.UTC(ha, hm - 1, hd)) / 86400000);
}

export function horaCorta(h) {
  if (!h) return '';
  const [hh, mm] = String(h).split(':').map(Number);
  return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${hh >= 12 ? 'p. m.' : 'a. m.'}`;
}

function fechaLarga(fecha) {
  if (!fecha) return 'Sin fecha';
  const [a, m, d] = fecha.split('-').map(Number);
  const texto = new Date(a, m - 1, d).toLocaleDateString('es-HN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Lo que falta cobrar: una cotización facturada o con "Saldo cobrado" ya no debe nada.
export function saldoPendiente(c) {
  if (c.estado === 'facturada' || c.checklist?.cobro?.hecho) return 0;
  return Math.max(0, Number(c.total) - Number(c.anticipo || 0));
}

export function pasosHechos(c) {
  return ITEMS_CHECKLIST.filter((i) => c.checklist?.[i.clave]?.hecho).length;
}

// Situación de un evento confirmado para colorearlo y avisar a tiempo.
export function situacionEvento(c) {
  if (!CONFIRMADOS.includes(c.estado) || !c.fecha_evento) return null;
  const dias = diasHasta(c.fecha_evento);
  const faltan = ITEMS_CHECKLIST.length - pasosHechos(c);
  if (c.realizado && faltan === 0) return { tipo: 'cerrado', texto: 'Evento cerrado' };
  if (dias < 0) return { tipo: 'vencido', texto: c.realizado ? `Realizado · faltan ${faltan} pasos` : 'Pasó la fecha: ciérralo' };
  if (dias <= 3 && faltan > 0) return { tipo: 'urgente', texto: dias === 0 ? `Hoy · faltan ${faltan} pasos` : `En ${dias} día${dias === 1 ? '' : 's'} · faltan ${faltan} pasos` };
  if (faltan === 0) return { tipo: 'listo', texto: 'Todo listo' };
  return { tipo: 'en-curso', texto: `${ITEMS_CHECKLIST.length - faltan}/${ITEMS_CHECKLIST.length} pasos` };
}

function enlaceGoogleCalendar(c) {
  const f = c.fecha_evento.replaceAll('-', '');
  let fechas;
  if (c.hora_evento) {
    const [hh, mm] = c.hora_evento.split(':').map(Number);
    const inicio = `${f}T${String(hh).padStart(2, '0')}${String(mm).padStart(2, '0')}00`;
    const finH = Math.min(hh + 4, 23);
    const fin = `${f}T${String(finH).padStart(2, '0')}${String(mm).padStart(2, '0')}00`;
    fechas = `${inicio}/${fin}`;
  } else {
    const [a, m, d] = c.fecha_evento.split('-').map(Number);
    const sig = new Date(Date.UTC(a, m - 1, d + 1)).toISOString().slice(0, 10).replaceAll('-', '');
    fechas = `${f}/${sig}`;
  }
  const detalles = [
    `Cotización #${String(c.numero).padStart(4, '0')} · ${num(c.cantidad_copitas)} copitas`,
    `Cliente: ${c.nombre_cliente}${c.telefono_cliente ? ` · Tel. ${c.telefono_cliente}` : ''}`,
    `Total: ${fmtL(c.total)}${Number(c.anticipo) > 0 ? ` · Anticipo ${fmtL(c.anticipo)}` : ''}`,
    c.notas || '',
  ]
    .filter(Boolean)
    .join('\n');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Ítalo · ${c.nombre_evento}`,
    dates: fechas,
    ctz: 'America/Tegucigalpa',
    details: detalles,
    location: c.lugar || '',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function enlaceWhatsApp(telefono) {
  let digitos = String(telefono || '').replace(/\D/g, '');
  if (digitos.length === 8) digitos = `504${digitos}`;
  return digitos ? `https://wa.me/${digitos}` : null;
}

// ─────────────────────────────────────────────────────────────────────────
// Modal para aceptar una cotización: la fecha es obligatoria porque el
// evento se agenda en el calendario.
export function ModalAceptar({ cotizacion, sucursales, sucursalIdDefecto, session, onCerrar, onAceptada }) {
  const [fecha, setFecha] = useState(cotizacion.fecha_evento ?? '');
  const [hora, setHora] = useState(cotizacion.hora_evento?.slice(0, 5) ?? '');
  const [sucursalId, setSucursalId] = useState(cotizacion.sucursal_id ?? sucursalIdDefecto ?? '');
  const [anticipo, setAnticipo] = useState(Number(cotizacion.anticipo) > 0 ? String(cotizacion.anticipo) : '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const anticipoNum = Number(anticipo || 0);
  const anticipoInvalido = anticipoNum < 0 || anticipoNum > Number(cotizacion.total) + 0.001;

  async function aceptar() {
    setGuardando(true);
    setError('');
    try {
      const actualizada = await api.put(`/cotizaciones/${cotizacion.id}`, session, {
        estado: 'aceptada',
        fecha_evento: fecha,
        hora_evento: hora || null,
        sucursal_id: sucursalId || null,
        anticipo: anticipoNum,
      });
      onAceptada(actualizada);
    } catch (e) {
      setError(e.message);
      setGuardando(false);
    }
  }

  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="tarjeta" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <h2>Aceptar y agendar evento</h2>
        <p style={{ color: 'var(--text-dim)', marginTop: -8 }}>
          #{String(cotizacion.numero).padStart(4, '0')} · {cotizacion.nombre_evento} · {cotizacion.nombre_cliente} ·{' '}
          <strong>{fmtL(cotizacion.total)}</strong>
        </p>
        {error && <div className="error">{error}</div>}
        <label className="cal-campo">
          <span>Fecha del evento *</span>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </label>
        <label className="cal-campo">
          <span>Hora</span>
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
        </label>
        <label className="cal-campo">
          <span>Sucursal que atiende el evento</span>
          <select value={sucursalId} onChange={(e) => setSucursalId(e.target.value)}>
            <option value="">Sin asignar</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="cal-campo">
          <span>Anticipo recibido (L)</span>
          <input type="number" step="0.01" min="0" placeholder="0.00" value={anticipo} onChange={(e) => setAnticipo(e.target.value)} />
        </label>
        {anticipoInvalido && <p style={{ color: 'var(--aviso)', fontSize: '0.8em', marginTop: -6 }}>El anticipo no puede superar el total.</p>}
        {anticipoNum > 0 && !anticipoInvalido && (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85em', marginTop: -6 }}>
            Saldo pendiente: <strong>{fmtL(Number(cotizacion.total) - anticipoNum)}</strong>
          </p>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="boton-secundario" onClick={onCerrar} disabled={guardando}>
            Cancelar
          </button>
          <button disabled={guardando || !fecha || anticipoInvalido} onClick={aceptar}>
            {guardando ? 'Agendando…' : 'Aceptar y agendar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Ficha de control de un evento: checklist, reprogramación, anticipo, notas.
function ModalEvento({ cotizacion, sucursales, session, onCerrar, onActualizada, onFacturar, onVerPdf, onAceptar }) {
  const [c, setC] = useState(cotizacion);
  const [fecha, setFecha] = useState(cotizacion.fecha_evento ?? '');
  const [hora, setHora] = useState(cotizacion.hora_evento?.slice(0, 5) ?? '');
  const [lugar, setLugar] = useState(cotizacion.lugar ?? '');
  const [anticipo, setAnticipo] = useState(String(Number(cotizacion.anticipo || 0)));
  const [notas, setNotas] = useState(cotizacion.notas_seguimiento ?? '');
  const [guardando, setGuardando] = useState('');
  const [error, setError] = useState('');

  useEffect(() => setC(cotizacion), [cotizacion]);

  const confirmado = CONFIRMADOS.includes(c.estado);
  const facturada = c.estado === 'facturada';
  const hechos = pasosHechos(c);
  const saldo = saldoPendiente(c);
  const situacion = situacionEvento(c);
  const whatsapp = enlaceWhatsApp(c.telefono_cliente);
  const agendaCambiada =
    fecha !== (c.fecha_evento ?? '') ||
    hora !== (c.hora_evento?.slice(0, 5) ?? '') ||
    lugar !== (c.lugar ?? '') ||
    Number(anticipo || 0) !== Number(c.anticipo || 0);

  async function guardar(cambios, etiqueta) {
    setGuardando(etiqueta);
    setError('');
    try {
      const actualizada = await api.put(`/cotizaciones/${c.id}/seguimiento`, session, cambios);
      setC(actualizada);
      onActualizada(actualizada);
      return actualizada;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setGuardando('');
    }
  }

  function guardarAgenda() {
    const cambios = { fecha_evento: fecha, hora_evento: hora || null, lugar };
    if (!facturada) cambios.anticipo = Number(anticipo || 0);
    if (fecha !== c.fecha_evento && !window.confirm(`¿Reprogramar el evento para el ${fechaLarga(fecha)}?`)) return;
    guardar(cambios, 'agenda');
  }

  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="tarjeta cal-ficha" onClick={(e) => e.stopPropagation()}>
        <div className="cal-ficha-cabecera" style={{ '--c-evento': c.sucursal_id ? colorSucursal(c.sucursal_id) : 'var(--primario)' }}>
          <div>
            <div className="cal-ficha-numero">
              Cotización #{String(c.numero).padStart(4, '0')} · <span className={`cal-estado cal-estado-${c.estado}`}>{ETIQUETA_ESTADO[c.estado]}</span>
            </div>
            <h2>{c.nombre_evento}</h2>
            <div className="cal-ficha-fecha">
              {fechaLarga(c.fecha_evento)}
              {c.hora_evento && ` · ${horaCorta(c.hora_evento)}`}
              {c.lugar && ` · ${c.lugar}`}
            </div>
          </div>
          <button className="boton-sm boton-secundario" onClick={onCerrar} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {situacion && <div className={`cal-situacion cal-sit-${situacion.tipo}`}>{situacion.texto}</div>}

        <div className="cal-ficha-grid">
          <div className="cal-dato">
            <span>Cliente</span>
            <strong>{c.nombre_cliente}</strong>
            {c.telefono_cliente && (
              <div className="cal-contacto">
                <a href={`tel:${c.telefono_cliente}`}>📞 {c.telefono_cliente}</a>
                {whatsapp && (
                  <a href={whatsapp} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                )}
              </div>
            )}
            {c.email_cliente && <div className="cal-sub">{c.email_cliente}</div>}
          </div>
          <div className="cal-dato">
            <span>Pedido</span>
            <strong>{num(c.cantidad_copitas)} copitas</strong>
            <div className="cal-sub">
              Total {fmtL(c.total)}
              {Number(c.costo_servicio) > 0 && ` · incluye servicio ${fmtL(c.costo_servicio)}`}
            </div>
          </div>
          <div className="cal-dato">
            <span>Cobro</span>
            <strong>{saldo > 0 ? `Saldo ${fmtL(saldo)}` : 'Cobrado completo'}</strong>
            <div className="cal-sub">
              Anticipo {fmtL(c.anticipo)}
              {facturada && ' · facturada'}
            </div>
          </div>
        </div>

        {c.notas && (
          <div className="cal-notas-cliente">
            <span>Notas de la cotización</span>
            {c.notas}
          </div>
        )}

        {!confirmado ? (
          <div className="cal-tentativo">
            <p>
              Esta cotización todavía está <strong>{ETIQUETA_ESTADO[c.estado].toLowerCase()}</strong>: aparece en el calendario como
              tentativa. Al aceptarla queda confirmada y se habilita la lista de control.
            </p>
            {c.estado !== 'rechazada' && <button onClick={() => onAceptar(c)}>Aceptar y agendar</button>}
          </div>
        ) : (
          <>
            <div className="cal-seccion-titulo">
              Lista de control <span>{hechos}/{ITEMS_CHECKLIST.length}</span>
            </div>
            <div className="cal-progreso">
              <div style={{ width: `${(hechos / ITEMS_CHECKLIST.length) * 100}%` }} />
            </div>
            <div className="cal-checklist">
              {ITEMS_CHECKLIST.map((item) => {
                const estado = c.checklist?.[item.clave];
                const hecho = Boolean(estado?.hecho);
                return (
                  <button
                    key={item.clave}
                    className={`cal-paso ${hecho ? 'hecho' : ''}`}
                    disabled={guardando !== ''}
                    onClick={() => guardar({ item: item.clave, hecho: !hecho }, item.clave)}
                  >
                    <span className="cal-paso-check">{hecho ? '✓' : ''}</span>
                    <span className="cal-paso-texto">
                      {item.etiqueta}
                      {hecho && estado.por && (
                        <small>
                          {estado.por} · {new Date(estado.fecha).toLocaleString('es-HN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                        </small>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="cal-seccion-titulo">Agenda</div>
            <div className="cal-agenda-form">
              <label className="cal-campo">
                <span>Fecha</span>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </label>
              <label className="cal-campo">
                <span>Hora</span>
                <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
              </label>
              <label className="cal-campo">
                <span>Anticipo (L)</span>
                <input type="number" step="0.01" min="0" value={anticipo} disabled={facturada} onChange={(e) => setAnticipo(e.target.value)} />
              </label>
              <label className="cal-campo cal-campo-ancho">
                <span>Lugar</span>
                <input value={lugar} onChange={(e) => setLugar(e.target.value)} />
              </label>
            </div>
            {agendaCambiada && (
              <button className="boton-sm" disabled={!fecha || guardando !== ''} onClick={guardarAgenda} style={{ marginBottom: 12 }}>
                {guardando === 'agenda' ? 'Guardando…' : 'Guardar cambios de agenda'}
              </button>
            )}

            <label className="cal-campo">
              <span>Sucursal que atiende</span>
              <select value={c.sucursal_id ?? ''} disabled={guardando !== ''} onChange={(e) => guardar({ sucursal_id: e.target.value || null }, 'sucursal')}>
                <option value="">Sin asignar</option>
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="cal-campo">
              <span>Notas de seguimiento (internas)</span>
              <textarea rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Ej. el salón abre a las 2 p. m., llevar 2 carritos, contacto del planner…" style={{ fontFamily: 'inherit' }} />
            </label>
            {notas !== (c.notas_seguimiento ?? '') && (
              <button className="boton-sm" disabled={guardando !== ''} onClick={() => guardar({ notas_seguimiento: notas }, 'notas')} style={{ marginBottom: 12 }}>
                {guardando === 'notas' ? 'Guardando…' : 'Guardar notas'}
              </button>
            )}

            <label className="cal-realizado">
              <input type="checkbox" checked={Boolean(c.realizado)} disabled={guardando !== ''} onChange={(e) => guardar({ realizado: e.target.checked }, 'realizado')} />
              El evento ya se realizó
            </label>
          </>
        )}

        <div className="cal-ficha-acciones">
          <button className="boton-sm boton-secundario" onClick={() => onVerPdf(c)}>
            Ver PDF
          </button>
          {c.fecha_evento && (
            <a className="boton-sm boton-secundario cal-enlace-boton" href={enlaceGoogleCalendar(c)} target="_blank" rel="noreferrer">
              + Google Calendar
            </a>
          )}
          {c.estado === 'aceptada' && (
            <button className="boton-sm" onClick={() => onFacturar(c)}>
              Facturar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
export default function CalendarioEventos({ cotizaciones, sucursales, sucursalIdDefecto, session, abrirId, onAbierto, onActualizada, onFacturar, onVerPdf }) {
  const hoy = hoyClave();
  const [mes, setMes] = useState(() => {
    const d = new Date();
    return { anio: d.getFullYear(), mes: d.getMonth() };
  });
  const [verTentativos, setVerTentativos] = useState(true);
  const [filtroSucursal, setFiltroSucursal] = useState('');
  const [diaSeleccionado, setDiaSeleccionado] = useState(hoy);
  const [abierta, setAbierta] = useState(null);
  const [aceptando, setAceptando] = useState(null);

  // Abrir una cotización puntual desde la lista (clic en su fecha).
  useEffect(() => {
    if (!abrirId) return;
    const c = cotizaciones.find((x) => x.id === abrirId);
    if (c?.fecha_evento) {
      const [a, m] = c.fecha_evento.split('-').map(Number);
      setMes({ anio: a, mes: m - 1 });
      setDiaSeleccionado(c.fecha_evento);
      setAbierta(c);
    }
    onAbierto?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abrirId]);

  // Mantener la ficha abierta sincronizada con la lista recargada.
  useEffect(() => {
    if (!abierta) return;
    const fresca = cotizaciones.find((x) => x.id === abierta.id);
    if (fresca && fresca !== abierta) setAbierta(fresca);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cotizaciones]);

  const visibles = useMemo(
    () =>
      cotizaciones.filter((c) => {
        if (!c.fecha_evento || c.estado === 'rechazada') return false;
        if (!verTentativos && !CONFIRMADOS.includes(c.estado)) return false;
        if (filtroSucursal && c.sucursal_id !== filtroSucursal) return false;
        return true;
      }),
    [cotizaciones, verTentativos, filtroSucursal]
  );

  const porDia = useMemo(() => {
    const mapa = new Map();
    for (const c of visibles) {
      if (!mapa.has(c.fecha_evento)) mapa.set(c.fecha_evento, []);
      mapa.get(c.fecha_evento).push(c);
    }
    for (const lista of mapa.values()) {
      lista.sort((a, b) => (CONFIRMADOS.includes(b.estado) - CONFIRMADOS.includes(a.estado)) || String(a.hora_evento ?? '99').localeCompare(String(b.hora_evento ?? '99')));
    }
    return mapa;
  }, [visibles]);

  // Celdas del mes: semanas de lunes a domingo, con días de relleno.
  const celdas = useMemo(() => {
    const primero = new Date(mes.anio, mes.mes, 1);
    const offset = (primero.getDay() + 6) % 7;
    const diasMes = new Date(mes.anio, mes.mes + 1, 0).getDate();
    const total = Math.ceil((offset + diasMes) / 7) * 7;
    return Array.from({ length: total }, (_, i) => {
      const d = new Date(mes.anio, mes.mes, i - offset + 1);
      return { clave: claveFecha(d.getFullYear(), d.getMonth(), d.getDate()), dia: d.getDate(), delMes: d.getMonth() === mes.mes };
    });
  }, [mes]);

  const prefijoMes = `${mes.anio}-${String(mes.mes + 1).padStart(2, '0')}`;
  const kpis = useMemo(() => {
    const delMes = visibles.filter((c) => c.fecha_evento.startsWith(prefijoMes));
    const confirmados = delMes.filter((c) => CONFIRMADOS.includes(c.estado));
    const tentativos = delMes.filter((c) => !CONFIRMADOS.includes(c.estado));
    const monto = confirmados.reduce((s, c) => s + Number(c.total), 0);
    const anticipos = confirmados.reduce((s, c) => s + Number(c.anticipo || 0), 0);
    return {
      confirmados: confirmados.length,
      tentativos: tentativos.length,
      montoTentativo: tentativos.reduce((s, c) => s + Number(c.total), 0),
      copitas: confirmados.reduce((s, c) => s + Number(c.cantidad_copitas), 0),
      monto,
      anticipos,
      saldo: confirmados.reduce((s, c) => s + saldoPendiente(c), 0),
    };
  }, [visibles, prefijoMes]);

  // Próximos 14 días + eventos vencidos sin cerrar: lo que hay que atender.
  const agenda = useMemo(
    () =>
      cotizaciones
        .filter((c) => CONFIRMADOS.includes(c.estado) && c.fecha_evento && (!filtroSucursal || c.sucursal_id === filtroSucursal))
        .filter((c) => {
          const dias = diasHasta(c.fecha_evento);
          const sit = situacionEvento(c);
          return (dias >= 0 && dias <= 14) || (dias < 0 && sit?.tipo === 'vencido');
        })
        .sort((a, b) => a.fecha_evento.localeCompare(b.fecha_evento) || String(a.hora_evento ?? '').localeCompare(String(b.hora_evento ?? ''))),
    [cotizaciones, filtroSucursal]
  );

  function moverMes(delta) {
    setMes(({ anio, mes: m }) => {
      const d = new Date(anio, m + delta, 1);
      return { anio: d.getFullYear(), mes: d.getMonth() };
    });
  }

  function irAHoy() {
    const d = new Date();
    setMes({ anio: d.getFullYear(), mes: d.getMonth() });
    setDiaSeleccionado(hoy);
  }

  function alActualizar(c) {
    setAbierta(c);
    onActualizada(c);
  }

  const delDia = porDia.get(diaSeleccionado) ?? [];

  return (
    <div className="cal">
      {abierta && !aceptando && (
        <ModalEvento
          cotizacion={abierta}
          sucursales={sucursales}
          session={session}
          onCerrar={() => setAbierta(null)}
          onActualizada={alActualizar}
          onFacturar={(c) => {
            setAbierta(null);
            onFacturar(c);
          }}
          onVerPdf={onVerPdf}
          onAceptar={(c) => setAceptando(c)}
        />
      )}
      {aceptando && (
        <ModalAceptar
          cotizacion={aceptando}
          sucursales={sucursales}
          sucursalIdDefecto={sucursalIdDefecto}
          session={session}
          onCerrar={() => setAceptando(null)}
          onAceptada={(c) => {
            setAceptando(null);
            alActualizar(c);
          }}
        />
      )}

      <div className="rep-kpis">
        <div className="rep-kpi">
          <span className="rep-kpi-titulo">Eventos confirmados · {MESES[mes.mes]}</span>
          <strong className="rep-kpi-valor">{kpis.confirmados}</strong>
          <span className="rep-kpi-pie">
            {kpis.tentativos > 0 ? `${kpis.tentativos} tentativos por ${fmtL(kpis.montoTentativo)}` : 'Sin tentativos pendientes'}
          </span>
        </div>
        <div className="rep-kpi">
          <span className="rep-kpi-titulo">Copitas a producir</span>
          <strong className="rep-kpi-valor">{num(kpis.copitas)}</strong>
          <span className="rep-kpi-pie">Solo eventos confirmados</span>
        </div>
        <div className="rep-kpi">
          <span className="rep-kpi-titulo">Monto confirmado</span>
          <strong className="rep-kpi-valor">{fmtL(kpis.monto)}</strong>
          <span className="rep-kpi-pie">Anticipos {fmtL(kpis.anticipos)}</span>
        </div>
        <div className="rep-kpi">
          <span className="rep-kpi-titulo">Saldo por cobrar</span>
          <strong className="rep-kpi-valor">{fmtL(kpis.saldo)}</strong>
          <span className="rep-kpi-pie">Confirmados del mes aún sin cobrar</span>
        </div>
      </div>

      <div className="cal-layout">
        <div className="panel cal-panel-mes">
          <div className="cal-barra">
            <div className="cal-nav">
              <button className="boton-sm boton-secundario" onClick={() => moverMes(-1)} aria-label="Mes anterior">
                ‹
              </button>
              <h2>
                {MESES[mes.mes]} {mes.anio}
              </h2>
              <button className="boton-sm boton-secundario" onClick={() => moverMes(1)} aria-label="Mes siguiente">
                ›
              </button>
              <button className="boton-sm boton-secundario" onClick={irAHoy}>
                Hoy
              </button>
            </div>
            <div className="cal-filtros">
              <select value={filtroSucursal} onChange={(e) => setFiltroSucursal(e.target.value)}>
                <option value="">Todas las sucursales</option>
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
              <label className="cal-toggle">
                <input type="checkbox" checked={verTentativos} onChange={(e) => setVerTentativos(e.target.checked)} />
                Ver tentativos
              </label>
            </div>
          </div>

          <div className="cal-grid cal-grid-cabecera">
            {DIAS.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="cal-grid">
            {celdas.map((celda) => {
              const eventos = porDia.get(celda.clave) ?? [];
              const confirmadosDia = eventos.filter((c) => CONFIRMADOS.includes(c.estado));
              const copitasDia = confirmadosDia.reduce((s, c) => s + Number(c.cantidad_copitas), 0);
              const clases = ['cal-celda'];
              if (!celda.delMes) clases.push('fuera');
              if (celda.clave === hoy) clases.push('hoy');
              if (celda.clave === diaSeleccionado) clases.push('seleccionada');
              if (celda.clave < hoy) clases.push('pasada');
              return (
                <div key={celda.clave} className={clases.join(' ')} onClick={() => setDiaSeleccionado(celda.clave)}>
                  <div className="cal-celda-cabecera">
                    <span className="cal-dia">{celda.dia}</span>
                    {confirmadosDia.length > 1 && <span className="cal-multiple" title="Varios eventos el mismo día">{confirmadosDia.length}</span>}
                  </div>
                  {eventos.slice(0, 3).map((c) => {
                    const sit = situacionEvento(c);
                    return (
                      <button
                        key={c.id}
                        className={`cal-pill ${CONFIRMADOS.includes(c.estado) ? 'confirmado' : 'tentativo'} ${sit ? `cal-sit-${sit.tipo}` : ''}`}
                        style={{ '--c-evento': c.sucursal_id ? colorSucursal(c.sucursal_id) : 'var(--primario)' }}
                        title={`${c.nombre_evento} · ${c.nombre_cliente} · ${num(c.cantidad_copitas)} copitas${sit ? ` · ${sit.texto}` : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDiaSeleccionado(celda.clave);
                          setAbierta(c);
                        }}
                      >
                        {c.hora_evento && <b>{horaCorta(c.hora_evento).replace(' ', '').replace('. m.', '')}</b>} {c.nombre_evento}
                      </button>
                    );
                  })}
                  {eventos.length > 3 && <span className="cal-mas">+{eventos.length - 3} más</span>}
                  {copitasDia > 0 && <span className="cal-copitas">{num(copitasDia)} copitas</span>}
                </div>
              );
            })}
          </div>
          <div className="cal-leyenda">
            <span>
              <i className="cal-l-confirmado" /> Confirmado
            </span>
            <span>
              <i className="cal-l-tentativo" /> Tentativo (borrador / enviada)
            </span>
            <span>
              <i className="cal-l-urgente" /> Faltan pasos a ≤3 días
            </span>
            <span>
              <i className="cal-l-listo" /> Todo listo
            </span>
          </div>
        </div>

        <div className="cal-lateral">
          <div className="panel">
            <h2 className="cal-lateral-titulo">{fechaLarga(diaSeleccionado)}</h2>
            {delDia.length === 0 ? (
              <p className="cal-vacio">Sin eventos este día.</p>
            ) : (
              delDia.map((c) => <TarjetaEvento key={c.id} c={c} onAbrir={() => setAbierta(c)} />)
            )}
          </div>
          <div className="panel">
            <h2 className="cal-lateral-titulo">Por atender · próximos 14 días</h2>
            {agenda.length === 0 ? (
              <p className="cal-vacio">No hay eventos confirmados en los próximos 14 días.</p>
            ) : (
              agenda.map((c) => <TarjetaEvento key={c.id} c={c} conFecha onAbrir={() => setAbierta(c)} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TarjetaEvento({ c, conFecha, onAbrir }) {
  const sit = situacionEvento(c);
  const hechos = pasosHechos(c);
  const confirmado = CONFIRMADOS.includes(c.estado);
  return (
    <button className={`cal-tarjeta ${confirmado ? '' : 'tentativo'}`} style={{ '--c-evento': c.sucursal_id ? colorSucursal(c.sucursal_id) : 'var(--primario)' }} onClick={onAbrir}>
      <div className="cal-tarjeta-fila">
        <strong>{c.nombre_evento}</strong>
        <span className={`cal-estado cal-estado-${c.estado}`}>{ETIQUETA_ESTADO[c.estado]}</span>
      </div>
      <div className="cal-sub">
        {conFecha && `${fechaLarga(c.fecha_evento).split(',').slice(0, 2).join(',')} · `}
        {c.hora_evento ? horaCorta(c.hora_evento) : 'Sin hora'} · {num(c.cantidad_copitas)} copitas · {fmtL(c.total)}
      </div>
      {confirmado && (
        <>
          <div className="cal-progreso cal-progreso-mini">
            <div style={{ width: `${(hechos / ITEMS_CHECKLIST.length) * 100}%` }} />
          </div>
          {sit && <div className={`cal-situacion-mini cal-sit-${sit.tipo}`}>{sit.texto}</div>}
        </>
      )}
    </button>
  );
}
```

### `frontend/src/components/Graficas.jsx`

```jsx
// Gráficas mínimas en HTML/CSS puro (sin librería) — mismo criterio que el
// resto del ecosistema Italo. Ver skill dataviz: una serie = un color fijo,
// sin leyenda; >=2 series simultáneas = paleta categórica + leyenda.

export function Leyenda({ items }) {
  return (
    <div className="leyenda">
      {items.map((it) => (
        <span key={it.nombre} className="leyenda-item">
          <span className="leyenda-punto" style={{ background: it.color }} />
          {it.nombre}
        </span>
      ))}
    </div>
  );
}

export function BarraHorizontal({ datos, valorClave = 'valor', etiquetaClave = 'nombre', color, formatear }) {
  const max = Math.max(1, ...datos.map((d) => Number(d[valorClave])));
  const fmt = formatear ?? ((n) => n.toLocaleString('es-HN'));
  return (
    <div>
      {datos.map((d) => (
        <div key={d[etiquetaClave]} className="barra-h-fila">
          <span className="barra-h-etiqueta" title={d[etiquetaClave]}>
            {d[etiquetaClave]}
          </span>
          <span className="barra-h-pista">
            <span
              className="barra-h-relleno"
              style={{ width: `${(Number(d[valorClave]) / max) * 100}%`, background: d.color ?? color }}
            />
          </span>
          <span className="barra-h-valor">{fmt(Number(d[valorClave]))}</span>
        </div>
      ))}
      {datos.length === 0 && <p style={{ color: 'var(--text-dim)' }}>Sin datos en este rango.</p>}
    </div>
  );
}

export function BarrasVerticales({ datos, valorClave = 'valor', etiquetaClave = 'etiqueta', color, formatear }) {
  const max = Math.max(1, ...datos.map((d) => Number(d[valorClave])));
  const fmt = formatear ?? ((n) => n.toLocaleString('es-HN'));
  return (
    <div className="barras-verticales">
      {datos.map((d, i) => (
        <div key={`${d[etiquetaClave]}-${i}`} className="barra-v-col">
          <span className="barra-v-valor">{fmt(Number(d[valorClave]))}</span>
          <div
            className="barra-v-relleno"
            style={{ height: `${Math.max(2, (Number(d[valorClave]) / max) * 100)}%`, background: d.color ?? color }}
          />
          <span className="barra-v-etiqueta">{d[etiquetaClave]}</span>
        </div>
      ))}
      {datos.length === 0 && <p style={{ color: 'var(--text-dim)' }}>Sin datos en este rango.</p>}
    </div>
  );
}
```

### `frontend/src/components/Icono.jsx`

```jsx
// Íconos de línea (trazos basados en Lucide, licencia ISC) dibujados en
// línea para no depender de una librería ni de internet.
const TRAZOS = {
  dashboard: ['M3 3h7v9H3z', 'M14 3h7v5h-7z', 'M14 12h7v9h-7z', 'M3 16h7v5H3z'],
  pos: ['M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12', 'M8 21h.01', 'M19 21h.01'],
  facturas: ['M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z', 'M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8', 'M12 17.5v-11'],
  cotizaciones: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M12 14l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z'],
  cierres: ['M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1', 'M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4'],
  catalogo: ['m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11', 'M17 7A5 5 0 0 0 7 7', 'M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4'],
  clientes: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8z', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  reportes: ['M3 3v18h18', 'M18 17V9', 'M13 17V5', 'M8 17v-3'],
  'caja-chica': ['M8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2z', 'M18.09 10.37A6 6 0 1 1 10.34 18', 'M7 6h1v4', 'm16.71 13.88.7.71-2.82 2.82'],
  'puntos-emision': ['M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z', 'M14 2v4a2 2 0 0 0 2 2h4', 'M10 9H8', 'M16 13H8', 'M16 17H8'],
  usuarios: ['M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z', 'M5 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2'],
  sucursales: ['M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V13h6v9'],
  antifraude: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z', 'M12 8v4', 'M12 16h.01'],
  bitacora: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
  impresora: ['M6 9V2h12v7', 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2', 'M6 14h12v8H6z'],
  salir: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5', 'M21 12H9'],
  luna: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
  sol: ['M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z', 'M12 2v2', 'M12 20v2', 'm4.93 4.93 1.41 1.41', 'm17.66 17.66 1.41 1.41', 'M2 12h2', 'M20 12h2', 'm6.34 17.66-1.41 1.41', 'm19.07 4.93-1.41 1.41'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  colapsar: ['m15 18-6-6 6-6'],
  expandir: ['m9 18 6-6-6-6'],
  candado: ['M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z', 'M7 11V7a5 5 0 0 1 10 0v4'],
  lupa: ['M11 3a8 8 0 1 1 0 16 8 8 0 0 1 0-16z', 'm21 21-4.3-4.3'],
  reloj: ['M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z', 'M12 6v6l4 2'],
  dinero: ['M2 6h20v12H2z', 'M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z', 'M6 12h.01', 'M18 12h.01'],
};

export default function Icono({ nombre, tam = 20, grosor = 1.8, className }) {
  const trazos = TRAZOS[nombre] ?? TRAZOS.dashboard;
  return (
    <svg
      className={className}
      width={tam}
      height={tam}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={grosor}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {trazos.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

// Isotipo Ítalo (anillo + barra), BrandBook pág. 5.
export function IsotipoItalo({ tam = 30, color = 'currentColor' }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="27.5" r="19" fill="none" stroke={color} strokeWidth="8.3" />
      <rect x="12.8" y="53" width="38.4" height="8.3" rx="1.7" fill={color} />
    </svg>
  );
}
```

### `frontend/src/components/NotificacionesAlertas.jsx`

```jsx
import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';

// Aviso inmediato al administrador cuando entra una alerta nueva: tarjeta
// emergente, sonido corto y notificación del navegador (aunque la pestaña
// esté en segundo plano).
function sonar(severidad) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const tonos = severidad === 'alta' ? [880, 660, 880] : [740];
    tonos.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.18);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + i * 0.18 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.18 + 0.16);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.18);
      o.stop(ctx.currentTime + i * 0.18 + 0.17);
    });
  } catch {
    // sin audio disponible
  }
}

export default function NotificacionesAlertas({ session, onVer }) {
  const [avisos, setAvisos] = useState([]);
  const ultimoId = useRef(null);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    let activo = true;
    async function revisar() {
      try {
        const nuevas = await api.get(`/antifraude/alertas/nuevas?desde_id=${ultimoId.current ?? 0}`, session);
        if (!activo || nuevas.length === 0) return;
        const maxId = Math.max(...nuevas.map((a) => a.id));
        // La primera consulta sólo fija el punto de partida (no avisa lo viejo).
        if (ultimoId.current === null) {
          ultimoId.current = maxId;
          return;
        }
        ultimoId.current = maxId;
        const relevantes = nuevas.filter((a) => a.severidad !== 'baja');
        if (relevantes.length === 0) return;
        setAvisos((a) => [...relevantes, ...a].slice(0, 4));
        sonar(relevantes.some((a) => a.severidad === 'alta') ? 'alta' : 'media');
        if ('Notification' in window && Notification.permission === 'granted' && document.visibilityState !== 'visible') {
          for (const a of relevantes.slice(0, 3)) new Notification('Alerta Ítalo', { body: a.titulo, tag: `alerta-${a.id}` });
        }
      } catch {
        // se reintenta en el próximo ciclo
      }
    }
    if (ultimoId.current === null) {
      api
        .get('/antifraude/alertas/nuevas', session)
        .then((r) => {
          ultimoId.current = r.length ? Math.max(...r.map((a) => a.id)) : 0;
        })
        .catch(() => {
          ultimoId.current = 0;
        });
    }
    const t = setInterval(revisar, 30 * 1000);
    return () => {
      activo = false;
      clearInterval(t);
    };
  }, [session]);

  if (avisos.length === 0) return null;
  return (
    <div className="notif-pila">
      {avisos.map((a) => (
        <div key={a.id} className={`notif notif-${a.severidad}`}>
          <div>
            <strong>{a.severidad === 'alta' ? '⚠ Alerta alta' : 'Alerta'}</strong>
            <p>{a.titulo}</p>
          </div>
          <div className="notif-acciones">
            <button
              className="boton-sm"
              onClick={() => {
                setAvisos((l) => l.filter((x) => x.id !== a.id));
                onVer();
              }}
            >
              Ver
            </button>
            <button className="boton-sm boton-secundario" onClick={() => setAvisos((l) => l.filter((x) => x.id !== a.id))}>
              Cerrar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Frontend: pantallas

### `frontend/src/screens/Antifraude.jsx`

```jsx
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { nombreCortoSucursal } from '../lib/coloresSucursal.js';
import { descargarCsv } from '../lib/csv.js';
import { hoyHn, sumarDias } from '../lib/rangosFecha.js';
import { useCambiosEnVivo } from '../lib/tiempoReal.js';

const ZONA = 'America/Tegucigalpa';
const fechaHora = (iso) => new Date(iso).toLocaleString('es-HN', { timeZone: ZONA, dateStyle: 'short', timeStyle: 'short' });
const hora = (iso) => new Date(iso).toLocaleTimeString('es-HN', { timeZone: ZONA, hour: '2-digit', minute: '2-digit', second: '2-digit' });
const L = (n) => `L ${Number(n ?? 0).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const PESTANAS = [
  { id: 'alertas', etiqueta: 'Alertas' },
  { id: 'cajeros', etiqueta: 'Señales por cajero' },
  { id: 'linea', etiqueta: 'Línea de tiempo' },
  { id: 'arqueo', etiqueta: 'Arqueo sorpresa' },
  { id: 'reglas', etiqueta: 'Reglas' },
];

const ESTADOS = {
  pendiente: 'Pendiente',
  investigando: 'Investigando',
  resuelta: 'Resuelta',
  falso_positivo: 'Falso positivo',
};

const ETIQUETA_TIPO = {
  'cierre.descuadre': 'Descuadre de caja',
  'cierre.patron_desvio': 'Patrón de desvío',
  'cierre.reincidencia': 'Faltantes repetidos',
  'cierre.sin_imprimir': 'Facturas sin imprimir',
  'venta.anular': 'Factura anulada',
  'venta.nota_credito': 'Nota de crédito',
  'venta.descartar_orden': 'Orden descartada',
  'venta.doble_factura': 'Posible doble factura',
  'venta.reimpresion_repetida': 'Reimpresiones repetidas',
  'orden.estacionada': 'Orden estacionada',
  'tercera_edad.carne_repetido': 'Carné repetido',
  'tercera_edad.exceso': 'Exceso de 3ª edad',
  'acceso.denegado': 'Acceso sin permiso',
  'horario.fuera': 'Fuera de horario',
  'sesion.dispositivo_nuevo': 'Dispositivo nuevo',
  'sesion.simultanea': 'Sesión simultánea',
  'sesion.login_fallido': 'Intentos de entrada fallidos',
  'producto.baja_precio': 'Baja de precio',
  'usuario.crear': 'Usuario nuevo',
  'usuario.permisos': 'Cambio de permisos',
  'usuario.contrasena': 'Cambio de contraseña',
  'cai.cambio': 'Cambio fiscal (CAI)',
  'arqueo.descuadre': 'Arqueo con diferencia',
  'bitacora.alterada': 'Bitácora alterada',
};

const ETIQUETA_EVENTO = {
  'venta.descartar_orden': 'Descartó una orden',
  'orden.quitar_producto': 'Quitó producto de una orden',
  'orden.descuento': 'Aplicó descuento',
  'venta.reimprimir_ticket': 'Reimprimió factura',
  'venta.imprimir_ticket': 'Imprimió factura',
  'venta.facturar': 'Emitió factura',
  'venta.crear_orden': 'Abrió orden',
  'venta.editar_orden': 'Modificó orden',
  'acceso.denegado': 'Intentó entrar sin permiso',
  'sesion.inicio': 'Inició sesión',
  'sesion.fin': 'Cerró sesión',
  'sesion.bloqueo': 'Pantalla bloqueada por inactividad',
  'sesion.desbloqueo': 'Desbloqueó la pantalla',
  'sesion.desbloqueo_fallido': 'Contraseña incorrecta al desbloquear',
  'sesion.dispositivo_nuevo': 'Entró desde un dispositivo nuevo',
  'pantalla.ver': 'Abrió pantalla',
  'factura.buscar': 'Buscó facturas',
  'factura.ver': 'Vio una factura',
  'cierre.crear': 'Cerró caja',
  'cierre.imprimir': 'Imprimió cierre',
  'reporte.generar': 'Generó reporte',
};

const SENSIBLES = new Set(['venta.descartar_orden', 'orden.quitar_producto', 'venta.reimprimir_ticket', 'acceso.denegado', 'orden.descuento', 'sesion.desbloqueo_fallido']);

function resumenEvento(e) {
  const d = e.detalle ?? {};
  switch (e.accion) {
    case 'orden.quitar_producto':
      return `${d.cantidad ?? 1} × ${d.producto ?? ''} (${L(d.monto)})`;
    case 'orden.descuento':
      return `${d.porcentaje}% a ${d.cantidad} × ${d.producto}`;
    case 'venta.descartar_orden':
      return `${L(d.total)} · ${d.motivo ?? 'sin motivo'} · ${(d.items ?? []).join(', ')}`;
    case 'acceso.denegado':
      return `${d.metodo ?? ''} ${d.ruta ?? ''}${d.motivo ? ` (${d.motivo})` : ''}`;
    case 'venta.reimprimir_ticket':
      return `${d.numero_factura ?? ''} · copia #${d.reimpresion_no ?? ''} · ${d.motivo ?? ''}`;
    case 'venta.imprimir_ticket':
    case 'venta.facturar':
      return `${d.numero_factura ?? ''} · ${L(d.total)}${d.pagos ? ` · ${d.pagos.map((p) => p.forma).join(' + ')}` : ''}`;
    case 'venta.editar_orden':
      return `L ${d.total_anterior} → L ${d.total_nuevo}`;
    case 'pantalla.ver':
      return d.pantalla ?? '';
    case 'factura.buscar':
      return d.q ? `"${d.q}"` : `${d.desde ?? ''} a ${d.hasta ?? ''}`;
    case 'factura.ver':
      return `${d.factura ?? ''} · ${L(d.total)}`;
    default:
      return '';
  }
}

function Alerta({ a, onEstado }) {
  const [abierta, setAbierta] = useState(false);
  const detalle = Object.entries(a.detalle ?? {}).filter(([, v]) => v !== null && typeof v !== 'object');
  const cerrada = a.estado === 'resuelta' || a.estado === 'falso_positivo';
  return (
    <div className={`af-alerta af-${a.severidad}${cerrada ? ' af-revisada' : ''}`}>
      <div className="af-alerta-fila" onClick={() => setAbierta(!abierta)}>
        <span className={`af-sev af-sev-${a.severidad}`}>{a.severidad}</span>
        <div className="af-alerta-texto">
          <strong>{a.titulo}</strong>
          <span>
            {ETIQUETA_TIPO[a.tipo] ?? a.tipo} · {nombreCortoSucursal(a.sucursales?.nombre ?? '') || 'General'} · {a.usuario_nombre ?? 'Sistema'} ·{' '}
            {fechaHora(a.created_at)}
          </span>
        </div>
        <select
          className={`af-estado af-estado-${a.estado}`}
          value={a.estado ?? 'pendiente'}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onEstado(a, e.target.value)}
        >
          {Object.entries(ESTADOS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      {abierta && (
        <div className="af-alerta-detalle">
          {detalle.map(([k, v]) => (
            <div key={k}>
              <span>{k.replace(/_/g, ' ')}</span>
              <strong>{String(v)}</strong>
            </div>
          ))}
          {a.nota_revision && (
            <div>
              <span>nota de seguimiento</span>
              <strong>{a.nota_revision}</strong>
            </div>
          )}
          {a.revisor?.nombre && (
            <div>
              <span>última revisión</span>
              <strong>
                {a.revisor.nombre} · {a.revisada_at ? fechaHora(a.revisada_at) : ''}
              </strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Mini({ semanas }) {
  const max = Math.max(1, ...semanas);
  return (
    <span className="af-mini" title={`Últimas 4 semanas: ${semanas.join(' · ')}`}>
      {semanas.map((v, i) => (
        <span key={i} style={{ height: `${Math.max(8, (v / max) * 100)}%`, opacity: v ? 1 : 0.25 }} />
      ))}
    </span>
  );
}

// ── Pestaña: línea de tiempo ─────────────────────────────────────────────
function LineaTiempo({ session }) {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioId, setUsuarioId] = useState('');
  const [fecha, setFecha] = useState(hoyHn());
  const [datos, setDatos] = useState(null);
  const [soloSensibles, setSoloSensibles] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/antifraude/usuarios', session).then(setUsuarios).catch((e) => setError(e.message));
  }, [session]);

  async function cargar() {
    if (!usuarioId) return;
    setError('');
    try {
      setDatos(await api.get(`/antifraude/linea-tiempo?usuario_id=${usuarioId}&fecha=${fecha}`, session));
    } catch (e) {
      setError(e.message);
    }
  }

  const nombre = usuarios.find((u) => u.id === usuarioId)?.nombre ?? '';
  const items = (datos?.items ?? []).filter((i) => !soloSensibles || SENSIBLES.has(i.accion));

  function exportar() {
    descargarCsv(`expediente-${nombre.replace(/\s+/g, '-')}-${fecha}.csv`, datos.items, [
      { titulo: 'Hora', valor: (i) => hora(i.momento) },
      { titulo: 'Acción', valor: (i) => ETIQUETA_EVENTO[i.accion] ?? i.accion },
      { titulo: 'Detalle', valor: (i) => resumenEvento(i) || JSON.stringify(i.detalle ?? {}) },
      { titulo: 'Sucursal', valor: (i) => i.sucursal ?? '' },
      { titulo: 'IP', valor: (i) => i.ip ?? '' },
    ]);
  }

  return (
    <div className="panel">
      <h2>Línea de tiempo del turno</h2>
      <p className="af-intro">
        Todo lo que hizo una persona en un día, minuto a minuto: facturas, productos quitados, descuentos, reimpresiones,
        pantallas abiertas. Sirve para reconstruir un turno y cruzarlo con las cámaras. Se exporta como expediente.
      </p>
      {error && <div className="error">{error}</div>}
      <div className="toolbar">
        <select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
          <option value="">Elige a la persona…</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre} ({u.rol})
            </option>
          ))}
        </select>
        <input type="date" value={fecha} max={hoyHn()} onChange={(e) => setFecha(e.target.value)} />
        <button className="boton-sm" onClick={cargar} disabled={!usuarioId}>
          Ver turno
        </button>
        {datos && (
          <>
            <label className="rep-check">
              <input type="checkbox" checked={soloSensibles} onChange={(e) => setSoloSensibles(e.target.checked)} />
              Sólo movimientos sensibles
            </label>
            <button className="boton-sm boton-secundario" onClick={exportar}>
              Exportar expediente (CSV)
            </button>
          </>
        )}
      </div>
      {datos && (
        <>
          <div className="af-resumen-turno">
            <div>
              <span>Facturas</span>
              <strong>{datos.resumen.facturas}</strong>
            </div>
            <div>
              <span>Vendido</span>
              <strong>{L(datos.resumen.total)}</strong>
            </div>
            <div>
              <span>Sin imprimir</span>
              <strong className={datos.resumen.sin_imprimir ? 'rep-alerta' : ''}>{datos.resumen.sin_imprimir}</strong>
            </div>
            <div>
              <span>Reimpresiones</span>
              <strong>{datos.resumen.reimpresiones}</strong>
            </div>
            <div>
              <span>3ª edad</span>
              <strong>{datos.resumen.tercera_edad}</strong>
            </div>
            <div>
              <span>Primer / último movimiento</span>
              <strong>
                {datos.resumen.primer_movimiento ? hora(datos.resumen.primer_movimiento) : '—'} –{' '}
                {datos.resumen.ultimo_movimiento ? hora(datos.resumen.ultimo_movimiento) : '—'}
              </strong>
            </div>
          </div>
          <ol className="af-linea">
            {items.length === 0 && <li className="rep-vacio">Sin movimientos ese día.</li>}
            {items.map((i, idx) => (
              <li key={idx} className={SENSIBLES.has(i.accion) ? 'af-linea-sensible' : ''}>
                <span className="af-linea-hora">{hora(i.momento)}</span>
                <span className="af-linea-punto" />
                <span>
                  <strong>{ETIQUETA_EVENTO[i.accion] ?? i.accion}</strong>
                  {resumenEvento(i) && <span className="rep-tenue"> · {resumenEvento(i)}</span>}
                </span>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

// ── Pestaña: arqueo sorpresa ─────────────────────────────────────────────
function ArqueoSorpresa({ session, sucursales }) {
  const [sucursalId, setSucursalId] = useState('');
  const [contado, setContado] = useState('');
  const [fondo, setFondo] = useState('');
  const [nota, setNota] = useState('');
  const [resultado, setResultado] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(() => api.get('/antifraude/arqueos', session).then(setHistorial).catch((e) => setError(e.message)), [session]);
  useEffect(() => {
    cargar();
  }, [cargar]);

  async function registrar() {
    if (!window.confirm('¿Registrar el arqueo? El sistema compara lo contado contra lo que debería haber en este momento.')) return;
    setGuardando(true);
    setError('');
    try {
      const r = await api.post('/antifraude/arqueos', session, { sucursal_id: sucursalId, contado: Number(contado), fondo_caja: fondo, nota });
      setResultado(r);
      setContado('');
      setNota('');
      cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <>
      <div className="panel">
        <h2>Arqueo sorpresa</h2>
        <p className="af-intro">
          Llega a la sucursal sin avisar, cuenta el efectivo de la gaveta y regístralo aquí. El sistema NO muestra antes cuánto
          debería haber: primero se cuenta, después compara contra fondo + ventas en efectivo − salidas desde el último cierre.
        </p>
        {error && <div className="error">{error}</div>}
        <div className="toolbar">
          <select value={sucursalId} onChange={(e) => setSucursalId(e.target.value)}>
            <option value="">Sucursal…</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {nombreCortoSucursal(s.nombre)}
              </option>
            ))}
          </select>
          <input type="number" inputMode="decimal" min="0" step="0.01" placeholder="Efectivo contado (L)" value={contado} onChange={(e) => setContado(e.target.value)} />
          <input type="number" inputMode="decimal" min="0" step="0.01" placeholder="Fondo (vacío = el del último cierre)" value={fondo} onChange={(e) => setFondo(e.target.value)} />
          <input placeholder="Nota (opcional)" value={nota} onChange={(e) => setNota(e.target.value)} />
          <button className="boton-sm" disabled={!sucursalId || contado === '' || guardando} onClick={registrar}>
            {guardando ? 'Registrando…' : 'Registrar arqueo'}
          </button>
        </div>
        {resultado && (
          <div className={Math.abs(resultado.diferencia) < 1 ? 'aviso-ok' : 'error'} style={{ fontWeight: 600 }}>
            {Math.abs(resultado.diferencia) < 1
              ? `Cuadra. Esperado ${L(resultado.esperado)}, contado ${L(resultado.contado)}.`
              : `${resultado.diferencia < 0 ? 'Faltan' : 'Sobran'} ${L(Math.abs(resultado.diferencia))}. Esperado ${L(resultado.esperado)}, contado ${L(resultado.contado)}. Se generó una alerta.`}
          </div>
        )}
      </div>
      <div className="panel">
        <h2>Arqueos anteriores</h2>
        <div className="tabla-scroll">
          <table className="tabla rep-tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Sucursal</th>
                <th>Contó</th>
                <th>En turno</th>
                <th className="rep-num">Esperado</th>
                <th className="rep-num">Contado</th>
                <th className="rep-num">Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {historial.length === 0 && (
                <tr>
                  <td colSpan={7} className="rep-vacio">
                    Todavía no hay arqueos.
                  </td>
                </tr>
              )}
              {historial.map((a) => (
                <tr key={a.id}>
                  <td>{fechaHora(a.created_at)}</td>
                  <td>{nombreCortoSucursal(a.sucursales?.nombre ?? '')}</td>
                  <td>{a.usuario?.nombre ?? ''}</td>
                  <td>{a.cajeros_turno ?? '—'}</td>
                  <td className="rep-num">{L(a.esperado)}</td>
                  <td className="rep-num">{L(a.contado)}</td>
                  <td className="rep-num">
                    <strong className={Number(a.diferencia) <= -1 ? 'rep-alerta' : ''}>{L(a.diferencia)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Pestaña: reglas ──────────────────────────────────────────────────────
const CAMPOS_REGLAS = [
  { grupo: 'Descuentos', campos: [
    ['exigir_carne_tercera_edad', 'Exigir nombre y No. de identidad para el 25% de tercera edad', 'bool'],
    ['max_usos_carne_dia', 'Veces que un mismo carné puede usarse al día antes de alertar'],
    ['max_tercera_edad_dia', 'Facturas con 3ª edad por cajero al día antes de alertar'],
  ] },
  { grupo: 'Órdenes e impresión', campos: [
    ['exigir_motivo_descarte', 'Pedir motivo para descartar una orden', 'bool'],
    ['monto_alerta_descarte', 'Monto (L) de orden descartada que genera alerta'],
    ['minutos_orden_estacionada', 'Minutos de una orden abierta sin cobrar antes de alertar'],
    ['minutos_doble_factura', 'Ventana (min) para detectar doble factura'],
    ['exigir_motivo_reimpresion', 'Pedir motivo para reimprimir una factura', 'bool'],
    ['leyenda_factura_gratis', 'Imprimir "Si no recibe su factura, su compra es GRATIS" en el ticket', 'bool'],
  ] },
  { grupo: 'Caja', campos: [
    ['umbral_sobrante', 'Sobrante (L) que se considera relevante'],
    ['faltantes_reincidencia', 'Cierres con faltante en 7 días para alerta de reincidencia'],
    ['minutos_hueco', 'Minutos sin facturar que cuentan como hueco'],
  ] },
  { grupo: 'Sesiones', campos: [
    ['minutos_bloqueo_cajero', 'Bloquear pantalla del cajero tras (min) sin uso'],
    ['minutos_bloqueo_otros', 'Bloquear pantalla de admin/manager tras (min) sin uso'],
    ['intentos_login', 'Intentos fallidos de entrada (15 min) antes de alertar'],
    ['hora_apertura', 'Hora desde la que el uso es normal (0-23)'],
    ['hora_cierre', 'Hora hasta la que el uso es normal (1-24)'],
  ] },
];

function Reglas({ session }) {
  const [reglas, setReglas] = useState(null);
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/antifraude/reglas', session).then(setReglas).catch((e) => setError(e.message));
  }, [session]);

  async function guardar() {
    setError('');
    try {
      setReglas(await api.put('/antifraude/reglas', session, reglas));
      setAviso('Reglas guardadas. Aplican de inmediato en todas las sucursales.');
      setTimeout(() => setAviso(''), 4000);
    } catch (e) {
      setError(e.message);
    }
  }

  if (!reglas) return <div className="panel rep-vacio">Cargando reglas…</div>;
  return (
    <div className="panel">
      <h2>Reglas y umbrales</h2>
      <p className="af-intro">Ajusta qué tan estricto es el sistema. Cada cambio queda en la bitácora.</p>
      {error && <div className="error">{error}</div>}
      {aviso && <div className="aviso-ok">{aviso}</div>}
      <div className="af-reglas">
        {CAMPOS_REGLAS.map((g) => (
          <fieldset key={g.grupo}>
            <legend>{g.grupo}</legend>
            {g.campos.map(([clave, etiqueta, tipo]) =>
              tipo === 'bool' ? (
                <label key={clave} className="af-regla af-regla-bool">
                  <input type="checkbox" checked={Boolean(reglas[clave])} onChange={(e) => setReglas({ ...reglas, [clave]: e.target.checked })} />
                  <span>{etiqueta}</span>
                </label>
              ) : (
                <label key={clave} className="af-regla">
                  <span>{etiqueta}</span>
                  <input type="number" min="0" value={reglas[clave]} onChange={(e) => setReglas({ ...reglas, [clave]: e.target.value })} />
                </label>
              )
            )}
          </fieldset>
        ))}
      </div>
      <button className="boton-sm" onClick={guardar} style={{ marginTop: 12 }}>
        Guardar reglas
      </button>
    </div>
  );
}

// ── Pantalla principal ───────────────────────────────────────────────────
export default function Antifraude({ session, sucursales }) {
  const [pestana, setPestana] = useState('alertas');
  const [filtros, setFiltros] = useState(() => ({ desde: sumarDias(hoyHn(), -6), hasta: hoyHn(), sucursal_id: '' }));
  const [alertas, setAlertas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('abiertas');
  const [datos, setDatos] = useState(null);
  const [tendencia, setTendencia] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [correo, setCorreo] = useState(null);

  useEffect(() => {
    api.get('/antifraude/correo', session).then(setCorreo).catch(() => {});
    api.get('/antifraude/tendencia', session).then(setTendencia).catch(() => {});
  }, [session]);

  const cargarAlertas = useCallback(async () => {
    const params = new URLSearchParams();
    if (filtroEstado === 'abiertas') params.set('solo_pendientes', '1');
    else if (filtroEstado !== 'todas') params.set('estado', filtroEstado);
    if (filtros.sucursal_id) params.set('sucursal_id', filtros.sucursal_id);
    setAlertas(await api.get(`/antifraude/alertas?${params.toString()}`, session));
  }, [session, filtroEstado, filtros.sucursal_id]);

  const cargarIndicadores = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const params = new URLSearchParams({ desde: filtros.desde, hasta: filtros.hasta });
      if (filtros.sucursal_id) params.set('sucursal_id', filtros.sucursal_id);
      setDatos(await api.get(`/antifraude/indicadores?${params.toString()}`, session));
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [session, filtros]);

  useEffect(() => {
    cargarAlertas().catch((e) => setError(e.message));
  }, [cargarAlertas]);

  useEffect(() => {
    cargarIndicadores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useCambiosEnVivo(['ventas', 'cierres_caja'], () => cargarAlertas().catch(() => {}), { retrasoMs: 2500 });

  async function cambiarEstado(a, estado) {
    let nota = '';
    if (estado !== 'investigando') {
      const r = window.prompt(`${ESTADOS[estado]}: ${a.titulo}\n\n¿Qué encontraste / qué se hizo? (opcional)`, '');
      if (r === null) return;
      nota = r;
    }
    try {
      await api.put(`/antifraude/alertas/${a.id}/estado`, session, { estado, nota });
      cargarAlertas();
    } catch (e) {
      setError(e.message);
    }
  }

  const abiertas = alertas.filter((a) => a.estado === 'pendiente' || a.estado === 'investigando').length;
  const tendenciaPor = new Map(tendencia.map((t) => [t.usuario_id, t]));

  return (
    <div className="antifraude">
      {error && <div className="error">{error}</div>}

      <div className="panel">
        <h2>Antifraude</h2>
        <p className="af-intro">
          Todo lo que se hace en el sistema queda en la bitácora inalterable. Aquí se resume lo que merece revisión y se
          investiga cada caso hasta cerrarlo.
        </p>
        {correo && !correo.configurado && (
          <div className="alerta">
            El envío de correos no está configurado en el servidor: las alertas se ven aquí pero no llegan por correo. Hay que
            agregar GMAIL_USER y GMAIL_APP_PASSWORD en Render.
          </div>
        )}
        {correo?.configurado && <p className="af-intro">Las alertas graves llegan por correo a: {correo.destinatarios.join(', ')}</p>}
        <div className="toolbar">
          <select value={filtros.sucursal_id} onChange={(e) => setFiltros({ ...filtros, sucursal_id: e.target.value })}>
            <option value="">Todas las sucursales</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {nombreCortoSucursal(s.nombre)}
              </option>
            ))}
          </select>
          <input type="date" value={filtros.desde} max={hoyHn()} onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })} />
          <input type="date" value={filtros.hasta} max={hoyHn()} onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })} />
          <button
            className="boton-sm"
            onClick={() => {
              cargarIndicadores();
              cargarAlertas();
            }}
            disabled={cargando}
          >
            {cargando ? 'Analizando…' : 'Analizar'}
          </button>
        </div>
      </div>

      <div className="rep-pestanas" role="tablist">
        {PESTANAS.map((p) => (
          <button key={p.id} role="tab" aria-selected={pestana === p.id} className={pestana === p.id ? 'activa' : ''} onClick={() => setPestana(p.id)}>
            {p.etiqueta}
            {p.id === 'alertas' && abiertas > 0 && <span className="rep-contador">{abiertas}</span>}
          </button>
        ))}
      </div>

      {pestana === 'alertas' && (
        <div className="panel">
          <div className="af-titulo">
            <h2>Alertas</h2>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} style={{ width: 'auto' }}>
              <option value="abiertas">Abiertas (pendientes e investigando)</option>
              <option value="pendiente">Pendientes</option>
              <option value="investigando">Investigando</option>
              <option value="resuelta">Resueltas</option>
              <option value="falso_positivo">Falsos positivos</option>
              <option value="todas">Todas</option>
            </select>
          </div>
          {alertas.length === 0 && <p className="rep-vacio">Sin alertas en esta vista. 👌</p>}
          {alertas.map((a) => (
            <Alerta key={a.id} a={a} onEstado={cambiarEstado} />
          ))}
        </div>
      )}

      {pestana === 'cajeros' && datos && (
        <>
          <div className="panel">
            <h2>Señales por cajero</h2>
            <p className="af-intro">
              Cada cajero se compara con el promedio del grupo en el período. La mini-gráfica muestra sus alertas de las últimas
              4 semanas. Una señal no prueba un robo: indica dónde mirar primero.
            </p>
            <div className="tabla-scroll">
              <table className="tabla af-tabla">
                <thead>
                  <tr>
                    <th>Cajero</th>
                    <th>4 sem.</th>
                    <th className="rep-num">Facturas</th>
                    <th className="rep-num">Vendido</th>
                    <th className="rep-num">% efect.</th>
                    <th className="rep-num">% c/desc.</th>
                    <th className="rep-num">3ª edad</th>
                    <th className="rep-num">Anuladas</th>
                    <th className="rep-num">Descartadas</th>
                    <th className="rep-num">Quitados</th>
                    <th className="rep-num">Reimpr.</th>
                    <th className="rep-num">Sin imprimir</th>
                    <th className="rep-num">Faltantes</th>
                    <th className="rep-num">Sin permiso</th>
                    <th>Señales</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.cajeros.length === 0 && (
                    <tr>
                      <td colSpan={15} className="rep-vacio">
                        Sin actividad en el rango.
                      </td>
                    </tr>
                  )}
                  {datos.cajeros.map((c) => (
                    <tr key={c.cajero_id} className={c.riesgo >= 5 ? 'af-fila-alta' : c.riesgo >= 2 ? 'af-fila-media' : ''}>
                      <td>
                        <strong>{c.nombre}</strong>
                      </td>
                      <td>{tendenciaPor.get(c.cajero_id) ? <Mini semanas={tendenciaPor.get(c.cajero_id).semanas} /> : <span className="af-ok">—</span>}</td>
                      <td className="rep-num">{c.facturas}</td>
                      <td className="rep-num">{L(c.total)}</td>
                      <td className="rep-num">{c.pct_efectivo}%</td>
                      <td className="rep-num">{c.pct_descuento}%</td>
                      <td className="rep-num">{c.desc_25}</td>
                      <td className="rep-num">{c.anuladas}</td>
                      <td className="rep-num" title={L(c.monto_descartado)}>
                        {c.descartadas}
                      </td>
                      <td className="rep-num" title={L(c.monto_quitado)}>
                        {c.quitados}
                      </td>
                      <td className="rep-num">{c.reimpresiones}</td>
                      <td className="rep-num">{c.no_impresas}</td>
                      <td className="rep-num" title={L(c.monto_faltante)}>
                        {c.faltantes}
                      </td>
                      <td className="rep-num">{c.accesos_denegados}</td>
                      <td>
                        <div className="af-senales">
                          {c.senales.length === 0 && <span className="af-ok">Sin señales</span>}
                          {c.senales.map((s) => (
                            <span key={s.texto} className={`af-senal af-senal-${s.nivel}`}>
                              {s.texto}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rep-dos-columnas">
            <div className="panel">
              <h2>Huecos sin facturar</h2>
              <p className="af-intro">Ratos largos sin una sola factura con la tienda abierta. Si hubo clientes en cámara, hubo ventas sin facturar.</p>
              <table className="tabla rep-tabla">
                <thead>
                  <tr>
                    <th>Sucursal</th>
                    <th>Día</th>
                    <th>Entre</th>
                    <th className="rep-num">Minutos</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.huecos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="rep-vacio">
                        Sin huecos largos.
                      </td>
                    </tr>
                  )}
                  {datos.huecos.map((h, i) => (
                    <tr key={i}>
                      <td>{nombreCortoSucursal(h.sucursal)}</td>
                      <td>{h.fecha}</td>
                      <td>
                        {h.desde} – {h.hasta}
                      </td>
                      <td className="rep-num">
                        <strong className={h.minutos >= 90 ? 'rep-alerta' : ''}>{h.minutos}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="panel">
              <h2>Movimientos sensibles recientes</h2>
              <div className="af-feed">
                {datos.recientes.length === 0 && <p className="rep-vacio">Nada que reportar.</p>}
                {datos.recientes.map((e) => (
                  <div key={e.id} className="af-evento">
                    <span className="af-evento-hora">{fechaHora(e.created_at)}</span>
                    <span>
                      <strong>{e.usuario_nombre}</strong> · {ETIQUETA_EVENTO[e.accion] ?? e.accion}
                      <br />
                      <span className="rep-tenue">{resumenEvento(e)}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {pestana === 'linea' && <LineaTiempo session={session} />}
      {pestana === 'arqueo' && <ArqueoSorpresa session={session} sucursales={sucursales} />}
      {pestana === 'reglas' && <Reglas session={session} />}
    </div>
  );
}
```

### `frontend/src/screens/Bitacora.jsx`

```jsx
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { colorSucursal } from '../lib/coloresSucursal.js';
import { descargarCsv } from '../lib/csv.js';

const ACCIONES = {
  'venta.crear_orden': 'Creó orden',
  'venta.editar_orden': 'Editó orden',
  'venta.descartar_orden': 'Descartó orden',
  'venta.facturar': 'Emitió factura',
  'venta.imprimir_ticket': 'Imprimió ticket',
  'venta.reimprimir_ticket': 'Reimprimió ticket',
  'venta.ver_pdf': 'Abrió PDF',
  'venta.reenviar_correo': 'Reenvió correo',
  'venta.anular': 'Anuló factura',
  'venta.nota_credito_parcial': 'Nota de crédito parcial',
  'cotizacion.convertir_factura': 'Facturó cotización',
  'cotizacion.aceptada': 'Aceptó y agendó cotización',
  'cotizacion.cambio_estado': 'Cambió estado de cotización',
  'evento.seguimiento': 'Seguimiento de evento',
  'evento.reprogramado': 'Reprogramó evento',
  'producto.crear': 'Creó producto',
  'producto.editar': 'Editó producto',
  'producto.desactivar': 'Desactivó producto',
  'usuario.crear': 'Creó usuario',
  'usuario.editar': 'Editó usuario',
  'usuario.cambiar_contrasena': 'Cambió contraseña',
  'cai.editar': 'Modificó CAI/correlativo',
  'cai.activar': 'Activó CAI real (SAR)',
  'cierre.crear': 'Cerró caja',
  'sucursal.editar': 'Editó sucursal',
  'sesion.inicio': 'Inició sesión',
  'sesion.fin': 'Cerró sesión',
  'pantalla.ver': 'Abrió pantalla',
  'orden.quitar_producto': 'Quitó producto de orden',
  'orden.descuento': 'Aplicó descuento',
  'factura.buscar': 'Buscó facturas',
  'factura.ver': 'Vio detalle de factura',
  'reporte.generar': 'Generó reporte',
  'acceso.denegado': 'Intentó entrar sin permiso',
  'cierre.imprimir': 'Imprimió cierre',
  'alerta.revisar': 'Revisó alerta',
  'venta.error_pagos': 'Error al guardar pagos',
  'sesion.dispositivo_nuevo': 'Entró desde un dispositivo nuevo',
  'sesion.login_fallido': 'Intento de entrada fallido',
  'sesion.bloqueo': 'Pantalla bloqueada (inactividad)',
  'sesion.desbloqueo': 'Desbloqueó pantalla',
  'sesion.desbloqueo_fallido': 'Contraseña incorrecta al desbloquear',
  'arqueo.sorpresa': 'Arqueo sorpresa',
  'antifraude.reglas': 'Cambió reglas antifraude',
};

// Acciones que merecen atención inmediata al revisar la bitácora.
const SENSIBLES = new Set([
  'venta.descartar_orden',
  'venta.anular',
  'venta.nota_credito_parcial',
  'venta.reimprimir_ticket',
  'cai.editar',
  'cai.activar',
  'usuario.cambiar_contrasena',
  'orden.quitar_producto',
  'acceso.denegado',
  'venta.error_pagos',
]);

const FILTROS_ACCION = [
  { valor: '', etiqueta: 'Todas las acciones' },
  { valor: 'venta.facturar', etiqueta: 'Facturas emitidas' },
  { valor: 'venta.anular', etiqueta: 'Anulaciones' },
  { valor: 'venta.descartar_orden', etiqueta: 'Órdenes descartadas' },
  { valor: 'venta.editar_orden', etiqueta: 'Órdenes editadas' },
  { valor: 'venta.', etiqueta: 'Todo sobre ventas' },
  { valor: 'venta.imprimir', etiqueta: 'Impresiones' },
  { valor: 'cai.', etiqueta: 'Cambios de CAI' },
  { valor: 'producto.', etiqueta: 'Cambios de productos/precios' },
  { valor: 'usuario.', etiqueta: 'Cambios de usuarios' },
  { valor: 'cierre.', etiqueta: 'Cierres de caja' },
  { valor: 'orden.', etiqueta: 'Cambios en órdenes (quitar/descuento)' },
  { valor: 'acceso.', etiqueta: 'Accesos sin permiso' },
  { valor: 'sesion.', etiqueta: 'Inicios y cierres de sesión' },
  { valor: 'pantalla.', etiqueta: 'Navegación por pantallas' },
];

function documento(r) {
  const d = r.detalle ?? {};
  if (d.numero_factura) return d.numero_factura;
  if (d.numero_orden) return `Orden #${d.numero_orden}`;
  if (d.numero_cotizacion) return `Cotización #${d.numero_cotizacion}`;
  return d.nombre ?? '—';
}

function resumen(r) {
  const d = r.detalle ?? {};
  switch (r.accion) {
    case 'venta.editar_orden':
      return `L ${d.total_anterior} → L ${d.total_nuevo} · antes: ${(d.items_antes ?? []).join(', ') || '—'} · después: ${(d.items_despues ?? []).join(', ')}`;
    case 'venta.descartar_orden':
      return `Total L ${d.total} · ${(d.items ?? []).join(', ')}`;
    case 'venta.facturar':
      return `L ${d.total} · ${(d.pagos ?? []).map((p) => `${p.forma} L${p.monto}`).join(' + ')}${d.descuento_porcentaje ? ` · desc. ${d.descuento_porcentaje}%` : ''} · ${d.cliente ?? ''}`;
    case 'venta.anular':
    case 'venta.nota_credito_parcial':
      return `L ${d.monto_acreditado} de L ${d.total_factura} · Motivo: ${d.motivo}`;
    case 'producto.editar':
    case 'usuario.editar':
    case 'cai.editar':
    case 'cai.activar':
    case 'sucursal.editar':
      return Object.entries(d.cambios ?? {})
        .map(([campo, c]) => `${campo}: ${c.antes ?? '—'} → ${c.despues ?? '—'}`)
        .join(' · ');
    case 'cierre.crear':
      if (d.pos_bac != null) {
        return `POS BAC L ${d.pos_bac} · Ficohsa L ${d.pos_ficohsa} (dif. L ${d.diferencia_tarjeta}) · Efectivo contado L ${d.total_contado} de L ${d.total_esperado} (dif. L ${d.diferencia_efectivo})`;
      }
      return `Esperado L ${d.total_esperado} · Contado L ${d.total_contado} · Diferencia L ${d.diferencia}`;
    case 'orden.quitar_producto':
      return `${d.cantidad ?? 1} × ${d.producto ?? ''} · L ${d.monto ?? 0}`;
    case 'orden.descuento':
      return `${d.porcentaje}% a ${d.cantidad} × ${d.producto}`;
    case 'pantalla.ver':
      return d.pantalla ?? '';
    case 'acceso.denegado':
      return `${d.metodo ?? ''} ${d.ruta ?? ''}${d.motivo ? ` · ${d.motivo}` : ''}`;
    case 'factura.buscar':
      return [d.q && `"${d.q}"`, d.desde && `${d.desde} a ${d.hasta || 'hoy'}`].filter(Boolean).join(' · ');
    case 'factura.ver':
      return `${d.factura ?? ''} · L ${d.total ?? ''}`;
    case 'sesion.inicio':
      return d.navegador ? String(d.navegador).slice(0, 60) : '';
    default:
      return d.total != null ? `L ${d.total}` : d.nota ?? '';
  }
}

export default function Bitacora({ session, sucursales }) {
  const [filtros, setFiltros] = useState({ accion: '', sucursal_id: '', desde: '', hasta: '' });
  const [registros, setRegistros] = useState([]);
  const [verificacion, setVerificacion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function buscar() {
    setCargando(true);
    setError('');
    try {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(filtros)) if (v) params.set(k, v);
      setRegistros(await api.get(`/auditoria?${params.toString()}`, session));
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  async function verificar() {
    setVerificacion({ cargando: true });
    try {
      setVerificacion(await api.get('/auditoria/verificar', session));
    } catch (e) {
      setVerificacion(null);
      setError(e.message);
    }
  }

  useEffect(() => {
    buscar();
    verificar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exportar() {
    descargarCsv(`bitacora-${new Date().toISOString().slice(0, 10)}.csv`, registros, [
      { titulo: 'Fecha', valor: (r) => new Date(r.created_at).toLocaleString('es-HN') },
      { titulo: 'Usuario', valor: (r) => r.usuario_nombre ?? 'Sistema' },
      { titulo: 'Acción', valor: (r) => ACCIONES[r.accion] ?? r.accion },
      { titulo: 'Documento', valor: documento },
      { titulo: 'Sucursal', valor: (r) => r.sucursales?.nombre ?? '' },
      { titulo: 'Detalle', valor: resumen },
      { titulo: 'IP', valor: (r) => r.ip ?? '' },
      { titulo: 'Hash', valor: (r) => r.hash },
    ]);
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h2>Bitácora de auditoría</h2>
            <p style={{ color: 'var(--text-dim)', marginTop: -8, maxWidth: 560 }}>
              Registro permanente de quién creó, editó, descartó, imprimió, facturó o anuló cada documento. Nadie puede
              modificar ni borrar estos registros — ni siquiera un administrador.
            </p>
          </div>
          {verificacion && (
            <div className={`sello-integridad ${verificacion.cargando ? '' : verificacion.integra ? 'ok' : 'alterada'}`}>
              {verificacion.cargando
                ? 'Verificando integridad…'
                : verificacion.integra
                  ? `✓ Íntegra · ${verificacion.total.toLocaleString('es-HN')} registros verificados`
                  : `⚠ Registro alterado detectado (#${verificacion.primer_id_alterado})`}
            </div>
          )}
        </div>

        <div className="toolbar">
          <select value={filtros.accion} onChange={(e) => setFiltros({ ...filtros, accion: e.target.value })}>
            {FILTROS_ACCION.map((f) => (
              <option key={f.valor} value={f.valor}>
                {f.etiqueta}
              </option>
            ))}
          </select>
          <select value={filtros.sucursal_id} onChange={(e) => setFiltros({ ...filtros, sucursal_id: e.target.value })}>
            <option value="">Todas las sucursales</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
          <input type="date" value={filtros.desde} onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })} />
          <input type="date" value={filtros.hasta} onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })} />
          <button className="boton-sm" disabled={cargando} onClick={buscar}>
            {cargando ? 'Buscando…' : 'Buscar'}
          </button>
          <button className="boton-sm boton-secundario" onClick={verificar}>
            Verificar integridad
          </button>
          <button className="boton-sm boton-secundario" disabled={registros.length === 0} onClick={exportar}>
            Exportar CSV
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Documento</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r.id} className={SENSIBLES.has(r.accion) ? 'fila-sensible' : undefined}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(r.created_at).toLocaleString('es-HN', { dateStyle: 'short', timeStyle: 'medium' })}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {r.sucursal_id && (
                      <span
                        className="leyenda-punto"
                        title={r.sucursales?.nombre}
                        style={{ background: colorSucursal(r.sucursal_id), marginRight: 6 }}
                      />
                    )}
                    {r.usuario_nombre ?? 'Sistema'}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{ACCIONES[r.accion] ?? r.accion}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{documento(r)}</td>
                  <td style={{ color: 'var(--text-dim)', fontSize: '0.88em' }} title={`IP ${r.ip ?? '—'} · hash ${r.hash}`}>
                    {resumen(r)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!cargando && registros.length === 0 && <p style={{ color: 'var(--text-dim)' }}>Sin registros con esos filtros.</p>}
        {registros.length >= 300 && (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85em' }}>
            Se muestran los 300 más recientes — acota por fecha para ver más atrás.
          </p>
        )}
      </div>
    </div>
  );
}
```

### `frontend/src/screens/CajaChica.jsx`

```jsx
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { descargarCsv } from '../lib/csv.js';

const fmtL = (n) => `L ${Number(n).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function CajaChica({ session, perfil, sucursales }) {
  const [movimientos, setMovimientos] = useState([]);
  const [rango, setRango] = useState({ fechaInicio: '', fechaFin: '' });
  const [form, setForm] = useState({
    sucursal_id: perfil.sucursal_id ?? sucursales[0]?.id ?? '',
    tipo: 'Otros gastos',
    monto: '',
    concepto: '',
  });
  const [error, setError] = useState('');

  const totalGastado = useMemo(() => movimientos.reduce((s, m) => s + Number(m.monto), 0), [movimientos]);

  async function cargar() {
    const params = new URLSearchParams({ sucursal_id: form.sucursal_id });
    if (rango.fechaInicio) params.set('fechaInicio', rango.fechaInicio);
    if (rango.fechaFin) params.set('fechaFin', rango.fechaFin);
    setMovimientos(await api.get(`/caja-chica?${params.toString()}`, session));
  }

  function exportarCsv() {
    descargarCsv(`caja-chica-${new Date().toISOString().slice(0, 10)}.csv`, movimientos, [
      { titulo: 'Fecha', valor: (m) => m.fecha },
      { titulo: 'Tipo', valor: (m) => m.tipo },
      { titulo: 'Concepto', valor: (m) => m.concepto ?? '' },
      { titulo: 'Monto', valor: (m) => Number(m.monto).toFixed(2) },
      { titulo: 'Usuario', valor: (m) => m.perfiles?.nombre ?? '' },
    ]);
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.sucursal_id, rango.fechaInicio, rango.fechaFin]);

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

        <div className="toolbar">
          <label style={{ color: 'var(--text-dim)', fontSize: '0.85em' }}>
            Desde
            <input type="date" value={rango.fechaInicio} onChange={(e) => setRango({ ...rango, fechaInicio: e.target.value })} />
          </label>
          <label style={{ color: 'var(--text-dim)', fontSize: '0.85em' }}>
            Hasta
            <input type="date" value={rango.fechaFin} onChange={(e) => setRango({ ...rango, fechaFin: e.target.value })} />
          </label>
          <button className="boton-sm boton-secundario" onClick={exportarCsv} disabled={movimientos.length === 0}>
            Exportar CSV
          </button>
        </div>

        <p>
          Total gastado en esta sucursal: <strong>{fmtL(totalGastado)}</strong>
        </p>

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
                <td>{fmtL(m.monto)}</td>
                <td>{m.perfiles?.nombre ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### `frontend/src/screens/Catalogo.jsx`

```jsx
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { useCambiosEnVivo } from '../lib/tiempoReal.js';

const fmtL = (n) => `L ${Number(n).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Código de barras editable directo en la tabla: se escribe a mano (o se
// escanea) y se guarda con Enter o al salir del campo, sin abrir la edición
// completa del producto. Vacío = quitar el código.
function CeldaCodigoBarras({ producto, onGuardar }) {
  const original = producto.codigo_barras ?? '';
  const [valor, setValor] = useState(original);
  const [estado, setEstado] = useState('');

  useEffect(() => {
    setValor(producto.codigo_barras ?? '');
  }, [producto.codigo_barras]);

  async function guardar() {
    if (valor.trim() === original) return;
    setEstado('guardando');
    const ok = await onGuardar(producto, valor);
    if (ok) {
      setEstado('ok');
      setTimeout(() => setEstado(''), 1500);
    } else {
      setEstado('');
      setValor(original);
    }
  }

  return (
    <span className="celda-codigo-barras">
      <input
        value={valor}
        placeholder="Agregar…"
        inputMode="numeric"
        onChange={(e) => setValor(e.target.value)}
        onBlur={guardar}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }
          if (e.key === 'Escape') setValor(original);
        }}
      />
      {estado === 'guardando' && <span className="celda-estado">…</span>}
      {estado === 'ok' && <span className="celda-estado ok">✓</span>}
    </span>
  );
}

const FORM_VACIO ={ codigo: '', codigo_barras: '', nombre: '', categoria_id: '', precio: '', impuesto1_tasa: '0.15' };

export default function Catalogo({ session }) {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [editandoCategoriaId, setEditandoCategoriaId] = useState(null);
  const [nombreCategoriaEdit, setNombreCategoriaEdit] = useState('');
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const productosVisibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return productos.filter((p) => {
      const coincideTexto =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        (p.codigo ?? '').toLowerCase().includes(q) ||
        (p.codigo_barras ?? '').toLowerCase().includes(q);
      const coincideCategoria = !categoriaFiltro || p.categoria_id === categoriaFiltro;
      return coincideTexto && coincideCategoria;
    });
  }, [productos, busqueda, categoriaFiltro]);

  async function cargar() {
    setCategorias(await api.get('/categorias', session));
    setProductos(await api.get('/productos?incluirInactivos=true', session));
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
  }, []);

  useCambiosEnVivo(['productos', 'categorias'], () => cargar().catch(() => {}));

  async function crearCategoria() {
    if (!nuevaCategoria.trim()) return;
    await api.post('/categorias', session, { nombre: nuevaCategoria.trim(), orden: categorias.length });
    setNuevaCategoria('');
    cargar();
  }

  function editarCategoria(c) {
    setEditandoCategoriaId(c.id);
    setNombreCategoriaEdit(c.nombre);
  }

  async function guardarCategoria(c) {
    if (!nombreCategoriaEdit.trim()) return;
    await api.put(`/categorias/${c.id}`, session, { nombre: nombreCategoriaEdit.trim(), orden: c.orden, activo: c.activo });
    setEditandoCategoriaId(null);
    cargar();
  }

  async function alternarActivaCategoria(c) {
    await api.put(`/categorias/${c.id}`, session, { nombre: c.nombre, orden: c.orden, activo: !c.activo });
    cargar();
  }

  // Sube/baja una categoría intercambiando su "orden" con la vecina — así
  // Juan puede acomodar el catálogo como aparece en el POS sin tocar SQL.
  async function moverCategoria(c, direccion) {
    const ordenadas = [...categorias].sort((a, b) => a.orden - b.orden);
    const i = ordenadas.findIndex((x) => x.id === c.id);
    const j = i + direccion;
    if (j < 0 || j >= ordenadas.length) return;
    const vecina = ordenadas[j];
    await Promise.all([
      api.put(`/categorias/${c.id}`, session, { nombre: c.nombre, orden: vecina.orden, activo: c.activo }),
      api.put(`/categorias/${vecina.id}`, session, { nombre: vecina.nombre, orden: c.orden, activo: vecina.activo }),
    ]);
    cargar();
  }

  function editar(producto) {
    setEditandoId(producto.id);
    setForm({
      codigo: producto.codigo ?? '',
      codigo_barras: producto.codigo_barras ?? '',
      nombre: producto.nombre,
      categoria_id: producto.categoria_id ?? '',
      precio: producto.precio,
      impuesto1_tasa: producto.impuesto1_tasa,
    });
  }

  // Precarga el formulario con los mismos datos (menos el código, que debe
  // ser único) para crear rápido una variante — ej. mismo sabor en otro
  // tamaño, o el mismo producto en otra categoría.
  function duplicar(producto) {
    setEditandoId(null);
    setForm({
      codigo: '',
      codigo_barras: '',
      nombre: `${producto.nombre} (copia)`,
      categoria_id: producto.categoria_id ?? '',
      precio: producto.precio,
      impuesto1_tasa: producto.impuesto1_tasa,
    });
  }

  async function guardarProducto() {
    setError('');
    setGuardando(true);
    const body = {
      codigo: form.codigo || null,
      codigo_barras: form.codigo_barras.trim() || null,
      nombre: form.nombre,
      categoria_id: form.categoria_id || null,
      precio: Number(form.precio),
      impuesto1_tasa: Number(form.impuesto1_tasa),
    };
    try {
      if (editandoId) await api.put(`/productos/${editandoId}`, session, body);
      else await api.post('/productos', session, body);
      setForm(FORM_VACIO);
      setEditandoId(null);
      cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function guardarCodigoBarras(producto, valor) {
    setError('');
    try {
      await api.put(`/productos/${producto.id}`, session, { codigo_barras: valor.trim() });
      await cargar();
      return true;
    } catch (e) {
      setError(e.message);
      return false;
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
        {categorias
          .slice()
          .sort((a, b) => a.orden - b.orden)
          .map((c, i) => (
            <div key={c.id} className="toolbar" style={{ marginBottom: 4, opacity: c.activo ? 1 : 0.5 }}>
              <button className="boton-sm boton-secundario" disabled={i === 0} onClick={() => moverCategoria(c, -1)}>
                ↑
              </button>
              <button
                className="boton-sm boton-secundario"
                disabled={i === categorias.length - 1}
                onClick={() => moverCategoria(c, 1)}
              >
                ↓
              </button>
              {editandoCategoriaId === c.id ? (
                <>
                  <input
                    style={{ marginBottom: 0 }}
                    value={nombreCategoriaEdit}
                    onChange={(e) => setNombreCategoriaEdit(e.target.value)}
                  />
                  <button className="boton-sm" onClick={() => guardarCategoria(c)}>
                    Guardar
                  </button>
                  <button className="boton-sm boton-secundario" onClick={() => setEditandoCategoriaId(null)}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span className="chip">{c.nombre}</span>
                  <button className="boton-sm boton-secundario" onClick={() => editarCategoria(c)}>
                    Editar
                  </button>
                  <button className="boton-sm boton-secundario" onClick={() => alternarActivaCategoria(c)}>
                    {c.activo ? 'Desactivar' : 'Activar'}
                  </button>
                </>
              )}
            </div>
          ))}
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
            placeholder="Código de barras (escríbelo o escanéalo)"
            value={form.codigo_barras}
            onChange={(e) => setForm({ ...form, codigo_barras: e.target.value })}
            onKeyDown={(e) => {
              // El lector termina con Enter: que no dispare nada más.
              if (e.key === 'Enter') e.preventDefault();
            }}
          />
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
          <button className="boton-sm" disabled={guardando || !form.nombre || !form.precio} onClick={guardarProducto}>
            {guardando ? 'Guardando…' : editandoId ? 'Guardar' : 'Agregar'}
          </button>
          {editandoId && (
            <button
              className="boton-sm boton-secundario"
              onClick={() => {
                setEditandoId(null);
                setForm(FORM_VACIO);
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
          <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <table className="tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cód. barras</th>
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
                <td>
                  <CeldaCodigoBarras producto={p} onGuardar={guardarCodigoBarras} />
                </td>
                <td>{p.nombre}</td>
                <td>{p.categorias?.nombre ?? '—'}</td>
                <td>{fmtL(p.precio)}</td>
                <td>{(p.impuesto1_tasa * 100).toFixed(0)}%</td>
                <td>{p.activo ? 'Sí' : 'No'}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="boton-sm boton-secundario" onClick={() => editar(p)}>
                    Editar
                  </button>{' '}
                  <button className="boton-sm boton-secundario" onClick={() => duplicar(p)}>
                    Duplicar
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
```

### `frontend/src/screens/Cierres.jsx`

```jsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { colorSucursal, nombreCortoSucursal } from '../lib/coloresSucursal.js';
import { descargarCsv } from '../lib/csv.js';
import { imprimirCierre, leerConfigImpresora } from '../lib/documentos.js';
import { useCambiosEnVivo } from '../lib/tiempoReal.js';
import { calcularCuadre, estadoDiferencia, inicioDeHoyIso, inputLocalAIso, isoAInputLocal } from '../lib/cierre.js';

const ZONA = 'America/Tegucigalpa';
const VACIO = { pos_bac: '', pos_ficohsa: '', efectivo_contado: '', fondo_caja: '', salidas: '', observaciones: '' };

function L(n) {
  return `L ${Number(n ?? 0).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fechaHora(iso) {
  return new Date(iso).toLocaleString('es-HN', { timeZone: ZONA, dateStyle: 'short', timeStyle: 'short' });
}

function ChipDiferencia({ valor, grande = false }) {
  if (valor === null || valor === undefined) return <span className="chip-dif chip-dif-nd">—</span>;
  const e = estadoDiferencia(valor);
  return (
    <span className={`chip-dif chip-dif-${e.clase}${grande ? ' chip-dif-grande' : ''}`}>
      {e.texto}
      {e.clase !== 'cuadra' && ` ${L(Math.abs(valor))}`}
    </span>
  );
}

function CampoMonto({ etiqueta, valor, onChange, ayuda, autoFocus, obligatorio }) {
  return (
    <label className="cierre-campo">
      <span className="cierre-campo-etiqueta">
        {etiqueta}
        {obligatorio && <span className="cierre-obligatorio"> *</span>}
      </span>
      <span className="cierre-campo-input">
        <span className="cierre-campo-prefijo">L</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={valor}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </span>
      {ayuda && <span className="cierre-campo-ayuda">{ayuda}</span>}
    </label>
  );
}

function FilaSistema({ etiqueta, valor, fuerte }) {
  return (
    <div className={`cierre-fila${fuerte ? ' cierre-fila-fuerte' : ''}`}>
      <span>{etiqueta}</span>
      <span>{L(valor)}</span>
    </div>
  );
}

export default function Cierres({ session, perfil, sucursales, sucursalId }) {
  const sucursalFija = perfil.rol === 'cajero' && perfil.sucursal_id;
  const sucursal_id = sucursalFija ? perfil.sucursal_id : sucursalId ?? perfil.sucursal_id ?? sucursales[0]?.id ?? '';
  const sucursal = sucursales.find((s) => s.id === sucursal_id);
  const color = colorSucursal(sucursal_id);

  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(() => new Date().toISOString());
  const [hastaManual, setHastaManual] = useState(false);
  const [ultimo, setUltimo] = useState(null);
  const [avisoDesde, setAvisoDesde] = useState('');
  const [resumen, setResumen] = useState(null);
  const [cargandoResumen, setCargandoResumen] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const [historial, setHistorial] = useState([]);
  const [soloEstaSucursal, setSoloEstaSucursal] = useState(true);
  const [detalle, setDetalle] = useState(null);
  const [facturasDetalle, setFacturasDetalle] = useState([]);

  const puedeVerHistorial = perfil.rol !== 'cajero';
  const set = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));

  // Arranque del turno: donde terminó el último cierre de esta sucursal. Si
  // ese cierre es muy viejo (datos de prueba, sucursal que no cerraba), se
  // toma desde hoy a las 00:00 y se avisa, para no arrastrar semanas.
  const cargarInicio = useCallback(async () => {
    if (!sucursal_id) return;
    setResultado(null);
    setResumen(null);
    setForm(VACIO);
    setHastaManual(false);
    setHasta(new Date().toISOString());
    try {
      const u = await api.get(`/cierres/ultimo?sucursal_id=${sucursal_id}`, session);
      setUltimo(u);
      const ayer = new Date(inicioDeHoyIso());
      ayer.setDate(ayer.getDate() - 1);
      if (u?.fecha_fin && new Date(u.fecha_fin) >= ayer) {
        setDesde(u.fecha_fin);
        setAvisoDesde('');
      } else {
        setDesde(inicioDeHoyIso());
        setAvisoDesde(
          u?.fecha_fin
            ? `El último cierre de esta sucursal fue el ${fechaHora(u.fecha_fin)}. Se tomó desde hoy 00:00: si quedaron ventas sin cerrar, ajusta "Desde".`
            : ''
        );
      }
      if (u?.fondo_caja != null) setForm((f) => ({ ...f, fondo_caja: String(Number(u.fondo_caja)) }));
    } catch (e) {
      setError(e.message);
      setDesde(inicioDeHoyIso());
    }
  }, [sucursal_id, session]);

  useEffect(() => {
    cargarInicio();
  }, [cargarInicio]);

  const cargarResumen = useCallback(async () => {
    if (!sucursal_id || !desde || !hasta) return;
    if (new Date(hasta) <= new Date(desde)) {
      setResumen(null);
      return;
    }
    setCargandoResumen(true);
    try {
      const params = new URLSearchParams({ sucursal_id, desde, hasta });
      const r = await api.get(`/cierres/resumen?${params.toString()}`, session);
      setResumen(r);
      setError('');
      // Las salidas se sugieren de caja chica sólo si nadie las ha tocado.
      setForm((f) => (f.salidas === '' && r.salidas_sugeridas > 0 ? { ...f, salidas: String(r.salidas_sugeridas) } : f));
    } catch (e) {
      setError(e.message);
    } finally {
      setCargandoResumen(false);
    }
  }, [sucursal_id, desde, hasta, session]);

  useEffect(() => {
    const t = setTimeout(cargarResumen, 250);
    return () => clearTimeout(t);
  }, [cargarResumen]);

  // Si entra una venta mientras se cuenta, el "hasta" avanza solo (salvo
  // que lo hayan fijado a mano) y los totales del sistema se actualizan.
  useCambiosEnVivo(
    ['ventas'],
    () => {
      if (!hastaManual) setHasta(new Date().toISOString());
      else cargarResumen();
    },
    { retrasoMs: 800, activo: Boolean(sucursal_id) && !resultado }
  );

  const cargarHistorial = useCallback(async () => {
    if (!puedeVerHistorial) return;
    const filtro = soloEstaSucursal && sucursal_id ? `?sucursal_id=${sucursal_id}` : '';
    setHistorial(await api.get(`/cierres${filtro}`, session));
  }, [puedeVerHistorial, soloEstaSucursal, sucursal_id, session]);

  useEffect(() => {
    cargarHistorial().catch((e) => setError(e.message));
  }, [cargarHistorial]);

  const ciego = resumen?.ciego ?? false;
  const cuadre = useMemo(
    () => (resumen && !ciego ? calcularCuadre(resumen, form) : null),
    [resumen, ciego, form]
  );
  const faltanCampos = form.pos_bac === '' || form.pos_ficohsa === '' || form.efectivo_contado === '';
  const noCuadra =
    cuadre && !faltanCampos && (Math.abs(cuadre.diferencia_tarjeta) >= 1 || Math.abs(cuadre.diferencia_efectivo) >= 1);
  const faltaObservacion = noCuadra && !form.observaciones.trim();
  const puedeCerrar = resumen && !faltanCampos && !faltaObservacion && !guardando && !cargandoResumen;

  async function cerrar() {
    const lineas = [
      `Cerrar caja de ${nombreCortoSucursal(sucursal?.nombre ?? '')}`,
      `Del ${fechaHora(desde)} al ${fechaHora(hasta)}`,
      '',
      `POS BAC: ${L(form.pos_bac)}`,
      `POS Ficohsa: ${L(form.pos_ficohsa)}`,
      `Efectivo contado: ${L(form.efectivo_contado)}`,
    ];
    if (cuadre) {
      lineas.push('', `Tarjeta: ${estadoDiferencia(cuadre.diferencia_tarjeta).texto} ${L(Math.abs(cuadre.diferencia_tarjeta))}`);
      lineas.push(`Efectivo: ${estadoDiferencia(cuadre.diferencia_efectivo).texto} ${L(Math.abs(cuadre.diferencia_efectivo))}`);
    }
    lineas.push('', 'Un cierre no se puede editar después. ¿Confirmas?');
    if (!window.confirm(lineas.join('\n'))) return;

    setGuardando(true);
    setError('');
    try {
      const cierre = await api.post('/cierres', session, {
        sucursal_id,
        fecha_inicio: desde,
        fecha_fin: hasta,
        pos_bac: Number(form.pos_bac),
        pos_ficohsa: Number(form.pos_ficohsa),
        efectivo_contado: Number(form.efectivo_contado),
        fondo_caja: Number(form.fondo_caja || 0),
        salidas: Number(form.salidas || 0),
        observaciones: form.observaciones,
      });
      setResultado(cierre);
      cargarHistorial().catch(() => {});
      if (leerConfigImpresora().autoImprimir) {
        imprimirCierre(cierre.id, session).catch((e) => setError(`Cierre guardado, pero no se pudo imprimir: ${e.message}`));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function verDetalle(c) {
    setDetalle(c);
    setFacturasDetalle([]);
    try {
      const params = new URLSearchParams({
        estado: 'pagada',
        sucursal_id: c.sucursal_id,
        fechaInicio: c.fecha_inicio,
        fechaFin: c.fecha_fin,
      });
      setFacturasDetalle(await api.get(`/ventas?${params.toString()}`, session));
    } catch (e) {
      setError(e.message);
    }
  }

  function reimprimir(id) {
    imprimirCierre(id, session).catch((e) => setError(e.message));
  }

  function exportarHistorialCsv() {
    const num = (v) => (v === null || v === undefined ? '' : Number(v).toFixed(2));
    descargarCsv(`cierres-${new Date().toISOString().slice(0, 10)}.csv`, historial, [
      { titulo: 'Desde', valor: (c) => fechaHora(c.fecha_inicio) },
      { titulo: 'Hasta', valor: (c) => fechaHora(c.fecha_fin) },
      { titulo: 'Sucursal', valor: (c) => c.sucursales?.nombre ?? '' },
      { titulo: 'Cajero', valor: (c) => c.cajero?.nombre ?? '' },
      { titulo: 'De factura', valor: (c) => c.factura_desde ?? '' },
      { titulo: 'A factura', valor: (c) => c.factura_hasta ?? '' },
      { titulo: 'Facturas', valor: (c) => c.cantidad_facturas ?? '' },
      { titulo: 'Total ventas', valor: (c) => num(c.total_ventas) },
      { titulo: 'Tarjeta sistema', valor: (c) => num(c.tarjeta_sistema) },
      { titulo: 'POS BAC', valor: (c) => num(c.pos_bac) },
      { titulo: 'POS Ficohsa', valor: (c) => num(c.pos_ficohsa) },
      { titulo: 'Dif. tarjeta', valor: (c) => num(c.diferencia_tarjeta) },
      { titulo: 'Efectivo ventas', valor: (c) => num(c.efectivo_sistema) },
      { titulo: 'Fondo', valor: (c) => num(c.fondo_caja) },
      { titulo: 'Salidas', valor: (c) => num(c.salidas) },
      { titulo: 'Efectivo esperado', valor: (c) => num(c.total_esperado) },
      { titulo: 'Efectivo contado', valor: (c) => num(c.efectivo_contado ?? c.total_contado) },
      { titulo: 'Dif. efectivo', valor: (c) => num(c.diferencia_efectivo) },
      { titulo: 'Transferencias', valor: (c) => num(c.transferencia_sistema) },
      { titulo: 'Diferencia total', valor: (c) => num(c.diferencia) },
      { titulo: 'Observaciones', valor: (c) => c.observaciones ?? '' },
    ]);
  }

  if (!sucursal_id) {
    return <div className="panel">Elige una sucursal en la barra superior para hacer el cierre.</div>;
  }

  return (
    <div className="cierre" style={{ '--color-cierre': color }}>
      {error && <div className="error">{error}</div>}

      <div className="panel cierre-encabezado">
        <div className="cierre-titulo">
          <span className="cierre-sucursal-punto" style={{ background: color }} />
          <div>
            <h2>Cierre de caja · {nombreCortoSucursal(sucursal?.nombre ?? '')}</h2>
            <div className="cierre-subtitulo">
              {sucursalFija ? 'Tu sucursal' : 'Para cerrar otra sucursal, cámbiala en la barra superior'}
              {ultimo?.fecha_fin && ` · Último cierre: ${fechaHora(ultimo.fecha_fin)}`}
            </div>
          </div>
        </div>
        <div className="cierre-rango">
          <label>
            Desde
            <input
              type="datetime-local"
              value={desde ? isoAInputLocal(desde) : ''}
              onChange={(e) => e.target.value && setDesde(inputLocalAIso(e.target.value))}
              disabled={Boolean(resultado)}
            />
          </label>
          <label>
            Hasta
            <input
              type="datetime-local"
              value={isoAInputLocal(hasta)}
              onChange={(e) => {
                if (!e.target.value) return;
                setHasta(inputLocalAIso(e.target.value));
                setHastaManual(true);
              }}
              disabled={Boolean(resultado)}
            />
          </label>
          <button
            className="boton-sm boton-secundario"
            disabled={Boolean(resultado)}
            onClick={() => {
              setHasta(new Date().toISOString());
              setHastaManual(false);
            }}
          >
            Hasta ahora
          </button>
        </div>
        {avisoDesde && <div className="alerta">{avisoDesde}</div>}
        {resumen && (
          <div className="cierre-kpis">
            <div>
              <span>Facturas</span>
              <strong>{resumen.cantidad_facturas}</strong>
            </div>
            <div>
              <span>Rango</span>
              <strong className="cierre-kpi-rango">
                {resumen.factura_desde ? `${resumen.factura_desde.slice(-8)} → ${resumen.factura_hasta.slice(-8)}` : '—'}
              </strong>
            </div>
            {!ciego && (
              <>
                <div>
                  <span>Total ventas</span>
                  <strong>{L(resumen.total_ventas)}</strong>
                </div>
                <div>
                  <span>Anuladas</span>
                  <strong>
                    {resumen.anuladas}
                    {resumen.anuladas > 0 && <small> ({L(resumen.monto_anulado)})</small>}
                  </strong>
                </div>
              </>
            )}
            {cargandoResumen && <div className="cierre-actualizando">Actualizando…</div>}
          </div>
        )}
      </div>

      {ciego && (
        <div className="alerta">
          Cierre ciego: cuenta y anota lo que tienes. El sistema compara al guardar; el resultado lo ve tu supervisor.
        </div>
      )}

      {resultado ? (
        <div className="panel cierre-resultado">
          <h2>Cierre guardado</h2>
          {resultado.descuadre && (
            <div className="error" style={{ fontWeight: 700 }}>
              ⚠ Descuadre registrado. {resultado.alerta_enviada ? 'Se notificó a los administradores.' : ''}
            </div>
          )}
          <p className="cierre-subtitulo">
            Facturas {resultado.factura_desde ?? '—'} a {resultado.factura_hasta ?? '—'} ({resultado.cantidad_facturas ?? 0})
          </p>
          {resultado.diferencia !== undefined ? (
            <div className="cierre-resultado-grid">
              <div>
                <span>Tarjeta</span>
                <ChipDiferencia valor={resultado.diferencia_tarjeta} grande />
              </div>
              <div>
                <span>Efectivo</span>
                <ChipDiferencia valor={resultado.diferencia_efectivo} grande />
              </div>
              <div>
                <span>Total</span>
                <ChipDiferencia valor={resultado.diferencia} grande />
              </div>
            </div>
          ) : (
            <p>Tu supervisor verá el resultado del cuadre.</p>
          )}
          <div className="cierre-acciones">
            <button onClick={() => reimprimir(resultado.id)}>Imprimir cierre</button>
            <button className="boton-secundario" onClick={cargarInicio}>
              Hacer otro cierre
            </button>
          </div>
          <p className="cierre-campo-ayuda">Engrapa este ticket con los cierres de lote de los POS BAC y Ficohsa.</p>
        </div>
      ) : (
        <>
          <div className="cierre-tarjetas">
            {/* ── TARJETA ─────────────────────────────── */}
            <section className="panel cierre-bloque">
              <header>
                <h3>Tarjeta</h3>
                {cuadre && form.pos_bac !== '' && form.pos_ficohsa !== '' && <ChipDiferencia valor={cuadre.diferencia_tarjeta} />}
              </header>
              {!ciego && resumen && <FilaSistema etiqueta="Según sistema" valor={resumen.tarjeta} fuerte />}
              <CampoMonto etiqueta="Cierre POS BAC" valor={form.pos_bac} onChange={set('pos_bac')} autoFocus obligatorio />
              <CampoMonto etiqueta="Cierre POS Ficohsa" valor={form.pos_ficohsa} onChange={set('pos_ficohsa')} obligatorio />
              <FilaSistema etiqueta="Total de los dos POS" valor={Number(form.pos_bac || 0) + Number(form.pos_ficohsa || 0)} />
            </section>

            {/* ── EFECTIVO ────────────────────────────── */}
            <section className="panel cierre-bloque">
              <header>
                <h3>Efectivo</h3>
                {cuadre && form.efectivo_contado !== '' && <ChipDiferencia valor={cuadre.diferencia_efectivo} />}
              </header>
              {!ciego && resumen && <FilaSistema etiqueta="Ventas en efectivo (sin cambio)" valor={resumen.efectivo} />}
              <div className="cierre-dos">
                <CampoMonto etiqueta="Fondo de caja" valor={form.fondo_caja} onChange={set('fondo_caja')} />
                <CampoMonto
                  etiqueta="Salidas de caja"
                  valor={form.salidas}
                  onChange={set('salidas')}
                  ayuda={resumen?.salidas_sugeridas > 0 ? `Caja chica: ${L(resumen.salidas_sugeridas)}` : undefined}
                />
              </div>
              {cuadre && <FilaSistema etiqueta="Debe haber en gaveta" valor={cuadre.efectivo_esperado} fuerte />}
              <CampoMonto
                etiqueta="Efectivo contado a mano"
                valor={form.efectivo_contado}
                onChange={set('efectivo_contado')}
                ayuda="Todo lo que hay en la gaveta, incluido el fondo"
                obligatorio
              />
            </section>

            {/* ── TRANSFERENCIA ───────────────────────── */}
            {!ciego && (
              <section className="panel cierre-bloque">
                <header>
                  <h3>Transferencia</h3>
                </header>
                {resumen && <FilaSistema etiqueta="Según sistema" valor={resumen.transferencia} fuerte />}
                {resumen?.otros > 0 && <FilaSistema etiqueta="Otras formas de pago" valor={resumen.otros} />}
                <p className="cierre-campo-ayuda">Revisa que coincida con lo acreditado en la banca en línea.</p>
              </section>
            )}
          </div>

          <div className="panel cierre-pie">
            {cuadre && !faltanCampos && (
              <div className="cierre-total">
                <span>Resultado del cuadre</span>
                <ChipDiferencia valor={cuadre.diferencia_total} grande />
              </div>
            )}
            <label className="cierre-observaciones">
              <span className="cierre-campo-etiqueta">
                Observaciones{noCuadra && <span className="cierre-obligatorio"> * (obligatorio: el cierre no cuadra)</span>}
              </span>
              <textarea
                rows={2}
                value={form.observaciones}
                onChange={(e) => set('observaciones')(e.target.value)}
                placeholder="Ej. voucher de L 150 pasado dos veces en BAC, se anuló al día siguiente"
              />
            </label>
            <button className="cierre-boton" disabled={!puedeCerrar} onClick={cerrar}>
              {guardando ? 'Guardando cierre…' : 'Cerrar caja'}
            </button>
            {faltanCampos && (
              <span className="cierre-campo-ayuda">Llena POS BAC, POS Ficohsa y el efectivo contado (0 si no hubo).</span>
            )}
          </div>
        </>
      )}

      {puedeVerHistorial && (
        <div className="panel">
          <div className="cierre-historial-titulo">
            <h2>Historial de cierres</h2>
            <label className="cierre-toggle">
              <input type="checkbox" checked={soloEstaSucursal} onChange={(e) => setSoloEstaSucursal(e.target.checked)} />
              Sólo {nombreCortoSucursal(sucursal?.nombre ?? '')}
            </label>
            <button className="boton-sm boton-secundario" onClick={exportarHistorialCsv} disabled={historial.length === 0}>
              Exportar CSV
            </button>
          </div>
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Cierre</th>
                  <th>Sucursal</th>
                  <th>Cajero</th>
                  <th>Facturas</th>
                  <th>Ventas</th>
                  <th>Tarjeta</th>
                  <th>Efectivo</th>
                  <th>Transf.</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {historial.length === 0 && (
                  <tr>
                    <td colSpan={10} style={{ color: 'var(--text-dim)' }}>
                      Sin cierres todavía.
                    </td>
                  </tr>
                )}
                {historial.map((c) => (
                  <tr key={c.id}>
                    <td>{fechaHora(c.fecha_fin)}</td>
                    <td>
                      <span className="leyenda-punto" style={{ background: colorSucursal(c.sucursal_id), display: 'inline-block', marginRight: 6 }} />
                      {nombreCortoSucursal(c.sucursales?.nombre ?? '')}
                    </td>
                    <td>{c.cajero?.nombre ?? '—'}</td>
                    <td>{c.cantidad_facturas ?? '—'}</td>
                    <td>{c.total_ventas != null ? L(c.total_ventas) : '—'}</td>
                    <td>
                      <ChipDiferencia valor={c.diferencia_tarjeta} />
                    </td>
                    <td>
                      <ChipDiferencia valor={c.diferencia_efectivo} />
                    </td>
                    <td>{c.transferencia_sistema != null ? L(c.transferencia_sistema) : '—'}</td>
                    <td>
                      <ChipDiferencia valor={c.diferencia} />
                    </td>
                    <td className="cierre-historial-acciones">
                      <button className="boton-sm boton-secundario" onClick={() => verDetalle(c)}>
                        Ver
                      </button>
                      <button className="boton-sm boton-secundario" onClick={() => reimprimir(c.id)}>
                        Imprimir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {detalle && (
        <div className="overlay" onClick={() => setDetalle(null)}>
          <div className="tarjeta cierre-detalle" onClick={(e) => e.stopPropagation()}>
            <h2>Cierre · {nombreCortoSucursal(detalle.sucursales?.nombre ?? '')}</h2>
            <p className="cierre-subtitulo">
              {fechaHora(detalle.fecha_inicio)} → {fechaHora(detalle.fecha_fin)} · {detalle.cajero?.nombre ?? ''}
            </p>
            {detalle.tarjeta_sistema != null ? (
              <table className="tabla cierre-detalle-tabla">
                <thead>
                  <tr>
                    <th></th>
                    <th>Sistema</th>
                    <th>Reportado</th>
                    <th>Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      Tarjeta
                      <div className="cierre-campo-ayuda">
                        BAC {L(detalle.pos_bac)} · Ficohsa {L(detalle.pos_ficohsa)}
                      </div>
                    </td>
                    <td>{L(detalle.tarjeta_sistema)}</td>
                    <td>{L(Number(detalle.pos_bac ?? 0) + Number(detalle.pos_ficohsa ?? 0))}</td>
                    <td>
                      <ChipDiferencia valor={detalle.diferencia_tarjeta} />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Efectivo
                      <div className="cierre-campo-ayuda">
                        Fondo {L(detalle.fondo_caja)} + ventas {L(detalle.efectivo_sistema)} − salidas {L(detalle.salidas)}
                      </div>
                    </td>
                    <td>{L(detalle.total_esperado)}</td>
                    <td>{L(detalle.efectivo_contado)}</td>
                    <td>
                      <ChipDiferencia valor={detalle.diferencia_efectivo} />
                    </td>
                  </tr>
                  <tr>
                    <td>Transferencia</td>
                    <td>{L(detalle.transferencia_sistema)}</td>
                    <td>—</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p className="cierre-campo-ayuda">
                Cierre del formato anterior: esperado {L(detalle.total_esperado)}, contado {L(detalle.total_contado)}, diferencia{' '}
                {L(detalle.diferencia)}.
              </p>
            )}
            {detalle.observaciones && (
              <p>
                <strong>Observaciones:</strong> {detalle.observaciones}
              </p>
            )}
            <h3>Facturas ({facturasDetalle.length})</h3>
            <div className="cierre-detalle-facturas">
              {facturasDetalle.map((f) => (
                <div key={f.id} className="pos-orden-linea" style={f.anulada ? { opacity: 0.5, textDecoration: 'line-through' } : undefined}>
                  <span>
                    {f.numero_factura} · {f.clientes?.nombre ?? 'Consumidor Final'}
                  </span>
                  <span>{L(f.total)}</span>
                </div>
              ))}
            </div>
            <div className="cierre-acciones">
              <button onClick={() => reimprimir(detalle.id)}>Imprimir</button>
              <button className="boton-secundario" onClick={() => setDetalle(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### `frontend/src/screens/Clientes.jsx`

```jsx
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { descargarCsv } from '../lib/csv.js';

const VACIO = { nombre: '', rtn: '', direccion: '', telefono: '', email: '', exento_impuestos: false };

export default function Clientes({ session, onIrA }) {
  const [busqueda, setBusqueda] = useState('');
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  function exportarCsv() {
    descargarCsv(`clientes-${new Date().toISOString().slice(0, 10)}.csv`, clientes, [
      { titulo: 'Nombre', valor: (c) => c.nombre },
      { titulo: 'RTN', valor: (c) => c.rtn ?? '' },
      { titulo: 'Dirección', valor: (c) => c.direccion ?? '' },
      { titulo: 'Teléfono', valor: (c) => c.telefono ?? '' },
      { titulo: 'Correo', valor: (c) => c.email ?? '' },
      { titulo: 'Exento', valor: (c) => (c.exento_impuestos ? 'Sí' : 'No') },
    ]);
  }

  async function cargar() {
    setClientes(await api.get(`/clientes?q=${encodeURIComponent(busqueda)}`, session));
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
  }, [busqueda]);

  function editar(c) {
    setEditandoId(c.id);
    setForm({
      nombre: c.nombre,
      rtn: c.rtn ?? '',
      direccion: c.direccion ?? '',
      telefono: c.telefono ?? '',
      email: c.email ?? '',
      exento_impuestos: c.exento_impuestos,
    });
  }

  async function guardar() {
    setError('');
    setGuardando(true);
    try {
      if (editandoId) await api.put(`/clientes/${editandoId}`, session, form);
      else await api.post('/clientes', session, form);
      setForm(VACIO);
      setEditandoId(null);
      cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="panel">
        <h2>{editandoId ? 'Editar cliente' : 'Nuevo cliente'}</h2>
        <div className="toolbar">
          <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <input placeholder="RTN" value={form.rtn} onChange={(e) => setForm({ ...form, rtn: e.target.value })} />
          <input
            placeholder="Dirección"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
          <input
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />
          <input placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-dim)' }}>
            <input
              type="checkbox"
              style={{ width: 'auto' }}
              checked={form.exento_impuestos}
              onChange={(e) => setForm({ ...form, exento_impuestos: e.target.checked })}
            />
            Exento de impuestos
          </label>
          <button className="boton-sm" disabled={guardando || !form.nombre} onClick={guardar}>
            {guardando ? 'Guardando…' : editandoId ? 'Guardar' : 'Agregar'}
          </button>
          {editandoId && (
            <button
              className="boton-sm boton-secundario"
              onClick={() => {
                setEditandoId(null);
                setForm(VACIO);
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="panel">
        <h2>Clientes</h2>
        <div className="toolbar">
          <input
            placeholder="Buscar por nombre, RTN, teléfono o correo…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="boton-sm boton-secundario" onClick={exportarCsv} disabled={clientes.length === 0}>
            Exportar CSV
          </button>
        </div>
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RTN</th>
              <th>Teléfono</th>
              <th>Exento</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.rtn ?? '—'}</td>
                <td>{c.telefono ?? '—'}</td>
                <td>{c.exento_impuestos ? 'Sí' : 'No'}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {!c.es_consumidor_final && (
                    <button className="boton-sm boton-secundario" onClick={() => editar(c)}>
                      Editar
                    </button>
                  )}{' '}
                  <button className="boton-sm boton-secundario" onClick={() => onIrA?.('facturas', { q: c.nombre })}>
                    Ver facturas
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
```

### `frontend/src/screens/Cotizaciones.jsx`

```jsx
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { colorSucursal } from '../lib/coloresSucursal.js';
import { descargarPdf, imprimirTicket, leerConfigImpresora, verPdf } from '../lib/documentos.js';
import CalendarioEventos, { ModalAceptar, horaCorta, situacionEvento } from '../components/CalendarioEventos.jsx';

const UMBRAL_RTN_OBLIGATORIO = 10000;

const VACIO = {
  nombre_cliente: '',
  rtn_cliente: '',
  telefono_cliente: '',
  email_cliente: '',
  nombre_evento: '',
  fecha_evento: '',
  hora_evento: '',
  lugar: '',
  cantidad_copitas: '',
  precio_copita: '',
  costo_servicio: '',
  descuento: '',
  notas: '',
};

// Estados que se pueden elegir a mano. "Facturada" sólo se alcanza con el
// botón Facturar, que emite la factura real.
const ETIQUETA_ESTADO = {
  borrador: 'Borrador',
  enviada: 'Enviada',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
};

const FORMAS_PAGO = [
  { valor: 'efectivo', etiqueta: '💵 Efectivo' },
  { valor: 'tarjeta', etiqueta: '💳 Tarjeta' },
  { valor: 'transferencia', etiqueta: '🏦 Transferencia' },
];

function fmtL(n) {
  return `L ${Number(n || 0).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function calcularTotal(f) {
  const total =
    Number(f.cantidad_copitas || 0) * Number(f.precio_copita || 0) +
    Number(f.costo_servicio || 0) -
    Number(f.descuento || 0);
  return Number.isFinite(total) ? total : 0;
}

function rtnLuceValido(rtn) {
  return /^\d{13,14}$/.test(String(rtn).replace(/[-\s]/g, ''));
}

// Evento dentro de los próximos 7 días que todavía no se confirmó.
function eventoProximo(c) {
  if (!c.fecha_evento || !['borrador', 'enviada'].includes(c.estado)) return false;
  const dias = (new Date(`${c.fecha_evento}T00:00:00`) - new Date()) / 86400000;
  return dias >= 0 && dias <= 7;
}

function ModalFacturar({ cotizacion, sucursal, session, onCerrar, onFacturada }) {
  const [forma, setForma] = useState('transferencia');
  const [rtn, setRtn] = useState(cotizacion.rtn_cliente ?? '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const total = Number(cotizacion.total);
  const requiereRtn = total > UMBRAL_RTN_OBLIGATORIO;
  const rtnInvalido = rtn.trim() !== '' && !rtnLuceValido(rtn);
  const puedeFacturar = !guardando && !rtnInvalido && (!requiereRtn || rtn.trim() !== '');

  async function facturar() {
    setGuardando(true);
    setError('');
    try {
      const factura = await api.post(`/cotizaciones/${cotizacion.id}/facturar`, session, {
        sucursal_id: sucursal.id,
        forma_pago: forma,
        rtn: rtn.trim() || null,
      });
      onFacturada(factura);
    } catch (e) {
      setError(e.message);
      setGuardando(false);
    }
  }

  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="tarjeta" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        <h2>Facturar cotización #{String(cotizacion.numero).padStart(4, '0')}</h2>
        <p style={{ color: 'var(--text-dim)', marginTop: -8 }}>
          Se emite la factura con los mismos productos y precios cotizados — no hay que volver a digitar nada.
        </p>
        {error && <div className="error">{error}</div>}

        <div className="resumen-conversion">
          <div>
            <span>Cliente</span>
            <strong>{cotizacion.nombre_cliente}</strong>
          </div>
          <div>
            <span>Evento</span>
            <strong>{cotizacion.nombre_evento}</strong>
          </div>
          <div>
            <span>{Number(cotizacion.cantidad_copitas).toLocaleString('es-HN')} copitas × {fmtL(cotizacion.precio_copita)}</span>
            <strong>{fmtL(Number(cotizacion.cantidad_copitas) * Number(cotizacion.precio_copita))}</strong>
          </div>
          {Number(cotizacion.costo_servicio) > 0 && (
            <div>
              <span>Servicio de evento</span>
              <strong>{fmtL(cotizacion.costo_servicio)}</strong>
            </div>
          )}
          {Number(cotizacion.descuento) > 0 && (
            <div>
              <span>Descuento</span>
              <strong>-{fmtL(cotizacion.descuento)}</strong>
            </div>
          )}
          <div className="total">
            <span>Total a facturar</span>
            <strong>{fmtL(total)}</strong>
          </div>
        </div>
        {Number(cotizacion.anticipo) > 0 && (
          <p className="aviso-ok" style={{ cursor: 'default' }}>
            Ya se recibió un anticipo de <strong>{fmtL(cotizacion.anticipo)}</strong>: cobra ahora solo el saldo de{' '}
            <strong>{fmtL(Math.max(0, total - Number(cotizacion.anticipo)))}</strong>. La factura sale por el total del evento.
          </p>
        )}

        <div className="sucursal-emisora">
          <span className="leyenda-punto" style={{ background: colorSucursal(sucursal.id) }} />
          Se factura en <strong>{sucursal.nombre}</strong>
        </div>

        <input
          placeholder={requiereRtn ? 'RTN del cliente (obligatorio, supera L10,000)' : 'RTN del cliente (opcional)'}
          value={rtn}
          onChange={(e) => setRtn(e.target.value)}
        />
        {rtnInvalido && (
          <p style={{ color: 'var(--aviso)', fontSize: '0.8em', marginTop: -8 }}>El RTN hondureño tiene 13-14 dígitos.</p>
        )}

        <div style={{ fontSize: '0.85em', color: 'var(--text-dim)', marginBottom: 6 }}>Forma de pago</div>
        <div className="opciones-segmentadas">
          {FORMAS_PAGO.map((f) => (
            <button key={f.valor} className={forma === f.valor ? 'activo' : ''} onClick={() => setForma(f.valor)}>
              {f.etiqueta}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="boton-secundario" onClick={onCerrar} disabled={guardando}>
            Cancelar
          </button>
          <button disabled={!puedeFacturar} onClick={facturar}>
            {guardando ? 'Emitiendo…' : `Emitir factura ${fmtL(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cotizaciones({ session, sucursales, sucursalId }) {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [enviandoId, setEnviandoId] = useState(null);
  const [facturando, setFacturando] = useState(null);
  const [aceptando, setAceptando] = useState(null);
  const [pestana, setPestana] = useState('calendario');
  const [abrirEnCalendario, setAbrirEnCalendario] = useState(null);

  const sucursalActiva = sucursales.find((s) => s.id === sucursalId);

  const cotizacionesVisibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return cotizaciones.filter((c) => {
      const coincideTexto =
        !q || c.nombre_cliente.toLowerCase().includes(q) || c.nombre_evento.toLowerCase().includes(q);
      const coincideEstado = !estadoFiltro || c.estado === estadoFiltro;
      return coincideTexto && coincideEstado;
    });
  }, [cotizaciones, busqueda, estadoFiltro]);

  async function cargar() {
    setCotizaciones(await api.get('/cotizaciones', session));
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function accionDocumento(promesa) {
    promesa.catch((e) => setError(e.message));
  }

  async function enviarPorCorreo(c) {
    setEnviandoId(c.id);
    setError('');
    try {
      await api.post(`/cotizaciones/${c.id}/enviar`, session, {});
      setAviso(`Cotización enviada a ${c.email_cliente}.`);
      cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviandoId(null);
    }
  }

  async function crear() {
    setError('');
    setGuardando(true);
    try {
      await api.post('/cotizaciones', session, {
        ...form,
        rtn_cliente: form.rtn_cliente.trim() || null,
        fecha_evento: form.fecha_evento || null,
        hora_evento: form.hora_evento || null,
      });
      setForm(VACIO);
      cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(cot, estado) {
    // Aceptar agenda el evento: se piden fecha, hora, sucursal y anticipo.
    if (estado === 'aceptada') {
      setAceptando(cot);
      return;
    }
    try {
      await api.put(`/cotizaciones/${cot.id}`, session, { estado });
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  async function eliminar(cot) {
    if (!window.confirm(`¿Eliminar la cotización #${String(cot.numero).padStart(4, '0')}?`)) return;
    try {
      await api.del(`/cotizaciones/${cot.id}`, session);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  function alFacturar(factura) {
    setFacturando(null);
    setAviso(`Factura ${factura.numero_factura} emitida${factura.es_borrador ? ' (sin validez fiscal: CAI pendiente)' : ''}.`);
    cargar();
    if (leerConfigImpresora().autoImprimir) {
      imprimirTicket(factura.id, session).catch((e) => setError(`La factura se emitió, pero no se pudo imprimir: ${e.message}`));
    }
  }

  const total = calcularTotal(form);

  function reemplazar(c) {
    setCotizaciones((lista) => lista.map((x) => (x.id === c.id ? { ...x, ...c } : x)));
  }

  const porAtender = cotizaciones.filter((c) => ['urgente', 'vencido'].includes(situacionEvento(c)?.tipo)).length;

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {aviso && (
        <div className="aviso-ok" onClick={() => setAviso('')}>
          {aviso}
        </div>
      )}

      {aceptando && (
        <ModalAceptar
          cotizacion={aceptando}
          sucursales={sucursales}
          sucursalIdDefecto={sucursalId}
          session={session}
          onCerrar={() => setAceptando(null)}
          onAceptada={(c) => {
            setAceptando(null);
            reemplazar(c);
            setAviso(`Cotización #${String(c.numero).padStart(4, '0')} aceptada y agendada en el calendario.`);
          }}
        />
      )}

      <div className="rep-pestanas" role="tablist">
        <button role="tab" aria-selected={pestana === 'calendario'} className={pestana === 'calendario' ? 'activa' : ''} onClick={() => setPestana('calendario')}>
          📅 Calendario de eventos
          {porAtender > 0 && <span className="rep-contador">{porAtender}</span>}
        </button>
        <button role="tab" aria-selected={pestana === 'lista'} className={pestana === 'lista' ? 'activa' : ''} onClick={() => setPestana('lista')}>
          Cotizaciones
        </button>
      </div>

      {pestana === 'calendario' && (
        <CalendarioEventos
          cotizaciones={cotizaciones}
          sucursales={sucursales}
          sucursalIdDefecto={sucursalId}
          session={session}
          abrirId={abrirEnCalendario}
          onAbierto={() => setAbrirEnCalendario(null)}
          onActualizada={reemplazar}
          onFacturar={(c) => (sucursalActiva ? setFacturando(c) : setError('Elige la sucursal que emite la factura'))}
          onVerPdf={(c) => accionDocumento(verPdf(`/cotizaciones/${c.id}/pdf`, session))}
        />
      )}

      {facturando && sucursalActiva && (
        <ModalFacturar
          cotizacion={facturando}
          sucursal={sucursalActiva}
          session={session}
          onCerrar={() => setFacturando(null)}
          onFacturada={alFacturar}
        />
      )}

      {pestana === 'lista' && (
      <>
      <div className="panel">
        <h2>Nueva cotización de evento</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9em', marginTop: -8 }}>
          Cantidad de copitas + costo de servicio — igual a como se cobra hoy. Precios con ISV incluido.
        </p>
        <div className="toolbar">
          <input
            placeholder="Nombre del cliente"
            value={form.nombre_cliente}
            onChange={(e) => setForm({ ...form, nombre_cliente: e.target.value })}
          />
          <input
            placeholder="RTN (si pedirá factura con RTN)"
            value={form.rtn_cliente}
            onChange={(e) => setForm({ ...form, rtn_cliente: e.target.value })}
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
          <input
            type="time"
            title="Hora del evento"
            value={form.hora_evento}
            onChange={(e) => setForm({ ...form, hora_evento: e.target.value })}
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
            placeholder="Descuento (L)"
            value={form.descuento}
            onChange={(e) => setForm({ ...form, descuento: e.target.value })}
          />
        </div>
        <textarea
          placeholder="Notas (sabores incluidos, requisitos del lugar, etc.)"
          value={form.notas}
          onChange={(e) => setForm({ ...form, notas: e.target.value })}
          rows={2}
          style={{ fontFamily: 'inherit' }}
        />
        <div className="pos-totales-fila total" style={{ marginBottom: 12 }}>
          <span>Total</span>
          <span>{fmtL(total)}</span>
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
        <div className="toolbar">
          <input
            placeholder="Buscar por cliente o evento…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
            <option value="">Todos los estados</option>
            {Object.entries(ETIQUETA_ESTADO).map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>
                {etiqueta}
              </option>
            ))}
            <option value="facturada">Facturada</option>
          </select>
        </div>
        <div style={{ overflowX: 'auto' }}>
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
              {cotizacionesVisibles.map((c) => {
                const facturada = c.estado === 'facturada';
                return (
                  <tr key={c.id}>
                    <td>{String(c.numero).padStart(4, '0')}</td>
                    <td>
                      {c.nombre_cliente}
                      {c.rtn_cliente && (
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.8em' }}>RTN {c.rtn_cliente}</div>
                      )}
                    </td>
                    <td>{c.nombre_evento}</td>
                    <td>
                      {c.fecha_evento ? (
                        <button
                          className="cal-fecha-enlace"
                          title="Ver en el calendario"
                          onClick={() => {
                            setAbrirEnCalendario(c.id);
                            setPestana('calendario');
                          }}
                        >
                          📅 {c.fecha_evento}
                          {c.hora_evento && ` · ${horaCorta(c.hora_evento)}`}
                        </button>
                      ) : (
                        '—'
                      )}
                      {eventoProximo(c) && (
                        <span className="chip" style={{ marginLeft: 6, fontSize: '0.75em', color: 'var(--aviso)', borderColor: 'var(--aviso)' }}>
                          Evento próximo
                        </span>
                      )}
                    </td>
                    <td>{fmtL(c.total)}</td>
                    <td>
                      {facturada ? (
                        <span className="chip" style={{ color: 'var(--ok)', borderColor: 'var(--ok)', marginTop: 0 }}>
                          ✓ Facturada
                        </span>
                      ) : (
                        <select value={c.estado} onChange={(e) => cambiarEstado(c, e.target.value)} style={{ marginBottom: 0 }}>
                          {Object.entries(ETIQUETA_ESTADO).map(([valor, etiqueta]) => (
                            <option key={valor} value={valor}>
                              {etiqueta}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {!facturada && c.estado !== 'rechazada' && (
                        <button className="boton-sm" disabled={!sucursalActiva} onClick={() => setFacturando(c)}>
                          Facturar
                        </button>
                      )}{' '}
                      <button
                        className="boton-sm boton-secundario"
                        onClick={() => accionDocumento(verPdf(`/cotizaciones/${c.id}/pdf`, session))}
                      >
                        Ver PDF
                      </button>{' '}
                      <button
                        className="boton-sm boton-secundario"
                        title="Descargar PDF"
                        onClick={() =>
                          accionDocumento(
                            descargarPdf(`/cotizaciones/${c.id}/pdf`, session, `cotizacion-evento-${c.numero}.pdf`)
                          )
                        }
                      >
                        ⬇
                      </button>{' '}
                      {c.email_cliente && !facturada && (
                        <button
                          className="boton-sm boton-secundario"
                          disabled={enviandoId === c.id}
                          onClick={() => enviarPorCorreo(c)}
                        >
                          {enviandoId === c.id ? 'Enviando…' : 'Enviar por correo'}
                        </button>
                      )}{' '}
                      {c.estado === 'borrador' && (
                        <button className="boton-sm boton-secundario" onClick={() => eliminar(c)}>
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
```

### `frontend/src/screens/Dashboard.jsx`

```jsx
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { BarraHorizontal, BarrasVerticales, Leyenda } from '../components/Graficas.jsx';
import { colorSucursal } from '../lib/coloresSucursal.js';
import { ATAJOS_FECHA } from '../lib/rangosFecha.js';
import { descargarCsv } from '../lib/csv.js';
import { useCambiosEnVivo } from '../lib/tiempoReal.js';

const COLOR_FORMA_PAGO = { Efectivo: 'var(--serie-1)', Tarjeta: 'var(--serie-2)', Transferencia: 'var(--serie-3)' };

function primerDiaMes() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

const fmtL = (n) => `L ${Number(n).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtEntero = (n) => Number(n).toLocaleString('es-HN');

export default function Dashboard({ session, sucursales }) {
  const [filtros, setFiltros] = useState({ sucursal_id: '', fechaInicio: primerDiaMes(), fechaFin: '' });
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function consultar() {
    setCargando(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filtros.sucursal_id) params.set('sucursal_id', filtros.sucursal_id);
      if (filtros.fechaInicio) params.set('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin) params.set('fechaFin', filtros.fechaFin);
      setDatos(await api.get(`/dashboard?${params.toString()}`, session));
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    consultar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cada factura emitida o anulada en cualquier sucursal mueve los números
  // al instante. Sin mostrar "Consultando…" para que no parpadee.
  useCambiosEnVivo(
    ['ventas'],
    async (payload) => {
      const estado = payload.new?.estado ?? payload.old?.estado;
      if (estado && estado !== 'pagada') return;
      try {
        const params = new URLSearchParams();
        if (filtros.sucursal_id) params.set('sucursal_id', filtros.sucursal_id);
        if (filtros.fechaInicio) params.set('fechaInicio', filtros.fechaInicio);
        if (filtros.fechaFin) params.set('fechaFin', filtros.fechaFin);
        setDatos(await api.get(`/dashboard?${params.toString()}`, session));
      } catch {
        // se reintenta con el siguiente cambio
      }
    },
    { retrasoMs: 800 }
  );

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="panel">
        <h2>Dashboard</h2>
        <div className="toolbar">
          <select value={filtros.sucursal_id} onChange={(e) => setFiltros({ ...filtros, sucursal_id: e.target.value })}>
            <option value="">Todas las sucursales</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
          <input type="date" value={filtros.fechaInicio} onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })} />
          <input type="date" value={filtros.fechaFin} onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })} />
          {ATAJOS_FECHA.map((a) => (
            <button
              key={a.etiqueta}
              className="boton-sm boton-secundario"
              onClick={() => setFiltros({ ...filtros, ...a.calcular() })}
            >
              {a.etiqueta}
            </button>
          ))}
          <button className="boton-sm" disabled={cargando} onClick={consultar}>
            {cargando ? 'Consultando…' : 'Consultar'}
          </button>
        </div>
      </div>

      {datos && (
        <>
          <div className="kpi-row">
            <div className="kpi-tile">
              <div className="kpi-label">Total ventas</div>
              <div className="kpi-valor">{fmtL(datos.total)}</div>
            </div>
            <div className="kpi-tile">
              <div className="kpi-label">Facturas</div>
              <div className="kpi-valor">{fmtEntero(datos.cantidad_facturas)}</div>
            </div>
            <div className="kpi-tile">
              <div className="kpi-label">Ticket promedio</div>
              <div className="kpi-valor">{fmtL(datos.ticket_promedio)}</div>
            </div>
            <div className="kpi-tile">
              <div className="kpi-label">ISV</div>
              <div className="kpi-valor">{fmtL(datos.isv_total)}</div>
            </div>
          </div>

          <div className="panel">
            <h2>Formas de pago</h2>
            <Leyenda
              items={datos.formas_pago.map((f) => ({
                nombre: `${f.nombre} · ${f.porcentaje}%`,
                color: COLOR_FORMA_PAGO[f.nombre] ?? 'var(--serie-4)',
              }))}
            />
            <BarraHorizontal
              datos={datos.formas_pago.map((f) => ({ ...f, color: COLOR_FORMA_PAGO[f.nombre] ?? 'var(--serie-4)' }))}
              valorClave="monto"
              etiquetaClave="nombre"
              formatear={fmtL}
            />
          </div>

          <div className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Por sucursal</h2>
              <button
                className="boton-sm boton-secundario"
                onClick={() =>
                  descargarCsv(`ventas-por-sucursal-${filtros.fechaInicio}-a-${filtros.fechaFin || 'hoy'}.csv`, datos.por_sucursal, [
                    { titulo: 'Sucursal', valor: (s) => s.nombre },
                    { titulo: 'Facturas', valor: (s) => s.facturas },
                    { titulo: 'Total', valor: (s) => Number(s.total).toFixed(2) },
                    { titulo: 'Ticket promedio', valor: (s) => Number(s.ticket_promedio).toFixed(2) },
                  ])
                }
              >
                Exportar CSV
              </button>
            </div>
            <Leyenda
              items={datos.por_sucursal.map((s) => ({
                nombre: s.nombre,
                color: colorSucursal(s.sucursal_id),
              }))}
            />
            <BarraHorizontal
              datos={datos.por_sucursal.map((s) => ({
                ...s,
                color: colorSucursal(s.sucursal_id),
              }))}
              valorClave="total"
              etiquetaClave="nombre"
              formatear={fmtL}
            />
            <table className="tabla" style={{ marginTop: 12 }}>
              <thead>
                <tr>
                  <th>Sucursal</th>
                  <th>Facturas</th>
                  <th>Ticket promedio</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const mejorTicket = Math.max(...datos.por_sucursal.map((s) => s.ticket_promedio));
                  return datos.por_sucursal.map((s) => (
                    <tr key={s.sucursal_id}>
                      <td>{s.nombre}</td>
                      <td>{s.facturas}</td>
                      <td>
                        {fmtL(s.ticket_promedio)}
                        {datos.por_sucursal.length > 1 && s.ticket_promedio === mejorTicket && mejorTicket > 0 && (
                          <span className="chip" style={{ marginLeft: 8, fontSize: '0.75em', color: 'var(--ok)', borderColor: 'var(--ok)' }}>
                            Mejor ticket
                          </span>
                        )}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <h2>Tendencia de ventas</h2>
            <BarrasVerticales
              datos={datos.tendencia_diaria.map((d) => ({
                etiqueta: d.fecha.slice(5),
                valor: d.total,
                color: 'var(--serie-1)',
              }))}
              formatear={fmtL}
            />
          </div>

          <div className="dos-columnas">
            <div className="panel">
              <h2>Top 10 productos</h2>
              <BarraHorizontal
                datos={datos.top_productos.map((p) => ({ ...p, color: 'var(--serie-1)' }))}
                valorClave="cantidad"
                etiquetaClave="nombre"
                formatear={fmtEntero}
              />
            </div>
            <div className="panel">
              <h2>Por categoría</h2>
              <BarraHorizontal
                datos={datos.por_categoria.map((c) => ({ ...c, color: 'var(--serie-2)' }))}
                valorClave="total"
                etiquetaClave="nombre"
                formatear={fmtL}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
```

### `frontend/src/screens/Facturas.jsx`

```jsx
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { colorSucursal } from '../lib/coloresSucursal.js';
import { descargarCsv } from '../lib/csv.js';
import { descargarPdf, imprimirTicket, verPdf } from '../lib/documentos.js';
import { useCambiosEnVivo } from '../lib/tiempoReal.js';
import { registrarEvento } from '../lib/eventos.js';

// Formas de pago de una factura, con el efectivo neto del cambio devuelto.
function formasDePago(f) {
  const porForma = new Map();
  for (const p of f.venta_pagos ?? []) {
    const nombre = p.formas_pago?.nombre ?? 'Otro';
    porForma.set(nombre, (porForma.get(nombre) ?? 0) + Number(p.monto));
  }
  if (porForma.has('Efectivo') && Number(f.cambio) > 0) porForma.set('Efectivo', porForma.get('Efectivo') - Number(f.cambio));
  return [...porForma.entries()].map(([nombre, monto]) => ({ nombre, monto }));
}

const CLASE_FORMA = { Efectivo: 'pago-efectivo', Tarjeta: 'pago-tarjeta', Transferencia: 'pago-transferencia' };

function ChipsPago({ factura }) {
  const formas = formasDePago(factura);
  if (formas.length === 0) return <span style={{ color: 'var(--text-dim)' }}>—</span>;
  return (
    <span className="chips-pago">
      {formas.map((p) => (
        <span key={p.nombre} className={`chip-pago ${CLASE_FORMA[p.nombre] ?? ''}`} title={`L ${p.monto.toFixed(2)}`}>
          {p.nombre}
          {formas.length > 1 && ` L${p.monto.toFixed(0)}`}
        </span>
      ))}
    </span>
  );
}

export default function Facturas({ session, perfil, sucursales, filtroInicial, onFiltroInicialUsado }) {
  const [filtros, setFiltros] = useState({ sucursal_id: '', fechaInicio: '', fechaFin: '', q: filtroInicial?.q ?? '' });
  const [cajeroFiltro, setCajeroFiltro] = useState('');
  const [soloAnuladas, setSoloAnuladas] = useState(false);
  const [formaFiltro, setFormaFiltro] = useState('');
  const [facturas, setFacturas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [error, setError] = useState('');
  const [motivoAnulacion, setMotivoAnulacion] = useState('');
  const [montoAnulacion, setMontoAnulacion] = useState('');
  const [notasCredito, setNotasCredito] = useState([]);
  const [reenviando, setReenviando] = useState(false);

  const cajerosDisponibles = useMemo(
    () => [...new Set(facturas.map((f) => f.perfiles?.nombre).filter(Boolean))].sort(),
    [facturas]
  );
  const facturasVisibles = useMemo(() => {
    let lista = facturas;
    if (cajeroFiltro) lista = lista.filter((f) => f.perfiles?.nombre === cajeroFiltro);
    if (soloAnuladas) lista = lista.filter((f) => f.anulada);
    if (formaFiltro) lista = lista.filter((f) => formasDePago(f).some((p) => p.nombre === formaFiltro));
    return lista;
  }, [facturas, cajeroFiltro, soloAnuladas, formaFiltro]);
  const totalesPorForma = useMemo(() => {
    const t = {};
    for (const f of facturasVisibles) {
      if (f.anulada) continue;
      for (const p of formasDePago(f)) t[p.nombre] = (t[p.nombre] ?? 0) + p.monto;
    }
    return t;
  }, [facturasVisibles]);
  const totalVisible = useMemo(
    () => facturasVisibles.reduce((s, f) => s + (f.anulada ? 0 : Number(f.total)), 0),
    [facturasVisibles]
  );

  function exportarCsv() {
    descargarCsv(
      `facturas-${new Date().toISOString().slice(0, 10)}.csv`,
      facturasVisibles,
      [
        { titulo: 'No. Orden', valor: (f) => f.numero_orden },
        { titulo: 'Fecha', valor: (f) => (f.fecha_emision ? new Date(f.fecha_emision).toLocaleString('es-HN') : '') },
        { titulo: 'No. Factura', valor: (f) => f.numero_factura },
        { titulo: 'Cliente', valor: (f) => f.clientes?.nombre ?? 'Consumidor Final' },
        { titulo: 'RTN', valor: (f) => f.clientes?.rtn ?? '' },
        { titulo: 'Impuesto', valor: (f) => Number(f.isv_total).toFixed(2) },
        { titulo: 'Total', valor: (f) => Number(f.total).toFixed(2) },
        { titulo: 'Forma de pago', valor: (f) => formasDePago(f).map((p) => `${p.nombre} ${p.monto.toFixed(2)}`).join(' + ') },
        { titulo: 'Cajero', valor: (f) => f.perfiles?.nombre ?? '' },
        { titulo: 'Anulada', valor: (f) => (f.anulada ? 'Sí' : 'No') },
      ]
    );
  }

  async function buscar() {
    const params = new URLSearchParams({ estado: 'pagada' });
    if (filtros.sucursal_id) params.set('sucursal_id', filtros.sucursal_id);
    if (filtros.fechaInicio) params.set('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.set('fechaFin', filtros.fechaFin);
    if (filtros.q) params.set('q', filtros.q);
    if (filtros.q || filtros.fechaInicio) registrarEvento('factura.buscar', { q: filtros.q, desde: filtros.fechaInicio, hasta: filtros.fechaFin });
    setFacturas(await api.get(`/ventas?${params.toString()}`, session));
  }

  useEffect(() => {
    buscar().catch((e) => setError(e.message));
    if (filtroInicial) onFiltroInicialUsado?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Una factura emitida o anulada en cualquier sucursal aparece acá al
  // instante, con los mismos filtros que ya están puestos.
  useCambiosEnVivo(['ventas'], (payload) => {
    const estado = payload.new?.estado ?? payload.old?.estado;
    if (estado && estado !== 'pagada') return;
    buscar().catch(() => {});
  });

  function accionDocumento(promesa) {
    promesa.catch((e) => setError(e.message));
  }

  async function reenviarCorreo(id) {
    setReenviando(true);
    setError('');
    try {
      await api.post(`/ventas/${id}/reenviar-correo`, session, {});
      window.alert('Correo reenviado.');
      buscar();
    } catch (e) {
      setError(e.message);
    } finally {
      setReenviando(false);
    }
  }

  async function verDetalle(id) {
    const detalle = await api.get(`/ventas/${id}`, session);
    setSeleccionada(detalle);
    registrarEvento('factura.ver', { factura: detalle.numero_factura, total: Number(detalle.total) }, detalle.sucursal_id);
    setMotivoAnulacion('');
    setMontoAnulacion(detalle.total);
    setNotasCredito(perfil.rol === 'cajero' ? [] : await api.get(`/notas-credito?venta_id=${id}`, session));
  }

  async function anular() {
    if (!motivoAnulacion.trim() || !montoAnulacion) return;
    try {
      await api.post('/notas-credito', session, {
        venta_id: seleccionada.id,
        motivo: motivoAnulacion,
        monto: Number(montoAnulacion),
      });
      setSeleccionada(null);
      buscar();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="panel">
        <h2>Listado de facturas</h2>
        <div className="toolbar">
          <select value={filtros.sucursal_id} onChange={(e) => setFiltros({ ...filtros, sucursal_id: e.target.value })}>
            <option value="">Todas las sucursales</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
          <input type="date" value={filtros.fechaInicio} onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })} />
          <input type="date" value={filtros.fechaFin} onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })} />
          <input placeholder="Buscar No. de factura" value={filtros.q} onChange={(e) => setFiltros({ ...filtros, q: e.target.value })} />
          <button className="boton-sm" onClick={buscar}>
            Buscar
          </button>
          {cajerosDisponibles.length > 1 && (
            <select value={cajeroFiltro} onChange={(e) => setCajeroFiltro(e.target.value)}>
              <option value="">Todos los cajeros</option>
              {cajerosDisponibles.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
          <select value={formaFiltro} onChange={(e) => setFormaFiltro(e.target.value)}>
            <option value="">Todas las formas de pago</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Transferencia">Transferencia</option>
          </select>
          <button className="boton-sm boton-secundario" onClick={exportarCsv} disabled={facturasVisibles.length === 0}>
            Exportar CSV
          </button>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-dim)' }}>
            <input
              type="checkbox"
              style={{ width: 'auto' }}
              checked={soloAnuladas}
              onChange={(e) => setSoloAnuladas(e.target.checked)}
            />
            Sólo anuladas
          </label>
        </div>

        {facturas.length >= 200 && (
          <div className="alerta">
            Se están mostrando los últimos 200 resultados — acota el rango de fechas o la sucursal para ver el resto.
          </div>
        )}

        <p style={{ color: 'var(--text-dim)' }}>
          {facturasVisibles.length} factura{facturasVisibles.length === 1 ? '' : 's'} · Total: L{' '}
          {totalVisible.toFixed(2)}
          {Object.entries(totalesPorForma).map(([nombre, monto]) => (
            <span key={nombre} className={`chip-pago ${CLASE_FORMA[nombre] ?? ''}`} style={{ marginLeft: 8 }}>
              {nombre} L {monto.toFixed(2)}
            </span>
          ))}
        </p>

        <table className="tabla">
          <thead>
            <tr>
              <th>Sucursal</th>
              <th>No. Orden</th>
              <th>Fecha</th>
              <th>No. Factura</th>
              <th>Cliente</th>
              <th>RTN</th>
              <th>Impuesto</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Cajero</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {facturasVisibles.map((f) => (
              <tr key={f.id} style={f.anulada ? { opacity: 0.5, textDecoration: 'line-through' } : undefined}>
                <td>
                  <span
                    className="leyenda-punto"
                    style={{ background: colorSucursal(f.sucursal_id), display: 'inline-block' }}
                    title="Sucursal"
                  />
                </td>
                <td>{f.numero_orden}</td>
                <td>{f.fecha_emision ? new Date(f.fecha_emision).toLocaleString('es-HN') : '—'}</td>
                <td>{f.numero_factura}</td>
                <td>{f.clientes?.nombre ?? 'Consumidor Final'}</td>
                <td>{f.clientes?.rtn ?? '—'}</td>
                <td>L {Number(f.isv_total).toFixed(2)}</td>
                <td>L {Number(f.total).toFixed(2)}</td>
                <td>
                  <ChipsPago factura={f} />
                </td>
                <td>{f.perfiles?.nombre ?? '—'}</td>
                <td>
                  <button className="boton-sm boton-secundario" onClick={() => verDetalle(f.id)}>
                    Ver
                  </button>
                  {f.correo_enviado === false && (
                    <span title={`No se pudo enviar el correo: ${f.correo_error ?? ''}`} style={{ marginLeft: 6 }}>
                      ✉️⚠️
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {seleccionada && (
        <div className="overlay" onClick={() => setSeleccionada(null)}>
          <div className="tarjeta" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            {seleccionada.puntos_emision?.es_borrador && (
              <div className="badge-borrador">Sin validez fiscal — CAI pendiente</div>
            )}
            <h2>{seleccionada.numero_factura}</h2>
            <p>
              {seleccionada.clientes?.nombre || 'Consumidor Final'}
              {seleccionada.clientes?.rtn ? ` · RTN ${seleccionada.clientes.rtn}` : ''}
            </p>
            {(seleccionada.detalle || []).map((d) => (
              <div key={d.id} className="pos-orden-linea">
                <span>
                  {Number(d.cantidad)} × {d.nombre_producto}
                  {Number(d.descuento) > 0 && (
                    <span style={{ color: 'var(--ok)', fontSize: '0.85em' }}>
                      {' '}
                      · desc. {Number(d.descuento_porcentaje) || ''}%{Number(d.descuento_porcentaje) === 25 ? ' 3ra edad' : ''} −L{' '}
                      {Number(d.descuento).toFixed(2)}
                    </span>
                  )}
                </span>
                <span>L {(Number(d.cantidad) * Number(d.precio_unitario)).toFixed(2)}</span>
              </div>
            ))}
            {Number(seleccionada.descuento) > 0 && (
              <div className="pos-totales-fila">
                <span>Descuentos (por producto)</span>
                <span>-L {Number(seleccionada.descuento).toFixed(2)}</span>
              </div>
            )}
            <div className="pos-totales-fila total">
              <span>Total</span>
              <span>L {Number(seleccionada.total).toFixed(2)}</span>
            </div>
            <div className="pos-totales-fila">
              <span>Pagado con</span>
              <ChipsPago factura={seleccionada} />
            </div>
            <div style={{ display: 'flex', gap: 8, margin: '10px 0' }}>
              <button
                className="boton-secundario boton-sm"
                style={{ flex: 1 }}
                onClick={() => accionDocumento(imprimirTicket(seleccionada.id, session, { reimpresion: true }))}
              >
                🖨 Reimprimir
              </button>
              <button
                className="boton-secundario boton-sm"
                style={{ flex: 1 }}
                onClick={() => accionDocumento(verPdf(`/ventas/${seleccionada.id}/pdf`, session))}
              >
                Ver PDF
              </button>
              <button
                className="boton-secundario boton-sm"
                style={{ flex: 1 }}
                onClick={() =>
                  accionDocumento(
                    descargarPdf(`/ventas/${seleccionada.id}/pdf`, session, `factura-${seleccionada.numero_factura}.pdf`)
                  )
                }
              >
                Descargar PDF
              </button>
            </div>
            {seleccionada.clientes?.email && (
              <button
                className="boton-secundario boton-sm"
                style={{ width: '100%', marginBottom: 10 }}
                disabled={reenviando}
                onClick={() => reenviarCorreo(seleccionada.id)}
              >
                {reenviando ? 'Enviando…' : `Reenviar correo a ${seleccionada.clientes.email}`}
              </button>
            )}

            {notasCredito.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginBottom: 10 }}>
                <strong style={{ fontSize: '0.9em', color: 'var(--text-dim)' }}>Notas de crédito emitidas</strong>
                {notasCredito.map((n) => (
                  <div key={n.id} className="pos-orden-linea">
                    <span>{n.motivo}</span>
                    <span>L {Number(n.monto).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {perfil.rol === 'admin' && !seleccionada.anulada && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <input
                  placeholder="Motivo de la nota de crédito"
                  value={motivoAnulacion}
                  onChange={(e) => setMotivoAnulacion(e.target.value)}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Monto a anular"
                  value={montoAnulacion}
                  onChange={(e) => setMontoAnulacion(e.target.value)}
                />
                <p style={{ fontSize: '0.8em', color: 'var(--text-dim)', marginTop: -6 }}>
                  Si el monto es igual al total, la factura queda marcada como anulada. Si es menor, se
                  registra como nota de crédito parcial (el correlativo de la factura no se toca).
                </p>
                <button
                  className="boton-peligro"
                  disabled={!motivoAnulacion.trim() || !montoAnulacion}
                  onClick={anular}
                >
                  Emitir nota de crédito
                </button>
              </div>
            )}
            {seleccionada.anulada && <div className="alerta">Esta factura ya fue anulada.</div>}

            <button className="boton-secundario" onClick={() => setSeleccionada(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### `frontend/src/screens/Impresora.jsx`

```jsx
import { useState } from 'react';
import { guardarConfigImpresora, imprimirPrueba, leerConfigImpresora, PAPELES } from '../lib/documentos.js';

const URL_APP = typeof window !== 'undefined' ? window.location.origin : 'https://italo-facturacion.onrender.com';
const ACCESO_DIRECTO = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --kiosk-printing --app=${URL_APP}`;

export default function Impresora({ session, sucursales, sucursalId }) {
  const [config, setConfig] = useState(leerConfigImpresora);
  const [estado, setEstado] = useState('');
  const [error, setError] = useState('');
  const [copiado, setCopiado] = useState(false);

  function actualizar(cambios) {
    const nueva = { ...config, ...cambios };
    setConfig(nueva);
    guardarConfigImpresora(nueva);
    setEstado('Guardado en esta computadora.');
  }

  async function probar() {
    setError('');
    setEstado('Enviando prueba…');
    try {
      await imprimirPrueba(session, sucursales.find((s) => s.id === sucursalId)?.nombre);
      setEstado('Prueba enviada a la impresora.');
    } catch (e) {
      setEstado('');
      setError(e.message);
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(ACCESO_DIRECTO);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setError('No se pudo copiar — selecciona el texto y usa Ctrl+C.');
    }
  }

  return (
    <div style={{ maxWidth: 820 }}>
      {error && <div className="error">{error}</div>}

      <div className="panel">
        <h2>Impresora térmica de esta caja</h2>
        <p style={{ color: 'var(--text-dim)', marginTop: -8 }}>
          Esta configuración se guarda en esta computadora — cada caja puede tener su propia impresora.
        </p>

        <div style={{ fontSize: '0.85em', color: 'var(--text-dim)', marginBottom: 6 }}>Ancho del papel</div>
        <div className="opciones-segmentadas">
          {PAPELES.map((p) => (
            <button
              key={p.columnas}
              className={config.columnas === p.columnas ? 'activo' : ''}
              onClick={() => actualizar({ columnas: p.columnas })}
            >
              {p.etiqueta}
            </button>
          ))}
        </div>

        <label className="interruptor">
          <input
            type="checkbox"
            checked={config.autoImprimir}
            onChange={(e) => actualizar({ autoImprimir: e.target.checked })}
          />
          Imprimir la factura automáticamente al cobrar (1 copia)
        </label>

        <div className="toolbar" style={{ marginTop: 14 }}>
          <button className="boton-sm" onClick={probar}>
            🖨 Imprimir ticket de prueba
          </button>
          {estado && <span style={{ color: 'var(--text-dim)', fontSize: '0.85em' }}>{estado}</span>}
        </div>
      </div>

      <div className="panel">
        <h2>Imprimir directo, sin ventana de confirmación</h2>
        <p style={{ color: 'var(--text-dim)', marginTop: -8 }}>
          Sin este paso la factura igual se imprime, pero Chrome muestra la ventana de impresión y hay que dar Enter
          cada vez. Se configura una sola vez por computadora (Windows):
        </p>
        <ol className="pasos">
          <li>
            Instala el driver de la impresora (Epson, Xprinter, 3nStar, etc.) y en <strong>Configuración → Impresoras</strong>{' '}
            márcala como <strong>predeterminada</strong>. En sus preferencias, elige papel de 80 mm (o 58 mm) y márgenes en 0.
          </li>
          <li>
            En el escritorio: clic derecho → <strong>Nuevo → Acceso directo</strong>, y pega esto como ubicación:
            <div className="codigo-copiable">
              <code>{ACCESO_DIRECTO}</code>
              <button className="boton-sm boton-secundario" onClick={copiar}>
                {copiado ? 'Copiado ✓' : 'Copiar'}
              </button>
            </div>
          </li>
          <li>
            Nómbralo <strong>"Italo Facturación"</strong>. Cierra todas las ventanas de Chrome y abre el sistema siempre
            desde ese acceso directo.
          </li>
          <li>
            Entra, vuelve a esta pantalla y toca <strong>Imprimir ticket de prueba</strong>: debe salir directo por la
            térmica, sin preguntar. Si las líneas salen cortadas, cambia el ancho del papel arriba.
          </li>
        </ol>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85em' }}>
          <strong>--kiosk-printing</strong> hace que Chrome imprima en la impresora predeterminada sin mostrar el diálogo.{' '}
          <strong>--app</strong> abre el sistema como aplicación, sin barra de direcciones ni pestañas.
        </p>
      </div>
    </div>
  );
}
```

### `frontend/src/screens/Pos.jsx`

```jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api.js';
import { calcularTotales, descuentoDeLinea, OPCIONES_DESCUENTO } from '../lib/facturacion.js';
import { registrarEvento } from '../lib/eventos.js';
import { colorSucursal, nombreCortoSucursal } from '../lib/coloresSucursal.js';
import { imprimirTicket, leerConfigImpresora, pedirMotivo, verPdf } from '../lib/documentos.js';
import { useCambiosEnVivo } from '../lib/tiempoReal.js';

const CONSUMIDOR_FINAL_NOMBRE = 'Consumidor Final';
const UMBRAL_RTN_OBLIGATORIO = 10000;
const DENOMINACIONES_EFECTIVO = [20, 50, 100, 200, 500, 1000];
const MOTIVOS_DESCARTE = ['El cliente se arrepintió', 'Error al digitar la orden', 'Orden duplicada', 'Orden de prueba'];

function fmtL(n) {
  return `L ${Number(n || 0).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function rtnLuceValido(rtn) {
  if (!rtn) return true; // no bloquea si está vacío, eso lo maneja el umbral obligatorio
  return /^\d{13,14}$/.test(rtn.replace(/[-\s]/g, ''));
}

function normalizar(texto) {
  return String(texto ?? '').trim().toLowerCase();
}

// Un lector de código de barras "teclea" el código muy rápido y termina con
// Enter. Se busca primero coincidencia exacta de código de barras o código
// interno; así el escaneo nunca agrega un producto parecido por error.
function buscarPorCodigo(productos, codigo) {
  const c = normalizar(codigo);
  if (!c) return null;
  return (
    productos.find((p) => normalizar(p.codigo_barras) === c) ?? productos.find((p) => normalizar(p.codigo) === c) ?? null
  );
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
      <div className="pos-cliente-actual">
        <span style={{ fontWeight: 600 }}>
          {clienteNombre || CONSUMIDOR_FINAL_NOMBRE}
          {clienteExento && (
            <span className="chip" style={{ marginLeft: 8, fontSize: '0.7em' }}>
              Exento de impuestos
            </span>
          )}
        </span>
        {clienteId && (
          <button
            className="boton-sm boton-secundario"
            title="Volver a Consumidor Final"
            onClick={() => onSeleccionar(null)}
          >
            ✕ Consumidor Final
          </button>
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
                onSeleccionar(c.es_consumidor_final ? null : c);
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
            <p style={{ color: 'var(--aviso)', fontSize: '0.8em', marginTop: -8 }}>
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
    <div className="overlay" onClick={onCerrar}>
      <div className="tarjeta" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <h2>Órdenes abiertas</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85em', marginTop: -8 }}>
          Órdenes completas guardadas sin cobrar. Se actualizan solas si otra caja agrega o cobra una.
        </p>
        {cargando && <p style={{ color: 'var(--text-dim)' }}>Cargando…</p>}
        {!cargando && ordenes.length === 0 && <p style={{ color: 'var(--text-dim)' }}>No hay órdenes abiertas.</p>}
        {ordenes.map((o) => (
          <button key={o.id} className="orden-abierta" onClick={() => onSeleccionar(o)}>
            <span>
              <strong>Orden #{o.numero_orden}</strong>
              <br />
              <span style={{ color: 'var(--text-dim)', fontSize: '0.85em' }}>
                {o.clientes?.nombre || CONSUMIDOR_FINAL_NOMBRE} · {o.perfiles?.nombre ?? ''} ·{' '}
                {new Date(o.created_at).toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </span>
            <strong>{fmtL(o.total)}</strong>
          </button>
        ))}
        <button className="boton-secundario" style={{ marginTop: 6 }} onClick={onCerrar}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

let contadorLineas = 0;
// Cada línea del carrito tiene su propia clave: el mismo producto puede ir
// en dos líneas (una con descuento de tercera edad y otra sin descuento).
function nuevaClave() {
  contadorLineas += 1;
  return `l${Date.now().toString(36)}${contadorLineas}`;
}

export default function Pos({ session, perfil, sucursales, onIrA, sucursalId, onCambiarSucursalId, onCarritoOcupado }) {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaActivaId, setCategoriaActivaId] = useState(null);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [notaInterna, setNotaInterna] = useState('');
  const [terceraEdad, setTerceraEdad] = useState({ nombre: '', identidad: '' });
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
  const primerCambio = useRef(true);
  const ultimaVentaRef = useRef(null);
  const buscadorRef = useRef(null);
  // El id de la orden abierta se lee de una ref (no del estado) porque el
  // autoguardado corre en un setTimeout: si se leyera del estado, dos
  // agregados rápidos podían disparar dos autoguardados que todavía no
  // se habían enterado uno del otro, y cada uno creaba su propia orden.
  const ventaIdRef = useRef(null);
  const colaGuardadoRef = useRef(Promise.resolve());
  const descartadaRef = useRef(false);

  function fijarVentaId(id) {
    ventaIdRef.current = id;
    setVentaId(id);
  }

  function cargarCatalogo({ silencioso = false } = {}) {
    if (!silencioso) setCargandoCatalogo(true);
    return Promise.all([api.get('/categorias', session), api.get('/productos', session)])
      .then(([cats, prods]) => {
        setCategorias(cats);
        setProductos(prods);
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargandoCatalogo(false));
  }

  useEffect(() => {
    cargarCatalogo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Un precio o producto nuevo cargado desde otra computadora aparece acá
  // al instante, sin recargar la página.
  useCambiosEnVivo(['productos', 'categorias'], () => cargarCatalogo({ silencioso: true }));

  // Órdenes Abiertas se refresca sola mientras está abierta.
  useCambiosEnVivo(
    ['ventas'],
    () => {
      api
        .get(`/ventas?estado=abierta&sucursal_id=${sucursalId}`, session)
        .then(setOrdenesAbiertas)
        .catch(() => {});
    },
    { filtro: sucursalId ? `sucursal_id=eq.${sucursalId}` : undefined, activo: mostrarOrdenes && !!sucursalId }
  );

  useEffect(() => {
    buscadorRef.current?.focus();
  }, []);

  // Avisa hacia arriba si hay una orden en curso — el selector de
  // sucursal (en la barra de navegación) se bloquea mientras haya productos.
  useEffect(() => {
    onCarritoOcupado?.(carrito.length > 0);
    return () => onCarritoOcupado?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carrito.length]);

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
    const q = normalizar(busquedaProducto);
    if (q) {
      return productos.filter(
        (p) =>
          normalizar(p.nombre).includes(q) || normalizar(p.codigo).includes(q) || normalizar(p.codigo_barras).includes(q)
      );
    }
    return productos.filter((p) => !categoriaActivaId || p.categoria_id === categoriaActivaId);
  }, [productos, categoriaActivaId, busquedaProducto]);

  // Mismo cálculo de impuestos que el backend, para que el desglose que ve
  // el cajero coincida exacto con lo que se va a cobrar.
  const totales = useMemo(() => {
    const items = carrito.map((l) => ({
      precio_unitario: l.precio_unitario,
      cantidad: l.cantidad,
      descuento_porcentaje: l.descuento_porcentaje ?? 0,
      impuesto_tasa: l.impuesto_tasa,
    }));
    return calcularTotales(items, cliente);
  }, [carrito, cliente]);
  const hayTerceraEdad = carrito.some((l) => l.descuento_porcentaje === 25);
  // Para el 25% de tercera edad se exige el nombre y el No. de identidad o
  // carné: sin eso el descuento se podía aplicar a cualquiera.
  const faltaCarne =
    hayTerceraEdad && (!terceraEdad.nombre.trim() || terceraEdad.identidad.replace(/[^0-9A-Za-z]/g, '').length < 5);

  const requiereRtn = totales.total > UMBRAL_RTN_OBLIGATORIO && !cliente?.rtn;
  const carritoTieneLineasInvalidas = carrito.some(
    (l) => !Number.isFinite(l.cantidad) || l.cantidad <= 0 || !Number.isFinite(l.precio_unitario) || l.precio_unitario < 0
  );
  const sinPuntoEmision = estadoPuntoEmision?.error;
  const cobroBloqueado =
    carrito.length === 0 || carritoTieneLineasInvalidas || sinPuntoEmision || requiereRtn || guardandoPago || faltaCarne;

  // Auto-guarda la orden como "abierta" cada vez que cambia — así "Órdenes
  // Abiertas" siempre puede recuperarla. Si falla por red, reintenta una vez.
  useEffect(() => {
    if (primerCambio.current) {
      primerCambio.current = false;
      return;
    }
    if (carrito.length === 0) return;
    descartadaRef.current = false;
    const t = setTimeout(() => {
      guardarOrdenEnCola().catch(() => {
        setTimeout(() => guardarOrdenEnCola().catch(() => {}), 2000);
      });
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carrito, cliente, sucursalId, notaInterna, terceraEdad]);

  async function guardarOrden() {
    const body = {
      sucursal_id: sucursalId,
      cliente_id: cliente?.id ?? null,
      descuento_porcentaje: 0,
      nota_interna: notaInterna || null,
      tercera_edad: carrito.some((l) => l.descuento_porcentaje === 25) ? terceraEdad : { nombre: '', identidad: '' },
      // El descuento va por producto: una orden puede tener una persona de
      // tercera edad y otra que no.
      items: carrito.map((l) => ({
        producto_id: l.producto_id,
        cantidad: l.cantidad,
        descuento_porcentaje: l.descuento_porcentaje ?? 0,
      })),
    };
    if (body.items.length === 0) return ventaIdRef.current;
    try {
      if (ventaIdRef.current) {
        await api.put(`/ventas/${ventaIdRef.current}`, session, body);
        setError('');
        return ventaIdRef.current;
      }
      const venta = await api.post('/ventas', session, body);
      fijarVentaId(venta.id);
      setError('');
      return venta.id;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  // Encola cada autoguardado en serie: nunca deja que dos corran a la vez.
  function guardarOrdenEnCola() {
    const promesa = colaGuardadoRef.current.catch(() => {}).then(() => {
      if (descartadaRef.current) return ventaIdRef.current;
      return guardarOrden();
    });
    colaGuardadoRef.current = promesa;
    return promesa;
  }

  function agregarProducto(producto) {
    if (!producto.precio && producto.precio !== 0) return;
    setResultadoFactura(null);
    setCarrito((actual) => {
      // Se suma a la línea del mismo producto SIN descuento; si la única
      // línea existente tiene descuento, la unidad nueva va aparte (no toda
      // persona de la orden es de tercera edad).
      const existente = actual.find((l) => l.producto_id === producto.id && !l.descuento_porcentaje);
      if (existente) {
        return actual.map((l) => (l.clave === existente.clave ? { ...l, cantidad: l.cantidad + 1 } : l));
      }
      return [
        ...actual,
        {
          clave: nuevaClave(),
          producto_id: producto.id,
          nombre: producto.nombre,
          precio_unitario: producto.precio,
          impuesto_tasa: producto.impuesto1_tasa,
          cantidad: 1,
          descuento_porcentaje: 0,
        },
      ];
    });
    mostrarToast(`+ ${producto.nombre}`);
  }

  // Lector de código de barras con el cursor fuera de cualquier campo (por
  // ejemplo, justo después de tocar un producto): se captura la ráfaga de
  // teclas que manda el lector y se agrega el producto al terminar con Enter.
  // Si el cursor está en un campo de texto, esa escritura es de una persona
  // y no se toca.
  const productosRef = useRef(productos);
  productosRef.current = productos;
  useEffect(() => {
    let buffer = '';
    let ultimaTecla = 0;
    function onKeyDown(e) {
      const el = document.activeElement;
      const escribiendo = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
      if (escribiendo || e.ctrlKey || e.altKey || e.metaKey) return;
      const ahora = Date.now();
      if (ahora - ultimaTecla > 80) buffer = '';
      ultimaTecla = ahora;
      if (e.key === 'Enter') {
        if (buffer.length >= 3) {
          const producto = buscarPorCodigo(productosRef.current, buffer);
          if (producto) agregarProducto(producto);
          else mostrarToast(`Código ${buffer} no encontrado`);
          e.preventDefault();
        }
        buffer = '';
        return;
      }
      if (e.key.length === 1) buffer += e.key;
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quitar productos de una orden ya armada (sobre todo después de que el
  // cliente vio el total) es una de las formas de cobrar de más sin
  // facturarlo: cada quitada queda en la bitácora.
  function registrarQuitado(clave, cantidadQuitada) {
    const l = carrito.find((x) => x.clave === clave);
    if (!l || cantidadQuitada <= 0) return;
    registrarEvento(
      'orden.quitar_producto',
      {
        producto: l.nombre,
        cantidad: cantidadQuitada,
        monto: Math.round(l.precio_unitario * cantidadQuitada * 100) / 100,
        orden_id: ventaIdRef.current ?? '',
        quedan_en_orden: carrito.length,
      },
      sucursalId
    );
  }

  function cambiarCantidad(clave, delta) {
    if (delta < 0) registrarQuitado(clave, -delta);
    setCarrito((actual) =>
      actual.map((l) => (l.clave === clave ? { ...l, cantidad: l.cantidad + delta } : l)).filter((l) => l.cantidad > 0)
    );
  }

  function establecerCantidad(clave, valor) {
    const cantidad = Math.max(1, Math.floor(Number(valor) || 1));
    const anterior = carrito.find((x) => x.clave === clave)?.cantidad ?? cantidad;
    if (cantidad < anterior) registrarQuitado(clave, anterior - cantidad);
    setCarrito((actual) => actual.map((l) => (l.clave === clave ? { ...l, cantidad } : l)));
  }

  function quitarLinea(clave) {
    registrarQuitado(clave, carrito.find((x) => x.clave === clave)?.cantidad ?? 0);
    setCarrito((actual) => actual.filter((l) => l.clave !== clave));
  }

  function fijarDescuentoLinea(clave, porcentaje) {
    const l = carrito.find((x) => x.clave === clave);
    if (l && porcentaje > 0) {
      registrarEvento('orden.descuento', { producto: l.nombre, cantidad: l.cantidad, porcentaje }, sucursalId);
    }
    setCarrito((actual) => actual.map((l) => (l.clave === clave ? { ...l, descuento_porcentaje: porcentaje } : l)));
  }

  // "2 gelatos, uno para un adulto mayor": saca 1 unidad a su propia línea
  // para ponerle el descuento sólo a esa.
  function separarUnidad(clave) {
    setCarrito((actual) => {
      const i = actual.findIndex((l) => l.clave === clave);
      if (i < 0 || actual[i].cantidad < 2) return actual;
      const copia = [...actual];
      copia[i] = { ...copia[i], cantidad: copia[i].cantidad - 1 };
      copia.splice(i + 1, 0, { ...actual[i], clave: nuevaClave(), cantidad: 1, descuento_porcentaje: 0 });
      return copia;
    });
  }

  async function nuevaOrden({ confirmar = true } = {}) {
    // Descartar una orden armada exige motivo: queda en la bitácora y, si
    // el monto es alto, genera alerta (es la forma clásica de cobrar sin
    // facturar).
    let motivo = '';
    if (confirmar && carrito.length > 0) {
      motivo = pedirMotivo('¿Por qué se descarta esta orden? Los productos se van a perder.', MOTIVOS_DESCARTE);
      if (!motivo) return;
    }
    // Marca la orden como descartada ANTES de limpiar, para que un
    // autoguardado en cola no la resucite después de borrada.
    descartadaRef.current = true;
    const idAEliminar = ventaIdRef.current;
    fijarVentaId(null);
    setCarrito([]);
    setCliente(null);
    setNotaInterna('');
    setTerceraEdad({ nombre: '', identidad: '' });
    setResultadoFactura(null);
    setError('');
    if (idAEliminar) {
      await api.del(`/ventas/${idAEliminar}?motivo=${encodeURIComponent(motivo || 'Orden vacía')}`, session).catch(() => {});
    }
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
      if (detalle.estado !== 'abierta') {
        setError('Esa orden ya fue cobrada o descartada en otra caja.');
        abrirOrdenesAbiertas();
        return;
      }
      descartadaRef.current = false;
      fijarVentaId(detalle.id);
      setCliente(detalle.clientes?.es_consumidor_final ? null : detalle.clientes);
      setTerceraEdad({ nombre: detalle.tercera_edad_nombre ?? '', identidad: detalle.tercera_edad_identidad ?? '' });
      setCarrito(
        (detalle.detalle || []).map((d) => ({
          clave: nuevaClave(),
          descuento_porcentaje: Number(d.descuento_porcentaje ?? 0),
          producto_id: d.producto_id,
          nombre: d.nombre_producto,
          precio_unitario: Number(d.precio_unitario),
          impuesto_tasa: Number(d.impuesto_tasa),
          cantidad: Number(d.cantidad),
        }))
      );
      onCambiarSucursalId?.(detalle.sucursal_id);
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

  // Un solo toque: Efectivo y Tarjeta cobran de inmediato el total exacto.
  // "Más formas de pago" (dividir, transferencia, efectivo con cambio)
  // queda como opción secundaria.
  function pagoInstantaneo(forma) {
    if (cobroBloqueado) return;
    confirmarPago({
      pagos: [{ forma, monto: totales.total.toFixed(2) }],
      efectivo: forma === 'efectivo' ? totales.total : 0,
    });
  }

  async function imprimir(id, opciones) {
    try {
      await imprimirTicket(id, session, opciones);
    } catch (e) {
      setError(`La factura se emitió, pero no se pudo imprimir: ${e.message}`);
    }
  }

  async function confirmarPago({ pagos, efectivo }) {
    setGuardandoPago(true);
    setError('');
    try {
      // Siempre se espera la cola de autoguardado antes de cobrar, para que
      // el total facturado sea el mismo que ve el cajero.
      const idParaPagar = await guardarOrdenEnCola();
      if (!idParaPagar) throw new Error('No se pudo guardar la orden antes de cobrar');
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
      ultimaVentaRef.current = { cliente, carrito };
      setResultadoFactura(venta);
      setMostrarPago(false);
      setCarrito([]);
      setCliente(null);
      setNotaInterna('');
      setTerceraEdad({ nombre: '', identidad: '' });
      fijarVentaId(null);

      if (leerConfigImpresora().autoImprimir) imprimir(venta.id);
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardandoPago(false);
    }
  }

  const sucursalActual = sucursales.find((s) => s.id === sucursalId);

  return (
    <div className="pos-grid">
      {toast && <div className="pos-toast">{toast}</div>}

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
            <p style={{ marginTop: -6 }}>Cliente: {resultadoFactura.cliente_nombre || CONSUMIDOR_FINAL_NOMBRE}</p>
            <p>Cambio: {fmtL(resultadoFactura.cambio ?? 0)}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="boton-secundario boton-sm" style={{ flex: 1 }} onClick={() => imprimir(resultadoFactura.id, { reimpresion: true })}>
                🖨 Reimprimir ticket
              </button>
              <button
                className="boton-secundario boton-sm"
                style={{ flex: 1 }}
                onClick={() => verPdf(`/ventas/${resultadoFactura.id}/pdf`, session).catch((e) => setError(e.message))}
              >
                Ver PDF
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="boton-secundario" onClick={repetirUltimaVenta}>
                Repetir pedido
              </button>
              <button
                autoFocus
                onClick={() => {
                  setResultadoFactura(null);
                  buscadorRef.current?.focus();
                }}
              >
                Nueva orden
              </button>
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
          placeholder="Buscar por nombre, código o código de barras… (Enter agrega)"
          value={busquedaProducto}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            const exacto = buscarPorCodigo(productos, busquedaProducto);
            const producto = exacto ?? productosVisibles[0];
            if (producto) {
              agregarProducto(producto);
              setBusquedaProducto('');
            } else if (busquedaProducto.trim()) {
              mostrarToast(`"${busquedaProducto.trim()}" no encontrado`);
            }
          }}
          onChange={(e) => setBusquedaProducto(e.target.value)}
        />
        {cargandoCatalogo && <p style={{ color: 'var(--text-dim)' }}>Cargando catálogo…</p>}
        {!cargandoCatalogo && (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85em', marginTop: -6 }}>
            {productosVisibles.length} producto{productosVisibles.length === 1 ? '' : 's'} · el lector de código de barras funciona en cualquier momento
          </p>
        )}
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
        {sucursalActual && (
          <div className="pos-sucursal-banner" style={{ background: colorSucursal(sucursalId) }}>
            <span className="pos-sucursal-banner-corto">{nombreCortoSucursal(sucursalActual.nombre)}</span>
            <span className="pos-sucursal-banner-legal">{sucursalActual.nombre}</span>
          </div>
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

        <div style={{ maxHeight: '40vh', overflowY: 'auto' }}>
          {carrito.length === 0 && <p style={{ color: 'var(--text-dim)' }}>Sin productos todavía.</p>}
          {carrito.map((l) => {
            const bruto = l.precio_unitario * l.cantidad;
            const desc = descuentoDeLinea(l.precio_unitario, l.cantidad, l.descuento_porcentaje);
            return (
              <div key={l.clave} className={`pos-linea${l.descuento_porcentaje ? ' pos-linea-con-descuento' : ''}`}>
                <div className="pos-orden-linea">
                  <span>
                    {l.nombre}
                    <br />
                    <span style={{ color: 'var(--text-dim)' }}>
                      {fmtL(l.precio_unitario)} c/u ·{' '}
                      {desc > 0 ? (
                        <>
                          <s>{fmtL(bruto)}</s> <strong style={{ color: 'var(--ok)' }}>{fmtL(bruto - desc)}</strong>
                        </>
                      ) : (
                        fmtL(bruto)
                      )}
                    </span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button className="boton-secundario" onClick={() => cambiarCantidad(l.clave, -1)}>
                      −
                    </button>
                    <input
                      type="number"
                      value={l.cantidad}
                      onChange={(e) => establecerCantidad(l.clave, e.target.value)}
                      style={{ width: 44, textAlign: 'center', marginBottom: 0, padding: '4px' }}
                    />
                    <button className="boton-secundario" onClick={() => cambiarCantidad(l.clave, 1)}>
                      +
                    </button>
                    <button className="boton-secundario" title="Quitar" onClick={() => quitarLinea(l.clave)}>
                      🗑
                    </button>
                  </span>
                </div>
                <div className="pos-linea-descuento" role="radiogroup" aria-label={`Descuento de ${l.nombre}`}>
                  {OPCIONES_DESCUENTO.map((o) => (
                    <button
                      key={o.porcentaje}
                      role="radio"
                      aria-checked={(l.descuento_porcentaje ?? 0) === o.porcentaje}
                      className={`pos-chip-desc${(l.descuento_porcentaje ?? 0) === o.porcentaje ? ' activo' : ''}`}
                      onClick={() => fijarDescuentoLinea(l.clave, o.porcentaje)}
                    >
                      {o.corta}
                    </button>
                  ))}
                  {l.cantidad > 1 && (
                    <button className="pos-chip-desc pos-chip-separar" title="Separar una unidad para darle otro descuento" onClick={() => separarUnidad(l.clave)}>
                      ÷ Separar 1
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {hayTerceraEdad && (
          <div className={`pos-tercera-edad${faltaCarne ? ' incompleto' : ''}`}>
            <span className="pos-tercera-edad-titulo">Descuento 3ª edad — datos del carné</span>
            <input
              placeholder="Nombre completo"
              value={terceraEdad.nombre}
              onChange={(e) => setTerceraEdad((t) => ({ ...t, nombre: e.target.value }))}
            />
            <input
              placeholder="No. identidad / carné"
              inputMode="numeric"
              value={terceraEdad.identidad}
              onChange={(e) => setTerceraEdad((t) => ({ ...t, identidad: e.target.value }))}
            />
            {faltaCarne && <small>Obligatorio para cobrar con el 25%.</small>}
          </div>
        )}
        <input
          placeholder="Nota interna (no sale en la factura)"
          value={notaInterna}
          onChange={(e) => setNotaInterna(e.target.value)}
        />

        <div className="pos-totales-fila">
          <span>Sub-Total</span>
          <span>{fmtL(totales.subtotal_bruto)}</span>
        </div>
        {Object.entries(totales.descuentos_por_porcentaje).map(([pct, monto]) => (
          <div className="pos-totales-fila" key={pct}>
            <span>Descuento {pct}%{Number(pct) === 25 ? ' (3ra edad)' : ''}</span>
            <span>-{fmtL(monto)}</span>
          </div>
        ))}
        <div className="pos-totales-fila">
          <span>ISV incluido</span>
          <span>{fmtL(totales.isv_total)}</span>
        </div>
        <div className="pos-totales-fila total">
          <span>Total</span>
          <span>{fmtL(totales.total)}</span>
        </div>
        {requiereRtn && (
          <p style={{ color: 'var(--aviso)', fontSize: '0.82em' }}>
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
        </div>

        {/* Efectivo y Tarjeta en extremos opuestos con una separación ancha
            en medio: un toque mal apuntado cae en el espacio vacío, nunca en
            el botón de al lado. */}
        <div className="pos-botones-cobro">
          <button className="boton-cobro efectivo" disabled={cobroBloqueado} onClick={() => pagoInstantaneo('efectivo')}>
            <span className="boton-cobro-icono">💵</span>
            EFECTIVO
          </button>
          <span className="pos-cobro-separador" aria-hidden="true" />
          <button className="boton-cobro tarjeta" disabled={cobroBloqueado} onClick={() => pagoInstantaneo('tarjeta')}>
            <span className="boton-cobro-icono">💳</span>
            TARJETA
          </button>
        </div>
        {guardandoPago && <p className="pos-procesando">Procesando…</p>}
        <button
          className="boton-secundario boton-sm"
          style={{ marginTop: 10, width: '100%' }}
          disabled={carrito.length === 0 || carritoTieneLineasInvalidas || sinPuntoEmision}
          onClick={() => setMostrarPago(true)}
        >
          Más formas de pago (dividir, transferencia, cambio)
        </button>
      </div>
    </div>
  );
}
```

### `frontend/src/screens/PuntosEmision.jsx`

```jsx
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { colorSucursal, nombreCortoSucursal } from '../lib/coloresSucursal.js';

const CAI_VALIDO = /^[0-9A-F]{6}(-[0-9A-F]{6}){4}-[0-9A-F]{2}$/;

// Acepta el CAI pegado con o sin guiones/espacios (mismo criterio que el backend).
function normalizarCai(valor) {
  const texto = String(valor ?? '').toUpperCase().replace(/[\s-]/g, '');
  if (/^[0-9A-F]{32}$/.test(texto)) return texto.match(/.{1,6}/g).join('-');
  return String(valor ?? '').trim().toUpperCase();
}

function numero(form, correlativo) {
  return `${form.punto_emision_codigo}-${form.punto_venta_codigo}-${form.tipo_documento_codigo}-${String(correlativo || 0).padStart(8, '0')}`;
}

// Revisión en vivo del formulario, para que el botón diga exactamente qué
// falta en vez de fallar al guardar.
function problemas(form) {
  const p = [];
  if (!CAI_VALIDO.test(normalizarCai(form.cai))) p.push('CAI: 32 caracteres, formato XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XX');
  if (!/^\d{3}$/.test(form.punto_emision_codigo)) p.push('Establecimiento: 3 dígitos');
  if (!/^\d{3}$/.test(form.punto_venta_codigo)) p.push('Punto de emisión: 3 dígitos');
  if (!/^\d{2}$/.test(form.tipo_documento_codigo)) p.push('Tipo de documento: 2 dígitos');
  const desde = Number(form.correlativo_desde);
  const hasta = Number(form.correlativo_hasta);
  const actual = Number(form.correlativo_actual);
  if (!Number.isInteger(desde) || desde < 1) p.push('Rango desde: número mayor que 0');
  if (!Number.isInteger(hasta) || hasta < desde) p.push('Rango hasta: mayor o igual que "desde"');
  if (!Number.isInteger(actual) || actual < desde || actual > hasta) p.push('Próxima factura: dentro del rango');
  if (!form.fecha_limite_emision) p.push('Fecha límite de emisión');
  return p;
}

export default function PuntosEmision({ session, perfil }) {
  const [puntos, setPuntos] = useState([]);
  const [editando, setEditando] = useState(null); // { id, modo: 'activar' | 'editar' }
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setPuntos(await api.get('/puntos-emision/estado', session));
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
  }, []);

  function abrir(pe, modo) {
    setError('');
    setAviso('');
    setEditando({ id: pe.id, modo, nombre: pe.sucursales?.nombre ?? '' });
    setForm({
      // Al activar, el CAI de prueba no sirve: se pide el de la resolución del SAR.
      cai: modo === 'activar' ? '' : pe.cai ?? '',
      punto_emision_codigo: pe.punto_emision_codigo ?? '',
      punto_venta_codigo: pe.punto_venta_codigo ?? '',
      tipo_documento_codigo: pe.tipo_documento_codigo ?? '01',
      correlativo_desde: String(modo === 'activar' ? '' : pe.correlativo_desde),
      correlativo_hasta: String(modo === 'activar' ? '' : pe.correlativo_hasta),
      correlativo_actual: String(modo === 'activar' ? '' : pe.correlativo_actual),
      fecha_limite_emision: modo === 'activar' ? '' : pe.fecha_limite_emision ?? '',
    });
  }

  function cambiar(campo, valor) {
    setForm((f) => {
      const nuevo = { ...f, [campo]: valor };
      // Al activar, la primera factura real es el inicio del rango autorizado.
      if (editando?.modo === 'activar' && campo === 'correlativo_desde' && (f.correlativo_actual === '' || f.correlativo_actual === f.correlativo_desde)) {
        nuevo.correlativo_actual = valor;
      }
      return nuevo;
    });
  }

  async function guardar() {
    const cuerpo = {
      ...form,
      cai: normalizarCai(form.cai),
      correlativo_desde: Number(form.correlativo_desde),
      correlativo_hasta: Number(form.correlativo_hasta),
      correlativo_actual: Number(form.correlativo_actual),
      es_borrador: false,
    };
    if (editando.modo === 'activar') {
      const ok = window.confirm(
        [
          `ACTIVAR CAI REAL — ${editando.nombre}`,
          '',
          `CAI: ${cuerpo.cai}`,
          `Rango: ${numero(form, cuerpo.correlativo_desde)} a ${numero(form, cuerpo.correlativo_hasta)}`,
          `Primera factura: ${numero(form, cuerpo.correlativo_actual)}`,
          `Fecha límite: ${form.fecha_limite_emision}`,
          '',
          'Desde este momento las facturas de esta sucursal tienen validez fiscal ante el SAR.',
          '¿Los datos coinciden exactamente con la resolución?',
        ].join('\n')
      );
      if (!ok) return;
    } else if (!window.confirm('Vas a modificar datos fiscales del CAI. Queda registrado en la bitácora. ¿Continuar?')) {
      return;
    }
    setGuardando(true);
    setError('');
    try {
      await api.put(`/puntos-emision/${editando.id}`, session, cuerpo);
      setAviso(
        editando.modo === 'activar'
          ? `CAI real activado en ${nombreCortoSucursal(editando.nombre)}. La próxima factura será la ${numero(form, cuerpo.correlativo_actual)}.`
          : 'Cambios guardados.'
      );
      setEditando(null);
      cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function volverABorrador(pe) {
    const ok = window.confirm(
      `¿Volver ${pe.sucursales?.nombre} a MODO BORRADOR?\n\nLas facturas nuevas saldrán como "BORRADOR-…" sin validez fiscal. Úsalo sólo si activaste el CAI por error.`
    );
    if (!ok) return;
    try {
      await api.put(`/puntos-emision/${pe.id}`, session, { es_borrador: true });
      setAviso('Punto de emisión en modo borrador.');
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  const faltan = form ? problemas(form) : [];

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {aviso && <div className="alerta">{aviso}</div>}
      <div className="panel">
        <h2>Puntos de emisión (CAI)</h2>
        <p className="cai-ayuda">
          Mientras una sucursal está en <strong>modo borrador</strong>, sus facturas salen numeradas como
          «BORRADOR-…» y sin validez fiscal. Cuando el contador te entregue la resolución del SAR, usa
          <strong> Activar CAI real</strong> y copia los datos tal cual.
        </p>
        <div className="cai-lista">
          {puntos.map((pe) => (
            <div key={pe.id} className={`cai-tarjeta${pe.es_borrador ? ' cai-tarjeta-borrador' : ''}`} style={{ '--color-pe': colorSucursal(pe.sucursal_id) }}>
              <div className="cai-tarjeta-encabezado">
                <strong>{nombreCortoSucursal(pe.sucursales?.nombre ?? '')}</strong>
                <span className={`cai-estado ${pe.es_borrador ? 'cai-estado-borrador' : 'cai-estado-real'}`}>
                  {pe.es_borrador ? 'Modo borrador' : 'CAI real activo'}
                </span>
              </div>
              {pe.alerta && !pe.es_borrador && (
                <div className="alerta">
                  {pe.agotado && 'El rango de correlativos está agotado. '}
                  {pe.vencido && 'La fecha límite de emisión ya venció. '}
                  {!pe.agotado && !pe.vencido && `Quedan ${pe.dias_restantes ?? '?'} días o ${Math.round((100 - pe.porcentaje_usado) * 10) / 10}% del rango.`}
                </div>
              )}
              <dl className="cai-datos">
                <dt>CAI</dt>
                <dd className="cai-codigo">{pe.es_borrador ? 'de prueba' : pe.cai}</dd>
                <dt>Próxima factura</dt>
                <dd>
                  {pe.es_borrador && 'BORRADOR-'}
                  {numero(pe, pe.correlativo_actual)}
                </dd>
                {!pe.es_borrador && (
                  <>
                    <dt>Rango autorizado</dt>
                    <dd>
                      {pe.correlativo_desde} – {pe.correlativo_hasta} ({pe.porcentaje_usado}% usado)
                    </dd>
                    <dt>Fecha límite</dt>
                    <dd>{pe.fecha_limite_emision ?? 'sin definir'}</dd>
                  </>
                )}
              </dl>

              {perfil.rol === 'admin' && editando?.id !== pe.id && (
                <div className="cai-acciones">
                  {pe.es_borrador ? (
                    <button className="boton-sm" onClick={() => abrir(pe, 'activar')}>
                      Activar CAI real
                    </button>
                  ) : (
                    <>
                      <button className="boton-sm boton-secundario" onClick={() => abrir(pe, 'editar')}>
                        Editar
                      </button>
                      <button className="boton-sm boton-secundario" onClick={() => volverABorrador(pe)}>
                        Volver a borrador
                      </button>
                    </>
                  )}
                </div>
              )}

              {editando?.id === pe.id && form && (
                <div className="cai-form">
                  <h3>{editando.modo === 'activar' ? 'Datos de la resolución del SAR' : 'Editar CAI'}</h3>
                  <label className="cai-form-ancho">
                    CAI
                    <input
                      className="cai-codigo"
                      placeholder="XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XX"
                      autoCapitalize="characters"
                      value={form.cai}
                      onChange={(e) => cambiar('cai', e.target.value)}
                      onBlur={(e) => cambiar('cai', normalizarCai(e.target.value))}
                      autoFocus
                    />
                  </label>
                  <label>
                    Establecimiento
                    <input maxLength={3} inputMode="numeric" value={form.punto_emision_codigo} onChange={(e) => cambiar('punto_emision_codigo', e.target.value)} />
                  </label>
                  <label>
                    Punto de emisión
                    <input maxLength={3} inputMode="numeric" value={form.punto_venta_codigo} onChange={(e) => cambiar('punto_venta_codigo', e.target.value)} />
                  </label>
                  <label>
                    Tipo de documento
                    <input maxLength={2} inputMode="numeric" value={form.tipo_documento_codigo} onChange={(e) => cambiar('tipo_documento_codigo', e.target.value)} />
                  </label>
                  <label>
                    Rango desde
                    <input type="number" min="1" value={form.correlativo_desde} onChange={(e) => cambiar('correlativo_desde', e.target.value)} />
                  </label>
                  <label>
                    Rango hasta
                    <input type="number" min="1" value={form.correlativo_hasta} onChange={(e) => cambiar('correlativo_hasta', e.target.value)} />
                  </label>
                  <label>
                    Próxima factura
                    <input type="number" min="1" value={form.correlativo_actual} onChange={(e) => cambiar('correlativo_actual', e.target.value)} />
                  </label>
                  <label>
                    Fecha límite de emisión
                    <input type="date" value={form.fecha_limite_emision} onChange={(e) => cambiar('fecha_limite_emision', e.target.value)} />
                  </label>
                  {faltan.length === 0 ? (
                    <p className="cai-form-ancho cai-vista">
                      Rango: <strong>{numero(form, form.correlativo_desde)}</strong> a <strong>{numero(form, form.correlativo_hasta)}</strong>
                      <br />
                      Primera factura: <strong>{numero(form, form.correlativo_actual)}</strong>
                    </p>
                  ) : (
                    <ul className="cai-form-ancho cai-faltan">
                      {faltan.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  )}
                  <div className="cai-form-ancho cai-acciones">
                    <button className="boton-sm" disabled={faltan.length > 0 || guardando} onClick={guardar}>
                      {guardando ? 'Guardando…' : editando.modo === 'activar' ? 'Activar CAI real' : 'Guardar cambios'}
                    </button>
                    <button className="boton-sm boton-secundario" onClick={() => setEditando(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### `frontend/src/screens/Reportes.jsx`

```jsx
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { descargarCsv } from '../lib/csv.js';
import { ATAJOS_REPORTES, hoyHn, primerDiaMesHn } from '../lib/rangosFecha.js';
import { colorSucursal, nombreCortoSucursal } from '../lib/coloresSucursal.js';
import { registrarEvento } from '../lib/eventos.js';

const ZONA = 'America/Tegucigalpa';
const FILTROS_KEY = 'italo-facturacion:reportes:filtros:v2';
const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DIAS_CORTOS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const PESTANAS = [
  { id: 'resumen', etiqueta: 'Resumen' },
  { id: 'tiempo', etiqueta: 'Días y horas' },
  { id: 'equipo', etiqueta: 'Sucursales y cajeros' },
  { id: 'productos', etiqueta: 'Productos' },
  { id: 'pagos', etiqueta: 'Pagos y descuentos' },
  { id: 'fiscal', etiqueta: 'ISV / Fiscal' },
  { id: 'libro', etiqueta: 'Libro de ventas' },
  { id: 'anulaciones', etiqueta: 'Anulaciones' },
];

function L(n, decimales = 2) {
  const v = Math.abs(Number(n ?? 0)) < 0.005 ? 0 : Number(n ?? 0); // evita "L -0.00"
  return `L ${v.toLocaleString('es-HN', { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}`;
}

const num = (n) => Number(n ?? 0).toLocaleString('es-HN', { maximumFractionDigits: 2 });
const fechaCorta = (f) => new Date(`${f}T12:00:00Z`).toLocaleDateString('es-HN', { timeZone: 'UTC', day: '2-digit', month: 'short' });
const fechaHora = (iso) => new Date(iso).toLocaleString('es-HN', { timeZone: ZONA, dateStyle: 'short', timeStyle: 'short' });
const hora12 = (h) => `${((h + 11) % 12) + 1} ${h < 12 ? 'a. m.' : 'p. m.'}`;

function leerFiltros() {
  try {
    const f = JSON.parse(localStorage.getItem(FILTROS_KEY) ?? 'null');
    if (f?.fechaInicio && f?.fechaFin) return f;
  } catch {
    // almacenamiento no disponible
  }
  return { sucursal_id: '', fechaInicio: primerDiaMesHn(), fechaFin: hoyHn() };
}

function Variacion({ actual, anterior, invertir = false }) {
  if (anterior === undefined || anterior === null) return null;
  if (Number(anterior) === 0) return Number(actual) > 0 ? <span className="rep-var rep-var-neutra">nuevo</span> : null;
  const v = Math.round(((Number(actual) - Number(anterior)) / Math.abs(Number(anterior))) * 1000) / 10;
  const bueno = invertir ? v <= 0 : v >= 0;
  return (
    <span className={`rep-var ${bueno ? 'rep-var-buena' : 'rep-var-mala'}`} title={`Período anterior: ${num(anterior)}`}>
      {v >= 0 ? '▲' : '▼'} {Math.abs(v)}%
    </span>
  );
}

function Kpi({ titulo, valor, actual, anterior, invertir, detalle, dinero = true }) {
  return (
    <div className="rep-kpi">
      <span className="rep-kpi-titulo">{titulo}</span>
      <strong className="rep-kpi-valor">{dinero ? L(valor) : num(valor)}</strong>
      <span className="rep-kpi-pie">
        <Variacion actual={actual ?? valor} anterior={anterior} invertir={invertir} />
        {detalle && <span>{detalle}</span>}
      </span>
    </div>
  );
}

function Barra({ valor, maximo, color }) {
  const ancho = maximo > 0 ? Math.max(1.5, (valor / maximo) * 100) : 0;
  return (
    <span className="rep-barra">
      <span style={{ width: `${ancho}%`, background: color }} />
    </span>
  );
}

function Seccion({ titulo, children, onCsv, extra }) {
  return (
    <div className="panel rep-seccion">
      <div className="rep-seccion-titulo">
        <h2>{titulo}</h2>
        {extra}
        {onCsv && (
          <button className="boton-sm boton-secundario no-imprimir" onClick={onCsv}>
            CSV
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// Tabla con encabezados que ordenan al hacer clic.
function TablaOrdenable({ filas, columnas, ordenInicial, limite, vacio = 'Sin datos en este rango.' }) {
  const [orden, setOrden] = useState(ordenInicial ?? { clave: columnas[0].clave, desc: true });
  const ordenadas = useMemo(() => {
    const col = columnas.find((c) => c.clave === orden.clave);
    const valor = col?.ordenar ?? ((f) => f[orden.clave]);
    return [...filas].sort((a, b) => {
      const va = valor(a);
      const vb = valor(b);
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va ?? '').localeCompare(String(vb ?? ''), 'es');
      return orden.desc ? -cmp : cmp;
    });
  }, [filas, columnas, orden]);
  const visibles = limite ? ordenadas.slice(0, limite) : ordenadas;
  return (
    <div className="tabla-scroll">
      <table className="tabla rep-tabla">
        <thead>
          <tr>
            {columnas.map((c) => (
              <th
                key={c.clave}
                className={`${c.numerica ? 'rep-num' : ''} rep-ordenable`}
                onClick={() => setOrden((o) => ({ clave: c.clave, desc: o.clave === c.clave ? !o.desc : true }))}
              >
                {c.titulo}
                {orden.clave === c.clave && <span className="rep-flecha">{orden.desc ? '▾' : '▴'}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibles.length === 0 && (
            <tr>
              <td colSpan={columnas.length} className="rep-vacio">
                {vacio}
              </td>
            </tr>
          )}
          {visibles.map((f, i) => (
            <tr key={f.clave ?? i} className={f.claseFila}>
              {columnas.map((c) => (
                <td key={c.clave} className={c.numerica ? 'rep-num' : ''}>
                  {c.render ? c.render(f) : f[c.clave]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {limite && ordenadas.length > limite && <p className="rep-nota">Mostrando {limite} de {ordenadas.length}. El CSV trae todo.</p>}
    </div>
  );
}

function Hallazgos({ d }) {
  const lista = [];
  const mejorDia = [...d.por_dia].sort((a, b) => b.total - a.total)[0];
  if (mejorDia) lista.push(`Mejor día: ${DIAS[mejorDia.dia_semana]} ${fechaCorta(mejorDia.fecha)} con ${L(mejorDia.total)} (${mejorDia.facturas} facturas).`);
  const horaPico = [...d.por_hora].sort((a, b) => b.total - a.total)[0];
  if (horaPico?.total > 0) lista.push(`Hora pico: ${hora12(horaPico.hora)} a ${hora12((horaPico.hora + 1) % 24)} — ${L(horaPico.total)} en el período.`);
  const diaFuerte = [...d.por_dia_semana].filter((x) => x.dias > 0).sort((a, b) => b.promedio_dia - a.promedio_dia)[0];
  if (diaFuerte) lista.push(`El ${DIAS[diaFuerte.dia].toLowerCase()} es el día más fuerte: promedio ${L(diaFuerte.promedio_dia)} por día.`);
  const estrella = d.productos[0];
  if (estrella) lista.push(`Producto estrella: ${estrella.nombre} — ${L(estrella.total)} (${estrella.participacion}% de la venta).`);
  const lider = d.por_sucursal[0];
  if (lider && d.por_sucursal.length > 1) lista.push(`Sucursal líder: ${nombreCortoSucursal(lider.nombre)} con ${lider.participacion}% de la venta.`);
  const efectivo = d.por_forma_pago.find((f) => f.nombre === 'Efectivo');
  if (efectivo) lista.push(`El ${efectivo.participacion}% se cobró en efectivo (${L(efectivo.monto)} neto del cambio).`);
  if (d.kpis.anuladas > 0) lista.push(`${d.kpis.anuladas} factura(s) anulada(s) por ${L(d.kpis.monto_anulado)} — revísalas en la pestaña Anulaciones.`);
  if (d.isv.borrador.facturas > 0) {
    lista.push(`${d.isv.borrador.facturas} comprobante(s) en modo borrador (sin CAI real): no entran en la base del ISV fiscal.`);
  }
  if (lista.length === 0) return null;
  return (
    <ul className="rep-hallazgos">
      {lista.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

function MapaCalor({ calor }) {
  const max = Math.max(0, ...calor.flat());
  // Sólo las horas con movimiento en algún día (la gelatería no vende de madrugada).
  const horas = Array.from({ length: 24 }, (_, h) => h).filter((h) => calor.some((fila) => fila[h] > 0));
  if (horas.length === 0) return <p className="rep-vacio">Sin ventas en este rango.</p>;
  return (
    <div className="tabla-scroll">
      <table className="rep-calor">
        <thead>
          <tr>
            <th></th>
            {horas.map((h) => (
              <th key={h}>{hora12(h).replace(' ', ' ')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calor.map((fila, dia) => (
            <tr key={dia}>
              <th>{DIAS_CORTOS[dia]}</th>
              {horas.map((h) => {
                const intensidad = max > 0 ? fila[h] / max : 0;
                return (
                  <td
                    key={h}
                    title={`${DIAS[dia]} ${hora12(h)}: ${L(fila[h])}`}
                    style={{ background: `color-mix(in srgb, var(--color-sucursal) ${Math.round(intensidad * 100)}%, var(--navy-elevada))` }}
                  >
                    {fila[h] > 0 && intensidad > 0.45 ? Math.round(fila[h] / 1000) + 'k' : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="rep-nota">Más intenso = más venta. Sirve para decidir turnos y cuándo reforzar personal.</p>
    </div>
  );
}

function BloqueFiscal({ titulo, r, aviso }) {
  return (
    <div className="rep-fiscal">
      <h3>{titulo}</h3>
      {aviso && <p className="rep-nota">{aviso}</p>}
      <table className="tabla rep-tabla">
        <tbody>
          <tr>
            <td>Ventas exentas</td>
            <td className="rep-num">{L(r.exento)}</td>
          </tr>
          <tr>
            <td>Ventas exoneradas</td>
            <td className="rep-num">{L(r.exonerado)}</td>
          </tr>
          <tr>
            <td>Ventas gravadas 15% (base)</td>
            <td className="rep-num">{L(r.gravado_15)}</td>
          </tr>
          <tr>
            <td>ISV 15% facturado</td>
            <td className="rep-num">{L(r.isv)}</td>
          </tr>
          <tr>
            <td>(−) ISV de notas de crédito parciales ({L(r.notas_credito)})</td>
            <td className="rep-num">{L(-r.isv_notas_credito)}</td>
          </tr>
          <tr className="rep-fila-total">
            <td>ISV neto</td>
            <td className="rep-num">{L(r.isv_neto)}</td>
          </tr>
          <tr>
            <td>Facturas válidas / anuladas</td>
            <td className="rep-num">
              {r.facturas} / {r.anuladas}
            </td>
          </tr>
        </tbody>
      </table>
      {r.rangos.length > 0 && (
        <>
          <h4>Numeración emitida</h4>
          <div className="tabla-scroll">
          <table className="tabla rep-tabla">
            <thead>
              <tr>
                <th>Sucursal</th>
                <th>Desde</th>
                <th>Hasta</th>
                <th className="rep-num">Emitidas</th>
                <th className="rep-num">Anuladas</th>
                <th className="rep-num">Faltan</th>
              </tr>
            </thead>
            <tbody>
              {r.rangos.map((x) => (
                <tr key={x.sucursal + x.desde}>
                  <td>{nombreCortoSucursal(x.sucursal)}</td>
                  <td className="rep-mono">{x.desde}</td>
                  <td className="rep-mono">{x.hasta}</td>
                  <td className="rep-num">{x.emitidas}</td>
                  <td className="rep-num">{x.anuladas}</td>
                  <td className="rep-num" title="Números del rango que no aparecen en estas fechas">
                    {x.huecos > 0 ? <span className="rep-alerta">{x.huecos}</span> : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
      {r.por_mes.length > 1 && (
        <>
          <h4>Por mes</h4>
          <div className="tabla-scroll">
          <table className="tabla rep-tabla">
            <thead>
              <tr>
                <th>Mes</th>
                <th className="rep-num">Exento</th>
                <th className="rep-num">Exonerado</th>
                <th className="rep-num">Gravado 15%</th>
                <th className="rep-num">ISV</th>
                <th className="rep-num">Total</th>
              </tr>
            </thead>
            <tbody>
              {r.por_mes.map((m) => (
                <tr key={m.mes}>
                  <td>{m.mes}</td>
                  <td className="rep-num">{L(m.exento)}</td>
                  <td className="rep-num">{L(m.exonerado)}</td>
                  <td className="rep-num">{L(m.gravado_15)}</td>
                  <td className="rep-num">{L(m.isv)}</td>
                  <td className="rep-num">{L(m.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  );
}

export default function Reportes({ session, sucursales }) {
  const [filtros, setFiltros] = useState(leerFiltros);
  const [datos, setDatos] = useState(null);
  const [pestana, setPestana] = useState('resumen');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [buscarProducto, setBuscarProducto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [buscarLibro, setBuscarLibro] = useState('');
  const [soloFiscal, setSoloFiscal] = useState(false);

  async function generar(f = filtros) {
    if (!f.fechaInicio || !f.fechaFin) return setError('Elige fecha inicial y final');
    if (f.fechaFin < f.fechaInicio) return setError('La fecha final es anterior a la inicial');
    setError('');
    setCargando(true);
    try {
      localStorage.setItem(FILTROS_KEY, JSON.stringify(f));
    } catch {
      // no crítico
    }
    try {
      const params = new URLSearchParams({ fechaInicio: f.fechaInicio, fechaFin: f.fechaFin });
      if (f.sucursal_id) params.set('sucursal_id', f.sucursal_id);
      setDatos(await api.get(`/reportes/completo?${params.toString()}`, session));
      registrarEvento('reporte.generar', { desde: f.fechaInicio, hasta: f.fechaFin, sucursal: f.sucursal_id || 'todas' });
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    generar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function aplicarAtajo(a) {
    const f = { ...filtros, ...a.calcular() };
    setFiltros(f);
    generar(f);
  }

  const sufijo = `${filtros.fechaInicio}_a_${filtros.fechaFin}`;
  const nombreSucursal = filtros.sucursal_id
    ? nombreCortoSucursal(sucursales.find((s) => s.id === filtros.sucursal_id)?.nombre ?? '')
    : 'Todas las sucursales';

  const productosFiltrados = useMemo(() => {
    if (!datos) return [];
    const q = buscarProducto.trim().toLowerCase();
    return datos.productos
      .filter((p) => (!q || p.nombre.toLowerCase().includes(q)) && (!categoria || p.categoria === categoria))
      .map((p, i) => ({ ...p, clave: `${p.nombre}-${i}` }));
  }, [datos, buscarProducto, categoria]);

  const libroFiltrado = useMemo(() => {
    if (!datos) return [];
    const q = buscarLibro.trim().toLowerCase();
    return datos.libro_ventas
      .filter((f) => !soloFiscal || !f.borrador)
      .filter(
        (f) =>
          !q ||
          (f.numero_factura ?? '').toLowerCase().includes(q) ||
          f.cliente.toLowerCase().includes(q) ||
          (f.rtn ?? '').includes(q) ||
          f.cajero.toLowerCase().includes(q)
      )
      .map((f) => ({ ...f, clave: f.numero_factura, claseFila: f.anulada ? 'rep-anulada' : undefined }));
  }, [datos, buscarLibro, soloFiscal]);

  const k = datos?.kpis;
  const ka = datos?.kpis_anterior;
  const maxDia = datos ? Math.max(0, ...datos.por_dia.map((d) => d.total)) : 0;
  const maxHora = datos ? Math.max(0, ...datos.por_hora.map((h) => h.total)) : 0;
  const maxDiaSemana = datos ? Math.max(0, ...datos.por_dia_semana.map((d) => d.promedio_dia)) : 0;

  return (
    <div className="reportes">
      {error && <div className="error">{error}</div>}

      <div className="panel rep-filtros no-imprimir">
        <h2>Reportes</h2>
        <div className="toolbar">
          <select value={filtros.sucursal_id} onChange={(e) => setFiltros({ ...filtros, sucursal_id: e.target.value })}>
            <option value="">Todas las sucursales</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {nombreCortoSucursal(s.nombre)}
              </option>
            ))}
          </select>
          <label className="rep-fecha">
            Desde
            <input type="date" value={filtros.fechaInicio} max={hoyHn()} onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })} />
          </label>
          <label className="rep-fecha">
            Hasta
            <input type="date" value={filtros.fechaFin} max={hoyHn()} onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })} />
          </label>
          <button className="boton-sm" onClick={() => generar()} disabled={cargando}>
            {cargando ? 'Generando…' : 'Generar'}
          </button>
          <button className="boton-sm boton-secundario" onClick={() => window.print()} disabled={!datos}>
            Imprimir / PDF
          </button>
        </div>
        <div className="rep-atajos">
          {ATAJOS_REPORTES.map((a) => (
            <button key={a.etiqueta} className="boton-sm boton-secundario" onClick={() => aplicarAtajo(a)} disabled={cargando}>
              {a.etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="rep-encabezado-impresion">
        <strong>Italo Gelateria — Reporte de ventas</strong>
        <span>
          {nombreSucursal} · {filtros.fechaInicio} a {filtros.fechaFin}
        </span>
      </div>

      {datos && (
        <>
          <div className="rep-pestanas no-imprimir" role="tablist">
            {PESTANAS.map((p) => (
              <button key={p.id} role="tab" aria-selected={pestana === p.id} className={pestana === p.id ? 'activa' : ''} onClick={() => setPestana(p.id)}>
                {p.etiqueta}
                {p.id === 'anulaciones' && k.anuladas + datos.notas_credito.length > 0 && (
                  <span className="rep-contador">{k.anuladas + datos.notas_credito.filter((n) => n.tipo === 'Parcial').length}</span>
                )}
              </button>
            ))}
          </div>

          {pestana === 'resumen' && (
            <>
              <div className="rep-kpis">
                <Kpi titulo="Ventas netas" valor={k.ventas_netas} anterior={ka.ventas_netas} detalle={`vs. ${datos.rango_anterior.desde} a ${datos.rango_anterior.hasta}`} />
                <Kpi titulo="Facturas" valor={k.facturas} anterior={ka.facturas} dinero={false} />
                <Kpi titulo="Ticket promedio" valor={k.ticket_promedio} anterior={ka.ticket_promedio} />
                <Kpi titulo="Unidades vendidas" valor={k.unidades} anterior={ka.unidades} dinero={false} />
                <Kpi titulo="Ventas brutas" valor={k.ventas_brutas} anterior={ka.ventas_brutas} detalle="antes de descuentos" />
                <Kpi titulo="Descuentos" valor={k.descuentos} anterior={ka.descuentos} invertir />
                <Kpi titulo="Notas de crédito" valor={k.notas_credito} anterior={ka.notas_credito} invertir detalle="parciales" />
                <Kpi titulo="ISV facturado" valor={k.isv} anterior={ka.isv} />
                <Kpi titulo="Gastos caja chica" valor={datos.gastos.total} detalle={`${datos.gastos.movimientos} movimientos`} />
                <Kpi titulo="Ventas netas − gastos" valor={k.ventas_netas - datos.gastos.total} />
              </div>
              <Seccion titulo="Hallazgos del período">
                <Hallazgos d={datos} />
              </Seccion>
              <Seccion
                titulo="Ventas por día"
                onCsv={() =>
                  descargarCsv(`ventas-por-dia-${sufijo}.csv`, datos.por_dia, [
                    { titulo: 'Fecha', valor: (d) => d.fecha },
                    { titulo: 'Día', valor: (d) => DIAS[d.dia_semana] },
                    { titulo: 'Facturas', valor: (d) => d.facturas },
                    { titulo: 'Total', valor: (d) => d.total.toFixed(2) },
                    { titulo: 'Ticket promedio', valor: (d) => d.ticket_promedio.toFixed(2) },
                    { titulo: 'Descuentos', valor: (d) => d.descuentos.toFixed(2) },
                  ])
                }
              >
                <div className="rep-barras-dia">
                  {datos.por_dia.map((d) => (
                    <div key={d.fecha} className={`rep-dia${d.dia_semana >= 5 ? ' rep-dia-finde' : ''}`} title={`${DIAS[d.dia_semana]} ${d.fecha}: ${L(d.total)} · ${d.facturas} facturas`}>
                      <span className="rep-dia-columna">
                        <span style={{ height: `${maxDia > 0 ? Math.max(2, (d.total / maxDia) * 100) : 0}%` }} />
                      </span>
                      <span className="rep-dia-etiqueta">{d.fecha.slice(8)}</span>
                    </div>
                  ))}
                  {datos.por_dia.length === 0 && <p className="rep-vacio">Sin ventas en este rango.</p>}
                </div>
              </Seccion>
            </>
          )}

          {pestana === 'tiempo' && (
            <>
              <Seccion titulo="Mapa de calor: día de la semana × hora">
                <MapaCalor calor={datos.calor} />
              </Seccion>
              <div className="rep-dos-columnas">
                <Seccion
                  titulo="Por hora"
                  onCsv={() =>
                    descargarCsv(`ventas-por-hora-${sufijo}.csv`, datos.por_hora, [
                      { titulo: 'Hora', valor: (h) => `${h.hora}:00` },
                      { titulo: 'Facturas', valor: (h) => h.facturas },
                      { titulo: 'Total', valor: (h) => h.total.toFixed(2) },
                    ])
                  }
                >
                  <table className="tabla rep-tabla">
                    <tbody>
                      {datos.por_hora
                        .filter((h) => h.facturas > 0)
                        .map((h) => (
                          <tr key={h.hora}>
                            <td className="rep-col-etiqueta">{hora12(h.hora)}</td>
                            <td className="rep-col-barra">
                              <Barra valor={h.total} maximo={maxHora} color="var(--color-sucursal)" />
                            </td>
                            <td className="rep-num">{L(h.total, 0)}</td>
                            <td className="rep-num rep-tenue">{h.facturas}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </Seccion>
                <Seccion titulo="Por día de la semana (promedio por día)">
                  <table className="tabla rep-tabla">
                    <tbody>
                      {datos.por_dia_semana.map((d) => (
                        <tr key={d.dia}>
                          <td className="rep-col-etiqueta">{DIAS[d.dia]}</td>
                          <td className="rep-col-barra">
                            <Barra valor={d.promedio_dia} maximo={maxDiaSemana} color="var(--gold)" />
                          </td>
                          <td className="rep-num">{L(d.promedio_dia, 0)}</td>
                          <td className="rep-num rep-tenue">{d.dias} día(s)</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Seccion>
              </div>
              <Seccion titulo="Detalle diario">
                <TablaOrdenable
                  filas={datos.por_dia.map((d) => ({ ...d, clave: d.fecha }))}
                  ordenInicial={{ clave: 'fecha', desc: false }}
                  columnas={[
                    { clave: 'fecha', titulo: 'Fecha', render: (d) => `${DIAS_CORTOS[d.dia_semana]} ${d.fecha}` },
                    { clave: 'facturas', titulo: 'Facturas', numerica: true },
                    { clave: 'ticket_promedio', titulo: 'Ticket', numerica: true, render: (d) => L(d.ticket_promedio) },
                    { clave: 'descuentos', titulo: 'Descuentos', numerica: true, render: (d) => L(d.descuentos) },
                    { clave: 'total', titulo: 'Total', numerica: true, render: (d) => L(d.total) },
                  ]}
                />
              </Seccion>
            </>
          )}

          {pestana === 'equipo' && (
            <>
              <Seccion
                titulo="Por sucursal"
                onCsv={() =>
                  descargarCsv(`ventas-por-sucursal-${sufijo}.csv`, datos.por_sucursal, [
                    { titulo: 'Sucursal', valor: (s) => s.nombre },
                    { titulo: 'Facturas', valor: (s) => s.facturas },
                    { titulo: 'Total', valor: (s) => s.total.toFixed(2) },
                    { titulo: 'Participación %', valor: (s) => s.participacion },
                    { titulo: 'Ticket promedio', valor: (s) => s.ticket_promedio.toFixed(2) },
                    { titulo: 'Descuentos', valor: (s) => s.descuentos.toFixed(2) },
                    { titulo: 'Anuladas', valor: (s) => s.anuladas },
                    { titulo: 'Monto anulado', valor: (s) => s.monto_anulado.toFixed(2) },
                  ])
                }
              >
                <TablaOrdenable
                  filas={datos.por_sucursal.map((s) => ({ ...s, clave: s.sucursal_id }))}
                  ordenInicial={{ clave: 'total', desc: true }}
                  columnas={[
                    {
                      clave: 'nombre',
                      titulo: 'Sucursal',
                      render: (s) => (
                        <span className="rep-sucursal">
                          <span className="leyenda-punto" style={{ background: colorSucursal(s.sucursal_id) }} />
                          {nombreCortoSucursal(s.nombre)}
                        </span>
                      ),
                    },
                    { clave: 'participacion', titulo: 'Participación', render: (s) => <span className="rep-part"><Barra valor={s.participacion} maximo={100} color={colorSucursal(s.sucursal_id)} />{s.participacion}%</span> },
                    { clave: 'facturas', titulo: 'Facturas', numerica: true },
                    { clave: 'ticket_promedio', titulo: 'Ticket', numerica: true, render: (s) => L(s.ticket_promedio) },
                    { clave: 'descuentos', titulo: 'Descuentos', numerica: true, render: (s) => L(s.descuentos) },
                    { clave: 'anuladas', titulo: 'Anuladas', numerica: true },
                    { clave: 'total', titulo: 'Total', numerica: true, render: (s) => L(s.total) },
                  ]}
                />
              </Seccion>
              <Seccion
                titulo="Por cajero"
                onCsv={() =>
                  descargarCsv(`ventas-por-cajero-${sufijo}.csv`, datos.por_cajero, [
                    { titulo: 'Cajero', valor: (c) => c.nombre },
                    { titulo: 'Facturas', valor: (c) => c.facturas },
                    { titulo: 'Total', valor: (c) => c.total.toFixed(2) },
                    { titulo: 'Ticket promedio', valor: (c) => c.ticket_promedio.toFixed(2) },
                    { titulo: 'Facturas con descuento', valor: (c) => c.con_descuento },
                    { titulo: 'Monto descuentos', valor: (c) => c.descuentos.toFixed(2) },
                    { titulo: 'Anuladas', valor: (c) => c.anuladas },
                  ])
                }
              >
                <TablaOrdenable
                  filas={datos.por_cajero.map((c, i) => ({ ...c, clave: `${c.nombre}-${i}` }))}
                  ordenInicial={{ clave: 'total', desc: true }}
                  columnas={[
                    { clave: 'nombre', titulo: 'Cajero' },
                    { clave: 'facturas', titulo: 'Facturas', numerica: true },
                    { clave: 'ticket_promedio', titulo: 'Ticket', numerica: true, render: (c) => L(c.ticket_promedio) },
                    {
                      clave: 'con_descuento',
                      titulo: 'Con descuento',
                      numerica: true,
                      render: (c) => `${c.con_descuento} (${c.facturas ? Math.round((c.con_descuento / c.facturas) * 100) : 0}%)`,
                    },
                    { clave: 'descuentos', titulo: 'Descuentos', numerica: true, render: (c) => L(c.descuentos) },
                    { clave: 'anuladas', titulo: 'Anuladas', numerica: true, render: (c) => (c.anuladas > 0 ? <span className="rep-alerta">{c.anuladas}</span> : 0) },
                    { clave: 'total', titulo: 'Total', numerica: true, render: (c) => L(c.total) },
                  ]}
                />
                <p className="rep-nota">Un cajero con muchos descuentos o anulaciones frente a los demás merece una revisión en la Bitácora.</p>
              </Seccion>
              {datos.clientes.length > 0 && (
                <Seccion
                  titulo="Clientes con factura a nombre (sin Consumidor Final)"
                  onCsv={() =>
                    descargarCsv(`clientes-${sufijo}.csv`, datos.clientes, [
                      { titulo: 'Cliente', valor: (c) => c.nombre },
                      { titulo: 'RTN', valor: (c) => c.rtn },
                      { titulo: 'Facturas', valor: (c) => c.facturas },
                      { titulo: 'Total', valor: (c) => c.total.toFixed(2) },
                    ])
                  }
                >
                  <TablaOrdenable
                    filas={datos.clientes.map((c, i) => ({ ...c, clave: `${c.nombre}-${i}` }))}
                    ordenInicial={{ clave: 'total', desc: true }}
                    columnas={[
                      { clave: 'nombre', titulo: 'Cliente' },
                      { clave: 'rtn', titulo: 'RTN', render: (c) => <span className="rep-mono">{c.rtn || '—'}</span> },
                      { clave: 'facturas', titulo: 'Facturas', numerica: true },
                      { clave: 'ultima', titulo: 'Última compra', render: (c) => fechaHora(c.ultima) },
                      { clave: 'total', titulo: 'Total', numerica: true, render: (c) => L(c.total) },
                    ]}
                  />
                </Seccion>
              )}
            </>
          )}

          {pestana === 'productos' && (
            <>
              <Seccion
                titulo="Por categoría"
                onCsv={() =>
                  descargarCsv(`ventas-por-categoria-${sufijo}.csv`, datos.por_categoria, [
                    { titulo: 'Categoría', valor: (c) => c.nombre },
                    { titulo: 'Unidades', valor: (c) => c.cantidad },
                    { titulo: 'Total', valor: (c) => c.total.toFixed(2) },
                    { titulo: 'Participación %', valor: (c) => c.participacion },
                  ])
                }
              >
                <table className="tabla rep-tabla">
                  <tbody>
                    {datos.por_categoria.map((c, i) => (
                      <tr key={c.nombre} className={categoria === c.nombre ? 'rep-seleccionada' : ''} onClick={() => setCategoria(categoria === c.nombre ? '' : c.nombre)} style={{ cursor: 'pointer' }}>
                        <td className="rep-col-etiqueta">{c.nombre}</td>
                        <td className="rep-col-barra">
                          <Barra valor={c.participacion} maximo={datos.por_categoria[0]?.participacion ?? 100} color={`var(--serie-${(i % 4) + 1})`} />
                        </td>
                        <td className="rep-num">{c.participacion}%</td>
                        <td className="rep-num rep-tenue">{num(c.cantidad)} u.</td>
                        <td className="rep-num">{L(c.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="rep-nota no-imprimir">Toca una categoría para filtrar los productos de abajo.</p>
              </Seccion>
              <Seccion
                titulo={`Productos${categoria ? ` · ${categoria}` : ''} (${productosFiltrados.length})`}
                extra={
                  <input className="rep-buscar no-imprimir" placeholder="Buscar producto…" value={buscarProducto} onChange={(e) => setBuscarProducto(e.target.value)} />
                }
                onCsv={() =>
                  descargarCsv(`productos-${sufijo}.csv`, productosFiltrados, [
                    { titulo: 'Producto', valor: (p) => p.nombre },
                    { titulo: 'Categoría', valor: (p) => p.categoria },
                    { titulo: 'Unidades', valor: (p) => p.cantidad },
                    { titulo: 'Facturas', valor: (p) => p.facturas },
                    { titulo: 'Precio promedio', valor: (p) => p.precio_promedio.toFixed(2) },
                    { titulo: 'Total', valor: (p) => p.total.toFixed(2) },
                    { titulo: 'Participación %', valor: (p) => p.participacion },
                  ])
                }
              >
                <TablaOrdenable
                  filas={productosFiltrados}
                  limite={100}
                  ordenInicial={{ clave: 'total', desc: true }}
                  columnas={[
                    { clave: 'nombre', titulo: 'Producto' },
                    { clave: 'categoria', titulo: 'Categoría' },
                    { clave: 'cantidad', titulo: 'Unidades', numerica: true, render: (p) => num(p.cantidad) },
                    { clave: 'facturas', titulo: 'Facturas', numerica: true },
                    { clave: 'precio_promedio', titulo: 'Precio prom.', numerica: true, render: (p) => L(p.precio_promedio) },
                    { clave: 'participacion', titulo: '% venta', numerica: true, render: (p) => `${p.participacion}%` },
                    { clave: 'total', titulo: 'Total', numerica: true, render: (p) => L(p.total) },
                  ]}
                />
                <p className="rep-nota">El precio promedio ya incluye los descuentos aplicados. Útil para comparar contra el costeo.</p>
              </Seccion>
            </>
          )}

          {pestana === 'pagos' && (
            <div className="rep-dos-columnas">
              <Seccion
                titulo="Formas de pago"
                onCsv={() =>
                  descargarCsv(`formas-de-pago-${sufijo}.csv`, datos.por_forma_pago, [
                    { titulo: 'Forma', valor: (f) => f.nombre },
                    { titulo: 'Monto', valor: (f) => f.monto.toFixed(2) },
                    { titulo: 'Facturas', valor: (f) => f.facturas },
                    { titulo: 'Participación %', valor: (f) => f.participacion },
                  ])
                }
              >
                <table className="tabla rep-tabla">
                  <tbody>
                    {datos.por_forma_pago.map((f, i) => (
                      <tr key={f.nombre}>
                        <td className="rep-col-etiqueta">{f.nombre}</td>
                        <td className="rep-col-barra">
                          <Barra valor={f.participacion} maximo={100} color={`var(--serie-${(i % 4) + 1})`} />
                        </td>
                        <td className="rep-num">{f.participacion}%</td>
                        <td className="rep-num rep-tenue">{f.facturas} fact.</td>
                        <td className="rep-num">{L(f.monto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="rep-nota">Efectivo neto del cambio devuelto. Tarjeta incluye POS BAC y POS Ficohsa (el detalle por POS está en cada cierre de caja).</p>
              </Seccion>
              <Seccion titulo="Descuentos">
                <table className="tabla rep-tabla">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th className="rep-num">Facturas</th>
                      <th className="rep-num">Descontado</th>
                      <th className="rep-num">Vendido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datos.descuentos.length === 0 && (
                      <tr>
                        <td colSpan={4} className="rep-vacio">
                          Sin descuentos en este rango.
                        </td>
                      </tr>
                    )}
                    {datos.descuentos.map((d) => (
                      <tr key={d.porcentaje}>
                        <td>{d.porcentaje === 25 ? '25% tercera edad' : d.porcentaje ? `${d.porcentaje}%` : 'Otro'}</td>
                        <td className="rep-num">{d.facturas}</td>
                        <td className="rep-num">{L(d.monto)}</td>
                        <td className="rep-num">{L(d.ventas)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="rep-nota">
                  Los descuentos equivalen al {k.ventas_brutas > 0 ? Math.round((k.descuentos / k.ventas_brutas) * 1000) / 10 : 0}% de la venta bruta.
                </p>
              </Seccion>
              {datos.gastos_por_tipo.length > 0 && (
                <Seccion titulo="Gastos de caja chica">
                  <table className="tabla rep-tabla">
                    <tbody>
                      {datos.gastos_por_tipo.map((g) => (
                        <tr key={g.tipo}>
                          <td>{g.tipo}</td>
                          <td className="rep-num rep-tenue">{g.movimientos}</td>
                          <td className="rep-num">{L(g.monto)}</td>
                        </tr>
                      ))}
                      <tr className="rep-fila-total">
                        <td>Total</td>
                        <td></td>
                        <td className="rep-num">{L(datos.gastos.total)}</td>
                      </tr>
                    </tbody>
                  </table>
                </Seccion>
              )}
            </div>
          )}

          {pestana === 'fiscal' && (
            <Seccion
              titulo="ISV — base para la declaración"
              onCsv={() =>
                descargarCsv(`isv-${sufijo}.csv`, [
                  { tipo: 'Fiscal (CAI real)', ...datos.isv.fiscal },
                  { tipo: 'Borrador (sin CAI)', ...datos.isv.borrador },
                ], [
                  { titulo: 'Tipo', valor: (r) => r.tipo },
                  { titulo: 'Exento', valor: (r) => r.exento.toFixed(2) },
                  { titulo: 'Exonerado', valor: (r) => r.exonerado.toFixed(2) },
                  { titulo: 'Gravado 15%', valor: (r) => r.gravado_15.toFixed(2) },
                  { titulo: 'ISV facturado', valor: (r) => r.isv.toFixed(2) },
                  { titulo: 'ISV notas de crédito', valor: (r) => r.isv_notas_credito.toFixed(2) },
                  { titulo: 'ISV neto', valor: (r) => r.isv_neto.toFixed(2) },
                  { titulo: 'Facturas', valor: (r) => r.facturas },
                  { titulo: 'Anuladas', valor: (r) => r.anuladas },
                ])
              }
            >
              <div className="rep-dos-columnas">
                <BloqueFiscal titulo="Facturas fiscales (CAI real)" r={datos.isv.fiscal} />
                <BloqueFiscal
                  titulo="Comprobantes en modo borrador"
                  r={datos.isv.borrador}
                  aviso="Emitidos sin CAI real: no son facturas fiscales. Coméntalos con el contador antes de declarar."
                />
              </div>
              <p className="rep-nota">
                Base de trabajo para el contador: no incluye compras (crédito fiscal). Las notas de crédito se cuentan en el período en que se emitieron.
              </p>
            </Seccion>
          )}

          {pestana === 'libro' && (
            <Seccion
              titulo={`Libro de ventas (${libroFiltrado.length})`}
              extra={
                <span className="rep-controles no-imprimir">
                  <label className="rep-check">
                    <input type="checkbox" checked={soloFiscal} onChange={(e) => setSoloFiscal(e.target.checked)} />
                    Sólo fiscales
                  </label>
                  <input className="rep-buscar" placeholder="Factura, cliente, RTN o cajero…" value={buscarLibro} onChange={(e) => setBuscarLibro(e.target.value)} />
                </span>
              }
              onCsv={() =>
                descargarCsv(`libro-de-ventas-${sufijo}.csv`, libroFiltrado, [
                  { titulo: 'Fecha', valor: (f) => fechaHora(f.fecha) },
                  { titulo: 'Factura', valor: (f) => f.numero_factura },
                  { titulo: 'Sucursal', valor: (f) => f.sucursal },
                  { titulo: 'Cliente', valor: (f) => f.cliente },
                  { titulo: 'RTN', valor: (f) => f.rtn },
                  { titulo: 'Exento', valor: (f) => (f.anulada ? 0 : f.exento).toFixed(2) },
                  { titulo: 'Exonerado', valor: (f) => (f.anulada ? 0 : f.exonerado).toFixed(2) },
                  { titulo: 'Gravado 15%', valor: (f) => (f.anulada ? 0 : f.gravado_15).toFixed(2) },
                  { titulo: 'ISV', valor: (f) => (f.anulada ? 0 : f.isv).toFixed(2) },
                  { titulo: 'Descuento', valor: (f) => f.descuento.toFixed(2) },
                  { titulo: 'Total', valor: (f) => (f.anulada ? 0 : f.total).toFixed(2) },
                  { titulo: 'Estado', valor: (f) => (f.anulada ? 'ANULADA' : 'Válida') },
                  { titulo: 'Tipo', valor: (f) => (f.borrador ? 'Borrador' : 'Fiscal') },
                  { titulo: 'Cajero', valor: (f) => f.cajero },
                ])
              }
            >
              <TablaOrdenable
                filas={libroFiltrado}
                limite={300}
                ordenInicial={{ clave: 'numero_factura', desc: false }}
                columnas={[
                  { clave: 'fecha', titulo: 'Fecha', render: (f) => fechaHora(f.fecha) },
                  { clave: 'numero_factura', titulo: 'Factura', render: (f) => <span className="rep-mono">{f.numero_factura}</span> },
                  { clave: 'sucursal', titulo: 'Sucursal', render: (f) => nombreCortoSucursal(f.sucursal) },
                  { clave: 'cliente', titulo: 'Cliente', render: (f) => (f.rtn ? `${f.cliente} · ${f.rtn}` : f.cliente) },
                  { clave: 'gravado_15', titulo: 'Gravado', numerica: true, render: (f) => L(f.gravado_15) },
                  { clave: 'isv', titulo: 'ISV', numerica: true, render: (f) => L(f.isv) },
                  { clave: 'total', titulo: 'Total', numerica: true, render: (f) => L(f.total) },
                  { clave: 'anulada', titulo: 'Estado', ordenar: (f) => (f.anulada ? 1 : 0), render: (f) => (f.anulada ? <span className="rep-alerta">Anulada</span> : f.borrador ? 'Borrador' : 'Válida') },
                ]}
              />
            </Seccion>
          )}

          {pestana === 'anulaciones' && (
            <>
              <Seccion
                titulo={`Facturas anuladas (${datos.anuladas.length})`}
                onCsv={() =>
                  descargarCsv(`anuladas-${sufijo}.csv`, datos.anuladas, [
                    { titulo: 'Factura', valor: (a) => a.numero_factura },
                    { titulo: 'Fecha', valor: (a) => fechaHora(a.fecha) },
                    { titulo: 'Sucursal', valor: (a) => a.sucursal },
                    { titulo: 'Cliente', valor: (a) => a.cliente },
                    { titulo: 'Cajero', valor: (a) => a.cajero },
                    { titulo: 'Total', valor: (a) => a.total.toFixed(2) },
                  ])
                }
              >
                <TablaOrdenable
                  filas={datos.anuladas.map((a) => ({ ...a, clave: a.numero_factura }))}
                  ordenInicial={{ clave: 'fecha', desc: true }}
                  vacio="Ninguna factura anulada en este rango."
                  columnas={[
                    { clave: 'numero_factura', titulo: 'Factura', render: (a) => <span className="rep-mono">{a.numero_factura}</span> },
                    { clave: 'fecha', titulo: 'Emitida', render: (a) => fechaHora(a.fecha) },
                    { clave: 'sucursal', titulo: 'Sucursal', render: (a) => nombreCortoSucursal(a.sucursal) },
                    { clave: 'cliente', titulo: 'Cliente' },
                    { clave: 'cajero', titulo: 'Cajero' },
                    { clave: 'total', titulo: 'Total', numerica: true, render: (a) => L(a.total) },
                  ]}
                />
              </Seccion>
              <Seccion
                titulo={`Notas de crédito emitidas (${datos.notas_credito.length})`}
                onCsv={() =>
                  descargarCsv(`notas-de-credito-${sufijo}.csv`, datos.notas_credito, [
                    { titulo: 'Nota', valor: (x) => x.numero_nota },
                    { titulo: 'Factura', valor: (x) => x.numero_factura },
                    { titulo: 'Fecha', valor: (x) => fechaHora(x.fecha) },
                    { titulo: 'Tipo', valor: (x) => x.tipo },
                    { titulo: 'Monto', valor: (x) => x.monto.toFixed(2) },
                    { titulo: 'Motivo', valor: (x) => x.motivo },
                    { titulo: 'Usuario', valor: (x) => x.usuario },
                  ])
                }
              >
                <TablaOrdenable
                  filas={datos.notas_credito.map((x, i) => ({ ...x, clave: `${x.numero_nota}-${i}` }))}
                  ordenInicial={{ clave: 'fecha', desc: true }}
                  vacio="Ninguna nota de crédito en este rango."
                  columnas={[
                    { clave: 'fecha', titulo: 'Fecha', render: (x) => fechaHora(x.fecha) },
                    { clave: 'numero_factura', titulo: 'Factura', render: (x) => <span className="rep-mono">{x.numero_factura}</span> },
                    { clave: 'tipo', titulo: 'Tipo' },
                    { clave: 'motivo', titulo: 'Motivo' },
                    { clave: 'usuario', titulo: 'Autorizó' },
                    { clave: 'monto', titulo: 'Monto', numerica: true, render: (x) => L(x.monto) },
                  ]}
                />
              </Seccion>
            </>
          )}
        </>
      )}

      {!datos && cargando && <div className="panel rep-vacio">Generando reporte…</div>}
    </div>
  );
}
```

### `frontend/src/screens/Sucursales.jsx`

```jsx
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { colorLibre, colorSucursal, nombreCortoSucursal, PALETA_SUCURSALES } from '../lib/coloresSucursal.js';

// Muestras de la paleta: las que ya usa otra sucursal quedan bloqueadas,
// porque el color existe justamente para no confundir una con otra.
function SelectorColor({ valor, onCambiar, sucursales, excepto }) {
  return (
    <div className="selector-color" role="radiogroup" aria-label="Color de la sucursal">
      {PALETA_SUCURSALES.map((p) => {
        const duena = sucursales.find((s) => s.id !== excepto && s.color?.toLowerCase() === p.color.toLowerCase());
        const elegido = valor?.toLowerCase() === p.color.toLowerCase();
        return (
          <button
            key={p.color}
            type="button"
            role="radio"
            aria-checked={elegido}
            className={`muestra-color ${elegido ? 'elegida' : ''}`}
            style={{ background: p.color }}
            disabled={!!duena}
            title={duena ? `${p.nombre} — ya lo usa ${nombreCortoSucursal(duena.nombre)}` : p.nombre}
            onClick={() => onCambiar(p.color)}
          >
            {elegido ? '✓' : duena ? '·' : ''}
          </button>
        );
      })}
    </div>
  );
}

export default function Sucursales({ session, sucursales, onCreada }) {
  const [form, setForm] = useState({ nombre: '', alias: '', direccion: '', color: '' });
  const [error, setError] = useState('');
  const [ultimaCreada, setUltimaCreada] = useState(null);
  const [estadosCai, setEstadosCai] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formEdicion, setFormEdicion] = useState({ nombre: '', direccion: '', color: '' });

  useEffect(() => {
    api
      .get('/puntos-emision/estado', session)
      .then(setEstadosCai)
      .catch(() => {});
  }, []);

  function estadoCaiDe(sucursalId) {
    return estadosCai.find((e) => e.sucursal_id === sucursalId);
  }

  const colorNueva = form.color || colorLibre(sucursales);

  async function crear() {
    setError('');
    try {
      const sucursal = await api.post('/sucursales', session, { ...form, color: colorNueva });
      setUltimaCreada(sucursal);
      setForm({ nombre: '', alias: '', direccion: '', color: '' });
      onCreada?.();
    } catch (e) {
      setError(e.message);
    }
  }

  function editar(s) {
    setEditandoId(s.id);
    setFormEdicion({ nombre: s.nombre, direccion: s.direccion, color: s.color ?? colorSucursal(s.id) });
  }

  async function guardarEdicion() {
    setError('');
    try {
      await api.put(`/sucursales/${editandoId}`, session, { ...formEdicion, activo: true });
      setEditandoId(null);
      onCreada?.();
    } catch (e) {
      setError(e.message);
    }
  }

  async function desactivar(s) {
    if (
      !window.confirm(
        `¿Desactivar "${s.nombre}"? Deja de aparecer para facturar y en los selectores del sistema. No borra sus facturas ni su historial.`
      )
    ) {
      return;
    }
    try {
      await api.put(`/sucursales/${s.id}`, session, { nombre: s.nombre, direccion: s.direccion, activo: false });
      onCreada?.();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="panel">
        <h2>Sucursales</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9em', marginTop: -8 }}>
          Cada sucursal tiene su propio color: pinta la barra superior, la franja lateral y los títulos de toda la
          app mientras se trabaja en ella. Dos sucursales nunca pueden tener el mismo.
        </p>
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Alias</th>
              <th>Dirección</th>
              <th>CAI</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sucursales.map((s) => {
              const estado = estadoCaiDe(s.id);
              if (editandoId === s.id) {
                return (
                  <tr key={s.id}>
                    <td colSpan={3}>
                      <div className="toolbar" style={{ marginBottom: 8 }}>
                        <input
                          style={{ marginBottom: 0 }}
                          value={formEdicion.nombre}
                          onChange={(e) => setFormEdicion({ ...formEdicion, nombre: e.target.value })}
                        />
                        <input
                          style={{ marginBottom: 0 }}
                          value={formEdicion.direccion}
                          onChange={(e) => setFormEdicion({ ...formEdicion, direccion: e.target.value })}
                        />
                      </div>
                      <SelectorColor
                        valor={formEdicion.color}
                        onCambiar={(color) => setFormEdicion({ ...formEdicion, color })}
                        sucursales={sucursales}
                        excepto={s.id}
                      />
                    </td>
                    <td></td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button className="boton-sm" onClick={guardarEdicion}>
                        Guardar
                      </button>{' '}
                      <button className="boton-sm boton-secundario" onClick={() => setEditandoId(null)}>
                        Cancelar
                      </button>
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={s.id}>
                  <td>
                    <span className="muestra-fila" style={{ background: colorSucursal(s.id) }} />
                    <strong>{nombreCortoSucursal(s.nombre)}</strong>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8em', marginLeft: 22 }}>{s.nombre}</div>
                  </td>
                  <td>{s.alias}</td>
                  <td>{s.direccion}</td>
                  <td>
                    {estado?.es_borrador && <span className="badge-borrador">Borrador</span>}
                    {estado && !estado.es_borrador && !estado.alerta && (
                      <span className="chip" style={{ color: 'var(--ok)', borderColor: 'var(--ok)' }}>
                        Activo
                      </span>
                    )}
                    {estado && !estado.es_borrador && estado.alerta && (
                      <span className="chip" style={{ color: 'var(--aviso)', borderColor: 'var(--aviso)' }}>
                        Por vencer/agotarse
                      </span>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="boton-sm boton-secundario" onClick={() => editar(s)}>
                      Editar / color
                    </button>{' '}
                    <button className="boton-sm boton-secundario" onClick={() => desactivar(s)}>
                      Desactivar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h2>Nueva sucursal</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9em' }}>
          Se crea con su propio punto de emisión en modo borrador (sin CAI todavía) — lo activas
          después desde "CAI / Puntos de emisión" en cuanto tengas el rango real del SAR.
        </p>
        <div className="toolbar">
          <input
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <input
            placeholder="Alias corto (ej. bulevar)"
            value={form.alias}
            onChange={(e) => setForm({ ...form, alias: e.target.value })}
          />
          <input
            placeholder="Dirección"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
        </div>
        <div style={{ fontSize: '0.85em', color: 'var(--text-dim)', marginBottom: 6 }}>Color</div>
        <SelectorColor valor={colorNueva} onCambiar={(color) => setForm({ ...form, color })} sucursales={sucursales} />
        <button
          className="boton-sm"
          style={{ marginTop: 12 }}
          disabled={!form.nombre || !form.alias || !form.direccion}
          onClick={crear}
        >
          Crear sucursal
        </button>
        {ultimaCreada && (
          <div className="alerta" style={{ marginTop: 12 }}>
            Sucursal "{ultimaCreada.nombre}" creada con punto de emisión{' '}
            {ultimaCreada.punto_emision.punto_emision_codigo} en modo borrador.
          </div>
        )}
      </div>
    </div>
  );
}
```

### `frontend/src/screens/Usuarios.jsx`

```jsx
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { colorSucursal } from '../lib/coloresSucursal.js';

// Cajeros que no usan correo entran con un nombre de usuario libre
// (ej. "María López", "caja 2"). Sin mínimo de contraseña: decisión de Juan.
// La traducción a lo que pide Supabase la hace backend/lib/acceso.js.

const VACIO = {
  acceso: '',
  password: '',
  nombre: '',
  rol: 'cajero',
  sucursal_id: '',
  cierre_ciego: false,
  sin_horario: false,
};

export default function Usuarios({ session, sucursales }) {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [rolFiltro, setRolFiltro] = useState('');
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [creando, setCreando] = useState(false);

  const usuariosVisibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return usuarios.filter((u) => {
      const coincideTexto = !q || u.nombre.toLowerCase().includes(q) || (u.acceso ?? '').toLowerCase().includes(q);
      const coincideRol = !rolFiltro || u.rol === rolFiltro;
      return coincideTexto && coincideRol;
    });
  }, [usuarios, busqueda, rolFiltro]);

  async function cargar() {
    setUsuarios(await api.get('/usuarios', session));
  }

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
  }, []);

  async function crear() {
    setError('');
    setCreando(true);
    try {
      await api.post('/usuarios', session, {
        ...form,
        acceso: form.acceso.trim(),
        sucursal_id: form.sucursal_id || null,
      });
      setForm(VACIO);
      cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setCreando(false);
    }
  }

  async function actualizar(u, cambios) {
    if (cambios.activo === false) {
      if (!window.confirm(`¿Desactivar a ${u.nombre}? No va a poder entrar al sistema hasta que lo vuelvas a activar.`)) {
        return;
      }
    }
    await api.put(`/usuarios/${u.id}`, session, { ...u, ...cambios, sucursal_id: u.sucursal_id ?? null });
    cargar();
  }

  async function restablecerContrasena(u) {
    const nueva = window.prompt(`Nueva contraseña para ${u.nombre} `);
    if (!nueva) return;
    try {
      await api.post(`/usuarios/${u.id}/reset-password`, session, { password: nueva });
      window.alert('Contraseña actualizada.');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="panel">
        <h2>Nuevo usuario</h2>
        <div className="toolbar">
          <input
            placeholder="Usuario (ej. María López) o correo"
            autoCapitalize="none"
            value={form.acceso}
            onChange={(e) => setForm({ ...form, acceso: e.target.value })}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
            <option value="cajero">Cajero</option>
            <option value="manager">Manager</option>
            <option value="admin">Administrador</option>
          </select>
          <select value={form.sucursal_id} onChange={(e) => setForm({ ...form, sucursal_id: e.target.value })}>
            <option value="">Todas las sucursales</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-dim)' }}>
            <input
              type="checkbox"
              style={{ width: 'auto' }}
              checked={form.cierre_ciego}
              onChange={(e) => setForm({ ...form, cierre_ciego: e.target.checked })}
            />
            Cierre ciego
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-dim)' }}>
            <input
              type="checkbox"
              style={{ width: 'auto' }}
              checked={form.sin_horario}
              onChange={(e) => setForm({ ...form, sin_horario: e.target.checked })}
            />
            Sin horario
          </label>
          <button
            className="boton-sm"
            disabled={
              creando || !form.acceso.trim() || !form.password || !form.nombre.trim()
            }
            onClick={crear}
          >
            {creando ? 'Creando…' : 'Crear usuario'}
          </button>
        </div>
        {form.acceso.trim() && (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85em', marginTop: -4 }}>
            Entrará escribiendo <strong style={{ color: 'var(--text)' }}>{form.acceso.trim().replace(/\s+/g, ' ')}</strong> y su
            contraseña. En el usuario no importan mayúsculas ni tildes; en la contraseña sí.
          </p>
        )}
      </div>

      <div className="panel">
        <h2>Usuarios</h2>
        <div className="toolbar">
          <input placeholder="Buscar por nombre o usuario…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <select value={rolFiltro} onChange={(e) => setRolFiltro(e.target.value)}>
            <option value="">Todos los roles</option>
            <option value="cajero">Cajero</option>
            <option value="manager">Manager</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario / correo</th>
              <th>Rol</th>
              <th>Sucursal</th>
              <th>Cierre ciego</th>
              <th>Activo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {usuariosVisibles.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td style={{ color: 'var(--text-dim)', fontSize: '0.9em' }}>{u.acceso ?? '—'}</td>
                <td>{u.rol}</td>
                <td>
                  {u.sucursal_id && (
                    <span
                      className="leyenda-punto"
                      style={{ background: colorSucursal(u.sucursal_id), display: 'inline-block', marginRight: 6 }}
                    />
                  )}
                  {u.sucursales?.nombre ?? 'Todas'}
                </td>
                <td>{u.cierre_ciego ? 'Sí' : 'No'}</td>
                <td>{u.activo ? 'Sí' : 'No'}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button
                    className="boton-sm boton-secundario"
                    onClick={() => actualizar(u, { activo: !u.activo })}
                  >
                    {u.activo ? 'Desactivar' : 'Activar'}
                  </button>{' '}
                  <button className="boton-sm boton-secundario" onClick={() => restablecerContrasena(u)}>
                    Contraseña
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
```

## Frontend: estilos

### `frontend/src/index.css`

```css
:root {
  color-scheme: light;
  /* Paleta "Ítalo Moderno" — derivada del BrandBook (verde salvia #C5D288,
     verde profundo #3E5A34, negro). Los nombres --navy* se conservan por
     compatibilidad con las reglas existentes:
       --navy          fondo de la página
       --navy-panel    tarjetas y paneles
       --navy-elevada  filas, chips y zonas hundidas dentro de un panel */
  --navy: #f2f4ee;
  --navy-panel: #ffffff;
  --navy-elevada: #f5f7f1;
  --campo: #ffffff;
  --terracota: #2f5d3a;
  --terracota-claro: #3d7449;
  --primario: #2f5d3a;
  --primario-hover: #264c30;
  --primario-suave: #e7efdc;
  --salvia: #c5d288;
  --gold: #8a6a12;
  --text: #1a1f16;
  --text-dim: #687062;
  --border: #e3e7dc;
  --color-sucursal: var(--primario);
  --color-sucursal-texto: color-mix(in srgb, var(--color-sucursal) 62%, #10140e);
  --texto-sobre-color: #10140e;
  --ok: #1d7a45;
  --ok-fondo: #e3f3e7;
  --peligro: #b3261e;
  --peligro-fondo: #fce7e4;
  --aviso: #8a5a00;
  --aviso-fondo: #fdf1d6;
  --info: #1f6096;
  --info-fondo: #e3eef9;
  --sidebar: #141a12;
  --sidebar-borde: #232b20;
  --sidebar-texto: #b9c2af;
  --sidebar-titulo: #6f7a66;
  --sidebar-activo: rgba(197, 210, 136, 0.13);

  /* Paleta categórica del dashboard — 4 slots, orden fijo. */
  --serie-1: #c5603c; /* terracota — igual a --terracota */
  --serie-2: #2e9e8f; /* verde-azulado */
  --serie-3: #b08d28; /* dorado (paso oscuro) */
  --serie-4: #6c7fd6; /* azul-violeta */

  --radio: 14px;
  --radio-chico: 9px;
  --sombra-suave: 0 1px 2px rgba(16, 24, 12, 0.06);
  --sombra: 0 1px 2px rgba(16, 24, 12, 0.04), 0 8px 24px rgba(16, 24, 12, 0.06);
  --sombra-flotante: 0 18px 48px rgba(16, 24, 12, 0.18);
  --veloz: 0.14s ease;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--navy);
  color: var(--text);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: 'Barlow Condensed', sans-serif;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

/* Scrollbar consistente con el tema (Chrome/Edge/Safari + Firefox). */
* {
  scrollbar-color: var(--border) transparent;
  scrollbar-width: thin;
}

*::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 999px;
}

*::-webkit-scrollbar-thumb:hover {
  background: var(--text-dim);
}

:focus-visible {
  outline: 2px solid var(--color-sucursal);
  outline-offset: 2px;
}

.pantalla {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.tarjeta {
  background: var(--navy-panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 32px;
  width: 100%;
  max-width: 380px;
  box-shadow: var(--sombra-flotante);
  animation: aparecer-tarjeta 0.18s ease;
}

.tarjeta h1 {
  color: var(--terracota);
  margin-top: 0;
}

@keyframes aparecer-tarjeta {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

input, textarea {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 12px;
  border-radius: var(--radio-chico);
  border: 1px solid var(--border);
  background: var(--campo);
  color: var(--text);
  transition: border-color var(--veloz), box-shadow var(--veloz);
}

input:hover, textarea:hover {
  border-color: #cdb88a;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--color-sucursal);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-sucursal) 25%, transparent);
}

input::placeholder, textarea::placeholder {
  color: var(--text-dim);
}

button {
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radio-chico);
  border: none;
  background: var(--terracota);
  color: white;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--sombra-suave);
  transition: filter var(--veloz), box-shadow var(--veloz), transform 0.08s ease, background-color var(--veloz),
    border-color var(--veloz), opacity var(--veloz);
}

button:hover:not(:disabled) {
  filter: brightness(1.08);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
}

button:active:not(:disabled) {
  transform: scale(0.97);
  filter: brightness(0.96);
  box-shadow: var(--sombra-suave);
}

button:disabled {
  opacity: 0.5;
  cursor: default;
  box-shadow: none;
}

.error {
  color: var(--peligro);
  background: var(--peligro-fondo);
  border: 1px solid rgba(179, 38, 30, 0.35);
  border-radius: var(--radio-chico);
  padding: 8px 12px;
  font-size: 0.9em;
  margin-bottom: 12px;
  animation: aparecer 0.15s ease;
}

@keyframes aparecer {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.chip {
  display: inline-block;
  border: 1px solid var(--gold);
  color: var(--gold);
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 0.8em;
  margin-top: 8px;
  transition: background-color var(--veloz);
}

/* ── Layout general de la app (una vez logueado) ─────────────────────── */

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
  background: var(--navy-panel);
  border-bottom: 3px solid var(--color-sucursal);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  overflow-x: auto;
  transition: border-color 0.25s ease;
}

.nav .marca {
  color: var(--terracota);
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  margin-right: 12px;
  white-space: nowrap;
}

.nav button {
  width: auto;
  background: transparent;
  color: var(--text-dim);
  padding: 8px 14px;
  white-space: nowrap;
  box-shadow: none;
}

.nav button:hover:not(:disabled):not(.activo) {
  color: var(--text);
  filter: none;
  background: rgba(60, 40, 10, 0.06);
}

.nav button.activo {
  background: var(--navy);
  color: var(--color-sucursal-texto);
}

.nav button.activo:hover {
  filter: none;
}

.nav .salir {
  margin-left: auto;
  background: transparent;
  color: var(--text-dim);
  width: auto;
}

/* ── Indicador "En vivo" (sincronización en tiempo real) ─────────────── */

.nav-vivo {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78em;
  color: var(--text-dim);
  white-space: nowrap;
  margin-left: auto;
  padding: 0 10px;
}

.nav-vivo-punto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b8ab8f;
}

.nav-vivo.conectado .nav-vivo-punto {
  background: #2e9e5e;
  box-shadow: 0 0 0 0 rgba(62, 207, 142, 0.6);
  animation: latido 2s infinite;
}

.nav-vivo.conectado {
  color: var(--ok);
}

.nav .nav-vivo + .salir {
  margin-left: 0;
}

@keyframes latido {
  0% {
    box-shadow: 0 0 0 0 rgba(62, 207, 142, 0.55);
  }
  70% {
    box-shadow: 0 0 0 7px rgba(62, 207, 142, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(62, 207, 142, 0);
  }
}

/* ── Indicador de sucursal en la barra de navegación ─────────────────── */

.nav-sucursal {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-right: 10px;
  padding: 5px 10px 5px 8px;
  background: var(--navy);
  border: 1px solid var(--border);
  border-radius: 999px;
  white-space: nowrap;
}

.nav-sucursal-punto {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--color-sucursal);
  flex-shrink: 0;
  transition: background-color 0.25s ease;
}

.nav-sucursal-nombre {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-size: 0.92em;
  color: var(--text);
}

.nav-sucursal-select {
  width: auto;
  margin-bottom: 0;
  padding: 2px 6px;
  border: none;
  background: transparent;
  color: var(--text);
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-size: 0.92em;
  cursor: pointer;
}

.nav-sucursal-select:focus {
  box-shadow: none;
  outline: 2px solid var(--color-sucursal);
  outline-offset: 2px;
  border-radius: 4px;
}

.contenido {
  flex: 1;
  padding: 16px;
}

.panel {
  background: var(--navy-panel);
  border: 1px solid var(--border);
  border-radius: var(--radio);
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: var(--sombra);
  animation: aparecer 0.2s ease;
}

.panel h2 {
  margin-top: 0;
  color: var(--terracota);
}

.toolbar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
  align-items: center;
}

.toolbar input, .toolbar select {
  width: auto;
  margin-bottom: 0;
  min-width: 160px;
}

.boton-sm {
  width: auto;
  padding: 6px 12px;
  font-size: 0.85em;
  box-shadow: none;
}

.boton-secundario {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
  box-shadow: none;
}

.boton-secundario:hover:not(:disabled) {
  border-color: var(--color-sucursal);
  background: rgba(60, 40, 10, 0.05);
  filter: none;
}

.boton-peligro {
  background: var(--peligro);
}

select {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 12px;
  border-radius: var(--radio-chico);
  border: 1px solid var(--border);
  background: var(--campo);
  color: var(--text);
  transition: border-color var(--veloz), box-shadow var(--veloz);
}

select:hover {
  border-color: #cdb88a;
}

table.tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92em;
}

table.tabla th, table.tabla td {
  text-align: left;
  padding: 9px 10px;
  border-bottom: 1px solid var(--border);
}

table.tabla th {
  color: var(--text-dim);
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.8em;
}

table.tabla tbody tr {
  transition: background-color var(--veloz);
}

table.tabla tbody tr:hover {
  background: rgba(60, 40, 10, 0.04);
}

.alerta {
  background: var(--aviso-fondo);
  border: 1px solid #d9b554;
  color: var(--aviso);
  border-radius: var(--radio-chico);
  padding: 10px 14px;
  margin-bottom: 12px;
  animation: aparecer 0.15s ease;
}

.badge-borrador {
  display: inline-block;
  background: var(--peligro-fondo);
  color: var(--peligro);
  border: 1px solid var(--peligro);
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 0.75em;
  font-weight: 600;
  margin-bottom: 8px;
}

.pos-toast {
  position: fixed;
  top: 16px;
  right: 16px;
  background: var(--terracota);
  color: white;
  padding: 9px 16px;
  border-radius: var(--radio-chico);
  z-index: 50;
  font-size: 0.9em;
  font-weight: 600;
  box-shadow: var(--sombra-flotante);
  animation: entra-toast 0.2s ease;
}

@keyframes entra-toast {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.pos-sucursal-banner {
  color: #fff;
  font-weight: 700;
  padding: 11px 12px;
  border-radius: var(--radio-chico);
  margin-bottom: 10px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.2em;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  text-align: center;
  box-shadow: var(--sombra-suave);
  transition: background-color 0.25s ease;
}

/* ── POS ──────────────────────────────────────────────────────────────── */

.pos-grid {
  display: grid;
  grid-template-columns: 160px 1fr 340px;
  gap: 12px;
  height: calc(100vh - 64px);
}

@media (max-width: 900px) {
  .pos-grid {
    grid-template-columns: 1fr;
    height: auto;
  }
}

.pos-panel {
  background: var(--navy-panel);
  border: 1px solid var(--border);
  border-radius: var(--radio);
  padding: 12px;
  overflow-y: auto;
  box-shadow: var(--sombra);
}

.pos-categoria {
  width: 100%;
  margin-bottom: 6px;
  background: var(--navy);
  color: var(--text);
  border: 1px solid var(--border);
  text-align: left;
  box-shadow: none;
}

.pos-categoria:hover:not(.activa) {
  border-color: var(--terracota-claro);
  filter: none;
}

.pos-categoria.activa {
  background: var(--terracota);
  color: white;
  border-color: var(--terracota);
}

.pos-productos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
  align-content: start;
}

.pos-producto {
  background: var(--navy);
  border: 1px solid var(--border);
  border-radius: var(--radio-chico);
  padding: 12px 8px;
  text-align: center;
  color: var(--text);
  height: 80px;
  box-shadow: var(--sombra-suave);
  transition: border-color var(--veloz), transform 0.1s ease, box-shadow var(--veloz), background-color var(--veloz);
}

.pos-producto:hover {
  border-color: var(--terracota);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  filter: none;
}

.pos-producto:active {
  transform: translateY(0) scale(0.96);
  background: var(--navy-elevada);
}

.pos-producto strong {
  display: block;
  font-size: 0.85em;
  margin-bottom: 6px;
}

.pos-orden-linea {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  padding: 7px 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.9em;
  animation: aparecer 0.15s ease;
}

.pos-orden-linea button {
  width: 24px;
  height: 24px;
  padding: 0;
  font-size: 0.8em;
  border-radius: 6px;
}

.pos-totales-fila {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  margin: 4px 0;
  color: var(--text-dim);
}

.pos-totales-fila.total {
  color: var(--text);
  font-size: 1.2em;
  font-weight: 700;
  border-top: 1px solid var(--border);
  padding-top: 8px;
  margin-top: 8px;
}

.pos-acciones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 10px;
}

/* ── Código de barras editable en la tabla del catálogo ──────────────── */

.celda-codigo-barras {
  display: flex;
  align-items: center;
  gap: 6px;
}

.celda-codigo-barras input {
  width: 150px;
  margin: 0;
  padding: 5px 8px;
  font-family: monospace;
  font-size: 0.9em;
  background: transparent;
  border-color: transparent;
}

.celda-codigo-barras input:hover {
  border-color: var(--border);
}

.celda-codigo-barras input:focus {
  background: var(--navy);
}

.celda-estado {
  font-size: 0.85em;
  color: var(--text-dim);
}

.celda-estado.ok {
  color: var(--ok);
}

/* ── Conversión cotización → factura ─────────────────────────────────── */

.resumen-conversion {
  background: var(--navy);
  border: 1px solid var(--border);
  border-radius: var(--radio-chico);
  padding: 10px 12px;
  margin-bottom: 12px;
}

.resumen-conversion div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 3px 0;
  font-size: 0.9em;
}

.resumen-conversion div span {
  color: var(--text-dim);
}

.resumen-conversion div.total {
  border-top: 1px solid var(--border);
  margin-top: 6px;
  padding-top: 8px;
  font-size: 1.05em;
}

.sucursal-emisora {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 0.9em;
  color: var(--text-dim);
}

.sucursal-emisora strong {
  color: var(--text);
}

.aviso-ok {
  background: var(--ok-fondo);
  border: 1px solid rgba(62, 207, 142, 0.45);
  color: var(--ok);
  border-radius: var(--radio-chico);
  padding: 9px 12px;
  margin-bottom: 12px;
  cursor: pointer;
  animation: aparecer 0.15s ease;
}

/* ── Bitácora, impresora y controles segmentados ─────────────────────── */

.sello-integridad {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.85em;
  font-weight: 600;
  border: 1px solid var(--border);
  color: var(--text-dim);
  white-space: nowrap;
}

.sello-integridad.ok {
  border-color: rgba(62, 207, 142, 0.5);
  background: var(--ok-fondo);
  color: var(--ok);
}

.sello-integridad.alterada {
  border-color: var(--peligro);
  background: var(--peligro-fondo);
  color: var(--peligro);
}

table.tabla tbody tr.fila-sensible td:first-child {
  box-shadow: inset 3px 0 0 var(--gold);
}

.opciones-segmentadas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.opciones-segmentadas button {
  width: auto;
  flex: 1 1 110px;
  background: var(--navy);
  border: 1px solid var(--border);
  color: var(--text-dim);
  box-shadow: none;
}

.opciones-segmentadas button.activo {
  border-color: var(--color-sucursal);
  color: var(--text);
  background: color-mix(in srgb, var(--color-sucursal) 16%, var(--navy));
}

.interruptor {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  cursor: pointer;
}

.interruptor input {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: var(--color-sucursal);
}

.pasos {
  padding-left: 20px;
  line-height: 1.55;
}

.pasos li {
  margin-bottom: 12px;
}

.codigo-copiable {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 8px 10px;
  background: var(--navy);
  border: 1px solid var(--border);
  border-radius: var(--radio-chico);
}

.codigo-copiable code {
  flex: 1;
  font-size: 0.82em;
  color: var(--gold);
  word-break: break-all;
}

/* ── Botones de cobro directo (Efectivo/Tarjeta) ─────────────────────── */

/* Separación ancha y una línea divisoria en medio: un dedo que se desvía
   cae en el espacio vacío, nunca en el botón de al lado. */
.pos-botones-cobro {
  display: grid;
  grid-template-columns: 1fr 44px 1fr;
  align-items: stretch;
  margin-top: 12px;
}

.pos-cobro-separador {
  justify-self: center;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--border) 20%, var(--border) 80%, transparent);
}

.pos-cliente-actual {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 2px 0 8px;
}

.pos-descuentos {
  display: grid;
  grid-template-columns: 1fr 0.7fr 1.3fr;
  gap: 6px;
  margin: 10px 0 8px;
}

.pos-descuento {
  padding: 8px 6px;
  font-size: 0.82em;
  background: var(--navy);
  border: 1px solid var(--border);
  color: var(--text-dim);
  box-shadow: none;
}

.pos-descuento:hover:not(:disabled):not(.activo) {
  filter: none;
  border-color: var(--gold);
  color: var(--text);
}

.pos-descuento.activo {
  background: var(--aviso-fondo);
  border-color: var(--gold);
  color: var(--gold);
}

.pos-nota-descuento {
  color: var(--gold);
  font-size: 0.8em;
  margin: -2px 0 8px;
}

.orden-abierta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  text-align: left;
  margin-bottom: 6px;
  background: var(--navy);
  border: 1px solid var(--border);
  color: var(--text);
  box-shadow: none;
}

.orden-abierta:hover:not(:disabled) {
  border-color: var(--color-sucursal);
  filter: none;
}

.boton-cobro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 8px;
  font-size: 1.05em;
  font-family: 'Barlow Condensed', sans-serif;
  letter-spacing: 0.03em;
  border-radius: var(--radio);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}

.boton-cobro-icono {
  font-size: 1.6em;
  line-height: 1;
}

/* Ambos extremos del degradado verificados en contraste WCAG AA sobre
   texto blanco (>= 4.5:1: 5.38:1 y 10.36:1 para el verde, 5.02:1 y 9.27:1
   para el azul) — un degradado con el extremo claro por debajo de 4.5:1
   se ve bien pero deja de ser accesible en esa franja del botón. */
.boton-cobro.efectivo {
  background: linear-gradient(160deg, #1a7a42, #0f4a26);
}

.boton-cobro.tarjeta {
  background: linear-gradient(160deg, #2c72b5, #1a4a72);
}

.boton-cobro:hover:not(:disabled) {
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.45);
  transform: translateY(-1px);
}

.boton-cobro:active:not(:disabled) {
  transform: translateY(0) scale(0.97);
}

.pos-procesando {
  text-align: center;
  color: var(--text-dim);
  font-size: 0.85em;
  margin-top: 6px;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 16px;
  animation: aparecer-fondo 0.15s ease;
}

.overlay .tarjeta {
  max-height: calc(100vh - 32px);
  overflow-y: auto;
}

@keyframes aparecer-fondo {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ── Dashboard: KPIs y gráficas ───────────────────────────────────────── */

.kpi-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.kpi-tile {
  background: var(--navy);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 16px;
  box-shadow: var(--sombra-suave);
  transition: border-color var(--veloz), transform var(--veloz);
}

.kpi-tile:hover {
  border-color: var(--terracota);
  transform: translateY(-2px);
}

.kpi-tile .kpi-label {
  font-size: 0.78em;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.kpi-tile .kpi-valor {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.8em;
  font-weight: 700;
  margin-top: 4px;
}

.leyenda {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  font-size: 0.85em;
  color: var(--text-dim);
}

.leyenda-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.leyenda-punto {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 2px rgba(60, 40, 10, 0.08);
}

.barra-h-fila {
  display: grid;
  grid-template-columns: 140px 1fr 90px;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 0.9em;
}

.barra-h-etiqueta {
  color: var(--text-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.barra-h-pista {
  background: var(--navy);
  border-radius: 4px;
  height: 14px;
  overflow: hidden;
}

.barra-h-relleno {
  display: block;
  height: 100%;
  border-radius: 4px;
  min-width: 4px;
}

.barra-h-valor {
  text-align: right;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.barras-verticales {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 160px;
  padding-top: 20px;
}

.barra-v-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  min-width: 0;
}

.barra-v-valor {
  font-size: 0.72em;
  color: var(--text-dim);
  margin-bottom: 4px;
  white-space: nowrap;
}

.barra-v-relleno {
  width: 100%;
  border-radius: 3px 3px 0 0;
  min-height: 2px;
}

.barra-v-etiqueta {
  font-size: 0.7em;
  color: var(--text-dim);
  margin-top: 6px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.dos-columnas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 900px) {
  .dos-columnas {
    grid-template-columns: 1fr;
  }
}

/* ═════════════════════════════════════════════════════════════════════════
   Identidad de la sucursal activa en TODA la interfaz
   ─────────────────────────────────────────────────────────────────────────
   --color-sucursal lo pone App.jsx en .app-shell. Al cambiar de sucursal
   cambia todo esto a la vez: franja lateral, halo de fondo, barra superior,
   bordes de paneles y modales, títulos, encabezados de tablas, categoría
   activa, total del POS, avisos y scrollbar. Sobre un relleno del color de
   la sucursal el texto va oscuro (--navy): contrasta más que el blanco con
   los 8 colores de la paleta (>= 4.5:1).
   Los botones EFECTIVO/TARJETA mantienen verde/azul a propósito: su color
   significa forma de pago, no sucursal.
   ═════════════════════════════════════════════════════════════════════════ */

.app-shell {
  border-left: 6px solid var(--color-sucursal);
  background:
    radial-gradient(1100px 380px at 50% -140px, color-mix(in srgb, var(--color-sucursal) 18%, transparent), transparent 72%),
    var(--navy);
  transition: border-color 0.25s ease;
}

.nav {
  background: color-mix(in srgb, var(--color-sucursal) 11%, var(--navy-panel));
}

.nav-sucursal {
  background: var(--color-sucursal);
  border-color: transparent;
  padding: 6px 14px 6px 10px;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-sucursal) 25%, transparent);
}

.nav-sucursal-punto {
  background: var(--texto-sobre-color);
}

.nav-sucursal-nombre,
.nav-sucursal-select {
  color: var(--texto-sobre-color);
  font-size: 1em;
}

.nav-sucursal-select:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.nav-sucursal-select option {
  color: var(--text);
  background: var(--navy-panel);
}

.nav-sucursal-select:focus {
  outline-color: var(--texto-sobre-color);
}

.panel,
.pos-panel,
.kpi-tile {
  border-top: 3px solid var(--color-sucursal);
}

.overlay .tarjeta {
  border-top: 4px solid var(--color-sucursal);
}

.panel h2,
.overlay .tarjeta h2 {
  color: var(--color-sucursal-texto);
}

table.tabla th {
  border-bottom: 2px solid color-mix(in srgb, var(--color-sucursal) 55%, transparent);
}

.pos-sucursal-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  color: var(--texto-sobre-color);
  padding: 10px 12px 8px;
}

.pos-sucursal-banner-corto {
  font-size: 1.45em;
  line-height: 1.05;
}

.pos-sucursal-banner-legal {
  font-family: 'Inter', sans-serif;
  font-size: 0.55em;
  font-weight: 600;
  letter-spacing: 0.02em;
  opacity: 0.8;
}

.pos-categoria.activa {
  background: var(--color-sucursal);
  border-color: var(--color-sucursal);
  color: var(--texto-sobre-color);
}

.pos-categoria:hover:not(.activa),
.pos-producto:hover,
.orden-abierta:hover:not(:disabled) {
  border-color: var(--color-sucursal);
}

.pos-totales-fila.total span:last-child {
  color: var(--color-sucursal-texto);
}

.pos-toast {
  background: var(--color-sucursal);
  color: var(--texto-sobre-color);
}

.kpi-tile:hover {
  border-color: var(--color-sucursal);
}

*::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--color-sucursal) 45%, var(--border));
}

/* ── Selector de color de sucursal ───────────────────────────────────── */

.selector-color {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.muestra-color {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  color: var(--texto-sobre-color);
  font-weight: 800;
  box-shadow: none;
}

.muestra-color.elegida {
  border-color: var(--text);
  box-shadow: 0 0 0 3px rgba(60, 40, 10, 0.18);
}

.muestra-color:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.muestra-fila {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  margin-right: 8px;
  vertical-align: -2px;
}

/* ── Cierre de caja (cuadre POS BAC / Ficohsa / efectivo / transferencia) ── */

.tabla-scroll {
  overflow-x: auto;
}

.cierre-encabezado {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cierre-titulo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cierre-titulo h2 {
  margin: 0;
}

.cierre-sucursal-punto {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex: none;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-cierre) 25%, transparent);
}

.cierre-subtitulo {
  color: var(--text-dim);
  font-size: 0.88em;
  margin: 2px 0 0;
}

.cierre-rango {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px;
}

.cierre-rango label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--text-dim);
  font-size: 0.82em;
}

.cierre-kpis {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: stretch;
}

.cierre-kpis > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 14px;
  border-radius: var(--radio-chico);
  background: var(--navy-elevada);
  border: 1px solid var(--border);
  min-width: 110px;
}

.cierre-kpis span {
  color: var(--text-dim);
  font-size: 0.75em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cierre-kpis strong {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.35em;
}

.cierre-kpis small {
  font-size: 0.65em;
  color: var(--text-dim);
}

.cierre-kpi-rango {
  font-variant-numeric: tabular-nums;
}

.cierre-kpis .cierre-actualizando {
  justify-content: center;
  color: var(--text-dim);
  font-size: 0.85em;
  background: none;
  border-style: dashed;
}

.cierre-tarjetas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 14px;
  margin-bottom: 14px;
}

.cierre-tarjetas .panel {
  margin-bottom: 0;
}

.cierre-bloque {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cierre-bloque header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.cierre-bloque h3 {
  margin: 0;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.35em;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-sucursal-texto);
}

.cierre-fila {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radio-chico);
  background: var(--navy-elevada);
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
}

.cierre-fila-fuerte {
  color: var(--text);
  font-weight: 700;
  border-left: 3px solid var(--color-sucursal);
}

.cierre-fila-fuerte span:last-child {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.3em;
}

.cierre-dos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.cierre-campo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cierre-campo-etiqueta {
  font-size: 0.85em;
  font-weight: 600;
  color: var(--text);
}

.cierre-obligatorio {
  color: var(--terracota-claro);
}

.cierre-campo-input {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: var(--radio-chico);
  background: var(--campo);
  transition: border-color var(--veloz), box-shadow var(--veloz);
}

.cierre-campo-input:focus-within {
  border-color: var(--color-sucursal);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-sucursal) 25%, transparent);
}

.cierre-campo-prefijo {
  padding: 0 4px 0 12px;
  color: var(--text-dim);
  font-weight: 700;
}

.cierre-campo-input input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  font-size: 1.2em;
  font-variant-numeric: tabular-nums;
  padding: 10px 12px 10px 4px;
}

.cierre-campo-input input:focus {
  outline: none;
}

.cierre-campo-ayuda {
  color: var(--text-dim);
  font-size: 0.8em;
}

.chip-dif {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.82em;
  font-weight: 700;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.chip-dif-grande {
  font-size: 1.05em;
  padding: 6px 14px;
}

.chip-dif-cuadra {
  background: var(--ok-fondo);
  color: var(--ok);
}

.chip-dif-centavos {
  background: var(--aviso-fondo);
  color: var(--aviso);
}

.chip-dif-faltante {
  background: var(--peligro-fondo);
  color: var(--peligro);
}

.chip-dif-sobrante {
  background: var(--info-fondo);
  color: var(--info);
}

.chip-dif-nd {
  color: var(--text-dim);
}

.cierre-pie {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cierre-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}

.cierre-observaciones {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cierre-observaciones textarea {
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
}

.cierre-boton {
  align-self: flex-start;
  min-width: 220px;
  padding: 14px 24px;
  font-size: 1.1em;
  background: var(--color-sucursal);
  color: var(--texto-sobre-color);
  font-weight: 800;
}

.cierre-boton:disabled {
  opacity: 0.45;
}

.cierre-resultado-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin: 12px 0;
}

.cierre-resultado-grid > div {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border-radius: var(--radio-chico);
  background: var(--navy-elevada);
}

.cierre-resultado-grid span:first-child {
  color: var(--text-dim);
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cierre-acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.cierre-historial-titulo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.cierre-historial-titulo h2 {
  margin-right: auto;
}

.cierre-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-dim);
  font-size: 0.88em;
}

.cierre-historial-acciones {
  display: flex;
  gap: 6px;
  white-space: nowrap;
}

.overlay .tarjeta.cierre-detalle {
  max-width: 640px;
  width: 100%;
}

.cierre-detalle-tabla td {
  vertical-align: top;
}

.cierre-detalle-facturas {
  max-height: 260px;
  overflow-y: auto;
}

@media (max-width: 560px) {
  .cierre-dos {
    grid-template-columns: 1fr;
  }
  .cierre-boton {
    align-self: stretch;
  }
}

/* ── Puntos de emisión (CAI) ─────────────────────────────────────────── */

.cai-ayuda {
  color: var(--text-dim);
  font-size: 0.9em;
  max-width: 760px;
}

.cai-lista {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 14px;
}

.cai-tarjeta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border-radius: var(--radio);
  background: var(--navy);
  border: 1px solid var(--border);
  border-left: 5px solid var(--color-pe);
}

.cai-tarjeta-borrador {
  background: repeating-linear-gradient(-45deg, var(--navy), var(--navy) 14px, rgba(154, 116, 16, 0.07) 14px, rgba(154, 116, 16, 0.07) 28px);
}

.cai-tarjeta-encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 1.1em;
}

.cai-estado {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.75em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.cai-estado-borrador {
  background: var(--aviso-fondo);
  color: var(--aviso);
}

.cai-estado-real {
  background: var(--ok-fondo);
  color: var(--ok);
}

.cai-datos {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 12px;
  margin: 0;
  font-size: 0.9em;
}

.cai-datos dt {
  color: var(--text-dim);
}

.cai-datos dd {
  margin: 0;
  font-variant-numeric: tabular-nums;
  word-break: break-all;
}

.cai-codigo {
  font-family: 'Courier New', monospace;
  letter-spacing: 0.02em;
}

.cai-acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cai-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--border);
}

.cai-form h3 {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--color-pe);
  font-size: 1em;
}

.cai-form label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--text-dim);
  font-size: 0.8em;
}

.cai-form-ancho {
  grid-column: 1 / -1;
}

.cai-vista {
  margin: 0;
  font-size: 0.88em;
  color: var(--text-dim);
}

.cai-vista strong {
  color: var(--text);
  font-family: 'Courier New', monospace;
}

.cai-faltan {
  margin: 0;
  padding-left: 18px;
  color: var(--aviso);
  font-size: 0.82em;
}

.cierre-toggle input {
  width: auto;
  margin: 0;
}

.cierre-toggle {
  white-space: nowrap;
}

/* ── Reportes ────────────────────────────────────────────────────────── */

.rep-filtros .toolbar {
  align-items: flex-end;
}

.rep-fecha {
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: var(--text-dim);
  font-size: 0.8em;
}

.rep-atajos {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.rep-pestanas {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  margin-bottom: 14px;
  padding: 4px;
  border-radius: var(--radio);
  background: var(--navy-panel);
  border: 1px solid var(--border);
}

.rep-pestanas button {
  flex: none;
  width: auto;
  background: transparent;
  color: var(--text-dim);
  border: 0;
  box-shadow: none;
  padding: 9px 14px;
  font-weight: 600;
  white-space: nowrap;
}

.rep-pestanas button:hover {
  color: var(--text);
}

.rep-pestanas button.activa {
  background: var(--color-sucursal);
  color: var(--texto-sobre-color);
}

.rep-contador {
  display: inline-block;
  margin-left: 6px;
  min-width: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: rgba(220, 70, 60, 0.85);
  color: #fff;
  font-size: 0.75em;
  line-height: 18px;
}

.rep-kpis {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.rep-kpi {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border-radius: var(--radio);
  background: var(--navy-panel);
  border: 1px solid var(--border);
  border-top: 3px solid var(--color-sucursal);
}

.rep-kpi-titulo {
  color: var(--text-dim);
  font-size: 0.75em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.rep-kpi-valor {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.7em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.rep-kpi-pie {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  color: var(--text-dim);
  font-size: 0.75em;
  min-height: 1.2em;
}

.rep-var {
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 999px;
}

.rep-var-buena {
  background: var(--ok-fondo);
  color: var(--ok);
}

.rep-var-mala {
  background: var(--peligro-fondo);
  color: var(--peligro);
}

.rep-var-neutra {
  background: var(--aviso-fondo);
  color: var(--aviso);
}

.rep-seccion-titulo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.rep-seccion-titulo h2 {
  margin: 0 auto 0 0;
}

.rep-seccion-titulo h2 + button {
  margin-left: auto;
}

.rep-buscar {
  width: 260px;
  max-width: 100%;
}

.rep-controles {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.rep-check {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-dim);
  font-size: 0.88em;
  white-space: nowrap;
}

.rep-check input {
  width: auto;
  margin: 0;
}

.rep-hallazgos {
  margin: 0;
  padding-left: 20px;
  display: grid;
  gap: 6px;
  line-height: 1.45;
}

.rep-hallazgos li::marker {
  color: var(--color-sucursal-texto);
}

.rep-tabla td.rep-num,
.rep-tabla th.rep-num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.rep-ordenable {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.rep-ordenable:hover {
  color: var(--text);
}

.rep-flecha {
  margin-left: 4px;
  color: var(--color-sucursal-texto);
}

.rep-vacio {
  color: var(--text-dim);
  text-align: center;
  padding: 18px;
}

.rep-nota {
  color: var(--text-dim);
  font-size: 0.8em;
  margin: 8px 0 0;
}

.rep-tenue {
  color: var(--text-dim);
}

.rep-mono {
  font-family: 'Courier New', monospace;
  font-size: 0.92em;
  white-space: nowrap;
}

.rep-alerta {
  color: var(--peligro);
  font-weight: 700;
}

.rep-anulada td {
  opacity: 0.55;
  text-decoration: line-through;
}

.rep-anulada td:last-child {
  text-decoration: none;
  opacity: 1;
}

.rep-seleccionada td {
  background: color-mix(in srgb, var(--color-sucursal) 14%, transparent);
}

.rep-fila-total td {
  font-weight: 800;
  border-top: 2px solid var(--border);
}

.rep-barra {
  display: block;
  height: 10px;
  border-radius: 999px;
  background: var(--navy-elevada);
  overflow: hidden;
  min-width: 60px;
}

.rep-barra > span {
  display: block;
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.rep-col-etiqueta {
  white-space: nowrap;
  width: 1%;
}

.rep-col-barra {
  width: 45%;
}

.rep-part {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 150px;
}

.rep-part .rep-barra {
  flex: 1;
}

.rep-sucursal {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.rep-sucursal .leyenda-punto {
  display: inline-block;
}

.rep-dos-columnas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(460px, 1fr));
  gap: 14px;
}

.rep-dos-columnas > .panel {
  margin-bottom: 0;
  min-width: 0;
  overflow-x: auto;
}

.rep-dos-columnas + .panel,
.rep-dos-columnas + .rep-seccion {
  margin-top: 14px;
}

.rep-barras-dia {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 190px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.rep-dia {
  flex: 1 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 4px;
}

.rep-dia-columna {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.rep-dia-columna > span {
  display: block;
  width: 100%;
  border-radius: 4px 4px 0 0;
  background: var(--color-sucursal);
  opacity: 0.85;
}

.rep-dia-finde .rep-dia-columna > span {
  background: var(--gold);
}

.rep-dia:hover .rep-dia-columna > span {
  opacity: 1;
}

.rep-dia-etiqueta {
  color: var(--text-dim);
  font-size: 0.7em;
  font-variant-numeric: tabular-nums;
}

.rep-calor {
  border-collapse: separate;
  border-spacing: 3px;
  font-size: 0.75em;
}

.rep-calor th {
  color: var(--text-dim);
  font-weight: 600;
  padding: 2px 4px;
  white-space: nowrap;
}

.rep-calor td {
  width: 42px;
  height: 30px;
  border-radius: 5px;
  text-align: center;
  color: var(--texto-sobre-color);
  font-weight: 800;
}

.rep-fiscal h3 {
  margin: 0 0 6px;
  color: var(--color-sucursal-texto);
}

.rep-fiscal h4 {
  margin: 14px 0 6px;
  color: var(--text-dim);
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.rep-encabezado-impresion {
  display: none;
}

@media (max-width: 560px) {
  .rep-dos-columnas {
    grid-template-columns: 1fr;
  }
}

/* Impresión / PDF del reporte: fondo blanco, sin navegación ni botones. */
@media print {
  .nav,
  .no-imprimir,
  .rep-pestanas {
    display: none !important;
  }
  .app-shell,
  body {
    background: #fff !important;
    border: 0 !important;
    color: #000 !important;
  }
  .reportes .panel,
  .rep-kpi {
    background: #fff !important;
    color: #000 !important;
    border: 1px solid #bbb !important;
    box-shadow: none !important;
    break-inside: avoid;
  }
  .reportes h2,
  .reportes h3,
  .rep-kpi-titulo,
  .rep-nota,
  .rep-tenue {
    color: #000 !important;
  }
  .reportes table.tabla td,
  .reportes table.tabla th {
    color: #000 !important;
    border-color: #ccc !important;
  }
  .rep-encabezado-impresion {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 12px;
  }
}

/* ── Descuento por producto en el carrito ────────────────────────────── */

.pos-linea {
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
  margin-bottom: 6px;
}

.pos-linea .pos-orden-linea {
  border-bottom: 0;
}

.pos-linea-con-descuento {
  background: var(--ok-fondo);
  border-radius: var(--radio-chico);
  padding: 2px 6px 6px;
}

.pos-linea-descuento {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.pos-chip-desc {
  width: auto;
  padding: 3px 9px;
  font-size: 0.75em;
  font-weight: 600;
  border-radius: 999px;
  background: transparent;
  color: var(--text-dim);
  border: 1px solid var(--border);
  box-shadow: none;
}

.pos-chip-desc.activo {
  background: var(--color-sucursal);
  border-color: var(--color-sucursal);
  color: var(--texto-sobre-color);
}

.pos-chip-separar {
  margin-left: auto;
  border-style: dashed;
}

/* Aviso de versión nueva de la app */
.aviso-version {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 16px;
  background: var(--aviso-fondo);
  color: var(--aviso);
  font-weight: 600;
  font-size: 0.9em;
  border-bottom: 1px solid #d9b554;
}

.aviso-version button {
  width: auto;
}

/* ── Forma de pago en el listado de facturas ─────────────────────────── */
.chips-pago {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
}

.chip-pago {
  display: inline-block;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 0.78em;
  font-weight: 700;
  white-space: nowrap;
  background: var(--navy-elevada);
  color: var(--text);
}

.chip-pago.pago-efectivo {
  background: var(--ok-fondo);
  color: var(--ok);
}

.chip-pago.pago-tarjeta {
  background: var(--info-fondo);
  color: var(--info);
}

.chip-pago.pago-transferencia {
  background: #efe3f7;
  color: #6a3d8f;
}

/* ── Antifraude ──────────────────────────────────────────────────────── */
.nav-contador {
  display: inline-block;
  margin-left: 6px;
  min-width: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--peligro);
  color: #fff;
  font-size: 0.72em;
  line-height: 18px;
  text-align: center;
  font-weight: 700;
}

.af-intro {
  color: var(--text-dim);
  font-size: 0.88em;
  max-width: 860px;
  margin-top: -4px;
}

.af-titulo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.af-alerta {
  border: 1px solid var(--border);
  border-left: 5px solid var(--aviso);
  border-radius: var(--radio-chico);
  background: var(--campo);
  margin-bottom: 8px;
}

.af-alerta.af-alta {
  border-left-color: var(--peligro);
}

.af-alerta.af-baja {
  border-left-color: var(--info);
}

.af-alerta.af-revisada {
  opacity: 0.6;
}

.af-alerta-fila {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  cursor: pointer;
}

.af-alerta-fila > button {
  width: auto;
  flex: none;
}

.af-alerta-texto {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.af-alerta-texto span {
  color: var(--text-dim);
  font-size: 0.8em;
}

.af-sev {
  flex: none;
  text-transform: uppercase;
  font-size: 0.68em;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 999px;
}

.af-sev-alta {
  background: var(--peligro-fondo);
  color: var(--peligro);
}

.af-sev-media {
  background: var(--aviso-fondo);
  color: var(--aviso);
}

.af-sev-baja {
  background: var(--info-fondo);
  color: var(--info);
}

.af-revisada-por {
  color: var(--ok);
  font-size: 0.8em;
  font-weight: 700;
  white-space: nowrap;
}

.af-alerta-detalle {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 6px 16px;
  padding: 4px 14px 12px 14px;
  font-size: 0.85em;
}

.af-alerta-detalle div {
  display: flex;
  flex-direction: column;
}

.af-alerta-detalle span {
  color: var(--text-dim);
  text-transform: capitalize;
  font-size: 0.85em;
}

.af-tabla td {
  vertical-align: top;
}

.af-fila-alta td:first-child {
  box-shadow: inset 4px 0 0 var(--peligro);
}

.af-fila-media td:first-child {
  box-shadow: inset 4px 0 0 var(--aviso);
}

.af-senales {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-width: 260px;
}

.af-senal {
  font-size: 0.76em;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
}

.af-senal-alta {
  background: var(--peligro-fondo);
  color: var(--peligro);
}

.af-senal-media {
  background: var(--aviso-fondo);
  color: var(--aviso);
}

.af-senal-baja {
  background: var(--info-fondo);
  color: var(--info);
}

.af-ok {
  color: var(--ok);
  font-size: 0.8em;
  font-weight: 600;
}

.af-feed {
  max-height: 420px;
  overflow-y: auto;
}

.af-evento {
  display: flex;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.86em;
}

.af-evento-hora {
  flex: none;
  width: 118px;
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
}

.af-consejos ul {
  margin: 0;
  padding-left: 20px;
  display: grid;
  gap: 8px;
  line-height: 1.45;
}

.af-tabla td.rep-num,
.af-tabla th.rep-num,
table.tabla td.nowrap {
  text-align: right;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* ═════════════════════════════════════════════════════════════════════════
   REDISEÑO "ÍTALO MODERNO"
   ─────────────────────────────────────────────────────────────────────────
   Barra lateral oscura con acentos salvia (identidad Ítalo), contenido en
   tarjetas blancas sobre gris-salvia muy claro, verde bosque como color de
   acción. El color de la sucursal se reserva para lo que indica
   UBICACIÓN: tarjeta de sucursal en la barra lateral, franja superior del
   contenido, marca de los títulos, banner del POS y pestañas activas.
   Esta sección va al final a propósito: reemplaza reglas anteriores.
   ═════════════════════════════════════════════════════════════════════════ */

:root[data-tema='oscuro'] {
  color-scheme: dark;
  --navy: #0f130e;
  --navy-panel: #171c15;
  --navy-elevada: #1e241b;
  --campo: #12160f;
  --terracota: #4f8a5c;
  --terracota-claro: #5f9c6c;
  --primario: #4f8a5c;
  --primario-hover: #5f9c6c;
  --primario-suave: rgba(197, 210, 136, 0.12);
  --gold: #d9b554;
  --text: #e8ede2;
  --text-dim: #98a38e;
  --border: #2a3226;
  --color-sucursal-texto: color-mix(in srgb, var(--color-sucursal) 72%, #ffffff);
  --ok: #7bd39a;
  --ok-fondo: rgba(46, 158, 94, 0.18);
  --peligro: #ff8a80;
  --peligro-fondo: rgba(220, 70, 60, 0.18);
  --aviso: #e6c65a;
  --aviso-fondo: rgba(212, 175, 55, 0.16);
  --info: #8ccaf0;
  --info-fondo: rgba(61, 159, 214, 0.18);
  --sidebar: #0b0e0a;
  --sidebar-borde: #1c2319;
  --sombra-suave: 0 1px 2px rgba(0, 0, 0, 0.4);
  --sombra: 0 1px 2px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.3);
  --sombra-flotante: 0 18px 48px rgba(0, 0, 0, 0.55);
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--navy);
  font-size: 15px;
  letter-spacing: -0.005em;
}

h1,
h2,
h3 {
  font-family: 'Poppins', 'Inter', sans-serif;
  text-transform: none;
  letter-spacing: -0.015em;
  font-weight: 600;
  color: var(--text);
}

h2 {
  font-size: 1.25em;
}

/* ── Estructura: barra lateral + contenido ───────────────────────────── */

.app-shell {
  display: grid;
  grid-template-columns: 248px 1fr;
  min-height: 100vh;
  border-left: 0;
  background: var(--navy);
  transition: grid-template-columns 0.2s ease;
}

.app-shell.barra-compacta {
  grid-template-columns: 76px 1fr;
}

.principal {
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-top: 4px solid var(--color-sucursal);
  transition: border-color 0.25s ease;
}

.contenido {
  padding: 22px 26px 32px;
}

.barra-movil,
.sidebar-velo {
  display: none;
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 12px;
  background: var(--sidebar);
  border-right: 1px solid var(--sidebar-borde);
  color: var(--sidebar-texto);
  overflow: hidden auto;
  z-index: 20;
}

.sidebar-marca {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 6px 4px;
}

.sidebar-marca-texto {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
  flex: 1;
  min-width: 0;
}

.sidebar-marca-texto strong {
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: 1.15em;
  color: #fff;
  letter-spacing: 0.02em;
}

.sidebar-marca-texto small {
  color: var(--salvia);
  font-weight: 600;
  font-size: 0.72em;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.boton-icono {
  width: 34px;
  height: 34px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 9px;
  background: transparent;
  color: inherit;
  box-shadow: none;
  border: 0;
}

.boton-icono:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
  filter: none;
  box-shadow: none;
}

.sidebar-colapsar {
  color: var(--sidebar-titulo);
}

.sidebar-sucursal {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--color-sucursal);
  color: var(--texto-sobre-color);
  box-shadow: 0 6px 18px color-mix(in srgb, var(--color-sucursal) 35%, transparent);
  transition: background-color 0.25s ease;
}

.sidebar-sucursal-etiqueta {
  font-size: 0.66em;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.75;
}

.sidebar-sucursal-nombre,
.sidebar-sucursal-select {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.02em;
  color: var(--texto-sobre-color);
}

.sidebar-sucursal-select {
  width: 100%;
  margin: 0;
  padding: 0 18px 0 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  appearance: auto;
}

.sidebar-sucursal-select:focus {
  box-shadow: none;
  outline: 2px solid var(--texto-sobre-color);
  outline-offset: 3px;
}

.sidebar-sucursal-select option {
  color: #1a1f16;
  background: #fff;
}

.sidebar-sucursal-inicial {
  display: none;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.sidebar-grupo {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-grupo-titulo {
  padding: 0 10px 4px;
  color: var(--sidebar-titulo);
  font-size: 0.68em;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.sidebar-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 9px 10px;
  border-radius: 10px;
  background: transparent;
  color: var(--sidebar-texto);
  font-weight: 500;
  font-size: 0.93em;
  text-align: left;
  box-shadow: none;
  border: 0;
}

.sidebar-item svg {
  flex: none;
  opacity: 0.85;
}

.sidebar-item:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  filter: none;
  box-shadow: none;
}

.sidebar-item:active:not(:disabled) {
  transform: none;
}

.sidebar-item.activo {
  background: var(--sidebar-activo);
  color: #eef4dc;
  font-weight: 600;
}

.sidebar-item.activo::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 8px;
  bottom: 8px;
  width: 4px;
  border-radius: 0 4px 4px 0;
  background: var(--salvia);
}

.sidebar-item.activo svg {
  color: var(--salvia);
  opacity: 1;
}

.sidebar-item-texto {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-item .nav-contador {
  margin-left: auto;
}

.sidebar-pie {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 10px;
  border-top: 1px solid var(--sidebar-borde);
}

.sidebar-pie .nav-vivo {
  margin: 0;
  padding: 6px 10px;
  color: var(--sidebar-titulo);
}

.sidebar-pie .nav-vivo.conectado {
  color: #8fd3a6;
}

.sidebar-usuario {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 6px 2px 8px;
}

.sidebar-avatar {
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--salvia);
  color: #141a12;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
}

.sidebar-usuario-texto {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.sidebar-usuario-texto strong {
  color: #fff;
  font-size: 0.9em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-usuario-texto small {
  color: var(--sidebar-titulo);
  font-size: 0.75em;
}

/* Barra compacta: sólo íconos */
.barra-compacta .sidebar {
  padding: 16px 10px;
  align-items: center;
}

.barra-compacta .sidebar-marca {
  flex-direction: column;
  padding: 0;
}

.barra-compacta .sidebar-marca-texto,
.barra-compacta .sidebar-item-texto,
.barra-compacta .sidebar-grupo-titulo,
.barra-compacta .sidebar-sucursal-etiqueta,
.barra-compacta .sidebar-sucursal-nombre,
.barra-compacta .sidebar-sucursal-select,
.barra-compacta .sidebar-usuario-texto,
.barra-compacta .nav-vivo {
  display: none;
}

.barra-compacta .sidebar-sucursal {
  padding: 8px;
  width: 48px;
  align-items: center;
}

.barra-compacta .sidebar-sucursal-inicial {
  display: block;
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: 0.95em;
}

.barra-compacta .sidebar-item {
  justify-content: center;
  padding: 10px;
  width: 48px;
}

.barra-compacta .sidebar-item .nav-contador {
  position: absolute;
  top: 2px;
  right: 0;
  margin: 0;
}

.barra-compacta .sidebar-item.activo::before {
  left: -10px;
}

.barra-compacta .sidebar-grupo {
  align-items: center;
  padding-top: 6px;
  border-top: 1px solid var(--sidebar-borde);
}

.barra-compacta .sidebar-grupo:first-child {
  border-top: 0;
}

.barra-compacta .sidebar-usuario {
  flex-direction: column;
  padding: 6px 0 0;
}

/* Tablet / celular: la barra lateral se vuelve menú deslizable */
@media (max-width: 900px) {
  .app-shell,
  .app-shell.barra-compacta {
    grid-template-columns: 1fr;
  }
  .barra-movil {
    position: sticky;
    top: 0;
    z-index: 15;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    background: var(--sidebar);
    color: #fff;
    border-bottom: 3px solid var(--color-sucursal);
  }
  .barra-movil-titulo {
    flex: 1;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
  }
  .barra-movil-sucursal {
    padding: 3px 10px;
    border-radius: 999px;
    background: var(--color-sucursal);
    color: var(--texto-sobre-color);
    font-weight: 700;
    font-size: 0.8em;
  }
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 272px;
    transform: translateX(-105%);
    transition: transform 0.22s ease;
    box-shadow: var(--sombra-flotante);
  }
  .menu-abierto .sidebar {
    transform: none;
  }
  .sidebar-velo {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 19;
    background: rgba(10, 14, 9, 0.45);
  }
  .principal {
    border-top: 0;
  }
  .contenido {
    padding: 14px;
  }
  .barra-compacta .sidebar-item-texto,
  .barra-compacta .sidebar-grupo-titulo,
  .barra-compacta .sidebar-marca-texto {
    display: initial;
  }
}

/* ── Superficies ─────────────────────────────────────────────────────── */

.panel,
.pos-panel,
.kpi-tile,
.rep-kpi {
  background: var(--navy-panel);
  border: 1px solid var(--border);
  border-top: 1px solid var(--border);
  border-radius: var(--radio);
  box-shadow: var(--sombra);
}

.panel h2,
.overlay .tarjeta h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
}

/* Marca de sucursal en cada título: indica dónde se está trabajando sin
   pintar todo el texto. */
.panel h2::before,
.overlay .tarjeta h2::before {
  content: '';
  flex: none;
  width: 5px;
  height: 1.05em;
  border-radius: 4px;
  background: var(--color-sucursal);
}

.overlay {
  background: rgba(14, 20, 12, 0.45);
  backdrop-filter: blur(3px);
}

.overlay .tarjeta,
.tarjeta {
  background: var(--navy-panel);
  border: 1px solid var(--border);
  border-top: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--sombra-flotante);
}

/* ── Controles ───────────────────────────────────────────────────────── */

button {
  border-radius: 10px;
  background: var(--primario);
  font-weight: 600;
  letter-spacing: -0.005em;
}

/* Hover genérico sin cambiar el color de fondo: así los botones con color
   propio (Efectivo, Tarjeta, categorías, chips) no se vuelven verdes. */
button:hover:not(:disabled) {
  filter: brightness(0.94);
  box-shadow: 0 4px 14px rgba(16, 24, 12, 0.12);
}

.boton-secundario {
  background: var(--navy-panel);
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: var(--sombra-suave);
}

.boton-secundario:hover:not(:disabled) {
  background: var(--navy-elevada);
  border-color: color-mix(in srgb, var(--primario) 45%, var(--border));
  box-shadow: var(--sombra-suave);
}

.boton-peligro {
  background: var(--peligro);
}

.boton-peligro:hover:not(:disabled) {
  background: color-mix(in srgb, var(--peligro) 85%, #000);
}

input,
textarea,
select {
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--campo);
}

input:hover,
textarea:hover,
select:hover {
  border-color: color-mix(in srgb, var(--primario) 30%, var(--border));
}

input:focus,
textarea:focus,
select:focus {
  border-color: var(--primario);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--primario) 16%, transparent);
}

:focus-visible {
  outline-color: var(--primario);
}

/* ── Tablas ──────────────────────────────────────────────────────────── */

table.tabla th {
  color: var(--text-dim);
  font-weight: 600;
  font-size: 0.72em;
  letter-spacing: 0.06em;
  border-bottom: 1px solid var(--border);
  background: var(--navy-elevada);
}

table.tabla th:first-child {
  border-top-left-radius: 10px;
}

table.tabla th:last-child {
  border-top-right-radius: 10px;
}

table.tabla td {
  border-bottom: 1px solid var(--border);
}

table.tabla tbody tr:hover {
  background: color-mix(in srgb, var(--primario) 4%, transparent);
}

/* ── Chips y avisos ──────────────────────────────────────────────────── */

.alerta {
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--aviso) 30%, transparent);
  background: var(--aviso-fondo);
  color: var(--aviso);
}

.error {
  border-radius: 12px;
  background: var(--peligro-fondo);
  border: 1px solid color-mix(in srgb, var(--peligro) 30%, transparent);
  color: var(--peligro);
}

.aviso-ok {
  border-radius: 12px;
}

/* ── POS ─────────────────────────────────────────────────────────────── */

.pos-grid {
  height: calc(100vh - 58px);
  gap: 16px;
}

.pos-categoria {
  border-radius: 10px;
  background: var(--navy-panel);
  border: 1px solid var(--border);
  color: var(--text);
  box-shadow: none;
}

.pos-categoria.activa {
  background: var(--color-sucursal);
  border-color: var(--color-sucursal);
  color: var(--texto-sobre-color);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--color-sucursal) 30%, transparent);
}

.pos-producto {
  border-radius: 14px;
  background: var(--navy-panel);
  border: 1px solid var(--border);
  color: var(--text);
  box-shadow: var(--sombra-suave);
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
}

.pos-producto:hover:not(:disabled) {
  background: var(--navy-panel);
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--color-sucursal) 60%, var(--border));
  box-shadow: 0 10px 22px rgba(16, 24, 12, 0.1);
}

.pos-producto strong {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.pos-sucursal-banner {
  border-radius: 14px;
  box-shadow: 0 8px 20px color-mix(in srgb, var(--color-sucursal) 28%, transparent);
}

.pos-sucursal-banner-corto {
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.pos-totales-fila.total span:last-child {
  color: var(--primario);
  font-family: 'Poppins', sans-serif;
}

.pos-chip-desc.activo {
  background: var(--primario);
  border-color: var(--primario);
  color: #fff;
}

.pos-linea-con-descuento {
  background: var(--primario-suave);
}

/* ── Reportes, cierres, KPIs ─────────────────────────────────────────── */

.rep-pestanas {
  border-radius: 12px;
  background: var(--navy-panel);
  box-shadow: var(--sombra-suave);
}

.rep-pestanas button {
  border-radius: 9px;
}

.rep-pestanas button:hover:not(:disabled) {
  background: var(--navy-elevada);
  box-shadow: none;
}

.rep-pestanas button.activa,
.rep-pestanas button.activa:hover {
  background: var(--primario);
  color: #fff;
}

.rep-kpi {
  border-top: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

.rep-kpi::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--salvia);
}

.rep-kpi-valor,
.cierre-kpis strong,
.cierre-fila-fuerte span:last-child {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.cierre-bloque h3,
.rep-fiscal h3 {
  font-family: 'Poppins', sans-serif;
  text-transform: none;
  letter-spacing: -0.01em;
  color: var(--text);
}

.cierre-boton {
  background: var(--primario);
  color: #fff;
}

.cierre-kpis > div,
.cierre-fila {
  border-radius: 10px;
}

/* ── Pantalla de inicio de sesión ────────────────────────────────────── */

.pantalla {
  background:
    radial-gradient(900px 500px at 12% 10%, rgba(197, 210, 136, 0.22), transparent 60%),
    radial-gradient(700px 500px at 90% 90%, rgba(62, 90, 52, 0.35), transparent 60%),
    #0f140d;
}

.pantalla .tarjeta {
  max-width: 400px;
  padding: 34px 32px;
}

.login-marca {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.login-marca strong {
  display: block;
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: 1.6em;
  letter-spacing: 0.02em;
  color: var(--text);
  line-height: 1;
}

.login-marca small {
  color: var(--primario);
  font-weight: 700;
  letter-spacing: 0.2em;
  font-size: 0.72em;
  text-transform: uppercase;
}

.pantalla .tarjeta h1 {
  display: none;
}

/* Scrollbar */
*::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--text-dim) 35%, transparent);
}

/* Ajustes finos del rediseño */
.cierre-campo-input input,
.cierre-campo-input input:hover,
.cierre-campo-input input:focus {
  border: 0;
  box-shadow: none;
  background: transparent;
  margin: 0;
}

.cierre-campo-input:focus-within {
  border-color: var(--primario);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--primario) 16%, transparent);
}

.cierre-sucursal-punto {
  display: none;
}

.cierre-fila span:last-child,
.rep-num,
.pos-totales-fila span:last-child {
  white-space: nowrap;
}

.sidebar-nav {
  gap: 10px;
}

.sidebar-item {
  padding: 7px 10px;
}

@media (max-height: 820px) {
  .sidebar {
    gap: 10px;
    padding-top: 12px;
  }
  .sidebar-item {
    padding: 6px 10px;
    font-size: 0.9em;
  }
  .sidebar-grupo-titulo {
    padding-bottom: 2px;
  }
}

/* ── Antifraude avanzado ─────────────────────────────────────────────── */

.pos-tercera-edad {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 8px;
  padding: 10px;
  margin: 6px 0 10px;
  border-radius: 12px;
  background: var(--primario-suave);
  border: 1px solid color-mix(in srgb, var(--primario) 25%, transparent);
}

.pos-tercera-edad.incompleto {
  background: var(--aviso-fondo);
  border-color: color-mix(in srgb, var(--aviso) 35%, transparent);
}

.pos-tercera-edad input {
  margin: 0;
}

.pos-tercera-edad-titulo,
.pos-tercera-edad small {
  grid-column: 1 / -1;
  font-size: 0.78em;
  font-weight: 700;
  color: var(--text-dim);
}

.pos-tercera-edad.incompleto small {
  color: var(--aviso);
}

.bloqueo {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(10, 14, 9, 0.72);
  backdrop-filter: blur(10px);
}

.bloqueo-tarjeta {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 28px;
  border-radius: 20px;
  background: var(--navy-panel);
  box-shadow: var(--sombra-flotante);
  text-align: center;
}

.bloqueo-tarjeta input {
  margin: 0;
}

.bloqueo-tarjeta h2 {
  margin: 4px 0 0;
}

.bloqueo-tarjeta p {
  margin: 0 0 6px;
  color: var(--text-dim);
}

.bloqueo-logo {
  align-self: center;
  display: inline-flex;
  padding: 12px;
  border-radius: 16px;
  background: #141a12;
}

.notif-pila {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 90;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(380px, calc(100vw - 36px));
}

.notif {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--navy-panel);
  border: 1px solid var(--border);
  border-left: 5px solid var(--aviso);
  box-shadow: var(--sombra-flotante);
  animation: entra-toast 0.25s ease;
}

.notif-alta {
  border-left-color: var(--peligro);
}

.notif p {
  margin: 4px 0 0;
  font-size: 0.88em;
  color: var(--text-dim);
}

.notif-acciones {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.notif-acciones button {
  width: auto;
}

.af-estado {
  width: auto;
  flex: none;
  margin: 0;
  padding: 5px 8px;
  font-size: 0.8em;
  font-weight: 600;
  border-radius: 999px;
}

.af-estado-pendiente {
  background: var(--aviso-fondo);
  color: var(--aviso);
}

.af-estado-investigando {
  background: var(--info-fondo);
  color: var(--info);
}

.af-estado-resuelta {
  background: var(--ok-fondo);
  color: var(--ok);
}

.af-estado-falso_positivo {
  background: var(--navy-elevada);
  color: var(--text-dim);
}

.af-mini {
  display: inline-flex;
  align-items: flex-end;
  gap: 3px;
  height: 22px;
  width: 44px;
}

.af-mini span {
  flex: 1;
  border-radius: 2px;
  background: var(--peligro);
}

.af-resumen-turno {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin: 12px 0 16px;
}

.af-resumen-turno > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--navy-elevada);
}

.af-resumen-turno span {
  color: var(--text-dim);
  font-size: 0.75em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.af-resumen-turno strong {
  font-family: 'Poppins', sans-serif;
  font-size: 1.15em;
}

.af-linea {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 560px;
  overflow-y: auto;
}

.af-linea li {
  display: grid;
  grid-template-columns: 82px 14px 1fr;
  align-items: start;
  gap: 10px;
  padding: 6px 0;
  font-size: 0.9em;
  border-bottom: 1px dashed var(--border);
}

.af-linea-hora {
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
}

.af-linea-punto {
  width: 10px;
  height: 10px;
  margin-top: 5px;
  border-radius: 50%;
  background: var(--salvia);
  border: 2px solid var(--primario);
}

.af-linea-sensible {
  background: var(--peligro-fondo);
  border-radius: 8px;
}

.af-linea-sensible .af-linea-punto {
  background: var(--peligro);
  border-color: var(--peligro);
}

.af-reglas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 14px;
}

.af-reglas fieldset {
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px 14px 14px;
  margin: 0;
}

.af-reglas legend {
  padding: 0 6px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.af-regla {
  display: grid;
  grid-template-columns: 1fr 90px;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-size: 0.88em;
}

.af-regla input {
  margin: 0;
}

.af-regla-bool {
  grid-template-columns: 20px 1fr;
}

.af-regla-bool input {
  width: auto;
}

.toolbar .rep-check input {
  width: auto;
  flex: none;
  margin: 0;
}

.af-linea li {
  grid-template-columns: 104px 14px 1fr;
}

/* El panel de la orden se desplaza por dentro: los botones de cobro
   siempre quedan alcanzables aunque la orden sea larga. */
.pos-grid > .pos-panel {
  overflow-y: auto;
  min-height: 0;
}

/* ═══════════════════════════════════════════════════════════════════════
   Calendario de eventos (Cotizaciones → Calendario)
   ═══════════════════════════════════════════════════════════════════════ */
.cal-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 14px;
  align-items: start;
}

@media (max-width: 1100px) {
  .cal-layout {
    grid-template-columns: 1fr;
  }
}

.cal-barra {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.cal-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cal-nav h2 {
  margin: 0 6px;
  min-width: 170px;
  text-align: center;
}

.cal-nav button {
  width: auto;
  min-width: 36px;
}

.cal-filtros {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.cal-filtros select {
  width: auto;
  margin: 0;
}

.cal-toggle,
.cal-realizado {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88em;
  color: var(--text-dim);
  cursor: pointer;
  white-space: nowrap;
}

.cal-toggle input,
.cal-realizado input {
  width: auto;
  margin: 0;
}

.cal-realizado {
  color: var(--text);
  font-weight: 600;
  margin: 4px 0 12px;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
}

.cal-grid-cabecera {
  margin-bottom: 4px;
}

.cal-grid-cabecera div {
  text-align: center;
  font-size: 0.72em;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-dim);
  padding: 4px 0;
}

.cal-celda {
  min-height: 104px;
  padding: 6px;
  border-radius: var(--radio-chico);
  background: var(--navy-elevada);
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;
  gap: 3px;
  cursor: pointer;
  transition: border-color var(--veloz), background var(--veloz);
  min-width: 0;
}

.cal-celda:hover {
  border-color: var(--border);
  background: var(--navy-panel);
}

.cal-celda.fuera {
  opacity: 0.45;
}

.cal-celda.pasada .cal-dia {
  color: var(--text-dim);
}

.cal-celda.seleccionada {
  border-color: var(--primario);
  background: var(--navy-panel);
  box-shadow: var(--sombra-suave);
}

.cal-celda-cabecera {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cal-dia {
  font-weight: 700;
  font-size: 0.85em;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.cal-celda.hoy .cal-dia {
  background: var(--primario);
  color: #fff;
}

.cal-multiple {
  font-size: 0.68em;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--aviso-fondo);
  color: var(--aviso);
}

.cal-pill {
  display: block;
  width: 100%;
  text-align: left;
  font-size: 0.72em;
  font-weight: 600;
  line-height: 1.3;
  padding: 3px 6px;
  margin: 0;
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: none;
  cursor: pointer;
}

.cal-pill.confirmado {
  background: color-mix(in srgb, var(--c-evento) 18%, var(--navy-panel));
  color: var(--text);
  border: 0;
  border-left: 3px solid var(--c-evento);
}

.cal-pill.tentativo {
  background: transparent;
  color: var(--text-dim);
  border: 1px dashed color-mix(in srgb, var(--text-dim) 60%, transparent);
}

.cal-pill.cal-sit-urgente,
.cal-pill.cal-sit-vencido {
  border-left-color: var(--peligro);
  background: var(--peligro-fondo);
}

.cal-pill.cal-sit-listo,
.cal-pill.cal-sit-cerrado {
  border-left-color: var(--ok);
}

.cal-pill.cal-sit-cerrado {
  opacity: 0.7;
}

.cal-pill b {
  font-weight: 700;
  color: var(--text-dim);
}

.cal-mas {
  font-size: 0.7em;
  color: var(--text-dim);
  padding-left: 4px;
}

.cal-copitas {
  margin-top: auto;
  font-size: 0.68em;
  color: var(--text-dim);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.cal-leyenda {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 12px;
  font-size: 0.78em;
  color: var(--text-dim);
}

.cal-leyenda span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.cal-leyenda i {
  width: 14px;
  height: 10px;
  border-radius: 3px;
  display: inline-block;
}

.cal-l-confirmado {
  background: var(--primario-suave);
  border-left: 3px solid var(--primario);
}

.cal-l-tentativo {
  border: 1px dashed var(--text-dim);
}

.cal-l-urgente {
  background: var(--peligro-fondo);
  border-left: 3px solid var(--peligro);
}

.cal-l-listo {
  background: var(--ok-fondo);
  border-left: 3px solid var(--ok);
}

.cal-lateral {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cal-lateral .panel {
  margin-bottom: 0;
}

.cal-lateral-titulo {
  font-size: 1em;
  margin-top: 0;
}

.cal-vacio {
  color: var(--text-dim);
  font-size: 0.88em;
  margin: 0;
}

.cal-tarjeta {
  display: block;
  width: 100%;
  text-align: left;
  margin: 0 0 8px;
  padding: 10px 12px;
  border-radius: var(--radio-chico);
  background: var(--navy-elevada);
  color: var(--text);
  border: 1px solid var(--border);
  border-left: 4px solid var(--c-evento);
  box-shadow: none;
  cursor: pointer;
  font-weight: 400;
}

.cal-tarjeta:hover {
  filter: none;
  background: var(--navy-panel);
  box-shadow: var(--sombra-suave);
}

.cal-tarjeta.tentativo {
  border-left-style: dashed;
  opacity: 0.85;
}

.cal-tarjeta-fila {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.cal-tarjeta-fila strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cal-sub {
  color: var(--text-dim);
  font-size: 0.8em;
  margin-top: 2px;
}

.cal-estado {
  font-size: 0.7em;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  white-space: nowrap;
  background: var(--navy-elevada);
  color: var(--text-dim);
  border: 1px solid var(--border);
}

.cal-estado-aceptada {
  background: var(--ok-fondo);
  color: var(--ok);
  border-color: transparent;
}

.cal-estado-facturada {
  background: var(--info-fondo);
  color: var(--info);
  border-color: transparent;
}

.cal-estado-enviada {
  background: var(--aviso-fondo);
  color: var(--aviso);
  border-color: transparent;
}

.cal-estado-rechazada {
  background: var(--peligro-fondo);
  color: var(--peligro);
  border-color: transparent;
}

.cal-progreso {
  height: 6px;
  border-radius: 999px;
  background: var(--border);
  overflow: hidden;
  margin: 6px 0 10px;
}

.cal-progreso div {
  height: 100%;
  border-radius: 999px;
  background: var(--ok);
  transition: width 0.25s ease;
}

.cal-progreso-mini {
  height: 4px;
  margin: 8px 0 4px;
}

.cal-situacion,
.cal-situacion-mini {
  font-weight: 600;
  border-radius: var(--radio-chico);
}

.cal-situacion {
  padding: 8px 12px;
  margin-bottom: 12px;
  font-size: 0.88em;
}

.cal-situacion-mini {
  font-size: 0.74em;
}

.cal-situacion.cal-sit-urgente,
.cal-situacion.cal-sit-vencido {
  background: var(--peligro-fondo);
  color: var(--peligro);
}

.cal-situacion.cal-sit-listo,
.cal-situacion.cal-sit-cerrado {
  background: var(--ok-fondo);
  color: var(--ok);
}

.cal-situacion.cal-sit-en-curso {
  background: var(--info-fondo);
  color: var(--info);
}

.cal-situacion-mini.cal-sit-urgente,
.cal-situacion-mini.cal-sit-vencido {
  color: var(--peligro);
}

.cal-situacion-mini.cal-sit-listo,
.cal-situacion-mini.cal-sit-cerrado {
  color: var(--ok);
}

.cal-situacion-mini.cal-sit-en-curso {
  color: var(--text-dim);
}

/* Ficha del evento */
.overlay .tarjeta.cal-ficha {
  max-width: 620px;
  width: 100%;
  border-top-color: var(--c-evento, var(--color-sucursal));
}

.cal-ficha-cabecera {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.cal-ficha-cabecera h2 {
  margin: 4px 0 2px;
}

.cal-ficha-cabecera > button {
  width: auto;
  flex: none;
}

.cal-ficha-numero {
  font-size: 0.78em;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  gap: 6px;
}

.cal-ficha-fecha {
  color: var(--text-dim);
  font-size: 0.9em;
}

.cal-ficha-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.cal-dato {
  background: var(--navy-elevada);
  border-radius: var(--radio-chico);
  padding: 10px 12px;
  min-width: 0;
}

.cal-dato > span {
  display: block;
  font-size: 0.7em;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-dim);
  margin-bottom: 2px;
}

.cal-contacto {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 0.82em;
  margin-top: 4px;
}

.cal-contacto a {
  color: var(--primario);
  font-weight: 600;
  text-decoration: none;
}

.cal-notas-cliente {
  font-size: 0.86em;
  background: var(--navy-elevada);
  border-radius: var(--radio-chico);
  padding: 10px 12px;
  margin-bottom: 12px;
  white-space: pre-wrap;
}

.cal-notas-cliente span {
  display: block;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-dim);
  margin-bottom: 4px;
}

.cal-tentativo {
  border: 1px dashed var(--border);
  border-radius: var(--radio-chico);
  padding: 12px;
  margin-bottom: 12px;
}

.cal-tentativo p {
  margin-top: 0;
  font-size: 0.9em;
}

.cal-seccion-titulo {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-dim);
  margin: 6px 0 4px;
}

.cal-checklist {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 6px;
  margin-bottom: 14px;
}

.cal-paso {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin: 0;
  padding: 9px 10px;
  text-align: left;
  background: var(--navy-elevada);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radio-chico);
  box-shadow: none;
  font-weight: 500;
  cursor: pointer;
}

.cal-paso:hover {
  filter: none;
  border-color: var(--ok);
}

.cal-paso.hecho {
  background: var(--ok-fondo);
  border-color: color-mix(in srgb, var(--ok) 40%, transparent);
}

.cal-paso-check {
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid var(--border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85em;
  background: var(--navy-panel);
}

.cal-paso.hecho .cal-paso-check {
  background: var(--ok);
  border-color: var(--ok);
  color: #fff;
}

.cal-paso-texto {
  display: flex;
  flex-direction: column;
  font-size: 0.88em;
  line-height: 1.25;
}

.cal-paso-texto small {
  color: var(--text-dim);
  font-size: 0.82em;
  margin-top: 2px;
}

.cal-agenda-form {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.cal-campo-ancho {
  grid-column: 1 / -1;
}

.cal-campo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85em;
}

.cal-campo > span {
  color: var(--text-dim);
  font-size: 0.9em;
}

.cal-ficha-acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border-top: 1px solid var(--border);
  padding-top: 12px;
}

.cal-ficha-acciones > * {
  width: auto;
}

.cal-enlace-boton {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  border-radius: var(--radio-chico);
  font-weight: 600;
}

.cal-fecha-enlace {
  width: auto;
  margin: 0;
  padding: 2px 6px;
  background: transparent;
  color: var(--primario);
  border: 0;
  box-shadow: none;
  font-weight: 600;
  font-size: 0.95em;
  cursor: pointer;
  white-space: nowrap;
}

.cal-fecha-enlace:hover {
  text-decoration: underline;
  filter: none;
}

@media (max-width: 720px) {
  .cal-celda {
    min-height: 64px;
    padding: 4px;
  }

  .cal-pill {
    font-size: 0;
    height: 6px;
    padding: 0;
  }

  .cal-pill b {
    display: none;
  }

  .cal-copitas {
    display: none;
  }

  .cal-agenda-form {
    grid-template-columns: 1fr 1fr;
  }

  .cal-nav h2 {
    min-width: 0;
    font-size: 1.05em;
  }
}
```


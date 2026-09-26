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

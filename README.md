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

**No emite facturas con validez fiscal todavía** — los puntos de emisión
están en modo borrador (`es_borrador = true`, `cai = null`) hasta confirmar
el RTN y el CAI vigente con el contador (ver `docs/ENTREGABLE-1.md`).

**No probado en runtime contra Supabase real** — el código pasó
`node --check` (backend) y `vite build` (frontend) sin errores, pero nadie
lo ha corrido todavía contra la base de datos real porque la `service_role
key` sólo está en el dashboard de Supabase, no en esta sesión. Antes de usarlo
con cajeros reales: crear el primer usuario admin (ver abajo), correr
`npm run dev` en ambos lados con las claves reales, y probar el flujo
completo de una venta.

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

## Crear el primer usuario (admin)

1. En el dashboard de Supabase → Authentication → Users → "Add user", crear el
   usuario de Juan con su correo y una contraseña.
2. Copiar el UUID del usuario creado.
3. En el SQL Editor de Supabase:

```sql
insert into perfiles (id, nombre, rol, sucursal_id)
values ('<uuid-del-usuario>', 'Juan Funes', 'admin', null);
```

(`sucursal_id = null` para el admin porque opera sobre las 4 sucursales.)

## Despliegue en Render

1. Conectar este repositorio en el dashboard de Render como Web Service (Render
   lee `render.yaml` automáticamente).
2. Completar las variables de entorno marcadas `sync: false`:
   - `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API →
     service_role — **nunca** exponerla en el frontend).
   - `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (la anon/publishable key,
     esa sí es segura de exponer).
3. Cada push a `main` dispara un deploy automático.

## Tests

Pendiente (se agregan junto con la lógica de negocio de facturación en la
Fase 4 — motor de correlativo/CAI).

# Entregable 1 — Esquema, estructura, despliegue y preguntas fiscales

## 1. Hallazgo confirmado en el manual de WizPOS

Revisé `WizPOS_Manual_Completo_v2.md.docx` completo. En la sección 19.2
(`/api/parametros/formatofactura?idSucursal=1`, instancia Progreso, hoy cerrada)
se confirma exactamente lo que anticipaba el prompt original:

| Campo | Valor en WizPOS |
|---|---|
| `rtn` | `null` — RTN de la empresa no configurado |
| `caee` / `cdesde` / `chasta` | `null` — CAI y rango no configurados |
| `prefijoNumeroFactura` | `null` |

Es decir: en Progreso, la numeración `001-001-01-XXXXXXXX` que imprimía WizPOS
era un correlativo interno del software, sin CAI cargado en ese endpoint. Esto
**no prueba que las otras 4 sucursales activas tengan el mismo vacío** — cada
una es una instancia WizPOS independiente (`inversionesmilano.wizpos.cloud`,
`inversionesmilanoexpress.wizpos.cloud`, `inversionesmilanomackey.wizpos.cloud`,
`invmilanoproceres.wizpos.cloud`) con su propia configuración. Hay que revisar
el mismo endpoint en cada una (o pedírselo a soporte WizPOS) antes de asumir
nada. Ver pregunta 1 más abajo.

## 2. Esquema de datos (aplicado ya en Supabase)

Proyecto Supabase creado: **`italo-facturacion`** (ref `bxifnabilsyqpmhqkeiw`,
org `Juanfunes25's Org`, región `us-east-1`). Migración inicial aplicada con
13 tablas:

- **`sucursales`** — las 4 activas, ya sembradas (Los Andes, 10 Calle EXPRESS,
  Mackey, Próceres).
- **`puntos_emision`** — CAI + rango de correlativos por sucursal.
  `es_borrador = true` y `cai = null` mientras no haya CAI confirmado por el
  SAR (así el sistema puede operar ya en modo interno sin arriesgar validez
  fiscal). Un `check` constraint impide que el correlativo se salga del rango
  autorizado.
- **`perfiles`** — ligado 1:1 a `auth.users` de Supabase Auth. Campos
  `rol` (`admin`/`manager`/`cajero`), `sucursal_id`, `cierre_ciego`,
  `sin_horario`, `activo` — réplica directa de los flags de WizPOS.
- **`categorias`**, **`productos`** — código, nombre, precio, hasta 3 tasas de
  impuesto (`impuesto1_tasa` default 0.15 = ISV, `impuesto2_tasa`/
  `impuesto3_tasa` en 0 para exentos/exonerados, igual que WizPOS).
- **`clientes`** — con fila fija "Consumidor Final" (`es_consumidor_final =
  true`), RTN opcional, flag `exento_impuestos`.
- **`formas_pago`** — catálogo simple (Efectivo, Tarjeta, Transferencia).
- **`ventas`** — cabecera de factura: correlativo, `numero_factura` (formato
  `NNN-NNN-NN-NNNNNNNN`), desglose de subtotales por tasa (exento/exonerado/
  gravado 15%), estado (`abierta`/`pagada`/`anulada`/`borrador` — cubre
  "Órdenes Abiertas" de WizPOS), `tipo_orden` (restaurante/para_llevar,
  nullable — ver pregunta 7).
- **`detalle_venta`** — líneas de producto, con snapshot del nombre y precio
  al momento de la venta (para que un cambio de precio futuro no altere
  facturas ya emitidas).
- **`venta_pagos`** — permite pago dividido (ej. mitad efectivo, mitad
  tarjeta).
- **`cierres_caja`** — replica los campos de WizPOS: fondo de caja, salidas,
  propinas, descuentos, y el rango `factura_desde`/`factura_hasta` del turno
  (clave para conciliar con el CAI). Flag `cierre_ciego` como snapshot.
- **`notas_credito`** — anulaciones, con `usuario_id` de quién la emite (ver
  pregunta 9).
- **`caja_chica`** — incluida en el esquema para no migrar después, pero fuera
  del alcance funcional del MVP hasta que se confirme si se necesita.

RLS está activo en las 13 tablas. Las escrituras de negocio (ventas, cierres,
notas de crédito) sólo las hace el backend con la `service_role` key —
así se garantiza que la asignación de correlativo sea atómica y nunca se salte
un número. El advisor de Supabase marca 8 tablas como "RLS enabled, sin
policy": es intencional (nadie debe escribir esas tablas directo desde el
cliente), pero lo dejo anotado para no confundirlo con un descuido.

## 3. Estructura de carpetas

```
italo-facturacion/
├── backend/
│   ├── server.js              # Express: rutas /api/*, sirve el build del frontend
│   ├── db.js                  # cliente Supabase (service_role)
│   ├── middleware/
│   │   ├── auth.js            # verifica JWT de Supabase Auth → req.perfil
│   │   └── requireRole.js     # gate por rol (admin/manager/cajero)
│   ├── package.json
│   └── .env.example
├── frontend/                  # React + Vite, PWA (vite-plugin-pwa)
│   ├── src/
│   │   ├── App.jsx            # login + home (fase 1); POS llega en fase 3
│   │   ├── supabaseClient.js
│   │   └── index.css          # paleta navy/terracota/gold, Barlow Condensed + Inter
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── supabase/
│   └── migrations/
│       └── 0001_init.sql      # esquema completo, ya aplicado
├── docs/
│   └── ENTREGABLE-1.md        # este documento
├── render.yaml
└── README.md
```

Mismo patrón que `wizpos-dashboard` / `italo-reposicion`: un solo servicio
Render que compila el frontend y lo sirve estático desde el backend Express.

## 4. Plan de despliegue

1. **Supabase** — ya provisionado (`italo-facturacion`, ref
   `bxifnabilsyqpmhqkeiw`). Pendiente: crear el usuario admin (Juan) en
   Authentication → Users y su fila en `perfiles` (instrucciones en el
   README).
2. **GitHub** — repo `Juanfunes25/italo-facturacion` (privado). *Pendiente de
   crear — el GitHub App de esta sesión no tiene permiso para crear repos a
   nivel de cuenta (403 al intentarlo). Falta que lo crees vacío desde
   github.com/new y yo lo adjunto a la sesión para empujar todo este código.*
3. **Render** — Web Service nuevo apuntando al repo, `render.yaml` ya en la
   raíz. Variables de entorno: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
4. Deploy automático en cada push a `main`, igual que el resto del
   ecosistema.

## 5. Las 9 preguntas (sección 7 del prompt original)

Reordenadas por urgencia. Las primeras dos bloquean el motor de CAI (fase 4);
el resto son decisiones de producto que puedo asumir con un default razonable
si prefieres avanzar sin pausar — lo digo explícitamente donde aplica.

1. **RTN y CAI reales.** ¿Cuál es el RTN de Inversiones Milano S de R.L.? ¿Ya
   confirmaste con tu contador si el CAI que usan hoy Los Andes, 10 Calle,
   Mackey y Próceres está vigente ante el SAR? Necesito CAI, rango autorizado
   y fecha límite de emisión reales por sucursal (o uno solo, ver pregunta 2)
   para activar el modo fiscal real. **Bloquea la fase 4.**
2. ~~¿Un CAI por empresa o uno por sucursal?~~ **Respondida:** uno por
   sucursal. Ya hay 4 filas en `puntos_emision` (una por Los Andes, 10 Calle
   EXPRESS, Mackey, Próceres) con CAI **ficticio** para poder testear
   (`supabase/seed_datos_prueba.sql`), y el alta de una sucursal nueva crea
   automáticamente su propio punto de emisión en modo borrador — no hay
   límite de sucursales en el esquema.
3. **Modo borrador mientras se resuelve 1.** Ya lo dejé activado por default
   (`es_borrador = true` en las 4 sucursales) — el sistema puede operar y
   generar "facturas" internas desde ya, marcadas visualmente como sin
   validez fiscal, y el día que llegue el CAI real sólo se actualiza esa fila.
   Si prefieres que no emita nada, ni siquiera en borrador, hasta tener el
   CAI, dime y lo desactivo.
4. **Impresoras térmicas.** Asumo que sí, mismas Epson TM-T20II/Bixolon/Star
   de 40-48 columnas que ya tienen — así el ticket no cambia de formato para
   el cajero. Si prefieres solo PDF + impresora normal, es un cambio menor en
   la fase 5.
5. **Modo offline por caída de internet.** Ambigua y con costo real de
   implementación (sync posterior, resolución de conflictos de correlativo).
   Mi default: dejarlo para una fase posterior al MVP, y en su lugar
   monitorear qué tan estable es el internet real de cada sucursal antes de
   invertir en eso. Dime si alguna sucursal ya sabes que tiene conexión
   inestable y lo prioritizo antes.
6. **Confirmo:** este sistema NO maneja inventario — eso sigue en
   `italo-produccion`/Sheets. Venta + factura + cierre de caja únicamente.
7. **Modal "Restaurante / Para Llevar".** Lo dejé en el esquema como campo
   opcional (`tipo_orden`, puede ser `null`). Mi default: no mostrarlo en el
   POS a menos que confirmes que usas ese reporte de WizPOS
   (`Llevar-Restaurante`) para algo hoy — si no, es una pantalla extra sin
   valor para el cajero.
8. **Cierre Ciego.** Lo mantengo — ya está en el esquema (`perfiles.cierre_ciego`,
   `cierres_caja.cierre_ciego`), es control interno de bajo costo y no hay
   razón para quitarlo.
9. **Quién anula facturas / notas de crédito.** En WizPOS ni tu propio usuario
   tiene ese permiso hoy. Mi default: sólo `admin` (tú) puede anular en el
   sistema nuevo — igual de restrictivo que hoy, pero al menos sí lo puedes
   hacer tú mismo. Dime si quieres sumar `manager`.

**Lo único que de verdad me detiene antes de programar el motor de CAI son las
preguntas 1 y 2.** Todo lo demás lo puedo seguir construyendo (catálogo,
clientes, POS, cierre) con los defaults de arriba mientras resuelves eso con
tu contador.

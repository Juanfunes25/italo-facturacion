# Prompt para crear EcoStone (sesión nueva de Claude Code)

Cómo usarlo:

1. Abre una sesión nueva de Claude Code en la web con el repositorio
   **Juanfunes25/italo-facturacion** seleccionado y el mismo entorno que usas
   para Ítalo, con los conectores de GitHub, Supabase y Render activos.
2. Copia todo el bloque de abajo y pégalo como primer mensaje.

```text
Soy Juan Carlos Funes, socio de Italo Gelateria y de EcoStone. Quiero que
construyas y pongas en la nube el sistema de EcoStone, replicando y adaptando
nuestro sistema italo-facturacion. Trabaja de forma autónoma: asume lo
razonable, márcalo como [SUPUESTO] y sigue; pregúntame solo lo que de verdad
bloquee.

## 1. Contexto
- EcoStone es nuestra FÁBRICA DE PIEDRA DE ENCHAPE (piedra artificial de
  concreto moldeado con pigmentos) en San Pedro Sula, Honduras. Produce para
  vender. Tiene UNA sola sucursal: la planta, que también atiende ventas.
- Clientes: constructoras, arquitectos e instaladores, ferreterías y
  distribuidores, y clientes finales.
- Moneda: Lempiras. Hora: America/Tegucigalpa (UTC-6). Interfaz 100% en español.

## 2. Referencia obligatoria (léela antes de escribir código)
- Repo de referencia: Juanfunes25/italo-facturacion. Si no está en esta
  sesión, agrégalo con add_repo. Es SOLO LECTURA: nunca hagas push ahí, ni
  toques su proyecto Supabase (bxifnabilsyqpmhqkeiw) ni su servicio en
  Render (srv-das510jbc2fs739bqsug).
- Lee completos docs/GUIA-REPLICACION.md (arquitectura, lógica, lecciones
  aprendidas y la sección 19 de adaptación a la fábrica) y usa
  docs/CODIGO-COMPLETO.md o el repo para copiar y adaptar el código real. No
  reescribas desde cero lo que ya funciona allá.

## 3. Infraestructura en la nube (hazlo tú con los conectores)
1. GitHub: crea el repo privado Juanfunes25/ecostone-facturacion, agrégalo a
   la sesión (add_repo con acceso push) y trabaja en main.
2. Supabase: crea el proyecto "ecostone" en us-east-1, plan gratis. OJO: mi
   organización ya tiene 2 proyectos activos gratis (ava-legal e
   italo-facturacion) y el plan gratis suele permitir solo 2. Si no te deja
   crearlo, detente y dame las opciones (pausar otro proyecto o pasar a Pro)
   con su costo. No pagues nada sin mi autorización.
3. Aplica las migraciones con apply_migration y guárdalas también en
   supabase/migrations/ numeradas.
4. Render: crea un web service (Node, plan free, rama main, deploy automático
   en cada push) con el mismo patrón de render.yaml de Ítalo: un solo
   servicio que compila el frontend y lo sirve desde Express.
   - Antes de crearlo, pregúntame en qué workspace de Render hacerlo.
   - Revisa las horas gratis del workspace: el plan free da unas 750
     horas/mes compartidas entre todos los servicios gratis, y ya tengo
     varios. Si no alcanzan, avísame con el costo del plan Starter.
5. Variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, GMAIL_USER, GMAIL_APP_PASSWORD.
   - Cárgalas con update_environment_variables.
   - Si no puedes obtener la service_role key con las herramientas, dime el
     paso exacto (Supabase → Project Settings → API Keys) y dónde pegarla en
     Render.
   - Nunca subas secretos al repo; usa .env.example.
6. Crea mi usuario admin: usuario "juan", con una contraseña temporal que me
   das al final.
7. Confirma que funciona en la nube: /api/health y /api/health/db en verde,
   login real y deploy "live". Dame la URL .onrender.com.

## 4. Qué reutilizar tal cual de Ítalo
- Stack Node/Express + React/Vite PWA + Supabase.
- Usuarios con nombre libre, roles, requireAuth/requireRole con bitácora y
  alerta.
- Bloqueo por inactividad y control de dispositivos.
- Motor fiscal: CAI y puntos de emisión, finalizar_venta con correlativo
  atómico, modo borrador con prefijo BORRADOR-, RTN obligatorio sobre el
  umbral, Consumidor Final, notas de crédito/anulación solo admin, y
  reimpresión con motivo y COPIA.
- Ticket térmico de texto (80/58 mm), PDFs con pdfkit y autenticación por
  blob.
- Cierre de caja con cuadre por forma de pago, alerta de descuadre, correo a
  admins y ticket del cierre.
- Bitácora inmutable con cadena de hashes, alertas con estados, reglas
  antifraude configurables y arqueo sorpresa.
- Tiempo real, actualización automática de la PWA con no-cache, fechas en
  hora de Honduras, paginación de más de 1000 filas y CSV.
- Respeta TODAS las lecciones de la sección 18 de la guía.

## 5. Qué adaptar
- UNA sucursal: deja la tabla sucursales con una fila ("Planta EcoStone")
  pero oculta el selector de sucursal y los reportes por sucursal mientras
  haya una sola.
- Cierre de caja: los POS y bancos NO van fijos (en Ítalo son BAC/Ficohsa).
  Haz una tabla configurable de terminales POS y cuentas bancarias, y
  cuadra contra ellas.
- Roles: admin, gerente, vendedor, cajero, bodega/despacho y producción.
  Cada pantalla y cada endpoint con su guarda.
- ISV: el motor debe soportar precio CON ISV incluido (mostrador) y precio +
  ISV SEPARADO (constructoras y distribuidores), según la lista de precios o
  el cliente. [SUPUESTO] hasta que confirme con el contador.
- Descuentos: reemplaza el de tercera edad por descuentos por volumen o por
  tipo de cliente, con tope por rol. Si se pasa del tope, pide autorización
  de un gerente, queda en la bitácora y genera una alerta.

## 6. Módulos de fábrica (lo nuevo)
1. CATÁLOGO DE PIEDRA
   - Producto = modelo + color.
   - Unidad de venta: m², pieza, caja o metro lineal (esquineros).
   - Conversiones por producto: m² por caja, piezas por m², peso por m²
     (para el flete).
   - Accesorios: pegamento/mortero, sellador, esquineros, con su
     rendimiento por m².
   - Listas de precio: público, contratista y distribuidor.
   - No inventes nombres de modelos: deja el catálogo vacío con 2 o 3
     ejemplos marcados [EJEMPLO] y yo cargo los reales.
2. VENTA DE MOSTRADOR (POS adaptado)
   - Se vende por m² y se redondea a cajas completas, mostrando los m² reales
     que se entregan.
   - Descuenta inventario de producto terminado al facturar.
3. COTIZACIÓN DE PROYECTO (adaptar la cotización de eventos)
   - Varias líneas por cotización.
   - m² netos + % de desperdicio (sugerir 5-10%, editable).
   - Accesorios sugeridos automáticamente: esquineros por metro lineal y
     sacos de pegamento según el rendimiento.
   - Flete por zona o km; instalación por m² opcional.
   - Vigencia, PDF de marca EcoStone y envío por correo.
   - Al aceptarla se convierte en PEDIDO.
4. PEDIDOS
   - Anticipo (50% por defecto, configurable) y saldo contra entrega o a
     crédito.
   - Fecha de entrega comprometida.
   - Reserva el inventario disponible; lo que falte genera una ORDEN DE
     PRODUCCIÓN.
5. CALENDARIO (reutiliza el de cotizaciones de Ítalo)
   - Muestra producción, despachos e instalaciones.
   - Lista de control por pedido: anticipo, programado, colado, curado,
     empacado, despachado, instalado y saldo cobrado; cada paso con quién y
     cuándo.
   - Avisos de atraso contra la fecha comprometida.
6. PRODUCCIÓN
   - Órdenes de producción: modelo, color, m²/piezas, moldes, lote, fecha de
     colado, días de curado y fecha disponible.
   - Receta por producto: consumo de materia prima por m² (cemento, arena,
     agregado, pigmento, desmoldante, etc.).
   - Registro del consumo real contra la receta, merma y piezas de segunda.
   - Al terminar el curado, entra al inventario de producto terminado.
7. INVENTARIO
   - Producto terminado por modelo + color + lote (m² y piezas).
   - Materia prima con unidad y costo promedio.
   - Movimientos: compra (proveedor y factura), consumo de producción,
     producción terminada, venta/despacho, merma, y ajuste con motivo
     obligatorio.
   - Kardex por artículo, conteo físico sorpresa y alertas de stock mínimo.
8. COSTEO
   - Costo por m² = materia prima según receta × costo promedio + mano de
     obra + indirectos (configurables).
   - Margen por producto, por cotización y por pedido.
   - Algunos insumos pueden venir en USD (pigmentos): guarda la moneda y un
     tipo de cambio editable; no asumas precios fijos.
9. DESPACHOS
   - Guía de remisión obligatoria para que salga producto de la planta,
     ligada a una factura o a un pedido con anticipo.
   - Datos: vehículo, conductor, destino, quién recibe y foto/firma opcional
     (Supabase Storage).
   - Despacho parcial permitido.
10. CUENTAS POR COBRAR
   - Crédito por cliente con límite y plazo.
   - Abonos con recibo, estado de cuenta en PDF, antigüedad
     (0-30/31-60/61-90/+90) y alertas de vencidos.
11. REPORTES Y DASHBOARD
   - Ventas en L y m² por modelo, color, cliente y tipo de cliente.
   - Producción contra ventas, mermas y rendimiento de receta.
   - Inventario valorizado, cuentas por cobrar, margen e ISV.
   - Exportación a CSV.
12. ANTIFRAUDE DE FÁBRICA (sumado al de Ítalo)
   - Despacho sin factura ni pedido: alerta crítica.
   - Producido contra lo que entró a inventario; consumo real contra receta.
   - Ajustes de inventario sin motivo o repetidos.
   - Precio bajo la lista o descuento sobre el tope.
   - Crédito que pasa el límite y abonos en efectivo sin recibo.
   - Merma sobre lo normal.
   - Todo en la pantalla Antifraude, con reglas configurables.

## 7. Diseño
- Misma calidad visual que Ítalo: barra lateral por grupos y roles, tokens
  CSS en :root, modo oscuro, Poppins + Inter, sin librerías de UI.
- Paleta "piedra" provisional (grafito, arena, piedra cálida y un acento
  verde musgo), toda en tokens para cambiarla cuando te pase logo y colores
  de EcoStone.
- Datos de empresa en un solo archivo (empresa.js) con [PENDIENTE]: razón
  social, RTN, dirección, teléfono y redes.

## 8. Forma de trabajo
- Fases, cada una con commit + push a main, deploy en Render verificado y un
  resumen corto:
  - F0: infraestructura, login y admin en la nube.
  - F1: catálogo, clientes, listas de precio, motor fiscal, POS, facturas,
    impresión y cierre.
  - F2: cotización de proyecto, pedidos y calendario.
  - F3: producción, recetas, inventario y costeo.
  - F4: despachos y cuentas por cobrar.
  - F5: reportes, dashboard y antifraude de fábrica.
  - F6: debug general y docs/GUIA-ECOSTONE.md con la misma estructura que la
    guía de Ítalo.
- Pruebas: todo cálculo de dinero (ISV incluido o separado, descuentos,
  conversión m²→cajas, costeo) con pruebas automáticas, y verificación
  aleatoria de que el cálculo del frontend y el del backend den igual.
- Nunca force-push, reset --hard, ni borrar ramas o historial sin
  preguntarme.
- Puntos de emisión en MODO BORRADOR hasta que te dé el CAI real de EcoStone.
- Al inicio hazme UNA sola tanda de preguntas, sin detenerte mientras
  respondo:
  - razón social y RTN;
  - CAI;
  - modelos, colores y precios;
  - POS y bancos;
  - ISV incluido o separado;
  - anticipos;
  - crédito;
  - logo y colores.
- Entrega final: URL en la nube, usuario admin, lista de pendientes y cómo
  cargar el catálogo real.
```

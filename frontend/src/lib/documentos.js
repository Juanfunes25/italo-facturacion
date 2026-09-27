// PDFs y tickets requieren el token de sesión (Authorization: Bearer), así
// que NO se pueden abrir con un <a href="/api/..."> directo: el navegador no
// manda ese encabezado y el servidor responde 401. Por eso se piden con
// fetch y se muestran/imprimen desde un blob.

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
    res = await fetch(`/api${path}`, { headers: { Authorization: `Bearer ${session.access_token}` } });
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

export async function imprimirTicket(ventaId, session, { reimpresion = false } = {}) {
  const { columnas } = leerConfigImpresora();
  const motivo = reimpresion ? '&motivo=reimpresion' : '';
  const html = await (await pedir(`/ventas/${ventaId}/ticket?columnas=${columnas}${motivo}`, session)).text();
  await imprimirHtml(html);
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

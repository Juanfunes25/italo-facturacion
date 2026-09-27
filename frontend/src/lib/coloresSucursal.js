// Color fijo por sucursal, para que un cajero nunca confunda en cuál está
// facturando. Se deriva del id (UUID) de la sucursal con un hash simple —
// NO del orden en que llega la lista — así el color de "Los Andes" nunca
// cambia aunque se agregue una sucursal nueva antes en el alfabeto o el
// orden del API cambie. Mismos 4 colores categóricos que el Dashboard
// (validados con el skill dataviz contra el fondo navy).
const PALETA = ['var(--serie-1)', 'var(--serie-2)', 'var(--serie-3)', 'var(--serie-4)'];

function hashEstable(texto) {
  let h = 0;
  for (let i = 0; i < texto.length; i++) {
    h = (h * 31 + texto.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function colorSucursal(sucursalId) {
  if (!sucursalId) return 'var(--text-dim)';
  return PALETA[hashEstable(sucursalId) % PALETA.length];
}

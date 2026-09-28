import { crearAlerta } from './alertas.js';
import { horaHn } from './fechas.js';

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

export function alertaFueraDeHorario(req, accion) {
  if (req.perfil?.sin_horario || req.perfil?.rol === 'admin') return;
  if (!fueraDeHorario()) return;
  if (throttled(`horario:${req.perfil?.id}`, 120)) return;
  crearAlerta(req, {
    tipo: 'horario.fuera',
    severidad: 'media',
    titulo: `${req.perfil?.nombre ?? 'Un usuario'} usó el sistema fuera de horario`,
    sucursalId: req.perfil?.sucursal_id ?? null,
    detalle: { accion, hora: new Date().toLocaleTimeString('es-HN', { timeZone: 'America/Tegucigalpa' }) },
  });
}

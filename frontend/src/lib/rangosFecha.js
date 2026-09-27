function iso(d) {
  return d.toISOString().slice(0, 10);
}

export function rangoHoy() {
  const hoy = new Date();
  return { fechaInicio: iso(hoy), fechaFin: iso(hoy) };
}

export function rangoEstaSemana() {
  const hoy = new Date();
  const diaSemana = (hoy.getDay() + 6) % 7; // lunes = 0
  const inicio = new Date(hoy);
  inicio.setDate(hoy.getDate() - diaSemana);
  return { fechaInicio: iso(inicio), fechaFin: iso(hoy) };
}

export function rangoEsteMes() {
  const hoy = new Date();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  return { fechaInicio: iso(inicio), fechaFin: iso(hoy) };
}

export const ATAJOS_FECHA = [
  { etiqueta: 'Hoy', calcular: rangoHoy },
  { etiqueta: 'Esta semana', calcular: rangoEstaSemana },
  { etiqueta: 'Este mes', calcular: rangoEsteMes },
];

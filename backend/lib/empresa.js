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

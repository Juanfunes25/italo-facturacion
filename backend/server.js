import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './db.js';
import { requireAuth } from './middleware/auth.js';
import { requireRole } from './middleware/requireRole.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Perfil propio: sucursal, rol y flags (cierre ciego, sin horario)
app.get('/api/perfil', requireAuth, (req, res) => {
  res.json(req.perfil);
});

app.get('/api/sucursales', requireAuth, async (req, res) => {
  const { data, error } = await db.from('sucursales').select('*').eq('activo', true);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/categorias', requireAuth, async (req, res) => {
  const { data, error } = await db
    .from('categorias')
    .select('*')
    .eq('activo', true)
    .order('orden');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/productos', requireAuth, async (req, res) => {
  const { data, error } = await db
    .from('productos')
    .select('*, categorias(nombre)')
    .eq('activo', true)
    .order('nombre');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/productos', requireAuth, requireRole('admin', 'manager'), async (req, res) => {
  const { codigo, nombre, categoria_id, precio, impuesto1_tasa } = req.body;
  if (!nombre || precio === undefined) {
    return res.status(400).json({ error: 'nombre y precio son obligatorios' });
  }
  const { data, error } = await db
    .from('productos')
    .insert({ codigo, nombre, categoria_id, precio, impuesto1_tasa: impuesto1_tasa ?? 0.15 })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.get('/api/clientes', requireAuth, async (req, res) => {
  const busqueda = req.query.q?.trim();
  let query = db.from('clientes').select('*').order('nombre');
  if (busqueda) query = query.or(`nombre.ilike.%${busqueda}%,rtn.ilike.%${busqueda}%`);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/clientes', requireAuth, async (req, res) => {
  const { nombre, rtn, direccion, telefono, email, exento_impuestos } = req.body;
  if (!nombre) return res.status(400).json({ error: 'nombre es obligatorio' });
  const { data, error } = await db
    .from('clientes')
    .insert({ nombre, rtn, direccion, telefono, email, exento_impuestos: !!exento_impuestos })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// Sirve el build del frontend (mismo patrón que italo-reposicion: un solo
// servicio Render, backend + frontend estático).
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'));
});

const port = process.env.PORT || 4200;
app.listen(port, () => console.log(`italo-facturacion backend escuchando en :${port}`));

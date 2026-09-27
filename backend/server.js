import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './db.js';
import { requireAuth } from './middleware/auth.js';
import { categorias } from './routes/categorias.js';
import { productos } from './routes/productos.js';
import { clientes } from './routes/clientes.js';
import { puntosEmision } from './routes/puntosEmision.js';
import { ventas } from './routes/ventas.js';
import { notasCredito } from './routes/notasCredito.js';
import { cierres } from './routes/cierres.js';
import { reportes } from './routes/reportes.js';
import { cajaChica } from './routes/cajaChica.js';
import { usuarios } from './routes/usuarios.js';
import { facturaImpresion } from './routes/facturaImpresion.js';
import { sucursales } from './routes/sucursales.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Diagnóstico sin login: confirma si SUPABASE_SERVICE_ROLE_KEY quedó bien
// configurada en el entorno de despliegue, sin tener que entrar a la app.
app.get('/api/health/db', async (req, res) => {
  const { error } = await db.from('sucursales').select('id').limit(1);
  if (error) return res.status(500).json({ ok: false, error: error.message });
  res.json({ ok: true });
});

app.use('/api', requireAuth);

// Perfil propio: sucursal, rol y flags (cierre ciego, sin horario)
app.get('/api/perfil', (req, res) => res.json(req.perfil));

app.get('/api/formas-pago', async (req, res) => {
  const { data, error } = await db.from('formas_pago').select('*').order('nombre');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.use('/api/sucursales', sucursales);
app.use('/api/categorias', categorias);
app.use('/api/productos', productos);
app.use('/api/clientes', clientes);
app.use('/api/puntos-emision', puntosEmision);
app.use('/api/ventas', ventas);
app.use('/api/ventas', facturaImpresion); // /api/ventas/:id/ticket, /api/ventas/:id/pdf
app.use('/api/notas-credito', notasCredito);
app.use('/api/cierres', cierres);
app.use('/api/reportes', reportes);
app.use('/api/caja-chica', cajaChica);
app.use('/api/usuarios', usuarios);

// Sirve el build del frontend (mismo patrón que italo-reposicion: un solo
// servicio Render, backend + frontend estático).
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.use('/api', (req, res) => res.status(404).json({ error: 'No encontrado' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno' });
});

const port = process.env.PORT || 4200;
app.listen(port, () => console.log(`italo-facturacion backend escuchando en :${port}`));

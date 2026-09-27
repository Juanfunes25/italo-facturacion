import { Router } from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/requireRole.js';

export const usuarios = Router();

usuarios.get('/', requireRole('admin'), async (req, res) => {
  const { data, error } = await db.from('perfiles').select('*, sucursales(nombre)').order('nombre');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Crea el usuario en Supabase Auth y su perfil en un solo paso — así Juan no
// depende del dashboard de Supabase para dar de alta a un cajero nuevo.
usuarios.post('/', requireRole('admin'), async (req, res) => {
  const { email, password, nombre, rol, sucursal_id, cierre_ciego, sin_horario } = req.body;
  if (!email || !password || !nombre) {
    return res.status(400).json({ error: 'email, password y nombre son obligatorios' });
  }

  const { data: authData, error: authError } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) return res.status(400).json({ error: authError.message });

  const { data: perfil, error: perfilError } = await db
    .from('perfiles')
    .insert({
      id: authData.user.id,
      nombre,
      rol: rol ?? 'cajero',
      sucursal_id: sucursal_id ?? null,
      cierre_ciego: !!cierre_ciego,
      sin_horario: !!sin_horario,
    })
    .select()
    .single();
  if (perfilError) {
    await db.auth.admin.deleteUser(authData.user.id);
    return res.status(500).json({ error: perfilError.message });
  }

  res.status(201).json(perfil);
});

usuarios.put('/:id', requireRole('admin'), async (req, res) => {
  const { nombre, rol, sucursal_id, cierre_ciego, sin_horario, activo } = req.body;
  const { data, error } = await db
    .from('perfiles')
    .update({ nombre, rol, sucursal_id, cierre_ciego, sin_horario, activo })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Para que Juan pueda resetear la contraseña de un cajero sin tener que
// entrar al dashboard de Supabase.
usuarios.post('/:id/reset-password', requireRole('admin'), async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }
  const { error } = await db.auth.admin.updateUserById(req.params.id, { password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});

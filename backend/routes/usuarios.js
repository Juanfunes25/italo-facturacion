import { Router } from 'express';
import { db } from '../db.js';
import { requireRole } from '../middleware/requireRole.js';
import { registrarAuditoria } from '../lib/auditoria.js';

export const usuarios = Router();

// Supabase Auth siempre pide un correo. Para cajeros que entran con un
// nombre de usuario (sin correo real) se usa un correo interno en este
// dominio, que nunca recibe mensajes. La pantalla de login hace la misma
// traducción: si lo escrito no tiene "@", le agrega este dominio.
const DOMINIO_USUARIOS = 'italo.local';
const USUARIO_VALIDO = /^[a-z0-9._-]{3,30}$/;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function accesoAEmail(acceso) {
  const texto = String(acceso ?? '').trim().toLowerCase();
  if (texto.includes('@')) {
    if (!CORREO_VALIDO.test(texto)) throw new Error('El correo no tiene un formato válido');
    return texto;
  }
  if (!USUARIO_VALIDO.test(texto)) {
    throw new Error('El usuario debe tener de 3 a 30 caracteres: letras, números, punto, guion o guion bajo (sin espacios)');
  }
  return `${texto}@${DOMINIO_USUARIOS}`;
}

function accesoVisible(email) {
  if (!email) return null;
  return email.endsWith(`@${DOMINIO_USUARIOS}`) ? email.slice(0, -(DOMINIO_USUARIOS.length + 1)) : email;
}

usuarios.get('/', requireRole('admin'), async (req, res) => {
  const { data, error } = await db.from('perfiles').select('*, sucursales(nombre)').order('nombre');
  if (error) return res.status(500).json({ error: error.message });

  const { data: authData } = await db.auth.admin.listUsers({ perPage: 200 });
  const correoPorId = new Map((authData?.users ?? []).map((u) => [u.id, u.email]));
  res.json(data.map((u) => ({ ...u, acceso: accesoVisible(correoPorId.get(u.id)) })));
});

// Crea el usuario en Supabase Auth y su perfil en un solo paso — así Juan no
// depende del dashboard de Supabase para dar de alta a un cajero nuevo.
usuarios.post('/', requireRole('admin'), async (req, res) => {
  const { acceso, password, nombre, rol, sucursal_id, cierre_ciego, sin_horario } = req.body;
  if (!acceso || !password || !nombre) {
    return res.status(400).json({ error: 'Usuario (o correo), contraseña y nombre son obligatorios' });
  }
  if (password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });

  let email;
  try {
    email = accesoAEmail(acceso);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  const { data: authData, error: authError } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) {
    const yaExiste = /already|registered|exists/i.test(authError.message);
    return res.status(400).json({ error: yaExiste ? `Ya existe un usuario "${accesoVisible(email)}"` : authError.message });
  }

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

  await registrarAuditoria(req, {
    accion: 'usuario.crear',
    entidad: 'usuario',
    entidadId: perfil.id,
    sucursalId: perfil.sucursal_id,
    detalle: { nombre, acceso: accesoVisible(email), rol: perfil.rol },
  });
  res.status(201).json({ ...perfil, acceso: accesoVisible(email) });
});

usuarios.put('/:id', requireRole('admin'), async (req, res) => {
  const { nombre, rol, sucursal_id, cierre_ciego, sin_horario, activo } = req.body;
  const { data: anterior } = await db.from('perfiles').select('*').eq('id', req.params.id).maybeSingle();
  const { data, error } = await db
    .from('perfiles')
    .update({ nombre, rol, sucursal_id, cierre_ciego, sin_horario, activo })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  if (anterior) {
    const cambios = {};
    for (const campo of ['nombre', 'rol', 'sucursal_id', 'cierre_ciego', 'sin_horario', 'activo']) {
      if (String(anterior[campo]) !== String(data[campo])) cambios[campo] = { antes: anterior[campo], despues: data[campo] };
    }
    if (Object.keys(cambios).length > 0) {
      await registrarAuditoria(req, {
        accion: 'usuario.editar',
        entidad: 'usuario',
        entidadId: data.id,
        sucursalId: data.sucursal_id,
        detalle: { nombre: data.nombre, cambios },
      });
    }
  }
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
  await registrarAuditoria(req, {
    accion: 'usuario.cambiar_contrasena',
    entidad: 'usuario',
    entidadId: req.params.id,
  });
  res.json({ ok: true });
});

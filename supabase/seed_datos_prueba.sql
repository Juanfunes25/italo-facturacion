-- Datos de PRUEBA para poder usar el sistema de punta a punta mientras se
-- confirma el CAI real con el contador. No son datos fiscales válidos — los
-- puntos_emision quedan con es_borrador = true a propósito, así el ticket y
-- el PDF siguen mostrando la advertencia "sin validez fiscal" aunque el
-- campo cai ya no esté vacío. Ya se corrió una vez contra el proyecto
-- italo-facturacion (ref bxifnabilsyqpmhqkeiw); este archivo queda como
-- referencia/runbook, no hace falta volver a correrlo salvo que se
-- reconstruya la base desde cero.

-- 1) Usuario admin (Juan). Requiere pgcrypto (ya está habilitado en
--    0001_init.sql). Cambiar el email/password antes de correrlo en otro
--    ambiente.
do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_email text := 'juancarlosocchiena@gmail.com';
  v_password text := 'CAMBIAR-ESTA-CONTRASENA';
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    is_sso_user, is_anonymous
  ) values (
    '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
    v_email, crypt(v_password, gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', false,
    '', '', '', '',
    false, false
  );

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), v_user_id, v_user_id::text,
    jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
    'email', now(), now(), now()
  );

  insert into perfiles (id, nombre, rol, sucursal_id, cierre_ciego, sin_horario, activo)
  values (v_user_id, 'Juan Funes', 'admin', null, false, true, true);
end $$;

-- 2) CAI ficticio por sucursal, sólo para pruebas — NUNCA usar estos números
--    para facturar de verdad. Formato de 32 caracteres igual al real del
--    SAR, pero generado al azar.
update puntos_emision pe set
  punto_emision_codigo = v.codigo,
  cai = v.cai,
  correlativo_desde = 1,
  correlativo_hasta = 5000,
  correlativo_actual = 1,
  fecha_limite_emision = current_date + interval '1 year'
from (values
  ('los_andes', '001', 'E8D654-27036A-97199A-35E7F2-D1295F-84'),
  ('10_calle_express', '002', '555248-1A75B3-3E8056-1396FC-987C68-5A'),
  ('mackey', '003', '20E570-89D73F-3344A1-9B8C82-5B7EFD-09'),
  ('proceres', '004', '2F4851-96A881-B76670-CE6CCE-48D250-3E')
) as v(alias, codigo, cai)
join sucursales s on s.alias = v.alias
where pe.sucursal_id = s.id;

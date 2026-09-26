async function llamar(method, path, session, body) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const texto = await res.text();
  const datos = texto ? JSON.parse(texto) : null;
  if (!res.ok) throw new Error(datos?.error || `Error ${res.status}`);
  return datos;
}

export const api = {
  get: (path, session) => llamar('GET', path, session),
  post: (path, session, body) => llamar('POST', path, session, body),
  put: (path, session, body) => llamar('PUT', path, session, body),
  del: (path, session) => llamar('DELETE', path, session),
};

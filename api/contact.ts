/// <reference types="node" />
// Vercel Function: receives the contact form, verifies Turnstile, sends the email through Resend.
// Secrets live only in Vercel env vars: RESEND_API_KEY, CONTACT_TO_EMAIL, TURNSTILE_SECRET_KEY.

export interface ContactInput {
  name: string;
  email: string;
  message: string;
  token: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Returns the cleaned input, or an error message safe to show to the visitor.
export function validate(body: unknown): { ok: true; data: ContactInput } | { ok: false; error: string } {
  if (typeof body !== 'object' || body === null) return { ok: false, error: 'Solicitud inválida.' };
  const b = body as Record<string, unknown>;
  // Honeypot: humans never see this field, bots fill it.
  if (typeof b.website === 'string' && b.website.trim() !== '') return { ok: false, error: 'Solicitud inválida.' };

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const name = str(b.name).replace(/[\r\n]+/g, ' ');
  const email = str(b.email);
  const message = str(b.message);
  const token = str(b.token);

  if (name.length < 2 || name.length > 100) return { ok: false, error: 'Escribe un nombre de 2 a 100 caracteres.' };
  if (email.length > 254 || !EMAIL_RE.test(email)) return { ok: false, error: 'Escribe un correo válido.' };
  if (message.length < 10 || message.length > 5000) return { ok: false, error: 'El mensaje debe tener entre 10 y 5000 caracteres.' };
  if (!token) return { ok: false, error: 'Completa la verificación antispam.' };
  return { ok: true, data: { name, email, message, token } };
}

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export async function POST(request: Request): Promise<Response> {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, TURNSTILE_SECRET_KEY } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !TURNSTILE_SECRET_KEY) {
    console.error('contact: missing env vars');
    return json(503, { ok: false, error: 'El formulario no está disponible ahora. Escríbeme por LinkedIn.' });
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json(415, { ok: false, error: 'Solicitud inválida.' });
  }
  const raw = await request.text();
  if (raw.length > 20_000) return json(413, { ok: false, error: 'El mensaje es demasiado largo.' });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: 'Solicitud inválida.' });
  }
  const result = validate(body);
  if (!result.ok) return json(400, result);
  const { name, email, message, token } = result.data;

  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({
      secret: TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '',
    }),
  }).then((r) => r.json() as Promise<{ success: boolean }>).catch(() => ({ success: false }));
  if (!verify.success) return json(400, { ok: false, error: 'No pudimos verificar que eres humano. Recarga la página e inténtalo otra vez.' });

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Portafolio <onboarding@resend.dev>',
      to: [CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `Portafolio: mensaje de ${name}`,
      text: `Nombre: ${name}\nCorreo: ${email}\n\n${message}`,
    }),
  }).catch(() => null);
  if (!sent?.ok) {
    console.error('contact: resend failed', sent?.status);
    return json(502, { ok: false, error: 'No se pudo enviar el mensaje. Inténtalo en unos minutos.' });
  }
  return json(200, { ok: true });
}

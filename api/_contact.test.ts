// Run: npm test  (underscore prefix keeps Vercel from deploying it as a route)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate, POST } from './contact.ts';

const good = { name: 'Ana', email: 'ana@example.com', message: 'Hola, me interesa tu perfil.', token: 't' };

test('accepts a valid message and trims it', () => {
  const r = validate({ ...good, name: '  Ana\r\nBcc: x@y.com ' });
  assert.ok(r.ok);
  if (r.ok) assert.equal(r.data.name, 'Ana Bcc: x@y.com');
});

test('rejects filled honeypot, bad email, short message, missing token', () => {
  assert.equal(validate({ ...good, website: 'spam.com' }).ok, false);
  assert.equal(validate({ ...good, email: 'no-at-sign' }).ok, false);
  assert.equal(validate({ ...good, message: 'corto' }).ok, false);
  assert.equal(validate({ ...good, token: '' }).ok, false);
  assert.equal(validate(null).ok, false);
});

test('POST returns 503 without env vars and never leaks internals', async () => {
  delete process.env.RESEND_API_KEY;
  const res = await POST(new Request('http://x/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(good) }));
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.ok, false);
});

test('POST rejects non-JSON and honeypot before calling any external service', async () => {
  process.env.RESEND_API_KEY = 'k'; process.env.CONTACT_TO_EMAIL = 'me@example.com'; process.env.TURNSTILE_SECRET_KEY = 's';
  const realFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('must not call network'); };
  try {
    const r1 = await POST(new Request('http://x', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: 'hi' }));
    assert.equal(r1.status, 415);
    const r2 = await POST(new Request('http://x', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...good, website: 'x' }) }));
    assert.equal(r2.status, 400);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('POST sends via Resend with reply_to when Turnstile passes', async () => {
  process.env.RESEND_API_KEY = 'k'; process.env.CONTACT_TO_EMAIL = 'me@example.com'; process.env.TURNSTILE_SECRET_KEY = 's';
  const calls: { url: string; body: string }[] = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url: String(url), body: String(init.body) });
    return new Response(JSON.stringify({ success: true, id: '1' }), { status: 200 });
  }) as typeof fetch;
  try {
    const res = await POST(new Request('http://x', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(good) }));
    assert.equal(res.status, 200);
    assert.match(calls[0].url, /siteverify/);
    assert.match(calls[1].url, /api\.resend\.com/);
    assert.equal(JSON.parse(calls[1].body).reply_to, 'ana@example.com');
  } finally {
    globalThis.fetch = realFetch;
  }
});

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGO = 'aes-256-gcm';

function resolveKey(): Buffer {
  const raw = process.env.PAYMENT_PII_KEY_BASE64 ?? '';
  if (!raw) {
    // Development fallback: derive a 32-byte key from the session secret so that
    // local runs do not require extra setup. Production MUST set PAYMENT_PII_KEY_BASE64.
    const fallback = process.env.JWT_ACCESS_SECRET ?? 'edupath-dev-pii-secret';
    return Buffer.from(fallback.padEnd(32, '0').slice(0, 32), 'utf8');
  }
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) {
    throw new Error('PAYMENT_PII_KEY_BASE64 must decode to exactly 32 bytes.');
  }
  return key;
}

export function encryptPII(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, resolveKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}.${tag.toString('base64')}.${enc.toString('base64')}`;
}

export function decryptPII(blob: string): string {
  const [ivB64, tagB64, dataB64] = blob.split('.');
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error('Malformed PII ciphertext.');
  }
  const decipher = createDecipheriv(ALGO, resolveKey(), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  const dec = Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64')),
    decipher.final(),
  ]);
  return dec.toString('utf8');
}

export function maskAccountRef(ref: string): string {
  if (!ref) return '';
  if (ref.length <= 4) return '****';
  return `${'*'.repeat(Math.max(0, ref.length - 4))}${ref.slice(-4)}`;
}

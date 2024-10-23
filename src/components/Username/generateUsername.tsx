import * as crypto from 'crypto';

export function generateUsername(name: string): string {
  const hash = crypto.createHash('sha256');
  const uniqueId = hash.update(name + Date.now().toString()).digest('hex').slice(0, 8);
  return `${name.replace(/\s+/g, '').toLowerCase()}-${uniqueId}`;
}
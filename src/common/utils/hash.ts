import * as argon2 from 'argon2';

export async function hashData(data: string): Promise<string> {
  return await argon2.hash(data);
}

export function verifyHash(hashedData: string, data: string): Promise<boolean> {
  if (!hashedData.startsWith('$')) {
    throw new Error('Invalid hash format: Hash must start with "$".');
  }
  return argon2.verify(hashedData, data);
}

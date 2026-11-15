import { sign } from 'jsonwebtoken';

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function createSession(params: {
  email: string;
  name: string;
  picture?: string;
  token: string;
  refreshToken?: string;
}): Promise<{
  token: string;
  expiresAt: string;
}> {
  const secret = process.env.JWT_SECRET || 'dev-secret-key-change-in-production-min-32-chars';
  
  const payload = {
    email: params.email,
    name: params.name,
    picture: params.picture,
    google_token: params.token,
  };

  const token = sign(payload, secret, {
    expiresIn: '24h',
    issuer: 'mailchat',
  });

  return {
    token,
    expiresAt: new Date(Date.now() + SESSION_DURATION).toISOString(),
  };
}

import { Hono } from 'hono';
import { generateOAuthURL } from '@/lib/oauth2';
import { validateCallback } from '@/lib/oauth2-callback';
import { createSession } from '@/lib/session';
import { z } from 'zod';

const app = new Hono();

const GoogleUserInfo = z.object({
  email: z.string(),
  name: z.string(),
  picture: z.string().optional(),
});

/**
 * GET /api/auth/google
 * Redirects to Google OAuth2 consent screen
 */
app.get('/', async (c) => {
  const config = c.env?.GOOGLE || c.req.header('x-google-config');
  
  if (!config?.clientId || !config?.clientSecret) {
    return c.json({
      error: 'google_oauth_not_configured',
      message: 'Google OAuth2 credentials not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.',
    }, 500);
  }

  const redirectUri = `${c.req.url.split('/')[0]}//${c.req.header('host') || 'localhost:3100'}/auth/callback`;
  
  const authUrl = generateOAuthURL({
    clientId: config.clientId,
    redirectUri,
    scope: 'openid email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send',
  });

  return c.redirect(authUrl);
});

/**
 * GET /api/auth/google/callback
 * Handles OAuth2 callback from Google
 */
app.get('/callback', async (c) => {
  const { code, state } = c.req.query();
  
  if (!code) {
    return c.json({ error: 'authorization_code_missing' }, 400);
  }

  const config = c.env?.GOOGLE || c.req.header('x-google-config');
  
  try {
    const tokenResponse = await validateCallback({
      code: code as string,
      clientId: config?.clientId,
      clientSecret: config?.clientSecret,
      redirectUri: `${c.req.url.split('/')[0]}//${c.req.header('host') || 'localhost:3100'}/auth/callback`,
    });

    // Get user info
    const userInfo = await GoogleUserInfo.parseAsync({
      email: tokenResponse.email,
      name: tokenResponse.name,
      picture: tokenResponse.picture,
    });

    // Create session
    const session = await createSession({
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      token: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
    });

    // Redirect to frontend with session token
    const frontendUrl = `http://localhost:3100/auth/success?token=${session.token}`;
    return c.redirect(frontendUrl);
  } catch (error) {
    return c.json({
      error: 'oauth_callback_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

export default app;

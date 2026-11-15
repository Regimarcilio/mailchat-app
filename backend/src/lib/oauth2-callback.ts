/**
 * Validates OAuth2 callback and exchanges code for tokens
 */
export async function validateCallback(params: {
  code: string;
  clientId: string | undefined;
  clientSecret: string | undefined;
  redirectUri: string;
}): Promise<{
  access_token: string;
  refresh_token?: string;
  email: string;
  name: string;
  picture?: string;
}> {
  if (!params.clientId || !params.clientSecret) {
    throw new Error('Google OAuth2 credentials not configured');
  }

  // Exchange authorization code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: params.clientId,
      client_secret: params.clientSecret,
      code: params.code,
      grant_type: 'authorization_code',
      redirect_uri: params.redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.json();
    throw new Error(`Token exchange failed: ${error.error_description || error.error}`);
  }

  const tokens = await tokenResponse.json();

  // Get user info
  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  if (!userInfoResponse.ok) {
    throw new Error('Failed to get user info from Google');
  }

  const userInfo = await userInfoResponse.json();

  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    email: userInfo.email,
    name: userInfo.name || userInfo.email.split('@')[0],
    picture: userInfo.picture,
  };
}

/**
 * Generates Google OAuth2 URL
 */
export function generateOAuthURL(params: {
  clientId: string;
  redirectUri: string;
  scope: string;
  responseType?: string;
  accessType?: 'online' | 'offline';
  prompt?: 'consent' | 'select_account' | 'none';
}): string {
  const params = new URLSearchParams({
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    scope: params.scope,
    response_type: params.responseType || 'code',
    access_type: params.accessType || 'online',
    prompt: params.prompt || 'consent',
    state: crypto.randomUUID(),
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

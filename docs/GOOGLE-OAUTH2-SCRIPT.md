# Google OAuth2 Setup Quick Reference

## Quick Start (Run on your server)

```bash
# 1. Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Run setup script
GOOGLE_PROJECT_ID=your-project-id \
GOOGLE_DOMAIN=mailchat.app \
GOOGLE_OWNER_EMAIL=you@email.com \
./scripts/setup-google-auth.sh
```

## Manual Steps Required

### Step 1: Create OAuth Consent Screen
1. Visit: https://console.cloud.google.com/apis/credentials/consent
2. App name: `MailChat`
3. User support email: your@email.com
4. Developer contact email: your@email.com
5. Authorized domains: `mailchat.app`
6. Scopes to publish:
   - `Gmail API: gmail.readonly`
   - `Gmail API: gmail.send`
   - `OpenID: openid`
   - `OpenID: email`
   - `Gmail API: gmail.compose`

### Step 2: Create OAuth 2.0 Client

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create Credentials → OAuth 2.0 Client ID
3. Application type: **Web application**
4. Authorized JavaScript origins:
   ```
   http://localhost:3100
   https://mailchat.app
   https://www.mailchat.app
   ```
5. Authorized redirect URIs:
   ```
   http://localhost:3100/auth/callback
   https://mailchat.app/auth/callback
   https://www.mailchat.app/auth/callback
   ```

### Step 3: Get Credentials
After creation, you'll see:
- **Client ID**: `xxxxxxxxxx.apps.googleusercontent.com`
- **Client Secret**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 4: Update Backend Environment
```env
GOOGLE_CLIENT_ID=xxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=https://mailchat.app/auth/callback
```

### Step 5: Verify Domain (Required for CASA)
1. Go to: https://console.cloud.google.com/finic/owned-domains
2. Add domain: `mailchat.app`
3. Choose verification method:
   - DNS TXT record (recommended)
   - HTML file upload
4. Complete verification

### Step 6: Request CASA Verification
If using `gmail.send` or `gmail.compose`:
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Click "Request Verification"
3. Submit documentation
4. Wait 3-7 business days

## Test Local Development

```bash
# Use mock credentials for local dev
echo "GOOGLE_CLIENT_ID=mock-client-id.apps.googleusercontent.com" >> backend/.env
echo "GOOGLE_CLIENT_SECRET=mock-client-secret" >> backend/.env
echo "GOOGLE_REDIRECT_URI=http://localhost:3100/auth/callback" >> backend/.env
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Unauthorized domain" | Add domain in OAuth consent screen |
| "Redirect URI mismatch" | Check redirect URIs match exactly |
| "API not enabled" | Run `gcloud services enable gmail.googleapis.com` |
| "Verification required" | Submit verification request in Google Console |

#!/bin/bash
# MailChat Google OAuth2 Setup Script
# Run AFTER creating your Google Cloud project manually

set -e

echo "=== MailChat Google OAuth2 Setup ==="

# Check if project ID is provided
if [ -z "$GOOGLE_PROJECT_ID" ]; then
  echo "ERROR: Set GOOGLE_PROJECT_ID environment variable"
  echo "Usage: GOOGLE_PROJECT_ID=your-project-id ./scripts/setup-google-auth.sh"
  exit 1
fi

PROJECT_ID=$GOOGLE_PROJECT_ID
DOMAIN=${GOOGLE_DOMAIN:-mailchat.app}
EMAIL=${GOOGLE_OWNER_EMAIL}

echo "Project: $PROJECT_ID"
echo "Domain: $DOMAIN"
echo "Owner: $EMAIL"

# Enable APIs
echo "Enabling APIs..."
gcloud services enable gmail.googleapis.com --project="$PROJECT_ID"
gcloud services enable cloudidentity.googleapis.com --project="$PROJECT_ID"

# Create OAuth consent screen (requires manual verification)
echo ""
echo "=== MANUAL STEP REQUIRED ==="
echo "1. Go to: https://console.cloud.google.com/apis/credentials/consent"
echo "2. Set Application name: MailChat"
echo "3. Add authorized domains: $DOMAIN"
echo "4. Add scopes: gmail.readonly, gmail.send, openid, email, gmail.compose"
echo "5. Submit for verification if using sensitive scopes"
echo ""

# Create OAuth credentials
echo "Creating OAuth 2.0 credentials..."
gcloud secrets create gmail-client-id --project="$PROJECT_ID" --data-file=<(echo "your-client-id.apps.googleusercontent.com") 2>/dev/null || echo "Secret may already exist"

gcloud secrets create gmail-client-secret --project="$PROJECT_ID" --data-file=<(echo "your-client-secret") 2>/dev/null || echo "Secret may already exist"

echo ""
echo "=== Configuration Variables ==="
echo "Add these to your .env:"
echo "GOOGLE_CLIENT_ID=<your-client-id.apps.googleusercontent.com>"
echo "GOOGLE_CLIENT_SECRET=<your-client-secret>"
echo "GOOGLE_REDIRECT_URI=https://$DOMAIN/auth/callback"

echo ""
echo "=== Next Steps ==="
echo "1. Verify domain ownership at https://console.cloud.google.com/finic/owned-domains"
echo "2. Request CASA verification if using sensitive scopes"
echo "3. Issue TLS certificate: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "4. Set environment variables in production"
echo "5. Deploy with: docker compose up -d --build"

echo ""
echo "Script completed. Please complete manual steps above."

# MailChat — Google Login Setup Guide

## 📋 English Version (GitHub Standard)

### Prerequisites

Before you can use MailChat with real Gmail integration, you need to:

1. **Google Cloud Project** with Gmail API enabled
2. **OAuth2 credentials** configured and verified
3. **Domain verified** (required for CASA verification)
4. **HTTPS/TLS** certificate (Let's Encrypt or commercial)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: `mailchat-email-sync`
3. Enable APIs:
   - ✅ Gmail API
   - ✅ Google Cloud Identity Platform (optional)

### Step 2: Configure OAuth 2.0

1. Navigate to **APIs & Services → Credentials**
2. Create **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: `MailChat Web App`
   - Authorized JavaScript origins:
     ```
     http://localhost:3100
     https://mailchat.app (your domain)
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3100/auth/callback
     https://mailchat.app/auth/callback
     ```

3. Create **OAuth consent screen**:
   - App name: `MailChat`
   - User support email: your@email.com
   - Developer contact email: your@email.com
   - Scopes to add:
     - Gmail → `gmail.readonly` (read emails)
     - Gmail → `gmail.send` (send emails)
     - Open ID → `openid` (authentication)
     - Open ID → `email` (user email)
     - Gmail → `https://www.googleapis.com/auth/gmail.compose` (drafts/composing)

### Step 3: CASA Verification (Production)

**⚠️ CRITICAL:** Google requires **Domain Verification** for sensitive scopes.

1. Add your domain in the **OAuth consent screen**
2. Verify domain ownership via:
   - HTML file upload
   - DNS TXT record
   - Google Search Console
3. Request verification through [Google's verification process](https://support.google.com/googleapi/answer/7286940)
4. Wait 3-7 business days for approval

### Step 4: TLS/HTTPS Configuration

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d mailchat.app -d www.mailchat.app

# Auto-renewal
sudo systemctl enable --now certbot.timer
```

### Step 5: Configure Environment Variables

Update `.env` in the backend:

```env
# Google OAuth2
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://mailchat.app/auth/callback

# Other required variables
DATABASE_URL=postgresql://user:pass@localhost:5432/mailchat?schema=public
JWT_SECRET=your_jwt_secret_key_min_32_chars
CORS_ORIGINS=https://mailchat.app
```

### Step 6: Test Login Flow

1. Build and start the server:
```bash
# Frontend
cd frontend
npm install
npm run build
npm run start

# Backend
cd ../backend
npm install
npm run build
npm run start
```

2. Visit `https://mailchat.app`
3. Click "Continue with Google"
4. You should see the OAuth consent screen
5. Grant permissions and you're logged in!

---

## 🇧🇷 Versão em Português (Padrão BR)

### Pré-requisitos

Antes de usar o MailChat com integração real do Gmail, você precisa:

1. **Projeto Google Cloud** com Gmail API habilitada
2. **Credenciais OAuth2** configuradas e verificadas
3. **Domínio verificado** (obrigatório para verificação CASA)
4. **Certificado TLS/HTTPS** (Let's Encrypt ou comercial)

### Passo 1: Criar Projeto Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto: `mailchat-email-sync`
3. Habilite APIs:
   - ✅ Gmail API
   - ✅ Google Cloud Identity Platform (opcional)

### Passo 2: Configurar OAuth 2.0

1. Navegue em **APIs & Services → Credentials**
2. Crie **OAuth 2.0 Client ID**
   - Tipo de aplicativo: **Web application**
   - Nome: `MailChat Web App`
   - JavaScript origins autorizadas:
     ```
     http://localhost:3100
     https://mailchat.app (seu domínio)
     ```
   - Redirect URIs autorizadas:
     ```
     http://localhost:3100/auth/callback
     https://mailchat.app/auth/callback
     ```

3. Crie **OAuth consent screen**:
   - Nome do app: `MailChat`
   - E-mail de suporte: seu@email.com
   - E-mail do desenvolvedor: seu@email.com
   - Escopos necessários:
     - Gmail → `gmail.readonly` (ler e-mails)
     - Gmail → `gmail.send` (enviar e-mails)
     - Open ID → `openid` (autenticação)
     - Open ID → `email` (e-mail do usuário)
     - Gmail → `https://www.googleapis.com/auth/gmail.compose`

### Passo 3: Verificação CASA (Produção)

**⚠️ CRÍTICO:** O Google exige **Verificação de Domínio** para escopos sensíveis.

1. Adicione seu domínio na **OAuth consent screen**
2. Verifique a propriedade do domínio via:
   - Upload de arquivo HTML
   - Registro TXT no DNS
   - Google Search Console
3. Solicite verificação pelo [processo de verificação Google](https://support.google.com/googleapi/answer/7286940)
4. Aguarde 3-7 dias úteis para aprovação

### Passo 4: Configurar TLS/HTTPS

```bash
# Instalar certbot
sudo apt-get install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d mailchat.app -d www.mailchat.app

# Renovação automática
sudo systemctl enable --now certbot.timer
```

### Passo 5: Configurar Variáveis de Ambiente

Atualize `.env` no backend:

```env
# OAuth2 Google
GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_REDIRECT_URI=https://mailchat.app/auth/callback

# Outras variáveis necessárias
DATABASE_URL=postgresql://usuario:senha@localhost:5432/mailchat?schema=public
JWT_SECRET=sua_chave_jwt_min_32_caracteres
CORS_ORIGINS=https://mailchat.app
```

### Passo 6: Testar Fluxo de Login

1. Construa e inicie o servidor:
```bash
# Frontend
cd frontend
npm install
npm run build
npm run start

# Backend
cd ../backend
npm install
npm run build
npm run start
```

2. Acesse `https://mailchat.app`
3. Clique em "Continuar com Google"
4. Você verá a tela de consentimento OAuth
5. Conceda as permissões e faça login!

---

## 🔧 Troubleshooting

### Login not working?

| Symptom | Solution |
|---------|----------|
| "Unauthorized domain" | Add your domain to OAuth consent screen |
| "Redirect URI mismatch" | Check redirect URIs match exactly |
| "API not enabled" | Enable Gmail API in Google Cloud Console |
| Certificate error | Use valid Let's Encrypt cert |

### Common Issues

1. **Local development:** Use `http://localhost:3100` in JavaScript origins
2. **Production:** HTTPS required - HTTP will be rejected
3. **Scopes:** Start with `gmail.readonly`, add `gmail.send` after
4. **CASA:** Sensitive scopes require verification - test with readonly first

---

## 📧 Support

- Issue tracker: https://github.com/Regimarcilio/mailchat-app/issues
- Email: regimarcilio@gmail.com

---
**Last updated:** 2026-11-15

# MailChat — Client de E-mail Estilo WhatsApp

> Seu caixa de e-mail reorganizada como conversas do WhatsApp

![MailChat Banner](banner/index.html)

## ✓ Status Atual

✅ **Backend F0** — API Hono com health/metrics  
✅ **Frontend em desenvolvimento** — React/Next.js  
✅ **Infraestrutura completa** — Docker, nginx, systemd, backup GPG  
✅ **Documentação completa** — SRS, threat model, Google OAuth2, LGPD  

---

## Quick Start (Local Development)

**Prerequisites:** Node.js 22+, PostgreSQL

```bash
# Clone and install
git clone https://github.com/Regimarcilio/mailchat-app.git
cd mailchat-app

# Backend (API)
cd backend
cp .env.example .env
# Configure DATABASE_URL for your PostgreSQL
npm install && npm run dev
# http://localhost:8787

# Backend Health Check
curl http://localhost:8787/health
# Response: {"status":"ok","timestamp":"2026-11-15..."}

# Frontend
cd ../frontend
cp .env.example .env.local
npm install && npm run dev
# http://localhost:3100
```

---

## 🌐 Google Login Setup

**Para login real com Gmail OAuth2**, siga o guia completo:

### English (GitHub Standard)
👉 **[docs/USER-GUIDE-GOOGLE-LOGIN.md - English](docs/USER-GUIDE-GOOGLE-LOGIN.md)**

### Portuguese (Brasil)
👉 **[docs/USER-GUIDE-GOOGLE-LOGIN.md - Português](docs/USER-GUIDE-GOOGLE-LOGIN.md)**

### Quick Summary

1. **Google Cloud Project** → [console.cloud.google.com](https://console.cloud.google.com/)
2. **Enable Gmail API** → APIs & Services → Library
3. **OAuth 2.0 Credentials** → APIs & Services → Credentials
4. **Verify Domain** → Required for CASA scopes
5. **Configure TLS** → Let's Encrypt for production

---

## 📁 Project Structure

```
mailchat-app/
├── backend/           # MailChat F0 - API Hono + Postgres
│   ├── src/           # API routes, health, metrics
│   ├── drizzle/       # Database schema
│   └── docker-compose.yml
├── frontend/          # Next.js React
│   ├── app/           # Main layout + pages
│   ├── components/    # UI components
│   └── hooks/         # Data fetching hooks
├── banner/            # Visual identity (EX Technologies)
├── docs/              # Documentation
│   ├── USER-GUIDE-GOOGLE-LOGIN.md
│   ├── SRS.md
│   └── action-plan-lgpd-casa.md
├── infra/             # Production infrastructure
│   ├── systemd/       # Service units
│   ├── proxy/         # nginx configuration
│   └── runbook.md
└── README.md
```

---

## 🔐 Authentication

### Current State
| Feature | Status |
|---------|--------|
| OAuth2 Google | Mock (simulated) |
| Login Screen | ✅ Component ready |
| Real Gmail Sync | 🔒 Blocked (requires Google verification) |
| TLS/HTTPS | 🔒 Requires domain setup |

### What You Need

| Requirement | Why | How |
|-------------|-----|-----|
| Google Cloud Project | Gmail API access | [console.cloud.google.com](https://console.cloud.google.com/) |
| Domain Verification | CASA compliance | DNS TXT record or HTML file |
| TLS Certificate | HTTPs enforcement | Let's Encrypt (`certbot`) |
| OAuth Consent Screen | User authentication | Google Cloud Console |

---

## 🚀 Production Deployment

### With Docker
```bash
# Build and start
docker compose up -d --build

# Services:
# - Backend: http://localhost:8787 (internal only)
# - Frontend: http://localhost:3100 (Nginx proxy)
```

### Manual Deployment
1. Build frontend: `npm run build` in `/frontend`
2. Build backend: `npm run build` in `/backend`
3. Configure environment variables
4. Use systemd units in `/infra/systemd`
5. See `infra/runbook.md` for full checklist

---

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# E2E with Playwright
cd frontend && npx playwright test
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[SRS.md](docs/SRS.md)** | Software Requirements Specification |
| **[USER-GUIDE-GOOGLE-LOGIN.md](docs/USER-GUIDE-GOOGLE-LOGIN.md)** | OAuth2 + LGPD setup guide |
| **[action-plan-lgpd-casa.md](docs/action-plan-lgpd-casa.md)** | Action plan for production |
| **[infra/runbook.md](infra/runbook.md)** | Deployment runbook |
| **[docs/security/threat-model-stride.md](docs/security/threat-model-stride.md)** | Security threat model |
| **[infra/checklist-deploy.md](infra/checklist-deploy.md)** | Production deployment checklist |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/awesome`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to branch (`git push origin feature/awesome`)
5. Open Pull Request

---

## 📄 License

Internal project - EX Technologies

---

**Questions?** Open an [issue](https://github.com/Regimarcilio/mailchat-app/issues) or email regimarcilio@gmail.com

---
*Last updated: 2026-11-15*

---

## 🎯 Seu Projeto Google Cloud

**Project Number:** 624831787712  
**Project ID:** canvas-replica-404602  
**Console:** https://console.cloud.google.com/welcome?pli=1&project=canvas-replica-404602

### Próximos passos com este projeto:

1. **Acesse o projeto:** [console.cloud.google.com](https://console.cloud.google.com/welcome?pli=1&project=canvas-replica-404602)

2. **Habilitar APIs:**
   - Gmail API
   - Google Cloud Identity Platform

3. **Criar credenciais OAuth2:**
   - APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized JavaScript origins:
     ```
     http://localhost:3100
     https://mailchat.app
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3100/auth/callback
     https://mailchat.app/auth/callback
     ```

4. **Configurar OAuth Consent Screen:**
   - Application name: MailChat
   - User support email: seu@email.com
   - Developer contact email: seu@email.com

5. **Atualizar .env:**
   ```env
   GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=seu_client_secret
   GOOGLE_REDIRECT_URI=https://mailchat.app/auth/callback
   ```

6. **Verificar domínio (CASA requirements):**
   - APIs & Services → OAuth consent screen → Authorized domains
   - Adicionar: `mailchat.app`

7. **Deploy com certificado TLS:**
   ```bash
   sudo certbot --nginx -d mailchat.app -d www.mailchat.app
   ```


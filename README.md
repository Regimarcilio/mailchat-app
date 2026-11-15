# MailChat — Cliente de E-mail Estilo WhatsApp

> Seu caixa de e-mail reorganizada como conversas do WhatsApp

## Status Atual

✅ **Backend F0** — API Hono com health/metrics  
✅ **Frontend em desenvolvimento** — React/Next.js  
✅ **Infraestrutura** — Docker, systemd, nginx, backup GPG  
✅ **Documentação** — SRS, threat model, Google OAuth2, LGPD  

## Pendências para Produção

### 🔴 Críticas (bloqueiam uso)
- [ ] Domínio TLS (Let's Encrypt)
- [ ] Projeto Google Cloud e OAuth2 verificação CASA
- [ ] Chave GPG e backup configurado
- [ ] DPO designado e política LGPD validada
- [ ] Docker compose com PostgreSQL real

### 🟡 Médias
- [ ] Frontend substituir mock por API real
- [ ] Sessões HttpOnly implementadas

## Execução Local

```bash
# Backend
cd backend && npm install && npm run dev
# http://localhost:8787

# Frontend
cd frontend && npm install && npm run dev
# http://localhost:3100

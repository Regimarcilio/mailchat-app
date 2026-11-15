# Plano de Ação: LGPD e OAuth2 Google/CASA

## Pendências CRÍTICAS (P1 - Devem ser resolvidas antes de QA)

### 1. Projeto Google Cloud e Gmail API
**Status:** ⏳ Pendente  
**Responsável:** Usuário  
**Passos:**
- [ ] Criar conta Google Cloud Platform (se não tiver)
- [ ] Criar novo projeto: `mailchat-email-sync`
- [ ] Habilitar APIs: Gmail API, Google Cloud Identity Platform
- [ ] Configurar OAuth 2.0 Screen Consent:
  - App name: "MailChat"
  - User support email: seu@email.com
  - Developer contact: seu@email.com
  - Scopes: `gmail.readonly`, `gmail.send`, `openid`, `email`, `https://www.googleapis.com/auth/gmail.compose`
- [ ] Configurar OAuth consent screen como "External"
- [ ] Solicitar verificação CASA (ver documentação docs/google-lgpd/)

**Tempo estimado:** 2-3 dias (7-14 dias para verificação CASA)

### 2. Domínio TLS e HTTPS
**Status:** ⏳ Pendente  
**Responsável:** Usuário  
**Passos:**
- [ ] Registrar domínio (ex: mailchat.app, ou usar domínio existente)
- [ ] Configurar DNS A/AAAA records apontando para IP do servidor
- [ ] Instalar certificado Let's Encrypt:
  ```bash
  sudo certbot --nginx -d mailchat.app -d www.mailchat.app
  ```
- [ ] Configurar renovação automática: `systemctl enable --now certbot.timer`

### 3. Chave GPG e Backup
**Status:** ⏳ Pendente  
**Responsável:** Usuário  
**Passos:**
```bash
# Gerar par GPG
gpg --full-generate-key

# Escolher opção: RSA/RSA, 4096 bits, validade desejada
# Exportar chave pública
gpg --armor --export seu@email.com > backup.pub

# Adicionar ao .env
echo "BACKUP_GPG_RECIPIENT=seu@email.com" >> .env

# Testar script de backup
./scripts/backup.sh --check  # Deve retornar 0
```

### 4. Designar DPO (Data Protection Officer)
**Status:** ⏳ Pendente  
**Responsável:** Usuário  
**Passos:**
- [ ] Nomear DPO (pode ser você ou terceiro)
- [ ] Registrar DPO em ANPD (se corporativo)
- [ ] Atualizar docs/google-lgpd/checklist-user-inputs.md com DPO informado

## Pendências MÉDIA (P2 - Podem ser resolvidas com tempo)

### 5. Frontend Real
**Status:** ⏳ Mock  
**Responsável:** FRONTDEV  
**Passos:**
- [ ] Substituir `src/adapters/gmail-mock.ts` por adapter real
- [ ] Implementar OAuth2 flow com PKCE
- [ ] Adicionar gerenciamento de contas múltiplas

### 6. Sessões HttpOnly
**Status:** ⏳ Em desenvolvimento  
**Responsável:** BACKDEV  
**Passos:**
- [ ] Implementar JWT com HttpOnly cookie
- [ ] Configurar cookie com `Secure`, `SameSite=Strict`

## Próxiros Check-ins
- [ ] Revisão KALIMASTER-DAST após implementação
- [ ] Testes QAMASTER antes de merge para main
- [ ] Deploy OPSMASTER com observabilidade

---
**Data de criação:** 2026-11-15  
**Responsável pelo plano:** ISSUEMASTER

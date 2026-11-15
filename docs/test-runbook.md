# Test Runbook — MailChat (2026-11-15)

## Pré-requisitos para testes

### 1. Backend em execução
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev
# Deve rodar em http://localhost:8787

# Teste rápido
curl http://localhost:8787/health
# Esperado: {"status":"ok","timestamp":"2026-11-15T..."}
```

### 2. Frontend em execução
```bash
# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
# Deve rodar em http://localhost:3100

# Acesse no navegador
# http://localhost:3100
```

### 3. Docker Compose (alternativa)
```bash
docker compose up -d
# Backend: http://localhost:8787
# Frontend: http://localhost:3100
```

## Testes que posso fazer AGORA (sem OAuth2 real)

### Teste 1: Conexão backend → frontend (mock)
**URL:** http://localhost:3100  
**Escolha:** Browser (Chrome/Firefox/Edge - Windows/Linux)

1. ✅ Página carrega sem erros
2. ✅ Logo "MailChat" visível
3. ✅ Banner with EX Technologies badge visível
4. ✅ Botão "Começar agora" funcional

### Teste 2: Health check backend
**URL:** http://localhost:8787/health

```bash
curl -s http://localhost:8787/health | jq
# Esperado: {"status":"ok","timestamp":"..."}
```

### Teste 3: Métricas backend
**URL:** http://localhost:8787/metrics

```bash
curl -s http://localhost:8787/metrics | head -10
# Esperado: métricas Prometheus no formato correto
```

### Teste 4: API de contas (mock)
**URL:** http://localhost:8787/api/v1/accounts

```bash
curl -s http://localhost:8787/api/v1/accounts | jq
# Esperado: lista vazia [] ou array de teste
```

## Testes que **ESPERAM** OAuth2 real (blockeados)

### Teste 5: Login OAuth2 Google
**URL:** http://localhost:3100/login  
**Status:** ⏳ Bloqueado até OAuth2 configurado

### Teste 6: Sync Gmail
**Endpoint:** POST http://localhost:8787/api/v1/sync  
**Status:** ⏳ Bloqueado - requer token real

### Teste 7: Envio e-mail
**Endpoint:** POST http://localhost:8787/api/v1/send  
**Status:** ⏳ Bloqueado - requer token Gmail.send

## Como executar os testes agora

### Passo 1: Verificar se está tudo parado
```bash
lsof -i :3100 -i :8787 2>/dev/null || echo "Portas livres"
```

### Passo 2: Iniciar backend
```bash
cd /home/project/PROJETOS/email-whatsapp/backend
npm run dev &
# Aguarde 2-3 segundos
```

### Passo 3: Iniciar frontend
```bash
cd /home/project/PROJETOS/email-whatsapp/frontend
npm run dev &
# Aguarde 2-3 segundos
```

### Passo 4: Testar no navegador
Abra em qualquer navegador (Windows/Linux/Mac):
```
http://localhost:3100
```

Clique em "Conectar Gmail" (mostrará erro de OAuth - esperado)

### Passo 5: Verificar logs
```bash
# Em outro terminal
tail -f backend/logs/app.log 2>/dev/null || echo "Sem logs ainda"
```

## Comandos de teste rápido

```bash
# 1. Verificar backend
curl -s http://localhost:8787/health && echo "✅ Backend OK"

# 2. Verificar frontend HTML
curl -s http://localhost:3100 | grep -q "MailChat" && echo "✅ Frontend OK"

# 3. Verificar banner
curl -s http://localhost:3100 | grep -q "EX TECHNOLOGIES" && echo "✅ Banner OK"
```

## Resultados esperados (sem OAuth2)

| Teste | Esperado | Status Atual |
|-------|----------|--------------|
| Página carrega | 200 OK | ✅ |
| Logo MailChat | Visível | ✅ |
| Banner EX Tech | Visível | ✅ |
| Botão conectar | Clica, mas erro OAuth | ⚠️ (bloqueado) |
| Health backend | {"status":"ok"} | ✅ |
| Métricas | Prometheus format | ✅ |

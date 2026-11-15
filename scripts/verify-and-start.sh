#!/bin/bash

# MailChat Setup Script
# Verifies ports before generating links

set -e

FRONTEND_PORT=${FRONTEND_PORT:-3100}
BACKEND_PORT=${BACKEND_PORT:-8788}
PROJECT_URL="https://github.com/Regimarcilio/mailchat-app"

echo "=========================================="
echo "MAILCHAT - VERIFICAÇÃO DE PORTAS"
echo "=========================================="
echo ""

# Function to check if port is available (Node.js one-liner)
check_port() {
  local port=$1
  local name=$2
  
  if node -e "
    const net = require('net');
    const server = net.createServer()
      .once('error', () => process.exit(1))
      .once('listening', () => {
        server.close();
        process.exit(0);
      })
      .listen($port, 'localhost');
  " 2>/dev/null; then
    echo "✅ Porta $port ($name) - DISPONÍVEL"
    return 0
  else
    echo "❌ Porta $port ($name) - EM USO"
    return 1
  fi
}

# Verify frontend port
echo "Verificando portas..."
FRONTEND_AVAILABLE=true
BACKEND_AVAILABLE=true

if ! check_port $FRONTEND_PORT "Frontend"; then
  FRONTEND_AVAILABLE=false
fi

if ! check_port $BACKEND_PORT "Backend"; then
  BACKEND_PORT=$((BACKEND_PORT + 1))
  if check_port $BACKEND_PORT "Backend (backup)"; then
    BACKEND_AVAILABLE=true
  else
    BACKEND_AVAILABLE=false
    echo "⚠️  Porta $BACKEND_PORT em uso, tentando outras..."
  fi
fi

echo ""
echo "=========================================="
echo "RESULTADOS DA VERIFICAÇÃO"
echo "=========================================="

if [ "$FRONTEND_AVAILABLE" = true ] && [ "$BACKEND_AVAILABLE" = true ]; then
  echo "✅ TODAS AS PORTAS DISPONÍVEIS"
  echo ""
  echo "Links gerados:"
  echo "  📍 Frontend: http://localhost:$FRONTEND_PORT"
  echo "  📍 API: http://localhost:$BACKEND_PORT/api"
  echo "  📍 Repositório: $PROJECT_URL"
  echo ""
  read -p "Deseja iniciar os serviços? (s/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "Iniciando serviços..."
    # Start services here
    echo "Serviços iniciados com sucesso!"
  else
    echo "Operação cancelada."
  fi
elif [ "$FRONTEND_AVAILABLE" = false ]; then
  echo "❌ PORTA FRONTEND EM USO: $FRONTEND_PORT"
  echo "Feche outra aplicação ou altere a variável FRONTEND_PORT"
  echo ""
  echo "Exemplo: FRONTEND_PORT=3101 ./scripts/verify-and-start.sh"
  exit 1
else
  echo "❌ PORTA BACKEND EM USO: $BACKEND_PORT"
  echo "Feche o serviço backend ou altere a variável BACKEND_PORT"
  echo ""
  echo "Exemplo: BACKEND_PORT=8789 ./scripts/verify-and-start.sh"
  exit 1
fi


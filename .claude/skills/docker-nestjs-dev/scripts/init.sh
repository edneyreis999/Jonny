#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 Initializing Development Ecosystem${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Função para esperar serviço estar saudável
wait_for_healthy() {
  local service=$1
  local max_attempts=60
  local attempt=1

  echo -e "${YELLOW}⏳ Waiting for $service to be healthy...${NC}"

  while [ $attempt -le $max_attempts ]; do
    if docker-compose ps | grep -q "$service.*healthy"; then
      echo -e "${GREEN}✅ $service is healthy!${NC}"
      return 0
    fi
    sleep 2
    attempt=$((attempt + 1))
  done

  echo -e "${RED}❌ Timeout waiting for $service${NC}"
  return 1
}

# Função para esperar npm install terminar
wait_for_npm_install() {
  local service=$1
  local max_attempts=60
  local attempt=1

  echo -e "${YELLOW}⏳ Waiting for npm install in $service...${NC}"

  while [ $attempt -le $max_attempts ]; do
    if docker-compose exec -T $service sh -c "[ -f node_modules/.package-lock.json ]" 2>/dev/null; then
      echo -e "${GREEN}✅ npm install completed in $service!${NC}"
      return 0
    fi
    sleep 3
    attempt=$((attempt + 1))
  done

  echo -e "${YELLOW}⚠️  npm install may still be running${NC}"
  return 0
}

# Função para executar comando em serviço
execute_in_service() {
  local service=$1
  local command=$2
  local description=$3

  echo ""
  echo -e "${BLUE}📦 $description${NC}"
  echo -e "${YELLOW}   Service: $service${NC}"

  if docker-compose exec -T $service sh -c "$command"; then
    echo -e "${GREEN}✅ Success!${NC}"
    return 0
  else
    echo -e "${RED}❌ Failed${NC}"
    return 1
  fi
}

# Passo 1: Build e start dos containers
echo -e "${BLUE}📦 Building and starting containers...${NC}"
if docker-compose up -d --build; then
  echo -e "${GREEN}✅ Containers started${NC}"
else
  echo -e "${RED}❌ Failed to start containers${NC}"
  exit 1
fi

echo ""

# Passo 2: Aguardar PostgreSQL (se existir)
if docker-compose ps | grep -q "postgres"; then
  if ! wait_for_healthy "postgres"; then
    echo -e "${RED}❌ PostgreSQL failed${NC}"
    exit 1
  fi
fi

echo ""

# Passo 3: Aguardar npm install terminar
wait_for_npm_install "api"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🗄️  Database Setup${NC}"
echo -e "${BLUE}========================================${NC}"

# Passo 4: Migrations (apenas se prisma/schema.prisma existir)
if docker-compose exec -T api sh -c "[ -f prisma/schema.prisma ]"; then
  if ! execute_in_service "api" "npx prisma migrate deploy" "Running migrations"; then
    echo -e "${RED}❌ Migrations failed${NC}"
    exit 1
  fi

  # Passo 5: Generate Prisma Client
  if ! execute_in_service "api" "npx prisma generate" "Generating Prisma Client"; then
    echo -e "${RED}❌ Failed to generate Prisma Client${NC}"
  fi

  # Passo 6: Seeds (apenas se prisma/seed.ts existir)
  if docker-compose exec -T api sh -c "[ -f prisma/seed.ts ]"; then
    if ! execute_in_service "api" "npx prisma db seed" "Running seeds"; then
      echo -e "${YELLOW}⚠️  Seeds failed (may be optional)${NC}"
    fi
  fi
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✨ Initialization Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📋 Services Status:${NC}"
docker-compose ps
echo ""
echo -e "${GREEN}🎉 Happy coding!${NC}"
echo ""

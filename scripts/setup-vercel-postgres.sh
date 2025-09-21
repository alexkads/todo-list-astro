#!/bin/bash

# Script para configurar Vercel Postgres
# Execute após criar seu banco Vercel Postgres

echo "🚀 Configurando Vercel Postgres..."

# Verifica se as variáveis do Vercel Postgres estão definidas
if [ -z "$POSTGRES_PRISMA_URL" ]; then
    echo "❌ POSTGRES_PRISMA_URL não está definida"
    echo "💡 Configure as variáveis de ambiente do Vercel Postgres primeiro"
    echo "📖 Veja: https://vercel.com/storage/postgres"
    exit 1
fi

echo "✅ Variáveis de ambiente encontradas"

# Gera o Prisma Client
echo "🔧 Gerando Prisma Client..."
npx prisma generate

# Executa as migrações
echo "📊 Executando migrações do banco..."
npx prisma migrate deploy

# Opcional: Executar seed
read -p "🌱 Deseja executar o seed do banco de dados? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Executando seed..."
    npm run db:seed
    echo "✅ Seed executado com sucesso!"
fi

echo "🎉 Configuração do Vercel Postgres concluída!"
echo "🔗 Acesse seu banco em: https://vercel.com/storage"
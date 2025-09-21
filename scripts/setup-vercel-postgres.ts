import { sql } from '@vercel/postgres';

/**
 * Utilitário para configurar e testar conexão com Vercel Postgres
 */

export async function testConnection() {
  try {
    console.log('🔍 Testando conexão com Vercel Postgres...');
    
    const result = await sql`SELECT version();`;
    console.log('✅ Conexão bem-sucedida!');
    console.log('📊 Versão do PostgreSQL:', result.rows[0].version);
    
    return { success: true, version: result.rows[0].version };
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
    return { success: false, error };
  }
}

export async function checkTables() {
  try {
    console.log('🔍 Verificando tabelas existentes...');
    
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    
    const tables = result.rows.map(row => row.table_name);
    console.log('📋 Tabelas encontradas:', tables);
    
    return { success: true, tables };
  } catch (error) {
    console.error('❌ Erro ao verificar tabelas:', error);
    return { success: false, error };
  }
}

export async function setupDatabase() {
  console.log('🚀 Iniciando configuração do Vercel Postgres...');
  
  // Testa conexão
  const connectionTest = await testConnection();
  if (!connectionTest.success) {
    return { success: false, step: 'connection', error: connectionTest.error };
  }
  
  // Verifica tabelas
  const tablesCheck = await checkTables();
  if (!tablesCheck.success) {
    return { success: false, step: 'tables', error: tablesCheck.error };
  }
  
  console.log('🎉 Setup do Vercel Postgres concluído com sucesso!');
  return { 
    success: true, 
    version: connectionTest.version,
    tables: tablesCheck.tables 
  };
}

// Se executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
    .then((result) => {
      if (result.success) {
        console.log('\n✅ Configuração bem-sucedida!');
        process.exit(0);
      } else {
        console.log(`\n❌ Falha na etapa: ${result.step}`);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n💥 Erro inesperado:', error);
      process.exit(1);
    });
}
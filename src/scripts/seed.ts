import { hashPassword } from '../lib/auth';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário administrador padrão
  const adminEmail = 'admin@todolist.com';
  const adminPassword = 'admin123';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await hashPassword(adminPassword);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Administrador',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('✅ Usuário administrador criado:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Senha: ${adminPassword}`);
  } else {
    console.log('ℹ️  Usuário administrador já existe');
  }

  // Criar usuário de teste
  const testEmail = 'usuario@teste.com';
  const testPassword = 'teste123';

  const existingUser = await prisma.user.findUnique({
    where: { email: testEmail }
  });

  if (!existingUser) {
    const hashedPassword = await hashPassword(testPassword);
    
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: 'Usuário Teste',
        password: hashedPassword,
        role: 'USER'
      }
    });

    // Criar algumas tarefas de exemplo
    await prisma.todo.createMany({
      data: [
        {
          title: 'Primeira tarefa',
          description: 'Esta é uma tarefa de exemplo',
          priority: 'MEDIUM',
          userId: testUser.id
        },
        {
          title: 'Tarefa urgente',
          description: 'Uma tarefa com prioridade alta',
          priority: 'URGENT',
          completed: false,
          userId: testUser.id
        },
        {
          title: 'Tarefa concluída',
          description: 'Esta tarefa já foi concluída',
          priority: 'LOW',
          completed: true,
          userId: testUser.id
        }
      ]
    });

    console.log('✅ Usuário de teste criado:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Senha: ${testPassword}`);
    console.log('✅ Tarefas de exemplo criadas');
  } else {
    console.log('ℹ️  Usuário de teste já existe');
  }

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

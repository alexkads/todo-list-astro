import type { APIRoute } from 'astro';
import { createAuthCookie, generateToken, hashPassword } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validação básica
    if (!email || !password || !name) {
      return new Response(JSON.stringify({ 
        error: 'Email, senha e nome são obrigatórios' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return new Response(JSON.stringify({ 
        error: 'Usuário já existe com este email' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Criar novo usuário
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    // Gerar token JWT
    const token = generateToken(user);

    return new Response(JSON.stringify({
      user,
      message: 'Usuário criado com sucesso'
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': createAuthCookie(token)
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

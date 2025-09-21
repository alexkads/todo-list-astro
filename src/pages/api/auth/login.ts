import type { APIRoute } from 'astro';
import { createAuthCookie, generateToken, verifyPassword } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validação básica
    if (!email || !password) {
      return new Response(JSON.stringify({ 
        error: 'Email e senha são obrigatórios' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return new Response(JSON.stringify({ 
        error: 'Credenciais inválidas' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar senha
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return new Response(JSON.stringify({ 
        error: 'Credenciais inválidas' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Gerar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    return new Response(JSON.stringify({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      message: 'Login realizado com sucesso'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': createAuthCookie(token)
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

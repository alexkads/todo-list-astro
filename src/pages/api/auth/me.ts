import type { APIRoute } from 'astro';
import { getSessionFromRequest } from '../../../lib/session';

export const GET: APIRoute = async (context) => {
  try {
    const session = getSessionFromRequest(context);

    if (!session) {
      return new Response(JSON.stringify({ 
        error: 'Não autenticado' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      user: session
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

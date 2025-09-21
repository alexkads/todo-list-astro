import type { APIRoute } from 'astro';
import { deleteAuthCookie } from '../../../lib/auth';

export const POST: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'Logout realizado com sucesso'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': deleteAuthCookie()
    }
  });
};

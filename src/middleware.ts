import { defineMiddleware } from 'astro:middleware';
import { getSessionFromRequest } from './lib/session';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = new URL(context.request.url);
  
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register'];
  
  // Rotas protegidas que precisam de autenticação
  const protectedRoutes = ['/dashboard'];
  
  // Se é uma rota pública, continuar sem verificação
  if (publicRoutes.includes(pathname)) {
    return next();
  }
  
  // Se é uma rota da API (exceto as de auth público), verificar autenticação
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/login') && !pathname.startsWith('/api/auth/register')) {
    const session = getSessionFromRequest(context);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Não autenticado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Adicionar sessão ao contexto para uso nas APIs
    context.locals.session = session;
    return next();
  }
  
  // Se é uma rota protegida da aplicação, verificar autenticação
  if (protectedRoutes.includes(pathname)) {
    const session = getSessionFromRequest(context);
    if (!session) {
      return Response.redirect(new URL('/login', context.request.url), 302);
    }
    
    // Adicionar sessão ao contexto
    context.locals.session = session;
    return next();
  }
  
  // Para todas as outras rotas, continuar normalmente
  return next();
});

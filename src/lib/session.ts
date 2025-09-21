import type { APIContext } from 'astro';
import { verifyToken, type UserSession } from './auth';

export function getSessionFromRequest(context: APIContext): UserSession | null {
  const authToken = context.cookies.get('auth-token')?.value;
  
  if (!authToken) {
    return null;
  }
  
  return verifyToken(authToken);
}

export function requireAuth(context: APIContext): UserSession {
  const session = getSessionFromRequest(context);
  
  if (!session) {
    throw new Error('Authentication required');
  }
  
  return session;
}

export function requireAdmin(context: APIContext): UserSession {
  const session = requireAuth(context);
  
  if (session.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  
  return session;
}

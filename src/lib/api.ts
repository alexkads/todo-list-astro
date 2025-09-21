import type { APIContext } from 'astro';

/**
 * Utilitário para lidar com erros da API de forma consistente
 * Otimizado para ambiente serverless da Vercel
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function createApiResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string
): ApiResponse<T> {
  return {
    success,
    ...(data && { data }),
    ...(error && { error }),
    ...(message && { message })
  };
}

export function handleApiError(error: any): Response {
  console.error('API Error:', error);
  
  const response = createApiResponse(
    false,
    null,
    error.message || 'Internal server error',
    'Ocorreu um erro no servidor'
  );

  return new Response(JSON.stringify(response), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function createApiSuccess<T>(data: T, message?: string): Response {
  const response = createApiResponse(true, data, undefined, message);
  
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function createApiError(
  message: string, 
  status: number = 400, 
  error?: string
): Response {
  const response = createApiResponse(false, null, error, message);
  
  return new Response(JSON.stringify(response), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Wrapper para funções API que trata erros automaticamente
 */
export function withErrorHandling(
  handler: (context: APIContext) => Promise<Response>
) {
  return async (context: APIContext): Promise<Response> => {
    try {
      return await handler(context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
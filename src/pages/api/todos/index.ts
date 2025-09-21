import type { Priority } from '@prisma/client';
import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/session';

export const GET: APIRoute = async (context) => {
  try {
    const session = requireAuth(context);

    const todos = await prisma.todo.findMany({
      where: { userId: session.id },
      orderBy: [
        { completed: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return new Response(JSON.stringify({ todos }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return new Response(JSON.stringify({ 
        error: 'Não autenticado' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.error('Erro ao buscar tarefas:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async (context) => {
  try {
    const session = requireAuth(context);
    const body = await context.request.json();
    const { title, description, priority, dueDate } = body;

    // Validação básica
    if (!title) {
      return new Response(JSON.stringify({ 
        error: 'Título é obrigatório' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description: description || null,
        priority: (priority as Priority) || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: session.id
      }
    });

    return new Response(JSON.stringify({ 
      todo,
      message: 'Tarefa criada com sucesso' 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return new Response(JSON.stringify({ 
        error: 'Não autenticado' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.error('Erro ao criar tarefa:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

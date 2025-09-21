import type { Priority } from '@prisma/client';
import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/session';

export const GET: APIRoute = async (context) => {
  try {
    const session = requireAuth(context);
    const { id } = context.params;

    if (!id) {
      return new Response(JSON.stringify({ 
        error: 'ID da tarefa é obrigatório' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const todo = await prisma.todo.findFirst({
      where: { 
        id,
        userId: session.id 
      }
    });

    if (!todo) {
      return new Response(JSON.stringify({ 
        error: 'Tarefa não encontrada' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ todo }), {
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

    console.error('Erro ao buscar tarefa:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async (context) => {
  try {
    const session = requireAuth(context);
    const { id } = context.params;
    const body = await context.request.json();

    if (!id) {
      return new Response(JSON.stringify({ 
        error: 'ID da tarefa é obrigatório' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar se a tarefa pertence ao usuário
    const existingTodo = await prisma.todo.findFirst({
      where: { 
        id,
        userId: session.id 
      }
    });

    if (!existingTodo) {
      return new Response(JSON.stringify({ 
        error: 'Tarefa não encontrada' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { title, description, completed, priority, dueDate } = body;

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        ...(priority !== undefined && { priority: priority as Priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      }
    });

    return new Response(JSON.stringify({ 
      todo,
      message: 'Tarefa atualizada com sucesso' 
    }), {
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

    console.error('Erro ao atualizar tarefa:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async (context) => {
  try {
    const session = requireAuth(context);
    const { id } = context.params;

    if (!id) {
      return new Response(JSON.stringify({ 
        error: 'ID da tarefa é obrigatório' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar se a tarefa pertence ao usuário
    const existingTodo = await prisma.todo.findFirst({
      where: { 
        id,
        userId: session.id 
      }
    });

    if (!existingTodo) {
      return new Response(JSON.stringify({ 
        error: 'Tarefa não encontrada' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await prisma.todo.delete({
      where: { id }
    });

    return new Response(JSON.stringify({ 
      message: 'Tarefa excluída com sucesso' 
    }), {
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

    console.error('Erro ao excluir tarefa:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

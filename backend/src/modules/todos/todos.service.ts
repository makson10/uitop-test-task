import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import db from '../../common/db';
import { todosTable } from '../../common/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

@Injectable()
export class TodosService {
  private readonly MAX_TODOS_PER_CATEGORY = 5;

  async findAll(category?: string): Promise<Todo[]> {
    const whereClause = category
      ? sql`lower(${todosTable.category}) = lower(${category})`
      : undefined;

    return await db.select().from(todosTable).where(whereClause);
  }

  async findOne(id: string): Promise<Todo> {
    const [todo] = await db
      .select()
      .from(todosTable)
      .where(eq(todosTable.id, id));

    if (!todo) {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }
    return todo;
  }

  async getCategories(): Promise<string[]> {
    const rows = await db
      .select({ category: todosTable.category })
      .from(todosTable)
      .groupBy(todosTable.category);

    return rows.map((r) => r.category);
  }

  async create({ text, category }: CreateTodoDto): Promise<Todo> {
    const categoryTodos = await db
      .select({ id: todosTable.id })
      .from(todosTable)
      .where(
        and(
          sql`lower(${todosTable.category}) = lower(${category})`,
          eq(todosTable.done, false),
        ),
      );

    const activeTodosCount = categoryTodos.length;

    if (activeTodosCount >= this.MAX_TODOS_PER_CATEGORY) {
      throw new ConflictException(
        `Category "${category}" already has ${this.MAX_TODOS_PER_CATEGORY} tasks. Please complete or delete an existing task first`,
      );
    }

    const now = new Date();
    const [newTodo] = await db
      .insert(todosTable)
      .values({
        id: randomUUID(),
        text,
        category,
        done: false,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return newTodo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const current = await this.findOne(id);

    const nextText = updateTodoDto.text ?? current.text;
    const nextCategory = updateTodoDto.category ?? current.category;
    const nextDone = updateTodoDto.done ?? current.done;

    if (
      nextCategory?.toLowerCase() !== current.category?.toLowerCase() &&
      nextDone === false
    ) {
      await this.validateCategoryTodoLimit(nextCategory);
    }

    const now = new Date();
    const updateData: Partial<Todo> = {
      text: nextText,
      category: nextCategory,
      done: nextDone,
      updatedAt: now,
      completedAt: !current.done && nextDone ? now : null,
    };

    const [updatedTodo] = await db
      .update(todosTable)
      .set(updateData)
      .where(eq(todosTable.id, id))
      .returning();

    return updatedTodo;
  }

  async remove(id: string): Promise<Todo> {
    const [deletedTodo] = await db
      .delete(todosTable)
      .where(eq(todosTable.id, id))
      .returning();
    return deletedTodo;
  }

  private async validateCategoryTodoLimit(category: string) {
    const categoryTodos = await db
      .select({ id: todosTable.id })
      .from(todosTable)
      .where(
        and(
          sql`lower(${todosTable.category}) = lower(${category})`,
          eq(todosTable.done, false),
        ),
      );

    if (categoryTodos.length >= this.MAX_TODOS_PER_CATEGORY) {
      throw new ConflictException(
        `Category "${category}" already has ${this.MAX_TODOS_PER_CATEGORY} tasks.`,
      );
    }
  }
}

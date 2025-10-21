import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const todosTable = sqliteTable('todos', {
  id: text('id').primaryKey(),
  text: text('text').notNull(),
  category: text('category').notNull(),
  done: integer('done', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .defaultNow(),
  completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
});

export type SelectTodo = typeof todosTable.$inferSelect;
export type InsertTodo = typeof todosTable.$inferInsert;

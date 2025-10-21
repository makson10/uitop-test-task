import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Todo } from 'src/modules/todos/entities/todo.entity';

export function ApiFindAll() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all todos, optionally filtered by category' }),
    ApiQuery({
      name: 'category',
      required: false,
      description: 'Filter todos by category',
    }),
    ApiResponse({
      status: 200,
      description: 'List of todos',
      type: [Todo],
    }),
  );
}

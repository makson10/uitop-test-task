import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Todo } from 'src/modules/todos/entities/todo.entity';

export function ApiCreate() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new todo' }),
    ApiResponse({
      status: 201,
      description: 'The todo has been successfully created.',
      type: Todo,
    }),
    ApiResponse({
      status: 400,
      description: 'Category already has 5 tasks.',
    }),
  );
}

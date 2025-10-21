import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Todo } from 'src/modules/todos/entities/todo.entity';

export function ApiUpdate() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a todo (e.g., mark as completed)' }),
    ApiParam({ name: 'id', description: 'Todo ID' }),
    ApiResponse({
      status: 200,
      description: 'The todo has been successfully updated.',
      type: Todo,
    }),
    ApiResponse({
      status: 404,
      description: 'Todo not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Category limit reached when changing category',
    }),
  );
}

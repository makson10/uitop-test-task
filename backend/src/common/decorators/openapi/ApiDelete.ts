import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Todo } from 'src/modules/todos/entities/todo.entity';

export function ApiDelete() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a todo' }),
    ApiParam({ name: 'id', description: 'Todo ID' }),
    ApiResponse({
      status: 200,
      description: 'The todo has been deleted.',
      type: Todo,
    }),
    ApiResponse({
      status: 404,
      description: 'Todo not found',
    }),
  );
}

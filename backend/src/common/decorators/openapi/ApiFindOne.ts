import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Todo } from 'src/modules/todos/entities/todo.entity';

export function ApiFindOne() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a specific todo by ID' }),
    ApiParam({ name: 'id', description: 'Todo ID' }),
    ApiResponse({
      status: 200,
      description: 'The todo',
      type: Todo,
    }),
    ApiResponse({
      status: 404,
      description: 'Todo not found',
    }),
  );
}

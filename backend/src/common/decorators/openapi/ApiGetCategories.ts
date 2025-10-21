import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetCategories() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all categories' }),
    ApiResponse({
      status: 200,
      description: 'List of categories',
      type: [String],
    }),
  );
}

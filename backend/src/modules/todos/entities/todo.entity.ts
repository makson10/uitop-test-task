import { ApiProperty } from '@nestjs/swagger';

export class Todo {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Task text',
    example: 'Complete project documentation',
  })
  text: string;

  @ApiProperty({ description: 'Task category', example: 'Work' })
  category: string;

  @ApiProperty({ description: 'Completion status', example: false })
  done: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Completion timestamp', required: false })
  completedAt?: Date | null = null;
}

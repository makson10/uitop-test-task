import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

@ApiSchema({ name: 'UpdateTodo' })
export class UpdateTodoDto {
  @ApiProperty({
    description: 'Completion status',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  done?: boolean;

  @ApiProperty({
    description: 'Task text',
    required: false,
    example: 'Updated task text',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  text?: string;

  @ApiProperty({
    description: 'Task category',
    required: false,
    example: 'Personal',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;
}

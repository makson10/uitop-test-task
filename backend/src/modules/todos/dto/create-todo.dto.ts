import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@ApiSchema({ name: 'CreateTodo' })
export class CreateTodoDto {
  @ApiProperty({
    description: 'Task text',
    example: 'Complete project documentation',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  text: string;

  @ApiProperty({ description: 'Task category', example: 'Work' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string;
}

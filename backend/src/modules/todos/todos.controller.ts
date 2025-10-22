import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { ApiFindAll } from 'src/common/decorators/openapi/ApiFindAll';
import { ApiFindOne } from 'src/common/decorators/openapi/ApiFindOne';
import { ApiGetCategories } from 'src/common/decorators/openapi/ApiGetCategories';
import { ApiCreate } from 'src/common/decorators/openapi/ApiCreate';
import { ApiUpdate } from 'src/common/decorators/openapi/ApiUpdate';
import { ApiDelete } from 'src/common/decorators/openapi/ApiDelete';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @ApiFindAll()
  findAll(@Query('category') category?: string): Promise<Todo[]> {
    return this.todosService.findAll(category);
  }

  @Get('categories')
  @ApiGetCategories()
  getCategories(): Promise<string[]> {
    return this.todosService.getCategories();
  }

  @Get(':id')
  @ApiFindOne()
  findOne(@Param('id') id: string): Promise<Todo> {
    return this.todosService.findOne(id);
  }

  @Post()
  @ApiCreate()
  create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  @Patch(':id')
  @ApiUpdate()
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiDelete()
  remove(@Param('id') id: string): Promise<Todo> {
    return this.todosService.remove(id);
  }
}

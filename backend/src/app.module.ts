import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TodosModule } from './modules/todos/todos.module';

@Module({
  imports: [ConfigModule.forRoot(), TodosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

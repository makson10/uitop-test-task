import type { CreateTodo } from './todo';

export type FormValues = CreateTodo & {
	newCategoryName?: string;
};

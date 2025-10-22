import { api } from './axios';
import type { CreateTodo, Todo, UpdateTodo } from '../types/todo';

export const todosApi = {
	/**
	 * Get all todos, optionally filtered by category
	 */
	getAllTodos: async (category?: string): Promise<Todo[]> => {
		const params = category ? { category } : {};
		const response = await api.get<Todo[]>('/todos', { params });
		return response.data;
	},

	/**
	 * Get a single todo by ID
	 */
	getTodoById: async (id: string): Promise<Todo> => {
		const response = await api.get<Todo>(`/todos/${id}`);
		return response.data;
	},

	/**
	 * Get all available categories
	 */
	getCategories: async (): Promise<string[]> => {
		const response = await api.get<string[]>('/todos/categories');
		return response.data;
	},

	/**
	 * Create a new todo
	 */
	createTodo: async (data: CreateTodo): Promise<Todo> => {
		const response = await api.post<Todo>('/todos', data);
		return response.data;
	},

	/**
	 * Update an existing todo
	 */
	updateTodo: async (id: string, data: UpdateTodo): Promise<Todo> => {
		const response = await api.patch<Todo>(`/todos/${id}`, data);
		return response.data;
	},

	/**
	 * Delete a todo
	 */
	deleteTodo: async (id: string): Promise<Todo> => {
		const response = await api.delete<Todo>(`/todos/${id}`);
		return response.data;
	},
};

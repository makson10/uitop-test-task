import { useState, useCallback } from 'react';
import { todosApi } from '../api/todos';
import type { CreateTodo, Todo } from '../types/todo';

export const useTodos = (selectedCategory: string) => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/** Fetch todos */
	const fetchTodos = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await todosApi.getAllTodos(selectedCategory || undefined);
			setTodos(data);
		} catch (err) {
			setError((err as { message: string }).message || 'Failed to load todos');
		} finally {
			setIsLoading(false);
		}
	}, [selectedCategory]);

	/** Fetch categories */
	const fetchCategories = useCallback(async () => {
		try {
			const data = await todosApi.getCategories();
			setCategories(data);
		} catch (err) {
			console.error('Failed to load categories:', err);
		}
	}, []);

	/** Fetch all data in parallel */
	const fetchAll = useCallback(async () => {
		await Promise.allSettled([fetchTodos(), fetchCategories()]);
	}, [fetchTodos, fetchCategories]);

	/** Create todo */
	const createTodo = async (data: CreateTodo) => {
		try {
			setError(null);
			setIsCreating(true);
			await todosApi.createTodo(data);
			await fetchAll();
		} catch (err) {
			setError((err as { message: string }).message || 'Failed to create todo');
			throw err;
		} finally {
			setIsCreating(false);
		}
	};

	/** Update todo locally (for optimistic update) */
	const updateTodoLocally = (id: string, patch: Partial<Todo>) =>
		setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

	/** Remove todo locally (for optimistic update) */
	const removeTodoLocally = (id: string) =>
		setTodos((prev) => prev.filter((t) => t.id !== id));

	/** Update todo on server and locally */
	const updateTodo = async (id: string, done: boolean) => {
		try {
			setError(null);
			await todosApi.updateTodo(id, { done });
			updateTodoLocally(id, {
				done,
				completedAt: done ? new Date().toISOString() : null,
			});
		} catch (err) {
			setError((err as { message: string }).message || 'Failed to update todo');
			// Revert by refetching
			await fetchTodos();
			throw err;
		}
	};

	/** Delete todo on server and locally */
	const deleteTodo = async (id: string) => {
		try {
			setError(null);
			await todosApi.deleteTodo(id);
			removeTodoLocally(id);
			await fetchCategories();
		} catch (err) {
			setError((err as { message: string }).message || 'Failed to delete todo');
			throw err;
		}
	};

	return {
		todos,
		categories,
		isLoading,
		isCreating,
		error,
		setError,
		fetchAll,
		fetchTodos,
		createTodo,
		updateTodo,
		deleteTodo,
	};
};

import { useCallback, useEffect, useRef, useState } from 'react';
import { todosApi } from './api/todos';
import type { CreateTodo, Todo } from './types/todo';
import TodoItem from './components/TodoItem';
import TodoForm from './components/TodoForm';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';

const App = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [isLoading, setIsLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// using set in order to have unique ids
	const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

	// use ref to avoid re-renders after mutating timers
	// using Map because of its suatbility for this use case: key-value pairs with built-in methods like has, set, etc.
	const deletionTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
		new Map()
	);

	// Fetch todos
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

	// Fetch categories
	const fetchCategories = useCallback(async () => {
		try {
			const data = await todosApi.getCategories();
			setCategories(data);
		} catch (err) {
			console.error('Failed to load categories:', err);
		}
	}, []);

	const fetchAll = useCallback(async () => {
		await Promise.allSettled([fetchTodos(), fetchCategories()]);
	}, [fetchTodos, fetchCategories]);

	useEffect(() => {
		fetchAll();
	}, [fetchAll]);

	const handleCreateTodo = async (data: CreateTodo) => {
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

	const addTimer = (id: string) => {
		const timer = setTimeout(async () => {
			await handleDeleteTodo(id);
		}, 5000);

		deletionTimersRef.current.set(id, timer);
	};

	const clearTimer = (id: string) => {
		const timer = deletionTimersRef.current.get(id);
		if (timer) {
			clearTimeout(timer);
			deletionTimersRef.current.delete(id);
		}
	};

	const markDeleting = (id: string) =>
		setDeletingIds((prev) => {
			const next = new Set(prev);
			next.add(id);
			return next;
		});

	const unmarkDeleting = (id: string) =>
		setDeletingIds((prev) => {
			const next = new Set(prev);
			next.delete(id);
			return next;
		});

	const updateTodoLocally = (id: string, patch: Partial<Todo>) =>
		setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

	const removeTodoLocally = (id: string) =>
		setTodos((prev) => prev.filter((t) => t.id !== id));

	const handleToggleTodo = async (id: string, done: boolean) => {
		try {
			setError(null);
			await todosApi.updateTodo(id, { done });

			updateTodoLocally(id, {
				done,
				completedAt: done ? new Date().toISOString() : null,
			});

			if (done) addTimer(id);
			else clearTimer(id);
		} catch (err) {
			setError((err as { message: string }).message || 'Failed to update todo');
			// revert local changes on error
			await fetchTodos();
		}
	};

	const handleDeleteTodo = async (id: string) => {
		try {
			setError(null);
			markDeleting(id);
			await todosApi.deleteTodo(id);

			removeTodoLocally(id);
			clearTimer(id);

			// refetch categories for stay sync with backend after deleting todo
			await fetchCategories();
		} catch (err) {
			setError((err as { message: string }).message || 'Failed to delete todo');
		} finally {
			unmarkDeleting(id);
		}
	};

	useEffect(() => {
		const timers = deletionTimersRef.current;
		return () => {
			timers.forEach((timer) => clearTimeout(timer));
		};
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-5xl mx-auto px-4">
				<header className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
					<p className="text-gray-600 mt-1">Manage your tasks efficiently</p>
				</header>

				<div className="grid gap-6 md:grid-cols-5">
					{/* Main content */}
					<div className="md:col-span-3 space-y-4 order-2 md:order-1">
						{/* Category filter */}
						<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label
								htmlFor="filter"
								className="block text-sm font-medium text-gray-700 mb-2">
								Filter by Category
							</label>
							<select
								id="filter"
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="">All Categories</option>
								{categories.map((cat) => (
									<option key={cat} value={cat}>
										{cat}
									</option>
								))}
							</select>
						</div>

						{/* Error message */}
						{error && (
							<ErrorMessage message={error} onDismiss={() => setError(null)} />
						)}

						{/* Todos list */}
						<div className="space-y-3">
							{isLoading ? (
								<Loader />
							) : todos.length === 0 ? (
								<EmptyState />
							) : (
								todos.map((todo) => (
									<TodoItem
										key={todo.id}
										todo={todo}
										onToggle={handleToggleTodo}
										onDelete={handleDeleteTodo}
										isDeleted={deletingIds.has(todo.id)}
									/>
								))
							)}
						</div>
					</div>

					<div className="md:col-span-2 order-1 md:order-2">
						<TodoForm
							categories={categories}
							onSubmit={handleCreateTodo}
							isCreating={isCreating}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;

import { useEffect, useState } from 'react';
import TodoItem from './components/TodoItem';
import TodoForm from './components/TodoForm';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';
import CategoryFilter from './components/CategoryFilter';
import { Snackbar } from './components/Snackbar';
import { useTodos } from './hooks/useTodos';
import { useDeletionTimers } from './hooks/useDeletionTimers';
import { useSnackbar } from './hooks/useSnackbar';
import TodoHeader from './components/TodoHeader';

const App = () => {
	const [selectedCategory, setSelectedCategory] = useState<string>('');

	const {
		todos,
		categories,
		isLoading,
		isCreating,
		error,
		setError,
		fetchAll,
		createTodo,
		updateTodo,
		deleteTodo,
	} = useTodos(selectedCategory);

	const {
		scheduleDelete,
		cancelDeletingTimer,
		markDeleting,
		unmarkDeleting,
		isDeleted,
	} = useDeletionTimers();

	const snackbar = useSnackbar();

	// Initial data fetch
	useEffect(() => {
		fetchAll();
	}, [fetchAll]);

	// Handle todo creation
	const handleCreateTodo = createTodo;

	// Mark as done/undone
	const handleToggleTodo = async (id: string, done: boolean) => {
		await updateTodo(id, done);

		if (done) {
			snackbar.open(id);
			scheduleDelete(id, async () => {
				await handleDeleteTodo(id);
			});
		} else {
			cancelDeletingTimer(id);
			if (snackbar.completedTodoId === id) {
				snackbar.close();
			}
		}
	};

	// Handle todo deletion
	const handleDeleteTodo = async (id: string) => {
		markDeleting(id);
		await deleteTodo(id);
		cancelDeletingTimer(id);

		if (snackbar.completedTodoId === id) {
			snackbar.close();
		}

		unmarkDeleting(id);
	};

	// Handle undo action from snackbar
	const handleUndo = async () => {
		if (!snackbar.completedTodoId) return;

		cancelDeletingTimer(snackbar.completedTodoId);
		await handleToggleTodo(snackbar.completedTodoId, false);
		snackbar.close();
	};

	// Handle snackbar close
	const handleSnackbarClose = () => snackbar.close();

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-5xl mx-auto px-4">
				{/* Header */}
				<TodoHeader />

				<div className="grid gap-6 md:grid-cols-5">
					{/* Main content */}
					<div className="md:col-span-3 space-y-4 order-2 md:order-1">
						{/* Category filter */}
						<CategoryFilter
							selectedCategory={selectedCategory}
							categories={categories}
							onCategoryChange={setSelectedCategory}
						/>

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
										isDeleted={isDeleted(todo.id)}
									/>
								))
							)}
						</div>
					</div>

					<div className="md:col-span-2 order-1 md:order-2">
						{/* Todo creation form */}
						<TodoForm
							categories={categories}
							onSubmit={handleCreateTodo}
							isCreating={isCreating}
						/>
					</div>
				</div>

				{/* Snackbar */}
				<Snackbar
					open={snackbar.isOpen}
					handleUndo={handleUndo}
					handleClose={handleSnackbarClose}
				/>
			</div>
		</div>
	);
};

export default App;

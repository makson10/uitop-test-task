import type { Todo } from '../types/todo';

interface TodoItemProps {
	todo: Todo;
	onToggle: (id: string, done: boolean) => void;
	onDelete: (id: string) => void;
	isDeleted?: boolean;
}

const TodoItem = ({ todo, onToggle, onDelete, isDeleted }: TodoItemProps) => {
	const handleCheckboxChange = () => {
		onToggle(todo.id, !todo.done);
	};

	return (
		<div
			className={`flex items-start gap-3 p-4 bg-white rounded-lg border transition-all ${
				todo.done
					? 'border-green-200 bg-green-50 opacity-75'
					: 'border-gray-200 hover:border-gray-300'
			} ${isDeleted ? 'animate-pulse' : ''}`}>
			<input
				type="checkbox"
				checked={todo.done}
				onChange={handleCheckboxChange}
				className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
				disabled={isDeleted}
			/>
			<div className="flex-1 min-w-0">
				<p
					className={`text-sm font-medium ${
						todo.done ? 'line-through text-gray-500' : 'text-gray-900'
					}`}>
					{todo.text}
				</p>
				<div className="flex items-center gap-2 mt-1">
					<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
						{todo.category}
					</span>
					{todo.done && todo.completedAt && (
						<span className="text-xs text-gray-500">
							Completed {new Date(todo.completedAt).toLocaleTimeString()}
						</span>
					)}
				</div>
			</div>
			<button
				onClick={() => onDelete(todo.id)}
				disabled={isDeleted}
				className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="Delete todo">
				<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
		</div>
	);
};

export default TodoItem;

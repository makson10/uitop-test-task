import { useForm } from 'react-hook-form';
import type { CreateTodo } from '../types/todo';
import type { FormValues } from '../types/form';

interface Props {
	categories: string[];
	isCreating: boolean;
	onSubmit: (data: CreateTodo) => Promise<void>;
}

const TodoForm = ({ categories, onSubmit, isCreating }: Props) => {
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<FormValues>();

	const selectedCategory = watch('category');

	const onFormSubmit = async (data: FormValues) => {
		const body = {
			text: data.text,
			category: data.newCategoryName ? data.newCategoryName : data.category,
		};
		await onSubmit(body);
		reset();
	};

	return (
		<form
			onSubmit={handleSubmit(onFormSubmit)}
			className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
			<h2 className="text-lg font-semibold text-gray-900 mb-4">
				Create New Task
			</h2>
			<div className="space-y-4">
				<div>
					<label
						htmlFor="text"
						className="block text-sm font-medium text-gray-700 mb-1">
						Task Text
					</label>
					<input
						id="text"
						type="text"
						{...register('text', {
							required: 'Task text is required',
							maxLength: {
								value: 500,
								message: 'Task text must not exceed 500 characters',
							},
						})}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="Enter task description..."
						disabled={isCreating}
					/>
					{errors.text && (
						<p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="category"
						className="block text-sm font-medium text-gray-700 mb-1">
						Category
					</label>
					<div className="relative">
						<select
							id="category"
							{...register('category', {
								required: 'Category is required',
							})}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-10"
							disabled={isCreating}>
							<option value="">Select a category...</option>
							{categories.map((cat) => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
							<option value="__new__" className="font-medium">
								+ New Category
							</option>
						</select>
						<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					</div>
					{errors.category && (
						<p className="mt-1 text-sm text-red-600">
							{errors.category.message}
						</p>
					)}

					{/* Show input field for new category */}
					{selectedCategory === '__new__' && (
						<div className="mt-2">
							<input
								type="text"
								{...register('newCategoryName')}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter new category name..."
								disabled={isCreating}
							/>
						</div>
					)}
				</div>

				<button
					type="submit"
					disabled={isCreating}
					className="w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
					{isCreating ? 'Creating...' : 'Create Task'}
				</button>
			</div>
		</form>
	);
};

export default TodoForm;

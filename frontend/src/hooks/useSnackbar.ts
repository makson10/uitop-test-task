import { useState } from 'react';

export const useSnackbar = () => {
	const [completedTodoId, setCompletedTodoId] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	/** Open the snackbar for a specific todo */
	const open = (todoId: string) => {
		setCompletedTodoId(todoId);
		setIsOpen(true);
	};

	/** Close the snackbar */
	const close = () => {
		setIsOpen(false);
		setCompletedTodoId(null);
	};

	return {
		completedTodoId,
		isOpen,
		open,
		close,
	};
};

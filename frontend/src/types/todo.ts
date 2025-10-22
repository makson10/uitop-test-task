export interface Todo {
	id: string;
	text: string;
	category: string;
	done: boolean;
	createdAt: string;
	updatedAt: string;
	completedAt?: string | null;
}

export interface CreateTodo {
	text: string;
	category: string;
}

export interface UpdateTodo {
	text?: string;
	category?: string;
	done?: boolean;
}

import { useRef, useEffect, useState } from 'react';

export const useDeletionTimers = () => {
	// use a Set to avoid duplicate ids
	const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
	// use ref to avoid re-renders on timer changes
	// use Map to have key-value pairs with built-in methods, like has, set, etc.
	const deletionTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
		new Map()
	);

	/** Add a timer for delayed deletion */
	const scheduleDelete = (id: string, onDelete: () => Promise<void>) => {
		const timer = setTimeout(async () => {
			await onDelete();
		}, 5000);

		deletionTimersRef.current.set(id, timer);
	};

	/** Cancel a scheduled deletion */
	const cancelDeletingTimer = (id: string) => {
		const timer = deletionTimersRef.current.get(id);
		if (timer) {
			clearTimeout(timer);
			deletionTimersRef.current.delete(id);
		}
	};

	/** Mark an id as deleting */
	const markDeleting = (id: string) =>
		setDeletingIds((prev) => {
			const next = new Set(prev);
			next.add(id);
			return next;
		});

	/** Unmark an id as deleting */
	const unmarkDeleting = (id: string) =>
		setDeletingIds((prev) => {
			const next = new Set(prev);
			next.delete(id);
			return next;
		});

	/** Check if an id is being deleted */
	const isDeleted = (id: string) => deletingIds.has(id);

	/** Cleanup all timers on unmount */
	useEffect(() => {
		const timers = deletionTimersRef.current;
		return () => {
			timers.forEach((timer) => clearTimeout(timer));
		};
	}, []);

	return {
		deletingIds,
		scheduleDelete,
		cancelDeletingTimer,
		markDeleting,
		unmarkDeleting,
		isDeleted,
	};
};

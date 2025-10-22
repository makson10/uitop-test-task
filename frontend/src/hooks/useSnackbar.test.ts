import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSnackbar } from './useSnackbar';

describe('useSnackbar', () => {
	it('should initialize with closed state', () => {
		const { result } = renderHook(() => useSnackbar());

		expect(result.current.isOpen).toBe(false);
		expect(result.current.completedTodoId).toBeNull();
	});

	it('should close snackbar and clear todo id', () => {
		const { result } = renderHook(() => useSnackbar());

		result.current.open('todo-123');
		result.current.close();

		expect(result.current.isOpen).toBe(false);
		expect(result.current.completedTodoId).toBeNull();
	});
});

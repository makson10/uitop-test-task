import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDeletionTimers } from './useDeletionTimers';

describe('useDeletionTimers', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should initialize with empty state', () => {
		const { result } = renderHook(() => useDeletionTimers());

		expect(result.current.deletingIds.size).toBe(0);
		expect(result.current.isDeleted('any-id')).toBe(false);
	});

	it('should mark an id as deleting', () => {
		const { result } = renderHook(() => useDeletionTimers());

		act(() => {
			result.current.markDeleting('todo-1');
		});

		expect(result.current.isDeleted('todo-1')).toBe(true);
		expect(result.current.deletingIds.has('todo-1')).toBe(true);
	});

	it('should unmark an id', () => {
		const { result } = renderHook(() => useDeletionTimers());

		act(() => {
			result.current.markDeleting('todo-1');
			result.current.unmarkDeleting('todo-1');
		});

		expect(result.current.isDeleted('todo-1')).toBe(false);
	});

	it('should schedule a deletion callback', async () => {
		const { result } = renderHook(() => useDeletionTimers());
		const mockCallback = vi.fn();

		act(() => {
			result.current.scheduleDelete('todo-1', mockCallback);
		});

		// Callback should not be called immediately
		expect(mockCallback).not.toHaveBeenCalled();

		// Fast-forward time by 5 seconds
		await act(async () => {
			vi.advanceTimersByTime(5000);
		});

		// Callback should be called after 5 seconds
		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it('should clean up timers on unmount', () => {
		const { result, unmount } = renderHook(() => useDeletionTimers());
		const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
		const mockCallback = vi.fn();

		act(() => {
			result.current.scheduleDelete('todo-1', mockCallback);
		});

		unmount();

		expect(clearTimeoutSpy).toHaveBeenCalled();
	});
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
	it('should render error message', () => {
		render(<ErrorMessage message="Something went wrong" />);

		expect(screen.getByText('Something went wrong')).toBeInTheDocument();
	});

	it('should render dismiss button', () => {
		const mockDismiss = vi.fn();
		render(<ErrorMessage message="Error" onDismiss={mockDismiss} />);

		const dismissButton = screen.getByLabelText('Dismiss error');
		expect(dismissButton).toBeInTheDocument();
	});

	it('should call onDismiss when dismiss button is clicked', async () => {
		const user = userEvent.setup();
		const mockDismiss = vi.fn();

		render(<ErrorMessage message="Error" onDismiss={mockDismiss} />);

		const dismissButton = screen.getByLabelText('Dismiss error');
		await user.click(dismissButton);

		expect(mockDismiss).toHaveBeenCalledTimes(1);
	});
});

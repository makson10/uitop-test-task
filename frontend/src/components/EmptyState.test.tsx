import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
	it('should render empty state message', () => {
		render(<EmptyState />);

		expect(screen.getByText('No tasks')).toBeInTheDocument();
		expect(
			screen.getByText('Create your first task to get started')
		).toBeInTheDocument();
	});

	it('should render an icon', () => {
		const { container } = render(<EmptyState />);

		const icon = container.querySelector('svg');
		expect(icon).toBeInTheDocument();
	});
});

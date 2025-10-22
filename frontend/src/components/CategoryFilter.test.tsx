import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryFilter from './CategoryFilter';

describe('CategoryFilter', () => {
	const mockCategories = ['Work', 'Personal', 'Shopping'];
	const mockOnChange = vi.fn();

	beforeEach(() => {
		mockOnChange.mockClear();
	});

	it('should render with all categories', () => {
		render(
			<CategoryFilter
				selectedCategory=""
				categories={mockCategories}
				onCategoryChange={mockOnChange}
			/>
		);

		expect(screen.getByLabelText('Filter by Category')).toBeInTheDocument();
		expect(screen.getByRole('combobox')).toBeInTheDocument();

		expect(screen.getByText('All Categories')).toBeInTheDocument();

		mockCategories.forEach((category) => {
			expect(screen.getByText(category)).toBeInTheDocument();
		});
	});

	it('should display selected category', () => {
		render(
			<CategoryFilter
				selectedCategory="Work"
				categories={mockCategories}
				onCategoryChange={mockOnChange}
			/>
		);

		const select = screen.getByRole('combobox') as HTMLSelectElement;
		expect(select.value).toBe('Work');
	});

	it('should call onCategoryChange when selection changes', async () => {
		const user = userEvent.setup();

		render(
			<CategoryFilter
				selectedCategory=""
				categories={mockCategories}
				onCategoryChange={mockOnChange}
			/>
		);

		const select = screen.getByRole('combobox');
		await user.selectOptions(select, 'Personal');

		expect(mockOnChange).toHaveBeenCalledWith('Personal');
		expect(mockOnChange).toHaveBeenCalledTimes(1);
	});

	it('should handle empty categories list', () => {
		render(
			<CategoryFilter
				selectedCategory=""
				categories={[]}
				onCategoryChange={mockOnChange}
			/>
		);

		expect(screen.getByText('All Categories')).toBeInTheDocument();

		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(1);
	});
});

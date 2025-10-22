interface CategoryFilterProps {
	selectedCategory: string;
	categories: string[];
	onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({
	selectedCategory,
	categories,
	onCategoryChange,
}: CategoryFilterProps) => {
	return (
		<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
			<label
				htmlFor="filter"
				className="block text-sm font-medium text-gray-700 mb-2">
				Filter by Category
			</label>
			<select
				id="filter"
				value={selectedCategory}
				onChange={(e) => onCategoryChange(e.target.value)}
				className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
				<option value="">All Categories</option>
				{categories.map((cat) => (
					<option key={cat} value={cat}>
						{cat}
					</option>
				))}
			</select>
		</div>
	);
};

export default CategoryFilter;

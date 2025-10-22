const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <svg
            className="w-16 h-16 mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-lg font-medium">No tasks</p>
        <p className="text-sm mt-1">Create your first task to get started</p>
    </div>
);

export default EmptyState;

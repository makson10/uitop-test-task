import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [react(), tailwindcss()],
		server: {
			port: parseInt(env.PORT, 10) ?? 5173,
		},
		test: {
			globals: true,
			environment: 'jsdom',
			setupFiles: './src/test/setup.ts',
		},
	};
});

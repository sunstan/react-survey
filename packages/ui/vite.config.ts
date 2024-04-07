import { resolve } from 'path';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		dts({
			rollupTypes: true,
		}),
	],
	css: {
		postcss: {
			plugins: [tailwindcss],
		},
	},
	build: {
		outDir: './dist',
		lib: {
			name: 'ui',
			fileName: (format) => `index.${format}.js`,
			entry: resolve(__dirname, 'src/index.tsx'),
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'tailwindcss'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
					tailwindcss: 'tailwindcss',
				},
			},
		},
		sourcemap: true,
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			'tailwind-config': resolve(__dirname, './tailwind.config.ts'),
		},
	},
});

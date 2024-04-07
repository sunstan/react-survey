import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      package: path.resolve(__dirname, './package.json'),
      'tailwind-config': path.resolve(__dirname, './tailwind.config.ts'),
    },
  },
});

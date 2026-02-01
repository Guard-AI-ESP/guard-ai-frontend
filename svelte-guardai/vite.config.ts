import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '/v1')
			},
			'/ws': {
				target: 'ws://localhost:8080',
				ws: true,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/ws/, '/v1')
			}
		}
	}
});
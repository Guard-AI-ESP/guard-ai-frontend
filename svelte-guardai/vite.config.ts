import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
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
				changeOrigin: true
				// Pas de rewrite — le backend expose directement /ws/events/stream
			}
		}
	}
});
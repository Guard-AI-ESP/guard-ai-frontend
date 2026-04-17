import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Use the Node adapter for deployments that run the SvelteKit app in a Node.js environment.
		// See https://svelte.dev/docs/kit/adapters for information about other adapter options.
		adapter: adapter()
	}
};

export default config;

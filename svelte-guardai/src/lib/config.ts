/**
 * Guard-AI Configuration
 * Environment variables for API connection
 */

export const config = {
	// Use proxy paths in development (proxied via vite.config.ts)
	apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
	wsBaseUrl: import.meta.env.VITE_WS_BASE_URL || `${typeof window !== 'undefined' ? (window.location.protocol === 'https:' ? 'wss:' : 'ws:') : 'ws:'}//${typeof window !== 'undefined' ? window.location.host : 'localhost:5173'}/ws`
} as const;

/**
 * Get the API key from environment
 * In production, this should be handled more securely
 */
export function getApiKey(): string {
	const apiKey = import.meta.env.VITE_API_KEY || '';
	if (!apiKey) {
		console.warn('VITE_API_KEY is not set. API calls may fail with 401.');
	}
	return apiKey;
}

/**
 * Check if API key is configured
 */
export function hasApiKey(): boolean {
	return Boolean(import.meta.env.VITE_API_KEY);
}

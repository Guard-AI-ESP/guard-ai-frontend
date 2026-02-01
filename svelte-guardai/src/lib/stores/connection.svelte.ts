/**
 * Guard-AI Connection Store
 * Traditional Svelte store for compatibility
 */

import { writable, derived, get } from 'svelte/store';
import { isBackendHealthy } from '$lib/api/health';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// Core state
export const wsStatus = writable<ConnectionStatus>('disconnected');
export const apiStatus = writable<ConnectionStatus>('disconnected');
export const lastError = writable<string | null>(null);

// Derived values
export const isConnected = derived(apiStatus, ($status) => $status === 'connected');
export const isWsConnected = derived(wsStatus, ($status) => $status === 'connected');
export const hasError = derived(
	[apiStatus, wsStatus],
	([$api, $ws]) => $api === 'error' || $ws === 'error'
);

// Actions
export const connectionStore = {
	subscribe: apiStatus.subscribe,

	get apiStatus() {
		return get(apiStatus);
	},
	get wsStatus() {
		return get(wsStatus);
	},
	get isConnected() {
		return get(isConnected);
	},
	get isWsConnected() {
		return get(isWsConnected);
	},
	get lastError() {
		return get(lastError);
	},

	async checkApiHealth(): Promise<boolean> {
		apiStatus.set('connecting');

		try {
			const healthy = await isBackendHealthy();
			console.log('API health check:', healthy);
			apiStatus.set(healthy ? 'connected' : 'error');
			return healthy;
		} catch (e) {
			console.error('API health check error:', e);
			apiStatus.set('error');
			lastError.set(e instanceof Error ? e.message : 'Connection failed');
			return false;
		}
	},

	setWsStatus(status: ConnectionStatus, error?: string): void {
		wsStatus.set(status);
		if (error) {
			lastError.set(error);
		}
	},

	reset(): void {
		wsStatus.set('disconnected');
		apiStatus.set('disconnected');
		lastError.set(null);
	}
};

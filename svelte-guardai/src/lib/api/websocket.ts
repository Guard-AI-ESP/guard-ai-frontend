/**
 * Guard-AI WebSocket Manager
 * Handles real-time event streaming with auto-reconnection
 */

import { config, getApiKey } from '$lib/config';
import { eventsStore } from '$lib/stores/events.svelte';
import { statsStore } from '$lib/stores/stats.svelte';
import { connectionStore } from '$lib/stores/connection.svelte';
import type { EventV1 } from '$lib/types';

interface WebSocketManagerOptions {
	maxReconnectAttempts?: number;
	reconnectDelay?: number;
	reconnectBackoffMultiplier?: number;
}

class WebSocketManager {
	private ws: WebSocket | null = null;
	private reconnectAttempts = 0;
	private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
	private isManuallyDisconnected = false;

	private readonly options: Required<WebSocketManagerOptions> = {
		maxReconnectAttempts: 10,
		reconnectDelay: 1000,
		reconnectBackoffMultiplier: 1.5
	};

	constructor(options?: WebSocketManagerOptions) {
		if (options) {
			this.options = { ...this.options, ...options };
		}
	}

	/**
	 * Connect to WebSocket endpoint
	 */
	connect(): void {
		if (this.ws?.readyState === WebSocket.OPEN) {
			console.warn('WebSocket already connected');
			return;
		}

		this.isManuallyDisconnected = false;
		this.doConnect();
	}

	private doConnect(): void {
		const apiKey = getApiKey();

		// Si pas de clé API, on se connecte sans — le backend accepte sans clé en dev
		const wsUrl = apiKey
			? `${config.wsBaseUrl}/events/stream?api_key=${encodeURIComponent(apiKey)}`
			: `${config.wsBaseUrl}/events/stream`;

		connectionStore.setWsStatus('connecting');

		try {
			this.ws = new WebSocket(wsUrl);
			this.setupEventHandlers();
		} catch (error) {
			console.error('WebSocket connection error:', error);
			connectionStore.setWsStatus('error', 'Connection failed');
			this.scheduleReconnect();
		}
	}

	private setupEventHandlers(): void {
		if (!this.ws) return;

		this.ws.onopen = () => {
			console.log('WebSocket connected');
			this.reconnectAttempts = 0;
			connectionStore.setWsStatus('connected');
		};

		this.ws.onmessage = (event: MessageEvent) => {
			try {
				const data: EventV1 = JSON.parse(event.data);
				// Add new event to store
				eventsStore.addEvent(data);
				// Refresh stats to keep them in sync
				statsStore.load();
			} catch (error) {
				console.error('Failed to parse WebSocket message:', error);
			}
		};

		this.ws.onerror = (error) => {
			console.error('WebSocket error:', error);
			connectionStore.setWsStatus('error', 'Connection error');
		};

		this.ws.onclose = (event) => {
			console.log('WebSocket closed:', event.code, event.reason);
			connectionStore.setWsStatus('disconnected');

			if (!this.isManuallyDisconnected) {
				this.scheduleReconnect();
			}
		};
	}

	private scheduleReconnect(): void {
		if (this.isManuallyDisconnected) return;

		if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
			console.error('Max reconnect attempts reached');
			connectionStore.setWsStatus('error', 'Max reconnect attempts reached');
			return;
		}

		// Exponential backoff
		const delay =
			this.options.reconnectDelay *
			Math.pow(this.options.reconnectBackoffMultiplier, this.reconnectAttempts);

		console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);

		this.reconnectTimeout = setTimeout(() => {
			this.reconnectAttempts++;
			this.doConnect();
		}, delay);
	}

	/**
	 * Disconnect from WebSocket
	 */
	disconnect(): void {
		this.isManuallyDisconnected = true;

		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
			this.reconnectTimeout = null;
		}

		if (this.ws) {
			this.ws.close(1000, 'Client disconnect');
			this.ws = null;
		}

		connectionStore.setWsStatus('disconnected');
	}

	/**
	 * Check if connected
	 */
	get isConnected(): boolean {
		return this.ws?.readyState === WebSocket.OPEN;
	}

	/**
	 * Get current state
	 */
	get readyState(): number | null {
		return this.ws?.readyState ?? null;
	}
}

// Singleton instance
export const wsManager = new WebSocketManager();

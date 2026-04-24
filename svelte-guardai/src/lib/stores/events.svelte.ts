/**
 * Guard-AI Events Store
 * Traditional Svelte store for compatibility
 */

import { writable, derived, get } from 'svelte/store';
import { fetchEvents, fetchRecentEvents } from '$lib/api/events';
import type { EventV1, EventQueryParams } from '$lib/types';

// Core state
export const eventsData = writable<EventV1[]>([]);
export const eventsLoading = writable(false);
export const eventsError = writable<string | null>(null);
export const eventsTotalCount = writable(0);

// Derived values
export const recentEvents = derived(eventsData, ($data) => $data.slice(0, 10));
export const hasEvents = derived(eventsData, ($data) => $data.length > 0);
export const isEmpty = derived(
	[eventsLoading, eventsData],
	([$loading, $data]) => !$loading && $data.length === 0
);

// Actions
export const eventsStore = {
	subscribe: eventsData.subscribe,

	get loading() {
		return get(eventsLoading);
	},
	get error() {
		return get(eventsError);
	},
	get recentEvents() {
		return get(recentEvents);
	},
	get isEmpty() {
		return get(isEmpty);
	},
	get totalCount() {
		return get(eventsTotalCount);
	},

	async load(params: EventQueryParams = {}): Promise<void> {
		eventsLoading.set(true);
		eventsError.set(null);

		try {
			const response = await fetchEvents(params);
			console.log('Events loaded:', response);
			eventsData.set(response.events);
			eventsTotalCount.set(response.count);
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Failed to load events';
			console.error('Events load error:', e);
			eventsError.set(msg);
		} finally {
			eventsLoading.set(false);
		}
	},

	async loadRecent(limit: number = 10): Promise<void> {
		eventsLoading.set(true);
		eventsError.set(null);

		try {
			const events = await fetchRecentEvents(limit);
			console.log('Recent events loaded:', events);
			eventsData.set(events);
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Failed to load events';
			console.error('Events load error:', e);
			eventsError.set(msg);
		} finally {
			eventsLoading.set(false);
		}
	},

	addEvent(event: EventV1): void {
		eventsData.update((events) => [event, ...events]);
		eventsTotalCount.update((n) => n + 1);
	},

	reset(): void {
		eventsData.set([]);
		eventsLoading.set(false);
		eventsError.set(null);
		eventsTotalCount.set(0);
	}
};

/**
 * Guard-AI Stats Store
 * Traditional Svelte store for compatibility
 */

import { writable, derived, get } from 'svelte/store';
import { fetchStats } from '$lib/api/stats';
import type { EventStats } from '$lib/types';

// Core state
export const statsData = writable<EventStats | null>(null);
export const statsLoading = writable(false);
export const statsError = writable<string | null>(null);

// Derived values
export const totalEvents = derived(statsData, ($data) => $data?.total_events ?? 0);
export const last24h = derived(statsData, ($data) => $data?.last_24h ?? 0);
export const criticalCount = derived(statsData, ($data) => $data?.by_severity?.critical ?? 0);
export const warningCount = derived(statsData, ($data) => $data?.by_severity?.warning ?? 0);
export const activeAlerts = derived(
	[criticalCount, warningCount],
	([$critical, $warning]) => $critical + $warning
);
export const bySource = derived(statsData, ($data) => $data?.by_source ?? {});
export const bySeverity = derived(statsData, ($data) => $data?.by_severity ?? {});

// Actions
export const statsStore = {
	subscribe: statsData.subscribe,

	get loading() {
		return get(statsLoading);
	},
	get error() {
		return get(statsError);
	},
	get totalEvents() {
		return get(totalEvents);
	},
	get last24h() {
		return get(last24h);
	},
	get activeAlerts() {
		return get(activeAlerts);
	},
	get bySource() {
		return get(bySource);
	},
	get bySeverity() {
		return get(bySeverity);
	},

	async load(): Promise<void> {
		statsLoading.set(true);
		statsError.set(null);

		try {
			const data = await fetchStats();
			console.log('Stats loaded:', data);
			statsData.set(data);
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Failed to load stats';
			console.error('Stats load error:', e);
			statsError.set(msg);
		} finally {
			statsLoading.set(false);
		}
	},

	reset(): void {
		statsData.set(null);
		statsLoading.set(false);
		statsError.set(null);
	}
};

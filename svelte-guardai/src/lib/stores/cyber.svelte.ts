/**
 * Guard-AI Cyber Store
 * Devices + hubs snapshot, plus command dispatch helpers for the
 * dashboard-cyber view. Same pattern as stores/events.svelte.ts.
 */

import { writable, derived, get } from 'svelte/store';
import { fetchDevices } from '$lib/api/devices';
import { dispatchCommand, fetchHubs, getCommand } from '$lib/api/hubs';
import type { Device } from '$lib/types/device';
import type { Command, Hub } from '$lib/types/hub';

// ── State ────────────────────────────────────────────────────────────────────

export const devicesData = writable<Device[]>([]);
export const hubsData = writable<Hub[]>([]);
export const lastScanCommand = writable<Command | null>(null);

export const cyberLoading = writable(false);
export const cyberError = writable<string | null>(null);

// ── Derived ──────────────────────────────────────────────────────────────────

export const connectedDevices = derived(devicesData, ($d) => $d.filter((x) => x.connected));

export const connectedCount = derived(connectedDevices, ($c) => $c.length);

/** Premier hub enregistré — sert d'ancre pour la démo avec un seul Pi. */
export const primaryHub = derived(hubsData, ($h) => $h[0] ?? null);

/** Hub considéré en ligne si heartbeat < 60s. */
export const HUB_ONLINE_THRESHOLD_MS = 60_000;
export const isHubOnline = derived(primaryHub, ($hub) => {
	if (!$hub?.last_seen_at) return false;
	const age = Date.now() - new Date($hub.last_seen_at).getTime();
	return Number.isFinite(age) && age < HUB_ONLINE_THRESHOLD_MS;
});

/** `succeeded` / `failed` clos le scan, tout le reste le laisse "en cours". */
export const scanInProgress = derived(lastScanCommand, ($cmd) => {
	if (!$cmd) return false;
	return $cmd.status !== 'succeeded' && $cmd.status !== 'failed';
});

// ── Actions ──────────────────────────────────────────────────────────────────

export const cyberStore = {
	subscribe: devicesData.subscribe,

	get devices(): Device[] {
		return get(devicesData);
	},
	get hubs(): Hub[] {
		return get(hubsData);
	},
	get primaryHub(): Hub | null {
		return get(primaryHub);
	},

	async loadAll(): Promise<void> {
		cyberLoading.set(true);
		cyberError.set(null);
		try {
			const [devices, hubs] = await Promise.all([fetchDevices(), fetchHubs()]);
			devicesData.set(devices);
			hubsData.set(hubs);
		} catch (e) {
			cyberError.set(e instanceof Error ? e.message : 'Failed to load cyber data');
		} finally {
			cyberLoading.set(false);
		}
	},

	async refreshDevices(): Promise<void> {
		try {
			devicesData.set(await fetchDevices());
		} catch (e) {
			cyberError.set(e instanceof Error ? e.message : 'Failed to refresh devices');
		}
	},

	/**
	 * Lance un scan réseau sur le hub passé en paramètre (ou le primary hub).
	 * Poll la commande toutes les secondes jusqu'à terminaison ou timeout (30s).
	 * Les events network qui retombent pendant le scan arrivent via le canal WS
	 * existant — aucune subscription supplémentaire ici.
	 */
	async triggerScan(hubId?: string, subnet = '192.168.50.0/24'): Promise<Command | null> {
		const target = hubId ?? get(primaryHub)?.id;
		if (!target) {
			cyberError.set('No hub registered — cannot dispatch a scan');
			return null;
		}

		try {
			const cmd = await dispatchCommand(target, {
				type: 'scan_network',
				payload: { subnet, mode: 'host_discovery' },
				ttl_seconds: 60
			});
			lastScanCommand.set(cmd);

			// Poll au mieux — n'interrompt pas l'UI si le hub est offline.
			const deadline = Date.now() + 30_000;
			while (Date.now() < deadline) {
				await new Promise((r) => setTimeout(r, 1_000));
				try {
					const updated = await getCommand(target, cmd.id);
					lastScanCommand.set(updated);
					if (updated.status === 'succeeded' || updated.status === 'failed') {
						await this.refreshDevices();
						return updated;
					}
				} catch {
					// ignore transient errors, keep polling
				}
			}
			return get(lastScanCommand);
		} catch (e) {
			cyberError.set(e instanceof Error ? e.message : 'Failed to dispatch scan');
			return null;
		}
	},

	async kickDevice(mac: string, hubId?: string): Promise<Command | null> {
		const target = hubId ?? get(primaryHub)?.id;
		if (!target) {
			cyberError.set('No hub registered — cannot kick a device');
			return null;
		}
		try {
			return await dispatchCommand(target, {
				type: 'kick_device',
				payload: { mac_address: mac }
			});
		} catch (e) {
			cyberError.set(e instanceof Error ? e.message : 'Failed to kick device');
			return null;
		}
	},

	reset(): void {
		devicesData.set([]);
		hubsData.set([]);
		lastScanCommand.set(null);
		cyberError.set(null);
	}
};

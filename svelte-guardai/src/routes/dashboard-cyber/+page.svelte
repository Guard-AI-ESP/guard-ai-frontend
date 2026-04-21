<script lang="ts">
	import { onMount } from 'svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Dialog from '$lib/components/ui/dialog';
	import {
		Monitor,
		TriangleAlert,
		Wifi,
		ShieldCheck,
		ScanLine,
		Server,
		Lock,
		BookOpen,
		Trash2,
		ShieldAlert
	} from '@lucide/svelte';

	import { cyberStore, eventsStore } from '$lib/stores';
	import {
		connectedDevices,
		cyberError,
		isHubOnline,
		lastScanCommand,
		primaryHub,
		scanInProgress
	} from '$lib/stores/cyber.svelte';
	import { eventsData } from '$lib/stores/events.svelte';
	import type { Device } from '$lib/types/device';
	import type { EventV1 } from '$lib/types';

	// ── Local state ─────────────────────────────────────────────────────────

	let deviceToKick = $state<Device | null>(null);
	let kickPending = $state(false);
	let scanToastMessage = $state<string | null>(null);

	// ── Derived state from stores ───────────────────────────────────────────

	const DAY_MS = 86_400_000;

	const networkEvents = $derived(
		($eventsData ?? []).filter((e: EventV1) => e.source === 'network')
	);

	const recentNetworkEvents = $derived(networkEvents.slice(0, 12));

	const criticalThreatCount = $derived(
		($eventsData ?? []).filter(
			(e: EventV1) =>
				e.source === 'network' &&
				e.severity === 'critical' &&
				Date.now() - new Date(e.timestamp).getTime() < DAY_MS
		).length
	);

	const firewallDropCount = $derived(
		($eventsData ?? [])
			.filter((e: EventV1) => e.type === 'firewall_drop_burst')
			.reduce((acc, e) => acc + (Number(e.drop_count) || 0), 0)
	);

	const scanProgress = $derived.by(() => {
		const cmd = $lastScanCommand;
		if (!cmd) return 0;
		switch (cmd.status) {
			case 'pending':
				return 15;
			case 'dispatched':
				return 35;
			case 'running':
				return 70;
			case 'succeeded':
				return 100;
			case 'failed':
				return 100;
			default:
				return 0;
		}
	});

	// ── Lifecycle ───────────────────────────────────────────────────────────

	onMount(() => {
		cyberStore.loadAll();
		eventsStore.loadRecent(100);
	});

	// ── Actions ─────────────────────────────────────────────────────────────

	async function startScan() {
		if (!$primaryHub) {
			scanToastMessage = "Aucun hub enregistré — impossible de lancer l'analyse";
			setTimeout(() => (scanToastMessage = null), 3_000);
			return;
		}
		scanToastMessage = `Scan demandé sur ${$primaryHub.name}`;
		const result = await cyberStore.triggerScan($primaryHub.id);
		if (result?.status === 'succeeded') {
			scanToastMessage = 'Scan terminé';
		} else if (result?.status === 'failed') {
			scanToastMessage = `Scan échoué : ${result.error ?? 'erreur inconnue'}`;
		} else {
			scanToastMessage = 'Scan dispatché (le hub est-il en ligne ?)';
		}
		setTimeout(() => (scanToastMessage = null), 4_000);
	}

	function openKickDialog(device: Device) {
		deviceToKick = device;
	}

	async function confirmKick() {
		if (!deviceToKick) return;
		kickPending = true;
		const cmd = await cyberStore.kickDevice(deviceToKick.mac_address);
		kickPending = false;
		scanToastMessage =
			cmd != null ? `Kick dispatché pour ${deviceToKick.mac_address}` : $cyberError;
		setTimeout(() => (scanToastMessage = null), 3_000);
		deviceToKick = null;
	}

	// ── Helpers ─────────────────────────────────────────────────────────────

	function deviceLabel(d: Device): string {
		return d.hostname?.trim() || d.ip_address || d.mac_address;
	}

	function severityColor(s: EventV1['severity']): string {
		switch (s) {
			case 'critical':
				return 'bg-red-500';
			case 'warning':
				return 'bg-yellow-500';
			default:
				return 'bg-green-500';
		}
	}

	function formatTime(iso: string): string {
		try {
			const d = new Date(iso);
			return d.toLocaleString('fr-FR', {
				day: '2-digit',
				month: 'short',
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch {
			return iso;
		}
	}
</script>

<svelte:head>
	<title>Cyber Dashboard - Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<Sidebar />

	<main class="flex-1 overflow-y-auto">
		<div class="p-8 max-w-7xl mx-auto">
			<div class="flex items-center justify-between mb-8">
				<h1 class="text-2xl font-semibold text-foreground">Cyber Dashboard</h1>
				{#if $primaryHub}
					<Badge
						variant="outline"
						class="text-xs {$isHubOnline
							? 'border-green-300 text-green-700 bg-green-50'
							: 'border-amber-300 text-amber-700 bg-amber-50'}"
					>
						{$primaryHub.name} · {$isHubOnline ? 'online' : 'offline'}
					</Badge>
				{:else}
					<Badge variant="outline" class="text-xs border-gray-300 text-gray-600">
						Aucun hub enregistré
					</Badge>
				{/if}
			</div>

			<!-- Stats cards -->
			<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<Card.Root>
					<Card.Content class="p-6">
						<div class="flex items-center justify-between mb-3">
							<Card.Description>Active Devices</Card.Description>
							<Monitor class="w-4 h-4 text-teal-500" />
						</div>
						<p class="text-4xl font-bold tracking-tight text-foreground">
							{$connectedDevices.length}
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Content class="p-6">
						<div class="flex items-center justify-between mb-3">
							<Card.Description>Threats Detected (24h)</Card.Description>
							<TriangleAlert class="w-4 h-4 text-destructive" />
						</div>
						<p class="text-4xl font-bold tracking-tight text-destructive">
							{criticalThreatCount}
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Content class="p-6">
						<div class="flex items-center justify-between mb-3">
							<Card.Description>WiFi Status</Card.Description>
							<Wifi class="w-4 h-4 {$isHubOnline ? 'text-green-500' : 'text-gray-400'}" />
						</div>
						<p class="text-xl font-bold {$isHubOnline ? 'text-green-600' : 'text-gray-500'}">
							{$isHubOnline ? 'Active' : 'Offline'}
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Content class="p-6">
						<div class="flex items-center justify-between mb-3">
							<Card.Description>Firewall drops (24h)</Card.Description>
							<ShieldCheck class="w-4 h-4 text-teal-500" />
						</div>
						<p class="text-xl font-bold text-teal-600">{firewallDropCount}</p>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Main grid -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- Left col -->
				<div class="lg:col-span-2 space-y-6">
					<!-- Network Scanning -->
					<Card.Root>
						<Card.Header>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div
										class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center"
									>
										<ScanLine class="w-5 h-5 text-pink-600" />
									</div>
									<div>
										<Card.Title class="text-base">Security Dashboard</Card.Title>
										<Card.Description>Network scanning</Card.Description>
									</div>
								</div>
								<Button
									onclick={startScan}
									disabled={$scanInProgress || !$primaryHub}
									class="bg-pink-600 hover:bg-pink-700 text-white"
								>
									{$scanInProgress ? 'Scanning...' : 'Analyze'}
								</Button>
							</div>
						</Card.Header>
						<Card.Content>
							<div class="mb-4">
								<div class="flex items-center justify-between mb-2">
									<span class="text-sm font-medium text-foreground">General scanning</span>
									<span class="text-sm font-semibold text-foreground">{scanProgress}%</span>
								</div>
								<div class="w-full bg-muted rounded-full h-2.5 overflow-hidden">
									<div
										class="bg-pink-500 h-2.5 rounded-full transition-all duration-300"
										style="width: {scanProgress}%"
									></div>
								</div>
							</div>

							{#if $scanInProgress}
								<div class="flex items-center justify-center py-10">
									<div class="relative w-44 h-44">
										<div class="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
										<div class="absolute inset-4 border-4 border-pink-300 rounded-full"></div>
										<div class="absolute inset-8 border-4 border-pink-400 rounded-full"></div>
										<div
											class="absolute inset-0 animate-spin"
											style="animation-duration: 2s;"
										>
											<div
												class="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-pink-600 to-transparent origin-left"
											></div>
										</div>
										<div
											class="absolute top-1/2 left-1/2 w-3 h-3 bg-pink-600 rounded-full -translate-x-1/2 -translate-y-1/2"
										></div>
									</div>
								</div>
							{/if}
						</Card.Content>
					</Card.Root>

					<!-- Device list -->
					<Card.Root>
						<Card.Header class="pb-3">
							<div class="flex items-center justify-between">
								<Card.Title class="text-base">Appareils connectés</Card.Title>
								<button
									onclick={() => cyberStore.refreshDevices()}
									class="text-xs text-muted-foreground hover:text-foreground underline"
								>
									Rafraîchir
								</button>
							</div>
						</Card.Header>
						<Card.Content class="p-0">
							{#if $connectedDevices.length === 0}
								<div class="text-center py-12 text-muted-foreground">
									<Monitor class="w-12 h-12 mx-auto mb-3 opacity-30" />
									<p class="text-sm">Aucun appareil connecté pour le moment.</p>
								</div>
							{:else}
								<div class="divide-y divide-border">
									{#each $connectedDevices as device (device.mac_address)}
										<div
											class="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
										>
											<div class="flex items-center gap-3">
												<div
													class="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center shrink-0"
												>
													<Monitor class="w-4 h-4 text-teal-600" />
												</div>
												<div>
													<p class="text-sm font-medium text-foreground">
														{deviceLabel(device)}
													</p>
													<p class="text-[11px] text-muted-foreground font-mono">
														{device.mac_address}
														{#if device.ip_address}· {device.ip_address}{/if}
														{#if device.rssi !== undefined && device.rssi !== null}
															· {device.rssi} dBm
														{/if}
													</p>
												</div>
											</div>
											<button
												onclick={() => openKickDialog(device)}
												class="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md transition-colors"
												title="Déconnecter (kick)"
											>
												<Trash2 class="w-4 h-4" />
											</button>
										</div>
									{/each}
								</div>
							{/if}
						</Card.Content>
					</Card.Root>
				</div>

				<!-- Right col — Logs -->
				<div class="lg:col-span-1">
					<Card.Root class="sticky top-8">
						<Card.Header class="pb-3">
							<div class="flex items-center gap-3">
								<div
									class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center"
								>
									<BookOpen class="w-4 h-4 text-blue-600" />
								</div>
								<Card.Title class="text-base">Security Logs</Card.Title>
							</div>
						</Card.Header>
						<Card.Content class="space-y-4">
							{#if recentNetworkEvents.length === 0}
								<div class="text-sm text-muted-foreground py-4">
									Aucun événement réseau récent.
								</div>
							{:else}
								{#each recentNetworkEvents as log (log.event_id)}
									<div class="pb-4 border-b border-border last:border-0 last:pb-0">
										<div class="flex items-start gap-2 mb-1">
											<div
												class="w-2 h-2 {severityColor(log.severity)} rounded-full mt-1.5 shrink-0"
											></div>
											<div class="flex-1">
												<p class="text-sm font-medium text-foreground">{log.type}</p>
												<p class="text-xs text-muted-foreground">
													{formatTime(log.timestamp)}
												</p>
											</div>
										</div>
										{#if log.signature}
											<p class="text-xs text-muted-foreground ml-4">{log.signature}</p>
										{:else if log.mac_address || log.ip_address}
											<p class="text-xs text-muted-foreground ml-4 font-mono">
												{log.mac_address ?? ''}
												{log.ip_address ? `· ${log.ip_address}` : ''}
											</p>
										{/if}
									</div>
								{/each}
							{/if}
						</Card.Content>
					</Card.Root>
				</div>
			</div>

			<!-- Quick Settings — visual only for now, real wiring in a follow-up phase -->
			<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
				{#each [
					{ icon: Wifi, label: 'WiFi Settings', desc: 'hostapd (bientôt)', bg: 'bg-blue-100', text: 'text-blue-600' },
					{ icon: Server, label: 'DHCP Server', desc: 'dnsmasq (bientôt)', bg: 'bg-purple-100', text: 'text-purple-600' },
					{ icon: Lock, label: 'RADIUS Server', desc: 'Authentification (bientôt)', bg: 'bg-orange-100', text: 'text-orange-600' },
					{ icon: ShieldAlert, label: 'Firewall', desc: 'iptables (bientôt)', bg: 'bg-red-100', text: 'text-red-600' }
				] as item}
					<Card.Root class="opacity-70">
						<Card.Content class="p-5">
							<div class="flex items-center gap-4">
								<div class="w-10 h-10 rounded-full {item.bg} flex items-center justify-center shrink-0">
									<item.icon class="w-5 h-5 {item.text}" />
								</div>
								<div>
									<p class="text-sm font-semibold text-foreground">{item.label}</p>
									<p class="text-xs text-muted-foreground">{item.desc}</p>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		</div>
	</main>
</div>

<!-- Kick confirmation -->
<Dialog.Root open={deviceToKick !== null} onOpenChange={(o) => !o && (deviceToKick = null)}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Déconnecter l'appareil</Dialog.Title>
			<Dialog.Description>
				Une commande <code>kick_device</code> sera envoyée au hub. L'appareil se reconnectera s'il en a les droits
				— pour un blocage durable, utilise plutôt block_device.
			</Dialog.Description>
		</Dialog.Header>
		{#if deviceToKick}
			<div class="text-sm space-y-1 py-2">
				<div><span class="font-medium">MAC :</span> <code>{deviceToKick.mac_address}</code></div>
				{#if deviceToKick.hostname}
					<div><span class="font-medium">Hostname :</span> {deviceToKick.hostname}</div>
				{/if}
				{#if deviceToKick.ip_address}
					<div><span class="font-medium">IP :</span> {deviceToKick.ip_address}</div>
				{/if}
			</div>
		{/if}
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (deviceToKick = null)} disabled={kickPending}>
				Annuler
			</Button>
			<Button
				onclick={confirmKick}
				disabled={kickPending}
				class="bg-destructive hover:bg-destructive/90 text-white"
			>
				{kickPending ? 'Envoi...' : 'Déconnecter'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

{#if scanToastMessage}
	<div
		class="fixed bottom-6 right-6 bg-foreground text-background text-sm px-4 py-3 rounded-md shadow-lg"
	>
		{scanToastMessage}
	</div>
{/if}

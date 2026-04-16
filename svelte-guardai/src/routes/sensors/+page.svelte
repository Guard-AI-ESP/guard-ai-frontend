<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { derived } from 'svelte/store';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { eventsData } from '$lib/stores/events.svelte';
	import { connectionStore, isConnected, isWsConnected } from '$lib/stores/connection.svelte';
	import { wsManager } from '$lib/api';
	import type { EventV1 } from '$lib/types';

	type SensorType = 'sound' | 'temperature' | 'smoke' | 'vibration' | 'light' | 'flame';

	interface SensorMeta {
		label: string;
		icon: string;
		unit: (p: Record<string, unknown>) => string;
		value: (p: Record<string, unknown>) => string;
	}

	const SENSOR_META: Record<SensorType, SensorMeta> = {
		sound: {
			label: 'Son',
			icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
			unit: () => 'dB',
			value: (p) => (p.db != null ? `${Number(p.db).toFixed(1)} dB` : '—'),
		},
		temperature: {
			label: 'Température',
			icon: 'M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z',
			unit: () => '°C',
			value: (p) =>
				p.temp != null
					? `${Number(p.temp).toFixed(1)}°C  ${p.humidity != null ? `· ${Number(p.humidity).toFixed(0)}%` : ''}`
					: '—',
		},
		smoke: {
			label: 'Fumée / Gaz',
			icon: 'M3 12h1m8-9v1m8 8h1M5.6 5.6l.7.7m12.1-.7l-.7.7M12 19a7 7 0 100-14 7 7 0 000 14z',
			unit: () => 'ppm',
			value: (p) => (p.ppm != null ? `${Number(p.ppm).toFixed(0)} ppm` : '—'),
		},
		vibration: {
			label: 'Vibration',
			icon: 'M13 10V3L4 14h7v7l9-11h-7z',
			unit: () => '',
			value: (p) =>
				p.detected != null
					? p.detected
						? `Détectée${p.intensity != null ? ` (${Number(p.intensity).toFixed(1)})` : ''}`
						: 'Aucune'
					: '—',
		},
		light: {
			label: 'Luminosité',
			icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
			unit: () => 'lux',
			value: (p) =>
				p.lux != null
					? `${Number(p.lux).toFixed(0)} lux`
					: p.dark != null
						? p.dark
							? 'Sombre'
							: 'Lumineux'
						: '—',
		},
		flame: {
			label: 'Flamme',
			icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z',
			unit: () => '',
			value: (p) => (p.detected != null ? (p.detected ? 'FLAMME DÉTECTÉE' : 'Aucune') : '—'),
		},
	};

	const SENSOR_TYPES = Object.keys(SENSOR_META) as SensorType[];

	// Dérive les dernières lectures + historique par type de capteur depuis le store global
	const sensorLatest = derived(eventsData, ($events) => {
		const latest: Partial<Record<SensorType, EventV1>> = {};
		const history: Partial<Record<SensorType, EventV1[]>> = {};

		const sensorEvents = $events
			.filter((e) => e.source === 'sensor')
			.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

		for (const e of sensorEvents) {
			const type = e.type as SensorType;
			if (!SENSOR_TYPES.includes(type)) continue;
			if (!latest[type]) latest[type] = e;
			if (!history[type]) history[type] = [];
			if (history[type]!.length < 8) history[type]!.push(e);
		}

		return { latest, history };
	});

	function severityBg(severity: string) {
		if (severity === 'critical') return 'bg-red-50 border-red-200';
		if (severity === 'warning') return 'bg-yellow-50 border-yellow-200';
		return 'bg-white border-border';
	}

	function severityIconBg(severity: string) {
		if (severity === 'critical') return 'bg-red-100 text-red-600';
		if (severity === 'warning') return 'bg-yellow-100 text-yellow-600';
		return 'bg-green-100 text-green-600';
	}

	function severityBadgeClass(severity: string) {
		if (severity === 'critical') return 'border-red-200 text-red-700 bg-red-50';
		if (severity === 'warning') return 'border-yellow-200 text-yellow-700 bg-yellow-50';
		return 'border-green-200 text-green-700 bg-green-50';
	}

	function formatTime(ts: string) {
		return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
	}

	onMount(async () => {
		const healthy = await connectionStore.checkApiHealth();
		if (healthy) wsManager.connect();
	});

	onDestroy(() => wsManager.disconnect());
</script>

<svelte:head>
	<title>Capteurs IoT - Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<Sidebar />

	<main class="flex-1 overflow-y-auto">
		<div class="p-8 max-w-7xl mx-auto">

			<!-- Header -->
			<div class="flex items-center justify-between mb-8">
				<div>
					<h1 class="text-2xl font-semibold text-foreground">Capteurs IoT</h1>
					<p class="text-sm text-muted-foreground mt-0.5">Lecture en temps réel via MQTT</p>
				</div>
				<div class="flex items-center gap-2">
					{#if $isConnected}
						<Badge variant="outline" class="gap-1.5 border-green-200 text-green-700 bg-green-50">
							<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
							Connected
						</Badge>
					{:else}
						<Badge variant="outline" class="gap-1.5 border-red-200 text-red-700 bg-red-50">
							<span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
							Disconnected
						</Badge>
					{/if}
					{#if $isWsConnected}
						<Badge variant="outline" class="gap-1.5 border-primary/20 text-primary bg-primary/5">
							<span class="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
							Live
						</Badge>
					{/if}
				</div>
			</div>

			<!-- Sensor cards grid -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
				{#each SENSOR_TYPES as type}
					{@const meta = SENSOR_META[type]}
					{@const event = $sensorLatest.latest[type]}
					{@const hist = $sensorLatest.history[type] ?? []}
					{@const severity = event?.severity ?? 'info'}

					<Card.Root class="border {severityBg(severity)} transition-colors duration-300">
						<Card.Header class="pb-2">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2.5">
									<div class="w-9 h-9 rounded-full {severityIconBg(severity)} flex items-center justify-center shrink-0">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" d={meta.icon} />
										</svg>
									</div>
									<Card.Title class="text-sm font-medium">{meta.label}</Card.Title>
								</div>
								{#if event}
									<Badge variant="outline" class="text-xs {severityBadgeClass(severity)}">
										{severity}
									</Badge>
								{:else}
									<Badge variant="outline" class="text-xs border-muted text-muted-foreground">
										En attente
									</Badge>
								{/if}
							</div>
						</Card.Header>
						<Card.Content>
							{#if event}
								<p class="text-2xl font-bold text-foreground mb-1 truncate">
									{meta.value(event.payload)}
								</p>
								<p class="text-xs text-muted-foreground mb-3">
									Dernière lecture · {formatTime(event.timestamp)}
								</p>

								<!-- Mini historique -->
								{#if hist.length > 1}
									<div class="flex items-end gap-1 h-8">
										{#each hist.slice().reverse() as h}
											{@const hSev = h.severity}
											<div
												class="flex-1 rounded-sm min-h-1 {hSev === 'critical' ? 'bg-red-400' : hSev === 'warning' ? 'bg-yellow-400' : 'bg-green-400'}"
												style="height: {hSev === 'critical' ? '100%' : hSev === 'warning' ? '60%' : '30%'}"
												title="{formatTime(h.timestamp)} — {hSev}"
											></div>
										{/each}
									</div>
								{/if}
							{:else}
								<p class="text-sm text-muted-foreground py-4 text-center">
									Aucune donnée reçue
								</p>
							{/if}
						</Card.Content>
					</Card.Root>
				{/each}
			</div>

			<!-- Flux d'événements capteurs -->
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-base">Flux capteurs temps réel</Card.Title>
					<Card.Description>Les 20 derniers événements IoT</Card.Description>
				</Card.Header>
				<Card.Content class="p-0">
					<div class="divide-y divide-border">
						{#each ($eventsData).filter(e => e.source === 'sensor').slice(0, 20) as event (event.event_id)}
							{@const meta = SENSOR_META[event.type as SensorType]}
							<div class="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors">
								<div class="w-7 h-7 rounded-full {severityIconBg(event.severity)} flex items-center justify-center shrink-0">
									{#if meta}
										<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" d={meta.icon} />
										</svg>
									{:else}
										<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
										</svg>
									{/if}
								</div>
								<div class="flex-1 min-w-0">
									<span class="text-sm font-medium text-foreground capitalize">{event.type}</span>
									{#if meta}
										<span class="text-sm text-muted-foreground ml-2">{meta.value(event.payload)}</span>
									{/if}
								</div>
								<Badge variant="outline" class="text-xs shrink-0 {severityBadgeClass(event.severity)}">
									{event.severity}
								</Badge>
								<span class="text-xs text-muted-foreground shrink-0 tabular-nums">
									{formatTime(event.timestamp)}
								</span>
							</div>
						{:else}
							<div class="px-4 py-10 text-center">
								<p class="text-sm text-muted-foreground">Aucun événement capteur reçu</p>
								<p class="text-xs text-muted-foreground/70 mt-1">Lance le simulateur IoT pour voir des données</p>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>

		</div>
	</main>
</div>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { derived } from 'svelte/store';
	import Header from '$lib/components/Header.svelte';
	import { eventsData } from '$lib/stores/events.svelte';
	import { connectionStore, isConnected, isWsConnected } from '$lib/stores/connection.svelte';
	import { wsManager } from '$lib/api';
	import type { EventV1 } from '$lib/types';

	type SensorType = 'sound' | 'temperature' | 'smoke' | 'vibration' | 'light' | 'flame';

	const SENSOR_META: Record<SensorType, { label: string; icon: string; value: (p: Record<string, unknown>) => string }> = {
		sound:       { label: 'Son',           icon: 'volume_up',            value: (p) => p.db != null ? `${Number(p.db).toFixed(1)} dB` : (p.detected ? 'Détecté' : 'Silence') },
		temperature: { label: 'Température / Humidité %',   icon: 'thermostat',           value: (p) => p.temp != null ? `${Number(p.temp).toFixed(1)}°C · ${Number(p.humidity ?? 0).toFixed(0)}%` : '—' },
		smoke:       { label: 'Fumée / Gaz',   icon: 'cloud',                value: (p) => p.ppm != null ? `${Number(p.ppm).toFixed(0)} ppm` : '—' },
		vibration:   { label: 'Vibration',     icon: 'vibration',            value: (p) => p.detected ? 'Choc détecté' : 'Aucun' },
		light:       { label: 'Luminosité',    icon: 'light_mode',           value: (p) => p.lux != null ? `${Number(p.lux).toFixed(0)} lux` : (p.dark ? 'Sombre' : 'Lumineux') },
		flame:       { label: 'Flamme',        icon: 'local_fire_department',value: (p) => p.detected ? 'FLAMME DÉTECTÉE' : 'Aucune' },
	};

	const SENSOR_TYPES = Object.keys(SENSOR_META) as SensorType[];

	const sensorLatest = derived(eventsData, ($events) => {
		const latest: Partial<Record<SensorType, EventV1>> = {};
		const history: Partial<Record<SensorType, EventV1[]>> = {};
		const sorted = $events
			.filter((e) => e.source === 'sensor')
			.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
		for (const e of sorted) {
			const t = e.type as SensorType;
			if (!SENSOR_TYPES.includes(t)) continue;
			if (!latest[t]) latest[t] = e;
			if (!history[t]) history[t] = [];
			if (history[t]!.length < 8) history[t]!.push(e);
		}
		return { latest, history };
	});

	function severityIconBg(s: string) {
		if (s === 'critical') return 'bg-red-100 text-red-500';
		if (s === 'warning')  return 'bg-yellow-100 text-yellow-500';
		return 'bg-emerald-100 text-emerald-500';
	}

	function severityBorder(s: string) {
		if (s === 'critical') return 'border-red-200';
		if (s === 'warning')  return 'border-yellow-200';
		return 'border-slate-100';
	}

	function severityBadge(s: string) {
		if (s === 'critical') return 'bg-red-100 text-red-600';
		if (s === 'warning')  return 'bg-yellow-100 text-yellow-600';
		return 'bg-emerald-100 text-emerald-600';
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

<Header />

<div class="p-6 space-y-6">

	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-xl font-bold text-slate-800">Capteurs IoT</h1>
			<p class="text-sm text-slate-400 mt-0.5">Lecture en temps réel via MQTT</p>
		</div>
		<div class="flex items-center gap-2">
			{#if $isConnected}
				<span class="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
					<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
					Connecté
				</span>
			{:else}
				<span class="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
					<span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
					Déconnecté
				</span>
			{/if}
			{#if $isWsConnected}
				<span class="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/20">
					<span class="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
					Live
				</span>
			{/if}
		</div>
	</div>

	<!-- Sensor cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each SENSOR_TYPES as type}
			{@const meta = SENSOR_META[type]}
			{@const event = $sensorLatest.latest[type]}
			{@const hist = $sensorLatest.history[type] ?? []}
			{@const severity = event?.severity ?? 'info'}

			<div class="bg-white rounded-[20px] p-5 shadow-soft border {severityBorder(severity)} transition-all duration-300 flex flex-col gap-4">
				<div class="flex items-start justify-between">
					<div class="w-11 h-11 rounded-2xl {severityIconBg(severity)} flex items-center justify-center">
						<span class="material-icons text-[22px]">{meta.icon}</span>
					</div>
					<span class="text-xs font-semibold px-2 py-0.5 rounded-full {severityBadge(severity)}">
						{event ? severity : 'en attente'}
					</span>
				</div>

				<div>
					<p class="text-slate-400 text-sm mb-1">{meta.label}</p>
					{#if event}
						<p class="text-xl font-bold text-slate-800">{meta.value(event.payload)}</p>
						<p class="text-xs text-slate-400 mt-1">{formatTime(event.timestamp)}</p>
					{:else}
						<p class="text-slate-400 text-sm">Aucune donnée</p>
					{/if}
				</div>

				{#if hist.length > 1}
					<div class="flex items-end gap-1 h-7">
						{#each hist.slice().reverse() as h}
							<div
								class="flex-1 rounded-sm {h.severity === 'critical' ? 'bg-red-400' : h.severity === 'warning' ? 'bg-yellow-400' : 'bg-emerald-400'}"
								style="height: {h.severity === 'critical' ? '100%' : h.severity === 'warning' ? '60%' : '25%'}"
								title="{formatTime(h.timestamp)} — {h.severity}"
							></div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Flux temps réel -->
	<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 overflow-hidden">
		<div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
			<h2 class="font-semibold text-slate-800">Flux capteurs temps réel</h2>
			<span class="text-xs text-slate-400">20 derniers événements</span>
		</div>
		<div class="divide-y divide-slate-50">
			{#each ($eventsData).filter(e => e.source === 'sensor').slice(0, 20) as event (event.event_id)}
				{@const meta = SENSOR_META[event.type as SensorType]}
				<div class="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
					<div class="w-8 h-8 rounded-xl {severityIconBg(event.severity)} flex items-center justify-center shrink-0">
						<span class="material-icons text-[16px]">{meta?.icon ?? 'sensors'}</span>
					</div>
					<div class="flex-1 min-w-0">
						<span class="text-sm font-medium text-slate-700 capitalize">{event.type}</span>
						{#if meta}
							<span class="text-sm text-slate-400 ml-2">{meta.value(event.payload)}</span>
						{/if}
					</div>
					<span class="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 {severityBadge(event.severity)}">{event.severity}</span>
					<span class="text-xs text-slate-400 tabular-nums shrink-0">{formatTime(event.timestamp)}</span>
				</div>
			{:else}
				<div class="px-5 py-10 text-center">
					<span class="material-icons text-3xl text-slate-300">sensors_off</span>
					<p class="text-sm text-slate-400 mt-2">Aucun événement capteur reçu</p>
					<p class="text-xs text-slate-300 mt-1">Lance le simulateur IoT pour voir des données</p>
				</div>
			{/each}
		</div>
	</div>
</div>

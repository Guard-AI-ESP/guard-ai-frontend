<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import LiveFeed from '$lib/components/LiveFeed.svelte';
	import ActivityPanel from '$lib/components/ActivityPanel.svelte';
	import SystemStatus from '$lib/components/SystemStatus.svelte';
	import RecentMedia from '$lib/components/RecentMedia.svelte';
	import AudioMessages from '$lib/components/AudioMessages.svelte';
	import {
		statsStore, statsLoading,
		totalEvents, last24h, activeAlerts
	} from '$lib/stores/stats.svelte';
	import {
		eventsStore, eventsLoading
	} from '$lib/stores/events.svelte';
	import { connectionStore, isConnected, isWsConnected } from '$lib/stores/connection.svelte';
	import { wsManager } from '$lib/api';

	onMount(async () => {
		const healthy = await connectionStore.checkApiHealth();
		if (healthy) {
			await Promise.all([statsStore.load(), eventsStore.loadRecent(10)]);
			wsManager.connect();
		}
	});

	onDestroy(() => wsManager.disconnect());
</script>

<svelte:head>
	<title>Dashboard - Guard AI</title>
</svelte:head>

<Header />

<!-- Connection status -->
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

<!-- KPIs -->
<div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
	<StatCard
		iconName="group"
		iconBg="bg-teal-50"
		iconColor="text-teal-500"
		badge="+12%"
		badgePositive={true}
		label="Visites quotidiennes"
		value={$statsLoading ? '...' : String($last24h)}
	/>
	<StatCard
		iconName="warning_amber"
		iconBg="bg-amber-50"
		iconColor="text-amber-500"
		badge="-5%"
		badgePositive={false}
		label="Événements système"
		value={$statsLoading ? '...' : String($totalEvents)}
	/>
	<StatCard
		iconName="mail"
		iconBg="bg-blue-50"
		iconColor="text-blue-500"
		badge="+2%"
		badgePositive={true}
		label="Alertes actives"
		value={$statsLoading ? '...' : String($activeAlerts)}
	/>
	<StatCard
		iconName="trending_up"
		iconBg="bg-purple-50"
		iconColor="text-purple-500"
		label="Pic d'activité"
		value="14:00"
		sparkline={true}
	/>
</div>

<!-- Main grid -->
<div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
	<div class="flex flex-col gap-6">
		<LiveFeed />
		<RecentMedia />
	</div>
	<div class="flex flex-col gap-6">
		<SystemStatus />
		<AudioMessages />
		<ActivityPanel />
	</div>
</div>

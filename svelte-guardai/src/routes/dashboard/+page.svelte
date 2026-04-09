<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ChevronRight, X, Play, Zap } from '@lucide/svelte';
	import {
		statsStore, statsLoading, statsError,
		totalEvents, last24h, activeAlerts,
		bySource, bySeverity
	} from '$lib/stores/stats.svelte';
	import {
		eventsStore, eventsLoading, eventsError,
		recentEvents, isEmpty
	} from '$lib/stores/events.svelte';
	import {
		connectionStore, apiStatus,
		isConnected, isWsConnected
	} from '$lib/stores/connection.svelte';
	import { wsManager, simulateEvents } from '$lib/api';
	import type { EventV1 } from '$lib/types';

	let showVideoModal = $state(false);
	let selectedCamera = $state('');
	let simulating = $state(false);
	let simToast = $state<{ type: 'success' | 'error'; message: string } | null>(null);

	async function handleSimulate() {
		simulating = true;
		simToast = null;
		try {
			const result = await simulateEvents(10);
			simToast = { type: 'success', message: `${result.generated} événements générés` };
			// Refresh stats après simulation (WS met à jour les events en temps réel)
			await statsStore.load();
		} catch {
			simToast = { type: 'error', message: 'Erreur lors de la simulation' };
		} finally {
			simulating = false;
			setTimeout(() => (simToast = null), 4000);
		}
	}

	function openVideoModal(camera: string) {
		selectedCamera = camera;
		showVideoModal = true;
	}

	function formatDate(timestamp: string): string {
		return new Date(timestamp).toLocaleDateString('fr-FR', {
			day: 'numeric', month: 'long', year: 'numeric'
		});
	}

	function getEventStyle(event: EventV1): { bg: string; iconColor: string; icon: string } {
		const styles: Record<string, { bg: string; iconColor: string; icon: string }> = {
			camera: { bg: 'bg-blue-100', iconColor: 'text-blue-600', icon: 'M15 10a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
			network: { bg: 'bg-purple-100', iconColor: 'text-purple-600', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
			sensor: { bg: 'bg-green-100', iconColor: 'text-green-600', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
			system: { bg: 'bg-orange-100', iconColor: 'text-orange-600', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
		};
		if (event.severity === 'critical') return { bg: 'bg-red-100', iconColor: 'text-red-600', icon: styles[event.source]?.icon || styles.system.icon };
		return styles[event.source] || styles.system;
	}

	function severityColor(severity: string) {
		return severity === 'critical' ? 'text-red-600' : severity === 'warning' ? 'text-yellow-600' : 'text-blue-600';
	}

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

<div class="flex h-screen bg-gray-50">
	<Sidebar />

	<main class="flex-1 overflow-y-auto">
		<div class="p-8 max-w-7xl mx-auto">

			<!-- Toast simulation -->
			{#if simToast}
				<div class="fixed top-4 right-4 z-50">
					<div class="flex items-center gap-3 px-4 py-3 bg-white border rounded-lg shadow-md text-sm
						{simToast.type === 'success' ? 'border-green-200' : 'border-red-200'}">
						<span class="{simToast.type === 'success' ? 'text-green-800' : 'text-red-800'} font-medium">
							{simToast.message}
						</span>
						<button onclick={() => (simToast = null)} class="text-muted-foreground hover:text-foreground">
							<X class="w-4 h-4" />
						</button>
					</div>
				</div>
			{/if}

			<!-- Header -->
			<div class="flex items-center justify-between mb-8">
				<h1 class="text-2xl font-semibold text-foreground">Dashboard</h1>
				<div class="flex items-center gap-2">
					{#if $isConnected}
						<Badge variant="outline" class="gap-1.5 border-green-200 text-green-700 bg-green-50">
							<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
							Connected
						</Badge>
					{:else if $apiStatus === 'connecting'}
						<Badge variant="outline" class="gap-1.5 border-yellow-200 text-yellow-700 bg-yellow-50">
							<span class="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
							Connecting...
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
					<Button variant="outline" size="sm" onclick={handleSimulate} disabled={simulating}>
						<Zap class="w-3.5 h-3.5 mr-1.5" />
						{simulating ? 'Génération...' : 'Simuler'}
					</Button>
				</div>
			</div>

			<!-- Error banner -->
			{#if $statsError || $eventsError}
				<div class="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
					<p class="text-destructive text-sm">{$statsError || $eventsError}</p>
				</div>
			{/if}

			<!-- Stats cards -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				{#each [
					{ label: 'Events (24h)', value: $last24h },
					{ label: 'Total Events', value: $totalEvents },
					{ label: 'Active Alerts', value: $activeAlerts }
				] as stat}
					<Card.Root>
						<Card.Header class="pb-2">
							<Card.Description>{stat.label}</Card.Description>
						</Card.Header>
						<Card.Content>
							{#if $statsLoading}
								<div class="h-10 bg-muted rounded animate-pulse mb-4"></div>
							{:else}
								<p class="text-4xl font-bold tracking-tight text-foreground mb-4">{stat.value}</p>
							{/if}
							<Button variant="ghost" size="sm" class="text-primary px-0 h-auto text-sm gap-1">
								See more <ChevronRight class="w-3.5 h-3.5" />
							</Button>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>

			<!-- Main content grid -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

				<!-- Left column (2/3) -->
				<div class="lg:col-span-2 space-y-6">

					<!-- Camera feed -->
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-base">Live Camera Feed</Card.Title>
						</Card.Header>
						<Card.Content>
							<button
								onclick={() => openVideoModal('Camera 1 - Entrance')}
								class="w-full aspect-video bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg relative overflow-hidden group hover:opacity-90 transition-opacity cursor-pointer"
							>
								<div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
									<div class="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
										<Play class="w-6 h-6 text-foreground ml-0.5" fill="currentColor" />
									</div>
								</div>
								<div class="absolute bottom-3 left-3 bg-black/70 text-white px-2.5 py-1 rounded-full text-xs font-medium">
									Live
								</div>
							</button>
						</Card.Content>
					</Card.Root>

					<!-- Stats breakdown -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Card.Root>
							<Card.Header class="pb-2">
								<Card.Description>Events by Source</Card.Description>
							</Card.Header>
							<Card.Content>
								{#if $statsLoading}
									<div class="space-y-2">
										{#each [1,2,3] as _}
											<div class="h-4 bg-muted rounded animate-pulse"></div>
										{/each}
									</div>
								{:else}
									<div class="space-y-2.5">
										{#each Object.entries($bySource) as [source, count]}
											<div class="flex items-center justify-between">
												<span class="text-sm text-muted-foreground capitalize">{source}</span>
												<span class="text-sm font-medium text-foreground">{count}</span>
											</div>
										{/each}
										{#if Object.keys($bySource).length === 0}
											<p class="text-sm text-muted-foreground">No data yet</p>
										{/if}
									</div>
								{/if}
							</Card.Content>
						</Card.Root>

						<Card.Root>
							<Card.Header class="pb-2">
								<Card.Description>By Severity</Card.Description>
							</Card.Header>
							<Card.Content>
								{#if $statsLoading}
									<div class="space-y-2">
										{#each [1,2,3] as _}
											<div class="h-4 bg-muted rounded animate-pulse"></div>
										{/each}
									</div>
								{:else}
									<div class="space-y-2.5">
										{#each Object.entries($bySeverity) as [severity, count]}
											<div class="flex items-center justify-between">
												<span class="text-sm capitalize {severityColor(severity)}">{severity}</span>
												<span class="text-sm font-medium text-foreground">{count}</span>
											</div>
										{/each}
										{#if Object.keys($bySeverity).length === 0}
											<p class="text-sm text-muted-foreground">No data yet</p>
										{/if}
									</div>
								{/if}
							</Card.Content>
						</Card.Root>
					</div>
				</div>

				<!-- Right column (1/3) - Activity -->
				<div class="lg:col-span-1">
					<Card.Root class="sticky top-8">
						<Card.Content class="p-0">
							<Tabs.Root value="activity">
								<Tabs.List class="w-full rounded-none rounded-t-lg border-b bg-transparent px-4 h-auto justify-start gap-0">
									<Tabs.Trigger
										value="activity"
										class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm"
									>
										Activity
									</Tabs.Trigger>
									<Tabs.Trigger
										value="logs"
										class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm"
									>
										Logs
									</Tabs.Trigger>
								</Tabs.List>

								<Tabs.Content value="activity" class="p-4">
									<div class="space-y-5">
										{#if $eventsLoading}
											{#each [1,2,3,4] as _}
												<div class="flex gap-3 animate-pulse">
													<div class="w-9 h-9 rounded-full bg-muted shrink-0"></div>
													<div class="flex-1 space-y-2">
														<div class="h-3.5 bg-muted rounded w-3/4"></div>
														<div class="h-3 bg-muted rounded w-1/4"></div>
													</div>
												</div>
											{/each}
										{:else if $isEmpty}
											<div class="text-center py-8">
												<p class="text-sm text-muted-foreground">No events yet</p>
												<p class="text-xs text-muted-foreground/70 mt-1">Les événements apparaîtront ici en temps réel</p>
											</div>
										{:else}
											{#each $recentEvents as event (event.event_id)}
												{@const style = getEventStyle(event)}
												<div class="flex gap-3">
													<div class="w-9 h-9 rounded-full {style.bg} flex items-center justify-center shrink-0">
														<svg class="w-4 h-4 {style.iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={style.icon} />
														</svg>
													</div>
													<div class="flex-1 min-w-0">
														<p class="text-sm font-medium text-foreground truncate">{event.type}</p>
														<p class="text-xs text-muted-foreground">{formatDate(event.timestamp)}</p>
														<p class="text-xs text-muted-foreground">
															{event.source} · <span class="{severityColor(event.severity)} font-medium">{event.severity}</span>
														</p>
													</div>
												</div>
											{/each}
										{/if}
									</div>
								</Tabs.Content>

								<Tabs.Content value="logs" class="p-4">
									<div class="space-y-1.5 font-mono text-xs">
										{#each $recentEvents.slice(0, 5) as event (event.event_id)}
											<div class="p-2 bg-muted/50 rounded">
												<span class="text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString()}</span>
												<span class="ml-1 {severityColor(event.severity)} font-medium">[{event.severity.toUpperCase()}]</span>
												<span class="ml-1 text-foreground">{event.type}</span>
											</div>
										{/each}
										{#if $isEmpty}
											<p class="text-muted-foreground text-center py-4">No logs yet</p>
										{/if}
									</div>
								</Tabs.Content>
							</Tabs.Root>
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</div>
	</main>
</div>

<!-- Video Modal -->
<Dialog.Root bind:open={showVideoModal}>
	<Dialog.Content class="max-w-5xl p-0 bg-black border-0 overflow-hidden">
		<div class="relative">
			<button
				onclick={() => (showVideoModal = false)}
				class="absolute top-3 right-3 z-10 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
			>
				<X class="w-4 h-4" />
			</button>
			<div class="aspect-video bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
				<div class="text-white text-center">
					<p class="text-xl font-semibold mb-1">{selectedCamera}</p>
					<p class="text-sm opacity-75">Live Feed</p>
				</div>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

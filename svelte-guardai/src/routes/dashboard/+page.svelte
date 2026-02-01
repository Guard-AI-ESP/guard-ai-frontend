<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import {
		statsStore,
		statsLoading,
		statsError,
		totalEvents,
		last24h,
		activeAlerts,
		bySource,
		bySeverity
	} from '$lib/stores/stats.svelte';
	import {
		eventsStore,
		eventsLoading,
		eventsError,
		recentEvents,
		isEmpty
	} from '$lib/stores/events.svelte';
	import {
		connectionStore,
		apiStatus,
		isConnected,
		isWsConnected
	} from '$lib/stores/connection.svelte';
	import { wsManager } from '$lib/api';
	import type { EventV1 } from '$lib/types';

	let showVideoModal = false;
	let selectedCamera = '';
	let activeTab = 'Activity';

	function openVideoModal(camera: string) {
		selectedCamera = camera;
		showVideoModal = true;
	}

	function closeVideoModal() {
		showVideoModal = false;
		selectedCamera = '';
	}

	// Format timestamp for display
	function formatDate(timestamp: string): string {
		const date = new Date(timestamp);
		return date.toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	// Get icon and color for event type
	function getEventStyle(event: EventV1): { bg: string; iconColor: string; icon: string } {
		const styles: Record<string, { bg: string; iconColor: string; icon: string }> = {
			camera: {
				bg: 'bg-blue-100',
				iconColor: 'text-blue-600',
				icon: 'M15 10a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
			},
			network: {
				bg: 'bg-purple-100',
				iconColor: 'text-purple-600',
				icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
			},
			sensor: {
				bg: 'bg-green-100',
				iconColor: 'text-green-600',
				icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
			},
			system: {
				bg: 'bg-orange-100',
				iconColor: 'text-orange-600',
				icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
			}
		};

		// Color severity overrides
		if (event.severity === 'critical') {
			return {
				bg: 'bg-red-100',
				iconColor: 'text-red-600',
				icon: styles[event.source]?.icon || styles.system.icon
			};
		}

		return styles[event.source] || styles.system;
	}

	onMount(async () => {
		// Check API health and load initial data
		const healthy = await connectionStore.checkApiHealth();
		console.log('Health check result:', healthy);

		if (healthy) {
			// Load stats and recent events
			await Promise.all([statsStore.load(), eventsStore.loadRecent(10)]);

			// Connect WebSocket for real-time updates
			wsManager.connect();
		}
	});

	onDestroy(() => {
		// Cleanup WebSocket on unmount
		wsManager.disconnect();
	});
</script>

<svelte:head>
	<title>Dashboard - Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main content -->
	<main class="flex-1 overflow-y-auto">
		<div class="p-8">
			<div class="max-w-7xl mx-auto">
				<!-- Header with connection status -->
				<div class="flex items-center justify-between mb-8">
					<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
					<div class="flex items-center gap-2">
						{#if $isConnected}
							<span
								class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700"
							>
								<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
								Connected
							</span>
						{:else if $apiStatus === 'connecting'}
							<span
								class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700"
							>
								<span class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
								Connecting...
							</span>
						{:else}
							<span
								class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700"
							>
								<span class="w-2 h-2 bg-red-500 rounded-full"></span>
								Disconnected
							</span>
						{/if}
						{#if $isWsConnected}
							<span
								class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700"
							>
								<span class="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
								Live
							</span>
						{/if}
					</div>
				</div>

				<!-- Error banner -->
				{#if $statsError || $eventsError}
					<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p class="text-red-700">{$statsError || $eventsError}</p>
					</div>
				{/if}

				<!-- Stats cards en haut -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<!-- Events 24h Card -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-4">Events (24h)</h3>
						{#if $statsLoading}
							<div class="h-12 bg-gray-200 rounded animate-pulse mb-6"></div>
						{:else}
							<p class="text-5xl font-bold text-gray-900 mb-6">{$last24h}</p>
						{/if}
						<button
							class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-2"
						>
							See more
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</div>

					<!-- Total Events Card -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-4">Total Events</h3>
						{#if $statsLoading}
							<div class="h-12 bg-gray-200 rounded animate-pulse mb-6"></div>
						{:else}
							<p class="text-5xl font-bold text-gray-900 mb-6">{$totalEvents}</p>
						{/if}
						<button
							class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-2"
						>
							See more
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</div>

					<!-- Alerts Card -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-4">Active Alerts</h3>
						{#if $statsLoading}
							<div class="h-12 bg-gray-200 rounded animate-pulse mb-6"></div>
						{:else}
							<p class="text-5xl font-bold text-gray-900 mb-6">{$activeAlerts}</p>
						{/if}
						<button
							class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-2"
						>
							See more
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</div>
				</div>

				<!-- Contenu principal -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<!-- Colonne gauche (2/3) -->
					<div class="lg:col-span-2 space-y-6">
						<!-- Caméra compacte -->
						<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
							<h3 class="text-lg font-semibold text-gray-900 mb-4">Live Camera Feed</h3>
							<button
								on:click={() => openVideoModal('Camera 1 - Entrance')}
								class="w-full aspect-video bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer"
							>
								<!-- Overlay avec play button -->
								<div
									class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center"
								>
									<div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
										<svg class="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
											<path d="M8 5v14l11-7z" />
										</svg>
									</div>
								</div>
								<!-- Time indicator -->
								<div
									class="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm"
								>
									Live
								</div>
							</button>
						</div>

						<!-- Stats en bas -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<!-- Events by Source -->
							<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
								<h3 class="text-sm text-gray-500 mb-4">Events by Source</h3>
								{#if $statsLoading}
									<div class="space-y-2">
										<div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
										<div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
										<div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
									</div>
								{:else}
									<div class="space-y-3">
										{#each Object.entries($bySource) as [source, count]}
											<div class="flex items-center justify-between">
												<span class="text-sm text-gray-600 capitalize">{source}</span>
												<span class="text-sm font-medium text-gray-900">{count}</span>
											</div>
										{/each}
										{#if Object.keys($bySource).length === 0}
											<p class="text-sm text-gray-400">No data yet</p>
										{/if}
									</div>
								{/if}
							</div>

							<!-- Events by Severity -->
							<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
								<h3 class="text-sm text-gray-500 mb-4">By Severity</h3>
								{#if $statsLoading}
									<div class="space-y-2">
										<div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
										<div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
										<div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
									</div>
								{:else}
									<div class="space-y-3">
										{#each Object.entries($bySeverity) as [severity, count]}
											<div class="flex items-center justify-between">
												<span
													class="text-sm capitalize {severity === 'critical'
														? 'text-red-600'
														: severity === 'warning'
															? 'text-yellow-600'
															: 'text-blue-600'}">{severity}</span
												>
												<span class="text-sm font-medium text-gray-900">{count}</span>
											</div>
										{/each}
										{#if Object.keys($bySeverity).length === 0}
											<p class="text-sm text-gray-400">No data yet</p>
										{/if}
									</div>
								{/if}
							</div>
						</div>
					</div>

					<!-- Colonne droite (1/3) - Activity Timeline -->
					<div class="lg:col-span-1">
						<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
							<!-- Tabs -->
							<div class="flex gap-2 mb-6 border-b border-gray-200">
								<button
									on:click={() => (activeTab = 'Activity')}
									class="px-4 py-2 text-sm font-medium transition-colors border-b-2 {activeTab ===
									'Activity'
										? 'border-teal-500 text-teal-600'
										: 'border-transparent text-gray-500 hover:text-gray-700'}"
								>
									Activity
								</button>
								<button
									on:click={() => (activeTab = 'logs')}
									class="px-4 py-2 text-sm font-medium transition-colors border-b-2 {activeTab ===
									'logs'
										? 'border-teal-500 text-teal-600'
										: 'border-transparent text-gray-500 hover:text-gray-700'}"
								>
									Logs
								</button>
							</div>

							<!-- Activity List -->
							{#if activeTab === 'Activity'}
								<div class="space-y-6">
									{#if $eventsLoading}
										<!-- Loading skeleton -->
										{#each [1, 2, 3, 4] as _}
											<div class="flex gap-3 animate-pulse">
												<div class="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
												<div class="flex-1 space-y-2">
													<div class="h-4 bg-gray-200 rounded w-3/4"></div>
													<div class="h-3 bg-gray-200 rounded w-1/4"></div>
													<div class="h-3 bg-gray-200 rounded w-full"></div>
												</div>
											</div>
										{/each}
									{:else if $isEmpty}
										<div class="text-center py-8">
											<p class="text-gray-400">No events yet</p>
											<p class="text-sm text-gray-300 mt-1">
												Events will appear here in real-time
											</p>
										</div>
									{:else}
										{#each $recentEvents as event (event.event_id)}
											{@const style = getEventStyle(event)}
											<div class="flex gap-3">
												<div
													class="w-10 h-10 rounded-full {style.bg} flex items-center justify-center flex-shrink-0"
												>
													<svg
														class="w-5 h-5 {style.iconColor}"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d={style.icon}
														/>
													</svg>
												</div>
												<div class="flex-1 min-w-0">
													<h4 class="text-sm font-semibold text-gray-900 truncate">
														{event.type}
													</h4>
													<p class="text-xs text-gray-500 mb-1">
														{formatDate(event.timestamp)}
													</p>
													<p class="text-xs text-gray-600 truncate">
														{event.source} •
														<span
															class="{event.severity === 'critical'
																? 'text-red-600'
																: event.severity === 'warning'
																	? 'text-yellow-600'
																	: 'text-blue-600'} font-medium"
														>
															{event.severity}
														</span>
													</p>
												</div>
											</div>
										{/each}
									{/if}
								</div>
							{:else if activeTab === 'logs'}
								<div class="space-y-2 font-mono text-xs">
									{#each $recentEvents.slice(0, 5) as event (event.event_id)}
										<div class="p-2 bg-gray-50 rounded">
											<span class="text-gray-400"
												>{new Date(event.timestamp).toLocaleTimeString()}</span
											>
											<span
												class="{event.severity === 'critical'
													? 'text-red-600'
													: event.severity === 'warning'
														? 'text-yellow-600'
														: 'text-blue-600'}">[{event.severity.toUpperCase()}]</span
											>
											<span class="text-gray-700">{event.type}</span>
										</div>
									{/each}
									{#if $isEmpty}
										<p class="text-gray-400 text-center py-4">No logs yet</p>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>

<!-- Modal vidéo -->
{#if showVideoModal}
	<div
		class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8"
		on:click={closeVideoModal}
		on:keydown={(e) => e.key === 'Escape' && closeVideoModal()}
		role="button"
		tabindex="0"
	>
		<div
			class="relative w-full max-w-5xl"
			on:click={(e) => e.stopPropagation()}
			on:keydown={(e) => e.stopPropagation()}
			role="button"
			tabindex="0"
		>
			<!-- Close button -->
			<button
				on:click={closeVideoModal}
				class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
			>
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<!-- Video container -->
			<div class="bg-black rounded-xl overflow-hidden aspect-video">
				<div
					class="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center"
				>
					<div class="text-white text-center">
						<p class="text-xl font-semibold mb-2">{selectedCamera}</p>
						<p class="text-sm opacity-75">Live Feed</p>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

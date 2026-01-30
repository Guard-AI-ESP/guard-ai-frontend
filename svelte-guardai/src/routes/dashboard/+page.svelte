<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';

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
				<h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

				<!-- Stats cards en haut -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<!-- Visits Card -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-4">Visits</h3>
						<p class="text-5xl font-bold text-gray-900 mb-6">5</p>
						<button class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-2">
							See more
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
							</svg>
						</button>
					</div>

					<!-- Events Card -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-4">Events Today</h3>
						<p class="text-5xl font-bold text-gray-900 mb-6">24</p>
						<button class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-2">
							See more
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
							</svg>
						</button>
					</div>

					<!-- Alerts Card -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-4">Active Alerts</h3>
						<p class="text-5xl font-bold text-gray-900 mb-6">3</p>
						<button class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-2">
							See more
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
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
								<div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
									<div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
										<svg class="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
											<path d="M8 5v14l11-7z" />
										</svg>
									</div>
								</div>
								<!-- Time indicator -->
								<div class="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
									Live
								</div>
							</button>
						</div>

						<!-- Stats en bas -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<!-- Event Created -->
							<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
								<h3 class="text-sm text-gray-500 mb-2">Event Created</h3>
								<p class="text-4xl font-bold text-gray-900 mb-4">40</p>
								<button class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-2">
									See more
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</button>
							</div>

							<!-- CPU Usage -->
							<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
								<h3 class="text-sm text-gray-500 mb-4">Stats</h3>
								<div class="flex items-center justify-between mb-4">
									<div>
										<p class="text-sm text-gray-600">Lorem s</p>
										<div class="flex items-center gap-2">
											<p class="text-3xl font-bold text-gray-900">20</p>
											<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
											</svg>
										</div>
									</div>
									<!-- CPU Gauge -->
									<div class="relative w-24 h-24">
										<svg class="w-24 h-24 transform -rotate-90">
											<circle cx="48" cy="48" r="40" stroke="#e5e7eb" stroke-width="8" fill="none" />
											<circle
												cx="48"
												cy="48"
												r="40"
												stroke="#10b981"
												stroke-width="8"
												fill="none"
												stroke-dasharray="251.2"
												stroke-dashoffset="75.36"
												stroke-linecap="round"
											/>
										</svg>
										<div class="absolute inset-0 flex flex-col items-center justify-center">
											<span class="text-2xl font-bold text-gray-900">70%</span>
											<span class="text-xs text-gray-500">CPU</span>
										</div>
									</div>
								</div>
								<button class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-2">
									See more
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</button>
							</div>
						</div>
					</div>

					<!-- Colonne droite (1/3) - Activity Timeline -->
					<div class="lg:col-span-1">
						<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
							<!-- Tabs -->
							<div class="flex gap-2 mb-6 border-b border-gray-200">
								<button
									on:click={() => activeTab = 'Activity'}
									class="px-4 py-2 text-sm font-medium transition-colors border-b-2 {activeTab === 'Activity' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
								>
									Activity
								</button>
								<button
									on:click={() => activeTab = 'logs'}
									class="px-4 py-2 text-sm font-medium transition-colors border-b-2 {activeTab === 'logs' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
								>
									logs
								</button>
								<button
									on:click={() => activeTab = 'Tabs'}
									class="px-4 py-2 text-sm font-medium transition-colors border-b-2 {activeTab === 'Tabs' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
								>
									Tabs
								</button>
							</div>

							<!-- Activity List -->
							{#if activeTab === 'Activity'}
								<div class="space-y-6">
									<!-- Client Login -->
									<div class="flex gap-3">
										<div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
											<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
											</svg>
										</div>
										<div class="flex-1">
											<h4 class="text-sm font-semibold text-gray-900">Client Login</h4>
											<p class="text-xs text-gray-500 mb-1">24 November 2025</p>
											<p class="text-xs text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
										</div>
									</div>

									<!-- Scheduled Maintenance -->
									<div class="flex gap-3">
										<div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
											<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
											</svg>
										</div>
										<div class="flex-1">
											<h4 class="text-sm font-semibold text-gray-900">Scheduled Maintenance</h4>
											<p class="text-xs text-gray-500 mb-1">23 November 2025</p>
											<p class="text-xs text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
										</div>
									</div>

									<!-- Camera Offline -->
									<div class="flex gap-3">
										<div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
											<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
											</svg>
										</div>
										<div class="flex-1">
											<h4 class="text-sm font-semibold text-gray-900">Camera Offline</h4>
											<p class="text-xs text-gray-500 mb-1">20 November 2025</p>
											<p class="text-xs text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
										</div>
									</div>

									<!-- Movement detected -->
									<div class="flex gap-3">
										<div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
											<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
											</svg>
										</div>
										<div class="flex-1">
											<h4 class="text-sm font-semibold text-gray-900">Movement detected</h4>
											<p class="text-xs text-gray-500 mb-1">19 November 2025</p>
											<p class="text-xs text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
										</div>
									</div>
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
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Video container -->
			<div class="bg-black rounded-xl overflow-hidden aspect-video">
				<div class="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
					<div class="text-white text-center">
						<p class="text-xl font-semibold mb-2">{selectedCamera}</p>
						<p class="text-sm opacity-75">Live Feed</p>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

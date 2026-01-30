<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';

	type Device = {
		id: string;
		name: string;
	};

	let devices: Device[] = [
		{ id: '1', name: 'Device-001' },
		{ id: '2', name: 'Device-002' },
		{ id: '3', name: 'Device-003' },
		{ id: '4', name: 'Device-004' },
	];

	let scanProgress = 70;
	let isScanning = false;
	let showDeleteModal = false;
	let deviceToDelete: Device | null = null;

	function startAnalysis() {
		isScanning = true;
		scanProgress = 0;

		const interval = setInterval(() => {
			scanProgress += 10;
			if (scanProgress >= 100) {
				clearInterval(interval);
				setTimeout(() => {
					isScanning = false;
					scanProgress = 70;
				}, 500);
			}
		}, 300);
	}

	function openDeleteModal(device: Device) {
		deviceToDelete = device;
		showDeleteModal = true;
	}

	function confirmDelete() {
		if (deviceToDelete) {
			devices = devices.filter(d => d.id !== deviceToDelete!.id);
			deviceToDelete = null;
		}
	}
</script>

<svelte:head>
	<title>Cyber Dashboard - Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main content -->
	<main class="flex-1 overflow-y-auto">
		<div class="p-8">
			<div class="max-w-7xl mx-auto">
				<h1 class="text-3xl font-bold text-gray-900 mb-8">Cyber Dashboard</h1>

				<!-- Stats cards en haut -->
				<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<!-- Devices Card -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center justify-between mb-2">
							<h3 class="text-sm text-gray-500">Active Devices</h3>
							<svg class="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
						</div>
						<p class="text-4xl font-bold text-gray-900">{devices.length}</p>
					</div>

					<!-- Threats Card -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center justify-between mb-2">
							<h3 class="text-sm text-gray-500">Threats Detected</h3>
							<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
						</div>
						<p class="text-4xl font-bold text-red-600">0</p>
					</div>

					<!-- WiFi Status Card -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center justify-between mb-2">
							<h3 class="text-sm text-gray-500">WiFi Status</h3>
							<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
							</svg>
						</div>
						<p class="text-xl font-bold text-green-600">Active</p>
					</div>

					<!-- Firewall Status Card -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center justify-between mb-2">
							<h3 class="text-sm text-gray-500">Firewall</h3>
							<svg class="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
						</div>
						<p class="text-xl font-bold text-teal-600">Protected</p>
					</div>
				</div>

				<!-- Contenu principal -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<!-- Colonne gauche (2/3) -->
					<div class="lg:col-span-2 space-y-6">
						<!-- Network Scanning -->
						<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
							<div class="flex items-center justify-between mb-6">
								<div class="flex items-center gap-3">
									<div class="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
										<svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
										</svg>
									</div>
									<div>
										<h3 class="text-lg font-semibold text-gray-900">Security Dashboard</h3>
										<p class="text-sm text-gray-500">Network scanning</p>
									</div>
								</div>
								<button
									on:click={startAnalysis}
									disabled={isScanning}
									class="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
								>
									{isScanning ? 'Scanning...' : 'Analyze'}
								</button>
							</div>

							<!-- Progress Bar -->
							<div class="mb-4">
								<div class="flex items-center justify-between mb-2">
									<span class="text-sm font-medium text-gray-700">General scanning</span>
									<span class="text-sm font-semibold text-gray-900">{scanProgress}%</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
									<div
										class="bg-gradient-to-r from-pink-500 to-pink-600 h-3 rounded-full transition-all duration-300"
										style="width: {scanProgress}%"
									></div>
								</div>
							</div>

							<!-- Radar Animation -->
							{#if isScanning}
								<div class="flex items-center justify-center py-12">
									<div class="relative w-48 h-48">
										<!-- Outer circle -->
										<div class="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
										<div class="absolute inset-4 border-4 border-pink-300 rounded-full"></div>
										<div class="absolute inset-8 border-4 border-pink-400 rounded-full"></div>

										<!-- Radar sweep -->
										<div class="absolute inset-0 animate-spin" style="animation-duration: 2s;">
											<div class="absolute top-1/2 left-1/2 w-1/2 h-1 bg-gradient-to-r from-pink-600 to-transparent origin-left"></div>
										</div>

										<!-- Center dot -->
										<div class="absolute top-1/2 left-1/2 w-3 h-3 bg-pink-600 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
									</div>
								</div>
							{/if}
						</div>

						<!-- Devices List -->
						<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
							<h3 class="text-lg font-semibold text-gray-900 mb-4">Scanning by device</h3>

							{#if devices.length === 0}
								<div class="text-center py-8">
									<svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
									<p class="text-gray-500">Aucun dispositif trouvé.</p>
								</div>
							{:else}
								<div class="space-y-3">
									{#each devices as device (device.id)}
										<div class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
											<div class="flex items-center gap-3">
												<div class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
													<svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
													</svg>
												</div>
												<div>
													<p class="text-sm font-semibold text-gray-900">{device.name}</p>
													<p class="text-xs text-gray-500">Online</p>
												</div>
											</div>
											<button
												on:click={() => openDeleteModal(device)}
												class="p-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
												title="Delete device"
											>
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
												</svg>
											</button>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>

					<!-- Colonne droite (1/3) - Logs -->
					<div class="lg:col-span-1">
						<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
							<div class="flex items-center gap-3 mb-6">
								<div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
									<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
									</svg>
								</div>
								<h3 class="text-lg font-semibold text-gray-900">Security Logs</h3>
							</div>

							<div class="space-y-4">
								<!-- Log Entry 1 -->
								<div class="pb-4 border-b border-gray-200">
									<div class="flex items-start gap-2 mb-2">
										<div class="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
										<div class="flex-1">
											<p class="text-sm font-medium text-gray-900">System Start</p>
											<p class="text-xs text-gray-500">12 Dec 2025, 14:30</p>
										</div>
									</div>
									<p class="text-xs text-gray-600 ml-4">All systems operational. Security protocols activated.</p>
								</div>

								<!-- Log Entry 2 -->
								<div class="pb-4 border-b border-gray-200">
									<div class="flex items-start gap-2 mb-2">
										<div class="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
										<div class="flex-1">
											<p class="text-sm font-medium text-gray-900">Device Connected</p>
											<p class="text-xs text-gray-500">12 Dec 2025, 13:45</p>
										</div>
									</div>
									<p class="text-xs text-gray-600 ml-4">New device detected and authenticated successfully.</p>
								</div>

								<!-- Log Entry 3 -->
								<div class="pb-4 border-b border-gray-200">
									<div class="flex items-start gap-2 mb-2">
										<div class="w-2 h-2 bg-yellow-500 rounded-full mt-1.5"></div>
										<div class="flex-1">
											<p class="text-sm font-medium text-gray-900">Firewall Update</p>
											<p class="text-xs text-gray-500">12 Dec 2025, 12:00</p>
										</div>
									</div>
									<p class="text-xs text-gray-600 ml-4">Firewall rules updated. 3 new rules added.</p>
								</div>

								<!-- Log Entry 4 -->
								<div class="pb-4">
									<div class="flex items-start gap-2 mb-2">
										<div class="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
										<div class="flex-1">
											<p class="text-sm font-medium text-gray-900">Scan Completed</p>
											<p class="text-xs text-gray-500">12 Dec 2025, 10:15</p>
										</div>
									</div>
									<p class="text-xs text-gray-600 ml-4">Network scan completed. No threats detected.</p>
								</div>
							</div>

							<button class="w-full mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
								View all logs
							</button>
						</div>
					</div>
				</div>

				<!-- Quick Settings -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
					<a href="/wifi" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
						<div class="flex items-center gap-4">
							<div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
								<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
								</svg>
							</div>
							<div>
								<h4 class="text-sm font-semibold text-gray-900">WiFi Settings</h4>
								<p class="text-xs text-gray-500">Configure network</p>
							</div>
						</div>
					</a>

					<a href="/dhcp" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
						<div class="flex items-center gap-4">
							<div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
								<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
								</svg>
							</div>
							<div>
								<h4 class="text-sm font-semibold text-gray-900">DHCP Server</h4>
								<p class="text-xs text-gray-500">Manage IP addresses</p>
							</div>
						</div>
					</a>

					<a href="/radius" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
						<div class="flex items-center gap-4">
							<div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
								<svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							</div>
							<div>
								<h4 class="text-sm font-semibold text-gray-900">RADIUS Server</h4>
								<p class="text-xs text-gray-500">Authentication</p>
							</div>
						</div>
					</a>

					<a href="/firewall" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
						<div class="flex items-center gap-4">
							<div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
								<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
							</div>
							<div>
								<h4 class="text-sm font-semibold text-gray-900">Firewall</h4>
								<p class="text-xs text-gray-500">Security rules</p>
							</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	</main>

	<!-- Delete Modal -->
	<DeleteModal
		bind:isOpen={showDeleteModal}
		title="Delete Device"
		message={deviceToDelete ? `Are you sure you want to delete ${deviceToDelete.name}? This action cannot be undone.` : ''}
		on:confirm={confirmDelete}
	/>
</div>

<style>
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.animate-spin {
		animation: spin 2s linear infinite;
	}
</style>

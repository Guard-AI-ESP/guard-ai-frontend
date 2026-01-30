<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';

	type Detector = {
		id: string;
		name: string;
		location: string;
		enabled: boolean;
		range: string;
		lastActivity: Date | null;
	};

	let detectors: Detector[] = [
		{ id: '1', name: 'Détecteur Entrée', location: 'Entrée principale', enabled: true, range: '1.2m', lastActivity: new Date('2024-12-11T14:30:00') },
		{ id: '2', name: 'Détecteur Garage', location: 'Garage', enabled: true, range: '1m', lastActivity: new Date('2024-12-11T12:15:00') },
		{ id: '3', name: 'Détecteur Jardin', location: 'Portail arrière', enabled: false, range: '1.2m', lastActivity: null },
	];

	let globalEnabled = true;
	let selectedRange = '1m';
	let showRangeDropdown = false;

	const rangeOptions = ['1m', '1.2m', '1.5m', '2m'];

	function toggleGlobalDetectors() {
		// globalEnabled est déjà mis à jour par bind:checked
		// On met juste à jour tous les détecteurs
		detectors = detectors.map(d => ({ ...d, enabled: globalEnabled }));
	}

	function toggleDetector(id: string) {
		// La valeur est déjà inversée par bind:checked
		// On s'assure juste que le tableau est réactif
		detectors = [...detectors];
	}

	function selectRange(range: string) {
		selectedRange = range;
		showRangeDropdown = false;
	}

	function saveSettings() {
		console.log('Saving settings:', { detectors, selectedRange });
		// Afficher un message de succès
		alert('Paramètres enregistrés avec succès !');
	}

	function formatDateTime(date: Date | null): string {
		if (!date) return 'Jamais';
		return date.toLocaleString('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.range-dropdown-container')) {
			showRangeDropdown = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<svelte:head>
	<title>Détecteurs de présence - Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main content -->
	<main class="flex-1 overflow-y-auto">
		<div class="p-8">
			<div class="max-w-4xl mx-auto">
				<h1 class="text-3xl font-bold text-gray-900 mb-8">Détecteurs de présence</h1>

				<!-- Global Status Card -->
				<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-4">
							<div class="w-12 h-12 rounded-full {globalEnabled ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center">
								<svg class="w-6 h-6 {globalEnabled ? 'text-green-600' : 'text-red-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<div>
								<h2 class="text-lg font-semibold text-gray-900">Statut des détecteurs de présence</h2>
								<p class="text-sm text-gray-500">
									{globalEnabled ? 'Détecteurs activés' : 'Détecteurs désactivés'}
								</p>
							</div>
						</div>

						<!-- Toggle Switch -->
						<label class="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								bind:checked={globalEnabled}
								on:change={toggleGlobalDetectors}
								class="sr-only peer"
							/>
							<div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-500"></div>
							<span class="ms-3 text-sm font-medium text-gray-900">
								{globalEnabled ? 'Désactiver' : 'Activer'} les détecteurs
							</span>
						</label>
					</div>
				</div>

				<!-- Range Settings Card -->
				<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
					<h2 class="text-lg font-semibold text-gray-900 mb-4">Paramètres de portée</h2>

					<div class="flex items-center gap-4">
						<span class="text-sm text-gray-600">Portée par défaut :</span>

						<!-- Custom Dropdown -->
						<div class="relative range-dropdown-container">
							<button
								type="button"
								on:click|stopPropagation={() => showRangeDropdown = !showRangeDropdown}
								class="inline-flex justify-center items-center gap-x-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors min-w-[120px]"
							>
								<span>Portée: {selectedRange}</span>
								<svg class="w-5 h-5 text-gray-400 transition-transform {showRangeDropdown ? 'rotate-180' : ''}" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
								</svg>
							</button>

							{#if showRangeDropdown}
								<div class="absolute z-50 mt-2 w-full origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									<div class="py-1">
										{#each rangeOptions as option}
											<button
												type="button"
												on:click={() => selectRange(option)}
												class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors {selectedRange === option ? 'bg-teal-50 text-teal-700 font-semibold' : ''}"
											>
												{option}
											</button>
										{/each}
									</div>
								</div>
							{/if}
						</div>

						<div class="flex-1 flex items-center gap-2 text-xs text-gray-500">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>Cette portée sera appliquée à tous les nouveaux détecteurs</span>
						</div>
					</div>
				</div>

				<!-- Individual Detectors List -->
				<div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
					<div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
						<h2 class="text-lg font-semibold text-gray-900">Détecteurs installés</h2>
					</div>

					<div class="divide-y divide-gray-200">
						{#each detectors as detector (detector.id)}
							<div class="p-6 hover:bg-gray-50 transition-colors">
								<div class="flex items-center justify-between">
									<!-- Detector Info -->
									<div class="flex items-center gap-4 flex-1">
										<div class="w-10 h-10 rounded-full {detector.enabled ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center">
											<svg class="w-5 h-5 {detector.enabled ? 'text-green-600' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
											</svg>
										</div>

										<div class="flex-1">
											<h3 class="text-sm font-semibold text-gray-900">{detector.name}</h3>
											<div class="flex items-center gap-4 mt-1">
												<span class="text-xs text-gray-500 flex items-center gap-1">
													<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
													</svg>
													{detector.location}
												</span>
												<span class="text-xs text-gray-500 flex items-center gap-1">
													<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
													</svg>
													Portée: {detector.range}
												</span>
												<span class="text-xs text-gray-500 flex items-center gap-1">
													<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
													Dernière activité: {formatDateTime(detector.lastActivity)}
												</span>
											</div>
										</div>
									</div>

									<!-- Toggle Switch -->
									<label class="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											bind:checked={detector.enabled}
											on:change={() => toggleDetector(detector.id)}
											class="sr-only peer"
										/>
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
									</label>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Save Button -->
				<div class="flex justify-center">
					<button
						on:click={saveSettings}
						class="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
						Enregistrer les paramètres
					</button>
				</div>

				<!-- Stats Cards -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-2">Détecteurs actifs</h3>
						<p class="text-4xl font-bold text-green-600">{detectors.filter(d => d.enabled).length}</p>
					</div>

					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-2">Détecteurs inactifs</h3>
						<p class="text-4xl font-bold text-gray-600">{detectors.filter(d => !d.enabled).length}</p>
					</div>

					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-2">Total installés</h3>
						<p class="text-4xl font-bold text-teal-600">{detectors.length}</p>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>

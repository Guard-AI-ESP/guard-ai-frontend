<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import Datepicker from '$lib/components/Datepicker.svelte';

	type RecordingCategory = 'recent' | 'motion' | 'manual';

	type VideoRecording = {
		id: string;
		camera: string;
		date: Date;
		duration: string;
		size: string;
		category: RecordingCategory;
		thumbnail?: string;
		hasMotion: boolean;
	};

	let activeTab: 'all' | 'recent' | 'motion' | 'manual' = 'all';
	let searchQuery = '';
	let dateFilter = '';
	let sortBy = 'date';
	let showDeleteModal = false;
	let recordingToDelete: VideoRecording | null = null;

	// Données de démonstration
	const recordings: VideoRecording[] = [
		{ id: '1', camera: 'Entrée principale', date: new Date('2024-12-11T14:30:00'), duration: '5:23', size: '245 MB', category: 'motion', hasMotion: true },
		{ id: '2', camera: 'Portail arrière', date: new Date('2024-12-11T13:15:00'), duration: '2:45', size: '128 MB', category: 'manual', hasMotion: false },
		{ id: '3', camera: 'Garage', date: new Date('2024-12-11T11:45:00'), duration: '8:12', size: '384 MB', category: 'motion', hasMotion: true },
		{ id: '4', camera: 'Entrée principale', date: new Date('2024-12-11T10:20:00'), duration: '3:34', size: '165 MB', category: 'recent', hasMotion: false },
		{ id: '5', camera: 'Portail arrière', date: new Date('2024-12-11T09:30:00'), duration: '12:56', size: '592 MB', category: 'motion', hasMotion: true },
		{ id: '6', camera: 'Entrée principale', date: new Date('2024-12-10T18:45:00'), duration: '4:23', size: '203 MB', category: 'manual', hasMotion: false },
		{ id: '7', camera: 'Garage', date: new Date('2024-12-10T16:30:00'), duration: '6:45', size: '312 MB', category: 'motion', hasMotion: true },
		{ id: '8', camera: 'Entrée principale', date: new Date('2024-12-10T14:15:00'), duration: '9:22', size: '425 MB', category: 'recent', hasMotion: false },
		{ id: '9', camera: 'Portail arrière', date: new Date('2024-12-10T12:00:00'), duration: '7:15', size: '334 MB', category: 'motion', hasMotion: true },
		{ id: '10', camera: 'Garage', date: new Date('2024-12-10T10:30:00'), duration: '5:50', size: '268 MB', category: 'manual', hasMotion: false },
	];

	$: filteredRecordings = recordings.filter(rec => {
		if (activeTab !== 'all' && rec.category !== activeTab) return false;
		if (searchQuery && !rec.camera.toLowerCase().includes(searchQuery.toLowerCase())) return false;
		if (dateFilter && rec.date.toISOString().split('T')[0] !== dateFilter) return false;
		return true;
	}).sort((a, b) => {
		if (sortBy === 'date') return b.date.getTime() - a.date.getTime();
		if (sortBy === 'duration') return parseInt(b.duration) - parseInt(a.duration);
		if (sortBy === 'size') return parseInt(b.size) - parseInt(a.size);
		return 0;
	});

	function formatDate(date: Date): string {
		return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
	}

	function openDeleteModal(recording: VideoRecording) {
		recordingToDelete = recording;
		showDeleteModal = true;
	}

	function confirmDelete() {
		if (recordingToDelete) {
			console.log('Delete recording:', recordingToDelete.id);
			// Ici tu peux ajouter la logique pour supprimer l'enregistrement
			// Par exemple: recordings = recordings.filter(r => r.id !== recordingToDelete.id);
			recordingToDelete = null;
		}
	}

	function playRecording(id: string) {
		console.log('Play recording:', id);
		// Ouvrir le lecteur vidéo
	}

	function downloadRecording(id: string) {
		console.log('Download recording:', id);
		// Télécharger la vidéo
	}

	function viewCamera(camera: string) {
		console.log('View camera:', camera);
		// Rediriger vers la vue caméra en direct
	}
</script>

<svelte:head>
	<title>Enregistrements - Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main content -->
	<main class="flex-1 overflow-y-auto">
		<div class="p-8">
			<div class="max-w-7xl mx-auto">
				<div class="flex items-center justify-between mb-8">
					<h1 class="text-3xl font-bold text-gray-900">Enregistrements vidéo</h1>

					<!-- Filtres -->
					<div class="flex gap-3">
						<!-- Search -->
						<div class="relative">
							<input
								type="text"
								bind:value={searchQuery}
								placeholder="Rechercher une caméra..."
								class="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
							/>
							<svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>

						<!-- Date filter -->
						<div class="w-48">
							<Datepicker bind:value={dateFilter} placeholder="Filtrer par date" />
						</div>

						<!-- Sort -->
						<div class="relative">
							<select
								bind:value={sortBy}
								class="px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 appearance-none"
							>
								<option value="date">Trier par date</option>
								<option value="duration">Trier par durée</option>
								<option value="size">Trier par taille</option>
							</select>
							<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
								</svg>
							</div>
						</div>
					</div>
				</div>

				<!-- Tabs + Content -->
				<div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
					<!-- Tabs -->
					<div class="flex border-b border-gray-200">
						<button
							on:click={() => activeTab = 'all'}
							class="flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 {activeTab === 'all' ? 'border-teal-500 text-teal-600 bg-gray-50' : 'border-transparent text-gray-600 hover:text-gray-900'}"
						>
							Tous
						</button>
						<button
							on:click={() => activeTab = 'recent'}
							class="flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 {activeTab === 'recent' ? 'border-teal-500 text-teal-600 bg-gray-50' : 'border-transparent text-gray-600 hover:text-gray-900'}"
						>
							Récents
						</button>
						<button
							on:click={() => activeTab = 'motion'}
							class="flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 {activeTab === 'motion' ? 'border-teal-500 text-teal-600 bg-gray-50' : 'border-transparent text-gray-600 hover:text-gray-900'}"
						>
							Détection de mouvement
						</button>
						<button
							on:click={() => activeTab = 'manual'}
							class="flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 {activeTab === 'manual' ? 'border-teal-500 text-teal-600 bg-gray-50' : 'border-transparent text-gray-600 hover:text-gray-900'}"
						>
							Manuels
						</button>
					</div>

					<!-- Content -->
					<div class="p-6">
						{#if filteredRecordings.length === 0}
							<div class="text-center py-12">
								<svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
								</svg>
								<p class="text-gray-500">Aucun enregistrement trouvé</p>
							</div>
						{:else}
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{#each filteredRecordings as recording (recording.id)}
									<div class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
										<!-- Video thumbnail -->
										<div class="relative aspect-video bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
											<!-- Play button overlay -->
											<button
												on:click={() => playRecording(recording.id)}
												class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors"
											>
												<div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
													<svg class="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
														<path d="M8 5v14l11-7z" />
													</svg>
												</div>
											</button>

											<!-- Motion badge -->
											{#if recording.hasMotion}
												<div class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
													<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
														<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
													</svg>
													Mouvement
												</div>
											{/if}

											<!-- Duration badge -->
											<div class="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
												{recording.duration}
											</div>
										</div>

										<!-- Recording info -->
										<div class="p-4">
											<div class="flex items-start justify-between mb-2">
												<div class="flex-1 min-w-0">
													<h3 class="text-sm font-semibold text-gray-900 truncate">{recording.camera}</h3>
													<p class="text-xs text-gray-500">{formatDate(recording.date)} · {formatTime(recording.date)}</p>
												</div>
												<button
													on:click={() => viewCamera(recording.camera)}
													class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors ml-2"
													title="Voir la caméra"
												>
													<svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
													</svg>
												</button>
											</div>

											<div class="flex items-center justify-between text-xs text-gray-500 mb-3">
												<span class="flex items-center gap-1">
													<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
													</svg>
													{recording.size}
												</span>
												<span class="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">
													{#if recording.category === 'motion'}
														Mouvement
													{:else if recording.category === 'manual'}
														Manuel
													{:else}
														Récent
													{/if}
												</span>
											</div>

											<!-- Actions -->
											<div class="flex gap-2">
												<button
													on:click={() => downloadRecording(recording.id)}
													class="flex-1 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
												>
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
													</svg>
													Télécharger
												</button>
												<button
													on:click={() => openDeleteModal(recording)}
													class="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
													title="Supprimer"
												>
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
													</svg>
												</button>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<!-- Stats card en bas -->
				<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-2">Total enregistrements</h3>
						<p class="text-4xl font-bold text-gray-900">{recordings.length}</p>
					</div>

					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-2">Détection mouvement</h3>
						<p class="text-4xl font-bold text-red-600">{recordings.filter(r => r.category === 'motion').length}</p>
					</div>

					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-2">Stockage utilisé</h3>
						<p class="text-4xl font-bold text-blue-600">3.2 GB</p>
					</div>

					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-2">Dernières 24h</h3>
						<p class="text-4xl font-bold text-teal-600">{recordings.filter(r => {
							const dayAgo = new Date();
							dayAgo.setDate(dayAgo.getDate() - 1);
							return r.date > dayAgo;
						}).length}</p>
					</div>
				</div>
			</div>
		</div>
	</main>

	<!-- Delete Modal -->
	<DeleteModal
		bind:open={showDeleteModal}
		title="Supprimer l'enregistrement"
		message={recordingToDelete ? `Êtes-vous sûr de vouloir supprimer l'enregistrement de la ${recordingToDelete.camera} du ${formatDate(recordingToDelete.date)} à ${formatTime(recordingToDelete.date)} ? Cette action est irréversible.` : ''}
		on:confirm={confirmDelete}
	/>
</div>

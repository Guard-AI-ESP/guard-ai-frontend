<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import Datepicker from '$lib/components/Datepicker.svelte';

	type CallType = 'visitor' | 'outgoing' | 'missed';

	type Call = {
		id: string;
		camera: string; // Nom de la caméra/sonnette
		type: CallType;
		date: Date;
		duration: string;
		status: 'answered' | 'missed' | 'rejected';
		thumbnail?: string; // Miniature de la caméra
	};

	let activeTab: 'all' | 'visitor' | 'outgoing' | 'missed' = 'all';
	let searchQuery = '';
	let dateFilter = '';
	let sortBy = 'date';
	let showDeleteModal = false;
	let callToDelete: Call | null = null;

	// Données de démonstration - Sonnette connectée
	const calls: Call[] = [
		{ id: '1', camera: 'Entrée principale', type: 'visitor', date: new Date('2024-12-11T14:30:00'), duration: '5:23', status: 'answered' },
		{ id: '2', camera: 'Portail arrière', type: 'outgoing', date: new Date('2024-12-11T13:15:00'), duration: '2:45', status: 'answered' },
		{ id: '3', camera: 'Entrée principale', type: 'missed', date: new Date('2024-12-11T11:45:00'), duration: '0:00', status: 'missed' },
		{ id: '4', camera: 'Entrée principale', type: 'visitor', date: new Date('2024-12-11T10:20:00'), duration: '8:12', status: 'answered' },
		{ id: '5', camera: 'Garage', type: 'outgoing', date: new Date('2024-12-11T09:30:00'), duration: '1:34', status: 'answered' },
		{ id: '6', camera: 'Entrée principale', type: 'missed', date: new Date('2024-12-10T18:45:00'), duration: '0:00', status: 'missed' },
		{ id: '7', camera: 'Portail arrière', type: 'visitor', date: new Date('2024-12-10T16:30:00'), duration: '12:56', status: 'answered' },
		{ id: '8', camera: 'Entrée principale', type: 'outgoing', date: new Date('2024-12-10T14:15:00'), duration: '3:22', status: 'answered' },
		{ id: '9', camera: 'Garage', type: 'visitor', date: new Date('2024-12-10T12:00:00'), duration: '6:45', status: 'answered' },
		{ id: '10', camera: 'Entrée principale', type: 'missed', date: new Date('2024-12-10T10:30:00'), duration: '0:00', status: 'missed' },
	];

	$: filteredCalls = calls.filter(call => {
		if (activeTab !== 'all' && call.type !== activeTab) return false;
		if (searchQuery && !call.camera.toLowerCase().includes(searchQuery.toLowerCase())) return false;
		if (dateFilter && call.date.toISOString().split('T')[0] !== dateFilter) return false;
		return true;
	}).sort((a, b) => {
		if (sortBy === 'date') return b.date.getTime() - a.date.getTime();
		if (sortBy === 'duration') return parseInt(b.duration) - parseInt(a.duration);
		return 0;
	});

	function formatDate(date: Date): string {
		return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
	}

	function getCallIcon(type: CallType, status: string) {
		if (status === 'missed') {
			return 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z';
		}
		if (type === 'incoming') {
			return 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z';
		}
		return 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z';
	}

	function getCallColor(type: CallType, status: string) {
		if (status === 'missed') return 'bg-red-100 text-red-600';
		if (type === 'visitor') return 'bg-green-100 text-green-600';
		return 'bg-blue-100 text-blue-600';
	}

	function openDeleteModal(call: Call) {
		callToDelete = call;
		showDeleteModal = true;
	}

	function confirmDelete() {
		if (callToDelete) {
			console.log('Delete call:', callToDelete.id);
			// Ici tu peux ajouter la logique pour supprimer l'appel
			// Par exemple: calls = calls.filter(c => c.id !== callToDelete.id);
			callToDelete = null;
		}
	}

	function viewCamera(camera: string) {
		console.log('View camera:', camera);
		// Rediriger vers la vue caméra en direct
	}

	function speakToVisitor(callId: string) {
		console.log('Speak to visitor via call:', callId);
		// Ouvrir l'interphone
	}
</script>

<svelte:head>
	<title>Journal d'appels - Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main content -->
	<main class="flex-1 overflow-y-auto">
		<div class="p-8">
			<div class="max-w-7xl mx-auto">
				<div class="flex items-center justify-between mb-8">
					<h1 class="text-3xl font-bold text-gray-900">Journal d'appels</h1>

					<!-- Filtres -->
					<div class="flex gap-3">
						<!-- Search -->
						<div class="relative">
							<input
								type="text"
								bind:value={searchQuery}
								placeholder="Rechercher..."
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
						<select
							bind:value={sortBy}
							class="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
						>
							<option value="date">Trier par date</option>
							<option value="duration">Trier par durée</option>
						</select>
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
							on:click={() => activeTab = 'visitor'}
							class="flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 {activeTab === 'visitor' ? 'border-teal-500 text-teal-600 bg-gray-50' : 'border-transparent text-gray-600 hover:text-gray-900'}"
						>
							Visiteurs
						</button>
						<button
							on:click={() => activeTab = 'outgoing'}
							class="flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 {activeTab === 'outgoing' ? 'border-teal-500 text-teal-600 bg-gray-50' : 'border-transparent text-gray-600 hover:text-gray-900'}"
						>
							Vous avez parlé
						</button>
						<button
							on:click={() => activeTab = 'missed'}
							class="flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 {activeTab === 'missed' ? 'border-teal-500 text-teal-600 bg-gray-50' : 'border-transparent text-gray-600 hover:text-gray-900'}"
						>
							Manqués
						</button>
					</div>

					<!-- Content -->
					<div class="p-6">
						{#if filteredCalls.length === 0}
							<div class="text-center py-12">
								<svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
								</svg>
								<p class="text-gray-500">Aucun appel trouvé</p>
							</div>
						{:else}
							<div class="space-y-3">
								{#each filteredCalls as call (call.id)}
									<div class="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors group">
										<!-- Call icon -->
										<div class="w-12 h-12 rounded-full {getCallColor(call.type, call.status)} flex items-center justify-center flex-shrink-0">
											{#if call.status === 'missed'}
												<!-- Sonnette manquée -->
												<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
												</svg>
											{:else if call.type === 'visitor'}
												<!-- Visiteur à la sonnette -->
												<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
												</svg>
											{:else}
												<!-- Vous avez parlé (interphone) -->
												<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
												</svg>
											{/if}
										</div>

										<!-- Call info -->
										<div class="flex-1 min-w-0">
											<h3 class="text-sm font-semibold text-gray-900 truncate">
												{#if call.type === 'visitor'}
													Visiteur - {call.camera}
												{:else if call.type === 'outgoing'}
													Communication - {call.camera}
												{:else}
													Sonnette manquée - {call.camera}
												{/if}
											</h3>
											<p class="text-sm text-gray-500">
												{#if call.type === 'visitor'}
													Quelqu'un a sonné
												{:else if call.type === 'outgoing'}
													Vous avez parlé à l'interphone
												{:else}
													Visiteur non répondu
												{/if}
											</p>
										</div>

										<!-- Call details -->
										<div class="text-right">
											<p class="text-sm text-gray-900 font-medium">{formatDate(call.date)} · {formatTime(call.date)}</p>
											<p class="text-sm text-gray-500">
												{#if call.status === 'missed'}
													<span class="text-red-600">Manqué</span>
												{:else}
													Durée: {call.duration}
												{/if}
											</p>
										</div>

										<!-- Actions -->
										<div class="flex items-center gap-2">
											<!-- View camera -->
											<button
												on:click={() => viewCamera(call.camera)}
												class="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
												title="Voir la caméra"
											>
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
												</svg>
											</button>

											<!-- Speak via intercom -->
											<button
												on:click={() => speakToVisitor(call.id)}
												class="p-2 hover:bg-teal-50 text-teal-600 rounded-lg transition-colors"
												title="Parler à l'interphone"
											>
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
												</svg>
											</button>

											<!-- Delete -->
											<button
												on:click={() => openDeleteModal(call)}
												class="p-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
												title="Supprimer"
											>
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
												</svg>
											</button>
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
						<h3 class="text-sm text-gray-500 mb-2">Total interactions</h3>
						<p class="text-4xl font-bold text-gray-900">{calls.length}</p>
					</div>

					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-2">Visiteurs sonnés</h3>
						<p class="text-4xl font-bold text-green-600">{calls.filter(c => c.type === 'visitor').length}</p>
					</div>

					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-2">Vous avez parlé</h3>
						<p class="text-4xl font-bold text-blue-600">{calls.filter(c => c.type === 'outgoing').length}</p>
					</div>

					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-2">Sonnettes manquées</h3>
						<p class="text-4xl font-bold text-red-600">{calls.filter(c => c.status === 'missed').length}</p>
					</div>
				</div>
			</div>
		</div>
	</main>

	<!-- Delete Modal -->
	<DeleteModal
		bind:open={showDeleteModal}
		title="Supprimer l'interaction"
		message={callToDelete ? `Êtes-vous sûr de vouloir supprimer cette interaction de la ${callToDelete.camera} ? L'enregistrement vidéo et audio sera définitivement supprimé.` : ''}
		on:confirm={confirmDelete}
	/>
</div>

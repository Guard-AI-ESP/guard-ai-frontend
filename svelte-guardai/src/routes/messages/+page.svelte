<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import Datepicker from '$lib/components/Datepicker.svelte';
	import { onMount, onDestroy } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import { Howl } from 'howler';

	type Recording = {
		id: string;
		title: string;
		date: Date;
		duration: string;
		daysLeft: number;
		category: 'recent' | 'mid' | 'old';
		audioSrc: string;
	};

	let activeTab: 'recent' | 'mid' | 'old' = 'recent';
	let searchQuery = '';
	let dateFilter = '';
	let sortBy = 'date';
	let playingId: string | null = null;
	let wavesurfers: { [key: string]: WaveSurfer } = {};
	let howls: { [key: string]: Howl } = {};
	let currentTimes: { [key: string]: number } = {};
	let durations: { [key: string]: number } = {};
	let isReady: { [key: string]: boolean } = {};
	let showDeleteModal = false;
	let recordingToDelete: Recording | null = null;

	// Données de démonstration
	const recordings: Recording[] = [
		{ id: '1', title: 'Audio 24/07/2024', date: new Date('2024-11-06'), duration: '2:34', daysLeft: 28, category: 'recent', audioSrc: '/audio/sample.m4a' },
		{ id: '2', title: 'Audio 24/07/2024', date: new Date('2024-11-05'), duration: '1:45', daysLeft: 28, category: 'recent', audioSrc: '/audio/sample.m4a' },
		{ id: '3', title: 'Audio 24/07/2024', date: new Date('2024-11-04'), duration: '3:12', daysLeft: 28, category: 'recent', audioSrc: '/audio/sample.m4a' },
		{ id: '4', title: 'Audio 24/07/2024', date: new Date('2024-10-20'), duration: '4:05', daysLeft: 14, category: 'mid', audioSrc: '/audio/sample.m4a' },
		{ id: '5', title: 'Audio 24/07/2024', date: new Date('2024-10-15'), duration: '2:58', daysLeft: 9, category: 'mid', audioSrc: '/audio/sample.m4a' },
		{ id: '6', title: 'Audio 24/07/2024', date: new Date('2024-09-10'), duration: '1:23', daysLeft: 2, category: 'old', audioSrc: '/audio/sample.m4a' },
		{ id: '7', title: 'Audio 24/07/2024', date: new Date('2024-09-05'), duration: '5:11', daysLeft: 1, category: 'old', audioSrc: '/audio/sample.m4a' },
	];

	$: filteredRecordings = recordings.filter(rec => {
		if (rec.category !== activeTab) return false;
		if (searchQuery && !rec.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
		if (dateFilter && rec.date.toISOString().split('T')[0] !== dateFilter) return false;
		return true;
	}).sort((a, b) => {
		if (sortBy === 'date') return b.date.getTime() - a.date.getTime();
		if (sortBy === 'duration') return parseInt(a.duration) - parseInt(b.duration);
		return 0;
	});

	// Watch for tab changes and stop all audio
	$: if (activeTab) {
		stopAllAudio();
	}

	function stopAllAudio() {
		Object.keys(howls).forEach(key => {
			if (howls[key]) {
				howls[key].stop();
			}
		});
		playingId = null;
	}

	function initializeAudio(id: string, container: HTMLElement, audioSrc: string) {
		// Clean up existing instances first
		if (wavesurfers[id]) {
			wavesurfers[id].destroy();
			delete wavesurfers[id];
		}
		if (howls[id]) {
			howls[id].unload();
			delete howls[id];
		}

		// Create WaveSurfer instance (visualization only, no audio playback)
		const wavesurfer = WaveSurfer.create({
			container: container,
			waveColor: '#cbd5e1',
			progressColor: '#14b8a6',
			cursorColor: '#14b8a6',
			barWidth: 2,
			barGap: 1,
			barRadius: 2,
			height: 40,
			normalize: true,
			backend: 'WebAudio',
			interact: true,
			hideScrollbar: true
		});

		// Load audio for visualization only (WaveSurfer won't play it)
		wavesurfer.load(audioSrc);

		// Create Howl instance for audio control
		const howl = new Howl({
			src: [audioSrc],
			html5: true,
			onload: () => {
				durations[id] = howl.duration();
				isReady[id] = true;
			},
			onplay: () => {
				// Only update visual progress, don't trigger WaveSurfer's audio playback
				requestAnimationFrame(() => updateProgress(id));
			},
			onpause: () => {
				// No need to pause WaveSurfer since it's not playing audio
			},
			onend: () => {
				playingId = null;
				currentTimes[id] = 0;
				wavesurfer.seekTo(0);
			},
			onstop: () => {
				// Reset visual position only
				wavesurfer.seekTo(0);
			}
		});

		wavesurfers[id] = wavesurfer;
		howls[id] = howl;

		// Sync WaveSurfer seek with Howler
		wavesurfer.on('interaction', () => {
			const seekTime = wavesurfer.getCurrentTime();
			howl.seek(seekTime);
			currentTimes[id] = seekTime;
		});
	}

	function updateProgress(id: string) {
		const howl = howls[id];
		const wavesurfer = wavesurfers[id];
		if (howl && howl.playing()) {
			const currentTime = howl.seek();
			currentTimes[id] = currentTime;

			// Sync WaveSurfer visual progress with Howler playback position
			if (wavesurfer && durations[id]) {
				const progress = currentTime / durations[id];
				wavesurfer.seekTo(progress);
			}

			requestAnimationFrame(() => updateProgress(id));
		}
	}

	function togglePlay(id: string) {
		const howl = howls[id];
		if (!howl) return;

		if (playingId === id) {
			// Stop current audio completely (not pause)
			howl.stop();
			playingId = null;
		} else {
			// Stop all other audios
			Object.keys(howls).forEach(key => {
				if (key !== id && howls[key]) {
					howls[key].stop();
				}
			});
			// Play selected audio from the beginning or current position
			if (currentTimes[id] && currentTimes[id] > 0) {
				howl.seek(currentTimes[id]);
			}
			howl.play();
			playingId = id;
		}
	}

	function openDeleteModal(recording: Recording) {
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

	function downloadRecording(id: string) {
		console.log('Download recording:', id);
	}

	function formatDate(date: Date): string {
		return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
	}

	function formatTime(seconds: number): string {
		if (isNaN(seconds)) return '0:00';
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	// Svelte action to initialize waveform
	function initWaveform(node: HTMLElement, params: { id: string; audioSrc: string }) {
		const container = node.querySelector(`#waveform-${params.id}`) as HTMLElement;

		// Initialize with a small delay to ensure DOM is ready
		setTimeout(() => {
			if (container) {
				initializeAudio(params.id, container, params.audioSrc);
			}
		}, 100);

		return {
			destroy() {
				// Clean up this specific instance
				if (wavesurfers[params.id]) {
					wavesurfers[params.id].destroy();
					delete wavesurfers[params.id];
				}
				if (howls[params.id]) {
					howls[params.id].unload();
					delete howls[params.id];
				}
			}
		};
	}

	onDestroy(() => {
		// Clean up all WaveSurfer and Howler instances
		Object.values(wavesurfers).forEach(ws => ws.destroy());
		Object.values(howls).forEach(h => h.unload());
	});
</script>

<svelte:head>
	<title>Messages - Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main content -->
	<main class="flex-1 overflow-y-auto">
		<div class="p-8">
			<div class="max-w-7xl mx-auto">
				<div class="flex items-center justify-between mb-8">
					<h1 class="text-3xl font-bold text-gray-900">Messages Audio</h1>

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
						<div class="relative">
							<select
								bind:value={sortBy}
								class="px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 appearance-none"
							>
								<option value="date">Trier par date</option>
								<option value="duration">Trier par durée</option>
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
							on:click={() => activeTab = 'recent'}
							class="flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 {activeTab === 'recent' ? 'border-teal-500 text-teal-600 bg-gray-50' : 'border-transparent text-gray-600 hover:text-gray-900'}"
						>
							Recent Files
						</button>
						<button
							on:click={() => activeTab = 'mid'}
							class="flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 {activeTab === 'mid' ? 'border-teal-500 text-teal-600 bg-gray-50' : 'border-transparent text-gray-600 hover:text-gray-900'}"
						>
							Mid Files
						</button>
						<button
							on:click={() => activeTab = 'old'}
							class="flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 {activeTab === 'old' ? 'border-teal-500 text-teal-600 bg-gray-50' : 'border-transparent text-gray-600 hover:text-gray-900'}"
						>
							Old Files
						</button>
					</div>

					<!-- Content -->
					<div class="p-6">
						{#if filteredRecordings.length === 0}
							<div class="text-center py-12">
								<svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
								</svg>
								<p class="text-gray-500">Aucun enregistrement trouvé</p>
							</div>
						{:else}
							<div class="space-y-3">
								{#each filteredRecordings as recording (recording.id)}
									<div class="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors group">
										<!-- Play button -->
										<button
											on:click={() => togglePlay(recording.id)}
											class="w-12 h-12 rounded-full bg-teal-500 hover:bg-teal-600 flex items-center justify-center flex-shrink-0 transition-colors"
										>
											{#if playingId === recording.id}
												<!-- Pause icon -->
												<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
													<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
												</svg>
											{:else}
												<!-- Play icon -->
												<svg class="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
													<path d="M8 5v14l11-7z" />
												</svg>
											{/if}
										</button>

										<!-- Waveform container -->
										<div class="flex-1 min-w-0">
											<a href="/" class="text-teal-600 hover:text-teal-700 font-medium text-sm mb-2 block truncate">
												{recording.title}
											</a>
											<div class="flex items-center gap-3">
												<!-- WaveSurfer waveform -->
												<div
													class="flex-1"
													use:initWaveform={{ id: recording.id, audioSrc: recording.audioSrc }}
												>
													<div id="waveform-{recording.id}" class="w-full"></div>
												</div>
												<span class="text-xs text-gray-500 tabular-nums">
													{formatTime(currentTimes[recording.id] || 0)} / {formatTime(durations[recording.id] || 0)}
												</span>
											</div>
										</div>

										<!-- Actions -->
										<div class="flex items-center gap-2">
											<!-- Download -->
											<button
												on:click={() => downloadRecording(recording.id)}
												class="p-2 hover:bg-gray-200 rounded-lg transition-colors"
												title="Télécharger"
											>
												<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
												</svg>
											</button>

											<!-- Delete -->
											<button
												on:click={() => openDeleteModal(recording)}
												class="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
											>
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
												</svg>
												<span class="text-sm font-medium">Supprimer</span>
											</button>

											<!-- Days left -->
											<span class="text-sm text-gray-400 ml-2 tabular-nums">{recording.daysLeft} days left</span>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<!-- Stats card en bas -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-2">Total des enregistrements</h3>
						<p class="text-4xl font-bold text-gray-900">{recordings.length}</p>
					</div>

					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-2">Stockage utilisé</h3>
						<p class="text-4xl font-bold text-gray-900">2.4 GB</p>
					</div>

					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-sm text-gray-500 mb-2">Expiration proche</h3>
						<p class="text-4xl font-bold text-orange-600">{recordings.filter(r => r.daysLeft <= 7).length}</p>
					</div>
				</div>
			</div>
		</div>
	</main>

	<!-- Delete Modal -->
	<DeleteModal
		bind:isOpen={showDeleteModal}
		title="Supprimer l'enregistrement"
		message={recordingToDelete ? `Êtes-vous sûr de vouloir supprimer "${recordingToDelete.title}" ? Cette action est irréversible.` : ''}
		on:confirm={confirmDelete}
	/>
</div>

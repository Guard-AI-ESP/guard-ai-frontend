<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import { Search, Play, Download, Trash2, Eye, Video } from '@lucide/svelte';

	type RecordingCategory = 'recent' | 'motion' | 'manual';

	type VideoRecording = {
		id: string;
		camera: string;
		date: Date;
		duration: string;
		size: string;
		category: RecordingCategory;
		hasMotion: boolean;
	};

	let activeTab = $state<'all' | RecordingCategory>('all');
	let searchQuery = $state('');
	let dateFilter = $state('');
	let sortBy = $state('date');
	let showDeleteModal = $state(false);
	let recordingToDelete = $state<VideoRecording | null>(null);

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

	const filteredRecordings = $derived(
		recordings
			.filter(rec => {
				if (activeTab !== 'all' && rec.category !== activeTab) return false;
				if (searchQuery && !rec.camera.toLowerCase().includes(searchQuery.toLowerCase())) return false;
				if (dateFilter && rec.date.toISOString().split('T')[0] !== dateFilter) return false;
				return true;
			})
			.sort((a, b) => {
				if (sortBy === 'date') return b.date.getTime() - a.date.getTime();
				if (sortBy === 'duration') return parseInt(b.duration) - parseInt(a.duration);
				if (sortBy === 'size') return parseInt(b.size) - parseInt(a.size);
				return 0;
			})
	);

	const last24hCount = $derived(() => {
		const dayAgo = new Date();
		dayAgo.setDate(dayAgo.getDate() - 1);
		return recordings.filter(r => r.date > dayAgo).length;
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
		recordingToDelete = null;
	}

	const tabs: { id: 'all' | RecordingCategory; label: string }[] = [
		{ id: 'all', label: 'Tous' },
		{ id: 'recent', label: 'Récents' },
		{ id: 'motion', label: 'Mouvement' },
		{ id: 'manual', label: 'Manuels' },
	];

	const categoryLabel: Record<RecordingCategory, string> = {
		motion: 'Mouvement',
		manual: 'Manuel',
		recent: 'Récent',
	};
</script>

<svelte:head>
	<title>Enregistrements - Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<Sidebar />

	<main class="flex-1 overflow-y-auto">
		<div class="p-8 max-w-7xl mx-auto">

			<!-- Header -->
			<div class="flex flex-wrap items-center justify-between gap-4 mb-8">
				<h1 class="text-2xl font-semibold text-foreground">Enregistrements vidéo</h1>

				<div class="flex items-center gap-3 flex-wrap">
					<div class="relative">
						<Search class="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
						<Input
							type="text"
							bind:value={searchQuery}
							placeholder="Rechercher une caméra..."
							class="pl-9 w-52"
						/>
					</div>

					<Input
						type="date"
						bind:value={dateFilter}
						class="w-44"
					/>

					<select
						bind:value={sortBy}
						class="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
					>
						<option value="date">Par date</option>
						<option value="duration">Par durée</option>
						<option value="size">Par taille</option>
					</select>
				</div>
			</div>

			<!-- Tabs + recordings -->
			<Card.Root class="mb-6">
				<!-- Tabs -->
				<div class="flex border-b border-border">
					{#each tabs as tab}
						<button
							onclick={() => (activeTab = tab.id)}
							class="flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 {activeTab === tab.id
								? 'border-primary text-primary bg-muted/30'
								: 'border-transparent text-muted-foreground hover:text-foreground'}"
						>
							{tab.label}
						</button>
					{/each}
				</div>

				<Card.Content class="p-6">
					{#if filteredRecordings.length === 0}
						<div class="text-center py-16 text-muted-foreground">
							<Video class="w-14 h-14 mx-auto mb-3 opacity-30" />
							<p class="text-sm">Aucun enregistrement trouvé</p>
						</div>
					{:else}
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{#each filteredRecordings as recording (recording.id)}
								<div class="border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow group bg-card">
									<!-- Thumbnail -->
									<div class="relative aspect-video bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
										<button
											onclick={() => console.log('Play recording:', recording.id)}
											class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors"
										>
											<div class="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
												<Play class="w-7 h-7 text-gray-900 ml-0.5" />
											</div>
										</button>

										{#if recording.hasMotion}
											<div class="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full text-xs font-semibold">
												Mouvement
											</div>
										{/if}

										<div class="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded text-xs font-semibold">
											{recording.duration}
										</div>
									</div>

									<!-- Info -->
									<div class="p-4">
										<div class="flex items-start justify-between mb-2">
											<div class="flex-1 min-w-0">
												<p class="text-sm font-semibold text-foreground truncate">{recording.camera}</p>
												<p class="text-xs text-muted-foreground">{formatDate(recording.date)} · {formatTime(recording.date)}</p>
											</div>
											<button
												onclick={() => console.log('View camera:', recording.camera)}
												class="p-1.5 hover:bg-muted rounded-md transition-colors ml-2 text-muted-foreground hover:text-foreground"
												title="Voir la caméra"
											>
												<Eye class="w-4 h-4" />
											</button>
										</div>

										<div class="flex items-center justify-between mb-3">
											<span class="text-xs text-muted-foreground">{recording.size}</span>
											<Badge variant="secondary" class="text-[10px]">{categoryLabel[recording.category]}</Badge>
										</div>

										<div class="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												class="flex-1 text-xs"
												onclick={() => console.log('Download:', recording.id)}
											>
												<Download class="w-3.5 h-3.5 mr-1" /> Télécharger
											</Button>
											<Button
												variant="outline"
												size="sm"
												class="text-destructive hover:text-destructive hover:bg-destructive/10"
												onclick={() => openDeleteModal(recording)}
											>
												<Trash2 class="w-3.5 h-3.5" />
											</Button>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</Card.Content>
			</Card.Root>

			<!-- Stats -->
			<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{#each [
					{ label: 'Total', value: recordings.length, color: 'text-foreground' },
					{ label: 'Mouvement', value: recordings.filter(r => r.category === 'motion').length, color: 'text-destructive' },
					{ label: 'Stockage', value: '3.2 GB', color: 'text-blue-600' },
					{ label: 'Dernières 24h', value: last24hCount(), color: 'text-primary' },
				] as stat}
					<Card.Root>
						<Card.Header class="pb-2">
							<Card.Description>{stat.label}</Card.Description>
						</Card.Header>
						<Card.Content>
							<p class="text-4xl font-bold tracking-tight {stat.color}">{stat.value}</p>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>

		</div>
	</main>
</div>

<DeleteModal
	bind:open={showDeleteModal}
	title="Supprimer l'enregistrement"
	message={recordingToDelete
		? `Êtes-vous sûr de vouloir supprimer l'enregistrement de la ${recordingToDelete.camera} du ${formatDate(recordingToDelete.date)} ? Cette action est irréversible.`
		: ''}
	onConfirm={confirmDelete}
/>

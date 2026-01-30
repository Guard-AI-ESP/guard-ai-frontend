<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DateTimePicker from '$lib/components/DateTimePicker.svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	type Event = {
		id: string;
		title: string;
		start: Date;
		end: Date;
		description: string;
		settings: {
			disableNotification: boolean;
			disableCamera: boolean;
			disableAI: boolean;
		};
	};

	let events: Event[] = [];
	let showPopup = false;
	let editingIndex: number | null = null;

	// Form fields
	let eventTitle = '';
	let eventStart = '';
	let eventEnd = '';
	let eventDescription = '';
	let disableNotification = false;
	let disableCamera = false;
	let disableAI = false;

	function openPopup(index: number | null = null) {
		if (index !== null) {
			// Edit mode
			const event = events[index];
			editingIndex = index;
			eventTitle = event.title;
			eventStart = formatDateTimeLocal(event.start);
			eventEnd = formatDateTimeLocal(event.end);
			eventDescription = event.description;
			disableNotification = event.settings.disableNotification;
			disableCamera = event.settings.disableCamera;
			disableAI = event.settings.disableAI;
		} else {
			// New event mode
			resetForm();
		}
		showPopup = true;
	}

	function closePopup() {
		showPopup = false;
		resetForm();
	}

	function resetForm() {
		editingIndex = null;
		eventTitle = '';
		eventStart = '';
		eventEnd = '';
		eventDescription = '';
		disableNotification = false;
		disableCamera = false;
		disableAI = false;
	}

	function formatDateTimeLocal(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	function formatDate(date: Date): string {
		return date.toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString('fr-FR', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function handleSubmit(e: Event) {
		e.preventDefault();

		const newEvent: Event = {
			id: editingIndex !== null ? events[editingIndex].id : Date.now().toString(),
			title: eventTitle,
			start: new Date(eventStart),
			end: new Date(eventEnd),
			description: eventDescription,
			settings: {
				disableNotification,
				disableCamera,
				disableAI
			}
		};

		if (editingIndex !== null) {
			// Update existing event
			events[editingIndex] = newEvent;
			events = [...events];
		} else {
			// Add new event
			events = [...events, newEvent];
		}

		closePopup();
	}

	function deleteEvent(index: number) {
		if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
			events = events.filter((_, i) => i !== index);
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closePopup();
		}
	}
</script>

<svelte:head>
	<title>Nouvel événement - Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main content -->
	<main class="flex-1 overflow-y-auto">
		<div class="p-8">
			<div class="max-w-7xl mx-auto">
				<div class="flex items-center justify-between mb-8">
					<h1 class="text-3xl font-bold text-gray-900">Gestion des événements</h1>
				</div>

				<!-- No events state -->
				{#if events.length === 0}
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
						<div class="text-center">
							<div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 mb-4">
								<svg class="h-8 w-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>
							<h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun événement</h3>
							<p class="text-gray-500 mb-6">Vous n'avez aucun événement planifié pour le moment</p>
							<button
								on:click={() => openPopup()}
								class="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
								</svg>
								Ajouter un événement
							</button>
						</div>
					</div>
				{:else}
					<!-- Events list -->
					<div class="mb-6">
						<button
							on:click={() => openPopup()}
							class="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
							</svg>
							Nouvel événement
						</button>
					</div>

					<div class="space-y-4">
						{#each events as event, index (event.id)}
							<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<h3 class="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
										<p class="text-sm text-gray-600 mb-4">{event.description}</p>

										<div class="flex items-center gap-6 text-sm text-gray-500 mb-4">
											<div class="flex items-center gap-2">
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
												</svg>
												<span>{formatDate(event.start)}</span>
											</div>
											<div class="flex items-center gap-2">
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
												<span>{formatTime(event.start)} - {formatTime(event.end)}</span>
											</div>
										</div>

										<!-- Settings badges -->
										{#if event.settings.disableNotification || event.settings.disableCamera || event.settings.disableAI}
											<div class="flex flex-wrap gap-2">
												{#if event.settings.disableNotification}
													<span class="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
														🔕 Notifications désactivées
													</span>
												{/if}
												{#if event.settings.disableCamera}
													<span class="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
														📹 Caméra désactivée
													</span>
												{/if}
												{#if event.settings.disableAI}
													<span class="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
														🤖 IA désactivée
													</span>
												{/if}
											</div>
										{/if}
									</div>

									<!-- Actions -->
									<div class="flex items-center gap-2 ml-4">
										<button
											on:click={() => openPopup(index)}
											class="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
											title="Modifier"
										>
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
											</svg>
										</button>
										<button
											on:click={() => deleteEvent(index)}
											class="p-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
											title="Supprimer"
										>
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
	</main>
</div>

<!-- Event Popup -->
{#if showPopup}
	<div
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
		on:click={handleBackdropClick}
		role="presentation"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
			role="dialog"
			aria-modal="true"
			transition:scale={{ duration: 200, start: 0.95, easing: cubicOut }}
		>
			<!-- Header -->
			<div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
				<h2 class="text-xl font-semibold text-gray-900">
					{editingIndex !== null ? 'Modifier l\'événement' : 'Ajouter un événement'}
				</h2>
				<button
					on:click={closePopup}
					class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Form -->
			<form on:submit={handleSubmit} class="p-6 space-y-5">
				<!-- Title -->
				<div>
					<label for="event-title" class="block text-sm font-medium text-gray-700 mb-2">
						Titre de l'événement
					</label>
					<input
						type="text"
						id="event-title"
						bind:value={eventTitle}
						required
						class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
						placeholder="Ex: Réunion de famille"
					/>
				</div>

				<!-- Start date -->
				<DateTimePicker
					bind:value={eventStart}
					label="Début de l'événement"
					id="event-start"
					required
				/>

				<!-- End date -->
				<DateTimePicker
					bind:value={eventEnd}
					label="Fin de l'événement"
					id="event-end"
					required
				/>

				<!-- Description -->
				<div>
					<label for="event-description" class="block text-sm font-medium text-gray-700 mb-2">
						Description
					</label>
					<textarea
						id="event-description"
						bind:value={eventDescription}
						required
						rows="4"
						class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 resize-none"
						placeholder="Décrivez votre événement..."
					></textarea>
				</div>

				<!-- Settings -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-3">
						Paramètres
					</label>
					<div class="space-y-3">
						<label class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
							<input
								type="checkbox"
								bind:checked={disableNotification}
								class="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
							/>
							<div class="flex-1">
								<span class="text-sm font-medium text-gray-900">Désactiver les notifications</span>
								<p class="text-xs text-gray-500">Aucune notification ne sera envoyée pendant cet événement</p>
							</div>
						</label>

						<label class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
							<input
								type="checkbox"
								bind:checked={disableCamera}
								class="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
							/>
							<div class="flex-1">
								<span class="text-sm font-medium text-gray-900">Désactiver la caméra</span>
								<p class="text-xs text-gray-500">Les caméras ne seront pas actives pendant cet événement</p>
							</div>
						</label>

						<label class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
							<input
								type="checkbox"
								bind:checked={disableAI}
								class="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
							/>
							<div class="flex-1">
								<span class="text-sm font-medium text-gray-900">Désactiver l'IA</span>
								<p class="text-xs text-gray-500">La détection intelligente sera désactivée pendant cet événement</p>
							</div>
						</label>
					</div>
				</div>

				<!-- Actions -->
				<div class="flex gap-3 pt-4">
					<button
						type="button"
						on:click={closePopup}
						class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
					>
						Annuler
					</button>
					<button
						type="submit"
						class="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
					>
						{editingIndex !== null ? 'Mettre à jour' : 'Enregistrer'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

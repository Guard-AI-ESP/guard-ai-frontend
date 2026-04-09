<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DateTimePicker from '$lib/components/DateTimePicker.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Plus, CalendarDays, Clock, Pencil, Trash2, BellOff, CameraOff, BrainCircuit } from '@lucide/svelte';

	type GuardEvent = {
		id: string;
		title: string;
		start: Date;
		end: Date;
		description: string;
		settings: { disableNotification: boolean; disableCamera: boolean; disableAI: boolean };
	};

	let events = $state<GuardEvent[]>([]);
	let showPopup = $state(false);
	let editingIndex = $state<number | null>(null);
	let deleteModalOpen = $state(false);
	let deleteTargetIndex = $state<number | null>(null);

	let eventTitle = $state('');
	let eventStart = $state('');
	let eventEnd = $state('');
	let eventDescription = $state('');
	let disableNotification = $state(false);
	let disableCamera = $state(false);
	let disableAI = $state(false);

	function openPopup(index: number | null = null) {
		if (index !== null) {
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
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
	}

	function formatDate(date: Date): string {
		return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const newEvent: GuardEvent = {
			id: editingIndex !== null ? events[editingIndex].id : Date.now().toString(),
			title: eventTitle,
			start: new Date(eventStart),
			end: new Date(eventEnd),
			description: eventDescription,
			settings: { disableNotification, disableCamera, disableAI }
		};
		if (editingIndex !== null) {
			events[editingIndex] = newEvent;
			events = [...events];
		} else {
			events = [...events, newEvent];
		}
		closePopup();
	}

	function confirmDelete(index: number) {
		deleteTargetIndex = index;
		deleteModalOpen = true;
	}
</script>

<svelte:head>
	<title>Événements - Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<Sidebar />

	<main class="flex-1 overflow-y-auto">
		<div class="p-8 max-w-7xl mx-auto">

			<div class="flex items-center justify-between mb-8">
				<h1 class="text-2xl font-semibold text-foreground">Gestion des événements</h1>
				{#if events.length > 0}
					<Button onclick={() => openPopup()}>
						<Plus class="w-4 h-4 mr-1.5" /> Nouvel événement
					</Button>
				{/if}
			</div>

			{#if events.length === 0}
				<!-- Empty state -->
				<Card.Root>
					<Card.Content class="flex flex-col items-center justify-center py-16">
						<div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
							<CalendarDays class="w-7 h-7 text-primary" />
						</div>
						<h3 class="text-base font-semibold text-foreground mb-1">Aucun événement</h3>
						<p class="text-sm text-muted-foreground mb-6">Vous n'avez aucun événement planifié pour le moment</p>
						<Button onclick={() => openPopup()}>
							<Plus class="w-4 h-4 mr-1.5" /> Ajouter un événement
						</Button>
					</Card.Content>
				</Card.Root>
			{:else}
				<div class="space-y-3">
					{#each events as event, index (event.id)}
						<Card.Root class="hover:shadow-md transition-shadow">
							<Card.Content class="p-6">
								<div class="flex items-start justify-between gap-4">
									<div class="flex-1 min-w-0">
										<h3 class="text-base font-semibold text-foreground mb-1">{event.title}</h3>
										<p class="text-sm text-muted-foreground mb-3">{event.description}</p>

										<div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
											<span class="flex items-center gap-1.5">
												<CalendarDays class="w-3.5 h-3.5" />
												{formatDate(event.start)}
											</span>
											<span class="flex items-center gap-1.5">
												<Clock class="w-3.5 h-3.5" />
												{formatTime(event.start)} – {formatTime(event.end)}
											</span>
										</div>

										{#if event.settings.disableNotification || event.settings.disableCamera || event.settings.disableAI}
											<div class="flex flex-wrap gap-1.5">
												{#if event.settings.disableNotification}
													<Badge variant="outline" class="gap-1 border-orange-200 text-orange-700 bg-orange-50 text-xs">
														<BellOff class="w-3 h-3" /> Notifications off
													</Badge>
												{/if}
												{#if event.settings.disableCamera}
													<Badge variant="outline" class="gap-1 border-red-200 text-red-700 bg-red-50 text-xs">
														<CameraOff class="w-3 h-3" /> Caméra off
													</Badge>
												{/if}
												{#if event.settings.disableAI}
													<Badge variant="outline" class="gap-1 border-purple-200 text-purple-700 bg-purple-50 text-xs">
														<BrainCircuit class="w-3 h-3" /> IA off
													</Badge>
												{/if}
											</div>
										{/if}
									</div>

									<div class="flex items-center gap-1 shrink-0">
										<Button variant="ghost" size="icon" onclick={() => openPopup(index)} title="Modifier">
											<Pencil class="w-4 h-4" />
										</Button>
										<Button variant="ghost" size="icon" class="text-muted-foreground hover:text-destructive" onclick={() => confirmDelete(index)} title="Supprimer">
											<Trash2 class="w-4 h-4" />
										</Button>
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			{/if}
		</div>
	</main>
</div>

<!-- Event Dialog -->
<Dialog.Root bind:open={showPopup}>
	<Dialog.Content class="max-w-2xl max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>
				{editingIndex !== null ? "Modifier l'événement" : 'Ajouter un événement'}
			</Dialog.Title>
		</Dialog.Header>

		<form id="event-form" onsubmit={handleSubmit} class="space-y-5 py-2">
			<div class="space-y-1.5">
				<Label for="event-title">Titre de l'événement</Label>
				<Input
					type="text"
					id="event-title"
					bind:value={eventTitle}
					placeholder="Ex: Réunion de famille"
					required
				/>
			</div>

			<DateTimePicker bind:value={eventStart} label="Début de l'événement" id="event-start" required />
			<DateTimePicker bind:value={eventEnd} label="Fin de l'événement" id="event-end" required />

			<div class="space-y-1.5">
				<Label for="event-description">Description</Label>
				<textarea
					id="event-description"
					bind:value={eventDescription}
					required
					rows="3"
					placeholder="Décrivez votre événement..."
					class="w-full px-3 py-2 border border-input bg-background text-foreground text-sm rounded-md
					       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 resize-none transition-colors"
				></textarea>
			</div>

			<div class="space-y-1.5">
				<Label>Paramètres</Label>
				<div class="space-y-2">
					{#each [
						{ key: 'disableNotification', label: 'Désactiver les notifications', desc: 'Aucune notification pendant cet événement' },
						{ key: 'disableCamera', label: 'Désactiver la caméra', desc: 'Les caméras ne seront pas actives' },
						{ key: 'disableAI', label: "Désactiver l'IA", desc: 'La détection intelligente sera désactivée' }
					] as setting}
						<label class="flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
							<input
								type="checkbox"
								checked={setting.key === 'disableNotification' ? disableNotification : setting.key === 'disableCamera' ? disableCamera : disableAI}
								onchange={(e) => {
									const val = (e.target as HTMLInputElement).checked;
									if (setting.key === 'disableNotification') disableNotification = val;
									else if (setting.key === 'disableCamera') disableCamera = val;
									else disableAI = val;
								}}
								class="mt-0.5 h-4 w-4 rounded border-input accent-primary"
							/>
							<div>
								<p class="text-sm font-medium text-foreground">{setting.label}</p>
								<p class="text-xs text-muted-foreground">{setting.desc}</p>
							</div>
						</label>
					{/each}
				</div>
			</div>
		</form>

		<Dialog.Footer>
			<Button variant="outline" onclick={closePopup}>Annuler</Button>
			<Button type="submit" form="event-form">
				{editingIndex !== null ? 'Mettre à jour' : 'Enregistrer'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete Confirmation -->
<DeleteModal
	bind:open={deleteModalOpen}
	title="Supprimer l'événement"
	message="Cet événement sera définitivement supprimé. Cette action est irréversible."
	onConfirm={() => {
		if (deleteTargetIndex !== null) {
			events = events.filter((_, i) => i !== deleteTargetIndex);
			deleteTargetIndex = null;
		}
	}}
/>

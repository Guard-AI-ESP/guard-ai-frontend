<script lang="ts">
	import { onMount } from 'svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Users, Trash2, RefreshCw, UserX, Clock } from '@lucide/svelte';
	import { fetchPersons, deletePerson } from '$lib/api/persons';
	import type { Person } from '$lib/types/person';

	let persons = $state<Person[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let deletingId = $state<string | null>(null);
	let personToDelete = $state<Person | null>(null);

	async function load() {
		loading = true;
		error = null;
		try {
			persons = await fetchPersons();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Erreur de chargement';
		} finally {
			loading = false;
		}
	}

	async function confirmDelete() {
		if (!personToDelete) return;
		deletingId = personToDelete.id;
		try {
			await deletePerson(personToDelete.id);
			persons = persons.filter(p => p.id !== personToDelete!.id);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Erreur de suppression';
		} finally {
			deletingId = null;
			personToDelete = null;
		}
	}

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString('fr-FR', {
			day: 'numeric', month: 'long', year: 'numeric',
			hour: '2-digit', minute: '2-digit'
		});
	}

	/** Initiales depuis le nom (ex: "Alice Martin" → "AM") */
	function initials(name: string): string {
		return name
			.split(' ')
			.map(w => w[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	/** Couleur d'avatar déterministe depuis le nom */
	function avatarColor(name: string): string {
		const colors = [
			'bg-blue-100 text-blue-700',
			'bg-green-100 text-green-700',
			'bg-purple-100 text-purple-700',
			'bg-orange-100 text-orange-700',
			'bg-pink-100 text-pink-700',
			'bg-teal-100 text-teal-700',
		];
		const index = name.charCodeAt(0) % colors.length;
		return colors[index];
	}

	onMount(load);
</script>

<svelte:head>
	<title>Personnes — Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<Sidebar />

	<main class="flex-1 overflow-y-auto">
		<div class="p-8 max-w-5xl mx-auto">

			<!-- Header -->
			<div class="flex items-center justify-between mb-8">
				<div>
					<h1 class="text-2xl font-semibold text-foreground">Personnes connues</h1>
					<p class="text-sm text-muted-foreground mt-1">
						Base de visages enregistrés dans le système de reconnaissance
					</p>
				</div>
				<div class="flex items-center gap-2">
					<Badge variant="outline" class="gap-1.5">
						<Users class="w-3.5 h-3.5" />
						{persons.length} personne{persons.length !== 1 ? 's' : ''}
					</Badge>
					<Button variant="outline" size="sm" onclick={load} disabled={loading}>
						<RefreshCw class="w-3.5 h-3.5 mr-1.5 {loading ? 'animate-spin' : ''}" />
						Actualiser
					</Button>
				</div>
			</div>

			<!-- Error banner -->
			{#if error}
				<div class="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
					<p class="text-destructive text-sm">{error}</p>
				</div>
			{/if}

			<!-- Loading -->
			{#if loading}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each [1, 2, 3, 4, 5, 6] as _}
						<Card.Root>
							<Card.Content class="p-5">
								<div class="flex items-center gap-4 animate-pulse">
									<div class="w-12 h-12 rounded-full bg-muted shrink-0"></div>
									<div class="flex-1 space-y-2">
										<div class="h-4 bg-muted rounded w-3/4"></div>
										<div class="h-3 bg-muted rounded w-1/2"></div>
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>

			<!-- Empty state -->
			{:else if persons.length === 0}
				<Card.Root>
					<Card.Content class="py-16">
						<div class="text-center">
							<div class="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
								<UserX class="w-7 h-7 text-muted-foreground" />
							</div>
							<h3 class="text-base font-medium text-foreground mb-1">Aucune personne enregistrée</h3>
							<p class="text-sm text-muted-foreground max-w-sm mx-auto">
								Les visages enregistrés via le POC de reconnaissance faciale apparaîtront ici automatiquement.
							</p>
							<p class="text-xs text-muted-foreground mt-3 font-mono bg-muted inline-block px-3 py-1.5 rounded">
								python main.py → ESPACE pour capturer
							</p>
						</div>
					</Card.Content>
				</Card.Root>

			<!-- Persons grid -->
			{:else}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each persons as person (person.id)}
						<Card.Root class="group hover:shadow-md transition-shadow">
							<Card.Content class="p-5">
								<div class="flex items-start gap-4">

									<!-- Avatar -->
									<div class="w-12 h-12 rounded-full {avatarColor(person.name)} flex items-center justify-center text-sm font-semibold shrink-0">
										{initials(person.name)}
									</div>

									<!-- Info -->
									<div class="flex-1 min-w-0">
										<p class="text-sm font-semibold text-foreground truncate">{person.name}</p>

										<div class="flex items-center gap-1.5 mt-1">
											<Badge variant="secondary" class="text-xs px-1.5 py-0 h-5">
												{person.embedding.length} dims
											</Badge>
											<Badge variant="outline" class="text-xs px-1.5 py-0 h-5 text-green-700 border-green-200 bg-green-50">
												Actif
											</Badge>
										</div>

										<p class="text-xs text-muted-foreground mt-2 flex items-center gap-1">
											<Clock class="w-3 h-3 shrink-0" />
											{formatDate(person.created_at)}
										</p>
									</div>

									<!-- Delete button -->
									<button
										onclick={() => (personToDelete = person)}
										disabled={deletingId === person.id}
										class="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 rounded"
										aria-label="Supprimer {person.name}"
									>
										<Trash2 class="w-4 h-4 {deletingId === person.id ? 'animate-pulse' : ''}" />
									</button>
								</div>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			{/if}

		</div>
	</main>
</div>

<!-- Confirmation suppression -->
<Dialog.Root
	open={personToDelete !== null}
	onOpenChange={(open: boolean) => { if (!open) personToDelete = null; }}
>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Supprimer {personToDelete?.name} ?</Dialog.Title>
			<Dialog.Description>
				Cette personne sera retirée de la base de reconnaissance faciale.
				Les événements passés ne seront pas affectés.
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex justify-end gap-3 pt-4">
			<Button variant="outline" onclick={() => (personToDelete = null)}>
				Annuler
			</Button>
			<Button
				variant="destructive"
				onclick={confirmDelete}
				disabled={deletingId !== null}
			>
				Supprimer
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>

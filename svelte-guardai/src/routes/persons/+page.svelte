<script lang="ts">
	import { onMount } from 'svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
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

	function initials(name: string): string {
		return name
			.split(' ')
			.map(w => w[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

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
	<title>Personnes - Guard AI</title>
</svelte:head>

<!-- Page header -->
<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
	<div>
		<h1 class="text-2xl font-semibold text-slate-800">Personnes connues</h1>
		<p class="text-slate-400 text-sm mt-0.5">Base de visages enregistrés dans le système de reconnaissance</p>
	</div>
	<div class="flex items-center gap-3 shrink-0">
		<span class="flex items-center gap-1.5 text-sm text-slate-500">
			<span class="material-icons text-[18px]">people</span>
			{persons.length} personne{persons.length !== 1 ? 's' : ''}
		</span>
		<button
			onclick={load}
			disabled={loading}
			class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white border border-slate-200 text-slate-700 shadow-soft hover:border-slate-300 transition-colors disabled:opacity-50"
		>
			<span class="material-icons text-[18px] {loading ? 'animate-spin' : ''}">refresh</span>
			Actualiser
		</button>
	</div>
</div>

<!-- Error banner -->
{#if error}
	<div class="p-4 bg-red-50 border border-red-200 rounded-xl">
		<p class="text-red-600 text-sm">{error}</p>
	</div>
{/if}

<!-- Loading -->
{#if loading}
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each [1, 2, 3, 4, 5, 6] as _}
			<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-5">
				<div class="flex items-center gap-4 animate-pulse">
					<div class="w-12 h-12 rounded-full bg-slate-100 shrink-0"></div>
					<div class="flex-1 space-y-2">
						<div class="h-4 bg-slate-100 rounded w-3/4"></div>
						<div class="h-3 bg-slate-100 rounded w-1/2"></div>
					</div>
				</div>
			</div>
		{/each}
	</div>

<!-- Empty state -->
{:else if persons.length === 0}
	<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 py-16">
		<div class="text-center">
			<div class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
				<span class="material-icons text-[28px] text-slate-300">person_off</span>
			</div>
			<h3 class="text-base font-medium text-slate-800 mb-1">Aucune personne enregistrée</h3>
			<p class="text-sm text-slate-400 max-w-sm mx-auto">
				Les visages enregistrés via le POC de reconnaissance faciale apparaîtront ici automatiquement.
			</p>
		</div>
	</div>

<!-- Persons grid -->
{:else}
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each persons as person (person.id)}
			<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-5 group hover:shadow-md transition-shadow">
				<div class="flex items-start gap-4">
					<!-- Avatar -->
					<div class="w-12 h-12 rounded-full {avatarColor(person.name)} flex items-center justify-center text-sm font-semibold shrink-0">
						{initials(person.name)}
					</div>

					<!-- Info -->
					<div class="flex-1 min-w-0">
						<p class="text-sm font-semibold text-slate-800 truncate">{person.name}</p>

						<div class="flex items-center gap-1.5 mt-1">
							<span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
								{person.embedding.length} dims
							</span>
							<span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
								Actif
							</span>
						</div>

						<p class="text-xs text-slate-400 mt-2 flex items-center gap-1">
							<span class="material-icons text-[13px]">schedule</span>
							{formatDate(person.created_at)}
						</p>
					</div>

					<!-- Delete button -->
					<button
						onclick={() => (personToDelete = person)}
						disabled={deletingId === person.id}
						class="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500"
						aria-label="Supprimer {person.name}"
					>
						<span class="material-icons text-[16px] {deletingId === person.id ? 'animate-pulse' : ''}">delete_outline</span>
					</button>
				</div>
			</div>
		{/each}
	</div>
{/if}

<!-- Delete confirmation -->
{#if personToDelete}
	<DeleteModal
		label={personToDelete.name}
		onconfirm={confirmDelete}
		oncancel={() => (personToDelete = null)}
	/>
{/if}

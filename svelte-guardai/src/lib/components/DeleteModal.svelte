<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	export let isOpen = false;
	export let title = 'Confirmer la suppression';
	export let message = 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.';
	export let confirmText = 'Supprimer';
	export let cancelText = 'Annuler';

	const dispatch = createEventDispatcher();

	function handleConfirm() {
		dispatch('confirm');
		close();
	}

	function handleCancel() {
		dispatch('cancel');
		close();
	}

	function close() {
		isOpen = false;
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			handleCancel();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			handleCancel();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
		on:click={handleBackdropClick}
		role="presentation"
		transition:fade={{ duration: 200 }}
	>
		<!-- Modal -->
		<div
			class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			transition:scale={{ duration: 200, start: 0.95, easing: cubicOut }}
		>
			<!-- Icon -->
			<div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
				<svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
			</div>

			<!-- Title -->
			<h3 id="modal-title" class="text-lg font-semibold text-gray-900 text-center mb-2">
				{title}
			</h3>

			<!-- Message -->
			<p class="text-sm text-gray-500 text-center mb-6">
				{message}
			</p>

			<!-- Actions -->
			<div class="flex gap-3">
				<button
					on:click={handleCancel}
					class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
				>
					{cancelText}
				</button>
				<button
					on:click={handleConfirm}
					class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
				>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}

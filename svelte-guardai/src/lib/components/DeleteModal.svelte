<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { TriangleAlert } from '@lucide/svelte';

	let {
		open = $bindable(false),
		title = 'Confirmer la suppression',
		message = 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
		confirmText = 'Supprimer',
		cancelText = 'Annuler',
		onConfirm,
		onCancel
	}: {
		open: boolean;
		title?: string;
		message?: string;
		confirmText?: string;
		cancelText?: string;
		onConfirm?: () => void;
		onCancel?: () => void;
	} = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-sm">
		<Dialog.Header>
			<div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 mb-2">
				<TriangleAlert class="h-6 w-6 text-destructive" />
			</div>
			<Dialog.Title class="text-center">{title}</Dialog.Title>
			<Dialog.Description class="text-center">{message}</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="flex gap-3 sm:gap-3">
			<Button
				variant="outline"
				class="flex-1"
				onclick={() => { open = false; onCancel?.(); }}
			>
				{cancelText}
			</Button>
			<Button
				variant="destructive"
				class="flex-1"
				onclick={() => { open = false; onConfirm?.(); }}
			>
				{confirmText}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

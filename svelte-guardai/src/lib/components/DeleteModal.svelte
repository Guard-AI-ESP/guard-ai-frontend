<script lang="ts">
	type Props = {
		label?: string;
		onconfirm: () => void;
		oncancel: () => void;
	};

	let { label = 'cet élément', onconfirm, oncancel }: Props = $props();

	let visible = $state(false);

	$effect(() => {
		requestAnimationFrame(() => visible = true);
	});

	function confirm() {
		visible = false;
		setTimeout(onconfirm, 200);
	}

	function cancel() {
		visible = false;
		setTimeout(oncancel, 200);
	}
</script>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape') cancel(); }} />

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center p-4"
	style="transition: opacity 0.2s ease; opacity: {visible ? 1 : 0};"
	onclick={(e) => { if (e.target === e.currentTarget) cancel(); }}
>
	<div class="absolute inset-0 bg-black/40 backdrop-blur-sm" style="pointer-events: none;"></div>

	<div
		class="relative bg-white rounded-[20px] shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5"
		style="transition: transform 0.2s ease, opacity 0.2s ease; transform: {visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)'}; opacity: {visible ? 1 : 0};"
	>
		<div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
			<span class="material-icons text-[24px] text-red-500">delete_outline</span>
		</div>

		<div class="text-center">
			<p class="text-base font-semibold text-slate-800">Confirmer la suppression</p>
			<p class="text-sm text-slate-400 mt-1">Voulez-vous vraiment supprimer <span class="font-medium text-slate-600">{label}</span> ? Cette action est irréversible.</p>
		</div>

		<div class="flex gap-3">
			<button
				onclick={cancel}
				class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
			>Annuler</button>
			<button
				onclick={confirm}
				class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/25 transition-all"
			>Supprimer</button>
		</div>
	</div>
</div>

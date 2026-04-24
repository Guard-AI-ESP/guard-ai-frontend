<script lang="ts">
	import { tick } from 'svelte';

	type Tab = {
		value: string;
		label: string;
		icon?: string;
	};

	type Props = {
		tabs: Tab[];
		active: string;
		onchange: (value: string) => void;
		stretch?: boolean;
	};

	let props: Props = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let pillLeft = $state(0);
	let pillWidth = $state(0);
	let ready = $state(false);

	function updatePill() {
		if (!containerEl) return;
		const btn = containerEl.querySelector(`[data-tab-value="${CSS.escape(props.active)}"]`) as HTMLElement | null;
		if (!btn) return;
		pillLeft = btn.offsetLeft;
		pillWidth = btn.offsetWidth;
		if (!ready) ready = true;
	}

	$effect(() => {
		props.active;
		tick().then(updatePill);
	});
</script>

<div
	bind:this={containerEl}
	class="relative flex gap-1 bg-white rounded-2xl p-1.5 shadow-soft border border-slate-100"
>
	{#if ready}
		<div
			class="absolute top-1.5 bottom-1.5 rounded-xl bg-primary shadow-md shadow-primary/25 transition-all duration-300 ease-out"
			style="left: {pillLeft}px; width: {pillWidth}px;"
		></div>
	{/if}

	{#each props.tabs as tab}
		<button
			data-tab-value={tab.value}
			onclick={() => props.onchange(tab.value)}
			class="relative z-10 flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-colors duration-200
				{props.stretch ? 'flex-1' : ''}
				{props.active === tab.value ? 'text-white' : 'text-slate-500 hover:text-slate-800'}"
		>
			{#if tab.icon}
				<span class="material-icons text-[18px]">{tab.icon}</span>
			{/if}
			{tab.label}
		</button>
	{/each}
</div>

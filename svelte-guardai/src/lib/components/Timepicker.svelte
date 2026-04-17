<script lang="ts">
	import { browser } from '$app/environment';

	type Props = {
		value?: string;
		placeholder?: string;
		id?: string;
	};

	let { value = $bindable(''), placeholder = 'Heure', id }: Props = $props();

	let open = $state(false);
	let pickerEl: HTMLDivElement | undefined = $state();
	let hourCol: HTMLDivElement | undefined = $state();
	let minCol: HTMLDivElement | undefined = $state();

	const hours   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
	const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

	const selectedHour   = $derived(value ? value.split(':')[0] : '');
	const selectedMinute = $derived(value ? value.split(':')[1] : '');

	const displayValue = $derived(
		value ? `${selectedHour}:${selectedMinute}` : ''
	);

	function select(h: string, m: string) {
		value = `${h}:${m}`;
	}

	function selectHour(h: string) {
		const m = selectedMinute || '00';
		select(h, m);
	}

	function selectMinute(m: string) {
		const h = selectedHour || '00';
		select(h, m);
	}

	function toggle() {
		open = !open;
		if (open) {
			requestAnimationFrame(() => {
				scrollToSelected(hourCol, selectedHour);
				scrollToSelected(minCol, selectedMinute);
			});
		}
	}

	function scrollToSelected(col: HTMLDivElement | undefined, val: string) {
		if (!col || !val) return;
		const el = col.querySelector(`[data-value="${val}"]`) as HTMLElement | null;
		if (el) {
			col.scrollTop = el.offsetTop - col.offsetHeight / 2 + el.offsetHeight / 2;
		}
	}

	function handleClickOutside(e: MouseEvent) {
		if (pickerEl && !pickerEl.contains(e.target as Node)) {
			open = false;
		}
	}

	$effect(() => {
		if (!browser) return;
		if (open) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	});
</script>

<div class="relative" bind:this={pickerEl}>
	<button
		type="button"
		{id}
		onclick={toggle}
		class="flex items-center gap-2 w-full ps-3 pe-3 py-2.5 bg-white border border-slate-200 text-sm rounded-xl shadow-soft focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors cursor-pointer text-left
			{displayValue ? 'text-slate-700' : 'text-slate-400'}"
	>
		<span class="material-icons text-[16px] text-slate-400">schedule</span>
		<span class="flex-1">{displayValue || placeholder}</span>
		<span class="material-icons text-[14px] text-slate-400 transition-transform duration-200" style="transform: rotate({open ? '180deg' : '0deg'})">expand_more</span>
	</button>

	{#if open}
		<div class="absolute top-full left-0 mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden" style="min-width: 180px;">
			<div class="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
				<p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Heure</p>
				<p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Min</p>
			</div>

			<div class="flex divide-x divide-slate-100" style="height: 200px;">
				<div bind:this={hourCol} class="flex-1 overflow-y-auto py-1 scroll-smooth" style="scrollbar-width: thin;">
					{#each hours as h}
						<button
							type="button"
							data-value={h}
							onclick={() => selectHour(h)}
							class="w-full py-1.5 text-center text-sm font-medium transition-all rounded-lg mx-auto
								{selectedHour === h
									? 'bg-primary text-white'
									: 'text-slate-600 hover:bg-primary/10 hover:text-primary'}"
						>
							{h}
						</button>
					{/each}
				</div>

				<div bind:this={minCol} class="flex-1 overflow-y-auto py-1 scroll-smooth" style="scrollbar-width: thin;">
					{#each minutes as m}
						<button
							type="button"
							data-value={m}
							onclick={() => selectMinute(m)}
							class="w-full py-1.5 text-center text-sm font-medium transition-all rounded-lg mx-auto
								{selectedMinute === m
									? 'bg-primary text-white'
									: 'text-slate-600 hover:bg-primary/10 hover:text-primary'}"
						>
							{m}
						</button>
					{/each}
				</div>
			</div>

			<div class="px-3 py-2 border-t border-slate-100 flex justify-end">
				<button
					type="button"
					onclick={() => open = false}
					class="px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
				>
					OK
				</button>
			</div>
		</div>
	{/if}
</div>

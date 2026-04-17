<script lang="ts">
	let {
		checked = false,
		label = '',
		onchange,
	}: {
		checked?: boolean;
		label?: string;
		onchange?: (value: boolean) => void;
	} = $props();
</script>

<label class="relative inline-flex items-center cursor-pointer gap-3">
	<input
		type="checkbox"
		class="sr-only peer"
		checked={checked}
		onchange={(e) => onchange?.((e.target as HTMLInputElement).checked)}
	/>
	<div class="
		relative w-11 h-6 rounded-full transition-colors
		bg-slate-200 peer-checked:bg-primary
		after:content-[''] after:absolute after:top-[2px] after:start-[2px]
		after:w-5 after:h-5 after:rounded-full after:bg-white after:border after:border-slate-300
		after:transition-all
		peer-checked:after:translate-x-5 peer-checked:after:border-white
		peer-focus:ring-2 peer-focus:ring-primary/30
	"></div>
	{#if label}
		<span class="text-sm font-medium text-slate-600">{label}</span>
	{/if}
</label>

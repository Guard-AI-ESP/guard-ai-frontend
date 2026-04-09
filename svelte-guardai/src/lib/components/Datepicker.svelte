<script lang="ts">
	import { CalendarDays } from '@lucide/svelte';

	let {
		value = $bindable(''),
		placeholder = 'Sélectionner une date',
		label = '',
		id = `datepicker-${Math.random().toString(36).substring(2, 9)}`,
		required = false,
		minDate = undefined,
		maxDate = undefined
	}: {
		value?: string;
		placeholder?: string;
		label?: string;
		id?: string;
		required?: boolean;
		minDate?: string;
		maxDate?: string;
	} = $props();
</script>

<div class="w-full">
	{#if label}
		<label for={id} class="block text-sm font-medium text-foreground mb-1.5">
			{label}
		</label>
	{/if}
	<div class="relative">
		<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
			<CalendarDays class="w-4 h-4 text-muted-foreground" />
		</div>
		<input
			type="date"
			{id}
			bind:value
			{required}
			{placeholder}
			min={minDate}
			max={maxDate}
			class="w-full pl-10 pr-4 py-2 border border-input bg-background text-foreground text-sm rounded-md
			       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-colors
			       [color-scheme:light]"
		/>
	</div>
</div>

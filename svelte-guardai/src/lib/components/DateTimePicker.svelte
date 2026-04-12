<script lang="ts">
	import Datepicker from './Datepicker.svelte';
	import { Clock } from '@lucide/svelte';

	let {
		value = $bindable(''),
		label = '',
		id = `datetime-${Math.random().toString(36).substring(2, 9)}`,
		required = false
	}: {
		value?: string;
		label?: string;
		id?: string;
		required?: boolean;
	} = $props();

	let dateValue = $state('');
	let timeValue = $state('12:00');

	// Parse initial value
	if (value) {
		const [date, time] = value.split('T');
		if (date) dateValue = date;
		if (time) timeValue = time.substring(0, 5);
	}

	$effect(() => {
		if (dateValue && timeValue) {
			value = `${dateValue}T${timeValue}`;
		} else if (dateValue) {
			value = `${dateValue}T12:00`;
		} else {
			value = '';
		}
	});
</script>

<div class="w-full">
	{#if label}
		<label class="block text-sm font-medium text-foreground mb-1.5">
			{label}
			{#if required}<span class="text-destructive">*</span>{/if}
		</label>
	{/if}

	<div class="grid grid-cols-2 gap-3">
		<Datepicker
			bind:value={dateValue}
			placeholder="Sélectionner une date"
			id="{id}-date"
			{required}
		/>

		<div class="relative">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
				<Clock class="w-4 h-4 text-muted-foreground" />
			</div>
			<input
				type="time"
				id="{id}-time"
				bind:value={timeValue}
				{required}
				class="w-full pl-10 pr-4 py-2 border border-input bg-background text-foreground text-sm rounded-md
				       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-colors
				       [color-scheme:light]"
			/>
		</div>
	</div>
</div>

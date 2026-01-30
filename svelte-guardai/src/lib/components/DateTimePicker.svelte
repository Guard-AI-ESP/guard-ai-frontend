<script lang="ts">
	import Datepicker from './Datepicker.svelte';

	export let value = '';
	export let label = '';
	export let id = `datetime-${Math.random().toString(36).substr(2, 9)}`;
	export let required = false;
	export let placeholder = 'Sélectionner une date et heure';

	let dateValue = '';
	let timeValue = '12:00';

	// Parse initial value if provided
	if (value) {
		const [date, time] = value.split('T');
		if (date) dateValue = date;
		if (time) timeValue = time.substring(0, 5); // HH:MM
	}

	// Update combined value when date or time changes
	function updateValue() {
		if (dateValue && timeValue) {
			value = `${dateValue}T${timeValue}`;
		} else if (dateValue) {
			value = `${dateValue}T12:00`;
		} else {
			value = '';
		}
	}

	// Watch for changes
	$: {
		dateValue;
		timeValue;
		updateValue();
	}
</script>

<div class="w-full">
	{#if label}
		<label class="block text-sm font-medium text-gray-700 mb-2">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<div class="grid grid-cols-2 gap-3">
		<!-- Date Input with Datepicker component -->
		<Datepicker
			bind:value={dateValue}
			placeholder="Sélectionner une date"
			id="{id}-date"
			{required}
		/>

		<!-- Time Input -->
		<div class="relative">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
				<svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			<input
				type="time"
				id="{id}-time"
				bind:value={timeValue}
				{required}
				class="pl-10 px-4 py-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full transition-colors [color-scheme:light]"
			/>
		</div>
	</div>
</div>

<style>
	/* Styling pour améliorer l'apparence du time input natif */
	input[type='time']::-webkit-calendar-picker-indicator {
		cursor: pointer;
		opacity: 0.6;
		transition: opacity 0.15s;
	}

	input[type='time']::-webkit-calendar-picker-indicator:hover {
		opacity: 1;
	}

	input[type='time']::-webkit-datetime-edit {
		color: #111827;
	}

	input[type='time']::-webkit-datetime-edit-fields-wrapper {
		color: #111827;
	}

	input[type='time']::-webkit-datetime-edit-text {
		color: #6b7280;
	}

	input[type='time']::-webkit-datetime-edit-hour-field,
	input[type='time']::-webkit-datetime-edit-minute-field {
		color: #111827;
	}
</style>

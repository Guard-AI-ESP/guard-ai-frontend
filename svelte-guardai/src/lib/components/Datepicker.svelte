<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Datepicker as DatepickerType } from 'flowbite-datepicker';

	export let value = '';
	export let placeholder = 'Sélectionner une date';
	export let label = '';
	export let id = `datepicker-${Math.random().toString(36).substr(2, 9)}`;
	export let autohide = true;
	export let format = 'dd/mm/yyyy';
	export let minDate: string | undefined = undefined;
	export let maxDate: string | undefined = undefined;
	export let todayBtn = true;
	export let clearBtn = true;
	export let required = false;

	let inputElement: HTMLInputElement;
	let datepickerInstance: DatepickerType | null = null;

	onMount(async () => {
		// Import dynamique pour éviter les problèmes SSR
		const { Datepicker } = await import('flowbite-datepicker');

		const options: any = {
			autohide,
			format,
			todayBtn,
			clearBtn,
			todayBtnMode: 1,
			language: 'fr',
			orientation: 'bottom auto',
		};

		if (minDate) options.minDate = minDate;
		if (maxDate) options.maxDate = maxDate;

		datepickerInstance = new Datepicker(inputElement, options);

		// Set initial value if provided
		if (value) {
			datepickerInstance.setDate(value);
		}

		// Listen for date changes
		inputElement.addEventListener('changeDate', (e: any) => {
			const selectedDate = e.detail.date;
			if (selectedDate) {
				// Format to YYYY-MM-DD for consistency
				const year = selectedDate.getFullYear();
				const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
				const day = String(selectedDate.getDate()).padStart(2, '0');
				value = `${year}-${month}-${day}`;
			} else {
				value = '';
			}
		});
	});

	onDestroy(() => {
		if (datepickerInstance) {
			datepickerInstance.destroy();
		}
	});

	// Watch for external value changes
	$: if (datepickerInstance && value) {
		datepickerInstance.setDate(value);
	}
</script>

<div class="w-full">
	{#if label}
		<label for={id} class="block text-sm font-medium text-gray-700 mb-2">
			{label}
		</label>
	{/if}
	<div class="relative">
		<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
			<svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
				<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
			</svg>
		</div>
		<input
			bind:this={inputElement}
			type="text"
			{id}
			{placeholder}
			{required}
			class="pl-10 px-4 py-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full transition-colors"
			autocomplete="off"
		/>
	</div>
</div>

<style>
	/* Style personnalisé pour le datepicker Flowbite avec notre thème teal */
	:global(.datepicker) {
		border-radius: 0.5rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		border: 1px solid #e5e7eb;
		background: white;
		z-index: 9999;
	}

	:global(.datepicker-picker) {
		border-radius: 0.5rem;
		background: white;
		min-width: 280px;
	}

	:global(.datepicker-header) {
		background: #f9fafb;
		border-bottom: 1px solid #e5e7eb;
		padding: 0.5rem;
	}

	:global(.datepicker-title) {
		color: #111827;
		font-weight: 600;
	}

	:global(.datepicker-controls) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
	}

	:global(.datepicker-controls button) {
		color: #4b5563;
		border-radius: 0.5rem;
		transition: background-color 0.15s;
		padding: 0.5rem;
	}

	:global(.datepicker-controls button:hover) {
		background-color: #f3f4f6;
	}

	:global(.datepicker-view) {
		padding: 0.5rem;
	}

	:global(.datepicker-grid) {
		display: grid !important;
		grid-template-columns: repeat(7, 1fr) !important;
		gap: 2px;
		width: 100%;
	}

	:global(.datepicker-view .days .datepicker-grid) {
		display: grid !important;
		grid-template-columns: repeat(7, 1fr) !important;
	}

	:global(.datepicker-view .dow) {
		color: #6b7280;
		font-weight: 500;
		font-size: 0.75rem;
		text-transform: uppercase;
		padding: 0.5rem;
		text-align: center;
	}

	:global(.datepicker-cell) {
		color: #111827;
		border-radius: 0.5rem;
		transition: background-color 0.15s;
		padding: 0.5rem;
		text-align: center;
		min-height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.datepicker-cell:hover) {
		background-color: #f3f4f6;
	}

	:global(.datepicker-cell.selected) {
		background-color: #14b8a6 !important;
		color: white !important;
	}

	:global(.datepicker-cell.selected:hover) {
		background-color: #0d9488 !important;
	}

	:global(.datepicker-cell.focused:not(.selected)) {
		background-color: #f3f4f6;
	}

	:global(.datepicker-cell.today) {
		background-color: #ccfbf1;
		color: #0f766e;
		font-weight: 600;
	}

	:global(.datepicker-cell.today.selected) {
		background-color: #14b8a6 !important;
		color: white !important;
	}

	:global(.datepicker-cell.disabled) {
		color: #d1d5db;
		cursor: not-allowed;
	}

	:global(.datepicker-cell.disabled:hover) {
		background-color: transparent;
	}

	:global(.datepicker-cell.prev),
	:global(.datepicker-cell.next) {
		color: #9ca3af;
	}

	:global(.datepicker-footer) {
		border-top: 1px solid #e5e7eb;
		background: #f9fafb;
		padding: 0.5rem;
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}

	:global(.datepicker-footer button) {
		color: #14b8a6;
		font-weight: 500;
		border-radius: 0.5rem;
		transition: background-color 0.15s;
		padding: 0.5rem 1rem;
	}

	:global(.datepicker-footer button:hover) {
		background-color: #ccfbf1;
	}

	:global(.datepicker-cell.range-start),
	:global(.datepicker-cell.range-end) {
		background-color: #14b8a6;
		color: white;
	}

	:global(.datepicker-cell.range) {
		background-color: #99f6e4;
		color: #134e4a;
	}

	/* Fix pour la grille des jours de la semaine */
	:global(.datepicker-view .days-of-week) {
		display: grid !important;
		grid-template-columns: repeat(7, 1fr) !important;
		gap: 2px;
	}

	:global(.datepicker-view .days .datepicker-cell) {
		aspect-ratio: 1;
	}
</style>

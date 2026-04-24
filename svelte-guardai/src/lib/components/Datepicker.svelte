<script lang="ts">
	import { browser } from '$app/environment';

	type Props = {
		value?: string;
		placeholder?: string;
		id?: string;
	};

	let { value = $bindable(''), placeholder = 'Sélectionner une date', id }: Props = $props();

	function pikaday(node: HTMLInputElement) {
		if (!browser) return;
		let picker: any;
		import('pikaday').then(({ default: Pikaday }) => {
			picker = new Pikaday({
				field: node,
				format: 'YYYY-MM-DD',
				i18n: {
					previousMonth: 'Mois précédent',
					nextMonth: 'Mois suivant',
					months: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
					weekdays: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
					weekdaysShort: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
				},
				firstDay: 1,
				toString(date: Date) {
					const y = date.getFullYear();
					const m = String(date.getMonth() + 1).padStart(2, '0');
					const d = String(date.getDate()).padStart(2, '0');
					return `${y}-${m}-${d}`;
				},
				onSelect(date: Date) {
					const y = date.getFullYear();
					const m = String(date.getMonth() + 1).padStart(2, '0');
					const d = String(date.getDate()).padStart(2, '0');
					value = `${y}-${m}-${d}`;
				},
			});
		});

		return {
			destroy() {
				picker?.destroy();
			}
		};
	}
</script>

<div class="relative">
	<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-slate-400">
		<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
			<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>
		</svg>
	</div>
	<input
		use:pikaday
		{id}
		type="text"
		bind:value
		{placeholder}
		autocomplete="off"
		readonly
		class="block w-full ps-9 pe-3 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl shadow-soft focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400 transition-colors cursor-pointer"
	/>
</div>

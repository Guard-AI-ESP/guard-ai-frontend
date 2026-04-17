<script lang="ts">
	type Detector = {
		id: string;
		name: string;
		location: string;
		enabled: boolean;
		range: string;
		lastActivity: Date | null;
	};

	let detectors = $state<Detector[]>([
		{ id: '1', name: 'D\u00e9tecteur Entr\u00e9e',       location: 'Entr\u00e9e principale', enabled: true,  range: '1.2m', lastActivity: new Date('2024-12-11T14:30:00') },
		{ id: '2', name: 'D\u00e9tecteur Garage',        location: 'Garage',            enabled: true,  range: '1m',   lastActivity: new Date('2024-12-11T12:15:00') },
		{ id: '3', name: 'D\u00e9tecteur Porte arri\u00e8re', location: 'Porte arri\u00e8re',     enabled: false, range: '1.2m', lastActivity: null },
	]);

	let globalEnabled = $state(true);
	let selectedRange  = $state('1m');
	let rangeOpen      = $state(false);
	let saved          = $state(false);

	const rangeOptions = ['1m', '1.2m', '1.5m', '2m'];

	function toggleGlobal() {
		detectors = detectors.map(d => ({ ...d, enabled: globalEnabled }));
	}

	function toggleDetector(id: string) {
		detectors = detectors.map(d => d.id === id ? { ...d, enabled: !d.enabled } : d);
	}

	function saveSettings() {
		saved = true;
		setTimeout(() => saved = false, 2500);
	}

	function formatDateTime(date: Date | null): string {
		if (!date) return 'Jamais';
		return date.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	}

	const activeCount   = $derived(detectors.filter(d => d.enabled).length);
	const inactiveCount = $derived(detectors.filter(d => !d.enabled).length);

	function trackStyle(on: boolean) {
		return `position:relative; display:inline-block; width:44px; height:24px; border-radius:999px; background:${on ? '#13b9a5' : '#cbd5e1'}; transition:background 0.2s; cursor:pointer; border:none; padding:0; flex-shrink:0;`;
	}
	function thumbStyle(on: boolean) {
		return `position:absolute; top:2px; left:2px; width:20px; height:20px; border-radius:50%; background:white; box-shadow:0 1px 3px rgba(0,0,0,0.25); transition:transform 0.2s; transform:translateX(${on ? '20px' : '0px'}); display:block;`;
	}
</script>

<svelte:head>
	<title>D\u00e9tecteurs - Guard AI</title>
</svelte:head>

<svelte:window onclick={(e) => { if (!(e.target as HTMLElement).closest('.range-dropdown')) rangeOpen = false; }} />

<!-- Page header -->
<div>
	<h1 class="text-2xl font-semibold text-slate-800">D\u00e9tecteurs de pr\u00e9sence</h1>
	<p class="text-slate-400 text-sm mt-0.5">G\u00e9rez et configurez vos d\u00e9tecteurs de mouvement</p>
</div>

<!-- KPIs -->
<div class="flex gap-4">
	{#each [
		{ icon: 'sensors',     iconBg: 'bg-green-50', iconColor: 'text-green-500', label: 'D\u00e9tecteurs actifs',   value: activeCount.toString()      },
		{ icon: 'sensors_off', iconBg: 'bg-slate-50', iconColor: 'text-slate-400', label: 'D\u00e9tecteurs inactifs', value: inactiveCount.toString()    },
		{ icon: 'router',      iconBg: 'bg-teal-50',  iconColor: 'text-teal-500',  label: 'Total install\u00e9s',     value: detectors.length.toString() },
	] as kpi}
		<div class="flex-1 bg-white rounded-[20px] p-5 shadow-soft border border-slate-100 flex flex-col gap-3">
			<div class="w-11 h-11 rounded-2xl {kpi.iconBg} flex items-center justify-center {kpi.iconColor}">
				<span class="material-icons text-[22px]">{kpi.icon}</span>
			</div>
			<div>
				<p class="text-slate-400 text-sm">{kpi.label}</p>
				<p class="text-2xl font-bold text-slate-800">{kpi.value}</p>
			</div>
		</div>
	{/each}
</div>

<!-- Controls row -->
<div class="flex items-center justify-between gap-4 flex-wrap">
	<div class="flex items-center gap-3 flex-wrap">

		<!-- Global toggle -->
		<div class="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-soft">
			<span class="material-icons text-[18px] {globalEnabled ? 'text-green-500' : 'text-slate-400'}">bolt</span>
			<span class="text-sm font-medium text-slate-700">Tout activer / d\u00e9sactiver</span>
			<button
				role="switch"
				aria-checked={globalEnabled}
				aria-label="Activer/d\u00e9sactiver tous les d\u00e9tecteurs"
				onclick={() => { globalEnabled = !globalEnabled; toggleGlobal(); }}
				style={trackStyle(globalEnabled)}
			><span style={thumbStyle(globalEnabled)}></span></button>
		</div>

		<!-- Range dropdown -->
		<div class="relative range-dropdown">
			<button
				onclick={(e) => { e.stopPropagation(); rangeOpen = !rangeOpen; }}
				class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 shadow-soft hover:border-slate-300 transition-colors"
			>
				<span class="material-icons text-[16px] text-slate-400">radar</span>
				Port\u00e9e par d\u00e9faut : {selectedRange}
				<span class="material-icons text-[14px] text-slate-400">{rangeOpen ? 'expand_less' : 'expand_more'}</span>
			</button>
			{#if rangeOpen}
				<div class="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 min-w-[170px]">
					{#each rangeOptions as opt}
						<button
							onclick={() => { selectedRange = opt; rangeOpen = false; }}
							class="w-full text-left px-4 py-2.5 text-sm transition-colors
								{selectedRange === opt ? 'text-primary font-semibold bg-primary/5' : 'text-slate-600 hover:bg-slate-50'}"
						>{opt}</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Save -->
	<button
		onclick={saveSettings}
		class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all
			{saved ? 'bg-green-500 text-white shadow-md shadow-green-500/25' : 'bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-dark'}"
	>
		<span class="material-icons text-[18px]">{saved ? 'check' : 'save'}</span>
		{saved ? 'Sauvegard\u00e9' : 'Enregistrer'}
	</button>
</div>

<!-- Table -->
<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 overflow-hidden">
	<table class="w-full">
		<thead>
			<tr class="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
				<th class="px-5 py-3 text-left">D\u00e9tecteur</th>
				<th class="px-5 py-3 text-left">Emplacement</th>
				<th class="px-5 py-3 text-left">Port\u00e9e</th>
				<th class="px-5 py-3 text-left">Derni\u00e8re activit\u00e9</th>
				<th class="px-5 py-3 text-left">Statut</th>
				<th class="px-5 py-3 text-left">Activer</th>
			</tr>
		</thead>
		<tbody>
			{#each detectors as detector (detector.id)}
				<tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
					<td class="px-5 py-4">
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 {detector.enabled ? 'bg-green-50' : 'bg-slate-100'}">
								<span class="material-icons text-[18px] {detector.enabled ? 'text-green-500' : 'text-slate-400'}">sensors</span>
							</div>
							<p class="text-sm font-semibold text-slate-800">{detector.name}</p>
						</div>
					</td>
					<td class="px-5 py-4 text-sm text-slate-500">
						<span class="flex items-center gap-1">
							<span class="material-icons text-[14px] text-slate-400">location_on</span>
							{detector.location}
						</span>
					</td>
					<td class="px-5 py-4 text-sm text-slate-500">
						<span class="flex items-center gap-1">
							<span class="material-icons text-[14px] text-slate-400">radar</span>
							{detector.range}
						</span>
					</td>
					<td class="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
						{formatDateTime(detector.lastActivity)}
					</td>
					<td class="px-5 py-4">
						<span class="text-[11px] font-semibold px-2.5 py-1 rounded-full {detector.enabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}">
							{detector.enabled ? 'Actif' : 'Inactif'}
						</span>
					</td>
					<td class="px-5 py-4">
						<button
							role="switch"
							aria-checked={detector.enabled}
							aria-label="Activer/d\u00e9sactiver {detector.name}"
							onclick={() => toggleDetector(detector.id)}
							style={trackStyle(detector.enabled)}
						><span style={thumbStyle(detector.enabled)}></span></button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

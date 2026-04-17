<script lang="ts">
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import Datepicker from '$lib/components/Datepicker.svelte';
	import TabBar from '$lib/components/TabBar.svelte';

	type CallType = 'visitor' | 'outgoing' | 'missed';

	type Call = {
		id: string;
		camera: string;
		type: CallType;
		date: Date;
		durationSec: number;
		status: 'answered' | 'missed';
	};

	const now = new Date();
	const d = (days: number, h: number, m: number) => {
		const dt = new Date(now);
		dt.setDate(dt.getDate() - days);
		dt.setHours(h, m, 0, 0);
		return dt;
	};

	const allCalls: Call[] = [
		{ id: '1',  camera: 'Entr\u00e9e principale', type: 'visitor',  date: d(0, 14, 30), durationSec: 323, status: 'answered' },
		{ id: '2',  camera: 'Portail arri\u00e8re',   type: 'outgoing', date: d(0, 13, 15), durationSec: 165, status: 'answered' },
		{ id: '3',  camera: 'Entr\u00e9e principale', type: 'missed',   date: d(0, 11, 45), durationSec: 0,   status: 'missed'   },
		{ id: '4',  camera: 'Entr\u00e9e principale', type: 'visitor',  date: d(0, 10, 20), durationSec: 492, status: 'answered' },
		{ id: '5',  camera: 'Garage',            type: 'outgoing', date: d(0, 9, 30),  durationSec: 94,  status: 'answered' },
		{ id: '6',  camera: 'Entr\u00e9e principale', type: 'missed',   date: d(1, 18, 45), durationSec: 0,   status: 'missed'   },
		{ id: '7',  camera: 'Portail arri\u00e8re',   type: 'visitor',  date: d(1, 16, 30), durationSec: 776, status: 'answered' },
		{ id: '8',  camera: 'Entr\u00e9e principale', type: 'outgoing', date: d(1, 14, 15), durationSec: 202, status: 'answered' },
		{ id: '9',  camera: 'Garage',            type: 'visitor',  date: d(1, 12, 0),  durationSec: 405, status: 'answered' },
		{ id: '10', camera: 'Entr\u00e9e principale', type: 'missed',   date: d(2, 10, 30), durationSec: 0,   status: 'missed'   },
	];

	let activeFilter = $state<'all' | CallType>('all');
	let searchQ      = $state('');
	let filterDate   = $state('');
	let sortBy       = $state<'date' | 'duration'>('date');
	let sortDir      = $state<'asc' | 'desc'>('desc');
	let sortOpen     = $state(false);
	let deleteTarget = $state<string | null>(null);

	const sortOptions = [
		{ value: 'date',     label: 'Date'   },
		{ value: 'duration', label: 'Dur\u00e9e'  },
	] as const;

	const filtered = $derived.by(() => {
		let list = allCalls.filter(c => {
			if (activeFilter !== 'all' && c.type !== activeFilter) return false;
			if (searchQ && !c.camera.toLowerCase().includes(searchQ.toLowerCase())) return false;
			if (filterDate && c.date.toISOString().split('T')[0] !== filterDate) return false;
			return true;
		});
		list = [...list].sort((a, b) => {
			const diff = sortBy === 'date'
				? a.date.getTime() - b.date.getTime()
				: a.durationSec   - b.durationSec;
			return sortDir === 'desc' ? -diff : diff;
		});
		return list;
	});

	const totalCount    = $derived(allCalls.length);
	const visitorCount  = $derived(allCalls.filter(c => c.type === 'visitor').length);
	const outgoingCount = $derived(allCalls.filter(c => c.type === 'outgoing').length);
	const missedCount   = $derived(allCalls.filter(c => c.status === 'missed').length);

	function formatDuration(sec: number): string {
		if (sec === 0) return '\u2014';
		const m = Math.floor(sec / 60);
		const s = sec % 60;
		return `${m}:${String(s).padStart(2, '0')}`;
	}

	function formatDate(date: Date): string {
		const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);
		if (diff === 0) return "Aujourd'hui";
		if (diff === 1) return 'Hier';
		return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
	}

	function typeLabel(c: Call): { label: string; cls: string; icon: string } {
		if (c.status === 'missed')   return { label: 'Manqu\u00e9',   cls: 'bg-red-100 text-red-600',    icon: 'call_missed'    };
		if (c.type === 'visitor')    return { label: 'Entrant',  cls: 'bg-green-100 text-green-700', icon: 'call_received' };
		return                              { label: 'Sortant',  cls: 'bg-blue-100 text-blue-700',  icon: 'call_made'     };
	}
</script>

<svelte:head>
	<title>Journal d'appels - Guard AI</title>
</svelte:head>

<svelte:window onclick={(e) => { if (!(e.target as HTMLElement).closest('.sort-dropdown')) sortOpen = false; }} />

<!-- Page header -->
<div>
	<h1 class="text-2xl font-semibold text-slate-800">Journal d'appels</h1>
	<p class="text-slate-400 text-sm mt-0.5">Historique des interactions via sonnette et interphone</p>
</div>

<!-- KPIs -->
<div class="flex gap-4">
	{#each [
		{ icon: 'call',          iconBg: 'bg-teal-50',   iconColor: 'text-teal-500',   label: 'Total interactions', value: totalCount.toString()    },
		{ icon: 'call_received', iconBg: 'bg-green-50',  iconColor: 'text-green-500',  label: 'Appels entrants',    value: visitorCount.toString()  },
		{ icon: 'call_made',     iconBg: 'bg-blue-50',   iconColor: 'text-blue-500',   label: 'Appels sortants',    value: outgoingCount.toString() },
		{ icon: 'call_missed',   iconBg: 'bg-red-50',    iconColor: 'text-red-400',    label: 'Manqu\u00e9s',            value: missedCount.toString()   },
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
		<!-- Search -->
		<div class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-soft">
			<span class="material-icons text-[16px] text-slate-400">search</span>
			<input
				type="text"
				bind:value={searchQ}
				placeholder="Rechercher une cam\u00e9ra\u2026"
				class="bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 w-40"
			/>
		</div>

		<!-- Type filter tabs -->
		<TabBar
			tabs={[
				{ value: 'all', label: 'Tous' },
				{ value: 'visitor', label: 'Entrants' },
				{ value: 'outgoing', label: 'Sortants' },
				{ value: 'missed', label: 'Manqu\u00e9s' },
			]}
			active={activeFilter}
			onchange={(v) => activeFilter = v}
		/>

		<!-- Date filter -->
		<div class="w-44">
			<Datepicker bind:value={filterDate} placeholder="Filtrer par date" />
		</div>
		{#if filterDate}
			<button
				onclick={() => filterDate = ''}
				class="text-slate-400 hover:text-red-400 transition-colors"
				aria-label="Effacer le filtre date"
			>
				<span class="material-icons text-[16px]">close</span>
			</button>
		{/if}

		<!-- Sort dropdown -->
		<div class="relative sort-dropdown">
			<button
				onclick={() => sortOpen = !sortOpen}
				class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 shadow-soft hover:border-slate-300 transition-colors"
			>
				<span class="material-icons text-[16px] text-slate-400">sort</span>
				Trier par : {sortOptions.find(o => o.value === sortBy)?.label}
				<span class="material-icons text-[14px] text-slate-400">{sortOpen ? 'expand_less' : 'expand_more'}</span>
			</button>
			{#if sortOpen}
				<div class="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 min-w-[160px]">
					{#each sortOptions as opt}
						<button
							onclick={() => {
								if (sortBy === opt.value) sortDir = sortDir === 'desc' ? 'asc' : 'desc';
								else { sortBy = opt.value; sortDir = 'desc'; }
								sortOpen = false;
							}}
							class="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors
								{sortBy === opt.value ? 'text-primary font-medium' : 'text-slate-600 hover:bg-slate-50'}"
						>
							{opt.label}
							{#if sortBy === opt.value}
								<span class="material-icons text-[14px]">{sortDir === 'desc' ? 'arrow_downward' : 'arrow_upward'}</span>
							{/if}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Table -->
<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 overflow-hidden">
	<table class="w-full">
		<thead>
			<tr class="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
				<th class="px-5 py-3 text-left">Type</th>
				<th class="px-5 py-3 text-left">Cam\u00e9ra / Sonnette</th>
				<th class="px-5 py-3 text-left">Date</th>
				<th class="px-5 py-3 text-left">Heure</th>
				<th class="px-5 py-3 text-left">Dur\u00e9e</th>
				<th class="px-5 py-3 text-left">Statut</th>
				<th class="px-5 py-3 text-left w-20"></th>
			</tr>
		</thead>
		<tbody>
			{#if filtered.length === 0}
				<tr>
					<td colspan="7" class="py-12 text-center text-slate-400 text-sm">Aucun appel trouv\u00e9</td>
				</tr>
			{:else}
				{#each filtered as call (call.id)}
					{@const tl = typeLabel(call)}
					<tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group
						{call.status === 'missed' ? 'bg-red-50/40' : ''}">

						<!-- Type icon -->
						<td class="px-5 py-4">
							<div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 {tl.cls.split(' ')[0]}">
								<span class="material-icons text-[18px] {tl.cls.split(' ')[1]}">{tl.icon}</span>
							</div>
						</td>

						<!-- Camera -->
						<td class="px-5 py-4">
							<div class="flex items-center gap-2">
								<p class="text-sm font-semibold text-slate-800">{call.camera}</p>
							</div>
							<p class="text-xs text-slate-400">
								{call.type === 'visitor' ? 'Appel entrant' : call.type === 'outgoing' ? 'Appel sortant' : 'Non r\u00e9pondu'}
							</p>
						</td>

						<!-- Date -->
						<td class="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
							{formatDate(call.date)}
						</td>

						<!-- Time -->
						<td class="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
							{call.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
						</td>

						<!-- Duration -->
						<td class="px-5 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">
							{formatDuration(call.durationSec)}
						</td>

						<!-- Status badge -->
						<td class="px-5 py-4">
							<span class="text-[11px] font-semibold px-2.5 py-1 rounded-full {tl.cls}">{tl.label}</span>
						</td>

						<!-- Actions -->
						<td class="px-5 py-4">
							<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									aria-label="Supprimer"
									onclick={() => deleteTarget = call.id}
									class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
								>
									<span class="material-icons text-[16px]">delete_outline</span>
								</button>
							</div>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

{#if deleteTarget}
	{@const call = allCalls.find(c => c.id === deleteTarget)}
	<DeleteModal
		label="cet appel ({call?.camera ?? ''})"
		onconfirm={() => { deleteTarget = null; }}
		oncancel={() => { deleteTarget = null; }}
	/>
{/if}

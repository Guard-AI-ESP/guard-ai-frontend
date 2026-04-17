<script lang="ts">
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import Datepicker from '$lib/components/Datepicker.svelte';
	import Timepicker from '$lib/components/Timepicker.svelte';

	type Message = {
		id: number;
		sender: string;
		camera: string;
		dateTs: Date;
		durationSec: number;
		sizeMb: number;
		expiresAt: Date;
		listened: boolean;
	};

	const now = new Date();
	const d = (days: number, h = 0, m = 0) => {
		const dt = new Date(now.getTime() - days * 86400000);
		dt.setHours(h, m, 0, 0);
		return dt;
	};
	const exp = (days: number) => new Date(now.getTime() + days * 86400000);

	const allMessages: Message[] = [
		{ id: 1,  sender: 'Livreur Chronopost',   camera: 'Entr\u00e9e',        dateTs: d(0,9,14),  durationSec: 12, sizeMb: 1.2, expiresAt: exp(3),  listened: false },
		{ id: 2,  sender: 'Visiteur inconnu',      camera: 'Porte arri\u00e8re', dateTs: d(0,11,32), durationSec: 8,  sizeMb: 0.8, expiresAt: exp(4),  listened: false },
		{ id: 3,  sender: 'Voisin - M. Bernard',   camera: 'Entr\u00e9e',        dateTs: d(0,14,5),  durationSec: 25, sizeMb: 2.4, expiresAt: exp(12), listened: true  },
		{ id: 4,  sender: 'Technicien alarme',     camera: 'Garage',        dateTs: d(1,8,50),  durationSec: 40, sizeMb: 3.8, expiresAt: exp(5),  listened: true  },
		{ id: 5,  sender: 'Livreur Amazon',        camera: 'Entr\u00e9e',        dateTs: d(1,16,20), durationSec: 15, sizeMb: 1.5, expiresAt: exp(8),  listened: false },
		{ id: 6,  sender: 'Visiteur inconnu',      camera: 'Porte arri\u00e8re', dateTs: d(1,22,10), durationSec: 6,  sizeMb: 0.6, expiresAt: exp(2),  listened: false },
		{ id: 7,  sender: 'Agent EDF',             camera: 'Garage',        dateTs: d(2,10,0),  durationSec: 55, sizeMb: 5.2, expiresAt: exp(15), listened: true  },
		{ id: 8,  sender: 'Livreur DHL',           camera: 'Entr\u00e9e',        dateTs: d(2,13,45), durationSec: 18, sizeMb: 1.7, expiresAt: exp(6),  listened: true  },
		{ id: 9,  sender: 'Visiteur inconnu',      camera: 'Entr\u00e9e',        dateTs: d(3,23,5),  durationSec: 9,  sizeMb: 0.9, expiresAt: exp(1),  listened: false },
		{ id: 10, sender: 'Voisine - Mme Dupont',  camera: 'Porte arri\u00e8re', dateTs: d(4,17,30), durationSec: 32, sizeMb: 3.0, expiresAt: exp(4),  listened: true  },
	];

	// --- State ---
	let search = $state('');
	let sortBy = $state<'date' | 'duree' | 'taille' | 'expiration'>('date');
	let sortDir = $state<'asc' | 'desc'>('desc');
	let filterDate = $state('');
	let filterTime = $state('');
	let sortOpen = $state(false);
	let playing      = $state<number | null>(null);
	let deleteTarget = $state<number | null>(null);

	const sortOptions = [
		{ value: 'date',       label: "Date d'ajout" },
		{ value: 'duree',      label: 'Dur\u00e9e'        },
		{ value: 'taille',     label: 'Taille'       },
		{ value: 'expiration', label: 'Expiration'   },
	] as const;

	// --- Derived ---
	const filtered = $derived.by(() => {
		let list = allMessages.filter(m => {
			if (search && !m.sender.toLowerCase().includes(search.toLowerCase()) && !m.camera.toLowerCase().includes(search.toLowerCase())) return false;
			if (filterDate) {
				const from = new Date(filterDate);
				const to = new Date(filterDate);
				to.setHours(23, 59, 59);
				if (m.dateTs < from || m.dateTs > to) return false;
			}
			if (filterTime) {
				const [h, mn] = filterTime.split(':').map(Number);
				const recTotal = m.dateTs.getHours() * 60 + m.dateTs.getMinutes();
				const filterTotal = h * 60 + mn;
				if (Math.abs(recTotal - filterTotal) > 30) return false;
			}
			return true;
		});

		return [...list].sort((a, b) => {
			let diff = 0;
			if (sortBy === 'date')       diff = a.dateTs.getTime()    - b.dateTs.getTime();
			if (sortBy === 'duree')      diff = a.durationSec         - b.durationSec;
			if (sortBy === 'taille')     diff = a.sizeMb              - b.sizeMb;
			if (sortBy === 'expiration') diff = a.expiresAt.getTime() - b.expiresAt.getTime();
			return sortDir === 'desc' ? -diff : diff;
		});
	});

	// KPIs
	const total        = allMessages.length;
	const unlistened   = allMessages.filter(m => !m.listened).length;
	const last24h      = allMessages.filter(m => m.dateTs >= d(1)).length;
	const expiringSoon = allMessages.filter(m => daysLeft(m.expiresAt) <= 5).length;
	const totalSizeMb  = allMessages.reduce((s, m) => s + m.sizeMb, 0).toFixed(1);

	function daysLeft(date: Date): number {
		return Math.ceil((date.getTime() - now.getTime()) / 86400000);
	}

	function formatDuration(sec: number): string {
		if (sec < 60) return `${sec}s`;
		return `${Math.floor(sec / 60)}m${sec % 60 > 0 ? (sec % 60) + 's' : ''}`;
	}

	function formatDate(date: Date): string {
		const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);
		if (diff === 0) return "Aujourd'hui";
		if (diff === 1) return 'Hier';
		return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
	}

	function expiryClass(days: number): string {
		if (days <= 2) return 'bg-red-100 text-red-600';
		if (days <= 5) return 'bg-amber-100 text-amber-600';
		return 'bg-slate-100 text-slate-500';
	}
</script>

<svelte:head>
	<title>Messages - Guard AI</title>
</svelte:head>

<!-- Page header -->
<div class="flex items-center justify-between">
	<div>
		<h1 class="text-2xl font-semibold text-slate-800">Messages audio</h1>
		<p class="text-slate-400 text-sm mt-0.5">Enregistrements audio laiss\u00e9s \u00e0 l'interphone</p>
	</div>
</div>

<!-- KPIs -->
<div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
	{#each [
		{ icon: 'voicemail',   iconBg: 'bg-teal-50',   iconColor: 'text-teal-500',   label: 'Total messages',    value: total.toString()       },
		{ icon: 'hearing_disabled', iconBg: 'bg-blue-50',   iconColor: 'text-blue-500',   label: 'Non \u00e9cout\u00e9s',       value: unlistened.toString()  },
		{ icon: 'schedule',    iconBg: 'bg-purple-50', iconColor: 'text-purple-500', label: 'Derni\u00e8res 24h',     value: last24h.toString()     },
		{ icon: 'timer_off',   iconBg: 'bg-red-50',    iconColor: 'text-red-400',    label: 'Expiration proche', value: expiringSoon.toString() },
	] as kpi}
		<div class="bg-white rounded-[20px] p-5 shadow-soft border border-slate-100 flex flex-col gap-3">
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

<!-- Search + filters -->
<div class="flex items-center justify-between gap-4 flex-wrap">
	<!-- Search bar -->
	<div class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-soft w-64">
		<span class="material-icons text-[18px] text-slate-400">search</span>
		<input
			type="text"
			placeholder="Rechercher un exp\u00e9diteur..."
			bind:value={search}
			class="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1"
		/>
		{#if search}
			<button onclick={() => search = ''} class="text-slate-400 hover:text-slate-600">
				<span class="material-icons text-[16px]">close</span>
			</button>
		{/if}
	</div>

	<!-- Date + heure + sort -->
	<div class="flex items-center gap-2 flex-wrap">
		<div class="w-44">
			<Datepicker bind:value={filterDate} placeholder="Filtrer par date" />
		</div>
		<div class="w-28">
			<Timepicker bind:value={filterTime} placeholder="Heure" />
		</div>
		{#if filterDate || filterTime}
			<button onclick={() => { filterDate = ''; filterTime = ''; }} class="text-slate-400 hover:text-red-400 transition-colors" aria-label="Effacer">
				<span class="material-icons text-[16px]">close</span>
			</button>
		{/if}

		<!-- Sort -->
		<div class="relative">
			<button
				onclick={() => sortOpen = !sortOpen}
				class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 shadow-soft hover:border-slate-300 transition-colors"
			>
				<span class="material-icons text-[16px] text-slate-400">sort</span>
				Trier par : {sortOptions.find(o => o.value === sortBy)?.label}
				<span class="material-icons text-[14px] text-slate-400">{sortOpen ? 'expand_less' : 'expand_more'}</span>
			</button>
			{#if sortOpen}
				<div class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 min-w-[180px]">
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

		<div class="flex items-center gap-1.5 text-sm text-slate-400">
			<span class="material-icons text-[18px]">voicemail</span>
			<span>{filtered.length} messages</span>
		</div>
	</div>
</div>

<!-- Table -->
<div class="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
	<table class="w-full">
		<thead>
			<tr class="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
				<th class="px-5 py-3 text-left w-10"></th>
				<th class="px-5 py-3 text-left">Exp\u00e9diteur</th>
				<th class="px-5 py-3 text-left">Cam\u00e9ra</th>
				<th class="px-5 py-3 text-left">Date</th>
				<th class="px-5 py-3 text-left">Dur\u00e9e</th>
				<th class="px-5 py-3 text-left">Taille</th>
				<th class="px-5 py-3 text-left">Expiration</th>
				<th class="px-5 py-3 text-left w-20"></th>
			</tr>
		</thead>
		<tbody>
			{#if filtered.length === 0}
				<tr>
					<td colspan="8" class="py-12 text-center text-slate-400 text-sm">Aucun message trouv\u00e9</td>
				</tr>
			{:else}
				{#each filtered as msg}
					{@const days = daysLeft(msg.expiresAt)}
					<tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group {!msg.listened ? 'bg-primary/[0.02]' : ''}">
						<!-- Play -->
						<td class="px-5 py-4">
							<button
								aria-label="\u00c9couter"
								onclick={() => playing = playing === msg.id ? null : msg.id}
								class="w-9 h-9 rounded-xl flex items-center justify-center transition-all
									{playing === msg.id
										? 'bg-primary text-white shadow-md shadow-primary/25'
										: 'bg-slate-100 text-slate-500 hover:bg-primary hover:text-white'}"
							>
								<span class="material-icons text-[18px]">{playing === msg.id ? 'pause' : 'play_arrow'}</span>
							</button>
						</td>

						<!-- Sender + unlistened dot -->
						<td class="px-5 py-4">
							<div class="flex items-center gap-2">
								{#if !msg.listened}
									<span class="w-2 h-2 rounded-full bg-primary shrink-0"></span>
								{/if}
								<div>
									<p class="text-sm font-medium text-slate-800 {!msg.listened ? 'font-semibold' : ''}">{msg.sender}</p>
									<!-- Waveform bar -->
									<div class="mt-1 h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
										<div class="h-full rounded-full bg-primary/40 {playing === msg.id ? 'animate-pulse' : ''}"
											style="width: {playing === msg.id ? '60%' : '33%'}">
										</div>
									</div>
								</div>
							</div>
						</td>

						<!-- Camera -->
						<td class="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">{msg.camera}</td>

						<!-- Date -->
						<td class="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
							{formatDate(msg.dateTs)} \u2022 {msg.dateTs.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
						</td>

						<!-- Duration -->
						<td class="px-5 py-4 text-xs font-medium text-slate-600 whitespace-nowrap">{formatDuration(msg.durationSec)}</td>

						<!-- Size -->
						<td class="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">{msg.sizeMb} MB</td>

						<!-- Expiry -->
						<td class="px-5 py-4">
							<span class="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap {expiryClass(days)}">
								{days <= 0 ? 'Expir\u00e9' : `J-${days}`}
							</span>
						</td>

						<!-- Actions -->
						<td class="px-5 py-4">
							<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<button aria-label="T\u00e9l\u00e9charger" class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
									<span class="material-icons text-[16px]">download</span>
								</button>
								<button
									aria-label="Supprimer"
									onclick={() => deleteTarget = msg.id}
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

{#if deleteTarget !== null}
	{@const msg = allMessages.find(m => m.id === deleteTarget)}
	<DeleteModal
		label={msg ? `le message de ${msg.sender}` : 'ce message'}
		onconfirm={() => { deleteTarget = null; }}
		oncancel={() => { deleteTarget = null; }}
	/>
{/if}

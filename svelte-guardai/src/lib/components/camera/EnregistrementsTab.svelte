<script lang="ts">
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import Datepicker from '$lib/components/Datepicker.svelte';
	import Timepicker from '$lib/components/Timepicker.svelte';
	import TabBar from '$lib/components/TabBar.svelte';

	type Recording = {
		id: number;
		title: string;
		camera: 'Entrée' | 'Garage' | 'Porte arrière';
		dateTs: Date;
		durationSec: number;
		sizeMb: number;
		expiresAt: Date;
	};

	const now = new Date();
	const d = (days: number) => new Date(now.getTime() - days * 86400000);
	const exp = (days: number) => new Date(now.getTime() + days * 86400000);

	const allRecordings: Recording[] = [
		{ id: 1,  title: 'Mouvement détecté - Allée',       camera: 'Entrée',        dateTs: d(0),  durationSec: 30,  sizeMb: 12, expiresAt: exp(3)  },
		{ id: 2,  title: 'Colis déposé',                    camera: 'Entrée',        dateTs: d(0),  durationSec: 45,  sizeMb: 18, expiresAt: exp(4)  },
		{ id: 3,  title: 'Voiture garée',                   camera: 'Garage',        dateTs: d(0),  durationSec: 20,  sizeMb: 8,  expiresAt: exp(12) },
		{ id: 4,  title: 'Alerte - Entrée nocturne',        camera: 'Entrée',        dateTs: d(1),  durationSec: 72,  sizeMb: 28, expiresAt: exp(5)  },
		{ id: 5,  title: 'Visiteur - Porte arrière',        camera: 'Porte arrière', dateTs: d(1),  durationSec: 55,  sizeMb: 22, expiresAt: exp(8)  },
		{ id: 6,  title: 'Mouvement détecté',               camera: 'Porte arrière', dateTs: d(1),  durationSec: 18,  sizeMb: 7,  expiresAt: exp(2)  },
		{ id: 7,  title: 'Portail ouvert - Garage',         camera: 'Garage',        dateTs: d(2),  durationSec: 40,  sizeMb: 16, expiresAt: exp(15) },
		{ id: 8,  title: 'Livraison colis',                 camera: 'Entrée',        dateTs: d(2),  durationSec: 60,  sizeMb: 24, expiresAt: exp(6)  },
		{ id: 9,  title: 'Mouvement nocturne',              camera: 'Porte arrière', dateTs: d(3),  durationSec: 90,  sizeMb: 36, expiresAt: exp(1)  },
		{ id: 10, title: 'Véhicule inconnu',                camera: 'Garage',        dateTs: d(4),  durationSec: 35,  sizeMb: 14, expiresAt: exp(4)  },
	];

	let activeCamera = $state<'Tous' | 'Entrée' | 'Garage' | 'Porte arrière'>('Tous');
	let sortBy = $state<'date' | 'duree' | 'taille' | 'expiration'>('date');
	let sortDir = $state<'asc' | 'desc'>('desc');
	let filterDate = $state('');
	let filterTime = $state('');
	let playing      = $state<number | null>(null);
	let deleteTarget = $state<number | null>(null);
	let sortOpen = $state(false);

	const sortOptions = [
		{ value: 'date',       label: 'Date d\'ajout' },
		{ value: 'duree',      label: 'Durée'         },
		{ value: 'taille',     label: 'Taille'        },
		{ value: 'expiration', label: 'Expiration'    },
	] as const;

	const filtered = $derived.by(() => {
		let list = allRecordings.filter(r => {
			if (activeCamera !== 'Tous' && r.camera !== activeCamera) return false;
			if (filterDate) {
				const from = new Date(filterDate);
				const to = new Date(filterDate);
				to.setHours(23, 59, 59);
				if (r.dateTs < from || r.dateTs > to) return false;
			}
			if (filterTime) {
				const [h, m] = filterTime.split(':').map(Number);
				const recTotal = r.dateTs.getHours() * 60 + r.dateTs.getMinutes();
				const filterTotal = h * 60 + m;
				if (Math.abs(recTotal - filterTotal) > 30) return false;
			}
			return true;
		});

		list = [...list].sort((a, b) => {
			let diff = 0;
			if (sortBy === 'date')       diff = a.dateTs.getTime()      - b.dateTs.getTime();
			if (sortBy === 'duree')      diff = a.durationSec           - b.durationSec;
			if (sortBy === 'taille')     diff = a.sizeMb                - b.sizeMb;
			if (sortBy === 'expiration') diff = a.expiresAt.getTime()   - b.expiresAt.getTime();
			return sortDir === 'desc' ? -diff : diff;
		});

		return list;
	});

	const totalRecordings = allRecordings.length;
	const totalStorageMb  = allRecordings.reduce((s, r) => s + r.sizeMb, 0);
	const last24h         = allRecordings.filter(r => r.dateTs >= d(1)).length;
	const expiringSoon    = allRecordings.filter(r => daysLeft(r.expiresAt) <= 5).length;

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

<div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
	{#each [
		{ icon: 'videocam',       iconBg: 'bg-teal-50',   iconColor: 'text-teal-500',   label: 'Total enregistrements', value: totalRecordings.toString() },
		{ icon: 'storage',        iconBg: 'bg-blue-50',   iconColor: 'text-blue-500',   label: 'Stockage utilisé',      value: `${totalStorageMb} MB`      },
		{ icon: 'schedule',       iconBg: 'bg-purple-50', iconColor: 'text-purple-500', label: 'Dernières 24h',         value: last24h.toString()          },
		{ icon: 'timer_off',      iconBg: 'bg-red-50',    iconColor: 'text-red-400',    label: 'Expiration proche',     value: expiringSoon.toString()     },
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

<div class="flex flex-col gap-3">
	<div class="flex items-center justify-between gap-4 flex-wrap">
		<TabBar
			tabs={[
				{ value: 'Tous', label: 'Tous' },
				{ value: 'Entrée', label: 'Entrée' },
				{ value: 'Garage', label: 'Garage' },
				{ value: 'Porte arrière', label: 'Porte arrière' },
			]}
			active={activeCamera}
			onchange={(v) => activeCamera = v}
		/>

		<div class="flex items-center gap-2 flex-wrap">
			<div class="w-44">
				<Datepicker bind:value={filterDate} placeholder="Filtrer par date" />
			</div>
			<div class="w-28">
				<Timepicker bind:value={filterTime} placeholder="Heure" />
			</div>

			{#if filterDate || filterTime}
				<button
					onclick={() => { filterDate = ''; filterTime = ''; }}
					class="text-slate-400 hover:text-red-400 transition-colors"
					aria-label="Effacer les filtres"
				>
					<span class="material-icons text-[16px]">close</span>
				</button>
			{/if}

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
		</div>
	</div>
</div>

<div class="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
	<table class="w-full">
		<thead>
			<tr class="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
				<th class="px-5 py-3 text-left w-10"></th>
				<th class="px-5 py-3 text-left">Titre</th>
				<th class="px-5 py-3 text-left">Caméra</th>
				<th class="px-5 py-3 text-left">Durée</th>
				<th class="px-5 py-3 text-left">Taille</th>
				<th class="px-5 py-3 text-left">Expiration</th>
				<th class="px-5 py-3 text-left w-20"></th>
			</tr>
		</thead>
		<tbody>
			{#if filtered.length === 0}
				<tr>
					<td colspan="7" class="py-12 text-center text-slate-400 text-sm">Aucun enregistrement trouvé</td>
				</tr>
			{:else}
				{#each filtered as rec}
					{@const days = daysLeft(rec.expiresAt)}
					<tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group">
						<td class="px-5 py-4">
							<button
								aria-label="Lire"
								onclick={() => playing = playing === rec.id ? null : rec.id}
								class="w-9 h-9 rounded-xl flex items-center justify-center transition-all
									{playing === rec.id
										? 'bg-primary text-white shadow-md shadow-primary/25'
										: 'bg-slate-100 text-slate-500 hover:bg-primary hover:text-white'}"
							>
								<span class="material-icons text-[18px]">{playing === rec.id ? 'pause' : 'play_arrow'}</span>
							</button>
						</td>
						<td class="px-5 py-4 max-w-[260px]">
							<p class="text-sm font-medium text-slate-800 truncate">{rec.title}</p>
							<p class="text-xs text-slate-400">{formatDate(rec.dateTs)} • {rec.dateTs.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
						</td>
						<td class="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">{rec.camera}</td>
						<td class="px-5 py-4 text-xs font-medium text-slate-600 whitespace-nowrap">{formatDuration(rec.durationSec)}</td>
						<td class="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">{rec.sizeMb} MB</td>
						<td class="px-5 py-4">
							<span class="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap {expiryClass(days)}">
								{days <= 0 ? 'Expiré' : `J-${days}`}
							</span>
						</td>
						<td class="px-5 py-4">
							<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<button aria-label="Télécharger" class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
									<span class="material-icons text-[16px]">download</span>
								</button>
								<button
									aria-label="Supprimer"
									onclick={() => deleteTarget = rec.id}
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
	{@const rec = allRecordings.find(r => r.id === deleteTarget)}
	<DeleteModal
		label={rec ? `"${rec.title}"` : 'cet enregistrement'}
		onconfirm={() => { deleteTarget = null; }}
		oncancel={() => { deleteTarget = null; }}
	/>
{/if}

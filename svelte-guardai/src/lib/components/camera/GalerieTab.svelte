<script lang="ts">
	import Datepicker from '$lib/components/Datepicker.svelte';
	import Timepicker from '$lib/components/Timepicker.svelte';
	import TabBar from '$lib/components/TabBar.svelte';

	type Photo = {
		id: number;
		label: string;
		camera: 'Entrée' | 'Garage' | 'Porte arrière';
		dateTs: Date;
		color: string;
		expiresAt: Date;
	};

	const now = new Date();
	const d = (days: number) => new Date(now.getTime() - days * 86400000);
	const exp = (days: number) => new Date(now.getTime() + days * 86400000);

	const allPhotos: Photo[] = [
		{ id: 1,  label: 'Mouvement détecté - Allée',    camera: 'Entrée',        dateTs: d(0), color: '#2d4a6a', expiresAt: exp(3)  },
		{ id: 2,  label: 'Colis déposé',                 camera: 'Entrée',        dateTs: d(0), color: '#3a5c3a', expiresAt: exp(4)  },
		{ id: 3,  label: 'Voiture garée',                camera: 'Garage',        dateTs: d(0), color: '#4a3a2a', expiresAt: exp(12) },
		{ id: 4,  label: 'Alerte - Entrée nocturne',     camera: 'Entrée',        dateTs: d(1), color: '#1e3a2a', expiresAt: exp(5)  },
		{ id: 5,  label: 'Visiteur - Porte arrière',     camera: 'Porte arrière', dateTs: d(1), color: '#3a2a4a', expiresAt: exp(8)  },
		{ id: 6,  label: 'Mouvement détecté',            camera: 'Porte arrière', dateTs: d(1), color: '#2a3a4a', expiresAt: exp(2)  },
		{ id: 7,  label: 'Portail ouvert',               camera: 'Garage',        dateTs: d(2), color: '#4a4a2a', expiresAt: exp(15) },
		{ id: 8,  label: 'Livraison colis',              camera: 'Entrée',        dateTs: d(2), color: '#2a4a3a', expiresAt: exp(6)  },
		{ id: 9,  label: 'Mouvement nocturne',           camera: 'Porte arrière', dateTs: d(3), color: '#3a2a2a', expiresAt: exp(1)  },
		{ id: 10, label: 'Véhicule inconnu',             camera: 'Garage',        dateTs: d(4), color: '#2a3a2a', expiresAt: exp(4)  },
	];

	let activeCamera = $state<'Tous' | 'Entrée' | 'Garage' | 'Porte arrière'>('Tous');
	let sortBy = $state<'date' | 'expiration'>('date');
	let sortDir = $state<'asc' | 'desc'>('desc');
	let filterDate = $state('');
	let filterTime = $state('');
	let sortOpen = $state(false);
	let selected = $state<number | null>(null);

	const sortOptions = [
		{ value: 'date',       label: "Date d'ajout" },
		{ value: 'expiration', label: 'Expiration'   },
	] as const;

	const filtered = $derived.by(() => {
		let list = allPhotos.filter(p => {
			if (activeCamera !== 'Tous' && p.camera !== activeCamera) return false;
			if (filterDate) {
				const from = new Date(filterDate);
				const to = new Date(filterDate);
				to.setHours(23, 59, 59);
				if (p.dateTs < from || p.dateTs > to) return false;
			}
			if (filterTime) {
				const [h, m] = filterTime.split(':').map(Number);
				const recTotal = p.dateTs.getHours() * 60 + p.dateTs.getMinutes();
				const filterTotal = h * 60 + m;
				if (Math.abs(recTotal - filterTotal) > 30) return false;
			}
			return true;
		});

		return [...list].sort((a, b) => {
			const diff = sortBy === 'date'
				? a.dateTs.getTime() - b.dateTs.getTime()
				: a.expiresAt.getTime() - b.expiresAt.getTime();
			return sortDir === 'desc' ? -diff : diff;
		});
	});

	const totalPhotos     = allPhotos.length;
	const last24h         = allPhotos.filter(p => p.dateTs >= d(1)).length;
	const expiringSoon    = allPhotos.filter(p => daysLeft(p.expiresAt) <= 5).length;
	const totalSizeMb     = 85;

	function daysLeft(date: Date): number {
		return Math.ceil((date.getTime() - now.getTime()) / 86400000);
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
		{ icon: 'photo_library', iconBg: 'bg-teal-50',   iconColor: 'text-teal-500',   label: 'Total photos',      value: totalPhotos.toString()    },
		{ icon: 'storage',       iconBg: 'bg-blue-50',   iconColor: 'text-blue-500',   label: 'Stockage utilisé',  value: `${totalSizeMb} MB`        },
		{ icon: 'schedule',      iconBg: 'bg-purple-50', iconColor: 'text-purple-500', label: 'Dernières 24h',     value: last24h.toString()         },
		{ icon: 'timer_off',     iconBg: 'bg-red-50',    iconColor: 'text-red-400',    label: 'Expiration proche', value: expiringSoon.toString()    },
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
			<button onclick={() => { filterDate = ''; filterTime = ''; }} class="text-slate-400 hover:text-red-400 transition-colors" aria-label="Effacer">
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
				<div class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 min-w-[160px]">
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
			<span class="material-icons text-[18px]">photo_library</span>
			<span>{filtered.length} photos</span>
		</div>
	</div>
</div>

{#if filtered.length === 0}
	<div class="py-12 text-center text-slate-400 text-sm">Aucune photo trouvée</div>
{:else}
	<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
		{#each filtered as photo}
			{@const days = daysLeft(photo.expiresAt)}
			<div
				role="button"
				tabindex="0"
				class="group relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all
					{selected === photo.id ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent hover:border-primary/40'}"
				onclick={() => selected = selected === photo.id ? null : photo.id}
				onkeydown={(e) => e.key === 'Enter' && (selected = selected === photo.id ? null : photo.id)}
			>
				<div class="aspect-video w-full" style="background-color: {photo.color};">
					<svg class="w-full h-full opacity-30" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
						<rect x="100" y="70" width="120" height="80" fill="white" rx="2" opacity="0.4"/>
						<polygon points="90,70 160,30 230,70" fill="white" opacity="0.3"/>
						<rect x="140" y="110" width="24" height="40" fill="white" opacity="0.5"/>
						<rect x="108" y="80" width="28" height="22" fill="white" opacity="0.6"/>
						<rect x="184" y="80" width="28" height="22" fill="white" opacity="0.6"/>
					</svg>
				</div>

				<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
					<span class="material-icons text-white text-3xl">zoom_in</span>
				</div>

				<div class="absolute top-2 right-2">
					<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full {expiryClass(days)}">
						{days <= 0 ? 'Expiré' : `J-${days}`}
					</span>
				</div>

				<div class="bg-white px-3 py-2">
					<p class="text-xs font-medium text-slate-700 truncate">{photo.label}</p>
					<p class="text-[11px] text-slate-400">{formatDate(photo.dateTs)} • {photo.dateTs.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
				</div>
			</div>
		{/each}
	</div>
{/if}

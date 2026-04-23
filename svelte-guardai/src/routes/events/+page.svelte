<script lang="ts">
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import DateTimePicker from '$lib/components/DateTimePicker.svelte';
	import TabBar from '$lib/components/TabBar.svelte';

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return { destroy() { node.remove(); } };
	}

	type Event = {
		id: string;
		title: string;
		start: Date;
		end: Date;
		description: string;
		enabled: boolean;
		disableNotification: boolean;
		disableCamera: boolean;
		disableAI: boolean;
	};

	const now = new Date();
	const future = (days: number, h = 10, m = 0) => {
		const d = new Date(now);
		d.setDate(d.getDate() + days);
		d.setHours(h, m, 0, 0);
		return d;
	};
	const past = (days: number, h = 10, m = 0) => {
		const d = new Date(now);
		d.setDate(d.getDate() - days);
		d.setHours(h, m, 0, 0);
		return d;
	};

	let events = $state<Event[]>([
		{ id: '1', title: 'Réunion de famille', start: future(2, 14, 0),  end: future(2, 18, 0),  description: 'Grande réunion familiale dans le jardin.', enabled: true,  disableNotification: true,  disableCamera: false, disableAI: false },
		{ id: '2', title: 'Soirée barbecue',    start: future(5, 19, 0),  end: future(5, 23, 0),  description: 'Soirée entre amis, désactivation des alertes.', enabled: true,  disableNotification: true,  disableCamera: false, disableAI: true  },
		{ id: '3', title: 'Livraison prévue',   start: future(1, 9, 0),   end: future(1, 12, 0),  description: 'Livraison colis — accès garage autorisé.', enabled: true,  disableNotification: false, disableCamera: false, disableAI: false },
		{ id: '4', title: 'Absence longue',     start: future(10, 8, 0),  end: future(17, 20, 0), description: 'Vacances — surveillance maximale.', enabled: false, disableNotification: false, disableCamera: false, disableAI: false },
		{ id: '5', title: 'Maintenance jardin', start: past(1, 10, 0),    end: past(1, 16, 0),    description: 'Jardinier prévu — caméra désactivée zone jardin.', enabled: false, disableNotification: false, disableCamera: true,  disableAI: false },
	]);

	let showModal    = $state(false);
	let deleteTarget = $state<string | null>(null);
	let modalVisible = $state(false);
	let editingId    = $state<string | null>(null);
	let fTitle       = $state('');
	let fStart       = $state('');
	let fEnd         = $state('');
	let fDesc        = $state('');
	let fEnabled     = $state(true);
	let fNotif       = $state(false);
	let fCamera      = $state(false);
	let fAI          = $state(false);

	let filterStatus = $state<'all' | 'upcoming' | 'past'>('all');
	let searchQ      = $state('');

	const filtered = $derived.by(() => {
		return events
			.filter(e => {
				if (filterStatus === 'upcoming' && e.end < now) return false;
				if (filterStatus === 'past'     && e.end >= now) return false;
				if (searchQ && !e.title.toLowerCase().includes(searchQ.toLowerCase())) return false;
				return true;
			})
			.sort((a, b) => {
				if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
				return a.start.getTime() - b.start.getTime();
			});
	});

	const activeCount   = $derived(events.filter(e => e.enabled).length);
	const inactiveCount = $derived(events.filter(e => !e.enabled).length);
	const upcomingCount = $derived(events.filter(e => e.end >= now && e.enabled).length);

	function isUpcoming(e: Event) { return e.start > now; }
	function isOngoing(e: Event)  { return e.start <= now && e.end >= now; }

	function statusLabel(e: Event) {
		if (!e.enabled)    return { label: 'Inactif',   cls: 'bg-slate-100 text-slate-400' };
		if (isOngoing(e))  return { label: 'En cours',  cls: 'bg-green-100 text-green-700' };
		if (isUpcoming(e)) return { label: 'À venir',   cls: 'bg-blue-100 text-blue-700'  };
		return                    { label: 'Terminé',   cls: 'bg-slate-100 text-slate-500' };
	}

	function formatDate(d: Date) {
		return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
	}
	function formatTime(d: Date) {
		return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
	}
	function toDatetimeLocal(d: Date) {
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
	}

	function toggleEvent(id: string) {
		events = events.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e);
	}

	function openNew() {
		editingId = null;
		fTitle = ''; fStart = ''; fEnd = ''; fDesc = '';
		fEnabled = true; fNotif = false; fCamera = false; fAI = false;
		showModal = true;
		requestAnimationFrame(() => modalVisible = true);
	}

	function openEdit(e: Event) {
		editingId   = e.id;
		fTitle      = e.title;
		fStart      = toDatetimeLocal(e.start);
		fEnd        = toDatetimeLocal(e.end);
		fDesc       = e.description;
		fEnabled    = e.enabled;
		fNotif      = e.disableNotification;
		fCamera     = e.disableCamera;
		fAI         = e.disableAI;
		showModal   = true;
		requestAnimationFrame(() => modalVisible = true);
	}

	function closeModal() {
		modalVisible = false;
		setTimeout(() => showModal = false, 250);
	}

	function saveEvent() {
		if (!fTitle || !fStart || !fEnd) return;
		const ev: Event = {
			id: editingId ?? Date.now().toString(),
			title: fTitle,
			start: new Date(fStart),
			end:   new Date(fEnd),
			description: fDesc,
			enabled: fEnabled,
			disableNotification: fNotif,
			disableCamera: fCamera,
			disableAI: fAI,
		};
		if (editingId) {
			events = events.map(e => e.id === editingId ? ev : e);
		} else {
			events = [...events, ev];
		}
		closeModal();
	}

	function deleteEvent(id: string) {
		events = events.filter(e => e.id !== id);
	}

	function trackStyle(on: boolean) {
		return `position:relative; display:inline-block; width:40px; height:22px; border-radius:999px; background:${on ? '#13b9a5' : '#cbd5e1'}; transition:background 0.2s; cursor:pointer; border:none; padding:0; flex-shrink:0;`;
	}
	function thumbStyle(on: boolean) {
		return `position:absolute; top:2px; left:2px; width:18px; height:18px; border-radius:50%; background:white; box-shadow:0 1px 3px rgba(0,0,0,0.25); transition:transform 0.2s; transform:translateX(${on ? '18px' : '0px'}); display:block;`;
	}
</script>

<svelte:head>
	<title>Événements - Guard AI</title>
</svelte:head>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape') closeModal(); }} />

<div>
	<h1 class="text-2xl font-semibold text-slate-800">Événements</h1>
	<p class="text-slate-400 text-sm mt-0.5">Planifiez et gérez les événements affectant votre système</p>
</div>

<!-- KPIs -->
<div class="grid grid-cols-3 gap-4">
	{#each [
		{ icon: 'event_available', iconBg: 'bg-teal-50',  iconColor: 'text-teal-500',  label: 'Événements actifs',   value: activeCount.toString()   },
		{ icon: 'event_busy',      iconBg: 'bg-slate-50', iconColor: 'text-slate-400', label: 'Événements inactifs', value: inactiveCount.toString() },
		{ icon: 'upcoming',        iconBg: 'bg-blue-50',  iconColor: 'text-blue-500',  label: 'À venir (actifs)',    value: upcomingCount.toString() },
	] as kpi}
		<div class="bg-white rounded-[20px] p-4 sm:p-5 shadow-soft border border-slate-100 flex flex-col gap-3">
			<div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl {kpi.iconBg} flex items-center justify-center {kpi.iconColor}">
				<span class="material-icons text-[20px] sm:text-[22px]">{kpi.icon}</span>
			</div>
			<div>
				<p class="text-slate-400 text-xs sm:text-sm">{kpi.label}</p>
				<p class="text-xl sm:text-2xl font-bold text-slate-800">{kpi.value}</p>
			</div>
		</div>
	{/each}
</div>

<!-- Controls -->
<div class="flex flex-col gap-3">
	<!-- Search pleine largeur -->
	<div class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-soft">
		<span class="material-icons text-[16px] text-slate-400">search</span>
		<input
			type="text"
			bind:value={searchQ}
			placeholder="Rechercher un événement…"
			class="bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 flex-1"
		/>
		{#if searchQ}
			<button onclick={() => searchQ = ''} class="text-slate-400 hover:text-slate-600">
				<span class="material-icons text-[16px]">close</span>
			</button>
		{/if}
	</div>

	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
		<!-- Mobile : pleine largeur avec stretch -->
		<div class="sm:hidden w-full">
			<TabBar
				tabs={[{ value: 'all', label: 'Tous' }, { value: 'upcoming', label: 'À venir' }, { value: 'past', label: 'Terminés' }]}
				active={filterStatus}
				onchange={(v) => filterStatus = v as typeof filterStatus}
				stretch={true}
			/>
		</div>
		<!-- Desktop : w-fit sans stretch -->
		<div class="hidden sm:block w-fit">
			<TabBar
				tabs={[{ value: 'all', label: 'Tous' }, { value: 'upcoming', label: 'À venir' }, { value: 'past', label: 'Terminés' }]}
				active={filterStatus}
				onchange={(v) => filterStatus = v as typeof filterStatus}
			/>
		</div>

		<!-- New event button -->
		<button
			onclick={openNew}
			class="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-dark transition-all"
		>
			<span class="material-icons text-[18px]">add</span>
			Nouvel événement
		</button>
	</div>
</div>

<!-- Tableau desktop -->
<div class="hidden sm:block bg-white rounded-[20px] shadow-soft border border-slate-100 overflow-hidden">
	<table class="w-full">
		<thead>
			<tr class="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
				<th class="px-5 py-3 text-left">Événement</th>
				<th class="px-5 py-3 text-left">Date</th>
				<th class="px-5 py-3 text-left">Horaire</th>
				<th class="px-5 py-3 text-left">Paramètres</th>
				<th class="px-5 py-3 text-left">Statut</th>
				<th class="px-5 py-3 text-left">Activer</th>
				<th class="px-5 py-3 text-left w-20"></th>
			</tr>
		</thead>
		<tbody>
			{#if filtered.length === 0}
				<tr>
					<td colspan="7" class="py-12 text-center text-slate-400 text-sm">Aucun événement trouvé</td>
				</tr>
			{:else}
				{#each filtered as ev (ev.id)}
					{@const st = statusLabel(ev)}
					<tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group {!ev.enabled ? 'opacity-50' : ''}">
						<td class="px-5 py-4 max-w-[260px]">
							<div class="flex items-center gap-3">
								<div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0
									{!ev.enabled ? 'bg-slate-100' : isOngoing(ev) ? 'bg-green-50' : isUpcoming(ev) ? 'bg-blue-50' : 'bg-slate-100'}">
									<span class="material-icons text-[18px]
										{!ev.enabled ? 'text-slate-300' : isOngoing(ev) ? 'text-green-500' : isUpcoming(ev) ? 'text-blue-500' : 'text-slate-400'}">event</span>
								</div>
								<div>
									<p class="text-sm font-semibold text-slate-800 truncate">{ev.title}</p>
									{#if ev.description}
										<p class="text-xs text-slate-400 truncate max-w-[200px]">{ev.description}</p>
									{/if}
								</div>
							</div>
						</td>
						<td class="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
							<span class="flex items-center gap-1">
								<span class="material-icons text-[14px] text-slate-400">calendar_today</span>
								{formatDate(ev.start)}
							</span>
						</td>
						<td class="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
							<span class="flex items-center gap-1">
								<span class="material-icons text-[14px] text-slate-400">schedule</span>
								{formatTime(ev.start)} – {formatTime(ev.end)}
							</span>
						</td>
						<td class="px-5 py-4">
							<div class="flex gap-1 flex-wrap">
								{#if ev.disableNotification}
									<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Notifs off</span>
								{/if}
								{#if ev.disableCamera}
									<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Caméra off</span>
								{/if}
								{#if ev.disableAI}
									<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">IA off</span>
								{/if}
								{#if !ev.disableNotification && !ev.disableCamera && !ev.disableAI}
									<span class="text-[10px] text-slate-400">—</span>
								{/if}
							</div>
						</td>
						<td class="px-5 py-4">
							<span class="text-[11px] font-semibold px-2.5 py-1 rounded-full {st.cls}">{st.label}</span>
						</td>
						<td class="px-5 py-4">
							<button
								role="switch"
								aria-checked={ev.enabled}
								aria-label="Activer/désactiver {ev.title}"
								onclick={() => toggleEvent(ev.id)}
								style={trackStyle(ev.enabled)}
							><span style={thumbStyle(ev.enabled)}></span></button>
						</td>
						<td class="px-5 py-4">
							<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									aria-label="Modifier"
									onclick={() => openEdit(ev)}
									class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
								>
									<span class="material-icons text-[16px]">edit</span>
								</button>
								<button
									aria-label="Supprimer"
									onclick={() => deleteTarget = ev.id}
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

<!-- Cards mobile -->
<div class="sm:hidden flex flex-col gap-3">
	{#if filtered.length === 0}
		<p class="py-12 text-center text-slate-400 text-sm">Aucun événement trouvé</p>
	{:else}
		{#each filtered as ev (ev.id)}
			{@const st = statusLabel(ev)}
			<div class="bg-white rounded-2xl shadow-soft border border-slate-100 p-4 {!ev.enabled ? 'opacity-50' : ''}">
				<div class="flex items-start gap-3">
					<div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0
						{!ev.enabled ? 'bg-slate-100' : isOngoing(ev) ? 'bg-green-50' : isUpcoming(ev) ? 'bg-blue-50' : 'bg-slate-100'}">
						<span class="material-icons text-[20px]
							{!ev.enabled ? 'text-slate-300' : isOngoing(ev) ? 'text-green-500' : isUpcoming(ev) ? 'text-blue-500' : 'text-slate-400'}">event</span>
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center justify-between gap-2">
							<p class="text-sm font-semibold text-slate-800 truncate">{ev.title}</p>
							<span class="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 {st.cls}">{st.label}</span>
						</div>
						{#if ev.description}
							<p class="text-xs text-slate-400 mt-0.5 truncate">{ev.description}</p>
						{/if}
						<p class="text-xs text-slate-400 mt-1">
							{formatDate(ev.start)} · {formatTime(ev.start)} – {formatTime(ev.end)}
						</p>
						<div class="flex gap-1 mt-2 flex-wrap">
							{#if ev.disableNotification}
								<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Notifs off</span>
							{/if}
							{#if ev.disableCamera}
								<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Caméra off</span>
							{/if}
							{#if ev.disableAI}
								<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">IA off</span>
							{/if}
						</div>
					</div>
				</div>
				<div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
					<div class="flex gap-2">
						<button
							aria-label="Modifier"
							onclick={() => openEdit(ev)}
							class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"
						>
							<span class="material-icons text-[16px]">edit</span>
						</button>
						<button
							aria-label="Supprimer"
							onclick={() => deleteTarget = ev.id}
							class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-red-400"
						>
							<span class="material-icons text-[16px]">delete_outline</span>
						</button>
					</div>
					<button
						role="switch"
						aria-checked={ev.enabled}
						aria-label="Activer/désactiver {ev.title}"
						onclick={() => toggleEvent(ev.id)}
						style={trackStyle(ev.enabled)}
					><span style={thumbStyle(ev.enabled)}></span></button>
				</div>
			</div>
		{/each}
	{/if}
</div>

<!-- Modal -->
{#if showModal}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div
		use:portal
		class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
		style="transition: opacity 0.25s ease; opacity: {modalVisible ? 1 : 0};"
		onclick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
	>
		<div class="absolute inset-0 bg-black/40 backdrop-blur-sm" style="pointer-events: none;"></div>

		<div
			class="relative bg-white rounded-t-[24px] sm:rounded-[24px] shadow-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto"
			style="transition: transform 0.25s ease, opacity 0.25s ease; transform: {modalVisible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)'}; opacity: {modalVisible ? 1 : 0};"
		>
			<div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
				<h2 class="text-lg font-semibold text-slate-800">
					{editingId ? "Modifier l'événement" : 'Nouvel événement'}
				</h2>
				<button onclick={closeModal} class="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
					<span class="material-icons text-[20px]">close</span>
				</button>
			</div>

			<div class="p-6 flex flex-col gap-4">
				<div class="flex flex-col gap-1.5">
					<label class="text-sm font-medium text-slate-700">Titre</label>
					<input
						type="text"
						bind:value={fTitle}
						placeholder="Ex: Réunion de famille"
						class="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
					/>
				</div>

				<DateTimePicker bind:value={fStart} label="Début" />
				<DateTimePicker bind:value={fEnd} label="Fin" />

				<div class="flex flex-col gap-1.5">
					<label class="text-sm font-medium text-slate-700">Description</label>
					<textarea
						bind:value={fDesc}
						rows="3"
						placeholder="Décrivez l'événement…"
						class="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
					></textarea>
				</div>

				<div class="flex items-center justify-between px-4 py-3 border border-slate-100 rounded-xl">
					<div>
						<p class="text-sm font-medium text-slate-700">Activer l'événement</p>
						<p class="text-xs text-slate-400">L'événement sera pris en compte par le système</p>
					</div>
					<button
						role="switch"
						aria-checked={fEnabled}
						onclick={() => fEnabled = !fEnabled}
						style={trackStyle(fEnabled)}
					><span style={thumbStyle(fEnabled)}></span></button>
				</div>

				<div class="flex flex-col gap-1.5">
					<label class="text-sm font-medium text-slate-700">Paramètres pendant l'événement</label>
					<div class="flex flex-col border border-slate-100 rounded-xl overflow-hidden">
						{#each [
							{ label: 'Désactiver les notifications', sublabel: 'Aucune alerte ne sera envoyée', key: 'notif'  },
							{ label: 'Désactiver la caméra',         sublabel: 'Enregistrement mis en pause',  key: 'camera' },
							{ label: "Désactiver l'IA",              sublabel: 'Détection intelligente off',   key: 'ai'     },
						] as row}
							<div class="flex items-center justify-between px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
								<div>
									<p class="text-sm font-medium text-slate-700">{row.label}</p>
									<p class="text-xs text-slate-400">{row.sublabel}</p>
								</div>
								<button
									role="switch"
									aria-checked={row.key === 'notif' ? fNotif : row.key === 'camera' ? fCamera : fAI}
									onclick={() => {
										if (row.key === 'notif')  fNotif  = !fNotif;
										if (row.key === 'camera') fCamera = !fCamera;
										if (row.key === 'ai')     fAI     = !fAI;
									}}
									style={trackStyle(row.key === 'notif' ? fNotif : row.key === 'camera' ? fCamera : fAI)}
								><span style={thumbStyle(row.key === 'notif' ? fNotif : row.key === 'camera' ? fCamera : fAI)}></span></button>
							</div>
						{/each}
					</div>
				</div>

				<div class="flex gap-3 pt-2">
					<button
						onclick={closeModal}
						class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
					>Annuler</button>
					<button
						onclick={saveEvent}
						class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-dark transition-all"
					>{editingId ? 'Mettre à jour' : 'Enregistrer'}</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if deleteTarget}
	{@const ev = events.find(e => e.id === deleteTarget)}
	<DeleteModal
		label={ev?.title ?? 'cet événement'}
		onconfirm={() => { deleteEvent(deleteTarget!); deleteTarget = null; }}
		oncancel={() => { deleteTarget = null; }}
	/>
{/if}

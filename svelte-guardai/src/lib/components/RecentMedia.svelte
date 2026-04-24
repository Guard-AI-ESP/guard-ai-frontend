<script lang="ts">
	import TabBar from '$lib/components/TabBar.svelte';

	let activeTab = $state('Videos');

	const videos = [
		{ title: 'Mouvement détecté - Allée',         subtitle: "Aujourd'hui 14:15 • 30s" },
		{ title: 'Entrée principale - Colis déposé',  subtitle: "Aujourd'hui 12:40 • 45s" },
		{ title: 'Portail latéral - Mouvement',       subtitle: "Aujourd'hui 09:12 • 20s" },
	];

	const photos = [
		{ title: 'Capture entrée principale',         subtitle: "Aujourd'hui 14:15" },
		{ title: 'Capture allée',                     subtitle: "Aujourd'hui 12:40" },
	];

	const items = $derived(activeTab === 'Videos' ? videos : photos);
</script>

<div class="bg-white rounded-[20px] p-5 shadow-soft border border-slate-100">
	<div class="flex items-center justify-between mb-4">
		<div class="flex items-center gap-2">
			<span class="material-icons text-primary text-[20px]">history</span>
			<h2 class="text-base font-semibold text-slate-800">Médias récents</h2>
		</div>
		<TabBar
			tabs={[
				{ value: 'Videos', label: 'Vidéos' },
				{ value: 'Photos', label: 'Photos' },
			]}
			active={activeTab}
			onchange={(v) => activeTab = v}
		/>
	</div>

	<div class="flex flex-col divide-y divide-slate-50">
		{#each items as item}
			<div class="flex items-center gap-3 py-3 group cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors">
				<div class="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
					<span class="material-icons text-[18px]">{activeTab === 'Videos' ? 'videocam' : 'photo_camera'}</span>
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-slate-700 truncate">{item.title}</p>
					<p class="text-xs text-slate-400">{item.subtitle}</p>
				</div>
				<span class="material-icons text-slate-300 text-[18px] group-hover:text-slate-400 transition-colors">chevron_right</span>
			</div>
		{/each}
	</div>
</div>

<script lang="ts">
	import TabBar from '$lib/components/TabBar.svelte';

	let activeTab = $state('Activité');

	const activities = [
		{
			icon: 'login',
			iconBg: 'bg-blue-100 dark:bg-blue-900/30',
			iconColor: 'text-blue-600',
			title: 'Connexion client',
			date: '24 Nov',
			description: 'Connexion réussie depuis IP 192.168.1.1',
			dot: false,
			faded: false,
		},
		{
			icon: 'build',
			iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
			iconColor: 'text-yellow-600',
			title: 'Maintenance planifiée',
			date: '23 Nov',
			description: 'Système mis à jour vers v2.4.1',
			dot: false,
			faded: false,
		},
		{
			icon: 'videocam_off',
			iconBg: 'bg-red-100 dark:bg-red-900/30',
			iconColor: 'text-red-600',
			title: 'Caméra hors ligne',
			date: '20 Nov',
			description: 'Cam 02 Entrée arrière déconnectée',
			dot: true,
			faded: false,
		},
		{
			icon: 'directions_run',
			iconBg: 'bg-primary/20',
			iconColor: 'text-primary',
			title: 'Mouvement détecté',
			date: '19 Nov',
			description: 'Capteur de mouvement Zone 4 déclenché',
			dot: false,
			faded: false,
		},
		{
			icon: 'check_circle',
			iconBg: 'bg-slate-100 dark:bg-slate-700',
			iconColor: 'text-slate-500',
			title: 'Vérification système',
			date: '18 Nov',
			description: 'Diagnostics hebdomadaires réussis',
			dot: false,
			faded: true,
		},
	];
</script>

<div class="glass-panel rounded-[24px] shadow-glass h-full flex flex-col overflow-hidden border border-white/60 dark:border-white/10">
	<div class="m-4">
		<TabBar
			tabs={[
				{ value: 'Activité', label: 'Activité' },
				{ value: 'Journaux', label: 'Journaux' },
			]}
			active={activeTab}
			onchange={(v) => activeTab = v}
		/>
	</div>

	<div class="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
		{#each activities as item}
			<div class="flex gap-4 items-start group cursor-pointer p-2 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors {item.faded ? 'opacity-60' : ''}">
				<div class="w-10 h-10 rounded-full {item.iconBg} {item.iconColor} flex-shrink-0 flex items-center justify-center relative">
					{#if item.dot}
						<span class="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
					{/if}
					<span class="material-icons text-lg">{item.icon}</span>
				</div>
				<div class="flex-1 pt-0.5">
					<div class="flex justify-between items-center mb-0.5">
						<h4 class="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.title}</h4>
						<span class="text-xs text-slate-400">{item.date}</span>
					</div>
					<p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{item.description}</p>
				</div>
			</div>
		{/each}
	</div>

	<div class="p-4 border-t border-slate-100 dark:border-white/5">
		<button class="w-full py-2 text-xs font-semibold text-primary uppercase tracking-wider hover:bg-primary/5 rounded-lg transition-colors">
			Voir tout l'historique
		</button>
	</div>
</div>

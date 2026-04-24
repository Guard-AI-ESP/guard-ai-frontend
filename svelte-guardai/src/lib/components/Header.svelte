<script lang="ts">
	function getGreeting() {
		const h = new Date().getHours();
		if (h < 12) return 'Bonjour';
		if (h < 18) return 'Bon après-midi';
		return 'Bonsoir';
	}

	let now = new Date();
	let timeStr = $state(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
	const dateStr = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

	$effect(() => {
		const interval = setInterval(() => {
			timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
		}, 1000);
		return () => clearInterval(interval);
	});
</script>

<header class="flex justify-between items-end">
	<div>
		<h2 class="text-3xl font-light text-slate-800 dark:text-white tracking-tight">
			{getGreeting()}, <span class="font-semibold">John</span>
		</h2>
		<p class="text-slate-500 dark:text-slate-400 mt-1">Voici ce qui se passe sur votre propriété aujourd'hui.</p>
	</div>
	<div class="flex items-center gap-4">
		<button
			aria-label="Notifications"
			class="w-10 h-10 rounded-full bg-white dark:bg-white/5 shadow-soft hover:shadow-md transition-shadow flex items-center justify-center text-slate-400 hover:text-primary"
		>
			<span class="material-icons">notifications_none</span>
		</button>
		<div class="text-right hidden sm:block">
			<p class="text-sm font-medium text-slate-900 dark:text-white">{timeStr}</p>
			<p class="text-xs text-slate-500 dark:text-slate-400">{dateStr}</p>
		</div>
	</div>
</header>

<script lang="ts">
	let playing = $state<number | null>(null);

	const messages = [
		{ id: 0, sender: 'Livreur Chronopost', time: 'Il y a 2m',  active: true  },
		{ id: 1, sender: 'Visiteur : Marc',    time: 'Il y a 1h',  active: false },
		{ id: 2, sender: 'Non identifié',      time: 'Hier',       active: false },
	];

	function toggle(id: number) {
		playing = playing === id ? null : id;
	}
</script>

<div class="bg-white rounded-[20px] p-5 shadow-soft border border-slate-100">
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-base font-semibold text-slate-800">Messages audio récents</h2>
		<span class="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">3 Nouveaux</span>
	</div>

	<div class="flex flex-col gap-3">
		{#each messages as msg}
			<div class="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
				<button
					aria-label="Play"
					onclick={() => toggle(msg.id)}
					class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all
						{playing === msg.id
							? 'bg-primary text-white shadow-lg shadow-primary/30'
							: msg.active
								? 'bg-primary text-white shadow-md shadow-primary/20'
								: 'bg-slate-200 text-slate-500 hover:bg-slate-300'}"
				>
					<span class="material-icons text-[18px]">{playing === msg.id ? 'pause' : 'play_arrow'}</span>
				</button>

				<div class="flex-1 min-w-0">
					<div class="flex justify-between items-center mb-1.5">
						<p class="text-sm font-semibold text-slate-700">{msg.sender}</p>
						<span class="text-xs text-slate-400">{msg.time}</span>
					</div>
					<div class="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
						<div
							class="h-full rounded-full transition-all duration-300
								{playing === msg.id ? 'bg-primary animate-pulse' : msg.active ? 'bg-primary w-1/3' : 'bg-slate-300 w-0'}"
							style={playing === msg.id ? 'width: 60%' : msg.active ? 'width: 33%' : 'width: 0%'}
						></div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

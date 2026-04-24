<script lang="ts">
	const items = [
		{ icon: 'videocam',      label: 'Caméras',   status: 'ACTIF',     color: 'text-green-500',  dot: 'bg-green-500'  },
		{ icon: 'settings_input_component', label: 'Interphone', status: 'VEILLE',  color: 'text-amber-500',  dot: 'bg-amber-500'  },
		{ icon: 'doorbell',      label: 'Sonnette',  status: 'EN LIGNE',  color: 'text-green-500',  dot: 'bg-green-500'  },
		{ icon: 'dashboard',     label: 'Système',   status: 'NOMINAL',   color: 'text-green-500',  dot: 'bg-green-500'  },
	];
</script>

<div class="bg-white rounded-[20px] p-5 shadow-soft border border-slate-100">
	<h2 class="text-base font-semibold text-slate-800 mb-4">État du système</h2>
	<div class="grid grid-cols-2 gap-3">
		{#each items as item}
			<div class="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 relative">
				<span class="absolute top-3 left-3 w-2 h-2 rounded-full {item.dot}"></span>
				<span class="material-icons text-slate-400 text-[20px] ml-3">{item.icon}</span>
				<div>
					<p class="text-sm font-medium text-slate-700">{item.label}</p>
					<p class="text-[11px] font-bold tracking-wide {item.color}">{item.status}</p>
				</div>
			</div>
		{/each}
	</div>
</div>

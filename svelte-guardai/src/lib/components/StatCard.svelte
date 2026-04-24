<script lang="ts">
	let {
		iconName,
		iconBg,
		iconColor,
		badge,
		badgePositive,
		label,
		value,
		sparkline = false,
	}: {
		iconName: string;
		iconBg: string;
		iconColor: string;
		badge?: string;
		badgePositive?: boolean;
		label: string;
		value: string;
		sparkline?: boolean;
	} = $props();
</script>

<div class="bg-white rounded-[20px] p-5 shadow-soft hover:shadow-lg transition-all duration-300 border border-slate-100 flex flex-col gap-4">
	<div class="flex items-start justify-between">
		<div class="w-11 h-11 rounded-2xl {iconBg} flex items-center justify-center {iconColor}">
			<span class="material-icons text-[22px]">{iconName}</span>
		</div>

		{#if sparkline}
			<svg class="w-16 h-8" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<polyline
					points="0,28 10,20 20,24 32,10 44,16 54,6 64,12"
					stroke="#13b9a5"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					fill="none"
				/>
			</svg>
		{:else if badge}
			<span class="text-xs font-semibold flex items-center gap-0.5
				{badgePositive ? 'text-green-500' : 'text-red-400'}">
				<span class="material-icons text-[13px]">{badgePositive ? 'arrow_upward' : 'arrow_downward'}</span>
				{badge}
			</span>
		{/if}
	</div>

	<div>
		<p class="text-slate-400 text-sm mb-1">{label}</p>
		<p class="text-2xl font-bold text-slate-800">{value}</p>
	</div>
</div>

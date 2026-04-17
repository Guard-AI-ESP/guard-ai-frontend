<script lang="ts">
	let nat             = $state(true);
	let bridgeWifi      = $state(false);
	let trafficForward  = $state(true);
	let saved           = $state(false);

	function trackStyle(on: boolean) {
		return `display:inline-flex;align-items:center;width:44px;height:24px;border-radius:9999px;padding:2px;transition:background 0.2s;background:${on ? '#13b9a5' : '#e2e8f0'};cursor:pointer;`;
	}
	function thumbStyle(on: boolean) {
		return `width:20px;height:20px;border-radius:9999px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:transform 0.2s;transform:translateX(${on ? '20px' : '0px'});`;
	}

	function save() {
		saved = true;
		setTimeout(() => { saved = false; }, 2000);
	}
</script>

<svelte:head>
	<title>Pare-feu - Guard AI</title>
</svelte:head>

<!-- Page header -->
<div>
	<div class="flex items-center gap-2 text-slate-400 text-sm mb-1">
		<a href="/cyber" class="hover:text-primary transition-colors">Dashboard Cyber</a>
		<span class="material-icons text-[14px]">chevron_right</span>
		<span class="text-slate-600 font-medium">Pare-feu</span>
	</div>
	<h1 class="text-2xl font-semibold text-slate-800">Configuration Pare-feu</h1>
	<p class="text-slate-400 text-sm mt-0.5">R\u00e8gles de s\u00e9curit\u00e9 et filtrage r\u00e9seau</p>
</div>

<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
	<!-- Form -->
	<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-6 flex flex-col gap-0">

		<!-- NAT -->
		<div class="flex items-center justify-between py-5 border-b border-slate-100">
			<div class="flex items-center gap-4">
				<div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
					<span class="material-icons text-[20px]">swap_horiz</span>
				</div>
				<div>
					<p class="text-sm font-medium text-slate-700">NAT (Network Address Translation)</p>
					<p class="text-xs text-slate-400 mt-0.5">Traduit les adresses IP priv\u00e9es en adresse publique pour l'acc\u00e8s Internet</p>
				</div>
			</div>
			<button
				type="button"
				onclick={() => nat = !nat}
				aria-label="Activer/d\u00e9sactiver NAT"
				style={trackStyle(nat)}
				class="shrink-0 ml-4"
			>
				<span style={thumbStyle(nat)}></span>
			</button>
		</div>

		<!-- Bridge WiFi -->
		<div class="flex items-center justify-between py-5 border-b border-slate-100">
			<div class="flex items-center gap-4">
				<div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
					<span class="material-icons text-[20px]">device_hub</span>
				</div>
				<div>
					<p class="text-sm font-medium text-slate-700">Pont d'interface WiFi</p>
					<p class="text-xs text-slate-400 mt-0.5">Connecte le r\u00e9seau WiFi et filaire en un seul segment r\u00e9seau</p>
				</div>
			</div>
			<button
				type="button"
				onclick={() => bridgeWifi = !bridgeWifi}
				aria-label="Activer/d\u00e9sactiver le pont WiFi"
				style={trackStyle(bridgeWifi)}
				class="shrink-0 ml-4"
			>
				<span style={thumbStyle(bridgeWifi)}></span>
			</button>
		</div>

		<!-- Transfert de trafic -->
		<div class="flex items-center justify-between py-5">
			<div class="flex items-center gap-4">
				<div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
					<span class="material-icons text-[20px]">route</span>
				</div>
				<div>
					<p class="text-sm font-medium text-slate-700">Transfert de trafic</p>
					<p class="text-xs text-slate-400 mt-0.5">Autorise le routage de paquets entre les interfaces r\u00e9seau</p>
				</div>
			</div>
			<button
				type="button"
				onclick={() => trafficForward = !trafficForward}
				aria-label="Activer/d\u00e9sactiver le transfert de trafic"
				style={trackStyle(trafficForward)}
				class="shrink-0 ml-4"
			>
				<span style={thumbStyle(trafficForward)}></span>
			</button>
		</div>

		<!-- Save -->
		<div class="flex justify-end pt-4 border-t border-slate-100">
			<button
				type="button"
				onclick={save}
				class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all {saved ? 'bg-green-500 text-white' : 'bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-dark'}"
			>
				<span class="material-icons text-[18px]">{saved ? 'check' : 'save'}</span>
				{saved ? 'Enregistr\u00e9 !' : 'Enregistrer'}
			</button>
		</div>
	</div>

	<!-- Status panel -->
	<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-5 flex flex-col gap-4 h-fit">
		<div class="flex items-center gap-3 pb-3 border-b border-slate-100">
			<div class="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
				<span class="material-icons text-[18px]">shield</span>
			</div>
			<p class="text-sm font-semibold text-slate-800">\u00c9tat du pare-feu</p>
		</div>
		<div class="flex flex-col gap-3">
			{#each [
				{ label: 'NAT', on: nat },
				{ label: 'Pont WiFi', on: bridgeWifi },
				{ label: 'Transfert de trafic', on: trafficForward },
			] as item}
				<div class="flex items-center justify-between">
					<p class="text-sm text-slate-600">{item.label}</p>
					<span class="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full {item.on ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}">
						<span class="w-1.5 h-1.5 rounded-full {item.on ? 'bg-green-500' : 'bg-slate-400'}"></span>
						{item.on ? 'Activ\u00e9' : 'D\u00e9sactiv\u00e9'}
					</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<script lang="ts">
	let ssid         = $state('GuardAI-Network');
	let broadcasting = $state(true);
	let password     = $state('');
	let showPassword = $state(false);
	let frequency    = $state<'2.4' | '5'>('5');
	let country      = $state('FR');
	let logsEnabled  = $state(true);
	let saved        = $state(false);

	const countries = [
		{ value: 'FR', label: 'France (FR)' },
		{ value: 'US', label: '\u00c9tats-Unis (US)' },
		{ value: 'DE', label: 'Allemagne (DE)' },
		{ value: 'UK', label: 'Royaume-Uni (UK)' },
	];

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
	<title>WiFi - Guard AI</title>
</svelte:head>

<!-- Page header -->
<div>
	<div class="flex items-center gap-2 text-slate-400 text-sm mb-1">
		<a href="/cyber" class="hover:text-primary transition-colors">Dashboard Cyber</a>
		<span class="material-icons text-[14px]">chevron_right</span>
		<span class="text-slate-600 font-medium">WiFi</span>
	</div>
	<h1 class="text-2xl font-semibold text-slate-800">Configuration WiFi</h1>
	<p class="text-slate-400 text-sm mt-0.5">Param\u00e8tres du r\u00e9seau sans fil</p>
</div>

<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
	<!-- Form -->
	<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-6 flex flex-col gap-6">

		<!-- SSID -->
		<div class="flex flex-col gap-1.5">
			<label for="ssid" class="text-sm font-medium text-slate-700">Nom du r\u00e9seau (SSID)</label>
			<input
				id="ssid"
				type="text"
				bind:value={ssid}
				placeholder="Nom du r\u00e9seau WiFi"
				class="block w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl shadow-soft focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400 transition-colors"
			/>
		</div>

		<!-- Broadcasting toggle -->
		<div class="flex items-center justify-between py-1">
			<div>
				<p class="text-sm font-medium text-slate-700">Diffusion du SSID</p>
				<p class="text-xs text-slate-400">Rendre le r\u00e9seau visible aux appareils \u00e0 proximit\u00e9</p>
			</div>
			<button
				type="button"
				onclick={() => broadcasting = !broadcasting}
				aria-label="Activer/d\u00e9sactiver la diffusion"
				style={trackStyle(broadcasting)}
			>
				<span style={thumbStyle(broadcasting)}></span>
			</button>
		</div>

		<div class="h-px bg-slate-100"></div>

		<!-- Password -->
		<div class="flex flex-col gap-1.5">
			<label for="wifi-pwd" class="text-sm font-medium text-slate-700">Mot de passe</label>
			<div class="relative">
				<input
					id="wifi-pwd"
					type={showPassword ? 'text' : 'password'}
					bind:value={password}
					placeholder="Mot de passe WiFi"
					class="block w-full px-4 py-2.5 pr-10 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl shadow-soft focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400 transition-colors"
				/>
				<button
					type="button"
					onclick={() => showPassword = !showPassword}
					class="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
					aria-label={showPassword ? 'Masquer' : 'Afficher'}
				>
					<span class="material-icons text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
				</button>
			</div>
		</div>

		<div class="h-px bg-slate-100"></div>

		<!-- Frequency -->
		<div class="flex flex-col gap-2">
			<p class="text-sm font-medium text-slate-700">Fr\u00e9quence</p>
			<div class="flex gap-3">
				{#each [{ value: '2.4', label: '2.4 GHz', sublabel: 'Port\u00e9e plus longue' }, { value: '5', label: '5 GHz', sublabel: 'Plus rapide' }] as opt}
					<button
						type="button"
						onclick={() => frequency = opt.value as '2.4' | '5'}
						class="flex-1 flex flex-col items-center gap-1 py-3 px-4 rounded-xl border-2 transition-all {frequency === opt.value ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:border-slate-300'}"
					>
						<span class="material-icons text-[22px]">wifi</span>
						<p class="text-sm font-semibold">{opt.label}</p>
						<p class="text-[11px] opacity-70">{opt.sublabel}</p>
					</button>
				{/each}
			</div>
		</div>

		<div class="h-px bg-slate-100"></div>

		<!-- Country -->
		<div class="flex flex-col gap-1.5">
			<label for="country" class="text-sm font-medium text-slate-700">Pays / R\u00e9gion</label>
			<div class="relative">
				<select
					id="country"
					bind:value={country}
					class="block w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl shadow-soft focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors appearance-none"
				>
					{#each countries as c}
						<option value={c.value}>{c.label}</option>
					{/each}
				</select>
				<div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
					<span class="material-icons text-[18px]">expand_more</span>
				</div>
			</div>
		</div>

		<div class="h-px bg-slate-100"></div>

		<!-- Logs toggle -->
		<div class="flex items-center justify-between py-1">
			<div>
				<p class="text-sm font-medium text-slate-700">Journaux WiFi</p>
				<p class="text-xs text-slate-400">Enregistrer les connexions et d\u00e9connexions</p>
			</div>
			<button
				type="button"
				onclick={() => logsEnabled = !logsEnabled}
				aria-label="Activer/d\u00e9sactiver les journaux"
				style={trackStyle(logsEnabled)}
			>
				<span style={thumbStyle(logsEnabled)}></span>
			</button>
		</div>

		<!-- Save -->
		<div class="flex justify-end pt-2">
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

	<!-- Info panel -->
	<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-5 flex flex-col gap-4 h-fit">
		<div class="flex items-center gap-3 pb-3 border-b border-slate-100">
			<div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
				<span class="material-icons text-[18px]">info</span>
			</div>
			<p class="text-sm font-semibold text-slate-800">Informations</p>
		</div>
		<div class="flex flex-col gap-3 text-sm">
			<div class="flex flex-col gap-0.5">
				<p class="text-xs text-slate-400 uppercase font-semibold tracking-wide">SSID actuel</p>
				<p class="font-medium text-slate-700">{ssid || '\u2014'}</p>
			</div>
			<div class="flex flex-col gap-0.5">
				<p class="text-xs text-slate-400 uppercase font-semibold tracking-wide">Diffusion</p>
				<span class="flex items-center gap-1.5 text-[11px] font-semibold w-fit px-2.5 py-1 rounded-full {broadcasting ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}">
					<span class="w-1.5 h-1.5 rounded-full {broadcasting ? 'bg-green-500' : 'bg-slate-400'}"></span>
					{broadcasting ? 'Active' : 'D\u00e9sactiv\u00e9e'}
				</span>
			</div>
			<div class="flex flex-col gap-0.5">
				<p class="text-xs text-slate-400 uppercase font-semibold tracking-wide">Fr\u00e9quence</p>
				<p class="font-medium text-slate-700">{frequency} GHz</p>
			</div>
			<div class="flex flex-col gap-0.5">
				<p class="text-xs text-slate-400 uppercase font-semibold tracking-wide">R\u00e9gion</p>
				<p class="font-medium text-slate-700">{countries.find(c => c.value === country)?.label}</p>
			</div>
		</div>
	</div>
</div>

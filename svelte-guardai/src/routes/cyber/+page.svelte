<script lang="ts">
	import DeleteModal from '$lib/components/DeleteModal.svelte';

	type Device = {
		id: string;
		name: string;
		ip: string;
		status: 'online' | 'offline' | 'warning';
	};

	let devices = $state<Device[]>([
		{ id: '1', name: 'Device-001', ip: '192.168.1.10', status: 'online'  },
		{ id: '2', name: 'Device-002', ip: '192.168.1.11', status: 'online'  },
		{ id: '3', name: 'Device-003', ip: '192.168.1.12', status: 'warning' },
		{ id: '4', name: 'Device-004', ip: '192.168.1.13', status: 'offline' },
	]);

	const logs = [
		{ color: 'bg-green-500',  label: 'Démarrage système',     date: "Aujourd'hui, 14:30", desc: 'Tous les systèmes opérationnels. Protocoles de sécurité activés.' },
		{ color: 'bg-blue-500',   label: 'Appareil connecté',      date: "Aujourd'hui, 13:45", desc: 'Nouvel appareil détecté et authentifié avec succès.' },
		{ color: 'bg-amber-500',  label: 'Mise à jour pare-feu',   date: "Aujourd'hui, 12:00", desc: 'Règles pare-feu mises à jour. 3 nouvelles règles ajoutées.' },
		{ color: 'bg-purple-500', label: 'Scan terminé',           date: "Aujourd'hui, 10:15", desc: 'Scan réseau terminé. Aucune menace détectée.' },
		{ color: 'bg-red-500',    label: 'Tentative de connexion', date: 'Hier, 23:52',        desc: "Tentative d'accès non autorisée bloquée (IP: 10.0.0.55)." },
	];

	const quickLinks = [
		{ label: 'WiFi',     sublabel: 'Configurer le réseau',  icon: 'wifi',                  iconBg: 'bg-blue-50',   iconColor: 'text-blue-500',   href: '/cyber/wifi'     },
		{ label: 'DHCP',     sublabel: 'Gérer les adresses IP', icon: 'dns',                   iconBg: 'bg-purple-50', iconColor: 'text-purple-500', href: '/cyber/dhcp'     },
		{ label: 'RADIUS',   sublabel: 'Authentification',      icon: 'lock',                  iconBg: 'bg-amber-50',  iconColor: 'text-amber-500',  href: '/cyber/radius'   },
		{ label: 'Pare-feu', sublabel: 'Règles de sécurité',    icon: 'local_fire_department', iconBg: 'bg-red-50',    iconColor: 'text-red-500',    href: '/cyber/firewall' },
	];

	let scanProgress = $state(0);
	let isScanning   = $state(false);
	let scanDone     = $state(false);
	let deleteTarget = $state<string | null>(null);

	const scanSteps = [
		{ label: 'Découverte réseau',     icon: 'lan',           threshold: 15 },
		{ label: 'Analyse des ports',     icon: 'policy',        threshold: 40 },
		{ label: 'Vérif. protocoles',     icon: 'verified_user', threshold: 65 },
		{ label: 'Rapport sécurité',      icon: 'assessment',    threshold: 90 },
	];

	const currentStep = $derived(scanSteps.filter(s => scanProgress >= s.threshold).length);

	const onlineCount  = $derived(devices.filter(d => d.status === 'online').length);
	const warningCount = $derived(devices.filter(d => d.status === 'warning').length);
	const offlineCount = $derived(devices.filter(d => d.status === 'offline').length);

	function startScan() {
		isScanning = true;
		scanDone = false;
		scanProgress = 0;
		const interval = setInterval(() => {
			scanProgress += 2;
			if (scanProgress >= 100) {
				scanProgress = 100;
				clearInterval(interval);
				setTimeout(() => {
					isScanning = false;
					scanDone = true;
				}, 600);
			}
		}, 120);
	}

	function statusStyle(s: Device['status']) {
		if (s === 'online')  return { dot: 'bg-green-500',  cls: 'bg-green-100 text-green-700',  label: 'En ligne'   };
		if (s === 'warning') return { dot: 'bg-amber-500',  cls: 'bg-amber-100 text-amber-700',  label: 'Attention'  };
		return                      { dot: 'bg-slate-400',  cls: 'bg-slate-100 text-slate-500',  label: 'Hors ligne' };
	}
</script>

<svelte:head>
	<title>Cyber - Guard AI</title>
</svelte:head>

<!-- Page header -->
<div>
	<h1 class="text-2xl font-semibold text-slate-800">Dashboard Cyber</h1>
	<p class="text-slate-400 text-sm mt-0.5">Surveillance réseau et sécurité des appareils connectés</p>
</div>

<!-- KPIs -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
	{#each [
		{ icon: 'devices',   iconBg: 'bg-teal-50',  iconColor: 'text-teal-500',  label: 'Appareils connectés', value: devices.length.toString() },
		{ icon: 'gpp_good',  iconBg: 'bg-green-50', iconColor: 'text-green-500', label: 'En ligne',            value: onlineCount.toString()    },
		{ icon: 'gpp_maybe', iconBg: 'bg-amber-50', iconColor: 'text-amber-500', label: 'Attention requise',   value: warningCount.toString()   },
		{ icon: 'gpp_bad',   iconBg: 'bg-red-50',   iconColor: 'text-red-400',   label: 'Menaces détectées',   value: '0'                       },
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

<!-- Main grid -->
<div class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
	<!-- Left column -->
	<div class="flex flex-col gap-6">

		<!-- Quick links -->
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
			{#each quickLinks as link}
				<a
					href={link.href}
					class="bg-white rounded-[20px] p-4 sm:p-5 shadow-soft border border-slate-100 flex items-center gap-3 hover:border-primary/30 hover:shadow-md transition-all group"
				>
					<div class="w-10 h-10 rounded-xl {link.iconBg} flex items-center justify-center {link.iconColor} shrink-0">
						<span class="material-icons text-[20px]">{link.icon}</span>
					</div>
					<div class="min-w-0">
						<p class="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">{link.label}</p>
						<p class="text-xs text-slate-400 truncate">{link.sublabel}</p>
					</div>
				</a>
			{/each}
		</div>

		<!-- Network scan -->
		<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-5 sm:p-6">
			<div class="flex items-center justify-between mb-5 gap-3">
				<div class="flex items-center gap-3 min-w-0">
					<div class="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
						<span class="material-icons text-[22px]">radar</span>
					</div>
					<div class="min-w-0">
						<p class="text-sm font-semibold text-slate-800">Scan réseau</p>
						<p class="text-xs text-slate-400">Analyse de sécurité en temps réel</p>
					</div>
				</div>
				<button
					onclick={startScan}
					disabled={isScanning}
					class="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0
						{isScanning
							? 'bg-slate-100 text-slate-400 cursor-not-allowed'
							: 'bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-dark'}"
				>
					<span class="material-icons text-[18px]">{isScanning ? 'hourglass_top' : 'play_arrow'}</span>
					<span class="hidden sm:inline">{isScanning ? 'Scan en cours…' : 'Lancer le scan'}</span>
				</button>
			</div>

			{#if isScanning || scanDone}
				<div class="mb-5">
					<div class="flex items-center justify-between text-sm mb-1.5">
						<span class="text-slate-500 text-xs font-medium">
							{scanProgress >= 100 ? 'Scan terminé' : scanSteps[Math.min(currentStep, scanSteps.length - 1)]?.label + '…'}
						</span>
						<span class="font-semibold text-sm {scanProgress >= 100 ? 'text-green-600' : 'text-slate-800'}">{scanProgress}%</span>
					</div>
					<div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
						<div
							class="h-2 rounded-full transition-all duration-300 ease-out"
							style="width: {scanProgress}%; background: {scanProgress >= 100 ? '#22c55e' : 'linear-gradient(90deg, #13b9a5, #0f9685)'};"
						></div>
					</div>
				</div>

				<div class="grid grid-cols-4 gap-2 sm:gap-3">
					{#each scanSteps as step, i}
						{@const done = scanProgress >= step.threshold}
						{@const active = i === currentStep && scanProgress < 100}
						<div class="flex flex-col items-center gap-2 py-3 px-1 sm:px-2 rounded-xl transition-all duration-300
							{done ? 'bg-primary/5' : 'bg-slate-50'}
							{active ? 'ring-1 ring-primary/30 bg-primary/5' : ''}">
							<div class="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
								{done ? 'bg-primary/15 text-primary' : active ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-300'}">
								{#if done && !active}
									<span class="material-icons text-[18px]">check</span>
								{:else}
									<span class="material-icons text-[18px] {active ? 'animate-pulse' : ''}">{step.icon}</span>
								{/if}
							</div>
							<p class="text-[10px] sm:text-[11px] font-medium text-center leading-tight
								{done ? 'text-slate-700' : active ? 'text-primary' : 'text-slate-400'}">
								{step.label}
							</p>
						</div>
					{/each}
				</div>

				{#if scanDone}
					<div class="mt-5 flex items-center gap-3 p-3.5 rounded-xl bg-green-50 border border-green-100">
						<div class="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
							<span class="material-icons text-[18px]">check_circle</span>
						</div>
						<div class="flex-1">
							<p class="text-sm font-semibold text-green-800">Scan terminé avec succès</p>
							<p class="text-xs text-green-600">{devices.length} appareils analysés · Aucune menace détectée</p>
						</div>
					</div>
				{/if}
			{:else}
				<div class="flex flex-col items-center py-6 text-center">
					<div class="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-3">
						<span class="material-icons text-[28px]">radar</span>
					</div>
					<p class="text-sm text-slate-500 font-medium">Aucun scan en cours</p>
					<p class="text-xs text-slate-400 mt-0.5">Lancez un scan pour analyser votre réseau</p>
				</div>
			{/if}
		</div>

		<!-- Devices table (desktop) -->
		<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 overflow-hidden">
			<div class="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
				<p class="text-sm font-semibold text-slate-800">Appareils sur le réseau</p>
				<span class="text-xs text-slate-400">{devices.length} appareils</span>
			</div>

			<!-- Table desktop -->
			<table class="hidden sm:table w-full">
				<thead>
					<tr class="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
						<th class="px-5 py-3 text-left">Appareil</th>
						<th class="px-5 py-3 text-left">Adresse IP</th>
						<th class="px-5 py-3 text-left">Statut</th>
						<th class="px-5 py-3 text-left w-16"></th>
					</tr>
				</thead>
				<tbody>
					{#if devices.length === 0}
						<tr>
							<td colspan="4" class="py-12 text-center text-slate-400 text-sm">Aucun appareil trouvé</td>
						</tr>
					{:else}
						{#each devices as device (device.id)}
							{@const st = statusStyle(device.status)}
							<tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group">
								<td class="px-5 py-4">
									<div class="flex items-center gap-3">
										<div class="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
											<span class="material-icons text-[18px] text-teal-500">computer</span>
										</div>
										<p class="text-sm font-semibold text-slate-800">{device.name}</p>
									</div>
								</td>
								<td class="px-5 py-4 text-sm text-slate-500 font-mono">{device.ip}</td>
								<td class="px-5 py-4">
									<span class="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit {st.cls}">
										<span class="w-1.5 h-1.5 rounded-full {st.dot}"></span>
										{st.label}
									</span>
								</td>
								<td class="px-5 py-4">
									<button
										aria-label="Supprimer"
										onclick={() => deleteTarget = device.id}
										class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
									>
										<span class="material-icons text-[16px]">delete_outline</span>
									</button>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>

			<!-- Cards mobile -->
			<div class="sm:hidden flex flex-col divide-y divide-slate-50">
				{#if devices.length === 0}
					<p class="py-10 text-center text-slate-400 text-sm">Aucun appareil trouvé</p>
				{:else}
					{#each devices as device (device.id)}
						{@const st = statusStyle(device.status)}
						<div class="flex items-center gap-3 px-4 py-3.5">
							<div class="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
								<span class="material-icons text-[18px] text-teal-500">computer</span>
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-semibold text-slate-800">{device.name}</p>
								<p class="text-xs font-mono text-slate-400 mt-0.5">{device.ip}</p>
							</div>
							<span class="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 {st.cls}">
								<span class="w-1.5 h-1.5 rounded-full {st.dot}"></span>
								{st.label}
							</span>
							<button
								aria-label="Supprimer"
								onclick={() => deleteTarget = device.id}
								class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
							>
								<span class="material-icons text-[16px]">delete_outline</span>
							</button>
						</div>
					{/each}
				{/if}
			</div>
		</div>

	</div>

	<!-- Right column — logs -->
	<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-5 flex flex-col gap-4 h-fit lg:sticky lg:top-6">
		<div class="flex items-center gap-3 pb-3 border-b border-slate-100">
			<div class="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
				<span class="material-icons text-[18px]">history</span>
			</div>
			<p class="text-sm font-semibold text-slate-800">Journaux de sécurité</p>
		</div>

		<div class="flex flex-col gap-4">
			{#each logs as log}
				<div class="flex gap-3">
					<div class="flex flex-col items-center gap-1 pt-1">
						<span class="w-2 h-2 rounded-full shrink-0 {log.color}"></span>
						<span class="w-px flex-1 bg-slate-100"></span>
					</div>
					<div class="pb-4">
						<p class="text-sm font-medium text-slate-800">{log.label}</p>
						<p class="text-xs text-slate-400 mb-1">{log.date}</p>
						<p class="text-xs text-slate-500">{log.desc}</p>
					</div>
				</div>
			{/each}
		</div>

		<button class="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
			Voir tous les journaux
		</button>
	</div>
</div>

{#if deleteTarget !== null}
	{@const device = devices.find(d => d.id === deleteTarget)}
	<DeleteModal
		label={device?.name ?? 'cet appareil'}
		onconfirm={() => { devices = devices.filter(d => d.id !== deleteTarget); deleteTarget = null; }}
		oncancel={() => { deleteTarget = null; }}
	/>
{/if}

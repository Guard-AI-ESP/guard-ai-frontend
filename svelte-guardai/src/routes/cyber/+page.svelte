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
		{ color: 'bg-green-500',  label: 'D\u00e9marrage syst\u00e8me',     date: 'Aujourd\'hui, 14:30', desc: 'Tous les syst\u00e8mes op\u00e9rationnels. Protocoles de s\u00e9curit\u00e9 activ\u00e9s.' },
		{ color: 'bg-blue-500',   label: 'Appareil connect\u00e9',      date: 'Aujourd\'hui, 13:45', desc: 'Nouvel appareil d\u00e9tect\u00e9 et authentifi\u00e9 avec succ\u00e8s.' },
		{ color: 'bg-amber-500',  label: 'Mise \u00e0 jour pare-feu',   date: 'Aujourd\'hui, 12:00', desc: 'R\u00e8gles pare-feu mises \u00e0 jour. 3 nouvelles r\u00e8gles ajout\u00e9es.' },
		{ color: 'bg-purple-500', label: 'Scan termin\u00e9',           date: 'Aujourd\'hui, 10:15', desc: 'Scan r\u00e9seau termin\u00e9. Aucune menace d\u00e9tect\u00e9e.' },
		{ color: 'bg-red-500',    label: 'Tentative de connexion', date: 'Hier, 23:52',         desc: 'Tentative d\'acc\u00e8s non autoris\u00e9e bloqu\u00e9e (IP: 10.0.0.55).' },
	];

	const quickLinks = [
		{ label: 'WiFi',          sublabel: 'Configurer le r\u00e9seau',  icon: 'wifi',          iconBg: 'bg-blue-50',   iconColor: 'text-blue-500',   href: '/cyber/wifi'     },
		{ label: 'DHCP',          sublabel: 'G\u00e9rer les adresses IP', icon: 'dns',           iconBg: 'bg-purple-50', iconColor: 'text-purple-500', href: '/cyber/dhcp'     },
		{ label: 'RADIUS',        sublabel: 'Authentification',      icon: 'lock',          iconBg: 'bg-amber-50',  iconColor: 'text-amber-500',  href: '/cyber/radius'   },
		{ label: 'Pare-feu',      sublabel: 'R\u00e8gles de s\u00e9curit\u00e9',    icon: 'local_fire_department', iconBg: 'bg-red-50', iconColor: 'text-red-500', href: '/cyber/firewall' },
	];

	let scanProgress = $state(0);
	let isScanning   = $state(false);
	let scanDone     = $state(false);
	let deleteTarget = $state<string | null>(null);

	const scanSteps = [
		{ label: 'D\u00e9couverte r\u00e9seau',     icon: 'lan',             threshold: 15 },
		{ label: 'Analyse des ports',     icon: 'policy',          threshold: 40 },
		{ label: 'V\u00e9rification protocoles', icon: 'verified_user', threshold: 65 },
		{ label: 'Rapport de s\u00e9curit\u00e9',   icon: 'assessment',      threshold: 90 },
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
		if (s === 'online')  return { dot: 'bg-green-500',  cls: 'bg-green-100 text-green-700',  label: 'En ligne'    };
		if (s === 'warning') return { dot: 'bg-amber-500',  cls: 'bg-amber-100 text-amber-700',  label: 'Attention'   };
		return                      { dot: 'bg-slate-400',  cls: 'bg-slate-100 text-slate-500',  label: 'Hors ligne'  };
	}
</script>

<svelte:head>
	<title>Cyber - Guard AI</title>
</svelte:head>

<!-- Page header -->
<div>
	<h1 class="text-2xl font-semibold text-slate-800">Dashboard Cyber</h1>
	<p class="text-slate-400 text-sm mt-0.5">Surveillance r\u00e9seau et s\u00e9curit\u00e9 des appareils connect\u00e9s</p>
</div>

<!-- KPIs -->
<div class="flex gap-4">
	{#each [
		{ icon: 'devices',        iconBg: 'bg-teal-50',   iconColor: 'text-teal-500',   label: 'Appareils connect\u00e9s', value: devices.length.toString() },
		{ icon: 'gpp_good',       iconBg: 'bg-green-50',  iconColor: 'text-green-500',  label: 'En ligne',            value: onlineCount.toString()    },
		{ icon: 'gpp_maybe',      iconBg: 'bg-amber-50',  iconColor: 'text-amber-500',  label: 'Attention requise',   value: warningCount.toString()   },
		{ icon: 'gpp_bad',        iconBg: 'bg-red-50',    iconColor: 'text-red-400',    label: 'Menaces d\u00e9tect\u00e9es',   value: '0'                       },
	] as kpi}
		<div class="flex-1 bg-white rounded-[20px] p-5 shadow-soft border border-slate-100 flex flex-col gap-3">
			<div class="w-11 h-11 rounded-2xl {kpi.iconBg} flex items-center justify-center {kpi.iconColor}">
				<span class="material-icons text-[22px]">{kpi.icon}</span>
			</div>
			<div>
				<p class="text-slate-400 text-sm">{kpi.label}</p>
				<p class="text-2xl font-bold text-slate-800">{kpi.value}</p>
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
					class="bg-white rounded-[20px] p-5 shadow-soft border border-slate-100 flex items-center gap-3 hover:border-primary/30 hover:shadow-md transition-all group"
				>
					<div class="w-10 h-10 rounded-xl {link.iconBg} flex items-center justify-center {link.iconColor} shrink-0">
						<span class="material-icons text-[20px]">{link.icon}</span>
					</div>
					<div>
						<p class="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">{link.label}</p>
						<p class="text-xs text-slate-400">{link.sublabel}</p>
					</div>
				</a>
			{/each}
		</div>

		<!-- Network scan -->
		<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-6">
			<div class="flex items-center justify-between mb-5">
				<div class="flex items-center gap-3">
					<div class="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
						<span class="material-icons text-[22px]">radar</span>
					</div>
					<div>
						<p class="text-sm font-semibold text-slate-800">Scan r\u00e9seau</p>
						<p class="text-xs text-slate-400">Analyse de s\u00e9curit\u00e9 en temps r\u00e9el</p>
					</div>
				</div>
				<button
					onclick={startScan}
					disabled={isScanning}
					class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all
						{isScanning
							? 'bg-slate-100 text-slate-400 cursor-not-allowed'
							: 'bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-dark'}"
				>
					<span class="material-icons text-[18px]">{isScanning ? 'hourglass_top' : 'play_arrow'}</span>
					{isScanning ? 'Scan en cours\u2026' : 'Lancer le scan'}
				</button>
			</div>

			{#if isScanning || scanDone}
				<div class="mb-5">
					<div class="flex items-center justify-between text-sm mb-1.5">
						<span class="text-slate-500 text-xs font-medium">
							{scanProgress >= 100 ? 'Scan termin\u00e9' : scanSteps[Math.min(currentStep, scanSteps.length - 1)]?.label + '\u2026'}
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

				<div class="grid grid-cols-4 gap-3">
					{#each scanSteps as step, i}
						{@const done = scanProgress >= step.threshold}
						{@const active = i === currentStep && scanProgress < 100}
						<div class="flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-all duration-300
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
							<p class="text-[11px] font-medium text-center leading-tight
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
							<p class="text-sm font-semibold text-green-800">Scan termin\u00e9 avec succ\u00e8s</p>
							<p class="text-xs text-green-600">{devices.length} appareils analys\u00e9s \u00b7 Aucune menace d\u00e9tect\u00e9e</p>
						</div>
					</div>
				{/if}
			{:else}
				<div class="flex flex-col items-center py-6 text-center">
					<div class="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-3">
						<span class="material-icons text-[28px]">radar</span>
					</div>
					<p class="text-sm text-slate-500 font-medium">Aucun scan en cours</p>
					<p class="text-xs text-slate-400 mt-0.5">Lancez un scan pour analyser votre r\u00e9seau</p>
				</div>
			{/if}
		</div>

		<!-- Devices table -->
		<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 overflow-hidden">
			<div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
				<p class="text-sm font-semibold text-slate-800">Appareils sur le r\u00e9seau</p>
				<span class="text-xs text-slate-400">{devices.length} appareils</span>
			</div>
			<table class="w-full">
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
							<td colspan="4" class="py-12 text-center text-slate-400 text-sm">Aucun appareil trouv\u00e9</td>
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
		</div>

	</div>

	<!-- Right column -->
	<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-5 flex flex-col gap-4 h-fit sticky top-6">
		<div class="flex items-center gap-3 pb-3 border-b border-slate-100">
			<div class="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
				<span class="material-icons text-[18px]">history</span>
			</div>
			<p class="text-sm font-semibold text-slate-800">Journaux de s\u00e9curit\u00e9</p>
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

<script lang="ts">
	let saved = $state(false);

	function trackStyle(on: boolean) {
		return `display:inline-flex;align-items:center;width:44px;height:24px;border-radius:9999px;padding:2px;transition:background 0.2s;background:${on ? '#13b9a5' : '#e2e8f0'};cursor:pointer;`;
	}
	function thumbStyle(on: boolean) {
		return `width:20px;height:20px;border-radius:9999px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:transform 0.2s;transform:translateX(${on ? '20px' : '0px'});`;
	}

	let notifications = $state(true);
	let darkMode = $state(false);
	let autoRecord = $state(true);
	let aiDetection = $state(true);

	function save() {
		saved = true;
		setTimeout(() => { saved = false; }, 2500);
	}
</script>

<svelte:head>
	<title>Param\u00e8tres - Guard AI</title>
</svelte:head>

<!-- Page header -->
<div>
	<h1 class="text-2xl font-semibold text-slate-800">Param\u00e8tres</h1>
	<p class="text-slate-400 text-sm mt-0.5">Configuration g\u00e9n\u00e9rale du syst\u00e8me</p>
</div>

<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
	<!-- Settings form -->
	<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-6 flex flex-col gap-0">
		{#each [
			{ key: 'notifications', label: 'Notifications push', desc: 'Recevoir des alertes en temps r\u00e9el sur votre appareil', icon: 'notifications', iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
			{ key: 'darkMode', label: 'Mode sombre', desc: 'Activer le th\u00e8me sombre de l\'interface', icon: 'dark_mode', iconBg: 'bg-purple-50', iconColor: 'text-purple-500' },
			{ key: 'autoRecord', label: 'Enregistrement automatique', desc: 'D\u00e9marrer l\'enregistrement lors d\'une d\u00e9tection', icon: 'videocam', iconBg: 'bg-green-50', iconColor: 'text-green-500' },
			{ key: 'aiDetection', label: 'D\u00e9tection IA', desc: 'Utiliser l\'intelligence artificielle pour analyser les flux', icon: 'psychology', iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
		] as setting, i}
			<div class="flex items-center justify-between py-5 {i < 3 ? 'border-b border-slate-100' : ''}">
				<div class="flex items-center gap-4">
					<div class="w-10 h-10 rounded-xl {setting.iconBg} flex items-center justify-center {setting.iconColor} shrink-0">
						<span class="material-icons text-[20px]">{setting.icon}</span>
					</div>
					<div>
						<p class="text-sm font-medium text-slate-700">{setting.label}</p>
						<p class="text-xs text-slate-400 mt-0.5">{setting.desc}</p>
					</div>
				</div>
				<button
					type="button"
					onclick={() => {
						if (setting.key === 'notifications') notifications = !notifications;
						if (setting.key === 'darkMode') darkMode = !darkMode;
						if (setting.key === 'autoRecord') autoRecord = !autoRecord;
						if (setting.key === 'aiDetection') aiDetection = !aiDetection;
					}}
					style={trackStyle(
						setting.key === 'notifications' ? notifications :
						setting.key === 'darkMode' ? darkMode :
						setting.key === 'autoRecord' ? autoRecord : aiDetection
					)}
					class="shrink-0 ml-4"
				>
					<span style={thumbStyle(
						setting.key === 'notifications' ? notifications :
						setting.key === 'darkMode' ? darkMode :
						setting.key === 'autoRecord' ? autoRecord : aiDetection
					)}></span>
				</button>
			</div>
		{/each}

		<!-- Save -->
		<div class="flex justify-end pt-4 border-t border-slate-100">
			<button
				type="button"
				onclick={save}
				class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all {saved ? 'bg-green-500 text-white' : 'bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-dark'}"
			>
				<span class="material-icons text-[18px]">{saved ? 'check' : 'save'}</span>
				{saved ? 'Sauvegard\u00e9' : 'Enregistrer'}
			</button>
		</div>
	</div>

	<!-- Info panel -->
	<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-5 flex flex-col gap-4 h-fit">
		<div class="flex items-center gap-3 pb-3 border-b border-slate-100">
			<div class="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
				<span class="material-icons text-[18px]">info</span>
			</div>
			<p class="text-sm font-semibold text-slate-800">Informations syst\u00e8me</p>
		</div>
		<div class="flex flex-col gap-3 text-sm">
			<div class="flex flex-col gap-0.5">
				<p class="text-xs text-slate-400 uppercase font-semibold tracking-wide">Version</p>
				<p class="font-medium text-slate-700">Guard AI v1.0.0</p>
			</div>
			<div class="flex flex-col gap-0.5">
				<p class="text-xs text-slate-400 uppercase font-semibold tracking-wide">Derni\u00e8re mise \u00e0 jour</p>
				<p class="font-medium text-slate-700">{new Date().toLocaleDateString('fr-FR')}</p>
			</div>
		</div>
	</div>
</div>

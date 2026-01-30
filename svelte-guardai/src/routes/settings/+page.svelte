<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { onMount } from 'svelte';

	// Notifications & Alertes
	let pushNotifications = true;
	let emailAlerts = false;
	let smsAlerts = false;
	let soundEnabled = true;
	let vibrationEnabled = true;
	let alertEmail = '';
	let alertPhone = '';

	// Sécurité & Confidentialité
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let pinCode = '';
	let twoFactorEnabled = false;
	let connectedDevices = [
		{ id: '1', name: 'iPhone 13', lastActive: '2024-12-12T10:30:00', location: 'Paris, France' },
		{ id: '2', name: 'MacBook Pro', lastActive: '2024-12-11T18:45:00', location: 'Paris, France' }
	];

	// Caméras & Enregistrements
	let videoQuality = '1080p';
	let retentionDays = 30;
	let storageType = 'cloud';
	let nightVisionEnabled = true;
	let motionDetectionSensitivity = 'medium';

	// Profil
	let profilePicFile: File | null = null;
	let profilePicPreview = '';
	let userEmail = '';
	let userPhone = '';
	let userName = '';

	// Interphone
	let customMessage = '';
	let intercomVolume = 80;

	// Apparence
	let selectedTheme = 'light';
	let selectedLanguage = 'fr';

	// Automatisation
	let autoScheduleEnabled = false;
	let scheduleStartTime = '22:00';
	let scheduleEndTime = '07:00';
	let vacationModeEnabled = false;
	let vacationStartDate = '';
	let vacationEndDate = '';

	// Load saved settings from localStorage on mount
	onMount(() => {
		const savedSettings = localStorage.getItem('guardai-settings');
		if (savedSettings) {
			const settings = JSON.parse(savedSettings);

			// Notifications
			pushNotifications = settings.pushNotifications ?? true;
			emailAlerts = settings.emailAlerts ?? false;
			smsAlerts = settings.smsAlerts ?? false;
			soundEnabled = settings.soundEnabled ?? true;
			vibrationEnabled = settings.vibrationEnabled ?? true;
			alertEmail = settings.alertEmail || '';
			alertPhone = settings.alertPhone || '';

			// Sécurité
			pinCode = settings.pinCode || '';
			twoFactorEnabled = settings.twoFactorEnabled ?? false;

			// Caméras
			videoQuality = settings.videoQuality || '1080p';
			retentionDays = settings.retentionDays || 30;
			storageType = settings.storageType || 'cloud';
			nightVisionEnabled = settings.nightVisionEnabled ?? true;
			motionDetectionSensitivity = settings.motionDetectionSensitivity || 'medium';

			// Profil
			profilePicPreview = settings.profilePicPreview || '';
			userEmail = settings.userEmail || '';
			userPhone = settings.userPhone || '';
			userName = settings.userName || '';

			// Interphone
			customMessage = settings.customMessage || '';
			intercomVolume = settings.intercomVolume || 80;

			// Apparence
			selectedTheme = settings.theme || 'light';
			selectedLanguage = settings.language || 'fr';

			// Automatisation
			autoScheduleEnabled = settings.autoScheduleEnabled ?? false;
			scheduleStartTime = settings.scheduleStartTime || '22:00';
			scheduleEndTime = settings.scheduleEndTime || '07:00';
			vacationModeEnabled = settings.vacationModeEnabled ?? false;
			vacationStartDate = settings.vacationStartDate || '';
			vacationEndDate = settings.vacationEndDate || '';
		}
	});

	function handleProfilePicChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			profilePicFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				profilePicPreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function saveSettings() {
		const settings = {
			// Notifications
			pushNotifications,
			emailAlerts,
			smsAlerts,
			soundEnabled,
			vibrationEnabled,
			alertEmail,
			alertPhone,

			// Sécurité
			pinCode,
			twoFactorEnabled,

			// Caméras
			videoQuality,
			retentionDays,
			storageType,
			nightVisionEnabled,
			motionDetectionSensitivity,

			// Profil
			profilePicPreview,
			userEmail,
			userPhone,
			userName,

			// Interphone
			customMessage,
			intercomVolume,

			// Apparence
			theme: selectedTheme,
			language: selectedLanguage,

			// Automatisation
			autoScheduleEnabled,
			scheduleStartTime,
			scheduleEndTime,
			vacationModeEnabled,
			vacationStartDate,
			vacationEndDate
		};

		localStorage.setItem('guardai-settings', JSON.stringify(settings));
		alert('Paramètres enregistrés avec succès !');
	}

	function resetSettings() {
		if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
			localStorage.removeItem('guardai-settings');
			location.reload();
		}
	}

	function changePassword() {
		if (!currentPassword || !newPassword || !confirmPassword) {
			alert('Veuillez remplir tous les champs');
			return;
		}
		if (newPassword !== confirmPassword) {
			alert('Les mots de passe ne correspondent pas');
			return;
		}
		// Simulate password change
		alert('Mot de passe changé avec succès !');
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
	}

	function disconnectDevice(deviceId: string) {
		if (confirm('Êtes-vous sûr de vouloir déconnecter cet appareil ?')) {
			connectedDevices = connectedDevices.filter(d => d.id !== deviceId);
			alert('Appareil déconnecté avec succès');
		}
	}

	function formatDateTime(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleString('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Paramètres - Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main content -->
	<main class="flex-1 overflow-y-auto">
		<div class="p-8">
			<div class="max-w-5xl mx-auto">
				<div class="text-center mb-8">
					<h1 class="text-3xl font-bold text-gray-900">Paramètres</h1>
					<p class="text-gray-500 mt-2">Gérez vos préférences et la configuration de votre système</p>
				</div>

				<form on:submit|preventDefault={saveSettings} class="space-y-6">
					<!-- Notifications & Alertes -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
								<svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
								</svg>
							</div>
							<h2 class="text-xl font-semibold text-gray-900">Notifications & Alertes</h2>
						</div>

						<div class="space-y-5">
							<!-- Push Notifications -->
							<div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
								<div class="flex-1">
									<span class="text-sm font-medium text-gray-900">Notifications push</span>
									<p class="text-xs text-gray-500">Recevoir des notifications sur cet appareil</p>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										bind:checked={pushNotifications}
										class="sr-only peer"
									/>
									<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
								</label>
							</div>

							<!-- Email Alerts -->
							<div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
								<div class="flex-1">
									<span class="text-sm font-medium text-gray-900">Alertes par email</span>
									<p class="text-xs text-gray-500">Recevoir des alertes importantes par email</p>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										bind:checked={emailAlerts}
										class="sr-only peer"
									/>
									<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
								</label>
							</div>

							{#if emailAlerts}
								<div class="ml-6">
									<input
										type="email"
										bind:value={alertEmail}
										placeholder="email@exemple.com"
										class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
									/>
								</div>
							{/if}

							<!-- SMS Alerts -->
							<div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
								<div class="flex-1">
									<span class="text-sm font-medium text-gray-900">Alertes par SMS</span>
									<p class="text-xs text-gray-500">Recevoir des alertes critiques par SMS</p>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										bind:checked={smsAlerts}
										class="sr-only peer"
									/>
									<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
								</label>
							</div>

							{#if smsAlerts}
								<div class="ml-6">
									<input
										type="tel"
										bind:value={alertPhone}
										placeholder="+33 6 12 34 56 78"
										class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
									/>
								</div>
							{/if}

							<!-- Sound -->
							<div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
								<div class="flex-1">
									<span class="text-sm font-medium text-gray-900">Sons</span>
									<p class="text-xs text-gray-500">Jouer un son pour les notifications</p>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										bind:checked={soundEnabled}
										class="sr-only peer"
									/>
									<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
								</label>
							</div>

							<!-- Vibration -->
							<div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
								<div class="flex-1">
									<span class="text-sm font-medium text-gray-900">Vibrations</span>
									<p class="text-xs text-gray-500">Vibrer pour les notifications</p>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										bind:checked={vibrationEnabled}
										class="sr-only peer"
									/>
									<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
								</label>
							</div>
						</div>
					</div>

					<!-- Sécurité & Confidentialité -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
								<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							</div>
							<h2 class="text-xl font-semibold text-gray-900">Sécurité & Confidentialité</h2>
						</div>

						<div class="space-y-5">
							<!-- Change Password -->
							<div class="border border-gray-200 rounded-lg p-4">
								<h3 class="text-sm font-semibold text-gray-900 mb-4">Changer le mot de passe</h3>
								<div class="space-y-3">
									<input
										type="password"
										bind:value={currentPassword}
										placeholder="Mot de passe actuel"
										class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
									/>
									<input
										type="password"
										bind:value={newPassword}
										placeholder="Nouveau mot de passe"
										class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
									/>
									<input
										type="password"
										bind:value={confirmPassword}
										placeholder="Confirmer le nouveau mot de passe"
										class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
									/>
									<button
										type="button"
										on:click={changePassword}
										class="w-full px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
									>
										Changer le mot de passe
									</button>
								</div>
							</div>

							<!-- PIN Code -->
							<div>
								<label for="pin-code" class="block text-sm font-medium text-gray-700 mb-2">
									Code PIN (4 chiffres)
								</label>
								<input
									type="text"
									id="pin-code"
									bind:value={pinCode}
									maxlength="4"
									pattern="[0-9]{4}"
									placeholder="••••"
									class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
								/>
								<p class="text-xs text-gray-500 mt-1">Utilisé pour un accès rapide à l'application</p>
							</div>

							<!-- Two-Factor Authentication -->
							<div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
								<div class="flex-1">
									<span class="text-sm font-medium text-gray-900">Authentification à deux facteurs</span>
									<p class="text-xs text-gray-500">Sécurité renforcée pour votre compte</p>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										bind:checked={twoFactorEnabled}
										class="sr-only peer"
									/>
									<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
								</label>
							</div>

							<!-- Connected Devices -->
							<div class="border border-gray-200 rounded-lg p-4">
								<h3 class="text-sm font-semibold text-gray-900 mb-4">Appareils connectés</h3>
								<div class="space-y-3">
									{#each connectedDevices as device (device.id)}
										<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<div class="flex-1">
												<p class="text-sm font-medium text-gray-900">{device.name}</p>
												<p class="text-xs text-gray-500">
													Dernière activité: {formatDateTime(device.lastActive)}
												</p>
												<p class="text-xs text-gray-500">{device.location}</p>
											</div>
											<button
												type="button"
												on:click={() => disconnectDevice(device.id)}
												class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
											>
												Déconnecter
											</button>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>

					<!-- Caméras & Enregistrements -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
								<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
								</svg>
							</div>
							<h2 class="text-xl font-semibold text-gray-900">Caméras & Enregistrements</h2>
						</div>

						<div class="space-y-5">
							<!-- Video Quality -->
							<div>
								<label for="video-quality" class="block text-sm font-medium text-gray-700 mb-2">
									Qualité vidéo
								</label>
								<div class="relative">
									<select
										id="video-quality"
										bind:value={videoQuality}
										class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 appearance-none"
									>
										<option value="720p">720p (HD)</option>
										<option value="1080p">1080p (Full HD)</option>
										<option value="1440p">1440p (2K)</option>
										<option value="2160p">2160p (4K)</option>
									</select>
									<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
										</svg>
									</div>
								</div>
							</div>

							<!-- Retention Days -->
							<div>
								<label for="retention-days" class="block text-sm font-medium text-gray-700 mb-2">
									Durée de conservation (jours)
								</label>
								<input
									type="number"
									id="retention-days"
									bind:value={retentionDays}
									min="7"
									max="365"
									class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
								/>
								<p class="text-xs text-gray-500 mt-1">Les enregistrements seront automatiquement supprimés après cette période</p>
							</div>

							<!-- Storage Type -->
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Type de stockage
								</label>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
									<label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all {storageType === 'cloud' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}">
										<input
											type="radio"
											bind:group={storageType}
											value="cloud"
											class="w-5 h-5 text-teal-600"
										/>
										<div class="ml-3">
											<span class="text-sm font-medium text-gray-900">Cloud</span>
											<p class="text-xs text-gray-500">Stockage en ligne sécurisé</p>
										</div>
									</label>
									<label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all {storageType === 'local' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}">
										<input
											type="radio"
											bind:group={storageType}
											value="local"
											class="w-5 h-5 text-teal-600"
										/>
										<div class="ml-3">
											<span class="text-sm font-medium text-gray-900">Local</span>
											<p class="text-xs text-gray-500">Sur cet appareil uniquement</p>
										</div>
									</label>
								</div>
							</div>

							<!-- Night Vision -->
							<div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
								<div class="flex-1">
									<span class="text-sm font-medium text-gray-900">Vision nocturne</span>
									<p class="text-xs text-gray-500">Activer automatiquement en basse lumière</p>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										bind:checked={nightVisionEnabled}
										class="sr-only peer"
									/>
									<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
								</label>
							</div>

							<!-- Motion Detection Sensitivity -->
							<div>
								<label for="motion-sensitivity" class="block text-sm font-medium text-gray-700 mb-2">
									Sensibilité de détection de mouvement
								</label>
								<div class="relative">
									<select
										id="motion-sensitivity"
										bind:value={motionDetectionSensitivity}
										class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 appearance-none"
									>
										<option value="low">Faible</option>
										<option value="medium">Moyenne</option>
										<option value="high">Élevée</option>
									</select>
									<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
										</svg>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Profil -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
								<svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
							</div>
							<h2 class="text-xl font-semibold text-gray-900">Profil</h2>
						</div>

						<div class="space-y-5">
							<!-- Profile Picture -->
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Photo de profil
								</label>
								<div class="flex items-center gap-4">
									{#if profilePicPreview}
										<img src={profilePicPreview} alt="Profile preview" class="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
									{:else}
										<div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
											<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
											</svg>
										</div>
									{/if}
									<label class="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
										<span>Choisir une photo</span>
										<input
											type="file"
											accept="image/*"
											on:change={handleProfilePicChange}
											class="hidden"
										/>
									</label>
								</div>
							</div>

							<!-- Name -->
							<div>
								<label for="user-name" class="block text-sm font-medium text-gray-700 mb-2">
									Nom
								</label>
								<input
									type="text"
									id="user-name"
									bind:value={userName}
									placeholder="Votre nom"
									class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
								/>
							</div>

							<!-- Email -->
							<div>
								<label for="user-email" class="block text-sm font-medium text-gray-700 mb-2">
									Email
								</label>
								<input
									type="email"
									id="user-email"
									bind:value={userEmail}
									placeholder="exemple@mail.com"
									class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
								/>
							</div>

							<!-- Phone -->
							<div>
								<label for="user-phone" class="block text-sm font-medium text-gray-700 mb-2">
									Numéro de téléphone
								</label>
								<input
									type="tel"
									id="user-phone"
									bind:value={userPhone}
									placeholder="+33 6 12 34 56 78"
									class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
								/>
							</div>
						</div>
					</div>

					<!-- Interphone -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
								<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
								</svg>
							</div>
							<h2 class="text-xl font-semibold text-gray-900">Interphone</h2>
						</div>

						<div class="space-y-5">
							<!-- Custom Message -->
							<div>
								<label for="custom-message" class="block text-sm font-medium text-gray-700 mb-2">
									Message personnalisé
								</label>
								<textarea
									id="custom-message"
									bind:value={customMessage}
									rows="4"
									placeholder="Votre message personnalisé..."
									class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 resize-none"
								></textarea>
								<p class="text-xs text-gray-500 mt-1">Ce message sera affiché sur l'interphone quand quelqu'un sonne</p>
							</div>

							<!-- Volume -->
							<div>
								<label for="intercom-volume" class="block text-sm font-medium text-gray-700 mb-2">
									Volume de l'interphone: {intercomVolume}%
								</label>
								<input
									type="range"
									id="intercom-volume"
									bind:value={intercomVolume}
									min="0"
									max="100"
									step="5"
									class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
								/>
							</div>
						</div>
					</div>

					<!-- Apparence -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
								<svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
								</svg>
							</div>
							<h2 class="text-xl font-semibold text-gray-900">Apparence</h2>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<!-- Theme -->
							<div>
								<label for="theme-select" class="block text-sm font-medium text-gray-700 mb-2">
									Thème
								</label>
								<div class="relative">
									<select
										id="theme-select"
										bind:value={selectedTheme}
										class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 appearance-none"
									>
										<option value="light">Clair</option>
										<option value="dark">Sombre</option>
										<option value="auto">Automatique</option>
									</select>
									<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
										</svg>
									</div>
								</div>
							</div>

							<!-- Language -->
							<div>
								<label for="language-select" class="block text-sm font-medium text-gray-700 mb-2">
									Langue
								</label>
								<div class="relative">
									<select
										id="language-select"
										bind:value={selectedLanguage}
										class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 appearance-none"
									>
										<option value="fr">Français</option>
										<option value="en">English</option>
										<option value="es">Español</option>
										<option value="de">Deutsch</option>
									</select>
									<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
										</svg>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Automatisation -->
					<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
								<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h2 class="text-xl font-semibold text-gray-900">Automatisation</h2>
						</div>

						<div class="space-y-5">
							<!-- Auto Schedule -->
							<div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
								<div class="flex-1">
									<span class="text-sm font-medium text-gray-900">Planning automatique</span>
									<p class="text-xs text-gray-500">Activer/désactiver le système selon un planning</p>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										bind:checked={autoScheduleEnabled}
										class="sr-only peer"
									/>
									<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
								</label>
							</div>

							{#if autoScheduleEnabled}
								<div class="ml-6 space-y-3 border-l-2 border-teal-200 pl-4">
									<div>
										<label for="schedule-start" class="block text-sm font-medium text-gray-700 mb-2">
											Désactivation automatique à
										</label>
										<input
											type="time"
											id="schedule-start"
											bind:value={scheduleStartTime}
											class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
										/>
									</div>
									<div>
										<label for="schedule-end" class="block text-sm font-medium text-gray-700 mb-2">
											Réactivation automatique à
										</label>
										<input
											type="time"
											id="schedule-end"
											bind:value={scheduleEndTime}
											class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
										/>
									</div>
								</div>
							{/if}

							<!-- Vacation Mode -->
							<div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
								<div class="flex-1">
									<span class="text-sm font-medium text-gray-900">Mode vacances</span>
									<p class="text-xs text-gray-500">Surveillance renforcée pendant votre absence</p>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										bind:checked={vacationModeEnabled}
										class="sr-only peer"
									/>
									<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
								</label>
							</div>

							{#if vacationModeEnabled}
								<div class="ml-6 space-y-3 border-l-2 border-teal-200 pl-4">
									<div>
										<label for="vacation-start" class="block text-sm font-medium text-gray-700 mb-2">
											Date de début
										</label>
										<input
											type="date"
											id="vacation-start"
											bind:value={vacationStartDate}
											class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
										/>
									</div>
									<div>
										<label for="vacation-end" class="block text-sm font-medium text-gray-700 mb-2">
											Date de fin
										</label>
										<input
											type="date"
											id="vacation-end"
											bind:value={vacationEndDate}
											class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
										/>
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							type="button"
							on:click={resetSettings}
							class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
							Réinitialiser
						</button>

						<button
							type="submit"
							class="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Enregistrer les paramètres
						</button>
					</div>
				</form>
			</div>
		</div>
	</main>
</div>

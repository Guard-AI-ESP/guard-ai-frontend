<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import { onMount } from 'svelte';
	import {
		Bell, Shield, Video, User, MessageSquare, Palette, Clock, Check, RotateCcw
	} from '@lucide/svelte';

	// Notifications & Alertes
	let pushNotifications = $state(true);
	let emailAlerts = $state(false);
	let smsAlerts = $state(false);
	let soundEnabled = $state(true);
	let vibrationEnabled = $state(true);
	let alertEmail = $state('');
	let alertPhone = $state('');

	// Sécurité & Confidentialité
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let pinCode = $state('');
	let twoFactorEnabled = $state(false);
	let connectedDevices = $state([
		{ id: '1', name: 'iPhone 13', lastActive: '2024-12-12T10:30:00', location: 'Paris, France' },
		{ id: '2', name: 'MacBook Pro', lastActive: '2024-12-11T18:45:00', location: 'Paris, France' }
	]);

	// Caméras & Enregistrements
	let videoQuality = $state('1080p');
	let retentionDays = $state(30);
	let storageType = $state('cloud');
	let nightVisionEnabled = $state(true);
	let motionDetectionSensitivity = $state('medium');

	// Profil
	let profilePicPreview = $state('');
	let userEmail = $state('');
	let userPhone = $state('');
	let userName = $state('');

	// Interphone
	let customMessage = $state('');
	let intercomVolume = $state(80);

	// Apparence
	let selectedTheme = $state('light');
	let selectedLanguage = $state('fr');

	// Automatisation
	let autoScheduleEnabled = $state(false);
	let scheduleStartTime = $state('22:00');
	let scheduleEndTime = $state('07:00');
	let vacationModeEnabled = $state(false);
	let vacationStartDate = $state('');
	let vacationEndDate = $state('');

	// UI
	let saveToast = $state(false);
	let passwordError = $state('');
	let showDisconnectModal = $state(false);
	let deviceToDisconnect = $state<{ id: string; name: string } | null>(null);
	let showResetModal = $state(false);

	onMount(() => {
		const savedSettings = localStorage.getItem('guardai-settings');
		if (!savedSettings) return;
		const s = JSON.parse(savedSettings);

		pushNotifications = s.pushNotifications ?? true;
		emailAlerts = s.emailAlerts ?? false;
		smsAlerts = s.smsAlerts ?? false;
		soundEnabled = s.soundEnabled ?? true;
		vibrationEnabled = s.vibrationEnabled ?? true;
		alertEmail = s.alertEmail || '';
		alertPhone = s.alertPhone || '';
		pinCode = s.pinCode || '';
		twoFactorEnabled = s.twoFactorEnabled ?? false;
		videoQuality = s.videoQuality || '1080p';
		retentionDays = s.retentionDays || 30;
		storageType = s.storageType || 'cloud';
		nightVisionEnabled = s.nightVisionEnabled ?? true;
		motionDetectionSensitivity = s.motionDetectionSensitivity || 'medium';
		profilePicPreview = s.profilePicPreview || '';
		userEmail = s.userEmail || '';
		userPhone = s.userPhone || '';
		userName = s.userName || '';
		customMessage = s.customMessage || '';
		intercomVolume = s.intercomVolume || 80;
		selectedTheme = s.theme || 'light';
		selectedLanguage = s.language || 'fr';
		autoScheduleEnabled = s.autoScheduleEnabled ?? false;
		scheduleStartTime = s.scheduleStartTime || '22:00';
		scheduleEndTime = s.scheduleEndTime || '07:00';
		vacationModeEnabled = s.vacationModeEnabled ?? false;
		vacationStartDate = s.vacationStartDate || '';
		vacationEndDate = s.vacationEndDate || '';
	});

	function handleProfilePicChange(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (e) => { profilePicPreview = e.target?.result as string; };
		reader.readAsDataURL(file);
	}

	function saveSettings(e: Event) {
		e.preventDefault();
		localStorage.setItem('guardai-settings', JSON.stringify({
			pushNotifications, emailAlerts, smsAlerts, soundEnabled, vibrationEnabled,
			alertEmail, alertPhone, pinCode, twoFactorEnabled, videoQuality, retentionDays,
			storageType, nightVisionEnabled, motionDetectionSensitivity, profilePicPreview,
			userEmail, userPhone, userName, customMessage, intercomVolume,
			theme: selectedTheme, language: selectedLanguage, autoScheduleEnabled,
			scheduleStartTime, scheduleEndTime, vacationModeEnabled, vacationStartDate, vacationEndDate
		}));
		saveToast = true;
		setTimeout(() => (saveToast = false), 3000);
	}

	function confirmReset() {
		localStorage.removeItem('guardai-settings');
		location.reload();
	}

	function changePassword() {
		passwordError = '';
		if (!currentPassword || !newPassword || !confirmPassword) {
			passwordError = 'Veuillez remplir tous les champs';
			return;
		}
		if (newPassword !== confirmPassword) {
			passwordError = 'Les mots de passe ne correspondent pas';
			return;
		}
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
		saveToast = true;
		setTimeout(() => (saveToast = false), 3000);
	}

	function openDisconnectModal(device: { id: string; name: string }) {
		deviceToDisconnect = device;
		showDisconnectModal = true;
	}

	function confirmDisconnect() {
		if (deviceToDisconnect) {
			connectedDevices = connectedDevices.filter(d => d.id !== deviceToDisconnect!.id);
			deviceToDisconnect = null;
		}
	}

	function formatDateTime(dateString: string): string {
		return new Date(dateString).toLocaleString('fr-FR', {
			day: '2-digit', month: '2-digit', year: 'numeric',
			hour: '2-digit', minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Paramètres - Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<Sidebar />

	<main class="flex-1 overflow-y-auto">
		<div class="p-8 max-w-4xl mx-auto">

			{#if saveToast}
				<div class="fixed top-4 right-4 z-50">
					<div class="flex items-center gap-3 px-4 py-3 bg-white border border-green-200 rounded-lg shadow-md text-sm">
						<Check class="h-4 w-4 text-green-600 shrink-0" />
						<span class="text-green-800 font-medium">Paramètres enregistrés</span>
					</div>
				</div>
			{/if}

			<div class="mb-8">
				<h1 class="text-2xl font-semibold text-foreground">Paramètres</h1>
				<p class="text-sm text-muted-foreground mt-1">Gérez vos préférences et la configuration de votre système</p>
			</div>

			<form onsubmit={saveSettings} class="space-y-6">

				<!-- Notifications -->
				<Card.Root>
					<Card.Header>
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
								<Bell class="w-4 h-4 text-orange-600" />
							</div>
							<Card.Title class="text-base">Notifications & Alertes</Card.Title>
						</div>
					</Card.Header>
					<Card.Content class="space-y-1">
						<!-- Push -->
						<div class="flex items-center justify-between px-3 py-3 hover:bg-muted/30 rounded-lg transition-colors">
							<div>
								<p class="text-sm font-medium text-foreground">Notifications push</p>
								<p class="text-xs text-muted-foreground">Recevoir des notifications sur cet appareil</p>
							</div>
							<button
								type="button"
								onclick={() => (pushNotifications = !pushNotifications)}
								aria-label="Notifications push"
								class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none {pushNotifications ? 'bg-primary' : 'bg-input'}"
								role="switch"
								aria-checked={pushNotifications}
							>
								<span class="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform {pushNotifications ? 'translate-x-4' : 'translate-x-0'}"></span>
							</button>
						</div>

						<!-- Email -->
						<div class="flex items-center justify-between px-3 py-3 hover:bg-muted/30 rounded-lg transition-colors">
							<div>
								<p class="text-sm font-medium text-foreground">Alertes par email</p>
								<p class="text-xs text-muted-foreground">Recevoir des alertes importantes par email</p>
							</div>
							<button
								type="button"
								onclick={() => (emailAlerts = !emailAlerts)}
								aria-label="Alertes par email"
								class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none {emailAlerts ? 'bg-primary' : 'bg-input'}"
								role="switch"
								aria-checked={emailAlerts}
							>
								<span class="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform {emailAlerts ? 'translate-x-4' : 'translate-x-0'}"></span>
							</button>
						</div>
						{#if emailAlerts}
							<div class="ml-6 px-3">
								<Input type="email" bind:value={alertEmail} placeholder="email@exemple.com" class="mt-1" />
							</div>
						{/if}

						<!-- SMS -->
						<div class="flex items-center justify-between px-3 py-3 hover:bg-muted/30 rounded-lg transition-colors">
							<div>
								<p class="text-sm font-medium text-foreground">Alertes par SMS</p>
								<p class="text-xs text-muted-foreground">Recevoir des alertes critiques par SMS</p>
							</div>
							<button
								type="button"
								onclick={() => (smsAlerts = !smsAlerts)}
								aria-label="Alertes par SMS"
								class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none {smsAlerts ? 'bg-primary' : 'bg-input'}"
								role="switch"
								aria-checked={smsAlerts}
							>
								<span class="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform {smsAlerts ? 'translate-x-4' : 'translate-x-0'}"></span>
							</button>
						</div>
						{#if smsAlerts}
							<div class="ml-6 px-3">
								<Input type="tel" bind:value={alertPhone} placeholder="+33 6 12 34 56 78" class="mt-1" />
							</div>
						{/if}

						<!-- Sound -->
						<div class="flex items-center justify-between px-3 py-3 hover:bg-muted/30 rounded-lg transition-colors">
							<div>
								<p class="text-sm font-medium text-foreground">Sons</p>
								<p class="text-xs text-muted-foreground">Jouer un son pour les notifications</p>
							</div>
							<button
								type="button"
								onclick={() => (soundEnabled = !soundEnabled)}
								aria-label="Sons"
								class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none {soundEnabled ? 'bg-primary' : 'bg-input'}"
								role="switch"
								aria-checked={soundEnabled}
							>
								<span class="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform {soundEnabled ? 'translate-x-4' : 'translate-x-0'}"></span>
							</button>
						</div>

						<!-- Vibration -->
						<div class="flex items-center justify-between px-3 py-3 hover:bg-muted/30 rounded-lg transition-colors">
							<div>
								<p class="text-sm font-medium text-foreground">Vibrations</p>
								<p class="text-xs text-muted-foreground">Vibrer pour les notifications</p>
							</div>
							<button
								type="button"
								onclick={() => (vibrationEnabled = !vibrationEnabled)}
								aria-label="Vibrations"
								class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none {vibrationEnabled ? 'bg-primary' : 'bg-input'}"
								role="switch"
								aria-checked={vibrationEnabled}
							>
								<span class="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform {vibrationEnabled ? 'translate-x-4' : 'translate-x-0'}"></span>
							</button>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Sécurité -->
				<Card.Root>
					<Card.Header>
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
								<Shield class="w-4 h-4 text-red-600" />
							</div>
							<Card.Title class="text-base">Sécurité & Confidentialité</Card.Title>
						</div>
					</Card.Header>
					<Card.Content class="space-y-5">

						<!-- Change password -->
						<div class="border border-border rounded-lg p-4 space-y-3">
							<p class="text-sm font-semibold text-foreground">Changer le mot de passe</p>
							{#if passwordError}
								<p class="text-xs text-destructive">{passwordError}</p>
							{/if}
							<Input type="password" bind:value={currentPassword} placeholder="Mot de passe actuel" />
							<Input type="password" bind:value={newPassword} placeholder="Nouveau mot de passe" />
							<Input type="password" bind:value={confirmPassword} placeholder="Confirmer le nouveau mot de passe" />
							<Button type="button" variant="outline" class="w-full" onclick={changePassword}>
								Changer le mot de passe
							</Button>
						</div>

						<!-- PIN -->
						<div class="space-y-1.5">
							<Label for="pin-code">Code PIN (4 chiffres)</Label>
							<Input
								id="pin-code"
								type="text"
								bind:value={pinCode}
								maxlength={4}
								placeholder="••••"
							/>
							<p class="text-xs text-muted-foreground">Utilisé pour un accès rapide à l'application</p>
						</div>

						<!-- 2FA -->
						<div class="flex items-center justify-between px-3 py-3 hover:bg-muted/30 rounded-lg transition-colors">
							<div>
								<p class="text-sm font-medium text-foreground">Authentification à deux facteurs</p>
								<p class="text-xs text-muted-foreground">Sécurité renforcée pour votre compte</p>
							</div>
							<button
								type="button"
								onclick={() => (twoFactorEnabled = !twoFactorEnabled)}
								aria-label="Authentification à deux facteurs"
								class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none {twoFactorEnabled ? 'bg-primary' : 'bg-input'}"
								role="switch"
								aria-checked={twoFactorEnabled}
							>
								<span class="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform {twoFactorEnabled ? 'translate-x-4' : 'translate-x-0'}"></span>
							</button>
						</div>

						<!-- Connected devices -->
						<div class="border border-border rounded-lg p-4">
							<p class="text-sm font-semibold text-foreground mb-3">Appareils connectés</p>
							<div class="space-y-3">
								{#each connectedDevices as device (device.id)}
									<div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
										<div class="flex-1">
											<p class="text-sm font-medium text-foreground">{device.name}</p>
											<p class="text-xs text-muted-foreground">Dernière activité : {formatDateTime(device.lastActive)}</p>
											<p class="text-xs text-muted-foreground">{device.location}</p>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											class="text-destructive hover:text-destructive hover:bg-destructive/10"
											onclick={() => openDisconnectModal(device)}
										>
											Déconnecter
										</Button>
									</div>
								{/each}
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Caméras -->
				<Card.Root>
					<Card.Header>
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
								<Video class="w-4 h-4 text-purple-600" />
							</div>
							<Card.Title class="text-base">Caméras & Enregistrements</Card.Title>
						</div>
					</Card.Header>
					<Card.Content class="space-y-5">

						<div class="space-y-1.5">
							<Label for="video-quality">Qualité vidéo</Label>
							<select
								id="video-quality"
								bind:value={videoQuality}
								class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
							>
								<option value="720p">720p (HD)</option>
								<option value="1080p">1080p (Full HD)</option>
								<option value="1440p">1440p (2K)</option>
								<option value="2160p">2160p (4K)</option>
							</select>
						</div>

						<div class="space-y-1.5">
							<Label for="retention-days">Durée de conservation (jours)</Label>
							<Input id="retention-days" type="number" bind:value={retentionDays} min={7} max={365} />
							<p class="text-xs text-muted-foreground">Les enregistrements seront automatiquement supprimés après cette période</p>
						</div>

						<!-- Storage type -->
						<div class="space-y-2">
							<Label>Type de stockage</Label>
							<div class="grid grid-cols-2 gap-3">
								{#each [{ value: 'cloud', label: 'Cloud', desc: 'Stockage en ligne sécurisé' }, { value: 'local', label: 'Local', desc: 'Sur cet appareil uniquement' }] as opt}
									<label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all {storageType === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'}">
										<input type="radio" bind:group={storageType} value={opt.value} class="w-4 h-4 accent-primary" />
										<div class="ml-3">
											<p class="text-sm font-medium text-foreground">{opt.label}</p>
											<p class="text-xs text-muted-foreground">{opt.desc}</p>
										</div>
									</label>
								{/each}
							</div>
						</div>

						<!-- Night vision -->
						<div class="flex items-center justify-between px-3 py-3 hover:bg-muted/30 rounded-lg transition-colors">
							<div>
								<p class="text-sm font-medium text-foreground">Vision nocturne</p>
								<p class="text-xs text-muted-foreground">Activer automatiquement en basse lumière</p>
							</div>
							<button
								type="button"
								onclick={() => (nightVisionEnabled = !nightVisionEnabled)}
								aria-label="Vision nocturne"
								class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none {nightVisionEnabled ? 'bg-primary' : 'bg-input'}"
								role="switch"
								aria-checked={nightVisionEnabled}
							>
								<span class="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform {nightVisionEnabled ? 'translate-x-4' : 'translate-x-0'}"></span>
							</button>
						</div>

						<div class="space-y-1.5">
							<Label for="motion-sensitivity">Sensibilité de détection de mouvement</Label>
							<select
								id="motion-sensitivity"
								bind:value={motionDetectionSensitivity}
								class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
							>
								<option value="low">Faible</option>
								<option value="medium">Moyenne</option>
								<option value="high">Élevée</option>
							</select>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Profil -->
				<Card.Root>
					<Card.Header>
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
								<User class="w-4 h-4 text-teal-600" />
							</div>
							<Card.Title class="text-base">Profil</Card.Title>
						</div>
					</Card.Header>
					<Card.Content class="space-y-5">

						<!-- Avatar -->
						<div class="flex items-center gap-4">
							{#if profilePicPreview}
								<img src={profilePicPreview} alt="Profile" class="w-16 h-16 rounded-full object-cover border border-border" />
							{:else}
								<div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
									<User class="w-8 h-8 text-muted-foreground" />
								</div>
							{/if}
							<label class="cursor-pointer">
								<Button type="button" variant="outline" size="sm" onclick={() => {}}>
									Choisir une photo
								</Button>
								<input type="file" accept="image/*" onchange={handleProfilePicChange} class="hidden" />
							</label>
						</div>

						<div class="space-y-1.5">
							<Label for="user-name">Nom</Label>
							<Input id="user-name" type="text" bind:value={userName} placeholder="Votre nom" />
						</div>
						<div class="space-y-1.5">
							<Label for="user-email">Email</Label>
							<Input id="user-email" type="email" bind:value={userEmail} placeholder="exemple@mail.com" />
						</div>
						<div class="space-y-1.5">
							<Label for="user-phone">Numéro de téléphone</Label>
							<Input id="user-phone" type="tel" bind:value={userPhone} placeholder="+33 6 12 34 56 78" />
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Interphone -->
				<Card.Root>
					<Card.Header>
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
								<MessageSquare class="w-4 h-4 text-blue-600" />
							</div>
							<Card.Title class="text-base">Interphone</Card.Title>
						</div>
					</Card.Header>
					<Card.Content class="space-y-5">
						<div class="space-y-1.5">
							<Label for="custom-message">Message personnalisé</Label>
							<textarea
								id="custom-message"
								bind:value={customMessage}
								rows={4}
								placeholder="Votre message personnalisé..."
								class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
							></textarea>
							<p class="text-xs text-muted-foreground">Ce message sera affiché sur l'interphone quand quelqu'un sonne</p>
						</div>

						<div class="space-y-2">
							<Label for="intercom-volume">Volume : {intercomVolume}%</Label>
							<input
								id="intercom-volume"
								type="range"
								bind:value={intercomVolume}
								min={0}
								max={100}
								step={5}
								class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
							/>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Apparence -->
				<Card.Root>
					<Card.Header>
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
								<Palette class="w-4 h-4 text-indigo-600" />
							</div>
							<Card.Title class="text-base">Apparence</Card.Title>
						</div>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
							<div class="space-y-1.5">
								<Label for="theme-select">Thème</Label>
								<select
									id="theme-select"
									bind:value={selectedTheme}
									class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
								>
									<option value="light">Clair</option>
									<option value="dark">Sombre</option>
									<option value="auto">Automatique</option>
								</select>
							</div>
							<div class="space-y-1.5">
								<Label for="language-select">Langue</Label>
								<select
									id="language-select"
									bind:value={selectedLanguage}
									class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
								>
									<option value="fr">Français</option>
									<option value="en">English</option>
									<option value="es">Español</option>
									<option value="de">Deutsch</option>
								</select>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Automatisation -->
				<Card.Root>
					<Card.Header>
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
								<Clock class="w-4 h-4 text-green-600" />
							</div>
							<Card.Title class="text-base">Automatisation</Card.Title>
						</div>
					</Card.Header>
					<Card.Content class="space-y-1">

						<!-- Auto schedule -->
						<div class="flex items-center justify-between px-3 py-3 hover:bg-muted/30 rounded-lg transition-colors">
							<div>
								<p class="text-sm font-medium text-foreground">Planning automatique</p>
								<p class="text-xs text-muted-foreground">Activer/désactiver le système selon un planning</p>
							</div>
							<button
								type="button"
								onclick={() => (autoScheduleEnabled = !autoScheduleEnabled)}
								aria-label="Planning automatique"
								class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none {autoScheduleEnabled ? 'bg-primary' : 'bg-input'}"
								role="switch"
								aria-checked={autoScheduleEnabled}
							>
								<span class="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform {autoScheduleEnabled ? 'translate-x-4' : 'translate-x-0'}"></span>
							</button>
						</div>
						{#if autoScheduleEnabled}
							<div class="ml-4 pl-4 border-l-2 border-primary/30 space-y-3 py-2">
								<div class="space-y-1.5">
									<Label for="schedule-start">Désactivation automatique à</Label>
									<Input id="schedule-start" type="time" bind:value={scheduleStartTime} />
								</div>
								<div class="space-y-1.5">
									<Label for="schedule-end">Réactivation automatique à</Label>
									<Input id="schedule-end" type="time" bind:value={scheduleEndTime} />
								</div>
							</div>
						{/if}

						<!-- Vacation mode -->
						<div class="flex items-center justify-between px-3 py-3 hover:bg-muted/30 rounded-lg transition-colors">
							<div>
								<p class="text-sm font-medium text-foreground">Mode vacances</p>
								<p class="text-xs text-muted-foreground">Surveillance renforcée pendant votre absence</p>
							</div>
							<button
								type="button"
								onclick={() => (vacationModeEnabled = !vacationModeEnabled)}
								aria-label="Mode vacances"
								class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none {vacationModeEnabled ? 'bg-primary' : 'bg-input'}"
								role="switch"
								aria-checked={vacationModeEnabled}
							>
								<span class="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform {vacationModeEnabled ? 'translate-x-4' : 'translate-x-0'}"></span>
							</button>
						</div>
						{#if vacationModeEnabled}
							<div class="ml-4 pl-4 border-l-2 border-primary/30 space-y-3 py-2">
								<div class="space-y-1.5">
									<Label for="vacation-start">Date de début</Label>
									<Input id="vacation-start" type="date" bind:value={vacationStartDate} />
								</div>
								<div class="space-y-1.5">
									<Label for="vacation-end">Date de fin</Label>
									<Input id="vacation-end" type="date" bind:value={vacationEndDate} />
								</div>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>

				<!-- Actions -->
				<div class="flex flex-col sm:flex-row gap-3 justify-end pb-8">
					<Button
						type="button"
						variant="outline"
						onclick={() => (showResetModal = true)}
					>
						<RotateCcw class="w-4 h-4 mr-1.5" /> Réinitialiser
					</Button>
					<Button type="submit">
						<Check class="w-4 h-4 mr-1.5" /> Enregistrer les paramètres
					</Button>
				</div>

			</form>
		</div>
	</main>
</div>

<!-- Disconnect modal -->
<DeleteModal
	bind:open={showDisconnectModal}
	title="Déconnecter l'appareil"
	message={deviceToDisconnect ? `Êtes-vous sûr de vouloir déconnecter ${deviceToDisconnect.name} ?` : ''}
	confirmText="Déconnecter"
	onConfirm={confirmDisconnect}
/>

<!-- Reset modal -->
<DeleteModal
	bind:open={showResetModal}
	title="Réinitialiser les paramètres"
	message="Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible."
	confirmText="Réinitialiser"
	onConfirm={confirmReset}
/>

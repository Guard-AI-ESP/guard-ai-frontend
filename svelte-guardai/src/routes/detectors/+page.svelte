<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
import { Zap, MapPin, Clock, Check } from '@lucide/svelte';

	type Detector = {
		id: string;
		name: string;
		location: string;
		enabled: boolean;
		range: string;
		lastActivity: Date | null;
	};

	let detectors = $state<Detector[]>([
		{ id: '1', name: 'Détecteur Entrée', location: 'Entrée principale', enabled: true, range: '1.2m', lastActivity: new Date('2024-12-11T14:30:00') },
		{ id: '2', name: 'Détecteur Garage', location: 'Garage', enabled: true, range: '1m', lastActivity: new Date('2024-12-11T12:15:00') },
		{ id: '3', name: 'Détecteur Jardin', location: 'Portail arrière', enabled: false, range: '1.2m', lastActivity: null },
	]);

	let globalEnabled = $state(true);
	let selectedRange = $state('1m');
	let saveToast = $state(false);

	const rangeOptions = ['1m', '1.2m', '1.5m', '2m'];

	const activeCount = $derived(detectors.filter(d => d.enabled).length);
	const inactiveCount = $derived(detectors.filter(d => !d.enabled).length);

	function toggleGlobal() {
		globalEnabled = !globalEnabled;
		detectors = detectors.map(d => ({ ...d, enabled: globalEnabled }));
	}

	function toggleDetector(id: string) {
		detectors = detectors.map(d => d.id === id ? { ...d, enabled: !d.enabled } : d);
	}

	function saveSettings() {
		saveToast = true;
		setTimeout(() => (saveToast = false), 3000);
	}

	function formatDateTime(date: Date | null): string {
		if (!date) return 'Jamais';
		return date.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	}
</script>

<svelte:head>
	<title>Détecteurs - Guard AI</title>
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

			<div class="flex items-center justify-between mb-8">
				<h1 class="text-2xl font-semibold text-foreground">Détecteurs de présence</h1>
			</div>

			<!-- Global status -->
			<Card.Root class="mb-4">
				<Card.Content class="p-6">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-4">
							<div class="w-10 h-10 rounded-full {globalEnabled ? 'bg-green-100' : 'bg-muted'} flex items-center justify-center">
								<Zap class="w-5 h-5 {globalEnabled ? 'text-green-600' : 'text-muted-foreground'}" />
							</div>
							<div>
								<p class="text-sm font-semibold text-foreground">Statut global</p>
								<p class="text-xs text-muted-foreground">{globalEnabled ? 'Tous les détecteurs sont actifs' : 'Tous les détecteurs sont désactivés'}</p>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<Badge variant="outline" class={globalEnabled ? 'border-green-200 text-green-700 bg-green-50' : 'border-muted text-muted-foreground'}>
								{globalEnabled ? 'Actifs' : 'Inactifs'}
							</Badge>
							<Button variant="outline" size="sm" onclick={toggleGlobal}>
								{globalEnabled ? 'Tout désactiver' : 'Tout activer'}
							</Button>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Range settings -->
			<Card.Root class="mb-4">
				<Card.Header class="pb-3">
					<Card.Title class="text-base">Portée par défaut</Card.Title>
					<Card.Description>Appliquée aux nouveaux détecteurs</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="flex items-center gap-3">
						{#each rangeOptions as opt}
							<Button
								variant={selectedRange === opt ? 'default' : 'outline'}
								size="sm"
								onclick={() => (selectedRange = opt)}
							>
								{opt}
							</Button>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Detectors list -->
			<Card.Root class="mb-6">
				<Card.Header class="pb-3">
					<Card.Title class="text-base">Détecteurs installés</Card.Title>
				</Card.Header>
				<Card.Content class="p-0">
					<div class="divide-y divide-border">
						{#each detectors as detector (detector.id)}
							<div class="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
								<div class="flex items-center gap-4">
									<div class="w-9 h-9 rounded-full {detector.enabled ? 'bg-green-100' : 'bg-muted'} flex items-center justify-center shrink-0">
										<Zap class="w-4 h-4 {detector.enabled ? 'text-green-600' : 'text-muted-foreground'}" />
									</div>
									<div>
										<p class="text-sm font-medium text-foreground">{detector.name}</p>
										<div class="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
											<span class="flex items-center gap-1"><MapPin class="w-3 h-3" />{detector.location}</span>
											<span>Portée: {detector.range}</span>
											<span class="flex items-center gap-1"><Clock class="w-3 h-3" />{formatDateTime(detector.lastActivity)}</span>
										</div>
									</div>
								</div>
								<button
									onclick={() => toggleDetector(detector.id)}
									aria-label="Activer/désactiver {detector.name}"
									class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none {detector.enabled ? 'bg-primary' : 'bg-input'}"
									role="switch"
									aria-checked={detector.enabled}
								>
									<span class="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform {detector.enabled ? 'translate-x-4' : 'translate-x-0'}"></span>
								</button>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>

			<div class="flex justify-end mb-8">
				<Button onclick={saveSettings}>
					<Check class="w-4 h-4 mr-1.5" /> Enregistrer
				</Button>
			</div>

			<!-- Stats -->
			<div class="grid grid-cols-3 gap-4">
				{#each [
					{ label: 'Actifs', value: activeCount, color: 'text-green-600' },
					{ label: 'Inactifs', value: inactiveCount, color: 'text-muted-foreground' },
					{ label: 'Total', value: detectors.length, color: 'text-primary' }
				] as stat}
					<Card.Root>
						<Card.Header class="pb-2">
							<Card.Description>{stat.label}</Card.Description>
						</Card.Header>
						<Card.Content>
							<p class="text-4xl font-bold tracking-tight {stat.color}">{stat.value}</p>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>

		</div>
	</main>
</div>

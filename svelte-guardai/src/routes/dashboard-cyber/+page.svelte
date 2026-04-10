<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Monitor, TriangleAlert, Wifi, ShieldCheck, ScanLine, Server, Lock, BookOpen, Trash2 } from '@lucide/svelte';

	type Device = {
		id: string;
		name: string;
	};

	let devices = $state<Device[]>([
		{ id: '1', name: 'Device-001' },
		{ id: '2', name: 'Device-002' },
		{ id: '3', name: 'Device-003' },
		{ id: '4', name: 'Device-004' },
	]);

	let scanProgress = $state(70);
	let isScanning = $state(false);
	let showDeleteModal = $state(false);
	let deviceToDelete = $state<Device | null>(null);

	function startAnalysis() {
		isScanning = true;
		scanProgress = 0;

		const interval = setInterval(() => {
			scanProgress += 10;
			if (scanProgress >= 100) {
				clearInterval(interval);
				setTimeout(() => {
					isScanning = false;
					scanProgress = 70;
				}, 500);
			}
		}, 300);
	}

	function openDeleteModal(device: Device) {
		deviceToDelete = device;
		showDeleteModal = true;
	}

	function confirmDelete() {
		if (deviceToDelete) {
			devices = devices.filter(d => d.id !== deviceToDelete!.id);
			deviceToDelete = null;
		}
	}
</script>

<svelte:head>
	<title>Cyber Dashboard - Guard AI</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<Sidebar />

	<main class="flex-1 overflow-y-auto">
		<div class="p-8 max-w-7xl mx-auto">

			<h1 class="text-2xl font-semibold text-foreground mb-8">Cyber Dashboard</h1>

			<!-- Stats -->
			<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<Card.Root>
					<Card.Content class="p-6">
						<div class="flex items-center justify-between mb-3">
							<Card.Description>Active Devices</Card.Description>
							<Monitor class="w-4 h-4 text-teal-500" />
						</div>
						<p class="text-4xl font-bold tracking-tight text-foreground">{devices.length}</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Content class="p-6">
						<div class="flex items-center justify-between mb-3">
							<Card.Description>Threats Detected</Card.Description>
							<TriangleAlert class="w-4 h-4 text-destructive" />
						</div>
						<p class="text-4xl font-bold tracking-tight text-destructive">0</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Content class="p-6">
						<div class="flex items-center justify-between mb-3">
							<Card.Description>WiFi Status</Card.Description>
							<Wifi class="w-4 h-4 text-green-500" />
						</div>
						<p class="text-xl font-bold text-green-600">Active</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Content class="p-6">
						<div class="flex items-center justify-between mb-3">
							<Card.Description>Firewall</Card.Description>
							<ShieldCheck class="w-4 h-4 text-teal-500" />
						</div>
						<p class="text-xl font-bold text-teal-600">Protected</p>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Main grid -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

				<!-- Left col -->
				<div class="lg:col-span-2 space-y-6">

					<!-- Network Scanning -->
					<Card.Root>
						<Card.Header>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
										<ScanLine class="w-5 h-5 text-pink-600" />
									</div>
									<div>
										<Card.Title class="text-base">Security Dashboard</Card.Title>
										<Card.Description>Network scanning</Card.Description>
									</div>
								</div>
								<Button
									onclick={startAnalysis}
									disabled={isScanning}
									class="bg-pink-600 hover:bg-pink-700 text-white"
								>
									{isScanning ? 'Scanning...' : 'Analyze'}
								</Button>
							</div>
						</Card.Header>
						<Card.Content>
							<!-- Progress bar -->
							<div class="mb-4">
								<div class="flex items-center justify-between mb-2">
									<span class="text-sm font-medium text-foreground">General scanning</span>
									<span class="text-sm font-semibold text-foreground">{scanProgress}%</span>
								</div>
								<div class="w-full bg-muted rounded-full h-2.5 overflow-hidden">
									<div
										class="bg-pink-500 h-2.5 rounded-full transition-all duration-300"
										style="width: {scanProgress}%"
									></div>
								</div>
							</div>

							<!-- Radar -->
							{#if isScanning}
								<div class="flex items-center justify-center py-10">
									<div class="relative w-44 h-44">
										<div class="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
										<div class="absolute inset-4 border-4 border-pink-300 rounded-full"></div>
										<div class="absolute inset-8 border-4 border-pink-400 rounded-full"></div>
										<div class="absolute inset-0 animate-spin" style="animation-duration: 2s;">
											<div class="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-pink-600 to-transparent origin-left"></div>
										</div>
										<div class="absolute top-1/2 left-1/2 w-3 h-3 bg-pink-600 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
									</div>
								</div>
							{/if}
						</Card.Content>
					</Card.Root>

					<!-- Device list -->
					<Card.Root>
						<Card.Header class="pb-3">
							<Card.Title class="text-base">Scanning by device</Card.Title>
						</Card.Header>
						<Card.Content class="p-0">
							{#if devices.length === 0}
								<div class="text-center py-12 text-muted-foreground">
									<Monitor class="w-12 h-12 mx-auto mb-3 opacity-30" />
									<p class="text-sm">Aucun dispositif trouvé.</p>
								</div>
							{:else}
								<div class="divide-y divide-border">
									{#each devices as device (device.id)}
										<div class="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
											<div class="flex items-center gap-3">
												<div class="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
													<Monitor class="w-4 h-4 text-teal-600" />
												</div>
												<div>
													<p class="text-sm font-medium text-foreground">{device.name}</p>
													<Badge variant="outline" class="text-[10px] border-green-200 text-green-700 bg-green-50 mt-0.5">Online</Badge>
												</div>
											</div>
											<button
												onclick={() => openDeleteModal(device)}
												class="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md transition-colors"
												title="Delete device"
											>
												<Trash2 class="w-4 h-4" />
											</button>
										</div>
									{/each}
								</div>
							{/if}
						</Card.Content>
					</Card.Root>
				</div>

				<!-- Right col — Logs -->
				<div class="lg:col-span-1">
					<Card.Root class="sticky top-8">
						<Card.Header class="pb-3">
							<div class="flex items-center gap-3">
								<div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
									<BookOpen class="w-4 h-4 text-blue-600" />
								</div>
								<Card.Title class="text-base">Security Logs</Card.Title>
							</div>
						</Card.Header>
						<Card.Content class="space-y-4">
							{#each [
								{ color: 'bg-green-500', title: 'System Start', time: '12 Dec 2025, 14:30', desc: 'All systems operational. Security protocols activated.' },
								{ color: 'bg-blue-500', title: 'Device Connected', time: '12 Dec 2025, 13:45', desc: 'New device detected and authenticated successfully.' },
								{ color: 'bg-yellow-500', title: 'Firewall Update', time: '12 Dec 2025, 12:00', desc: 'Firewall rules updated. 3 new rules added.' },
								{ color: 'bg-purple-500', title: 'Scan Completed', time: '12 Dec 2025, 10:15', desc: 'Network scan completed. No threats detected.' },
							] as log}
								<div class="pb-4 border-b border-border last:border-0 last:pb-0">
									<div class="flex items-start gap-2 mb-1">
										<div class="w-2 h-2 {log.color} rounded-full mt-1.5 shrink-0"></div>
										<div class="flex-1">
											<p class="text-sm font-medium text-foreground">{log.title}</p>
											<p class="text-xs text-muted-foreground">{log.time}</p>
										</div>
									</div>
									<p class="text-xs text-muted-foreground ml-4">{log.desc}</p>
								</div>
							{/each}
						</Card.Content>
						<div class="px-6 pb-6">
							<Button variant="outline" class="w-full text-sm">View all logs</Button>
						</div>
					</Card.Root>
				</div>
			</div>

			<!-- Quick Settings -->
			<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
				{#each [
					{ href: '/wifi', icon: Wifi, label: 'WiFi Settings', desc: 'Configure network', bg: 'bg-blue-100', text: 'text-blue-600' },
					{ href: '/dhcp', icon: Server, label: 'DHCP Server', desc: 'Manage IP addresses', bg: 'bg-purple-100', text: 'text-purple-600' },
					{ href: '/radius', icon: Lock, label: 'RADIUS Server', desc: 'Authentication', bg: 'bg-orange-100', text: 'text-orange-600' },
					{ href: '/firewall', icon: ShieldCheck, label: 'Firewall', desc: 'Security rules', bg: 'bg-red-100', text: 'text-red-600' },
				] as item}
					<a href={item.href}>
						<Card.Root class="hover:shadow-md transition-shadow cursor-pointer">
							<Card.Content class="p-5">
								<div class="flex items-center gap-4">
									<div class="w-10 h-10 rounded-full {item.bg} flex items-center justify-center shrink-0">
										<item.icon class="w-5 h-5 {item.text}" />
									</div>
									<div>
										<p class="text-sm font-semibold text-foreground">{item.label}</p>
										<p class="text-xs text-muted-foreground">{item.desc}</p>
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					</a>
				{/each}
			</div>

		</div>
	</main>
</div>

<DeleteModal
	bind:open={showDeleteModal}
	title="Delete Device"
	message={deviceToDelete ? `Are you sure you want to delete ${deviceToDelete.name}? This action cannot be undone.` : ''}
	onConfirm={confirmDelete}
/>

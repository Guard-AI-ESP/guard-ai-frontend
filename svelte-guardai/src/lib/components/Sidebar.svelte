<script lang="ts">
	import { page } from '$app/state';
	import { Separator } from '$lib/components/ui/separator';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import {
		LayoutDashboard, ShieldCheck, Camera, MessageSquare, Zap,
		CalendarDays, Phone, Settings, CircleHelp, LogOut,
		ChevronDown, ChevronRight, Video, Cpu
	} from '@lucide/svelte';
	import { authStore, authToken } from '$lib/stores/auth.svelte';

	let isCameraOpen = $state(false);
	let isEventOpen = $state(false);

	function isActive(path: string): boolean {
		return page.url.pathname === path || page.url.pathname.startsWith(path + '/');
	}

	$effect(() => {
		if (page.url.pathname.startsWith('/recordings')) isCameraOpen = true;
		if (page.url.pathname.startsWith('/events')) isEventOpen = true;
	});

	/** Extrait l'email depuis le payload JWT (sans vérification de signature) */
	function getUserEmail(token: string | null): string {
		if (!token) return '';
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return payload.sub ?? '';
		} catch {
			return '';
		}
	}

	/** Initiales pour l'avatar (ex: "ab@x.com" → "AB") */
	function getInitials(email: string): string {
		if (!email) return '?';
		return email.slice(0, 2).toUpperCase();
	}

	const navItemClass = (active: boolean) =>
		`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
			active
				? 'bg-accent text-foreground font-medium border-l-2 border-primary pl-[10px]'
				: 'text-muted-foreground hover:bg-accent hover:text-foreground border-l-2 border-transparent pl-[10px]'
		}`;

	const subNavItemClass = (active: boolean) =>
		`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
			active
				? 'text-primary font-medium bg-primary/5'
				: 'text-muted-foreground hover:bg-accent hover:text-foreground'
		}`;
</script>

<aside class="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col overflow-y-auto">

	<!-- Logo -->
	<div class="h-14 flex items-center px-4 border-b border-sidebar-border shrink-0">
		<div class="flex items-center gap-2.5">
			<div class="relative w-8 h-8 shrink-0">
				<svg class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M12 2L4 6v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4z" stroke-linejoin="round"/>
				</svg>
				<div class="absolute inset-0 flex items-center justify-center">
					<svg class="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="currentColor">
						<rect x="8" y="11" width="8" height="9" rx="1.5" />
						<path d="M10 11V8a2 2 0 0 1 4 0v3" fill="none" stroke="white" stroke-width="1.5"/>
					</svg>
				</div>
			</div>
			<span class="text-base font-semibold text-foreground tracking-tight">Guard AI</span>
		</div>
	</div>

	<!-- Nav -->
	<nav class="flex-1 px-3 py-4 space-y-5 overflow-y-auto">

		<!-- Main -->
		<div>
			<p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Main</p>
			<ul class="space-y-0.5">
				<li>
					<a href="/dashboard" class={navItemClass(isActive('/dashboard') && !isActive('/dashboard-cyber'))}>
						<LayoutDashboard class="w-4 h-4 shrink-0" />
						Dashboard
					</a>
				</li>
				<li>
					<a href="/dashboard-cyber" class={navItemClass(isActive('/dashboard-cyber'))}>
						<ShieldCheck class="w-4 h-4 shrink-0" />
						Dashboard Cyber
					</a>
				</li>
				<li>
					<button
						onclick={() => (isCameraOpen = !isCameraOpen)}
						class={navItemClass(isActive('/recordings'))}
					>
						<Camera class="w-4 h-4 shrink-0" />
						<span class="flex-1 text-left">Caméra</span>
						<ChevronDown class="w-3.5 h-3.5 transition-transform {isCameraOpen ? 'rotate-180' : ''}" />
					</button>
					{#if isCameraOpen}
						<ul class="mt-0.5 ml-6 space-y-0.5">
							<li>
								<button class={subNavItemClass(false)}>
									<Video class="w-3.5 h-3.5" /> Live View
								</button>
							</li>
							<li>
								<a href="/recordings" class={subNavItemClass(isActive('/recordings'))}>
									<ChevronRight class="w-3.5 h-3.5" /> Recordings
								</a>
							</li>
						</ul>
					{/if}
				</li>
				<li>
					<a href="/messages" class={navItemClass(isActive('/messages'))}>
						<MessageSquare class="w-4 h-4 shrink-0" />
						Messages
					</a>
				</li>
				<li>
					<a href="/detectors" class={navItemClass(isActive('/detectors'))}>
						<Zap class="w-4 h-4 shrink-0" />
						Détecteurs
					</a>
				</li>
				<li>
					<a href="/sensors" class={navItemClass(isActive('/sensors'))}>
						<Cpu class="w-4 h-4 shrink-0" />
						Capteurs IoT
					</a>
				</li>
				<li>
					<button
						onclick={() => (isEventOpen = !isEventOpen)}
						class={navItemClass(isActive('/events'))}
					>
						<CalendarDays class="w-4 h-4 shrink-0" />
						<span class="flex-1 text-left">Évènements</span>
						<ChevronDown class="w-3.5 h-3.5 transition-transform {isEventOpen ? 'rotate-180' : ''}" />
					</button>
					{#if isEventOpen}
						<ul class="mt-0.5 ml-6 space-y-0.5">
							<li>
								<a href="/events/new" class={subNavItemClass(isActive('/events/new'))}>
									<ChevronRight class="w-3.5 h-3.5" /> Nouveau
								</a>
							</li>
						</ul>
					{/if}
				</li>
				<li>
					<a href="/journal-appels" class={navItemClass(isActive('/journal-appels'))}>
						<Phone class="w-4 h-4 shrink-0" />
						Journal d'appels
					</a>
				</li>
			</ul>
		</div>

		<!-- Settings -->
		<div>
			<p class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Paramètres</p>
			<ul class="space-y-0.5">
				<li>
					<a href="/settings" class={navItemClass(isActive('/settings'))}>
						<Settings class="w-4 h-4 shrink-0" />
						Settings
					</a>
				</li>
				<li>
					<button class={navItemClass(false)}>
						<CircleHelp class="w-4 h-4 shrink-0" />
						Help
					</button>
				</li>
			</ul>
		</div>
	</nav>

	<!-- User footer -->
	<div class="border-t border-sidebar-border p-3 shrink-0">
		<Separator class="mb-3" />
		{#snippet userFooter()}
			{@const email = getUserEmail($authToken)}
			<div class="flex items-center gap-3 px-1">
				<Avatar class="h-8 w-8 shrink-0">
					<AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">
						{getInitials(email)}
					</AvatarFallback>
				</Avatar>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-foreground truncate">{email || 'Utilisateur'}</p>
					<p class="text-xs text-muted-foreground truncate">Guard AI</p>
				</div>
				<button
					onclick={() => authStore.logout()}
					title="Se déconnecter"
					class="text-muted-foreground hover:text-destructive transition-colors"
				>
					<LogOut class="w-4 h-4" />
				</button>
			</div>
		{/snippet}
		{@render userFooter()}
	</div>
</aside>

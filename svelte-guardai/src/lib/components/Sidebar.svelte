<script lang="ts">
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth.svelte';

	type NavItem = {
		label: string;
		icon: string;
		href: string;
		badge?: number;
		sub?: boolean;
	};

	const navItems: NavItem[] = [
		{ label: 'Dashboard Caméra',       icon: 'dashboard',     href: '/dashboard'    },
		{ label: 'Caméra',                 icon: 'videocam',      href: '/camera',     sub: true },
		{ label: 'Messages',               icon: 'chat',          href: '/messages',   sub: true, badge: 3 },
		{ label: 'Détecteurs de présence', icon: 'sensors',       href: '/detectors',  sub: true },
		{ label: 'Événements',             icon: 'notifications', href: '/events',     sub: true },
		{ label: 'Appels',                 icon: 'call',          href: '/calls',      sub: true },
		{ label: 'Personnes',              icon: 'people',        href: '/persons',    sub: true },
		{ label: 'Capteurs IoT',           icon: 'memory',        href: '/sensors',    sub: true },
	];

	const cyberItems: NavItem[] = [
		{ label: 'Dashboard Cyber', icon: 'shield',              href: '/cyber'          },
		{ label: 'WiFi',            icon: 'wifi',                href: '/cyber/wifi',     sub: true },
		{ label: 'Pare-feu',       icon: 'local_fire_department', href: '/cyber/firewall', sub: true },
		{ label: 'DHCP',            icon: 'dns',                 href: '/cyber/dhcp',     sub: true },
		{ label: 'RADIUS',          icon: 'lock',                href: '/cyber/radius',   sub: true },
	];

	// Sur mobile, fermée par défaut
	let open = $state(typeof window !== 'undefined' ? window.innerWidth >= 640 : true);

	function isActive(href: string): boolean {
		const path = $page.url.pathname;
		if (href === '/dashboard') return path === '/dashboard' || path.startsWith('/camera') || path.startsWith('/messages') || path.startsWith('/detectors') || path.startsWith('/events') || path.startsWith('/calls') || path.startsWith('/persons');
		if (href === '/cyber') return path.startsWith('/cyber');
		return path === href;
	}

	function activeClass(item: NavItem): string {
		if (!isActive(item.href)) return 'text-slate-500 hover:text-slate-800 hover:bg-slate-50';
		if (item.sub) return 'text-primary bg-primary/10 font-semibold';
		return 'text-white bg-primary shadow-lg shadow-primary/25';
	}
</script>

<!-- Backdrop mobile -->
{#if open}
	<div
		class="sm:hidden fixed inset-0 bg-black/30 z-30 backdrop-blur-sm"
		role="button"
		tabindex="-1"
		aria-label="Fermer le menu"
		onclick={() => open = false}
		onkeydown={(e) => e.key === 'Escape' && (open = false)}
	></div>
{/if}

<aside
	class="fixed sm:relative flex-shrink-0 h-screen z-40 sm:z-20 flex flex-col bg-white border-r border-slate-100 shadow-soft rounded-tr-[24px] rounded-br-[24px] transition-all duration-300 ease-in-out overflow-visible"
	style="width: {open ? '256px' : '0px'}; min-width: {open ? '256px' : '0px'};"
>
	<div
		class="flex flex-col h-full transition-opacity duration-200"
		style="opacity: {open ? 1 : 0}; pointer-events: {open ? 'auto' : 'none'}; min-width: 256px;"
	>
		<div class="flex items-center gap-3 px-6 py-7">
			<div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
				<span class="material-icons text-xl">security</span>
			</div>
			<span class="text-slate-900 font-bold text-lg tracking-tight">GuardAI</span>
		</div>

		<p class="px-6 mb-2 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Surveillance</p>

		<nav class="flex flex-col px-3 gap-0.5">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap
						{activeClass(item)}"
				>
					<span class="material-icons text-[20px]">{item.icon}</span>
					<span class="flex-1">{item.label}</span>
					{#if item.badge}
						<span class="bg-primary/20 text-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
							{item.badge}
						</span>
					{/if}
				</a>
			{/each}
		</nav>

		<div class="px-4 my-3">
			<div class="h-px bg-slate-100"></div>
		</div>
		<p class="px-6 mb-2 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Cybersécurité</p>
		<nav class="flex-1 flex flex-col px-3 gap-0.5">
			{#each cyberItems as item}
				<a
					href={item.href}
					class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap
						{activeClass(item)}"
				>
					<span class="material-icons text-[20px]">{item.icon}</span>
					<span class="flex-1">{item.label}</span>
				</a>
			{/each}
		</nav>

		<div class="px-3 pb-6 flex flex-col gap-0.5">
			<div class="h-px bg-slate-100 mx-3 mb-3"></div>
			<a href="/settings" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap">
				<span class="material-icons text-[20px]">settings</span>
				<span>Paramètres</span>
			</a>
			<button
				onclick={() => authStore.logout()}
				class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors whitespace-nowrap w-full text-left"
			>
				<span class="material-icons text-[20px]">logout</span>
				<span>Déconnexion</span>
			</button>
		</div>
	</div>

	<button
		onclick={() => open = !open}
		aria-label={open ? 'Réduire la sidebar' : 'Ouvrir la sidebar'}
		class="absolute top-8 -right-4 w-8 h-8 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors z-30"
	>
		<span class="material-icons text-[18px] transition-transform duration-300" style="transform: rotate({open ? '0deg' : '180deg'})">chevron_left</span>
	</button>
</aside>

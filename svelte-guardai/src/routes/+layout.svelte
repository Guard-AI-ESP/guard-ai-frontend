<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto, beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { isAuthenticated } from '$lib/stores/auth.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();

	const PUBLIC_ROUTES = ['/login', '/forgot-password'];

	function isPublicRoute(path: string): boolean {
		return PUBLIC_ROUTES.some((r) => path.startsWith(r));
	}

	onMount(() => {
		if (!$isAuthenticated && !isPublicRoute(page.url.pathname)) {
			goto('/login');
		}
	});

	beforeNavigate(({ to }) => {
		if (!to) return;
		if (!$isAuthenticated && !isPublicRoute(to.url.pathname)) {
			goto('/login');
		}
	});

	const showSidebar = $derived(!isPublicRoute(page.url.pathname));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if showSidebar}
	<div class="bg-background-light font-display min-h-screen flex selection:bg-primary selection:text-white">
		<Sidebar />
		<main class="flex-1 h-screen overflow-y-auto">
			<div class="p-8 max-w-[1600px] mx-auto flex flex-col gap-6">
				{@render children()}
			</div>
		</main>
	</div>
{:else}
	{@render children()}
{/if}

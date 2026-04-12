<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto, beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { isAuthenticated } from '$lib/stores/auth.svelte';

	let { children } = $props();

	const PUBLIC_ROUTES = ['/login', '/forgot-password'];

	function isPublicRoute(path: string): boolean {
		return PUBLIC_ROUTES.some((r) => path.startsWith(r));
	}

	// Vérification au chargement initial
	onMount(() => {
		if (!$isAuthenticated && !isPublicRoute(page.url.pathname)) {
			goto('/login');
		}
	});

	// Vérification avant chaque navigation
	beforeNavigate(({ to }) => {
		if (!to) return;
		if (!$isAuthenticated && !isPublicRoute(to.url.pathname)) {
			goto('/login');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

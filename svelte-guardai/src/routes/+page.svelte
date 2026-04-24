<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated } from '$lib/stores/auth.svelte';
	onMount(() => goto($isAuthenticated ? '/dashboard' : '/login'));
</script>

<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flowbite-datepicker@1.3.0/dist/css/datepicker.min.css" />
</svelte:head>

{@render children()}

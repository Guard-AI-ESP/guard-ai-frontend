<script lang="ts">
	import GalerieTab from '$lib/components/camera/GalerieTab.svelte';
	import EnregistrementsTab from '$lib/components/camera/EnregistrementsTab.svelte';
	import TabBar from '$lib/components/TabBar.svelte';

	let activeTab = $state('galerie');
</script>

<svelte:head>
	<title>Caméra - Guard AI</title>
</svelte:head>

<div class="flex items-center justify-between">
	<div>
		<h1 class="text-2xl font-semibold text-slate-800">Caméra</h1>
		<p class="text-slate-400 text-sm mt-0.5">Gérez vos enregistrements et votre galerie</p>
	</div>
</div>

<div class="w-full sm:w-fit">
	<TabBar
		tabs={[
			{ value: 'galerie', label: 'Galerie', icon: 'photo_library' },
			{ value: 'enregistrements', label: 'Enregistrements', icon: 'videocam' },
		]}
		active={activeTab}
		onchange={(v) => activeTab = v}
	/>
</div>

{#if activeTab === 'galerie'}
	<GalerieTab />
{:else}
	<EnregistrementsTab />
{/if}

<script lang="ts">
	import { authStore, authLoading, authError, isAuthenticated } from '$lib/stores/auth.svelte';
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let mode = $state<'login' | 'register'>('login');

	let localError = $state('');

	// Pill animation
	let tabContainerEl = $state<HTMLDivElement | undefined>();
	let pillLeft = $state(0);
	let pillWidth = $state(0);
	let pillReady = $state(false);

	function updatePill() {
		if (!tabContainerEl) return;
		const btn = tabContainerEl.querySelector(`[data-tab="${mode}"]`) as HTMLElement | null;
		if (!btn) return;
		pillLeft = btn.offsetLeft;
		pillWidth = btn.offsetWidth;
		if (!pillReady) pillReady = true;
	}

	$effect(() => {
		mode;
		tick().then(updatePill);
	});

	onMount(() => {
		if ($isAuthenticated) goto('/dashboard');
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		localError = '';

		if (mode === 'register') {
			if (password !== confirmPassword) {
				localError = 'Les mots de passe ne correspondent pas';
				return;
			}
			if (password.length < 6) {
				localError = 'Le mot de passe doit contenir au moins 6 caractères';
				return;
			}
			await authStore.register(email, password);
		} else {
			await authStore.login(email, password);
		}
	}

	function switchMode(newMode: 'login' | 'register') {
		mode = newMode;
		localError = '';
		authError.set(null);
		password = '';
		confirmPassword = '';
	}

	const displayError = $derived(localError || $authError);
</script>

<div class="min-h-screen bg-background-light font-display flex items-center justify-center p-4">

	{#if displayError}
		<div class="fixed top-4 right-4 z-50 min-w-72">
			<div class="flex items-center gap-3 px-4 py-3 bg-white border border-amber-200 rounded-xl shadow-soft text-sm">
				<span class="material-icons text-amber-500 text-[18px]">warning_amber</span>
				<span class="flex-1 text-amber-800 font-medium">{displayError}</span>
				<button onclick={() => { localError = ''; authError.set(null); }} class="text-slate-400 hover:text-slate-600">
					<span class="material-icons text-[18px]">close</span>
				</button>
			</div>
		</div>
	{/if}

	<div class="w-full max-w-sm bg-white rounded-[20px] border border-slate-100 shadow-soft p-8">

		<!-- Logo -->
		<div class="flex justify-center mb-6">
			<div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
				<span class="material-icons text-[28px]">security</span>
			</div>
		</div>

		<!-- Mode toggle -->
		<div bind:this={tabContainerEl} class="relative flex bg-slate-100 rounded-xl p-1 mb-6">
			{#if pillReady}
				<div
					class="absolute top-1 bottom-1 rounded-lg bg-primary shadow-md shadow-primary/25 transition-all duration-300 ease-out"
					style="left: {pillLeft}px; width: {pillWidth}px;"
				></div>
			{/if}
			<button
				data-tab="login"
				onclick={() => switchMode('login')}
				class="relative z-10 flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-200
					{mode === 'login' ? 'text-white' : 'text-slate-500 hover:text-slate-700'}"
			>
				Se connecter
			</button>
			<button
				data-tab="register"
				onclick={() => switchMode('register')}
				class="relative z-10 flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-200
					{mode === 'register' ? 'text-white' : 'text-slate-500 hover:text-slate-700'}"
			>
				Créer un compte
			</button>
		</div>

		<!-- Heading -->
		<div class="text-center mb-6">
			<h1 class="text-xl font-bold text-slate-800">
				{mode === 'login' ? 'Connexion Guard AI' : 'Créer un compte'}
			</h1>
			<p class="text-sm text-slate-400 mt-1">Surveillance intelligente en temps réel</p>
		</div>

		<!-- Form -->
		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="space-y-1.5">
				<label for="email" class="text-sm font-medium text-slate-700">Email</label>
				<input
					type="email"
					id="email"
					bind:value={email}
					placeholder="vous@exemple.com"
					required
					class="w-full px-4 py-2.5 border border-slate-200 text-slate-700 text-sm rounded-xl shadow-soft focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400 transition-colors"
				/>
			</div>

			<div class="space-y-1.5">
				<div class="flex items-center justify-between">
					<label for="password" class="text-sm font-medium text-slate-700">Mot de passe</label>
					{#if mode === 'login'}
						<a href="/forgot-password" class="text-xs text-primary hover:underline font-medium">
							Mot de passe oublié ?
						</a>
					{/if}
				</div>
				<input
					type="password"
					id="password"
					bind:value={password}
					placeholder="••••••••"
					required
					class="w-full px-4 py-2.5 border border-slate-200 text-slate-700 text-sm rounded-xl shadow-soft focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400 transition-colors"
				/>
			</div>

			{#if mode === 'register'}
				<div class="space-y-1.5">
					<label for="confirm-password" class="text-sm font-medium text-slate-700">Confirmer le mot de passe</label>
					<input
						type="password"
						id="confirm-password"
						bind:value={confirmPassword}
						placeholder="••••••••"
						required
						class="w-full px-4 py-2.5 border border-slate-200 text-slate-700 text-sm rounded-xl shadow-soft focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400 transition-colors"
					/>
				</div>
			{/if}

			<button
				type="submit"
				disabled={$authLoading}
				class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all
					bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-dark
					disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{#if $authLoading}
					{mode === 'login' ? 'Connexion...' : 'Création...'}
				{:else}
					{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
				{/if}
			</button>
		</form>
	</div>
</div>

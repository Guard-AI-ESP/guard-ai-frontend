<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { X, TriangleAlert } from '@lucide/svelte';
	import { authStore, authLoading, authError, isAuthenticated } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let mode = $state<'login' | 'register'>('login');

	let localError = $state('');

	// Redirige si déjà connecté
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

<div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">

	<!-- Alerte erreur -->
	{#if displayError}
		<div class="fixed top-4 right-4 z-50 min-w-72">
			<div class="flex items-center gap-3 px-4 py-3 bg-white border border-orange-200 rounded-lg shadow-md text-sm">
				<TriangleAlert class="h-4 w-4 text-orange-600 shrink-0" />
				<span class="flex-1 text-orange-800 font-medium">{displayError}</span>
				<button onclick={() => { localError = ''; authError.set(null); }} class="text-muted-foreground hover:text-foreground">
					<X class="h-4 w-4" />
				</button>
			</div>
		</div>
	{/if}

	<!-- Card -->
	<div class="w-full max-w-sm bg-white rounded-xl border border-border shadow-sm p-8">

		<!-- Logo -->
		<div class="flex justify-center mb-6">
			<div class="relative w-12 h-12">
				<svg class="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M12 2L4 6v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4z" stroke-linejoin="round"/>
				</svg>
				<div class="absolute inset-0 flex items-center justify-center">
					<svg class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
						<rect x="8" y="11" width="8" height="9" rx="1.5" />
						<path d="M10 11V8a2 2 0 0 1 4 0v3" fill="none" stroke="white" stroke-width="1.5"/>
					</svg>
				</div>
			</div>
		</div>

		<!-- Mode toggle -->
		<div class="flex rounded-lg border border-border p-1 mb-6">
			<button
				onclick={() => switchMode('login')}
				class="flex-1 py-1.5 text-sm font-medium rounded-md transition-colors {mode === 'login' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
			>
				Se connecter
			</button>
			<button
				onclick={() => switchMode('register')}
				class="flex-1 py-1.5 text-sm font-medium rounded-md transition-colors {mode === 'register' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
			>
				Créer un compte
			</button>
		</div>

		<!-- Heading -->
		<div class="text-center mb-6">
			<h1 class="text-xl font-semibold text-foreground">
				{mode === 'login' ? 'Sign in to Guard AI' : 'Créer un compte'}
			</h1>
			<p class="text-sm text-muted-foreground mt-1">Surveillance intelligente en temps réel</p>
		</div>

		<!-- Form -->
		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="space-y-1.5">
				<Label for="email">Email</Label>
				<Input
					type="email"
					id="email"
					bind:value={email}
					placeholder="vous@exemple.com"
					required
				/>
			</div>

			<div class="space-y-1.5">
				<div class="flex items-center justify-between">
					<Label for="password">Mot de passe</Label>
					{#if mode === 'login'}
						<a href="/forgot-password" class="text-xs text-primary hover:underline font-medium">
							Mot de passe oublié ?
						</a>
					{/if}
				</div>
				<Input
					type="password"
					id="password"
					bind:value={password}
					placeholder="••••••••"
					required
				/>
			</div>

			{#if mode === 'register'}
				<div class="space-y-1.5">
					<Label for="confirm-password">Confirmer le mot de passe</Label>
					<Input
						type="password"
						id="confirm-password"
						bind:value={confirmPassword}
						placeholder="••••••••"
						required
					/>
				</div>
			{/if}

			<Button type="submit" class="w-full" disabled={$authLoading}>
				{#if $authLoading}
					{mode === 'login' ? 'Connexion...' : 'Création...'}
				{:else}
					{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
				{/if}
			</Button>
		</form>
	</div>
</div>

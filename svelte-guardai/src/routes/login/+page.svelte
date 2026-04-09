<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { CircleCheck, X, TriangleAlert } from '@lucide/svelte';

	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);
	let showSuccessAlert = $state(false);
	let showWarningAlert = $state(false);
	let selectedLanguage = $state('en');

	function handleSubmit(e: Event) {
		e.preventDefault();
		console.log('Login attempt:', { email, password, rememberMe });
		showSuccessAlert = true;
	}
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">

	<!-- Alerts -->
	{#if showSuccessAlert || showWarningAlert}
		<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 min-w-72">
			{#if showSuccessAlert}
				<div class="flex items-center gap-3 px-4 py-3 bg-white border border-green-200 rounded-lg shadow-md text-sm">
					<CircleCheck class="h-4 w-4 text-green-600 shrink-0" />
					<span class="flex-1 text-green-800 font-medium">Connexion réussie</span>
					<button onclick={() => (showSuccessAlert = false)} class="text-muted-foreground hover:text-foreground">
						<X class="h-4 w-4" />
					</button>
				</div>
			{/if}
			{#if showWarningAlert}
				<div class="flex items-center gap-3 px-4 py-3 bg-white border border-orange-200 rounded-lg shadow-md text-sm">
					<TriangleAlert class="h-4 w-4 text-orange-600 shrink-0" />
					<span class="flex-1 text-orange-800 font-medium">Identifiants incorrects</span>
					<button onclick={() => (showWarningAlert = false)} class="text-muted-foreground hover:text-foreground">
						<X class="h-4 w-4" />
					</button>
				</div>
			{/if}
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

		<!-- Heading -->
		<div class="text-center mb-6">
			<h1 class="text-xl font-semibold text-foreground">Sign in to Guard AI</h1>
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
					<a href="/forgot-password" class="text-xs text-primary hover:underline font-medium">
						Mot de passe oublié ?
					</a>
				</div>
				<Input
					type="password"
					id="password"
					bind:value={password}
					placeholder="••••••••"
					required
				/>
			</div>

			<div class="flex items-center gap-2">
				<input
					type="checkbox"
					id="remember"
					bind:checked={rememberMe}
					class="h-4 w-4 rounded border-input accent-primary"
				/>
				<Label for="remember" class="text-sm font-normal cursor-pointer">Se souvenir de moi</Label>
			</div>

			<Button type="submit" class="w-full">
				Se connecter
			</Button>
		</form>

		<!-- Language switcher -->
		<div class="flex justify-center gap-1 mt-6 pt-4 border-t border-border">
			<button
				onclick={() => (selectedLanguage = 'fr')}
				class="px-2 py-1 text-xs rounded transition-colors {selectedLanguage === 'fr' ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'}"
			>
				🇫🇷 FR
			</button>
			<button
				onclick={() => (selectedLanguage = 'en')}
				class="px-2 py-1 text-xs rounded transition-colors {selectedLanguage === 'en' ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'}"
			>
				🇬🇧 EN
			</button>
		</div>
	</div>
</div>

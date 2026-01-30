<script lang="ts">
	let email = '';
	let password = '';
	let rememberMe = false;
	let showSuccessAlert = false;
	let showWarningAlert = false;
	let selectedLanguage = 'en';

	function handleSubmit(e: Event) {
		e.preventDefault();
		console.log('Login attempt:', { email, password, rememberMe });
		// Simuler une connexion réussie
		showSuccessAlert = true;
	}

	function switchLanguage(lang: string) {
		selectedLanguage = lang;
	}
</script>

<div class="min-h-screen flex relative bg-gray-50 overflow-hidden">
	<!-- Alerts en haut à droite -->
	{#if showSuccessAlert || showWarningAlert}
		<div class="absolute top-6 right-6 z-50 flex flex-col gap-3 min-w-[280px]">
			{#if showSuccessAlert}
				<div class="alert bg-teal-50 border border-teal-500 rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span class="text-teal-700 flex-1 text-sm font-medium">Logged In Successfully</span>
					<button
						class="text-teal-700 hover:text-teal-900 text-xl leading-none"
						on:click={() => showSuccessAlert = false}
						aria-label="Close"
					>×</button>
				</div>
			{/if}
			{#if showWarningAlert}
				<div class="alert bg-orange-50 border border-orange-500 rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
					<span class="text-orange-700 flex-1 text-sm font-medium">Warning</span>
					<button
						class="text-orange-700 hover:text-orange-900 text-xl leading-none"
						on:click={() => showWarningAlert = false}
						aria-label="Close"
					>×</button>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Partie gauche - Formulaire -->
	<div class="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10 bg-gray-50">
		<!-- Language Selector en bas à gauche -->
		<div class="absolute bottom-8 left-8 flex gap-1">
			<button
				on:click={() => switchLanguage('fr')}
				class="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors {selectedLanguage === 'fr' ? 'font-semibold' : 'text-gray-600'}"
			>
				🇫🇷 FR
			</button>
			<button
				on:click={() => switchLanguage('en')}
				class="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors {selectedLanguage === 'en' ? 'font-semibold' : 'text-gray-600'}"
			>
				🇬🇧 EN
			</button>
		</div>

		<div class="w-full max-w-md">
			<!-- Logo/Icône -->
			<div class="flex justify-center mb-6">
				<div class="relative w-16 h-16">
					<!-- Bouclier -->
					<svg class="w-16 h-16 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M12 2L4 6v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4z" stroke-linejoin="round"/>
					</svg>
					<!-- Cadenas centré -->
					<div class="absolute inset-0 flex items-center justify-center">
						<svg class="w-7 h-7 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
							<rect x="8" y="11" width="8" height="9" rx="1.5" />
							<path d="M10 11V8a2 2 0 0 1 4 0v3" fill="none" stroke="white" stroke-width="1.5"/>
						</svg>
					</div>
				</div>
			</div>

			<!-- Titre -->
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
				<p class="text-gray-500 text-sm">Sign in to stay connected.</p>
			</div>

			<!-- Formulaire -->
			<form on:submit={handleSubmit} class="space-y-5">
				<!-- Email -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2" for="email">
						Email
					</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						placeholder="your.email@example.com"
						class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
						required
					/>
				</div>

				<!-- Password -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2" for="password">
						Password
					</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						placeholder="••••••••"
						class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
						required
					/>
				</div>

				<!-- Remember me + Forgot Password -->
				<div class="flex items-center justify-between">
					<label class="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={rememberMe}
							class="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
						/>
						<span class="text-sm text-gray-700">Remember me?</span>
					</label>
					<a href="/forgot-password" class="text-sm text-teal-500 hover:text-teal-600 font-medium">
						Forgot Password
					</a>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					class="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm"
				>
					Sign in
				</button>
			</form>
		</div>
	</div>

	<!-- Partie droite - Forme incurvée avec dégradé -->
	<div class="hidden lg:block absolute right-0 top-0 bottom-0 w-[55%]">
		<!-- SVG avec forme incurvée -->
		<svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
			<defs>
				<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style="stop-color:#5EEAD4;stop-opacity:1" />
					<stop offset="100%" style="stop-color:#14B8A6;stop-opacity:1" />
				</linearGradient>
			</defs>
			<!-- Forme incurvée qui commence par une courbe à gauche -->
			<path
				d="M 15 0 Q 25 50 15 100 L 100 100 L 100 0 Z"
				fill="url(#gradient)"
			/>
		</svg>
	</div>
</div>

<style>
	/* S'assurer que les inputs ont un fond blanc */
	input {
		background-color: white !important;
		color: #111827 !important;
	}

	input::placeholder {
		color: #9ca3af !important;
	}

	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus {
		-webkit-box-shadow: 0 0 0px 1000px white inset !important;
		-webkit-text-fill-color: #111827 !important;
	}
</style>

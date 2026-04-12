<script lang="ts">
	let code = ['', '', '', '', '', ''];
	let inputs: HTMLInputElement[] = [];
	let showSuccessAlert = false;
	let showWarningAlert = false;
	let isSubmitting = false;

	function handleInput(index: number, event: Event) {
		const target = event.target as HTMLInputElement;
		let value = target.value;

		// Bloquer tout ce qui n'est pas un chiffre
		value = value.replace(/\D/g, '');

		// Ne garder que le dernier chiffre si plusieurs sont entrés
		if (value.length > 1) {
			value = value.slice(-1);
		}

		target.value = value;
		code[index] = value;

		// Passer au champ suivant si un chiffre est entré
		if (value && index < 5) {
			inputs[index + 1]?.focus();
		}

		// Auto-submit si tous les champs sont remplis
		if (code.every(digit => digit !== '') && !isSubmitting) {
			setTimeout(() => autoSubmit(), 300);
		}
	}

	function handleKeyDown(index: number, event: KeyboardEvent) {
		// Bloquer les lettres et caractères spéciaux
		if (event.key.length === 1 && !/[0-9]/.test(event.key) && !event.ctrlKey && !event.metaKey) {
			event.preventDefault();
			return;
		}

		// Si backspace et le champ est vide, effacer et revenir au champ précédent
		if (event.key === 'Backspace') {
			if (!code[index] && index > 0) {
				// Effacer le champ précédent
				code[index - 1] = '';
				inputs[index - 1].value = '';
				inputs[index - 1]?.focus();
			} else {
				// Effacer le champ actuel
				code[index] = '';
				inputs[index].value = '';
			}
		}

		// Navigation avec les flèches
		if (event.key === 'ArrowLeft' && index > 0) {
			inputs[index - 1]?.focus();
		}
		if (event.key === 'ArrowRight' && index < 5) {
			inputs[index + 1]?.focus();
		}
	}

	function handlePaste(event: ClipboardEvent) {
		event.preventDefault();
		const pastedData = event.clipboardData?.getData('text') || '';
		const digits = pastedData.replace(/\D/g, '').slice(0, 6);

		digits.split('').forEach((digit, index) => {
			if (index < 6) {
				code[index] = digit;
				if (inputs[index]) {
					inputs[index].value = digit;
				}
			}
		});

		// Focus sur le dernier champ rempli ou le suivant
		const lastFilledIndex = Math.min(digits.length, 5);
		inputs[lastFilledIndex]?.focus();

		// Auto-submit si tous les champs sont remplis
		if (digits.length === 6) {
			setTimeout(() => autoSubmit(), 300);
		}
	}

	function resendCode() {
		console.log('Resending code...');
		// Réinitialiser les champs
		code = ['', '', '', '', '', ''];
		inputs.forEach(input => {
			if (input) input.value = '';
		});
		inputs[0]?.focus();
		showSuccessAlert = true;
		setTimeout(() => {
			showSuccessAlert = false;
		}, 3000);
	}

	function tryAnotherMethod() {
		console.log('Try another method...');
		// Rediriger vers la page de login ou afficher d'autres options
		window.location.href = '/login';
	}

	function autoSubmit() {
		const fullCode = code.join('');
		if (fullCode.length === 6) {
			handleSubmit(new Event('submit'));
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		const fullCode = code.join('');
		if (fullCode.length === 6) {
			isSubmitting = true;
			console.log('Code submitted:', fullCode);
			showSuccessAlert = true;
			// Simuler une vérification
			setTimeout(() => {
				isSubmitting = false;
				// Rediriger ou faire autre chose
			}, 2000);
		} else {
			showWarningAlert = true;
			setTimeout(() => {
				showWarningAlert = false;
			}, 3000);
		}
	}
</script>

<svelte:head>
	<title>Forgot Password</title>
</svelte:head>

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
			<div class="text-center mb-6">
				<h1 class="text-3xl font-bold text-gray-900 mb-3">Forgot Password</h1>
				<p class="text-gray-500 text-sm">
					Enter the 6-digit code sent to your email
				</p>
			</div>

			<!-- Formulaire -->
			<form on:submit={handleSubmit} class="space-y-6">
				<!-- Code inputs -->
				<div class="flex justify-center items-center gap-2">
					{#each code as digit, index}
						<input
							bind:this={inputs[index]}
							type="text"
							inputmode="numeric"
							maxlength="1"
							pattern="[0-9]"
							value={digit}
							on:input={(e) => handleInput(index, e)}
							on:keydown={(e) => handleKeyDown(index, e)}
							on:paste={handlePaste}
							style="border: 2px solid {digit ? 'rgba(20, 184, 166, 0.6)' : 'rgba(20, 184, 166, 0.2)'}; background-color: {digit ? 'rgba(20, 184, 166, 0.02)' : 'white'}; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);"
							class="w-12 h-14 text-center text-2xl font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all text-gray-900 hover:border-teal-500/40"
							aria-label={`Digit ${index + 1}`}
						/>
						{#if index < 5}
							<span class="text-gray-400 text-lg">-</span>
						{/if}
					{/each}
				</div>

				<!-- Links -->
				<div class="flex justify-center items-center gap-6 text-sm">
					<button
						type="button"
						on:click={resendCode}
						class="text-teal-600 hover:text-teal-700 font-medium"
					>
						Resend code
					</button>
					<button
						type="button"
						on:click={tryAnotherMethod}
						class="text-gray-600 hover:text-gray-700 font-medium"
					>
						Try another methods?
					</button>
				</div>

				<!-- Submit Button -->
				<div class="pt-2">
					<button
						type="submit"
						disabled={isSubmitting || code.some(d => !d)}
						class="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed {isSubmitting ? 'submitting' : ''}"
					>
						{#if isSubmitting}
							<span class="flex items-center justify-center gap-2">
								<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Verifying...
							</span>
						{:else}
							Send
						{/if}
					</button>
				</div>
			</form>

			<!-- Lien retour vers login -->
			<div class="mt-6 text-center">
				<a href="/login" class="text-sm text-gray-600 hover:text-gray-900">
					← Back to Sign In
				</a>
			</div>
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
	/* Empêcher les spinners sur les inputs numériques */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='text'] {
		-moz-appearance: textfield;
	}

	/* Gérer l'autofill */
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus {
		-webkit-box-shadow: 0 0 0px 1000px white inset !important;
		-webkit-text-fill-color: #111827 !important;
	}
</style>

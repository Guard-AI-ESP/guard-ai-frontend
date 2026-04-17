<script lang="ts">
	let code = $state(['', '', '', '', '', '']);
	let inputs: HTMLInputElement[] = [];
	let showSuccessAlert = $state(false);
	let showWarningAlert = $state(false);
	let isSubmitting = $state(false);

	function handleInput(index: number, event: Event) {
		const target = event.target as HTMLInputElement;
		let value = target.value.replace(/\D/g, '');
		if (value.length > 1) value = value.slice(-1);
		target.value = value;
		code[index] = value;

		if (value && index < 5) {
			inputs[index + 1]?.focus();
		}

		if (code.every(digit => digit !== '') && !isSubmitting) {
			setTimeout(() => autoSubmit(), 300);
		}
	}

	function handleKeyDown(index: number, event: KeyboardEvent) {
		if (event.key.length === 1 && !/[0-9]/.test(event.key) && !event.ctrlKey && !event.metaKey) {
			event.preventDefault();
			return;
		}
		if (event.key === 'Backspace') {
			if (!code[index] && index > 0) {
				code[index - 1] = '';
				inputs[index - 1].value = '';
				inputs[index - 1]?.focus();
			} else {
				code[index] = '';
				inputs[index].value = '';
			}
		}
		if (event.key === 'ArrowLeft' && index > 0) inputs[index - 1]?.focus();
		if (event.key === 'ArrowRight' && index < 5) inputs[index + 1]?.focus();
	}

	function handlePaste(event: ClipboardEvent) {
		event.preventDefault();
		const pastedData = event.clipboardData?.getData('text') || '';
		const digits = pastedData.replace(/\D/g, '').slice(0, 6);
		digits.split('').forEach((digit, index) => {
			if (index < 6) {
				code[index] = digit;
				if (inputs[index]) inputs[index].value = digit;
			}
		});
		const lastFilledIndex = Math.min(digits.length, 5);
		inputs[lastFilledIndex]?.focus();
		if (digits.length === 6) setTimeout(() => autoSubmit(), 300);
	}

	function resendCode() {
		code = ['', '', '', '', '', ''];
		inputs.forEach(input => { if (input) input.value = ''; });
		inputs[0]?.focus();
		showSuccessAlert = true;
		setTimeout(() => { showSuccessAlert = false; }, 3000);
	}

	function autoSubmit() {
		const fullCode = code.join('');
		if (fullCode.length === 6) handleSubmit(new Event('submit'));
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		const fullCode = code.join('');
		if (fullCode.length === 6) {
			isSubmitting = true;
			showSuccessAlert = true;
			setTimeout(() => { isSubmitting = false; }, 2000);
		} else {
			showWarningAlert = true;
			setTimeout(() => { showWarningAlert = false; }, 3000);
		}
	}
</script>

<svelte:head>
	<title>Mot de passe oubli\u00e9 - Guard AI</title>
</svelte:head>

<div class="min-h-screen flex relative bg-slate-50 overflow-hidden">
	<!-- Alerts -->
	{#if showSuccessAlert || showWarningAlert}
		<div class="absolute top-6 right-6 z-50 flex flex-col gap-3 min-w-[280px]">
			{#if showSuccessAlert}
				<div class="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-soft">
					<span class="material-icons text-green-500 text-[20px]">check_circle</span>
					<span class="text-green-700 flex-1 text-sm font-medium">Code envoy\u00e9 avec succ\u00e8s</span>
					<button onclick={() => showSuccessAlert = false} class="text-green-500 hover:text-green-700">
						<span class="material-icons text-[18px]">close</span>
					</button>
				</div>
			{/if}
			{#if showWarningAlert}
				<div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-soft">
					<span class="material-icons text-amber-500 text-[20px]">warning</span>
					<span class="text-amber-700 flex-1 text-sm font-medium">Veuillez remplir tous les champs</span>
					<button onclick={() => showWarningAlert = false} class="text-amber-500 hover:text-amber-700">
						<span class="material-icons text-[18px]">close</span>
					</button>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Left side - Form -->
	<div class="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
		<div class="w-full max-w-md">
			<!-- Logo -->
			<div class="flex justify-center mb-6">
				<div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
					<span class="material-icons text-[32px]">lock_reset</span>
				</div>
			</div>

			<!-- Title -->
			<div class="text-center mb-8">
				<h1 class="text-2xl font-bold text-slate-800 mb-2">Mot de passe oubli\u00e9</h1>
				<p class="text-slate-400 text-sm">Entrez le code \u00e0 6 chiffres envoy\u00e9 \u00e0 votre email</p>
			</div>

			<!-- Form -->
			<form onsubmit={handleSubmit} class="space-y-6">
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
							oninput={(e) => handleInput(index, e)}
							onkeydown={(e) => handleKeyDown(index, e)}
							onpaste={handlePaste}
							class="w-12 h-14 text-center text-2xl font-semibold rounded-xl border-2 transition-all text-slate-800 outline-none
								{digit ? 'border-primary/60 bg-primary/[0.02] focus:ring-2 focus:ring-primary/30' : 'border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/30'}"
							aria-label="Chiffre {index + 1}"
						/>
						{#if index < 5}
							<span class="text-slate-300 text-lg">\u2013</span>
						{/if}
					{/each}
				</div>

				<!-- Links -->
				<div class="flex justify-center items-center gap-6 text-sm">
					<button type="button" onclick={resendCode} class="text-primary hover:text-primary-dark font-medium transition-colors">
						Renvoyer le code
					</button>
					<a href="/login" class="text-slate-500 hover:text-slate-700 font-medium transition-colors">
						Autre m\u00e9thode ?
					</a>
				</div>

				<!-- Submit -->
				<button
					type="submit"
					disabled={isSubmitting || code.some(d => !d)}
					class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isSubmitting}
						<span class="material-icons text-[18px] animate-spin">refresh</span>
						V\u00e9rification...
					{:else}
						Envoyer
					{/if}
				</button>
			</form>

			<!-- Back to login -->
			<div class="mt-6 text-center">
				<a href="/login" class="text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center gap-1">
					<span class="material-icons text-[16px]">arrow_back</span>
					Retour \u00e0 la connexion
				</a>
			</div>
		</div>
	</div>

	<!-- Right side - Gradient -->
	<div class="hidden lg:block absolute right-0 top-0 bottom-0 w-[55%]">
		<svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
			<defs>
				<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style="stop-color:#5EEAD4;stop-opacity:1" />
					<stop offset="100%" style="stop-color:#13b9a5;stop-opacity:1" />
				</linearGradient>
			</defs>
			<path d="M 15 0 Q 25 50 15 100 L 100 100 L 100 0 Z" fill="url(#gradient)" />
		</svg>
	</div>
</div>

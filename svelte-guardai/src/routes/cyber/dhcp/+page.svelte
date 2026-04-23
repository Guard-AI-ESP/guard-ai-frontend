<script lang="ts">
	let rangeStart = $state(['192', '168', '1', '100']);
	let rangeEnd   = $state(['192', '168', '1', '200']);
	let gateway    = $state(['192', '168', '1',   '1']);
	let netmask    = $state(24);
	let ipLease    = $state(24);
	let logsEnabled = $state(true);
	let saved       = $state(false);

	let dnsList = $state<string[][]>([
		['8', '8', '8', '8'],
		['8', '8', '4', '4'],
	]);

	function addDns() {
		dnsList = [...dnsList, ['', '', '', '']];
	}

	function removeDns(i: number) {
		dnsList = dnsList.filter((_, idx) => idx !== i);
	}

	function trackStyle(on: boolean) {
		return `display:inline-flex;align-items:center;width:44px;height:24px;border-radius:9999px;padding:2px;transition:background 0.2s;background:${on ? '#13b9a5' : '#e2e8f0'};cursor:pointer;`;
	}
	function thumbStyle(on: boolean) {
		return `width:20px;height:20px;border-radius:9999px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:transform 0.2s;transform:translateX(${on ? '20px' : '0px'});`;
	}

	function save() {
		saved = true;
		setTimeout(() => { saved = false; }, 2000);
	}

	function octetInput(cls = '') {
		return `w-14 text-center px-2 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl shadow-soft focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors ${cls}`;
	}

	function handleOctetKeydown(e: KeyboardEvent) {
		const input = e.target as HTMLInputElement;
		if (['Backspace', 'Delete', 'Tab', 'Escape', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
			if (e.key === 'Backspace' && input.value === '') {
				e.preventDefault();
				const prev = getPrevOctetInput(input);
				if (prev) { prev.focus(); prev.select(); }
			}
			return;
		}
		if (e.ctrlKey || e.metaKey) return;
		if (!/^\d$/.test(e.key)) {
			e.preventDefault();
			return;
		}
		if (input.value.length >= 3 && input.selectionStart === input.selectionEnd) {
			e.preventDefault();
		}
	}

	function handleOctetInput(e: Event) {
		const input = e.target as HTMLInputElement;
		input.value = input.value.replace(/\D/g, '');
		if (input.value !== '' && parseInt(input.value) > 255) {
			input.value = '255';
		}
		if (input.value.length === 3) {
			const next = getNextOctetInput(input);
			if (next) { next.focus(); next.select(); }
		}
		input.dispatchEvent(new Event('change', { bubbles: true }));
	}

	function handleOctetPaste(e: ClipboardEvent) {
		e.preventDefault();
		const paste = e.clipboardData?.getData('text') ?? '';
		const input = e.target as HTMLInputElement;
		const parts = paste.trim().split('.');
		if (parts.length === 4 && parts.every(p => /^\d{1,3}$/.test(p))) {
			let current: HTMLInputElement | null = getFirstOctetInGroup(input);
			for (const part of parts) {
				if (!current) break;
				current.value = String(Math.min(255, parseInt(part)));
				current.dispatchEvent(new Event('input', { bubbles: true }));
				current.dispatchEvent(new Event('change', { bubbles: true }));
				current = getNextOctetInput(current);
			}
			return;
		}
		const digits = paste.replace(/\D/g, '').slice(0, 3);
		if (digits) {
			input.value = String(Math.min(255, parseInt(digits)));
			input.dispatchEvent(new Event('input', { bubbles: true }));
			input.dispatchEvent(new Event('change', { bubbles: true }));
			if (digits.length === 3) {
				const next = getNextOctetInput(input);
				if (next) { next.focus(); next.select(); }
			}
		}
	}

	function getNextOctetInput(el: HTMLElement): HTMLInputElement | null {
		let node = el.nextElementSibling;
		while (node) {
			if (node.tagName === 'INPUT') return node as HTMLInputElement;
			node = node.nextElementSibling;
		}
		return null;
	}

	function getPrevOctetInput(el: HTMLElement): HTMLInputElement | null {
		let node = el.previousElementSibling;
		while (node) {
			if (node.tagName === 'INPUT') return node as HTMLInputElement;
			node = node.previousElementSibling;
		}
		return null;
	}

	function getFirstOctetInGroup(el: HTMLElement): HTMLInputElement | null {
		const parent = el.parentElement;
		if (!parent) return null;
		return parent.querySelector('input');
	}
</script>

<svelte:head>
	<title>DHCP - Guard AI</title>
</svelte:head>

<!-- Page header -->
<div>
	<div class="flex items-center gap-2 text-slate-400 text-sm mb-1">
		<a href="/cyber" class="hover:text-primary transition-colors">Dashboard Cyber</a>
		<span class="material-icons text-[14px]">chevron_right</span>
		<span class="text-slate-600 font-medium">DHCP</span>
	</div>
	<h1 class="text-2xl font-semibold text-slate-800">Configuration DHCP</h1>
	<p class="text-slate-400 text-sm mt-0.5">Gestion automatique des adresses IP du réseau</p>
</div>

<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
	<!-- Form -->
	<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-6 flex flex-col gap-6">

		<!-- IP Range -->
		<div class="flex flex-col gap-3">
			<p class="text-sm font-medium text-slate-700">Plage d'adresses IP</p>
			<div class="flex flex-col sm:flex-row gap-3">
				<div class="flex flex-col gap-1.5 flex-1">
					<p class="text-xs text-slate-400">Début</p>
					<div class="flex items-center gap-1">
						{#each rangeStart as _, i}
							<input
								type="text"
								inputmode="numeric"
								bind:value={rangeStart[i]}
								maxlength="3"
								onkeydown={handleOctetKeydown}
								oninput={handleOctetInput}
								onpaste={handleOctetPaste}
								onfocus={(e) => (e.target as HTMLInputElement).select()}
								class={octetInput()}
							/>
							{#if i < 3}<span class="text-slate-400 text-sm font-bold">.</span>{/if}
						{/each}
					</div>
				</div>
				<div class="flex items-end pb-2 text-slate-300 font-light text-xl hidden sm:block">—</div>
				<div class="flex flex-col gap-1.5 flex-1">
					<p class="text-xs text-slate-400">Fin</p>
					<div class="flex items-center gap-1">
						{#each rangeEnd as _, i}
							<input
								type="text"
								inputmode="numeric"
								bind:value={rangeEnd[i]}
								maxlength="3"
								onkeydown={handleOctetKeydown}
								oninput={handleOctetInput}
								onpaste={handleOctetPaste}
								onfocus={(e) => (e.target as HTMLInputElement).select()}
								class={octetInput()}
							/>
							{#if i < 3}<span class="text-slate-400 text-sm font-bold">.</span>{/if}
						{/each}
					</div>
				</div>
			</div>
		</div>

		<div class="h-px bg-slate-100"></div>

		<!-- Netmask + Lease -->
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col gap-1.5">
				<label for="netmask" class="text-sm font-medium text-slate-700">Masque réseau (CIDR)</label>
				<div class="flex items-center gap-2">
					<span class="text-slate-400 text-sm">/</span>
					<input
						id="netmask"
						type="number"
						min="1"
						max="32"
						bind:value={netmask}
						class="w-20 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl shadow-soft focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
					/>
				</div>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="lease" class="text-sm font-medium text-slate-700">Durée du bail IP</label>
				<div class="flex items-center gap-2">
					<input
						id="lease"
						type="number"
						min="1"
						bind:value={ipLease}
						class="w-20 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl shadow-soft focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
					/>
					<span class="text-slate-400 text-sm">heures</span>
				</div>
			</div>
		</div>

		<div class="h-px bg-slate-100"></div>

		<!-- Gateway -->
		<div class="flex flex-col gap-2">
			<p class="text-sm font-medium text-slate-700">Passerelle (Gateway)</p>
			<div class="flex items-center gap-1">
				{#each gateway as _, i}
					<input
						type="text"
						inputmode="numeric"
						bind:value={gateway[i]}
						maxlength="3"
						onkeydown={handleOctetKeydown}
						oninput={handleOctetInput}
						onpaste={handleOctetPaste}
						onfocus={(e) => (e.target as HTMLInputElement).select()}
						class={octetInput()}
					/>
					{#if i < 3}<span class="text-slate-400 text-sm font-bold">.</span>{/if}
				{/each}
			</div>
		</div>

		<div class="h-px bg-slate-100"></div>

		<!-- DNS Servers -->
		<div class="flex flex-col gap-3">
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium text-slate-700">Serveurs DNS</p>
				<button
					type="button"
					onclick={addDns}
					class="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
				>
					<span class="material-icons text-[16px]">add</span>
					Ajouter
				</button>
			</div>
			<div class="flex flex-col gap-2">
				{#each dnsList as dns, i}
					<div class="flex items-center gap-2">
						<div class="flex items-center gap-1 flex-1">
							{#each dns as _, j}
								<input
									type="text"
									inputmode="numeric"
									bind:value={dnsList[i][j]}
									maxlength="3"
									onkeydown={handleOctetKeydown}
									oninput={handleOctetInput}
									onpaste={handleOctetPaste}
									onfocus={(e) => (e.target as HTMLInputElement).select()}
									class={octetInput()}
								/>
								{#if j < 3}<span class="text-slate-400 text-sm font-bold">.</span>{/if}
							{/each}
						</div>
						{#if dnsList.length > 1}
							<button
								type="button"
								onclick={() => removeDns(i)}
								class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
								aria-label="Supprimer"
							>
								<span class="material-icons text-[16px]">remove</span>
							</button>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<div class="h-px bg-slate-100"></div>

		<!-- Logs toggle -->
		<div class="flex items-center justify-between py-1">
			<div>
				<p class="text-sm font-medium text-slate-700">Journaux DHCP</p>
				<p class="text-xs text-slate-400">Enregistrer les attributions et libérations d'adresses</p>
			</div>
			<button
				type="button"
				onclick={() => logsEnabled = !logsEnabled}
				aria-label="Activer/désactiver les journaux"
				style={trackStyle(logsEnabled)}
			>
				<span style={thumbStyle(logsEnabled)}></span>
			</button>
		</div>

		<!-- Save -->
		<div class="flex justify-end pt-2">
			<button
				type="button"
				onclick={save}
				class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all {saved ? 'bg-green-500 text-white' : 'bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-dark'}"
			>
				<span class="material-icons text-[18px]">{saved ? 'check' : 'save'}</span>
				{saved ? 'Enregistré !' : 'Enregistrer'}
			</button>
		</div>
	</div>

	<!-- Summary panel -->
	<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-5 flex flex-col gap-4 h-fit">
		<div class="flex items-center gap-3 pb-3 border-b border-slate-100">
			<div class="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
				<span class="material-icons text-[18px]">dns</span>
			</div>
			<p class="text-sm font-semibold text-slate-800">Résumé DHCP</p>
		</div>
		<div class="flex flex-col gap-3 text-sm">
			<div class="flex flex-col gap-0.5">
				<p class="text-xs text-slate-400 uppercase font-semibold tracking-wide">Plage IP</p>
				<p class="font-mono text-slate-700">{rangeStart.join('.')} — {rangeEnd.join('.')}</p>
			</div>
			<div class="flex flex-col gap-0.5">
				<p class="text-xs text-slate-400 uppercase font-semibold tracking-wide">Masque / Bail</p>
				<p class="font-mono text-slate-700">/{netmask} · {ipLease}h</p>
			</div>
			<div class="flex flex-col gap-0.5">
				<p class="text-xs text-slate-400 uppercase font-semibold tracking-wide">Passerelle</p>
				<p class="font-mono text-slate-700">{gateway.join('.')}</p>
			</div>
			<div class="flex flex-col gap-0.5">
				<p class="text-xs text-slate-400 uppercase font-semibold tracking-wide">DNS ({dnsList.length})</p>
				{#each dnsList as dns}
					<p class="font-mono text-slate-700">{dns.join('.')}</p>
				{/each}
			</div>
		</div>
	</div>
</div>

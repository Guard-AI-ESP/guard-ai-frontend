<script lang="ts">
	type RadiusUser = { id: string; login: string; password: string; showPwd: boolean };

	let secretKey     = $state('');
	let showSecret    = $state(false);
	let saved         = $state(false);

	let users = $state<RadiusUser[]>([
		{ id: '1', login: 'admin',  password: '', showPwd: false },
		{ id: '2', login: 'guest',  password: '', showPwd: false },
	]);

	let nextId = 3;

	function addUser() {
		users = [...users, { id: String(nextId++), login: '', password: '', showPwd: false }];
	}

	function removeUser(id: string) {
		users = users.filter(u => u.id !== id);
	}

	function save() {
		saved = true;
		setTimeout(() => { saved = false; }, 2000);
	}
</script>

<svelte:head>
	<title>RADIUS - Guard AI</title>
</svelte:head>

<!-- Page header -->
<div>
	<div class="flex items-center gap-2 text-slate-400 text-sm mb-1">
		<a href="/cyber" class="hover:text-primary transition-colors">Dashboard Cyber</a>
		<span class="material-icons text-[14px]">chevron_right</span>
		<span class="text-slate-600 font-medium">RADIUS</span>
	</div>
	<h1 class="text-2xl font-semibold text-slate-800">Configuration RADIUS</h1>
	<p class="text-slate-400 text-sm mt-0.5">Authentification centralisée des accès réseau</p>
</div>

<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
	<!-- Form -->
	<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-6 flex flex-col gap-6">

		<!-- Shared secret -->
		<div class="flex flex-col gap-1.5">
			<label for="secret" class="text-sm font-medium text-slate-700">Clé secrète partagée</label>
			<div class="relative">
				<input
					id="secret"
					type={showSecret ? 'text' : 'password'}
					bind:value={secretKey}
					placeholder="Entre 20 et 64 caractères"
					minlength="20"
					maxlength="64"
					class="block w-full px-4 py-2.5 pr-10 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl shadow-soft focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400 transition-colors"
				/>
				<button
					type="button"
					onclick={() => showSecret = !showSecret}
					class="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
					aria-label={showSecret ? 'Masquer' : 'Afficher'}
				>
					<span class="material-icons text-[18px]">{showSecret ? 'visibility_off' : 'visibility'}</span>
				</button>
			</div>
			<p class="text-xs text-slate-400">{secretKey.length} / 64 caractères (minimum 20)</p>
		</div>

		<div class="h-px bg-slate-100"></div>

		<!-- Users list -->
		<div class="flex flex-col gap-3">
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium text-slate-700">Utilisateurs RADIUS</p>
				<button
					type="button"
					onclick={addUser}
					class="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
				>
					<span class="material-icons text-[16px]">person_add</span>
					Ajouter
				</button>
			</div>

			{#if users.length === 0}
				<p class="text-sm text-slate-400 text-center py-6">Aucun utilisateur configuré</p>
			{:else}
				<div class="flex flex-col gap-2">
					<div class="grid grid-cols-[120px_1fr_auto] gap-3 px-1">
						<p class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Identifiant</p>
						<p class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Mot de passe</p>
						<div class="w-8"></div>
					</div>
					{#each users as user (user.id)}
						<div class="grid grid-cols-[120px_1fr_auto] gap-3 items-center">
							<input
								type="text"
								bind:value={user.login}
								placeholder="identifiant"
								class="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl shadow-soft focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400 transition-colors"
							/>
							<div class="relative">
								<input
									type={user.showPwd ? 'text' : 'password'}
									bind:value={user.password}
									placeholder="••••••••"
									class="block w-full pl-3 pr-8 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl shadow-soft focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400 transition-colors"
								/>
								<button
									type="button"
									onclick={() => user.showPwd = !user.showPwd}
									class="absolute inset-y-0 right-2 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
									aria-label="Afficher/masquer"
								>
									<span class="material-icons text-[15px]">{user.showPwd ? 'visibility_off' : 'visibility'}</span>
								</button>
							</div>
							<button
								type="button"
								onclick={() => removeUser(user.id)}
								class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
								aria-label="Supprimer"
							>
								<span class="material-icons text-[16px]">delete_outline</span>
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Save -->
		<div class="flex justify-end pt-2 border-t border-slate-100">
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

	<!-- Info panel -->
	<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 p-5 flex flex-col gap-4 h-fit">
		<div class="flex items-center gap-3 pb-3 border-b border-slate-100">
			<div class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
				<span class="material-icons text-[18px]">lock</span>
			</div>
			<p class="text-sm font-semibold text-slate-800">État RADIUS</p>
		</div>
		<div class="flex flex-col gap-3 text-sm">
			<div class="flex flex-col gap-0.5">
				<p class="text-xs text-slate-400 uppercase font-semibold tracking-wide">Clé secrète</p>
				<span class="flex items-center gap-1.5 text-[11px] font-semibold w-fit px-2.5 py-1 rounded-full {secretKey.length >= 20 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}">
					<span class="w-1.5 h-1.5 rounded-full {secretKey.length >= 20 ? 'bg-green-500' : 'bg-amber-500'}"></span>
					{secretKey.length >= 20 ? 'Valide' : 'Trop courte'}
				</span>
			</div>
			<div class="flex flex-col gap-0.5">
				<p class="text-xs text-slate-400 uppercase font-semibold tracking-wide">Utilisateurs</p>
				<p class="font-bold text-2xl text-slate-800">{users.length}</p>
			</div>
			<div class="flex flex-col gap-1">
				<p class="text-xs text-slate-400 uppercase font-semibold tracking-wide">Liste</p>
				{#each users as user}
					<div class="flex items-center gap-2">
						<div class="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
							<span class="material-icons text-[13px]">person</span>
						</div>
						<p class="text-slate-600 text-sm">{user.login || '(sans nom)'}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

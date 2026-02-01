<script lang="ts">
	import { page } from '$app/stores';

	let isCameraOpen = false;
	let isEventOpen = false;

	function toggleCamera() {
		isCameraOpen = !isCameraOpen;
	}

	function toggleEvent() {
		isEventOpen = !isEventOpen;
	}

	// Helper function to check if a path is active
	function isActive(path: string): boolean {
		return $page.url.pathname === path || $page.url.pathname.startsWith(path + '/');
	}

	// Auto-expand dropdowns based on current path
	$: {
		if ($page.url.pathname.startsWith('/recordings')) {
			isCameraOpen = true;
		}
		if ($page.url.pathname.startsWith('/events')) {
			isEventOpen = true;
		}
	}
</script>

<aside class="w-80 h-screen bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
	<!-- Header avec logo -->
	<div class="p-6 border-b border-gray-200">
		<div class="flex items-center gap-3 mb-4">
			<!-- Logo GUARD AI -->
			<div class="relative w-12 h-12 flex-shrink-0">
				<!-- Bouclier -->
				<svg class="w-12 h-12 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M12 2L4 6v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4z" stroke-linejoin="round"/>
				</svg>
				<!-- Cadenas centré -->
				<div class="absolute inset-0 flex items-center justify-center">
					<svg class="w-5 h-5 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
						<rect x="8" y="11" width="8" height="9" rx="1.5" />
						<path d="M10 11V8a2 2 0 0 1 4 0v3" fill="none" stroke="white" stroke-width="1.5"/>
					</svg>
				</div>
			</div>
			<div class="flex-1">
				<h1 class="text-xl font-bold text-gray-900">GUARD AI</h1>
			</div>
			<button class="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
		</div>

		<!-- User info -->
		<div class="text-center">
			<p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Web Developer</p>
			<p class="text-sm font-semibold text-gray-900">John Doe</p>
		</div>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 p-4 space-y-6">
		<!-- Section Main -->
		<div>
			<h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Main</h3>
			<ul class="space-y-1">
				<!-- Dashboard -->
				<li>
					<a
						href="/dashboard"
						class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors {isActive('/dashboard') && !isActive('/dashboard-cyber') ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
						</svg>
						<span class="flex-1 text-left">Dashboard</span>
					</a>
				</li>

				<!-- Dashboard Cyber -->
				<li>
					<a
						href="/dashboard-cyber"
						class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors {isActive('/dashboard-cyber') ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
						<span class="flex-1 text-left">Dashboard Cyber</span>
					</a>
				</li>

				<!-- Caméra avec dropdown -->
				<li>
					<button
						on:click={toggleCamera}
						class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						<span class="flex-1 text-left">Caméra</span>
						<svg class="w-4 h-4 transition-transform {isCameraOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					{#if isCameraOpen}
						<ul class="mt-1 ml-11 space-y-1">
							<li>
								<button class="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">Live View</button>
							</li>
							<li>
								<a href="/recordings" class="block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors {isActive('/recordings') ? 'text-teal-700 bg-teal-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}">Recordings</a>
							</li>
						</ul>
					{/if}
				</li>

				<!-- Messages -->
				<li>
					<a
						href="/messages"
						class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors {isActive('/messages') ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
						</svg>
						<span class="flex-1 text-left">Messages</span>
					</a>
				</li>

				<!-- Détecteurs de présence -->
				<li>
					<a
						href="/detectors"
						class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors {isActive('/detectors') ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
						</svg>
						<span class="flex-1 text-left">Détecteurs de présence</span>
					</a>
				</li>

				<!-- Evènements avec dropdown -->
				<li>
					<button
						on:click={toggleEvent}
						class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors {isActive('/events') ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
						</svg>
						<span class="flex-1 text-left">Evènements</span>
						<svg class="w-4 h-4 transition-transform {isEventOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					{#if isEventOpen}
						<ul class="mt-1 ml-11 space-y-1">
							<li>
								<a href="/events/new" class="w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors {isActive('/events/new') ? 'text-teal-700 bg-teal-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
									</svg>
									New
								</a>
							</li>
							<li>
								<button class="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
									</svg>
									List
								</button>
							</li>
							<li>
								<button class="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
									Delete
								</button>
							</li>
						</ul>
					{/if}
				</li>

				<!-- Journal d'appels -->
				<li>
					<a
						href="/journal-appels"
						class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors {isActive('/journal-appels') ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
						</svg>
						<span class="flex-1 text-left">Journal d'appels</span>
					</a>
				</li>
			</ul>
		</div>

		<!-- Section Settings -->
		<div>
			<h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Settings</h3>
			<ul class="space-y-1">
				<li>
					<a
						href="/settings"
						class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors {isActive('/settings') ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						<span class="flex-1 text-left">Settings</span>
					</a>
				</li>
			</ul>
		</div>

		<!-- Section Account -->
		<div>
			<h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Account</h3>
			<ul class="space-y-1">
				<li>
					<button
						class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span class="flex-1 text-left">Help</span>
					</button>
				</li>
				<li>
					<a
						href="/login"
						class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
						<span class="flex-1 text-left">Logout</span>
					</a>
				</li>
			</ul>
		</div>
	</nav>
</aside>

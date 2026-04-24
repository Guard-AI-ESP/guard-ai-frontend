<script lang="ts">
</script>

<div class="bg-white rounded-[20px] shadow-soft border border-slate-100 overflow-hidden flex flex-col">
	<div class="video-glow relative bg-black group" style="aspect-ratio: 16/9;">
		<div class="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
			<span class="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
			<span class="text-white text-xs font-bold tracking-wide">LIVE</span>
		</div>
		<div class="absolute top-4 right-4 z-20">
			<span class="text-white/80 text-xs font-medium bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">Entrée principale &bull; 1080p</span>
		</div>

		<div class="w-full h-full absolute inset-0 group-hover:scale-105 transition-transform duration-700 ease-out">
			<svg class="w-full h-full" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient id="skyG2" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stop-color="#0d1b2e"/>
						<stop offset="100%" stop-color="#2a4a6a"/>
					</linearGradient>
					<linearGradient id="houseG2" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stop-color="#6b4c2a"/>
						<stop offset="100%" stop-color="#3d2a12"/>
					</linearGradient>
					<radialGradient id="winGlow2" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stop-color="#f0a830" stop-opacity="0.9"/>
						<stop offset="100%" stop-color="#c07820" stop-opacity="0.4"/>
					</radialGradient>
					<filter id="blur6b"><feGaussianBlur stdDeviation="6"/></filter>
				</defs>
				<rect width="900" height="500" fill="url(#skyG2)"/>
				<rect y="370" width="900" height="130" fill="#1e3a14"/>
				<ellipse cx="780" cy="280" rx="70" ry="170" fill="#0d2008" opacity="0.7"/>
				<ellipse cx="100" cy="270" rx="75" ry="180" fill="#0d2008" opacity="0.8"/>
				<ellipse cx="450" cy="378" rx="230" ry="18" fill="#000" opacity="0.35" filter="url(#blur6b)"/>
				<rect x="195" y="185" width="510" height="190" fill="url(#houseG2)" rx="3"/>
				<rect x="185" y="172" width="530" height="18" fill="#2e1c08" rx="3"/>
				<rect x="155" y="255" width="55" height="120" fill="#5a3f1e" rx="2"/>
				<rect x="225" y="215" width="100" height="70" fill="#e8a020" opacity="0.85" rx="3" filter="url(#blur6b)"/>
				<rect x="370" y="215" width="100" height="70" fill="#e8a020" opacity="0.85" rx="3" filter="url(#blur6b)"/>
				<rect x="515" y="215" width="100" height="70" fill="#e8a020" opacity="0.85" rx="3" filter="url(#blur6b)"/>
				<rect x="400" y="305" width="60" height="70" fill="#1e1008" rx="3"/>
				<circle cx="453" cy="342" r="3" fill="#c07820"/>
			</svg>
		</div>

		<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

		<div class="absolute bottom-4 left-4 right-4 flex justify-between items-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
			<div class="flex gap-2">
				<button aria-label="Pause" class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
					<span class="material-icons text-[18px]">pause</span>
				</button>
				<button aria-label="Volume" class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
					<span class="material-icons text-[18px]">volume_up</span>
				</button>
			</div>
			<button aria-label="Plein écran" class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
				<span class="material-icons text-[18px]">fullscreen</span>
			</button>
		</div>

		<div class="absolute bottom-0 left-0 h-0.5 bg-white/20 w-full">
			<div class="h-full bg-primary w-[75%]"></div>
		</div>
	</div>

	<div class="flex items-center justify-between px-5 py-4">
		<div>
			<p class="text-sm font-semibold text-slate-800">Caméra Entrée principale</p>
			<p class="text-xs text-slate-400 mt-0.5">Enregistrement actif depuis 12h 43m</p>
		</div>
		<div class="flex gap-2">
			<button aria-label="Plein écran" class="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
				<span class="material-icons text-[18px]">fullscreen</span>
			</button>
			<button aria-label="Paramètres" class="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
				<span class="material-icons text-[18px]">settings</span>
			</button>
		</div>
	</div>
</div>

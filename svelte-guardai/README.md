# Guard AI — Frontend

Interface web du système de surveillance Guard AI.

**Stack** : SvelteKit 2 · Svelte 5 (runes) · TypeScript · Tailwind v4 · shadcn-svelte nova

---

## Démarrage rapide

```bash
git clone https://github.com/Guard-AI-ESP/guard-ai-frontend.git
cd guard-ai-frontend/svelte-guardai
git checkout staging

npm install
npm run dev
# → http://localhost:5173
```

> Le backend doit tourner sur `http://localhost:8080` (voir [guard-ai-backend](https://github.com/Guard-AI-ESP/guard-ai-backend)).

---

## Variables d'environnement

Copier `.env.example` en `.env` :

```bash
cp .env.example .env
```

| Variable | Défaut dev | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/v1` | URL de l'API backend |
| `VITE_WS_BASE_URL` | `ws://localhost:8080` | URL WebSocket |
| `VITE_API_KEY` | _(vide)_ | Clé API M2M (optionnel en dev) |

---

## Pages

| Page | Route | Statut |
|---|---|---|
| Login / Register | `/login` | ✅ Intégré (JWT) |
| Dashboard principal | `/dashboard` | ✅ Intégré (stats + events + WebSocket) |
| Dashboard cyber | `/dashboard-cyber` | ✅ UI complète |
| Détecteurs | `/detectors` | ✅ UI complète |
| Enregistrements | `/recordings` | ✅ UI complète |
| Paramètres | `/settings` | ✅ UI complète |
| Événements | `/events` | UI en cours |

---

## Architecture

```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts          # Fetch wrapper + injection JWT
│   │   ├── events.ts          # GET/POST /v1/events
│   │   ├── stats.ts           # GET /v1/stats
│   │   ├── persons.ts         # GET/POST/DELETE /v1/persons
│   │   └── websocket.ts       # WebSocket manager + reconnexion auto
│   ├── stores/
│   │   ├── auth.svelte.ts     # Token JWT + login/register/logout
│   │   ├── events.svelte.ts   # Liste d'événements temps réel
│   │   ├── stats.svelte.ts    # Statistiques globales
│   │   └── connection.svelte.ts # Statut connexion backend
│   ├── components/
│   │   └── ui/                # Composants shadcn-svelte nova
│   └── types/
│       ├── event.ts           # EventV1, EventSource, Severity
│       └── stats.ts           # EventStats
└── routes/
    ├── login/                 # Auth (login + register sur la même page)
    ├── dashboard/             # Stats + feed événements WebSocket
    ├── dashboard-cyber/       # Vue cyber sécurité
    ├── detectors/             # Gestion des détecteurs
    ├── recordings/            # Historique enregistrements
    └── settings/              # Paramètres utilisateur
```

---

## Conventions Svelte 5

Ce projet utilise **uniquement** la syntaxe Svelte 5 runes :

```svelte
<!-- ✅ À utiliser -->
let count = $state(0)
let doubled = $derived(count * 2)
$effect(() => { console.log(count) })
let { name } = $props()

<!-- ❌ Interdit (Svelte 4 — obsolète dans ce projet) -->
export let name
$: doubled = count * 2
on:click={handler}
```

Tous les composants UI viennent de **shadcn-svelte nova** (`src/lib/components/ui/`).

---

## Flux d'authentification

1. `POST /v1/auth/login` → JWT stocké dans `localStorage` (SSR-safe via `browser` flag)
2. Toutes les requêtes API injectent `Authorization: Bearer <token>`
3. Route guard dans `+layout.svelte` → redirect `/login` si pas de token
4. Logout : supprime le token + redirect `/login`

---

## Commandes utiles

```bash
npm run dev          # Serveur de développement (hot reload)
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run check        # TypeScript check (svelte-check)
npm run lint         # ESLint
```

---

## Branches actives

| Branche | Rôle |
|---|---|
| `staging` | Intégration — état stable, base de travail |
| `feat/frontend/eok` | Développement principal frontend (PR ouverte vers staging) |
| `main` | Production — ne pas modifier directement |

> Toujours créer sa branche depuis `staging`, PR vers `staging`.

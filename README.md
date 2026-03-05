# Guard-AI Frontend

Interface web du système Guard-AI — plateforme de surveillance physique et cybernétique en temps réel.

**Stack** : SvelteKit 2 · Svelte 5 · TypeScript · TailwindCSS · DaisyUI · Vite 5

---

## Prérequis

| Outil | Version min |
|---|---|
| Node.js | 20.18+ |
| npm | 9+ |
| Backend Guard-AI | En cours d'exécution sur :8080 |

---

## Lancer le projet

### 1. Backend (requis)
```bash
cd ../backend/guard-ai-backend
cargo run
# → http://localhost:8080
```

### 2. Frontend
```bash
cd svelte-guardai
npm install
npm run dev
# → http://localhost:5174
```

### 3. Générer des données de test
```bash
curl -X POST http://localhost:8080/v1/simulate \
  -H "Content-Type: application/json" \
  -d '{"count": 10}'
```

---

## Architecture

```
svelte-guardai/
├── src/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts          # Fetch wrapper + auth X-API-Key
│   │   │   ├── events.ts          # Service événements
│   │   │   ├── stats.ts           # Service statistiques
│   │   │   ├── health.ts          # Health check
│   │   │   └── websocket.ts       # WebSocket manager + reconnexion
│   │   ├── stores/
│   │   │   ├── stats.svelte.ts    # Store stats (writable/derived)
│   │   │   ├── events.svelte.ts   # Store événements
│   │   │   └── connection.svelte.ts # Status connexion
│   │   ├── types/
│   │   │   ├── event.ts           # EventV1, EventSource, Severity
│   │   │   ├── stats.ts           # EventStats
│   │   │   └── api.ts             # Response wrappers
│   │   ├── components/
│   │   │   └── Sidebar.svelte     # Navigation principale
│   │   └── config.ts              # URL API + WebSocket (proxy Vite)
│   └── routes/
│       ├── dashboard/             # ✅ Intégré avec backend
│       ├── dashboard-cyber/       # 🔲 Mocké
│       ├── camera/                # 🔲 Mocké
│       ├── events/                # 🔲 Mocké
│       └── settings/              # 🔲 Mocké
├── vite.config.ts                 # Proxy /api → :8080/v1
└── .env                           # Config (voir section ci-dessous)
```

---

## Configuration

Les variables d'environnement sont optionnelles en développement (proxy Vite utilisé par défaut) :

```bash
# .env (optionnel en dev)
# VITE_API_BASE_URL=/api         # défaut : proxy Vite
# VITE_WS_BASE_URL=ws://...      # défaut : proxy Vite
# VITE_API_KEY=guard_xxx         # requis en prod si auth activée
```

> Le proxy Vite redirige `/api/*` → `http://localhost:8080/v1/*` pour éviter les erreurs CORS en développement.

---

## Pages & Statut d'intégration

| Page | Route | Backend | Statut |
|------|-------|---------|--------|
| Dashboard | `/dashboard` | Stats + Events + WS | ✅ Intégré |
| Dashboard Cyber | `/dashboard-cyber` | — | 🔲 Mocké |
| Caméra | `/camera` | — | 🔲 Mocké |
| Messages | `/messages` | — | 🔲 Mocké |
| Détecteurs | `/detectors` | — | 🔲 Mocké |
| Évènements | `/events` | — | 🔲 Mocké |
| Journal d'appels | `/journal-appels` | — | 🔲 Mocké |
| Settings | `/settings` | — | 🔲 Mocké |

---

## Endpoints backend utilisés

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/v1/health` | Santé du serveur |
| GET | `/v1/events` | Liste des événements |
| GET | `/v1/stats` | Statistiques globales |
| POST | `/v1/simulate` | Générer des events de test |
| WS | `/v1/events/stream` | Stream temps réel |

---

## Phases du projet

| Phase | Description | Statut |
|-------|-------------|--------|
| 1 | Persistance SQLite + SQLx | ✅ |
| 2 | WebSocket, Stats, Simulate | ✅ |
| 3 | Documentation backend | ✅ |
| 4 | Auth API (API Keys) | ✅ |
| **5** | **Frontend Dashboard** | **🔄 En cours** |
| 6 | Edge Hub | ⏳ |

# Guard AI — Frontend

Interface web du système de surveillance Guard AI — dashboard temps réel, gestion des détecteurs, authentification JWT.

**Stack** : SvelteKit 2 · Svelte 5 (runes) · TypeScript · Tailwind v4 · shadcn-svelte nova · Vite 5

---

## Prérequis

| Outil | Version min |
|---|---|
| Node.js | 20.18+ |
| npm | 9+ |
| Backend Guard AI | En cours d'exécution sur `:8080` |

---

## Lancer le projet

### 1. Backend (requis)
```bash
cd ../backend/guard-ai-backend
git checkout staging
cargo run
# → http://localhost:8080
```

### 2. Frontend
```bash
cd svelte-guardai
git checkout staging
npm install
npm run dev
# → http://localhost:5173
```

### 3. Générer des données de test
```bash
# D'abord récupérer un token
TOKEN=$(curl -s -X POST http://localhost:8080/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@guard-ai.com", "password": "secret123"}' \
  | jq -r '.token')

curl -X POST http://localhost:8080/v1/simulate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"count": 10}'
```

---

## Architecture

```
svelte-guardai/
├── src/
│   ├── lib/
│   │   ├── api/                   # Clients HTTP vers le backend
│   │   │   ├── client.ts          # Fetch wrapper + injection JWT
│   │   │   ├── events.ts          # Service événements
│   │   │   ├── stats.ts           # Service statistiques
│   │   │   ├── persons.ts         # Service personnes (reconnaissance faciale)
│   │   │   └── websocket.ts       # WebSocket manager + reconnexion auto
│   │   ├── stores/                # État global (Svelte 5 runes)
│   │   │   ├── auth.svelte.ts     # Token JWT, login/register/logout
│   │   │   ├── events.svelte.ts   # Feed événements temps réel
│   │   │   ├── stats.svelte.ts    # Statistiques globales
│   │   │   └── connection.svelte.ts # Statut connexion backend
│   │   ├── components/
│   │   │   └── ui/                # Composants shadcn-svelte nova
│   │   └── types/                 # Types TypeScript partagés
│   └── routes/                    # Pages SvelteKit
│       ├── login/                 # Authentification (login + register)
│       ├── dashboard/             # Dashboard principal
│       ├── dashboard-cyber/       # Vue cybersécurité
│       ├── detectors/             # Gestion des détecteurs
│       ├── recordings/            # Historique
│       └── settings/              # Paramètres
└── .env.example                   # Variables d'environnement
```

---

## Pages & Statut d'intégration

| Page | Route | Backend | Statut |
|---|---|---|---|
| Login / Register | `/login` | `POST /v1/auth/login` · `register` | ✅ Intégré |
| Dashboard | `/dashboard` | Stats + Events + WebSocket | ✅ Intégré |
| Dashboard Cyber | `/dashboard-cyber` | — | ✅ UI complète |
| Détecteurs | `/detectors` | — | ✅ UI complète |
| Enregistrements | `/recordings` | — | ✅ UI complète |
| Paramètres | `/settings` | — | ✅ UI complète |
| Événements | `/events` | — | En cours |

---

## Endpoints backend utilisés

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/v1/auth/register` | Créer un compte |
| `POST` | `/v1/auth/login` | Obtenir un JWT |
| `GET` | `/v1/events` | Liste des événements |
| `GET` | `/v1/stats` | Statistiques globales |
| `POST` | `/v1/simulate` | Générer des events de test |
| `GET` | `/v1/persons` | Personnes connues (reconnaissance faciale) |
| `WS` | `/ws?token=<jwt>` | Stream temps réel |

---

## Branches actives

| Branche | Rôle |
|---|---|
| `staging` | Intégration — état stable, base de travail |
| `feat/frontend/eok` | Développement principal (PR ouverte vers staging) |
| `main` | Production — ne pas modifier directement |

> Toujours créer sa branche depuis `staging`, PR vers `staging`.

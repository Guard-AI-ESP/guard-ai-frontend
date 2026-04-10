/**
 * Guard-AI Auth Store
 * Gère la session utilisateur via JWT stocké en localStorage
 */

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { loginApi, register } from '$lib/api/auth';
import { ApiClientError } from '$lib/api/client';
import { goto } from '$app/navigation';

const TOKEN_KEY = 'guard_ai_token';

// ─── State ────────────────────────────────────────────────────────────────────

export const authToken = writable<string | null>(
	browser ? localStorage.getItem(TOKEN_KEY) : null
);

export const authLoading = writable(false);
export const authError = writable<string | null>(null);

// ─── Derived ──────────────────────────────────────────────────────────────────

export const isAuthenticated = derived(authToken, ($token) => Boolean($token));

// ─── Sync token → localStorage ────────────────────────────────────────────────

authToken.subscribe((token) => {
	if (!browser) return;
	if (token) {
		localStorage.setItem(TOKEN_KEY, token);
	} else {
		localStorage.removeItem(TOKEN_KEY);
	}
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const authStore = {
	get token() {
		return get(authToken);
	},
	get isAuthenticated() {
		return get(isAuthenticated);
	},

	async login(email: string, password: string): Promise<void> {
		authLoading.set(true);
		authError.set(null);
		try {
			const { token } = await loginApi(email, password);
			authToken.set(token);
			await goto('/dashboard');
		} catch (e) {
			const msg =
				e instanceof ApiClientError && e.status === 401
					? 'Identifiants incorrects'
					: e instanceof Error
						? e.message
						: 'Erreur de connexion';
			authError.set(msg);
		} finally {
			authLoading.set(false);
		}
	},

	async register(email: string, password: string): Promise<void> {
		authLoading.set(true);
		authError.set(null);
		try {
			const { token } = await register(email, password);
			authToken.set(token);
			await goto('/dashboard');
		} catch (e) {
			const msg =
				e instanceof ApiClientError && e.status === 409
					? 'Cet email est déjà utilisé'
					: e instanceof Error
						? e.message
						: "Erreur lors de l'inscription";
			authError.set(msg);
		} finally {
			authLoading.set(false);
		}
	},

	logout(): void {
		authToken.set(null);
		goto('/login');
	}
};

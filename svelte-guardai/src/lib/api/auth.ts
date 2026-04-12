/**
 * Guard-AI Auth API Service
 */

import { apiFetch } from './client';

export interface AuthResponse {
	token: string;
	token_type: string;
	expires_in: number;
}

/**
 * POST /v1/auth/register — créé un compte, retourne un JWT
 */
export async function register(email: string, password: string): Promise<AuthResponse> {
	return apiFetch<AuthResponse>('/auth/register', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
		skipAuth: true
	});
}

/**
 * POST /v1/auth/login — vérifie les credentials, retourne un JWT
 */
export async function loginApi(email: string, password: string): Promise<AuthResponse> {
	return apiFetch<AuthResponse>('/auth/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
		skipAuth: true
	});
}

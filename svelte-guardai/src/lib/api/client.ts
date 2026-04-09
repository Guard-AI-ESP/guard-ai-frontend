/**
 * Guard-AI API Client
 * Fetch wrapper with X-API-Key authentication
 */

import { config, getApiKey } from '$lib/config';
import type { ApiError } from '$lib/types';

/** Retourne le JWT stocké en localStorage (côté client uniquement) */
function getStoredToken(): string | null {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem('guard_ai_token');
}

export class ApiClientError extends Error {
	constructor(
		message: string,
		public status: number,
		public details?: ApiError
	) {
		super(message);
		this.name = 'ApiClientError';
	}
}

interface FetchOptions extends RequestInit {
	skipAuth?: boolean;
}

/**
 * Fetch wrapper with automatic auth header injection
 */
export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
	const { skipAuth = false, headers: customHeaders, ...fetchOptions } = options;

	const url = `${config.apiBaseUrl}${endpoint}`;

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...customHeaders
	};

	if (!skipAuth) {
		// JWT Bearer en priorité, fallback sur l'API key statique (legacy / IoT)
		const jwt = getStoredToken();
		if (jwt) {
			(headers as Record<string, string>)['Authorization'] = `Bearer ${jwt}`;
		} else {
			const apiKey = getApiKey();
			if (apiKey) {
				(headers as Record<string, string>)['X-API-Key'] = apiKey;
			}
		}
	}

	const response = await fetch(url, {
		...fetchOptions,
		headers
	});

	if (!response.ok) {
		let errorDetails: ApiError | undefined;
		try {
			errorDetails = await response.json();
		} catch {
			// Response body is not JSON
		}

		if (response.status === 401) {
			throw new ApiClientError('Invalid or expired API key', 401, errorDetails);
		}

		throw new ApiClientError(
			errorDetails?.message || `HTTP ${response.status}`,
			response.status,
			errorDetails
		);
	}

	return response.json();
}

/**
 * GET request helper
 */
export async function apiGet<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
	return apiFetch<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export async function apiPost<T, B = unknown>(
	endpoint: string,
	body?: B,
	options: FetchOptions = {}
): Promise<T> {
	return apiFetch<T>(endpoint, {
		...options,
		method: 'POST',
		body: body ? JSON.stringify(body) : undefined
	});
}

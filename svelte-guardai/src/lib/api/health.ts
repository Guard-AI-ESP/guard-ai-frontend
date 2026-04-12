/**
 * Guard-AI Health API Service
 */

import { apiGet } from './client';
import type { HealthResponse } from '$lib/types';

/**
 * Check backend health
 * GET /v1/health
 */
export async function checkHealth(): Promise<HealthResponse> {
	return apiGet<HealthResponse>('/health', { skipAuth: true });
}

/**
 * Check if backend is reachable
 */
export async function isBackendHealthy(): Promise<boolean> {
	try {
		const response = await checkHealth();
		return response.status === 'ok';
	} catch {
		return false;
	}
}

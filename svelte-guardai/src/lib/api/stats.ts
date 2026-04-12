/**
 * Guard-AI Stats API Service
 */

import { apiGet } from './client';
import type { EventStats } from '$lib/types';

/**
 * Fetch aggregated statistics
 * GET /v1/stats
 */
export async function fetchStats(): Promise<EventStats> {
	return apiGet<EventStats>('/stats');
}

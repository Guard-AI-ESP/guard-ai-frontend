/**
 * Guard-AI Events API Service
 */

import { apiGet, apiPost } from './client';
import type { EventV1, EventQueryParams, EventsListResponse, EventResponse } from '$lib/types';

/**
 * Build query string from params
 */
function buildQueryString(params: EventQueryParams): string {
	const searchParams = new URLSearchParams();

	if (params.site_id) searchParams.set('site_id', params.site_id);
	if (params.source) searchParams.set('source', params.source);
	if (params.severity) searchParams.set('severity', params.severity);
	if (params.from) searchParams.set('from', params.from);
	if (params.to) searchParams.set('to', params.to);
	if (params.limit !== undefined) searchParams.set('limit', params.limit.toString());
	if (params.offset !== undefined) searchParams.set('offset', params.offset.toString());

	const query = searchParams.toString();
	return query ? `?${query}` : '';
}

/**
 * Fetch events with optional filters
 * GET /v1/events
 */
export async function fetchEvents(params: EventQueryParams = {}): Promise<EventsListResponse> {
	const query = buildQueryString(params);
	return apiGet<EventsListResponse>(`/events${query}`);
}

/**
 * Fetch a single event by ID
 * GET /v1/events/:id
 */
export async function fetchEvent(eventId: string): Promise<EventV1> {
	const response = await apiGet<EventResponse>(`/events/${eventId}`);
	return response.event;
}

/**
 * Fetch recent events (shorthand)
 */
export async function fetchRecentEvents(limit: number = 10): Promise<EventV1[]> {
	const response = await fetchEvents({ limit });
	return response.events;
}

/**
 * Simulate events for testing
 * POST /v1/simulate
 */
export async function simulateEvents(count: number = 5): Promise<{ generated: number }> {
	return apiPost<{ generated: number }>('/simulate', { count });
}

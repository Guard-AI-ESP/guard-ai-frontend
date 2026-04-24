/**
 * Guard-AI API Response Types
 */

import type { EventV1 } from './event';
import type { EventStats } from './stats';

export interface EventsListResponse {
	events: EventV1[];
	count: number;
}

export interface EventResponse {
	event: EventV1;
}

export interface IngestEventsResponse {
	accepted: number;
	rejected: number;
}

export interface SimulateRequest {
	count?: number;
}

export interface SimulateResponse {
	generated: number;
}

export interface HealthResponse {
	status: string;
}

export type StatsResponse = EventStats;

export interface ApiError {
	error: string;
	message?: string;
}

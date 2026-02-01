/**
 * Guard-AI Event Types
 * Aligned with backend EventV1 schema
 */

export type EventSource = 'camera' | 'network' | 'sensor' | 'system';
export type Severity = 'info' | 'warning' | 'critical';

export interface EventV1 {
	event_id: string;
	site_id: string;
	hub_id: string | null;
	source: EventSource;
	type: string;
	severity: Severity;
	timestamp: string;
	payload: Record<string, unknown>;
	media_ref: string | null;
	tags: string[];
	schema_version: 'v1';
}

export interface EventQueryParams {
	site_id?: string;
	source?: EventSource;
	severity?: Severity;
	from?: string;
	to?: string;
	limit?: number;
	offset?: number;
}

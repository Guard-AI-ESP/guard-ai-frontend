/**
 * Guard-AI Statistics Types
 * Response from GET /v1/stats
 */

export interface EventStats {
	total_events: number;
	by_severity: Record<string, number>;
	by_source: Record<string, number>;
	last_24h: number;
}

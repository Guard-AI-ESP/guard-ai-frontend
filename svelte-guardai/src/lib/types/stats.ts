/**
 * Guard-AI Statistics Types
 * Response from GET /v1/stats
 */

export interface EventStats {
	total_events: number;
	last_24h: number;
	/// Événements critiques des dernières 24h
	active_alerts: number;
	by_severity: Record<string, number>;
	by_source: Record<string, number>;
}

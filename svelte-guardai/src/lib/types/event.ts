/**
 * Guard-AI Event Types
 * Aligned with backend EventV1 schema
 */

export type EventSource = 'camera' | 'network' | 'sensor' | 'system';
export type Severity = 'info' | 'warning' | 'critical';

export interface BoundingBox {
	x: number;
	y: number;
	w: number;
	h: number;
}

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

	// Champs de détection faciale (présents uniquement pour source=camera)
	camera_id?: string;
	face_id?: string;
	person_name?: string;
	confidence?: number;
	is_known?: boolean;
	bounding_box?: BoundingBox;

	// Champs réseau (v1.1, présents pour source=network)
	mac_address?: string;
	ip_address?: string;
	hostname?: string;
	rssi?: number;
	signature?: string;
	scan_type?: 'host_discovery' | 'port_scan' | 'service_scan';
	drop_count?: number;
	direction?: 'inbound' | 'outbound';
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

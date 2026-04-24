export interface Device {
	mac_address: string;
	hub_id: string;
	ip_address?: string;
	hostname?: string;
	rssi?: number;
	first_seen_at: string;
	last_seen_at: string;
	connected: boolean;
}

export interface DevicesListResponse {
	devices: Device[];
	count: number;
}

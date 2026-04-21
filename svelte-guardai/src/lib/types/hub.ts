export interface Hub {
	id: string;
	site_id: string;
	name: string;
	last_seen_at?: string;
	created_at: string;
}

export interface HubsListResponse {
	hubs: Hub[];
	count: number;
}

export type CommandType = 'scan_network' | 'block_device' | 'kick_device' | 'unblock_device';

export type CommandStatus = 'pending' | 'dispatched' | 'running' | 'succeeded' | 'failed';

export interface Command {
	id: string;
	hub_id: string;
	type: CommandType;
	payload: Record<string, unknown>;
	status: CommandStatus;
	created_at: string;
	dispatched_at?: string;
	completed_at?: string;
	expires_at?: string;
	result?: Record<string, unknown>;
	error?: string;
}

export interface CreateCommandRequest {
	type: CommandType;
	payload?: Record<string, unknown>;
	ttl_seconds?: number;
}

export interface CommandResponse {
	command: Command;
}

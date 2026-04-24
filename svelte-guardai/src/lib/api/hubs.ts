import { apiGet, apiPost } from './client';
import type {
	Command,
	CommandResponse,
	CreateCommandRequest,
	Hub,
	HubsListResponse
} from '$lib/types/hub';

export async function fetchHubs(): Promise<Hub[]> {
	const data = await apiGet<HubsListResponse>('/hubs');
	return data.hubs;
}

export async function fetchHub(id: string): Promise<Hub> {
	const data = await apiGet<{ hub: Hub }>(`/hubs/${id}`);
	return data.hub;
}

export async function dispatchCommand(
	hubId: string,
	req: CreateCommandRequest
): Promise<Command> {
	const data = await apiPost<CommandResponse, CreateCommandRequest>(
		`/hubs/${hubId}/commands`,
		req
	);
	return data.command;
}

export async function getCommand(hubId: string, commandId: string): Promise<Command> {
	const data = await apiGet<CommandResponse>(`/hubs/${hubId}/commands/${commandId}`);
	return data.command;
}

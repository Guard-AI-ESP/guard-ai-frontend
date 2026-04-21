import { apiGet } from './client';
import type { Device, DevicesListResponse } from '$lib/types/device';

export async function fetchDevices(): Promise<Device[]> {
	const data = await apiGet<DevicesListResponse>('/devices');
	return data.devices;
}

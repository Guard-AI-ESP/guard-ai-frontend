import { apiFetch, ApiClientError } from './client';
import { config } from '$lib/config';
import type { Person, PersonsListResponse } from '$lib/types/person';

export async function fetchPersons(): Promise<Person[]> {
	const data = await apiFetch<PersonsListResponse>('/persons');
	return data.persons;
}

/**
 * DELETE retourne 204 No Content — on gère manuellement pour éviter
 * le .json() sur un body vide dans apiFetch.
 */
export async function deletePerson(id: string): Promise<void> {
	const token = typeof localStorage !== 'undefined' ? localStorage.getItem('guard_ai_token') : null;
	const headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (token) headers['Authorization'] = `Bearer ${token}`;

	const response = await fetch(`${config.apiBaseUrl}/persons/${id}`, {
		method: 'DELETE',
		headers
	});

	if (!response.ok && response.status !== 204) {
		throw new ApiClientError(`Erreur suppression : ${response.status}`, response.status);
	}
}

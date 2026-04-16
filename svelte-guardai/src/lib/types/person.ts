export interface Person {
	id: string;
	name: string;
	embedding: number[];
	photo_url?: string;
	created_at: string;
}

export interface CreatePersonRequest {
	name: string;
	embedding: number[];
	photo_url?: string;
}

export interface PersonsListResponse {
	persons: Person[];
	count: number;
}

export interface PersonResponse {
	person: Person;
}

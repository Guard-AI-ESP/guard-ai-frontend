declare module 'pikaday' {
	interface PikadayOptions {
		field?: HTMLElement;
		format?: string;
		i18n?: Record<string, any>;
		firstDay?: number;
		toString?: (date: Date) => string;
		onSelect?: (date: Date) => void;
		[key: string]: any;
	}

	export default class Pikaday {
		constructor(options: PikadayOptions);
		destroy(): void;
		setDate(date: Date | string, preventOnSelect?: boolean): void;
		getDate(): Date;
	}
}

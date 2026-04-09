import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Types required by shadcn-svelte nova components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithElementRef<T extends Record<string, any> = Record<string, any>> = T & {
	ref?: HTMLElement | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildrenOrChild<T extends Record<string, any>> = Omit<T, "children" | "child">;

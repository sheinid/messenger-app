import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...classNames: ClassValue[]) {
	return twMerge(clsx(classNames));
}

export function chatUrlConstructor(id1: string, id2: string): string {
	const sortedIds = [id1, id2].sort();
	return `${sortedIds[0]}--${sortedIds[1]}`;
}

export function toPusherKey(key: string): string {
	return key.replace(/:/g, "__");
}

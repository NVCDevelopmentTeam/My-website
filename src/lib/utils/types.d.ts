export interface Gtag {
	(command: 'event', action: string, params: { [key: string]: any }): void;
}

export interface LayoutShift extends PerformanceEntry {
	value: number;
	hadRecentInput: boolean;
}

export interface DataLayer {
	push(obj: { [key: string]: any }): void;
}

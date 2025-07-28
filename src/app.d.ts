/// <reference types="@sveltejs/kit" />
/// <reference types="./lib/types/global.d.ts" />

declare namespace App {
	interface Locals {
		auth: import('lucia').AuthRequest;
		user: import('lucia').User | null;
		session: import('lucia').Session | null;
	}
}

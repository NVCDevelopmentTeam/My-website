declare global {
	interface Window {
		webkitSpeechRecognition: typeof SpeechRecognition;
		webkitAudioContext: typeof AudioContext;
		responsiveVoice: any;
	}
}

export type Post = {
	slug: any;
	content: string;
	preview: {
		html: string;
		text: string;
	};
	readingTime: string;
	date: string;
	title: string;
	author: string;
	categories: string[];
	tags?: string[];
	updated?: string;
	published?: boolean;
	hidden?: boolean;
	coverImage?: string;
	coverWidth?: number;
	coverHeight?: number;
};

export type FormattedPost = {
	slug: string;
	title: string;
	author: string;
	date: string;
	content: string;
	readingTime: string;
	tags: string[];
	categories: string[];
	coverImage?: string;
	coverWidth?: number;
	coverHeight?: number;
};

export type FormattedPostWithPreview = FormattedPost & {
	preview: {
		html: string;
		text: string;
	};
};

export type Subscriber = {
	email: string;
	subscribedAt: Date;
	unsubscribedAt?: Date;
	token: string;
};

export type Comment = {
	id: string;
	postId: string;
	author: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
};

export type Stats = {
	subscribers: number;
	comments: number;
	views: number;
};

export type Discussion = {
	id: string;
	title: string;
	author: string;
	createdAt: Date;
	comments: Comment[];
};

export type ChatMessage = {
	id: string;
	sender: string;
	content: string;
	timestamp: Date;
};

export type SearchResult = {
	slug: string;
	title: string;
};

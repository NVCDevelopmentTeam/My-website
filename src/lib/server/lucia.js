import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const globalForPrisma = globalThis;

export const client = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;

// Simple auth service without Lucia for now
export const auth = {
	async createUser(data) {
		const hashedPassword = await bcrypt.hash(data.key.password, 10);
		return client.user.create({
			data: {
				id: crypto.randomUUID(),
				email: data.attributes.email,
				firstName: data.attributes.firstName,
				lastName: data.attributes.lastName,
				hashedPassword: hashedPassword
			}
		});
	},

	async validateUser(email, password) {
		const user = await client.user.findUnique({
			where: { email }
		});

		if (!user) {
			return null;
		}

		const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

		if (!isValidPassword) {
			return null;
		}

		return user;
	},

	async createSession(data) {
		return client.session.create({
			data: {
				id: crypto.randomUUID(),
				user_id: data.userId,
				platform: data.attributes.platform,
				ip_address: data.attributes.ip_address,
				active_expires: BigInt(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
				idle_expires: BigInt(Date.now() + 1000 * 60 * 60 * 2) // 2 hours
			}
		});
	},

	async invalidateSession(sessionId) {
		return client.session.delete({
			where: { id: sessionId }
		});
	},

	async invalidateAllUserSessions(userId) {
		return client.session.deleteMany({
			where: { user_id: userId }
		});
	},

	async handleRequest(event) {
		const { cookies } = event;
		const sessionId = cookies.get('session_id');

		if (!sessionId) {
			return { user: null, session: null };
		}

		const session = await client.session.findUnique({
			where: { id: sessionId }
		});

		if (!session) {
			return { user: null, session: null };
		}

		const user = await client.user.findUnique({
			where: { id: session.user_id }
		});

		return { user, session };
	}
};

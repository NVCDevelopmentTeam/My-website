import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const client = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;

// Simple auth service without Lucia for now
export const auth = {
	async createUser(data) {
		return client.user.create({
			data: {
				id: crypto.randomUUID(),
				email: data.attributes.email,
				firstName: data.attributes.firstName,
				lastName: data.attributes.lastName
			}
		});
	},

	async validateUser(email, password) {
		// This is a simplified version - in production you'd use proper password hashing
		const user = await client.user.findUnique({
			where: { email }
		});
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
	}
};

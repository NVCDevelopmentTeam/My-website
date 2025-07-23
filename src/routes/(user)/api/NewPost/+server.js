import { json } from '@sveltejs/kit';
import { siteAuthor, siteURL } from '$lib/data/config';
import { openDB } from '$lib/data/database';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: Number(process.env.MAIL_PORT),
	secure: process.env.MAIL_SECURE === 'true', // true nếu SSL
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS
	}
});

// Add rate limiting
const rateLimiter = new Map();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const MAX_REQUESTS = 10;

// Input validation helper
function validateInput(title, summary, url) {
    if (!title?.trim() || !summary?.trim() || !url?.trim()) {
        throw new Error('Missing required fields');
    }
    if (title.length > 200 || summary.length > 1000) {
        throw new Error('Content too long');
    }
    try {
        new URL(url);
    } catch {
        throw new Error('Invalid URL format');
    }
}

export async function POST({ request }) {
    try {
        const { title, summary, url } = await request.json();
        
        // Input validation
        validateInput(title, summary, url);

        // Rate limiting
        const now = Date.now();
        const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
        const userRequests = rateLimiter.get(clientIp) || [];
        const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
        
        if (recentRequests.length >= MAX_REQUESTS) {
            return json({ error: 'Rate limit exceeded' }, { status: 429 });
        }
        rateLimiter.set(clientIp, [...recentRequests, now]);

        // Database operations with timeout
        const db = await Promise.race([
            openDB(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('DB timeout')), 5000))
        ]);

        const subs = await db.all('SELECT email FROM subscribers WHERE notify_new_post = 1');

        if (!subs?.length) {
            return json({ success: true, sent: 0 });
        }

        // Sanitize and prepare email content
        const sanitizedTitle = title.replace(/[<>]/g, '');
        const sanitizedSummary = summary.replace(/[<>]/g, '');
        
        // Create messages with retry mechanism
        const messages = subs.map(row => ({
            from: `"${siteAuthor}" <${process.env.EMAIL_FROM}>`,
            to: row.email,
            subject: `New Post: ${sanitizedTitle}`,
            html: `
                <div style="max-width: 600px; margin: 0 auto;">
                    <h2>${sanitizedTitle}</h2>
                    <p>${sanitizedSummary}</p>
                    <p><a href="${url}">Read more</a></p>
                    <hr/>
                    <p>— ${siteAuthor}</p>
                    <small>If you wish to unsubscribe, <a href="${siteURL}/unsubscribe">click here</a></small>
                </div>
            `,
            text: `${sanitizedTitle}\n\n${sanitizedSummary}\n\nRead more: ${url}\n\n— ${siteAuthor}`
        }));

        // Send emails with retry
        const results = await Promise.allSettled(
            messages.map(async msg => {
                for (let attempt = 0; attempt < 3; attempt++) {
                    try {
                        return await transporter.sendMail(msg);
                    } catch (err) {
                        if (attempt === 2) throw err;
                        await new Promise(r => setTimeout(r, 1000 * attempt));
                    }
                }
            })
        );

        // Log notification
        const timestamp = Date.now();
        const id = uuidv4();
        await db.run(
            'INSERT INTO notifications(id, type, meta, created_at) VALUES (?, ?, ?, ?)',
            id,
            'new-post',
            JSON.stringify({ 
                title: sanitizedTitle, 
                url,
                successCount: results.filter(r => r.status === 'fulfilled').length,
                failureCount: results.filter(r => r.status === 'rejected').length
            }),
            timestamp
        );

        return json({ 
            success: true, 
            sent: results.filter(r => r.status === 'fulfilled').length,
            failed: results.filter(r => r.status === 'rejected').length
        });

    } catch (error) {
        console.error('New post notification error:', error);
        return json({ 
            error: 'Failed to process request',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { 
            status: error.message.includes('Rate limit') ? 429 : 500 
        });

    }
}

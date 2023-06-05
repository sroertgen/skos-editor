import { PUBLIC_CLIENT_ID } from '$env/static/public';

export const prerender = false

export async function GET() {
	const sessionId = '1234';
	const url =
		`https://github.com/login/oauth/authorize?` +
		new URLSearchParams({
			client_id: PUBLIC_CLIENT_ID,
			state: sessionId
		});
	return Response.redirect(url, 302);
}

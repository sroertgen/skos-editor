import { CLIENT_ID } from '$env/static/private';

export const prerender = false

export async function GET() {
  const sessionId = '1234';
  const url =
    `https://github.com/login/oauth/authorize?` +
    new URLSearchParams({
      client_id: CLIENT_ID,
      state: sessionId
    });
  return Response.redirect(url, 302);
}

import { CLIENT_ID, CLIENT_SECRET } from '$env/static/private';

const accessTokenURL = 'https://github.com/login/oauth/access_token';
const userURL = 'https://api.github.com/user'

export async function load({ url }) {
  const code = url.searchParams.get('code');
  const accessToken = await getAccessToken(code);
  const user = await getUser(accessToken)
  const repos = await getRepos(accessToken, user)
  return { user, repos, accessToken };
}

function getAccessToken(code) {
  return fetch(accessTokenURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      code: code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })
  }).then(r => r.json().then(r => r.access_token))
}

function getUser(accessToken) {
  return fetch(userURL, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then(r => r.json())
}

function getRepos(accessToken, user) {
  return fetch(user.repos_url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then(r => r.json())
}

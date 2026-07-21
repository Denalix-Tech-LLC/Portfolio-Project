// GitHub OAuth — step 1: redirect the Decap login popup to GitHub's consent screen.
// Requires env var: OAUTH_GITHUB_CLIENT_ID (set in Vercel → Project → Settings → Environment Variables).
export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID
  if (!clientId) {
    res.status(500).send('Missing OAUTH_GITHUB_CLIENT_ID env var')
    return
  }

  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers.host
  const redirectUri = `${proto}://${host}/api/callback`

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo,user',
    state: Math.random().toString(36).slice(2),
    allow_signup: 'false',
  })

  res.writeHead(302, { Location: `https://github.com/login/oauth/authorize?${params.toString()}` })
  res.end()
}

// GitHub OAuth — step 2: exchange the code for a token and hand it back to Decap
// via postMessage (the exact handshake Decap's GitHub backend expects).
// Requires env vars: OAUTH_GITHUB_CLIENT_ID, OAUTH_GITHUB_CLIENT_SECRET.
export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET
  const code = req.query.code

  const respond = (status, content) => {
    const body = `<!doctype html><html><body><script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage(
        'authorization:github:${status}:' + JSON.stringify(${JSON.stringify(content)}),
        e.origin
      );
      window.removeEventListener('message', receiveMessage, false);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script><p>Signing you in…</p></body></html>`
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.status(200).send(body)
  }

  if (!clientId || !clientSecret) {
    res.status(500).send('Missing OAUTH_GITHUB_CLIENT_ID / OAUTH_GITHUB_CLIENT_SECRET env vars')
    return
  }
  if (!code) {
    respond('error', { error: 'No code returned from GitHub' })
    return
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    })
    const data = await tokenRes.json()

    if (data.access_token) {
      respond('success', { token: data.access_token, provider: 'github' })
    } else {
      respond('error', { error: data.error_description || data.error || 'Token exchange failed' })
    }
  } catch (err) {
    respond('error', { error: String(err && err.message ? err.message : err) })
  }
}

// Server-side password gate. Runs before every file on the site, including /fonts and /assets.
// The password lives in the SITE_PASSWORD environment variable on Vercel, not in this file.
export const config = { matcher: '/:path*' };

const COOKIE = 'bf_site';
const THIRTY_DAYS = 60 * 60 * 24 * 30;

// Capitals and spaces don't matter: "Breast Friends" and "breastfriends" are the same password.
const normalize = (value) => String(value || '').toLowerCase().replace(/\s+/g, '');

async function tokenFor(password) {
  const bytes = new TextEncoder().encode(`breast-friends-gate:${normalize(password)}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const page = (failed) => new Response(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Breast Friends</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
html,body{height:100%}
body{display:flex;align-items:center;justify-content:center;padding:16px;background:#f4f1ec;color:#1d2567;font-family:Inter,system-ui,sans-serif}
form{width:100%;max-width:358px}
h1{font-size:28px;font-weight:700;letter-spacing:-.02em}
p{margin-top:8px;font-size:15px;line-height:1.4;font-weight:500;color:#6b6f92}
label{display:block;margin-top:28px;font-size:14px;font-weight:600}
input{display:block;width:100%;height:52px;margin-top:8px;padding:0 18px;border:1.5px solid transparent;border-radius:999px;background:#fff;color:#1d2567;font:600 16px Inter,system-ui,sans-serif;outline:0}
input:focus{border-color:#1d2567}
.error{margin-top:10px;font-size:14px;font-weight:600;color:#c62a20}
button{display:block;width:100%;height:56px;margin-top:16px;border:0;border-radius:999px;background:#1d2567;color:#f4f1ec;font:700 16px Inter,system-ui,sans-serif;cursor:pointer}
button:focus-visible{outline:2px solid #9faff8;outline-offset:2px}
</style>
</head>
<body>
<form method="post" action="/__enter">
<h1>Breast Friends</h1>
<p>Enter the password to view this prototype.</p>
<label for="password">Password</label>
<input id="password" name="password" type="password" autocomplete="current-password" autofocus required${failed ? ' aria-describedby="error"' : ''}>
${failed ? '<p class="error" id="error" role="alert">That password didn\'t work. Try again.</p>' : ''}
<button type="submit">Enter</button>
</form>
</body>
</html>`, {
  status: 401,
  headers: {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    'x-robots-tag': 'noindex',
  },
});

export default async function middleware(request) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return new Response('Site password is not configured.', { status: 503 });

  const expected = await tokenFor(password);
  const url = new URL(request.url);

  if (url.pathname === '/__enter' && request.method === 'POST') {
    const form = await request.formData();
    if ((await tokenFor(form.get('password'))) !== expected) return page(true);
    return new Response(null, {
      status: 303,
      headers: {
        location: '/',
        'cache-control': 'no-store',
        'set-cookie': `${COOKIE}=${expected}; Path=/; Max-Age=${THIRTY_DAYS}; HttpOnly; Secure; SameSite=Lax`,
      },
    });
  }

  const cookie = (request.headers.get('cookie') || '').split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  if (cookie && cookie.slice(COOKIE.length + 1) === expected) {
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }
  return page(false);
}

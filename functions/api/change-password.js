// ==========================================================================
// Cloudflare Pages Function: POST /api/change-password
// Updates the admin password hash stored in data/auth.json on GitHub
// ==========================================================================

async function sha256Hex(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const { request, env } = context;

    const githubToken = env.GITHUB_TOKEN;
    const githubRepo = env.GITHUB_REPO || 'Mett11/gutkowskino-siracusa';
    const githubBranch = env.GITHUB_BRANCH || 'main';

    if (!githubToken) {
      return new Response(
        JSON.stringify({ error: 'GITHUB_TOKEN non configurato nelle variabili d\'ambiente di Cloudflare Pages.' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const payload = await request.json();
    const { currentPassword, newPassword, newHash } = payload;

    if (!currentPassword || (!newPassword && !newHash)) {
      return new Response(
        JSON.stringify({ error: 'Campi obbligatori mancanti.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const computedNewHash = newHash || (await sha256Hex(newPassword));
    const currentHash = await sha256Hex(currentPassword);

    const ghHeaders = {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Gutkowskino-Admin-Cloudflare',
      'Content-Type': 'application/json',
    };

    // 1. Leggi data/auth.json da GitHub
    const authFileUrl = `https://api.github.com/repos/${githubRepo}/contents/data/auth.json?ref=${githubBranch}`;
    const getRes = await fetch(authFileUrl, { headers: ghHeaders });

    let existingSha = null;
    let storedHash = null;

    if (getRes.ok) {
      const fileData = await getRes.json();
      existingSha = fileData.sha;
      try {
        const decoded = atob(fileData.content.replace(/\s/g, ''));
        const authObj = JSON.parse(decoded);
        storedHash = authObj.passwordHash;
      } catch (e) {
        // parsing error
      }
    }

    // 2. Verifica che la password attuale coincida
    const fallbackEnvPass = env.ADMIN_PASSWORD || 'gutkowski2026';
    const isStoredMatch = storedHash && storedHash === currentHash;
    const isEnvMatch = currentPassword === fallbackEnvPass;

    if (!isStoredMatch && !isEnvMatch) {
      return new Response(
        JSON.stringify({ error: 'La password attuale inserita non è corretta.' }),
        { status: 401, headers: corsHeaders }
      );
    }

    // 3. Prepara nuovo file auth.json
    const newAuthObj = {
      passwordHash: computedNewHash,
      updatedAt: new Date().toISOString(),
    };

    const newJsonStr = JSON.stringify(newAuthObj, null, 2);
    const encoder = new TextEncoder();
    const dataUint8 = encoder.encode(newJsonStr);
    let binary = '';
    for (let i = 0; i < dataUint8.length; i++) {
      binary += String.fromCharCode(dataUint8[i]);
    }
    const base64Content = btoa(binary);

    const bodyData = {
      message: 'chore(security): aggiornamento password admin da pannello',
      content: base64Content,
      branch: githubBranch,
    };
    if (existingSha) bodyData.sha = existingSha;

    const putRes = await fetch(authFileUrl, {
      method: 'PUT',
      headers: ghHeaders,
      body: JSON.stringify(bodyData),
    });

    if (!putRes.ok) {
      const putErr = await putRes.text();
      throw new Error(`Salvataggio su GitHub fallito: ${putErr}`);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Password aggiornata con successo su GitHub! Usa la nuova chiave per i prossimi accessi.',
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Errore durante la modifica della password.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

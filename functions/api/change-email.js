// ==========================================================================
// Cloudflare Pages Function: POST /api/change-email
// Updates the admin email stored in data/auth.json on GitHub
// ==========================================================================

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Email',
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
    const { email } = payload;

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Indirizzo email non valido.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const ghHeaders = {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Gutkowskino-Admin-Cloudflare',
      'Content-Type': 'application/json',
    };

    // 1. Leggi data/auth.json attuale da GitHub
    const authFileUrl = `https://api.github.com/repos/${githubRepo}/contents/data/auth.json?ref=${githubBranch}`;
    const getRes = await fetch(authFileUrl, { headers: ghHeaders });

    let existingSha = null;
    let authObj = {
      email: 'admin@gutkowskino.it',
      passwordHash: '8675f89c67766a3ffbf3b466985068bae6d966af178040d71c21b1306c28af84',
      updatedAt: new Date().toISOString()
    };

    if (getRes.ok) {
      const fileData = await getRes.json();
      existingSha = fileData.sha;
      try {
        const decoded = atob(fileData.content.replace(/\s/g, ''));
        authObj = JSON.parse(decoded);
      } catch (e) {}
    }

    // 2. Aggiorna email
    authObj.email = email.toLowerCase().trim();
    authObj.updatedAt = new Date().toISOString();

    const newJsonStr = JSON.stringify(authObj, null, 2);
    const encoder = new TextEncoder();
    const dataUint8 = encoder.encode(newJsonStr);
    let binary = '';
    for (let i = 0; i < dataUint8.length; i++) {
      binary += String.fromCharCode(dataUint8[i]);
    }
    const base64Content = btoa(binary);

    const bodyData = {
      message: 'chore(security): aggiornamento email admin da pannello',
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
        message: 'Email amministratore aggiornata con successo su GitHub!',
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Errore durante l\'aggiornamento dell\'email.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

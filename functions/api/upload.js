// ==========================================================================
// Cloudflare Pages Function: POST /api/upload
// Uploads optimized images directly to the GitHub repository
// ==========================================================================

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

    // 1. Verifica token e repo GitHub
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
    const { fileData, fileName } = payload;

    if (!fileData || !fileName) {
      return new Response(
        JSON.stringify({ error: 'Dati immagine o nome file mancanti.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Estrai base64
    let base64 = fileData;
    if (fileData.startsWith('data:image/')) {
      base64 = fileData.split(',')[1];
    }

    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `assets/images/${sanitizedName}`;
    const url = `https://api.github.com/repos/${githubRepo}/contents/${filePath}`;

    const ghHeaders = {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Gutkowskino-Admin-Cloudflare',
      'Content-Type': 'application/json',
    };

    // Verifica se esiste già
    let existingSha = null;
    try {
      const checkRes = await fetch(`${url}?ref=${githubBranch}`, { headers: ghHeaders });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        existingSha = checkData.sha;
      }
    } catch (e) {
      // file nuovo
    }

    const bodyData = {
      message: `upload(media): ${sanitizedName}`,
      content: base64,
      branch: githubBranch,
    };
    if (existingSha) bodyData.sha = existingSha;

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: ghHeaders,
      body: JSON.stringify(bodyData),
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      throw new Error(`Upload su GitHub fallito: ${errText}`);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        path: filePath,
        message: 'Immagine caricata con successo su GitHub!'
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Errore durante l\'upload.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

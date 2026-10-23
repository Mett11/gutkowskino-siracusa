// ==========================================================================
// Cloudflare Pages Function: POST /api/save
// Commits changes directly to the GitHub repository without backend servers
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

    // 1. Lettura credenziali
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const clientEmail = (request.headers.get('X-Admin-Email') || '').toLowerCase().trim();

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Password o token di autenticazione mancante.' }),
        { status: 401, headers: corsHeaders }
      );
    }

    // 2. Verifica token GitHub
    const githubToken = env.GITHUB_TOKEN;
    const githubRepo = env.GITHUB_REPO || 'Mett11/gutkowskino-siracusa';
    const githubBranch = env.GITHUB_BRANCH || 'main';

    if (!githubToken) {
      return new Response(
        JSON.stringify({
          error: 'GITHUB_TOKEN mancante nelle variabili d\'ambiente di Cloudflare Pages. Configuralo nella dashboard di Cloudflare.',
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    const ghHeaders = {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Gutkowskino-Admin-Cloudflare',
      'Content-Type': 'application/json',
    };

    // 3. Verifica Email & Password (tramite env o data/auth.json su GitHub)
    const tokenHash = await sha256Hex(token);
    const envEmail = (env.ADMIN_EMAIL || '').toLowerCase().trim();
    const envPass = env.ADMIN_PASSWORD;

    let isAuthenticated = false;

    // Match se corrisponde alle variabili d'ambiente Cloudflare
    if (envPass && token === envPass && (!envEmail || clientEmail === envEmail)) {
      isAuthenticated = true;
    }

    // Match tramite data/auth.json su GitHub
    if (!isAuthenticated) {
      try {
        const authUrl = `https://api.github.com/repos/${githubRepo}/contents/data/auth.json?ref=${githubBranch}`;
        const authRes = await fetch(authUrl, { headers: ghHeaders });
        if (authRes.ok) {
          const authData = await authRes.json();
          const decoded = atob(authData.content.replace(/\s/g, ''));
          const authObj = JSON.parse(decoded);
          const expectedEmail = (authObj.email || '').toLowerCase().trim();
          const emailOk = !expectedEmail || !clientEmail || clientEmail === expectedEmail;
          const passOk = authObj.passwordHash === tokenHash;
          if (emailOk && passOk) {
            isAuthenticated = true;
          }
        }
      } catch (e) {
        // Fallback
      }
    }

    // Fallback default dev
    if (!isAuthenticated && token === 'gutkowski2026' && (!clientEmail || clientEmail === 'admin@gutkowskino.it')) {
      isAuthenticated = true;
    }

    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({ error: 'Credenziali non valide: email o password errate.' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const payload = await request.json();
    const ghHeaders = {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Gutkowskino-Admin-Cloudflare',
      'Content-Type': 'application/json',
    };

    // Helper per caricare immagini su GitHub
    async function uploadImageToGitHub(dataUrl, fileName) {
      if (!dataUrl || !dataUrl.startsWith('data:image/')) return null;
      const base64Data = dataUrl.split(',')[1];
      if (!base64Data) return null;

      const path = `assets/images/${fileName}`;
      const url = `https://api.github.com/repos/${githubRepo}/contents/${path}`;

      // Verifica se il file esiste già per recuperare eventuale SHA
      let existingSha = null;
      try {
        const checkRes = await fetch(`${url}?ref=${githubBranch}`, { headers: ghHeaders });
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          existingSha = checkData.sha;
        }
      } catch (e) {
        // file nuovo, procedi senza sha
      }

      const bodyData = {
        message: `upload(media): ${fileName}`,
        content: base64Data,
        branch: githubBranch,
      };
      if (existingSha) bodyData.sha = existingSha;

      const uploadRes = await fetch(url, {
        method: 'PUT',
        headers: ghHeaders,
        body: JSON.stringify(bodyData),
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`Upload immagine fallito per ${fileName}: ${errText}`);
      }

      return path;
    }

    // 3. Processa foto Hero
    if (payload.hero && payload.hero._compressedDataUrl) {
      const fileName = payload.hero._fileName || `hero-terrazza-${Date.now()}.webp`;
      const savedPath = await uploadImageToGitHub(payload.hero._compressedDataUrl, fileName);
      if (savedPath) payload.hero.backgroundImage = savedPath;
    }
    if (payload.hero) {
      delete payload.hero._compressedDataUrl;
      delete payload.hero._fileName;
      delete payload.hero._isNewUpload;
    }

    // 4. Processa foto Piatti
    if (payload.kitchen && Array.isArray(payload.kitchen.dishes)) {
      for (let i = 0; i < payload.kitchen.dishes.length; i++) {
        const dish = payload.kitchen.dishes[i];
        if (dish._compressedDataUrl) {
          const fileName = dish._fileName || `piatto-${i + 1}-${Date.now()}.webp`;
          const savedPath = await uploadImageToGitHub(dish._compressedDataUrl, fileName);
          if (savedPath) dish.image = savedPath;
        }
        delete dish._compressedDataUrl;
        delete dish._fileName;
        delete dish._isNewUpload;
      }
    }

    // 5. Processa foto Galleria
    if (payload.gallery && Array.isArray(payload.gallery.photos)) {
      for (let i = 0; i < payload.gallery.photos.length; i++) {
        const photo = payload.gallery.photos[i];
        if (photo._compressedDataUrl) {
          const fileName = photo._fileName || `gallery-${i + 1}-${Date.now()}.webp`;
          const savedPath = await uploadImageToGitHub(photo._compressedDataUrl, fileName);
          if (savedPath) photo.image = savedPath;
        }
        delete photo._compressedDataUrl;
        delete photo._fileName;
        delete photo._isNewUpload;
      }
    }

    // 6. Recupera SHA attuale di data/restaurant.json
    const fileUrl = `https://api.github.com/repos/${githubRepo}/contents/data/restaurant.json?ref=${githubBranch}`;
    const getRes = await fetch(fileUrl, { headers: ghHeaders });

    if (!getRes.ok) {
      const errText = await getRes.text();
      throw new Error(`Impossibile leggere data/restaurant.json da GitHub: ${errText}`);
    }

    const fileMeta = await getRes.json();
    const currentSha = fileMeta.sha;

    // 7. Esegui il commit di data/restaurant.json su GitHub
    const jsonString = JSON.stringify(payload, null, 2);
    // Base64 encoding sicuro UTF-8 per Cloudflare Workers
    const encoder = new TextEncoder();
    const dataUint8 = encoder.encode(jsonString);
    let binary = '';
    for (let i = 0; i < dataUint8.length; i++) {
      binary += String.fromCharCode(dataUint8[i]);
    }
    const base64Json = btoa(binary);

    const putRes = await fetch(`https://api.github.com/repos/${githubRepo}/contents/data/restaurant.json`, {
      method: 'PUT',
      headers: ghHeaders,
      body: JSON.stringify({
        message: 'chore(cms): aggiornamento contenuti da pannello admin',
        content: base64Json,
        sha: currentSha,
        branch: githubBranch,
      }),
    });

    if (!putRes.ok) {
      const putErr = await putRes.text();
      throw new Error(`Errore durante il commit su GitHub: ${putErr}`);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Modifiche salvate con successo su GitHub! Il sito pubblico si aggiornerà entro ~30s.',
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Errore sconosciuto durante il salvataggio.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

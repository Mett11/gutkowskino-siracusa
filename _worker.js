// ==========================================================================
// Gutkowskino Siracusa — Cloudflare Pages Advanced Worker (_worker.js)
// Handles /api/* serverless endpoints and serves static assets for all other routes
// ==========================================================================

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Email',
  'Content-Type': 'application/json',
};

async function sha256Hex(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function base64EncodeUtf8(str) {
  const encoder = new TextEncoder();
  const dataUint8 = encoder.encode(str);
  let binary = '';
  for (let i = 0; i < dataUint8.length; i++) {
    binary += String.fromCharCode(dataUint8[i]);
  }
  return btoa(binary);
}

function base64DecodeUtf8(str) {
  const binary = atob(str.replace(/\s/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

// Verifica credenziali tramite env o tramite data/auth.json su GitHub
async function verifyAuth(request, env, ghHeaders, githubRepo, githubBranch) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const clientEmail = (request.headers.get('X-Admin-Email') || '').toLowerCase().trim();

  if (!token) return { ok: false, error: 'Password o token mancante.' };

  const tokenHash = await sha256Hex(token);
  const envEmail = (env.ADMIN_EMAIL || '').toLowerCase().trim();
  const envPass = env.ADMIN_PASSWORD;

  // 1. Verifica tramite variabili d'ambiente Cloudflare
  if (envPass && token === envPass && (!envEmail || clientEmail === envEmail)) {
    return { ok: true };
  }

  // 2. Verifica tramite data/auth.json su GitHub
  try {
    const authUrl = `https://api.github.com/repos/${githubRepo}/contents/data/auth.json?ref=${githubBranch}`;
    const authRes = await fetch(authUrl, { headers: ghHeaders });
    if (authRes.ok) {
      const fileData = await authRes.json();
      const authObj = JSON.parse(base64DecodeUtf8(fileData.content));
      const expectedEmail = (authObj.email || '').toLowerCase().trim();
      const emailOk = !expectedEmail || !clientEmail || clientEmail === expectedEmail;
      const passOk = authObj.passwordHash === tokenHash;
      if (emailOk && passOk) return { ok: true, authObj, sha: fileData.sha };
    }
  } catch (e) {
    // Continua al fallback
  }

  // 3. Fallback dev master
  if (token === 'gutkowski2026' && (!clientEmail || clientEmail === 'admin@gutkowskino.it')) {
    return { ok: true };
  }

  return { ok: false, error: 'Credenziali non valide: email o password errate.' };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Gestione Preflight CORS per tutte le chiamate /api/
    if (request.method === 'OPTIONS' && pathname.startsWith('/api/')) {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // ─────────────────────────────────────────────────────────────
    // ROUTE: POST /api/save
    // ─────────────────────────────────────────────────────────────
    if (pathname === '/api/save' && request.method === 'POST') {
      try {
        const githubToken = env.GITHUB_TOKEN;
        const githubRepo = env.GITHUB_REPO || 'Mett11/gutkowskino-siracusa';
        const githubBranch = env.GITHUB_BRANCH || 'main';

        if (!githubToken) {
          return new Response(
            JSON.stringify({ error: 'GITHUB_TOKEN mancante nelle variabili d\'ambiente di Cloudflare Pages.' }),
            { status: 500, headers: CORS_HEADERS }
          );
        }

        const ghHeaders = {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Gutkowskino-Cloudflare-Worker',
          'Content-Type': 'application/json',
        };

        const auth = await verifyAuth(request, env, ghHeaders, githubRepo, githubBranch);
        if (!auth.ok) {
          return new Response(JSON.stringify({ error: auth.error }), { status: 401, headers: CORS_HEADERS });
        }

        const payload = await request.json();

        // Helper caricamento immagini su GitHub
        async function uploadImageToGitHub(dataUrl, fileName) {
          if (!dataUrl || !dataUrl.startsWith('data:image/')) return null;
          const base64Data = dataUrl.split(',')[1];
          if (!base64Data) return null;

          const imgPath = `assets/images/${fileName}`;
          const imgUrl = `https://api.github.com/repos/${githubRepo}/contents/${imgPath}`;

          let existingSha = null;
          try {
            const checkRes = await fetch(`${imgUrl}?ref=${githubBranch}`, { headers: ghHeaders });
            if (checkRes.ok) {
              const checkData = await checkRes.json();
              existingSha = checkData.sha;
            }
          } catch (e) {}

          const bodyData = {
            message: `upload(media): ${fileName}`,
            content: base64Data,
            branch: githubBranch,
          };
          if (existingSha) bodyData.sha = existingSha;

          const uploadRes = await fetch(imgUrl, {
            method: 'PUT',
            headers: ghHeaders,
            body: JSON.stringify(bodyData),
          });

          if (!uploadRes.ok) {
            const errText = await uploadRes.text();
            throw new Error(`Upload immagine fallito: ${errText}`);
          }
          return imgPath;
        }

        // Processa foto Hero
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

        // Processa piatti
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

        // Processa galleria
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

        // Recupera SHA attuale di data/restaurant.json
        const fileUrl = `https://api.github.com/repos/${githubRepo}/contents/data/restaurant.json?ref=${githubBranch}`;
        const getRes = await fetch(fileUrl, { headers: ghHeaders });
        if (!getRes.ok) {
          const errText = await getRes.text();
          throw new Error(`Impossibile leggere data/restaurant.json da GitHub: ${errText}`);
        }
        const fileMeta = await getRes.json();
        const currentSha = fileMeta.sha;

        // Commit su GitHub
        const jsonString = JSON.stringify(payload, null, 2);
        const base64Json = base64EncodeUtf8(jsonString);

        const putRes = await fetch(`https://api.github.com/repos/${githubRepo}/contents/data/restaurant.json`, {
          method: 'PUT',
          headers: ghHeaders,
          body: JSON.stringify({
            message: 'chore(cms): aggiornamento contenuti vetrina da pannello admin',
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
          { status: 200, headers: CORS_HEADERS }
        );
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message || 'Errore salvataggio.' }), {
          status: 500,
          headers: CORS_HEADERS,
        });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // ROUTE: POST /api/change-password
    // ─────────────────────────────────────────────────────────────
    if (pathname === '/api/change-password' && request.method === 'POST') {
      try {
        const githubToken = env.GITHUB_TOKEN;
        const githubRepo = env.GITHUB_REPO || 'Mett11/gutkowskino-siracusa';
        const githubBranch = env.GITHUB_BRANCH || 'main';

        if (!githubToken) {
          return new Response(JSON.stringify({ error: 'GITHUB_TOKEN mancante.' }), { status: 500, headers: CORS_HEADERS });
        }

        const ghHeaders = {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Gutkowskino-Cloudflare-Worker',
          'Content-Type': 'application/json',
        };

        const payload = await request.json();
        const { currentPassword, newPassword, newHash } = payload;

        const authFileUrl = `https://api.github.com/repos/${githubRepo}/contents/data/auth.json?ref=${githubBranch}`;
        const getRes = await fetch(authFileUrl, { headers: ghHeaders });

        let existingSha = null;
        let authObj = {
          email: 'admin@gutkowskino.it',
          passwordHash: await sha256Hex('gutkowski2026'),
          updatedAt: new Date().toISOString(),
        };

        if (getRes.ok) {
          const fileData = await getRes.json();
          existingSha = fileData.sha;
          try {
            authObj = JSON.parse(base64DecodeUtf8(fileData.content));
          } catch (e) {}
        }

        const currentHash = await sha256Hex(currentPassword || '');
        const isStoredMatch = authObj.passwordHash === currentHash;
        const isEnvMatch = env.ADMIN_PASSWORD && currentPassword === env.ADMIN_PASSWORD;

        if (!isStoredMatch && !isEnvMatch) {
          return new Response(JSON.stringify({ error: 'La password attuale inserita non è corretta.' }), {
            status: 401,
            headers: CORS_HEADERS,
          });
        }

        authObj.passwordHash = newHash || (await sha256Hex(newPassword));
        authObj.updatedAt = new Date().toISOString();

        const putRes = await fetch(authFileUrl, {
          method: 'PUT',
          headers: ghHeaders,
          body: JSON.stringify({
            message: 'chore(security): aggiornamento password admin',
            content: base64EncodeUtf8(JSON.stringify(authObj, null, 2)),
            sha: existingSha,
            branch: githubBranch,
          }),
        });

        if (!putRes.ok) {
          const putErr = await putRes.text();
          throw new Error(`Salvataggio password fallito: ${putErr}`);
        }

        return new Response(JSON.stringify({ ok: true, message: 'Password aggiornata con successo su GitHub!' }), {
          status: 200,
          headers: CORS_HEADERS,
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // ROUTE: POST /api/change-email
    // ─────────────────────────────────────────────────────────────
    if (pathname === '/api/change-email' && request.method === 'POST') {
      try {
        const githubToken = env.GITHUB_TOKEN;
        const githubRepo = env.GITHUB_REPO || 'Mett11/gutkowskino-siracusa';
        const githubBranch = env.GITHUB_BRANCH || 'main';

        if (!githubToken) {
          return new Response(JSON.stringify({ error: 'GITHUB_TOKEN mancante.' }), { status: 500, headers: CORS_HEADERS });
        }

        const ghHeaders = {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Gutkowskino-Cloudflare-Worker',
          'Content-Type': 'application/json',
        };

        const payload = await request.json();
        const { email } = payload;
        if (!email || !email.includes('@')) {
          return new Response(JSON.stringify({ error: 'Email non valida.' }), { status: 400, headers: CORS_HEADERS });
        }

        const authFileUrl = `https://api.github.com/repos/${githubRepo}/contents/data/auth.json?ref=${githubBranch}`;
        const getRes = await fetch(authFileUrl, { headers: ghHeaders });

        let existingSha = null;
        let authObj = {
          email: 'admin@gutkowskino.it',
          passwordHash: await sha256Hex('gutkowski2026'),
          updatedAt: new Date().toISOString(),
        };

        if (getRes.ok) {
          const fileData = await getRes.json();
          existingSha = fileData.sha;
          try {
            authObj = JSON.parse(base64DecodeUtf8(fileData.content));
          } catch (e) {}
        }

        authObj.email = email.toLowerCase().trim();
        authObj.updatedAt = new Date().toISOString();

        const putRes = await fetch(authFileUrl, {
          method: 'PUT',
          headers: ghHeaders,
          body: JSON.stringify({
            message: 'chore(security): aggiornamento email admin',
            content: base64EncodeUtf8(JSON.stringify(authObj, null, 2)),
            sha: existingSha,
            branch: githubBranch,
          }),
        });

        if (!putRes.ok) {
          const putErr = await putRes.text();
          throw new Error(`Salvataggio email fallito: ${putErr}`);
        }

        return new Response(JSON.stringify({ ok: true, message: 'Email aggiornata con successo su GitHub!' }), {
          status: 200,
          headers: CORS_HEADERS,
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // ROUTE: POST /api/upload
    // ─────────────────────────────────────────────────────────────
    if (pathname === '/api/upload' && request.method === 'POST') {
      try {
        const githubToken = env.GITHUB_TOKEN;
        const githubRepo = env.GITHUB_REPO || 'Mett11/gutkowskino-siracusa';
        const githubBranch = env.GITHUB_BRANCH || 'main';

        if (!githubToken) {
          return new Response(JSON.stringify({ error: 'GITHUB_TOKEN mancante.' }), { status: 500, headers: CORS_HEADERS });
        }

        const ghHeaders = {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Gutkowskino-Cloudflare-Worker',
          'Content-Type': 'application/json',
        };

        const payload = await request.json();
        const { fileData, fileName } = payload;

        let base64 = fileData;
        if (fileData.startsWith('data:image/')) base64 = fileData.split(',')[1];

        const sanitizedName = (fileName || `upload-${Date.now()}.webp`).replace(/[^a-zA-Z0-9._-]/g, '_');
        const imgPath = `assets/images/${sanitizedName}`;
        const imgUrl = `https://api.github.com/repos/${githubRepo}/contents/${imgPath}`;

        let existingSha = null;
        try {
          const checkRes = await fetch(`${imgUrl}?ref=${githubBranch}`, { headers: ghHeaders });
          if (checkRes.ok) {
            const checkData = await checkRes.json();
            existingSha = checkData.sha;
          }
        } catch (e) {}

        const putRes = await fetch(imgUrl, {
          method: 'PUT',
          headers: ghHeaders,
          body: JSON.stringify({
            message: `upload(media): ${sanitizedName}`,
            content: base64,
            sha: existingSha,
            branch: githubBranch,
          }),
        });

        if (!putRes.ok) {
          const putErr = await putRes.text();
          throw new Error(`Upload immagine fallito: ${putErr}`);
        }

        return new Response(JSON.stringify({ ok: true, path: imgPath }), { status: 200, headers: CORS_HEADERS });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // FALLBACK: Servizio file statici nativi di Cloudflare Pages (HTML, CSS, JS, immagini)
    // ─────────────────────────────────────────────────────────────
    return env.ASSETS.fetch(request);
  },
};

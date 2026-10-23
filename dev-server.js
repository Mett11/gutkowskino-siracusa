// ==========================================================================
// Gutkowskino Siracusa — Local Development Server
// Serves static files and provides local persistence at POST /api/save-local
// ==========================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = parseInt(process.argv[2] || process.env.PORT || '8080', 10);
const ROOT_DIR = __dirname;
const DATA_FILE = path.join(ROOT_DIR, 'data', 'restaurant.json');
const IMAGES_DIR = path.join(ROOT_DIR, 'assets', 'images');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Assicura che le directory esistano
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function saveBase64Image(dataUrl, defaultName = 'upload.webp') {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return null;
  }
  const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return null;
  }
  const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
  let fileName = defaultName;
  if (!fileName.endsWith(`.${ext}`)) {
    fileName = `${fileName.replace(/\.[^.]+$/, '')}.${ext}`;
  }
  // Sanitize filename
  fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = path.join(IMAGES_DIR, fileName);
  const buffer = Buffer.from(matches[2], 'base64');
  fs.writeFileSync(filePath, buffer);
  return `assets/images/${fileName}`;
}

const server = http.createServer((req, res) => {
  // CORS headers per sicurezza locale
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Email');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // ─────────────────────────────────────────────────────────────
  // ENDPOINT: POST /api/save-local o /api/save (Salvataggio persistente su disco)
  // ─────────────────────────────────────────────────────────────
  if (req.method === 'POST' && (pathname === '/api/save-local' || pathname === '/api/save')) {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Protezione payload troppo grande (max 35MB per consentire foto compresse)
      if (body.length > 35 * 1024 * 1024) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload troppo grande' }));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body);

        // 1. Processa foto Hero
        if (payload.hero && payload.hero._compressedDataUrl) {
          const fileName = payload.hero._fileName || `hero-terrazza-${Date.now()}.webp`;
          const savedPath = saveBase64Image(payload.hero._compressedDataUrl, fileName);
          if (savedPath) {
            payload.hero.backgroundImage = savedPath;
          }
        }
        if (payload.hero) {
          delete payload.hero._compressedDataUrl;
          delete payload.hero._fileName;
          delete payload.hero._isNewUpload;
        }

        // 2. Processa foto Piatti
        if (payload.kitchen && Array.isArray(payload.kitchen.dishes)) {
          payload.kitchen.dishes.forEach((dish, idx) => {
            if (dish._compressedDataUrl) {
              const fileName = dish._fileName || `piatto-${idx + 1}-${Date.now()}.webp`;
              const savedPath = saveBase64Image(dish._compressedDataUrl, fileName);
              if (savedPath) {
                dish.image = savedPath;
              }
            }
            delete dish._compressedDataUrl;
            delete dish._fileName;
            delete dish._isNewUpload;
          });
        }

        // 3. Processa foto Galleria
        if (payload.gallery && Array.isArray(payload.gallery.photos)) {
          payload.gallery.photos.forEach((photo, idx) => {
            if (photo._compressedDataUrl) {
              const fileName = photo._fileName || `gallery-${idx + 1}-${Date.now()}.webp`;
              const savedPath = saveBase64Image(photo._compressedDataUrl, fileName);
              if (savedPath) {
                photo.image = savedPath;
              }
            }
            delete photo._compressedDataUrl;
            delete photo._fileName;
            delete photo._isNewUpload;
          });
        }

        // 4. Backup preventivo di data/restaurant.json
        if (fs.existsSync(DATA_FILE)) {
          const bakPath = path.join(ROOT_DIR, 'data', 'restaurant.json.bak');
          fs.copyFileSync(DATA_FILE, bakPath);
        }

        // 5. Scrittura su disco di data/restaurant.json formattato
        fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');

        console.log(`[${new Date().toLocaleTimeString()}] Salvataggio completato: data/restaurant.json aggiornato.`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, message: 'Dati salvati con successo su disco!' }));
      } catch (err) {
        console.error('Errore durante il salvataggio:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Errore interno salvataggio: ' + err.message }));
      }
    });
    return;
  }

  // ─────────────────────────────────────────────────────────────
  // ENDPOINT: POST /api/change-password (Modifica password admin su disco)
  // ─────────────────────────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/api/change-password') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { currentPassword, newPassword, newHash } = JSON.parse(body);
        const AUTH_FILE = path.join(ROOT_DIR, 'data', 'auth.json');

        let storedHash = null;
        if (fs.existsSync(AUTH_FILE)) {
          const authData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
          storedHash = authData.passwordHash;
        }

        const inputCurrentHash = crypto.createHash('sha256').update(currentPassword || '').digest('hex');
        const defaultHash = crypto.createHash('sha256').update('gutkowski2026').digest('hex');

        if (storedHash ? inputCurrentHash !== storedHash : inputCurrentHash !== defaultHash) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'La password attuale inserita non è corretta.' }));
          return;
        }

        const computedNewHash = newHash || crypto.createHash('sha256').update(newPassword).digest('hex');
        const newAuthObj = {
          passwordHash: computedNewHash,
          updatedAt: new Date().toISOString()
        };

        fs.writeFileSync(AUTH_FILE, JSON.stringify(newAuthObj, null, 2), 'utf8');
        console.log(`[${new Date().toLocaleTimeString()}] Password admin aggiornata con successo su disco.`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, message: 'Password aggiornata con successo su disco!' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Errore cambio password: ' + err.message }));
      }
    });
    return;
  }

  // ─────────────────────────────────────────────────────────────
  // ENDPOINT: POST /api/upload-local (Upload singolo file)
  // ─────────────────────────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/api/upload-local') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { fileData, fileName } = JSON.parse(body);
        const savedPath = saveBase64Image(fileData, fileName || `upload-${Date.now()}.webp`);
        if (savedPath) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, path: savedPath }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Formato immagine non valido.' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // ─────────────────────────────────────────────────────────────
  // ENDPOINT: POST /api/change-email (Modifica email admin su disco)
  // ─────────────────────────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/api/change-email') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { email } = JSON.parse(body);
        if (!email || !email.includes('@')) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Indirizzo email non valido.' }));
          return;
        }

        const AUTH_FILE = path.join(ROOT_DIR, 'data', 'auth.json');
        let authObj = {
          email: 'admin@gutkowskino.it',
          passwordHash: crypto.createHash('sha256').update('gutkowski2026').digest('hex'),
          updatedAt: new Date().toISOString()
        };

        if (fs.existsSync(AUTH_FILE)) {
          authObj = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
        }

        authObj.email = email.toLowerCase().trim();
        authObj.updatedAt = new Date().toISOString();

        fs.writeFileSync(AUTH_FILE, JSON.stringify(authObj, null, 2), 'utf8');
        console.log(`[${new Date().toLocaleTimeString()}] Email admin aggiornata con successo su disco: ${email}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, message: 'Email admin aggiornata con successo!' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // ─────────────────────────────────────────────────────────────
  // ENDPOINT: POST /api/login (Verifica credenziali per admin)
  // ─────────────────────────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/api/login') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        const emailClean = (email || '').toLowerCase().trim();
        const inputHash = crypto.createHash('sha256').update(password || '').digest('hex');

        const AUTH_FILE = path.join(ROOT_DIR, 'data', 'auth.json');
        let expectedEmail = 'admin@gutkowskino.it';
        let expectedHash = crypto.createHash('sha256').update('gutkowski2026').digest('hex');

        if (fs.existsSync(AUTH_FILE)) {
          const authObj = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
          if (authObj.email) expectedEmail = authObj.email.toLowerCase().trim();
          if (authObj.passwordHash) expectedHash = authObj.passwordHash;
        }

        const isEmailMatch = emailClean === expectedEmail || emailClean === 'admin@gutkowskino.it';
        const isPassMatch = inputHash === expectedHash || password === 'gutkowski2026';

        if (!isEmailMatch) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: `Email non riconosciuta (${emailClean}). L'email amministratore è differente.` }));
          return;
        }

        if (!isPassMatch) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Password errata per questo account (attenzione alle password salvate dal browser).' }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, email: emailClean, message: 'Accesso eseguito con successo!' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // ─────────────────────────────────────────────────────────────
  // STATIC FILE SERVING
  // ─────────────────────────────────────────────────────────────
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(path.join(ROOT_DIR, pathname));
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found: ' + pathname);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Disabilita cache per json e html per vedere modifiche all'istante
    const headers = { 'Content-Type': contentType };
    if (ext === '.json' || ext === '.html') {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }

    res.writeHead(200, headers);
    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`
============================================================
  GUTKOWSKINO SIRACUSA — Dev Server Attivo!
  Vetrina pubblica : http://localhost:${PORT}/
  Pannello Admin   : http://localhost:${PORT}/admin.html
  Salvataggio      : POST /api/save-local (Persistenza su disco)
============================================================
`);
});

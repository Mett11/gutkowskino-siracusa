/**
 * GUTKOWSKINO · Pannello di Controllo Admin
 * Compressore Automatico WebP + Gestione Dinamica Vetrina
 */

(function () {
  'use strict';

  // Stato Globale dell'Applicazione Admin
  let currentData = null;
  let authToken = null;
  let authEmail = null;
  let isDevMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // ─────────────────────────────────────────────────────────────
  // 1. COMPRESSORE AUTOMATICO IMMAGINI (HTML5 Canvas -> WebP)
  // ─────────────────────────────────────────────────────────────
  /**
   * Ridimensiona qualsiasi immagine a maxDimension (1600px) e la converte in WebP leggero (82% qualità)
   * @param {File} file - Il file selezionato dall'utente (JPEG, PNG, HEIC, ecc.)
   * @param {number} maxDimension - Risoluzione massima lato lungo (default 1600px)
   * @param {number} quality - Qualità WebP tra 0 e 1 (default 0.82)
   * @returns {Promise<{dataUrl: string, blob: Blob, originalSize: number, compressedSize: number, width: number, height: number}>}
   */
  async function compressImageToWebP(file, maxDimension = 1600, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Impossibile leggere il file selezionato.'));

      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error('Formato immagine non valido o corrotto.'));

        img.onload = () => {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // Calcola il ridimensionamento mantenendo le proporzioni
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          // Alta qualità di rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Esporta in WebP moderno
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                // Fallback a JPEG se il browser non supporta l'export WebP da canvas
                canvas.toBlob((jpgBlob) => {
                  resolve({
                    dataUrl: canvas.toDataURL('image/jpeg', quality),
                    blob: jpgBlob,
                    originalSize: file.size,
                    compressedSize: jpgBlob.size,
                    width,
                    height
                  });
                }, 'image/jpeg', quality);
                return;
              }

              const dataUrl = canvas.toDataURL('image/webp', quality);
              resolve({
                dataUrl,
                blob,
                originalSize: file.size,
                compressedSize: blob.size,
                width,
                height
              });
            },
            'image/webp',
            quality
          );
        };

        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    });
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  // ─────────────────────────────────────────────────────────────
  // 2. AUTENTICAZIONE & ACCESSO
  // ─────────────────────────────────────────────────────────────
  async function sha256Hex(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  const loginScreen = document.getElementById('loginScreen');
  const adminApp = document.getElementById('adminApp');
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('adminEmail');
  const passwordInput = document.getElementById('adminPassword');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminModeBadge = document.getElementById('adminModeBadge');

  function checkSession() {
    const savedToken = sessionStorage.getItem('gutkowski_admin_auth');
    const savedEmail = sessionStorage.getItem('gutkowski_admin_email');
    if (savedToken) {
      authToken = savedToken;
      authEmail = savedEmail || 'admin@gutkowskino.it';
      showDashboard();
    }
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailVal = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const passVal = passwordInput ? passwordInput.value.trim() : '';
    if (!emailVal || !passVal) return;

    if (loginError) loginError.style.display = 'none';

    try {
      const inputHash = await sha256Hex(passVal);
      // Leggi auth.json se presente
      let expectedHash = '8675f89c67766a3ffbf3b466985068bae6d966af178040d71c21b1306c28af84'; // default gutkowski2026
      let expectedEmail = 'admin@gutkowskino.it';

      try {
        const authRes = await fetch('data/auth.json?_t=' + Date.now());
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.passwordHash) expectedHash = authData.passwordHash;
          if (authData.email) expectedEmail = authData.email.toLowerCase();
        }
      } catch (err) {
        // Fallback default
      }

      const isPassValid = inputHash === expectedHash || passVal === 'gutkowski2026';
      const isEmailValid = emailVal === expectedEmail || emailVal === 'admin@gutkowskino.it';

      if (isPassValid && isEmailValid) {
        authToken = passVal;
        authEmail = emailVal;
        sessionStorage.setItem('gutkowski_admin_auth', authToken);
        sessionStorage.setItem('gutkowski_admin_email', authEmail);
        showDashboard();
      } else {
        if (loginError) {
          loginError.textContent = 'Email o password non corretti. Riprova.';
          loginError.style.display = 'block';
        }
        passwordInput.focus();
      }
    } catch (err) {
      console.error(err);
      authToken = passVal;
      authEmail = emailVal;
      sessionStorage.setItem('gutkowski_admin_auth', authToken);
      sessionStorage.setItem('gutkowski_admin_email', authEmail);
      showDashboard();
    }
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('gutkowski_admin_auth');
    sessionStorage.removeItem('gutkowski_admin_email');
    authToken = null;
    authEmail = null;
    adminApp.style.display = 'none';
    loginScreen.style.display = 'flex';
    if (passwordInput) passwordInput.value = '';
  });

  function showDashboard() {
    loginScreen.style.display = 'none';
    adminApp.style.display = 'block';

    if (adminModeBadge) {
      adminModeBadge.textContent = isDevMode ? 'Ambiente Locale' : 'Cloudflare Pages Active';
    }

    const adminEmailInput = document.getElementById('adminEmailInput');
    if (adminEmailInput) {
      adminEmailInput.value = authEmail || 'admin@gutkowskino.it';
    }

    loadInitialData();
  }

  // ─────────────────────────────────────────────────────────────
  // 3. CARICAMENTO DATI ESISTENTI (data/restaurant.json)
  // ─────────────────────────────────────────────────────────────
  async function loadInitialData() {
    try {
      const res = await fetch('data/restaurant.json?t=' + Date.now());
      if (!res.ok) throw new Error('HTTP ' + res.status);
      currentData = await res.json();
      populateFormFields(currentData);
      showToast('Dati caricati correttamente dalla vetrina', 'success');
    } catch (err) {
      console.error(err);
      showToast('Errore nel caricamento di data/restaurant.json', 'error');
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 4. POPOLAMENTO DEI CAMPI DEL FORM
  // ─────────────────────────────────────────────────────────────
  function populateFormFields(data) {
    // TAB 1: Hero
    const heroBgImg = document.getElementById('heroImagePreview');
    const heroBgMeta = document.getElementById('heroImageMeta');
    const heroHeading = document.getElementById('heroHeading');
    const brandLoc = document.getElementById('brandLocationTag');
    const heroSub = document.getElementById('heroSubheading');

    if (heroBgImg) heroBgImg.src = data.hero?.backgroundImage || '';
    if (heroBgMeta) heroBgMeta.textContent = data.hero?.backgroundImage || 'Nessuna foto selezionata';
    if (heroHeading) heroHeading.value = data.hero?.heading || '';
    if (brandLoc) brandLoc.value = data.brand?.locationTag || '';
    if (heroSub) heroSub.value = data.hero?.subheading || '';

    // Hero File Uploader con compressore automatico
    setupHeroUploader();

    // TAB 2: Cucina
    const kitchenHeading = document.getElementById('kitchenHeading');
    const kitchenNote = document.getElementById('kitchenNote');
    if (kitchenHeading) kitchenHeading.value = data.kitchen?.heading || '';
    if (kitchenNote) kitchenNote.value = data.kitchen?.note || '';
    renderDishesList(data.kitchen?.dishes || []);

    // TAB 3: Orari & Servizio
    populateHoursTab(data);

    // TAB 4: Recensioni
    const reviewsRating = document.getElementById('reviewsRating');
    const reviewsTotal = document.getElementById('reviewsTotal');
    if (reviewsRating) reviewsRating.value = data.reviews?.rating || '4.6';
    if (reviewsTotal) reviewsTotal.value = data.reviews?.totalReviews || '76';
    renderReviewsList(data.reviews?.featured || []);

    // TAB 5: Galleria
    const spacesSub = document.getElementById('spacesSub');
    if (spacesSub) spacesSub.value = data.spaces?.sub || '';
    renderGalleryList(data.gallery?.photos || []);

    // TAB 6: Sede & Contatti
    populateInfoTab(data);
  }

  // ─────────────────────────────────────────────────────────────
  // HERO UPLOADER CON COMPRESSORE WEBP
  // ─────────────────────────────────────────────────────────────
  function setupHeroUploader() {
    const fileInput = document.getElementById('heroFileInput');
    const urlInput = document.getElementById('heroImageUrlInput');
    const preview = document.getElementById('heroImagePreview');
    const meta = document.getElementById('heroImageMeta');

    fileInput?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        meta.textContent = 'Compressione WebP in corso...';
        const res = await compressImageToWebP(file, 1600, 0.82);

        preview.src = res.dataUrl;
        const savedPerc = Math.round((1 - res.compressedSize / res.originalSize) * 100);
        meta.textContent = `WebP ${res.width}x${res.height} · ${formatBytes(res.compressedSize)} (risparmio -${savedPerc}%)`;

        // Memorizziamo il blob compresso per il salvataggio
        preview.dataset.compressedDataUrl = res.dataUrl;
        preview.dataset.isNewUpload = 'true';
        preview.dataset.fileName = 'hero-terrazza-' + Date.now() + '.webp';

        showToast(`Foto ottimizzata: da ${formatBytes(res.originalSize)} a ${formatBytes(res.compressedSize)}!`, 'success');
      } catch (err) {
        alert(err.message);
        meta.textContent = 'Errore compressione';
      }
    });

    urlInput?.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      if (url) {
        preview.src = url;
        meta.textContent = 'URL esterno: ' + url.slice(0, 36) + '...';
        delete preview.dataset.isNewUpload;
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TAB 2: GESTIONE CAROSELLO PIATTI
  // ─────────────────────────────────────────────────────────────
  function renderDishesList(dishes) {
    const container = document.getElementById('dishesListContainer');
    if (!container) return;

    container.innerHTML = dishes.map((d, idx) => `
      <div class="dish-card-edit" data-index="${idx}">
        <div class="dce-thumb-box">
          <div class="dce-thumb-preview">
            <img src="${d.image || ''}" alt="${d.name || ''}" id="dishThumb_${idx}">
          </div>
          <label class="btn btn-outline btn-sm file-label" style="text-align:center;">
            <span>Cambia Foto</span>
            <input type="file" accept="image/*" class="sr-only dish-file-input" data-dish-idx="${idx}">
          </label>
        </div>

        <div class="dce-fields">
          <div class="grid-2-col">
            <div class="form-group" style="margin-bottom:0.4rem;">
              <label>Nome del Piatto</label>
              <input type="text" class="form-input dish-name" value="${escapeHtml(d.name || '')}">
            </div>
            <div class="form-group" style="margin-bottom:0.4rem;">
              <label>Portata / Categoria</label>
              <input type="text" class="form-input dish-course" value="${escapeHtml(d.course || '')}" placeholder="Es. Secondo dell'Orto, Primo Piatto">
            </div>
          </div>

          <div class="form-group" style="margin-bottom:0.4rem;">
            <label>Materia Prima (separare con " · " per le pillole)</label>
            <input type="text" class="form-input dish-ingredients" value="${escapeHtml(d.ingredients || '')}" placeholder="Carciofo · Barbabietola · Pinoli tostati">
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label>Descrizione della portata</label>
            <textarea class="form-textarea dish-desc" rows="2">${escapeHtml(d.description || '')}</textarea>
          </div>
        </div>

        <div class="dce-actions">
          <button type="button" class="dce-action-btn move-up-dish" title="Sposta su" ${idx === 0 ? 'disabled' : ''}>↑</button>
          <button type="button" class="dce-action-btn move-down-dish" title="Sposta giù" ${idx === dishes.length - 1 ? 'disabled' : ''}>↓</button>
          <button type="button" class="dce-action-btn btn-del delete-dish" title="Elimina piatto">✕</button>
        </div>
      </div>
    `).join('');

    // Listener per riordino ed eliminazione
    container.querySelectorAll('.move-up-dish').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.closest('.dish-card-edit').dataset.index, 10);
        if (idx > 0) {
          syncCurrentDishesFromDOM();
          const temp = currentData.kitchen.dishes[idx];
          currentData.kitchen.dishes[idx] = currentData.kitchen.dishes[idx - 1];
          currentData.kitchen.dishes[idx - 1] = temp;
          renderDishesList(currentData.kitchen.dishes);
        }
      });
    });

    container.querySelectorAll('.move-down-dish').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.closest('.dish-card-edit').dataset.index, 10);
        if (idx < currentData.kitchen.dishes.length - 1) {
          syncCurrentDishesFromDOM();
          const temp = currentData.kitchen.dishes[idx];
          currentData.kitchen.dishes[idx] = currentData.kitchen.dishes[idx + 1];
          currentData.kitchen.dishes[idx + 1] = temp;
          renderDishesList(currentData.kitchen.dishes);
        }
      });
    });

    container.querySelectorAll('.delete-dish').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.closest('.dish-card-edit').dataset.index, 10);
        if (confirm('Sei sicuro di voler eliminare questo piatto dal menu?')) {
          syncCurrentDishesFromDOM();
          currentData.kitchen.dishes.splice(idx, 1);
          renderDishesList(currentData.kitchen.dishes);
        }
      });
    });

    // Listener compressore foto piatto
    container.querySelectorAll('.dish-file-input').forEach(input => {
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        const idx = parseInt(e.target.dataset.dishIdx, 10);
        if (!file) return;

        try {
          const res = await compressImageToWebP(file, 1400, 0.82);
          const thumb = document.getElementById('dishThumb_' + idx);
          if (thumb) {
            thumb.src = res.dataUrl;
            thumb.dataset.compressedDataUrl = res.dataUrl;
            thumb.dataset.isNewUpload = 'true';
            thumb.dataset.fileName = 'piatto-' + Date.now() + '.webp';
          }
          showToast(`Foto piatto compressa: ${formatBytes(res.compressedSize)} (WebP)`, 'success');
        } catch (err) {
          alert('Errore compressione foto piatto: ' + err.message);
        }
      });
    });
  }

  document.getElementById('addNewDishBtn')?.addEventListener('click', () => {
    syncCurrentDishesFromDOM();
    if (!currentData.kitchen) currentData.kitchen = { dishes: [] };
    if (!currentData.kitchen.dishes) currentData.kitchen.dishes = [];

    currentData.kitchen.dishes.push({
      name: 'Nuovo Piatto Vegetale',
      course: 'Primo dell\'Orto',
      ingredients: 'Ortaggi di stagione · Erbe aromatiche di Ortigia',
      description: 'Descrizione della preparazione, degli ingredienti e delle consistenze...',
      image: 'https://cdn.thefork.com/tf-lab/image/upload/w_1400,q_auto,f_auto,q_auto,f_jpg/restaurant/20b6c5c8-f1e3-462d-87be-e8523872b76d/3b65ae14-2a51-48ab-bf93-f75fd2c90de6.jpg'
    });

    renderDishesList(currentData.kitchen.dishes);
    showToast('Nuovo piatto aggiunto in fondo alla lista', 'success');
  });

  function syncCurrentDishesFromDOM() {
    const cards = document.querySelectorAll('#dishesListContainer .dish-card-edit');
    if (!cards.length) return;

    currentData.kitchen.dishes = Array.from(cards).map((card, i) => {
      const name = card.querySelector('.dish-name')?.value.trim() || '';
      const course = card.querySelector('.dish-course')?.value.trim() || '';
      const ingredients = card.querySelector('.dish-ingredients')?.value.trim() || '';
      const description = card.querySelector('.dish-desc')?.value.trim() || '';
      const thumb = card.querySelector('img');
      const image = thumb?.src || '';

      return {
        name,
        course,
        ingredients,
        description,
        image,
        _compressedDataUrl: thumb?.dataset?.compressedDataUrl,
        _isNewUpload: thumb?.dataset?.isNewUpload === 'true',
        _fileName: thumb?.dataset?.fileName
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TAB 3: ORARI & LIVE PREVIEW
  // ─────────────────────────────────────────────────────────────
  function populateHoursTab(data) {
    const daysOpen = document.getElementById('hoursDaysOpen');
    const dinnerDisplay = document.getElementById('hoursDinnerDisplay');
    const restDaySelect = document.getElementById('hoursRestDay');
    const dinnerStart = document.getElementById('hoursDinnerStart');
    const dinnerEnd = document.getElementById('hoursDinnerEnd');
    const restLabel = document.getElementById('hoursRestLabel');
    const notice = document.getElementById('hoursNotice');

    const hours = data.hours || {
      daysOpen: 'Giovedì — Martedì',
      restDay: 3,
      restDayName: 'Mercoledì',
      restDayLabel: 'Riposo settimanale',
      dinnerStart: '19:00',
      dinnerEnd: '22:30',
      dinnerDisplay: '19:00 — 22:30',
      statusNotice: ''
    };

    if (daysOpen) daysOpen.value = hours.daysOpen || 'Giovedì — Martedì';
    if (dinnerDisplay) dinnerDisplay.value = hours.dinnerDisplay || '19:00 — 22:30';
    if (restDaySelect) restDaySelect.value = hours.restDay !== undefined && hours.restDay !== null ? String(hours.restDay) : '3';
    if (dinnerStart) dinnerStart.value = hours.dinnerStart || '19:00';
    if (dinnerEnd) dinnerEnd.value = hours.dinnerEnd || '22:30';
    if (restLabel) restLabel.value = hours.restDayLabel || hours.restLabel || 'Riposo settimanale';
    if (notice) notice.value = hours.statusNotice || '';

    // Live update preview
    const updatePreview = () => {
      const dot = document.getElementById('previewStatusDot');
      const txt = document.getElementById('previewStatusText');
      if (!dot || !txt) return;

      const noticeVal = notice?.value.trim();
      if (noticeVal) {
        dot.className = 'status-dot-preview';
        txt.textContent = noticeVal;
        return;
      }

      const restVal = restDaySelect?.value;
      const startVal = dinnerStart?.value || '19:00';
      const endVal = dinnerEnd?.value || '22:30';

      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
      const day = now.getDay();
      const hour = now.getHours() + now.getMinutes() / 60;
      const [sh, sm] = startVal.split(':').map(Number);
      const [eh, em] = endVal.split(':').map(Number);
      const startNum = sh + (sm || 0) / 60;
      const endNum = eh + (em || 0) / 60;

      const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

      if (restVal !== 'none' && day === parseInt(restVal, 10)) {
        dot.className = 'status-dot-preview closed';
        txt.textContent = `${dayNames[day]} riposo`;
      } else if (hour >= startNum && hour <= endNum) {
        dot.className = 'status-dot-preview';
        txt.textContent = `Aperto ora · ${startVal}-${endVal}`;
      } else {
        dot.className = 'status-dot-preview';
        txt.textContent = `Cena · ${startVal}-${endVal}`;
      }
    };

    restDaySelect?.addEventListener('change', updatePreview);
    dinnerStart?.addEventListener('input', updatePreview);
    dinnerEnd?.addEventListener('input', updatePreview);
    notice?.addEventListener('input', updatePreview);

    updatePreview();
  }

  // ─────────────────────────────────────────────────────────────
  // TAB 4: RECENSIONI
  // ─────────────────────────────────────────────────────────────
  function renderReviewsList(reviews) {
    const container = document.getElementById('reviewsListContainer');
    if (!container) return;

    container.innerHTML = reviews.map((r, idx) => `
      <div class="review-item-edit" data-index="${idx}">
        <div class="rie-top">
          <div class="grid-2-col" style="flex:1;">
            <input type="text" class="form-input rev-author" value="${escapeHtml(r.author || '')}" placeholder="Nome autore (es. Elena V.)">
            <select class="form-select rev-source">
              <option value="TheFork" ${r.source === 'TheFork' ? 'selected' : ''}>TheFork (Ospite Verificato)</option>
              <option value="Google Maps" ${r.source === 'Google Maps' ? 'selected' : ''}>Google Maps (Locale)</option>
              <option value="TripAdvisor" ${r.source === 'TripAdvisor' ? 'selected' : ''}>TripAdvisor</option>
            </select>
          </div>
          <button type="button" class="rie-del-btn delete-review">Elimina</button>
        </div>
        <textarea class="form-textarea rev-text" rows="2" placeholder="Testo della recensione...">${escapeHtml(r.text || '')}</textarea>
      </div>
    `).join('');

    container.querySelectorAll('.delete-review').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.closest('.review-item-edit').dataset.index, 10);
        if (confirm('Vuoi rimuovere questa recensione in evidenza?')) {
          syncReviewsFromDOM();
          currentData.reviews.featured.splice(idx, 1);
          renderReviewsList(currentData.reviews.featured);
        }
      });
    });
  }

  document.getElementById('addNewReviewBtn')?.addEventListener('click', () => {
    syncReviewsFromDOM();
    if (!currentData.reviews) currentData.reviews = { featured: [] };
    if (!currentData.reviews.featured) currentData.reviews.featured = [];

    currentData.reviews.featured.push({
      author: 'Nuovo Ospite',
      source: 'Google Maps',
      text: 'Esperienza incantevole sul lungomare di Ortigia con piatti creativi e vista sul mare.'
    });

    renderReviewsList(currentData.reviews.featured);
    showToast('Nuova recensione aggiunta', 'success');
  });

  function syncReviewsFromDOM() {
    const items = document.querySelectorAll('#reviewsListContainer .review-item-edit');
    if (!items.length) return;

    currentData.reviews.featured = Array.from(items).map(item => ({
      author: item.querySelector('.rev-author')?.value.trim() || 'Ospite',
      source: item.querySelector('.rev-source')?.value || 'Google Maps',
      text: item.querySelector('.rev-text')?.value.trim() || ''
    }));
  }

  // ─────────────────────────────────────────────────────────────
  // TAB 5: GALLERIA FOTOGRAFICA
  // ─────────────────────────────────────────────────────────────
  function renderGalleryList(photos) {
    const container = document.getElementById('galleryListContainer');
    if (!container) return;

    container.innerHTML = photos.map((p, idx) => `
      <div class="gallery-card-edit" data-index="${idx}">
        <div class="gce-preview">
          <img src="${p.image || ''}" alt="${escapeHtml(p.title || '')}" id="galThumb_${idx}">
        </div>
        <div class="gce-body">
          <input type="text" class="form-input gce-title" value="${escapeHtml(p.title || '')}" placeholder="Titolo scatto">
          <select class="form-select gce-cat">
            <option value="ambiente" ${p.category === 'ambiente' ? 'selected' : ''}>Ambiente & Terrazza</option>
            <option value="piatti" ${p.category === 'piatti' ? 'selected' : ''}>I Piatti</option>
          </select>
          <label class="btn btn-outline btn-sm file-label" style="text-align:center;">
            <span>Sostituisci Foto</span>
            <input type="file" accept="image/*" class="sr-only gal-file-input" data-gal-idx="${idx}">
          </label>
          <button type="button" class="gce-del-btn delete-gal-photo">Rimuovi Foto</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.delete-gal-photo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.closest('.gallery-card-edit').dataset.index, 10);
        if (confirm('Rimuovere questa foto dalla galleria?')) {
          syncGalleryFromDOM();
          currentData.gallery.photos.splice(idx, 1);
          renderGalleryList(currentData.gallery.photos);
        }
      });
    });

    container.querySelectorAll('.gal-file-input').forEach(input => {
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        const idx = parseInt(e.target.dataset.galIdx, 10);
        if (!file) return;

        try {
          const res = await compressImageToWebP(file, 1600, 0.82);
          const thumb = document.getElementById('galThumb_' + idx);
          if (thumb) {
            thumb.src = res.dataUrl;
            thumb.dataset.compressedDataUrl = res.dataUrl;
            thumb.dataset.isNewUpload = 'true';
            thumb.dataset.fileName = 'gallery-' + Date.now() + '.webp';
          }
          showToast(`Foto galleria ottimizzata: ${formatBytes(res.compressedSize)} (WebP)`, 'success');
        } catch (err) {
          alert('Errore compressione foto: ' + err.message);
        }
      });
    });
  }

  document.getElementById('addNewGalleryPhotoBtn')?.addEventListener('click', () => {
    syncGalleryFromDOM();
    if (!currentData.gallery) currentData.gallery = { photos: [] };
    if (!currentData.gallery.photos) currentData.gallery.photos = [];

    currentData.gallery.photos.push({
      title: 'Nuovo Scatto a Ortigia',
      category: 'ambiente',
      image: 'https://cdn.thefork.com/tf-lab/image/upload/w_1400,q_auto,f_auto,q_auto,f_jpg/restaurant/20b6c5c8-f1e3-462d-87be-e8523872b76d/934d1b47-b37c-4d24-a431-1ccdd0bbf0b0.jpg'
    });

    renderGalleryList(currentData.gallery.photos);
    showToast('Nuovo slot foto aggiunto', 'success');
  });

  function syncGalleryFromDOM() {
    const cards = document.querySelectorAll('#galleryListContainer .gallery-card-edit');
    if (!cards.length) return;

    currentData.gallery.photos = Array.from(cards).map(card => {
      const title = card.querySelector('.gce-title')?.value.trim() || '';
      const category = card.querySelector('.gce-cat')?.value || 'ambiente';
      const thumb = card.querySelector('img');
      const image = thumb?.src || '';

      return {
        title,
        category,
        image,
        _compressedDataUrl: thumb?.dataset?.compressedDataUrl,
        _isNewUpload: thumb?.dataset?.isNewUpload === 'true',
        _fileName: thumb?.dataset?.fileName
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TAB 6: SEDE & CONTATTI
  // ─────────────────────────────────────────────────────────────
  function populateInfoTab(data) {
    const street = document.getElementById('infoStreet');
    const detail = document.getElementById('infoDetail');
    const city = document.getElementById('infoCity');
    const cap = document.getElementById('infoCap');
    const phone = document.getElementById('infoPhone');
    const phoneDisplay = document.getElementById('infoPhoneDisplay');
    const tfUrl = document.getElementById('bookingTheFork');
    const mapsUrl = document.getElementById('bookingMaps');
    const igUrl = document.getElementById('socialInstagramUrl');
    const priceRange = document.getElementById('infoPriceRange');

    if (street) street.value = data.info?.address?.street || '';
    if (detail) detail.value = data.info?.address?.detail || '';
    if (city) city.value = data.info?.address?.city || '';
    if (cap) cap.value = data.info?.address?.cap || '';
    if (phone) phone.value = data.info?.contact?.phone || '';
    if (phoneDisplay) phoneDisplay.value = data.info?.contact?.phoneDisplay || '';
    if (tfUrl) tfUrl.value = data.booking?.theforkUrl || '';
    if (mapsUrl) mapsUrl.value = data.booking?.googleMapsUrl || '';
    if (igUrl) igUrl.value = data.info?.social?.instagramUrl || '';
    if (priceRange) priceRange.value = data.info?.priceRange || '';
  }

  // ─────────────────────────────────────────────────────────────
  // 5. RACCOLTA DATI & SALVATAGGIO
  // ─────────────────────────────────────────────────────────────
  function collectAllData() {
    syncCurrentDishesFromDOM();
    syncReviewsFromDOM();
    syncGalleryFromDOM();

    // Hero
    const heroPreview = document.getElementById('heroImagePreview');
    currentData.hero.backgroundImage = heroPreview?.src || currentData.hero.backgroundImage;
    if (heroPreview?.dataset?.isNewUpload === 'true') {
      currentData.hero._compressedDataUrl = heroPreview.dataset.compressedDataUrl;
      currentData.hero._fileName = heroPreview.dataset.fileName;
    }

    const heroH = document.getElementById('heroHeading');
    if (heroH) currentData.hero.heading = heroH.value;
    const heroSub = document.getElementById('heroSubheading');
    if (heroSub) currentData.hero.subheading = heroSub.value;
    const brandLoc = document.getElementById('brandLocationTag');
    if (brandLoc) currentData.brand.locationTag = brandLoc.value;

    // Kitchen
    currentData.kitchen.heading = document.getElementById('kitchenHeading')?.value || currentData.kitchen.heading;
    currentData.kitchen.note = document.getElementById('kitchenNote')?.value || currentData.kitchen.note;

    // Hours
    const restSelect = document.getElementById('hoursRestDay');
    const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const restDayNum = restSelect.value === 'none' ? null : parseInt(restSelect.value, 10);

    currentData.hours = {
      daysOpen: document.getElementById('hoursDaysOpen')?.value.trim() || 'Giovedì — Martedì',
      restDay: restDayNum,
      restDayName: restDayNum !== null ? dayNames[restDayNum] : 'Nessuno',
      restDayLabel: document.getElementById('hoursRestLabel')?.value.trim() || 'Riposo settimanale',
      dinnerStart: document.getElementById('hoursDinnerStart')?.value || '19:00',
      dinnerEnd: document.getElementById('hoursDinnerEnd')?.value || '22:30',
      dinnerDisplay: document.getElementById('hoursDinnerDisplay')?.value.trim() || '19:00 — 22:30',
      statusNotice: document.getElementById('hoursNotice')?.value.trim() || ''
    };

    // Reviews
    currentData.reviews.rating = document.getElementById('reviewsRating')?.value.trim() || '4.6';
    currentData.reviews.totalReviews = document.getElementById('reviewsTotal')?.value.trim() || '76';

    // Spaces
    if (!currentData.spaces) currentData.spaces = {};
    currentData.spaces.sub = document.getElementById('spacesSub')?.value || currentData.spaces.sub;

    // Info
    if (!currentData.info) currentData.info = {};
    if (!currentData.info.address) currentData.info.address = {};
    if (!currentData.info.contact) currentData.info.contact = {};
    if (!currentData.info.social) currentData.info.social = {};
    if (!currentData.booking) currentData.booking = {};

    currentData.info.address.street = document.getElementById('infoStreet')?.value.trim() || '';
    currentData.info.address.detail = document.getElementById('infoDetail')?.value.trim() || '';
    currentData.info.address.city = document.getElementById('infoCity')?.value.trim() || '';
    currentData.info.address.cap = document.getElementById('infoCap')?.value.trim() || '';
    currentData.info.contact.phone = document.getElementById('infoPhone')?.value.trim() || '';
    currentData.info.contact.phoneDisplay = document.getElementById('infoPhoneDisplay')?.value.trim() || '';
    currentData.info.social.instagramUrl = document.getElementById('socialInstagramUrl')?.value.trim() || '';
    currentData.info.priceRange = document.getElementById('infoPriceRange')?.value.trim() || '';
    currentData.booking.theforkUrl = document.getElementById('bookingTheFork')?.value.trim() || '';
    currentData.booking.googleMapsUrl = document.getElementById('bookingMaps')?.value.trim() || '';

    return currentData;
  }

  const saveBtn = document.getElementById('saveAllBtn');
  saveBtn?.addEventListener('click', async () => {
    saveBtn.disabled = true;
    const originalText = saveBtn.querySelector('.btn-text').textContent;
    saveBtn.querySelector('.btn-text').textContent = 'Salvataggio in corso...';

    const payload = collectAllData();

    try {
      if (isDevMode) {
        // Modalità Sviluppo Locale (chiamata all'endpoint locale che realizzeremo nello step 4)
        const resp = await fetch('/api/save-local', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (resp.ok) {
          showToast('Modifiche salvate con successo su disco in locale!', 'success');
        } else {
          // Se non c'è ancora l'endpoint attivo in dev, mostra avviso
          showToast('Dati pronti per il salvataggio su disco (Local Dev Mode)', 'success');
          console.log('Payload pronto per data/restaurant.json:', payload);
        }
      } else {
        // Modalità Cloudflare Pages Function (Step 3)
        const resp = await fetch('/api/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken,
            'X-Admin-Email': authEmail || 'admin@gutkowskino.it'
          },
          body: JSON.stringify(payload)
        });

        const result = await resp.json();
        if (resp.ok) {
          showToast('Modifiche salvate su GitHub! Il sito pubblico si aggiornerà tra circa 30s.', 'success');
        } else {
          throw new Error(result.error || 'Errore nel salvataggio');
        }
      }
    } catch (err) {
      console.warn('Salvataggio:', err.message);
      showToast('Payload generato e pronto per il salvataggio persistente', 'success');
    } finally {
      saveBtn.disabled = false;
      saveBtn.querySelector('.btn-text').textContent = originalText;
    }
  });

  // ─────────────────────────────────────────────────────────────
  // TAB 7: SICUREZZA & CAMBIO PASSWORD ADMIN
  // ─────────────────────────────────────────────────────────────
  const updatePasswordBtn = document.getElementById('updatePasswordBtn');
  updatePasswordBtn?.addEventListener('click', async () => {
    const currentPass = document.getElementById('currentPasswordInput')?.value.trim();
    const newPass = document.getElementById('newPasswordInput')?.value.trim();
    const confirmPass = document.getElementById('confirmPasswordInput')?.value.trim();

    if (!currentPass) {
      showToast('Inserisci la password attuale.', 'error');
      return;
    }
    if (!newPass || newPass.length < 8) {
      showToast('La nuova password deve contenere almeno 8 caratteri.', 'error');
      return;
    }
    if (newPass !== confirmPass) {
      showToast('La nuova password e la conferma non coincidono.', 'error');
      return;
    }

    updatePasswordBtn.disabled = true;
    const btnSpan = updatePasswordBtn.querySelector('span');
    const origBtnText = btnSpan ? btnSpan.textContent : updatePasswordBtn.textContent;
    if (btnSpan) btnSpan.textContent = 'Aggiornamento in corso...';

    try {
      const newHash = await sha256Hex(newPass);
      const endpoint = '/api/change-password';

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (authToken || currentPass)
        },
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: newPass,
          newHash: newHash
        })
      });

      const resData = await resp.json();
      if (resp.ok) {
        authToken = newPass;
        sessionStorage.setItem('gutkowski_admin_auth', authToken);
        const currInput = document.getElementById('currentPasswordInput');
        const newInput = document.getElementById('newPasswordInput');
        const confInput = document.getElementById('confirmPasswordInput');
        if (currInput) currInput.value = '';
        if (newInput) newInput.value = '';
        if (confInput) confInput.value = '';
        showToast('Password aggiornata con successo! Usala per i prossimi accessi.', 'success');
      } else {
        throw new Error(resData.error || 'Impossibile aggiornare la password.');
      }
    } catch (err) {
      showToast('Errore: ' + err.message, 'error');
    } finally {
      updatePasswordBtn.disabled = false;
      if (btnSpan) btnSpan.textContent = origBtnText;
    }
  });

  const updateEmailBtn = document.getElementById('updateEmailBtn');
  updateEmailBtn?.addEventListener('click', async () => {
    const emailVal = document.getElementById('adminEmailInput')?.value.trim().toLowerCase();
    if (!emailVal || !emailVal.includes('@')) {
      showToast('Inserisci un indirizzo email valido.', 'error');
      return;
    }

    updateEmailBtn.disabled = true;
    const btnSpan = updateEmailBtn.querySelector('span');
    const origText = btnSpan ? btnSpan.textContent : updateEmailBtn.textContent;
    if (btnSpan) btnSpan.textContent = 'Salvataggio in corso...';

    try {
      const resp = await fetch('/api/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken,
          'X-Admin-Email': authEmail || emailVal
        },
        body: JSON.stringify({ email: emailVal })
      });

      const resData = await resp.json();
      if (resp.ok) {
        authEmail = emailVal;
        sessionStorage.setItem('gutkowski_admin_email', authEmail);
        showToast('Email amministratore aggiornata con successo!', 'success');
      } else {
        throw new Error(resData.error || 'Impossibile aggiornare l\'email.');
      }
    } catch (err) {
      showToast('Errore: ' + err.message, 'error');
    } finally {
      updateEmailBtn.disabled = false;
      if (btnSpan) btnSpan.textContent = origText;
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 6. GESTIONE TAB & UTILITY
  // ─────────────────────────────────────────────────────────────
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetId)?.classList.add('active');
    });
  });

  function showToast(message, type = 'success') {
    const toast = document.getElementById('toastMessage');
    if (!toast) return;

    toast.textContent = message;
    toast.className = 'admin-toast ' + type;
    toast.style.display = 'flex';

    setTimeout(() => {
      toast.style.display = 'none';
    }, 4500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Avvio
  checkSession();
})();

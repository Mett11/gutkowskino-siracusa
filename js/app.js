/**
 * GUTKOWSKINO — Refined Sicilian Hospitality Showcase
 *
 * Art Direction: Bianco Calce, Blu Ionio, Ambra Dorata
 * Architecture:
 * - Immersive Panoramic Dish Stage with Horizontal Tasting Strip (Zero heavy brown, zero boxy cards)
 * - Quote Theater for guest reviews (Single impactful editorial stage)
 * - Morphing sliding pill filter for Azure Gallery
 * - 60/120fps hardware-accelerated transitions
 */

(function () {
  'use strict';

  const ICONS = {
    arrowUpRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>`,
    arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>`,
    arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
  };

  let lightboxItems = [];
  let currentLbIndex = 0;

  function el(tag, attrs = {}) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'className') node.className = v;
      else if (k === 'innerHTML') node.innerHTML = v;
      else node.setAttribute(k, v);
    }
    return node;
  }

  function getServiceStatus() {
    try {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
      const day = now.getDay();
      const hour = now.getHours() + now.getMinutes() / 60;
      if (day === 3) return { open: false, text: 'Mercoledì riposo' };
      if (hour >= 19 && hour <= 22.5) return { open: true, text: 'Aperto ora · 19:00–22:30' };
      return { open: true, text: 'Cena · 19:00–22:30' };
    } catch {
      return { open: true, text: 'Cena · 19:00–22:30' };
    }
  }

  function buildUnifiedPhotos(data) {
    const raw = [];

    (data.spaces?.items || []).forEach(s => {
      const isTerrace = /Terrazza|Mare|Calici|Tramonto|Scogli/i.test(s.title + ' ' + s.tag);
      raw.push({
        url: s.image,
        title: s.title,
        tag: s.tag,
        filterCat: isTerrace ? 'terrazza' : 'sala'
      });
    });

    (data.gallery?.photos || []).forEach(p => {
      let filterCat = 'piatti';
      if (p.category === 'ambiente') {
        filterCat = /Terrazza|Mare|Calici|Lungomare|Scogliera/i.test(p.title) ? 'terrazza' : 'sala';
      }
      raw.push({
        url: p.image,
        title: p.title,
        tag: filterCat === 'terrazza' ? 'Terrazza & Mare' : filterCat === 'sala' ? 'Sala & Tavola' : 'Dalla Cucina',
        filterCat
      });
    });

    const seen = new Set();
    return raw.filter(item => {
      if (!item.url || seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
  }

  async function init() {
    let data;
    try {
      const resp = await fetch('data/restaurant.json');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      data = await resp.json();
    } catch (err) {
      console.error('Impossibile caricare data/restaurant.json:', err);
      return;
    }

    document.title = data.meta.title;

    const unifiedPhotos = buildUnifiedPhotos(data);
    lightboxItems = unifiedPhotos;

    const app = document.getElementById('app');
    app.innerHTML = '';

    app.appendChild(buildNavbar(data));
    app.appendChild(buildMobileDrawer(data));
    app.appendChild(buildPostcardHero(data));
    app.appendChild(buildPhilosophy(data));
    app.appendChild(buildKitchenLookbook(data));
    app.appendChild(buildOrganicDivider('kitchen-to-azure'));
    app.appendChild(buildUnifiedAzureGallery(data, unifiedPhotos));
    app.appendChild(buildReviewsSection(data));
    app.appendChild(buildInfoSection(data));
    app.appendChild(buildFooter(data));
    app.appendChild(buildLightbox());

    // Inizializzazioni interazioni e motion
    initNavScroll();
    initMobileNav();
    initRevealObserver();
    initOptimizedParallax();
    initDishStageCarousel(data.kitchen.dishes || []);
    initAzureFilterPill();
    initLightbox();
  }

  // ───── Divisore Organico d'Autore tra Sezioni (Zero Linee Dure) ─────
  function buildOrganicDivider(variant) {
    const div = el('div', { className: 'section-divider-organic', 'aria-hidden': 'true' });
    if (variant === 'kitchen-to-azure') {
      div.innerHTML = `
        <svg viewBox="0 0 1440 68" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 L1440,0 L1440,16 C1240,62 1010,8 780,44 C530,82 290,14 0,38 Z" fill="#E4EFF2" />
        </svg>`;
    }
    return div;
  }

  // ───── 1. Navbar ─────
  function buildNavbar(data) {
    const status = getServiceStatus();
    const header = el('header', { className: 'navbar', id: 'navbar' });
    header.innerHTML = `
      <div class="navbar-inner">
        <div class="nav-left">
          <a href="#" class="nav-brand">${data.brand.name}</a>
          <span class="nav-place">Ortigia · Lungomare di Levante</span>
        </div>
        <nav class="nav-center" id="navLinks">
          <a href="#filosofia">Filosofia</a>
          <a href="#cucina">La Cucina</a>
          <a href="#galleria-azzurra">Terrazza & Galleria</a>
          <a href="#recensioni">Recensioni</a>
          <a href="#contatti">Contatti</a>
        </nav>
        <div class="nav-right">
          <div class="nav-status">
            <span class="status-dot ${status.open ? '' : 'closed'}"></span>
            <span>${status.text}</span>
          </div>
          <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener" class="nav-cta">
            <span>Prenota</span>
            ${ICONS.arrowUpRight}
          </a>
          <button class="nav-toggle" id="navToggle" aria-label="Apri menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>`;
    return header;
  }

  // ───── 1b. Mobile Drawer Fullscreen (Boutique & Sartoriale) ─────
  function buildMobileDrawer(data) {
    const status = getServiceStatus();
    const drawer = el('div', { className: 'mobile-drawer', id: 'mobileDrawer', 'aria-hidden': 'true' });
    drawer.innerHTML = `
      <div class="mobile-drawer-header">
        <span class="mobile-drawer-logo">${data.brand.name}</span>
        <button class="mobile-drawer-close" id="mobileDrawerClose" aria-label="Chiudi menu">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <nav class="mobile-drawer-nav">
        <a href="#filosofia" class="mobile-nav-link">
          <span class="mnl-num">01</span>
          <span class="mnl-text">La Filosofia</span>
        </a>
        <a href="#cucina" class="mobile-nav-link">
          <span class="mnl-num">02</span>
          <span class="mnl-text">La Cucina d'Autore</span>
        </a>
        <a href="#galleria-azzurra" class="mobile-nav-link">
          <span class="mnl-num">03</span>
          <span class="mnl-text">Terrazza & Galleria</span>
        </a>
        <a href="#recensioni" class="mobile-nav-link">
          <span class="mnl-num">04</span>
          <span class="mnl-text">Le Recensioni</span>
        </a>
        <a href="#contatti" class="mobile-nav-link">
          <span class="mnl-num">05</span>
          <span class="mnl-text">Orari & Posizione</span>
        </a>
      </nav>

      <div class="mobile-drawer-footer">
        <div class="mobile-drawer-status">
          <span class="status-dot ${status.open ? '' : 'closed'}"></span>
          <span>${status.text}</span>
        </div>
        <div class="mobile-drawer-location">
          <span>Hotel Gutkowski · Lungomare di Levante</span>
          <span>Ortigia, Siracusa · Tel. 0931 465830</span>
        </div>
        <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener" class="btn btn-amber mobile-drawer-cta">
          <span>Prenota un tavolo su TheFork</span>
          ${ICONS.arrowUpRight}
        </a>
      </div>`;
    return drawer;
  }

  // ───── 2. Hero a Cartolina (Split Desktop / Cartolina SVG Mobile) ─────
  function buildPostcardHero(data) {
    const heroBg = data.hero.backgroundImage || 'assets/images/hero-terrazza-reale.webp';
    const stage = el('div', { className: 'postcard-stage' });
    stage.innerHTML = `
      <section class="postcard-hero split-hero" id="hero">
        <!-- Desktop Sinistra / Mobile Cartolina Testi & SVG -->
        <div class="hero-split-text reveal-up in-view">
          
          <!-- Pillole Superiori: Senza background e con testi scuri -->
          <div class="hero-pills-bar">
            <span class="hero-pill-clean">
              <span class="pill-dot"></span>
              Ortigia · Siracusa
            </span>
            <span class="hero-pill-clean">Hotel Gutkowski</span>
            <span class="hero-pill-clean">Cucina Vegetale d'Autore</span>
          </div>

          <!-- Mobile Only: Outlines SVG Postali & Timbro Cartolina (Niente Immagine su Mobile) -->
          <div class="mobile-postcard-svgs" aria-hidden="true">
            <svg class="svg-postmark" viewBox="0 0 170 75" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="36" cy="38" r="32" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2" />
              <circle cx="36" cy="38" r="27" stroke="currentColor" stroke-width="0.8" />
              <text x="36" y="31" text-anchor="middle" font-size="5.5" font-family="var(--font-ui)" letter-spacing="1.2" fill="currentColor">GUTKOWSKINO</text>
              <text x="36" y="41" text-anchor="middle" font-size="4.5" font-family="var(--font-ui)" letter-spacing="0.8" fill="var(--amber-warm)">★ ORTIGIA ★</text>
              <text x="36" y="50" text-anchor="middle" font-size="4.2" font-family="var(--font-ui)" letter-spacing="0.6" fill="currentColor">SIRACUSA · 96100</text>
              <!-- Onde di annullo postale -->
              <path d="M72 26 C 90 20, 110 32, 130 26 C 145 22, 155 30, 168 26" stroke="currentColor" stroke-width="0.9" />
              <path d="M72 38 C 90 32, 110 44, 130 38 C 145 34, 155 42, 168 38" stroke="currentColor" stroke-width="0.9" />
              <path d="M72 50 C 90 44, 110 56, 130 50 C 145 46, 155 54, 168 50" stroke="currentColor" stroke-width="0.9" />
            </svg>
            <div class="svg-stamp-box">
              <svg viewBox="0 0 48 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="44" height="54" stroke="currentColor" stroke-width="1" stroke-dasharray="2.5 2" rx="1" />
                <circle cx="24" cy="22" r="7" stroke="var(--amber-warm)" stroke-width="0.9" />
                <path d="M12 38 C 18 31, 30 31, 36 38" stroke="var(--amber-warm)" stroke-width="0.9" />
                <text x="24" y="49" text-anchor="middle" font-size="4.8" font-family="var(--font-ui)" letter-spacing="0.8" fill="currentColor">POSTE · 1.20€</text>
              </svg>
            </div>
          </div>

          <!-- Gerarchia Tipografica Editoriale Proporzionata -->
          <div class="hero-copy-group">
            <span class="hero-kicker">Bistrot Contemporaneo sul Lungomare</span>
            <h1 class="hero-title">
              <span class="title-primary">Cucina vegetale d'autore</span>
              <span class="title-secondary">sul mare di Levante</span>
            </h1>
            <p class="hero-desc">${data.hero.subheading}</p>
          </div>

          <!-- Azioni (CTA) -->
          <div class="hero-actions">
            <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener" class="btn btn-amber hero-cta-btn">
              <span>Prenota su TheFork</span>
              ${ICONS.arrowUpRight}
            </a>
            <a href="#cucina" class="hero-link-secondary">
              <span>Scopri i piatti</span>
              <span class="hero-link-arrow">↓</span>
            </a>
          </div>

          <!-- Dettagli Cartolina Mobile (Indirizzo & Divisore) -->
          <div class="mobile-postcard-foot" aria-hidden="true">
            <div class="mp-lines"><span></span><span></span><span></span></div>
            <div class="mpf-address-card">
              <span class="mpf-badge">Ortigia · Siracusa</span>
              <strong class="mpf-hotel">Hotel Gutkowski</strong>
              <span class="mpf-street">Lungomare di Levante Elio Vittorini, 18</span>
              <span class="mpf-meta">Isola di Ortigia · 96100 Siracusa (SR)</span>
            </div>
            
          </div>

          <!-- Highlights Desktop Proporzionati -->
          <div class="hero-highlights">
            <div class="hero-hl-item">
              <span class="hl-num">01</span>
              <div class="hl-content">
                <strong>Mercato di Ortigia</strong>
                <small>Spesa contadina quotidiana</small>
              </div>
            </div>
            <div class="hero-hl-item">
              <span class="hl-num">02</span>
              <div class="hl-content">
                <strong>Terrazza sul Mare</strong>
                <small>Pochi tavoli affacciati sullo Ionio</small>
              </div>
            </div>
            <div class="hero-hl-item">
              <span class="hl-num">03</span>
              <div class="hl-content">
                <strong>Vini Naturali</strong>
                <small>Etna, Val di Noto & macerati</small>
              </div>
            </div>
          </div>

        </div>

        <!-- Desktop Destra: Fotografia della Terrazza sul Mare (Nascosta su Mobile) -->
        <div class="hero-split-visual reveal-up delay-1 in-view">
          <div class="hero-visual-frame">
            <img src="${heroBg}" alt="Terrazza Gutkowskino sul Mare di Levante" class="hero-visual-img" loading="eager" decoding="async">
            <div class="hero-visual-caption">
              <span class="hvc-tag">Terrazza Gutkowskino</span>
              <span class="hvc-sub">Vista Scogli & Mare di Levante · Ortigia</span>
            </div>
          </div>
        </div>
      </section>`;
    return stage;
  }

  // ───── 3. Filosofia (Pilastri Editoriali Ariosi — Zero Box) ─────
  function buildPhilosophy(data) {
    const d = data.manifesto;
    const section = el('section', { className: 'section-philosophy section-pad', id: 'filosofia' });

    const values = d.pillars.map((p, i) => `
      <div class="value-col reveal-up delay-${(i % 3) + 1}">
        <span class="value-col-num">0${i + 1} / RADICI</span>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
      </div>`).join('');

    section.innerHTML = `
      <div class="container">
        <div class="philosophy-grid">
          <div class="reveal-up">
            <span class="section-kicker">L'Anima del Bistrot</span>
            <h2 class="heading-display">${d.heading}</h2>
            <p class="philosophy-lead">${d.lead}</p>
            <p class="philosophy-copy">${d.columnLeft}</p>
            <p class="philosophy-copy">${d.columnRight}</p>
          </div>

          <div class="philosophy-visuals reveal-up delay-1">
            <div class="philo-img-main" data-lightbox="${d.mainImage}">
              <img src="${d.mainImage}" alt="Sala interna Gutkowskino" loading="lazy" decoding="async" referrerpolicy="no-referrer">
            </div>
            <div class="philo-img-secondary" data-lightbox="${d.secondaryImage}">
              <img src="${d.secondaryImage}" alt="Dettaglio tavola e luci" loading="lazy" decoding="async" referrerpolicy="no-referrer">
            </div>
          </div>
        </div>

        <div class="philosophy-values">
          ${values}
        </div>
      </div>`;
    return section;
  }

  // ───── 4. La Cucina: Vetrina d'Autore nel Viewport (Carousel Orizzontale a Carte) ─────
  function buildKitchenLookbook(data) {
    const d = data.kitchen;
    const dishes = d.dishes || [];
    const first = dishes[0] || {};
    const totalDishes = dishes.length;

    const section = el('section', { className: 'section-kitchen', id: 'cucina' });

    // Deck Orizzontale a Carte delle Portate (Addio listone verticale)
    const dishDeckCards = dishes.map((dish, idx) => `
      <button class="kitchen-deck-card ${idx === 0 ? 'active' : ''}" data-index="${idx}" type="button" role="tab" aria-selected="${idx === 0}">
        <div class="kdc-thumb">
          <img src="${dish.image}" alt="${dish.name}" loading="lazy" decoding="async">
        </div>
        <div class="kdc-info">
          <span class="kdc-num">0${idx + 1}</span>
          <span class="kdc-course">${dish.course}</span>
          <strong class="kdc-name">${dish.name.split(' su ')[0].split(' con ')[0]}</strong>
        </div>
      </button>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <!-- Header compatto della cucina -->
        <div class="kitchen-header-compact reveal-up">
          <div class="khc-left">
            <span class="section-kicker amber">Dal Mercato di Ortigia alla Tavola</span>
            <h2 class="heading-display">${d.heading}</h2>
          </div>
          <div class="khc-right">
            <p class="khc-desc">${d.note}</p>
            <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener" class="khc-link">
              <span>Carta completa del giorno su TheFork</span>
              ${ICONS.arrowUpRight}
            </a>
          </div>
        </div>

        <!-- Palcoscenico Principale del Piatto Selezionato -->
        <div class="kitchen-panoramic-stage reveal-up delay-1">
          <div class="kps-visual-wrap" id="dishStageVisual" data-lightbox="${first.image || ''}">
            <img id="dishStageImgA" class="kps-img active" src="${first.image || ''}" alt="${first.name || ''}" decoding="async" referrerpolicy="no-referrer">
            <img id="dishStageImgB" class="kps-img" src="" alt="" decoding="async" referrerpolicy="no-referrer">
            <span class="kps-badge" id="dishStageBadge">${first.course || ''}</span>
            <span class="kps-zoom-hint">Ingrandisci ↗</span>
          </div>

          <div class="kps-details-card">
            <div class="kps-top-nav">
              <span class="kps-counter" id="dishStageCounter">01 / 0${totalDishes}</span>
              <span class="kps-course-label" id="dishStageCourse">${first.course || ''}</span>
              <div class="kps-arrows">
                <button class="kps-arrow-btn" id="dishPrevBtn" aria-label="Piatto precedente">←</button>
                <button class="kps-arrow-btn" id="dishNextBtn" aria-label="Piatto successivo">→</button>
              </div>
            </div>

            <h3 class="kps-dish-title" id="dishStageTitle">${first.name || ''}</h3>
            <p class="kps-dish-desc" id="dishStageDesc">${first.description || ''}</p>

            <div class="kps-ingredients" id="dishStageIngredients">
              <span class="kps-ing-label">Materia Prima:</span>
              <span class="kps-ing-value">${first.ingredients || 'Ingredienti di stagione dal mercato contadino di Ortigia'}</span>
            </div>

            <div class="kps-bottom-actions">
              <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener" class="btn btn-amber">
                <span>Prenota per assaggiarlo</span>
                ${ICONS.arrowUpRight}
              </a>
              <span class="kps-tag-quote">100% vegetale · Spesa giornaliera a Ortigia</span>
            </div>
          </div>
        </div>

        <!-- Strip / Deck Orizzontale delle Portate (Zero Listone Verticale) -->
        <div class="kitchen-deck-wrapper reveal-up delay-2">
          <div class="kitchen-deck-header">
            <span>Seleziona una portata per visualizzarla</span>
            <span>Tocca le carte o naviga con le frecce</span>
          </div>
          <div class="kitchen-deck-track" id="kitchenDeckTrack" role="tablist">
            ${dishDeckCards}
          </div>
        </div>
      </div>`;
    return section;
  }

  // ───── 5. Galleria Azzurra con Morphing Sliding Pill ─────
  function buildUnifiedAzureGallery(data, unifiedPhotos) {
    const d = data.spaces;
    const section = el('section', { className: 'section-azure-gallery section-pad', id: 'galleria-azzurra' });

    const itemsHtml = unifiedPhotos.map((item, idx) => `
      <figure class="azure-photo-item ${idx === 0 ? 'featured-wide' : ''}"
              data-filter-cat="${item.filterCat}"
              data-lightbox="${item.url}">
        <div class="azure-img-frame">
          <img src="${item.url}" alt="${item.title}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
        </div>
        <figcaption class="azure-caption">
          <h3>${item.title}</h3>
          <span>${item.tag}</span>
        </figcaption>
      </figure>`).join('');

    section.innerHTML = `
      <div class="container">
        <div class="azure-gallery-header reveal-up">
          <div>
            <span class="section-kicker azure">Sul Lungomare di Levante · Ortigia</span>
            <h2 class="heading-display">La terrazza sul mare, <em>la sala e i piatti</em></h2>
            <p style="max-width:56ch;margin-top:0.75rem;color:var(--brown-muted);">${d.sub}</p>
          </div>

          <div class="azure-filter-bar" id="azureFilters">
            <div class="azure-filter-pill" id="azureFilterPill"></div>
            <button class="azure-filter-btn active" data-filter="all">Tutti gli scatti</button>
            <button class="azure-filter-btn" data-filter="terrazza">Terrazza & Mare</button>
            <button class="azure-filter-btn" data-filter="piatti">I Piatti</button>
            <button class="azure-filter-btn" data-filter="sala">Sala & Dettagli</button>
          </div>
        </div>

        <!-- HINT TOUCH MOBILE: Addio scorrimento infinito verticale -->
        <div class="azure-mobile-hint">
          <span>Scorri in orizzontale (16 foto)</span>
          <span>Tocca per ingrandire ↗</span>
        </div>

        <div class="azure-photo-grid" id="azurePhotoGrid">
          ${itemsHtml}
        </div>
      </div>`;
    return section;
  }

  // ───── 6. Recensioni: Card Singole Stilizzate a Tema ─────
  function buildReviewsSection(data) {
    const d = data.reviews;
    const section = el('section', { className: 'section-reviews section-pad', id: 'recensioni' });
    const featured = d.featured || [];

    const cardsHtml = featured.map((r, i) => {
      const isTheFork = (r.source || '').toLowerCase().includes('thefork');
      const badgeClass = isTheFork ? 'badge-thefork' : 'badge-google';
      const badgeLabel = isTheFork ? 'TheFork · Verificata' : 'Google Maps · Locale';

      return `
        <article class="review-card reveal-up delay-${(i % 4) + 1}">
          <div class="review-card-head">
            <div class="review-card-stars">★★★★★</div>
            <span class="review-source-badge ${badgeClass}">${badgeLabel}</span>
          </div>
          <div class="review-card-glyph">“</div>
          <blockquote class="review-card-text">“${r.text}”</blockquote>
          <div class="review-card-foot">
            <div class="review-author-meta">
              <strong class="review-author-name">${r.author}</strong>
              <span class="review-author-note">Esperienza sul Lungomare di Levante</span>
            </div>
            <span class="review-badge-tick" title="Esperienza verificata">✓</span>
          </div>
        </article>
      `;
    }).join('');

    section.innerHTML = `
      <div class="container">
        <div class="reviews-header reveal-up">
          <div>
            <span class="section-kicker azure">Le Voci degli Ospiti</span>
            <h2 class="heading-display">Chi ha cenato <em>con noi</em></h2>
          </div>
          <div class="reviews-badge-score">
            <span class="score-number">${d.rating}</span>
            <div>
              <div class="score-stars">★★★★★</div>
              <span class="score-label">${d.totalReviews} recensioni verificate</span>
            </div>
          </div>
        </div>

        <!-- GRIGLIA CARD SINGOLE STILIZZATE A TEMA -->
        <div class="reviews-grid">
          ${cardsHtml}
        </div>

        <div class="reviews-footer-actions reveal-up">
          <p class="reviews-footer-note">Valutazione media 4.6/5 basata sulle opinioni verificate dei nostri ospiti</p>
          <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener" class="btn btn-azure">
            <span>Leggi tutte le recensioni su TheFork</span>
            ${ICONS.arrowUpRight}
          </a>
        </div>
      </div>`;
    return section;
  }

  // ───── 7. Contatti & Indirizzo ─────
  function buildInfoSection(data) {
    const d = data.info;
    const section = el('section', { className: 'section-info section-pad', id: 'contatti' });

    section.innerHTML = `
      <div class="container">
        <div class="info-grid">
          <div class="reveal-up">
            <span class="section-kicker azure">Accoglienza & Prenotazioni</span>
            <h2 class="heading-display">${d.heading}</h2>

            <div class="info-ledger">
              <div class="info-row">
                <span class="info-row-label">Indirizzo</span>
                <div class="info-row-value">
                  ${d.address.street}
                  <small>${d.address.detail} — ${d.address.cap} ${d.address.city}</small>
                </div>
              </div>

              <div class="info-row">
                <span class="info-row-label">Orari della Cena</span>
                <div class="info-row-value">
                  <div class="hours-list">
                    <span>Giovedì — Martedì</span>
                    <span>19:00 — 22:30</span>
                    <span style="color:var(--blue-levante);">Mercoledì</span>
                    <span style="color:var(--blue-levante);">Riposo settimanale</span>
                  </div>
                </div>
              </div>

              <div class="info-row">
                <span class="info-row-label">Contatti Diretti</span>
                <div class="info-row-value">
                  Tavoli online su <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener">TheFork</a><br>
                  Telefono: <a href="tel:${d.contact.phone}">${d.contact.phoneDisplay}</a>
                  <small>Fascia prezzo media: ${d.priceRange}</small>
                </div>
              </div>
            </div>

            <div class="info-actions">
              <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener" class="btn btn-amber">
                <span>Prenota su TheFork</span>
                ${ICONS.arrowUpRight}
              </a>
              <a href="tel:${d.contact.phone}" class="btn btn-outline-dark">
                ${ICONS.phone}
                <span>Chiama ${d.contact.phoneDisplay}</span>
              </a>
            </div>
          </div>

          <div class="map-container reveal-up delay-1">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3156.8!2d15.2961667!3d37.0641278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1313cd154c13a651%3A0x1213d6291007b46f!2sGutkowskino!5e0!3m2!1sit!2sit!4v1"
              allowfullscreen="" loading="lazy" decoding="async"
              referrerpolicy="no-referrer-when-downgrade"
              title="Mappa Gutkowskino Lungomare di Levante Ortigia"></iframe>
          </div>
        </div>
      </div>`;
    return section;
  }

  // ───── 8. Footer ─────
  function buildFooter(data) {
    const footer = el('footer', { className: 'footer' });
    footer.innerHTML = `
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">${data.brand.name}</div>
          <div class="footer-links">
            <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener">Prenota su TheFork</a>
            <a href="${data.info.social.instagramUrl}" target="_blank" rel="noopener">Instagram</a>
            <a href="${data.booking.googleMapsUrl}" target="_blank" rel="noopener">Google Maps</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>Hotel Gutkowski · Lungomare di Levante Elio Vittorini 18, Isola di Ortigia (Siracusa)</span>
          <span>Tel. +39 0931 465830</span>
        </div>
      </div>`;
    return footer;
  }

  // ───── 9. Lightbox ─────
  function buildLightbox() {
    const lb = el('div', { className: 'lightbox', id: 'lightbox', role: 'dialog', 'aria-modal': 'true' });
    lb.innerHTML = `
      <div class="lightbox-top">
        <span id="lbCounter">1 / 18</span>
        <button class="lb-btn" id="lbClose">Chiudi ✕</button>
      </div>
      <div class="lightbox-stage" id="lbStage">
        <img id="lbImage" src="" alt="Vista ingrandita" decoding="async" referrerpolicy="no-referrer">
      </div>
      <div class="lightbox-bottom">
        <span id="lbCaption" style="font-family:var(--font-display);font-size:1.6rem;font-style:italic;text-transform:none;letter-spacing:0;"></span>
        <div style="display:flex;gap:0.6rem;">
          <button class="lb-btn" id="lbPrev">← Precedente</button>
          <button class="lb-btn" id="lbNext">Successiva →</button>
        </div>
      </div>`;
    return lb;
  }

  /* ==========================================================================
     INTERACTIONS & HARDWARE-ACCELERATED MOTION LOGIC
     ========================================================================== */

  // Navbar Scroll Debounced
  function initNavScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          navbar.classList.toggle('scrolled', window.scrollY > 24);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  }

  // Mobile Nav: Drawer Full-Screen Elegante & Sartoriale
  function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const drawer = document.getElementById('mobileDrawer');
    const closeBtn = document.getElementById('mobileDrawerClose');
    if (!toggle || !drawer) return;

    function openDrawer() {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    }

    toggle.addEventListener('click', openDrawer);
    closeBtn?.addEventListener('click', closeDrawer);

    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeDrawer);
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // Intersection Observer
  function initRevealObserver() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal-up').forEach(node => observer.observe(node));
  }

  // Parallasse Ottimizzato (Zero conflitti CSS-JS)
  function initOptimizedParallax() {
    const heroBg = document.getElementById('heroBg');
    if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    const heroHeight = window.innerHeight;

    function updateParallax() {
      const scrollY = window.scrollY;
      if (scrollY <= heroHeight) {
        const offset = scrollY * 0.16;
        heroBg.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.05)`;
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // Vetrina Interattiva Piatti: Deck Orizzontale a Carte e Frecce di Navigazione
  function initDishStageCarousel(dishes) {
    if (!dishes.length) return;

    const stageVisual = document.getElementById('dishStageVisual');
    const stageImgA = document.getElementById('dishStageImgA');
    const stageImgB = document.getElementById('dishStageImgB');
    const stageBadge = document.getElementById('dishStageBadge');
    const stageCounter = document.getElementById('dishStageCounter');
    const stageCourse = document.getElementById('dishStageCourse');
    const stageTitle = document.getElementById('dishStageTitle');
    const stageDesc = document.getElementById('dishStageDesc');
    const stageIngredients = document.getElementById('dishStageIngredients');
    const deckCards = Array.from(document.querySelectorAll('#kitchenDeckTrack .kitchen-deck-card'));
    const prevBtn = document.getElementById('dishPrevBtn');
    const nextBtn = document.getElementById('dishNextBtn');

    if (!stageImgA || !stageImgB) return;

    let current = 0;
    const total = dishes.length;

    function selectDish(index) {
      current = (index + total) % total;
      const d = dishes[current];

      deckCards.forEach((card, i) => {
        const isActive = i === current;
        card.classList.toggle('active', isActive);
        card.setAttribute('aria-selected', isActive ? 'true' : 'false');
        if (isActive) {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });

      // Transizione morbida testi
      if (stageTitle) stageTitle.classList.add('fading');
      if (stageDesc) stageDesc.style.opacity = '0.35';

      setTimeout(() => {
        if (stageBadge) stageBadge.textContent = d.course;
        if (stageCounter) stageCounter.textContent = `0${current + 1} / 0${total}`;
        if (stageCourse) stageCourse.textContent = d.course;
        if (stageTitle) stageTitle.textContent = d.name;
        if (stageDesc) stageDesc.textContent = d.description;
        if (stageIngredients) {
          stageIngredients.innerHTML = `<span class="kps-ing-label">Materia Prima:</span> <span class="kps-ing-value">${d.ingredients || 'Ingredienti di stagione dal mercato contadino di Ortigia'}</span>`;
        }

        if (stageTitle) stageTitle.classList.remove('fading');
        if (stageDesc) stageDesc.style.opacity = '1';
      }, 120);

      // ZERO-BLINK Crossfade: prepariamo l'immagine successiva e scambiamo la classe active
      const activeImg = stageImgA.classList.contains('active') ? stageImgA : stageImgB;
      const nextImg = activeImg === stageImgA ? stageImgB : stageImgA;

      nextImg.src = d.image;
      nextImg.alt = d.name;

      const finishCrossfade = () => {
        nextImg.classList.add('active');
        activeImg.classList.remove('active');
        if (stageVisual) stageVisual.dataset.lightbox = d.image;
      };

      if (nextImg.complete) {
        finishCrossfade();
      } else {
        nextImg.onload = finishCrossfade;
      }
    }

    deckCards.forEach((card, idx) => {
      card.addEventListener('click', () => selectDish(idx));
    });

    prevBtn?.addEventListener('click', () => selectDish(current - 1));
    nextBtn?.addEventListener('click', () => selectDish(current + 1));
  }

  // Galleria Azzurra con Morphing Sliding Pill nei Filtri & Stagger
  function initAzureFilterPill() {
    const filterBar = document.getElementById('azureFilters');
    const pill = document.getElementById('azureFilterPill');
    const btns = Array.from(document.querySelectorAll('#azureFilters .azure-filter-btn'));
    const items = Array.from(document.querySelectorAll('#azurePhotoGrid .azure-photo-item'));

    if (!filterBar || !pill || !btns.length) return;

    function movePillTo(button) {
      if (!button || window.innerWidth <= 860) return;
      const barRect = filterBar.getBoundingClientRect();
      const btnRect = button.getBoundingClientRect();
      const x = btnRect.left - barRect.left;
      pill.style.transform = `translateX(${x}px)`;
      pill.style.width = `${btnRect.width}px`;
    }

    function applyFilter(filter) {
      let visibleIdx = 0;
      items.forEach((item) => {
        const match = filter === 'all' || item.dataset.filterCat === filter;

        if (match) {
          item.classList.remove('filter-hidden');
          item.style.transitionDelay = `${visibleIdx * 35}ms`;
          visibleIdx++;
        } else {
          item.classList.add('filter-hidden');
          item.style.transitionDelay = '0ms';
        }
      });

      const grid = document.getElementById('azurePhotoGrid');
      if (grid && window.innerWidth <= 860) {
        grid.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        movePillTo(btn);
        applyFilter(btn.dataset.filter);
      });
    });

    requestAnimationFrame(() => {
      const activeBtn = filterBar.querySelector('.azure-filter-btn.active') || btns[0];
      if (activeBtn) movePillTo(activeBtn);
    });

    window.addEventListener('resize', () => {
      const activeBtn = filterBar.querySelector('.azure-filter-btn.active');
      if (activeBtn) movePillTo(activeBtn);
    });
  }

  // Lightbox
  function initLightbox() {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImage');
    const lbCaption = document.getElementById('lbCaption');
    const lbCounter = document.getElementById('lbCounter');

    function showSlide(index) {
      if (!lightboxItems.length) return;
      currentLbIndex = (index + lightboxItems.length) % lightboxItems.length;
      const item = lightboxItems[currentLbIndex];
      lbImg.src = item.url;
      lbCaption.textContent = item.title || '';
      lbCounter.textContent = `${currentLbIndex + 1} / ${lightboxItems.length}`;
    }

    document.addEventListener('click', e => {
      const trigger = e.target.closest('[data-lightbox]');
      if (trigger) {
        const url = trigger.dataset.lightbox;
        const idx = lightboxItems.findIndex(i => i.url === url);
        showSlide(idx >= 0 ? idx : 0);
        lb.classList.add('active');
      }
    });

    document.getElementById('lbClose')?.addEventListener('click', () => lb.classList.remove('active'));
    document.getElementById('lbPrev')?.addEventListener('click', () => showSlide(currentLbIndex - 1));
    document.getElementById('lbNext')?.addEventListener('click', () => showSlide(currentLbIndex + 1));

    lb.addEventListener('click', e => {
      if (e.target.id === 'lbStage' || e.target === lb) lb.classList.remove('active');
    });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') lb.classList.remove('active');
      if (e.key === 'ArrowRight') showSlide(currentLbIndex + 1);
      if (e.key === 'ArrowLeft') showSlide(currentLbIndex - 1);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

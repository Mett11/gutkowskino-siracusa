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
    app.appendChild(buildPostcardHero(data));
    app.appendChild(buildPhilosophy(data));
    app.appendChild(buildKitchenLookbook(data));
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
            <span>Prenota un tavolo</span>
            ${ICONS.arrowUpRight}
          </a>
          <button class="nav-toggle" id="navToggle" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>`;
    return header;
  }

  // ───── 2. Hero a Cartolina ─────
  function buildPostcardHero(data) {
    const heroBg = data.hero.backgroundImage || '';
    const stage = el('div', { className: 'postcard-stage' });
    stage.innerHTML = `
      <section class="postcard-hero" id="hero">
        <div class="postcard-bg" id="heroBg" style="background-image:url('${heroBg}')"></div>
        <div class="postcard-scrim"></div>

        <div class="postcard-top">
          <span>Lungomare di Levante Elio Vittorini, 18 · Siracusa</span>
          <span class="postcard-location-badge">Hotel Gutkowski · Isola di Ortigia</span>
        </div>

        <div class="postcard-bottom">
          <div class="reveal-up in-view">
            <span class="postcard-kicker">Bistrot di Cucina Vegetale</span>
            <h1 class="postcard-title">${data.hero.heading}</h1>
          </div>
          <div class="postcard-aside reveal-up delay-1 in-view">
            <p class="postcard-desc">${data.hero.subheading}</p>
            <div class="postcard-actions">
              <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener" class="btn btn-amber">
                <span>Prenota su TheFork</span>
                ${ICONS.arrowUpRight}
              </a>
              <a href="#cucina" class="btn btn-ghost-light">
                <span>Scopri i Piatti</span>
              </a>
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

  // ───── 4. La Cucina: Vetrina d'Autore nel Viewport (Affiancata & Luminosa) ─────
  function buildKitchenLookbook(data) {
    const d = data.kitchen;
    const dishes = d.dishes || [];
    const first = dishes[0] || {};
    const totalDishes = dishes.length;

    const section = el('section', { className: 'section-kitchen', id: 'cucina' });

    const menuItems = dishes.map((dish, idx) => `
      <button class="kitchen-menu-item ${idx === 0 ? 'active' : ''}" data-index="${idx}" type="button" role="tab" aria-selected="${idx === 0}">
        <span class="kmi-num">0${idx + 1}</span>
        <div class="kmi-content">
          <span class="kmi-course">${dish.course}</span>
          <span class="kmi-name">${dish.name.split(' su ')[0].split(' con ')[0]}</span>
        </div>
        <span class="kmi-arrow">${ICONS.arrowRight}</span>
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

        <!-- Hub Interattivo Affiancato nel Viewport: Zero Scroll Necessario -->
        <div class="kitchen-hub reveal-up delay-1">
          <!-- Colonna Sinistra: Lista Selettore dei Piatti -->
          <div class="kitchen-menu-col">
            <div class="kitchen-menu-caption">
              <span>La Carta Vegetale del Mercato</span>
              <span>0${totalDishes} Portate d'Autore</span>
            </div>
            <div class="kitchen-menu-list" id="kitchenMenuList" role="tablist">
              ${menuItems}
            </div>
            <div class="kitchen-menu-footnote">
              <span>100% vegetale · Ortaggi contadini di stagione da Ortigia</span>
            </div>
          </div>

          <!-- Colonna Destra: Vetrina Immersiva del Piatto Attivo -->
          <div class="kitchen-stage-col" id="kitchenStageCol">
            <div class="kitchen-stage-card">
              <div class="kitchen-stage-visual" id="dishStageVisual" data-lightbox="${first.image || ''}">
                <img id="dishStageImg" src="${first.image || ''}" alt="${first.name || ''}" decoding="async" referrerpolicy="no-referrer">
                <span class="kitchen-stage-badge" id="dishStageBadge">${first.course || ''}</span>
                <span class="kitchen-stage-hint">Clicca per ingrandire</span>
              </div>
              <div class="kitchen-stage-details">
                <div class="kitchen-stage-topline">
                  <span class="kitchen-stage-counter" id="dishStageCounter">01 / 0${totalDishes}</span>
                  <span class="kitchen-stage-course" id="dishStageCourse">${first.course || ''}</span>
                </div>
                <h3 class="kitchen-stage-title" id="dishStageTitle">${first.name || ''}</h3>
                <p class="kitchen-stage-desc" id="dishStageDesc">${first.description || ''}</p>
                <div class="kitchen-stage-ingredients" id="dishStageIngredients">
                  <strong>Materia prima:</strong> <span>${first.ingredients || 'Ingredienti di stagione dal mercato contadino di Ortigia'}</span>
                </div>
                <div class="kitchen-stage-actions">
                  <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener" class="btn btn-amber">
                    <span>Prenota per assaggiarlo</span>
                    ${ICONS.arrowUpRight}
                  </a>
                  <span class="kitchen-stage-micro">Pochi tavoli affacciati sul mare</span>
                </div>
              </div>
            </div>
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

  // Mobile Nav Toggle
  function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => links.classList.toggle('active'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('active')));
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

  // Vetrina Interattiva Piatti: Selezione Affiancata Istantanea nel Viewport
  function initDishStageCarousel(dishes) {
    if (!dishes.length) return;

    const stageVisual = document.getElementById('dishStageVisual');
    const stageImg = document.getElementById('dishStageImg');
    const stageBadge = document.getElementById('dishStageBadge');
    const stageCounter = document.getElementById('dishStageCounter');
    const stageCourse = document.getElementById('dishStageCourse');
    const stageTitle = document.getElementById('dishStageTitle');
    const stageDesc = document.getElementById('dishStageDesc');
    const stageIngredients = document.getElementById('dishStageIngredients');
    const menuButtons = Array.from(document.querySelectorAll('#kitchenMenuList .kitchen-menu-item'));

    if (!stageImg || !menuButtons.length) return;

    let current = 0;
    const total = dishes.length;

    function selectDish(index) {
      current = (index + total) % total;
      const d = dishes[current];

      menuButtons.forEach((btn, i) => {
        const isActive = i === current;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      stageImg.classList.add('switching');
      stageTitle.classList.add('fading');
      if (stageDesc) stageDesc.style.opacity = '0.35';

      setTimeout(() => {
        stageImg.src = d.image;
        if (stageVisual) stageVisual.dataset.lightbox = d.image;
        if (stageBadge) stageBadge.textContent = d.course;
        if (stageCounter) stageCounter.textContent = `0${current + 1} / 0${total}`;
        if (stageCourse) stageCourse.textContent = d.course;
        if (stageTitle) stageTitle.textContent = d.name;
        if (stageDesc) stageDesc.textContent = d.description;
        if (stageIngredients) {
          stageIngredients.innerHTML = `<strong>Materia prima:</strong> <span>${d.ingredients || 'Ingredienti di stagione dal mercato contadino di Ortigia'}</span>`;
        }

        stageImg.classList.remove('switching');
        stageTitle.classList.remove('fading');
        if (stageDesc) stageDesc.style.opacity = '1';
      }, 150);
    }

    menuButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => selectDish(idx));
      btn.addEventListener('mouseenter', () => {
        if (window.innerWidth > 992 && current !== idx) {
          selectDish(idx);
        }
      });
    });
  }

  // Galleria Azzurra con Morphing Sliding Pill nei Filtri & Stagger
  function initAzureFilterPill() {
    const filterBar = document.getElementById('azureFilters');
    const pill = document.getElementById('azureFilterPill');
    const btns = Array.from(document.querySelectorAll('#azureFilters .azure-filter-btn'));
    const items = Array.from(document.querySelectorAll('#azurePhotoGrid .azure-photo-item'));

    if (!filterBar || !pill || !btns.length) return;

    function movePillTo(button) {
      if (!button) return;
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

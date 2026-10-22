/**
 * GUTKOWSKINO — Refined Sicilian Hospitality Showcase
 *
 * Art Direction: Bianco Calce, Verde Botanico, Blu Ionio
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
    initReviewsTheater(data.reviews.featured || []);
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
              <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener" class="btn btn-botanic">
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

  // ───── 4. RIFATTO: Stage Immersivo della Cucina (Zero Marrone, Palette Blu & Verde, Zero Boxy Cards) ─────
  function buildKitchenLookbook(data) {
    const d = data.kitchen;
    const dishes = d.dishes || [];
    const first = dishes[0] || {};
    const totalDishes = dishes.length;

    const section = el('section', { className: 'section-kitchen section-pad', id: 'cucina' });

    // Timeline degutazione orizzontale
    const stripItems = dishes.map((dish, idx) => `
      <div class="dish-strip-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <span class="dish-strip-num">0${idx + 1} · ${dish.course}</span>
        <h4 class="dish-strip-name">${dish.name.split(' su ')[0].split(' con ')[0]}</h4>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="kitchen-header reveal-up">
          <div>
            <span class="section-kicker light">Dal Mercato di Ortigia alla Tavola</span>
            <h2 class="heading-display">${d.heading}</h2>
          </div>
          <p class="kitchen-header-desc">${d.note}</p>
        </div>

        <!-- STAGE IMMERSIVO DEL PIATTO -->
        <div class="dish-stage">
          <div class="dish-stage-visual reveal-up" id="dishStageVisual" data-lightbox="${first.image || ''}">
            <span class="dish-stage-badge" id="dishStageBadge">${first.course || ''}</span>
            <img id="dishStageImg" src="${first.image || ''}" alt="${first.name || ''}" decoding="async" referrerpolicy="no-referrer">
            <span class="dish-stage-hint">Clicca per ingrandire</span>
          </div>

          <div class="dish-stage-content reveal-up delay-1">
            <div class="dish-stage-meta">
              <span class="dish-stage-counter" id="dishStageCounter">01 / 0${totalDishes}</span>
              <span class="dish-stage-course" id="dishStageCourse">${first.course || ''}</span>
            </div>

            <h3 class="dish-stage-title" id="dishStageTitle">${first.name || ''}</h3>
            <p class="dish-stage-desc" id="dishStageDesc">${first.description || ''}</p>

            <div class="dish-stage-ingredients" id="dishStageIngredients">
              <span>🌿 ${first.ingredients || 'Ingredienti di stagione dal mercato contadino di Ortigia'}</span>
            </div>

            <div class="dish-stage-actions">
              <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener" class="btn btn-botanic">
                <span>Prenota per assaggiarlo</span>
                ${ICONS.arrowUpRight}
              </a>
            </div>
          </div>
        </div>

        <!-- NASTRO DEGUSTAZIONE ORIZZONTALE CON MOTION FLUIDA -->
        <div class="dish-strip-wrap reveal-up">
          <div class="dish-strip-nav">
            <span class="dish-strip-label">Sequenza della Cucina Botanica</span>
            <div class="dish-strip-arrows">
              <button class="dish-strip-btn" id="dishPrevBtn" aria-label="Piatto precedente" title="Precedente">
                ${ICONS.arrowLeft}
              </button>
              <button class="dish-strip-btn" id="dishNextBtn" aria-label="Piatto successivo" title="Successivo">
                ${ICONS.arrowRight}
              </button>
            </div>
          </div>

          <div class="dish-strip-timeline" id="dishStripTimeline">
            ${stripItems}
          </div>
        </div>

        <div class="kitchen-footer-bar reveal-up">
          <p>${d.maintenanceFreeDisclaimer}</p>
          <div style="display:flex;gap:0.85rem;flex-wrap:wrap;">
            <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener" class="btn btn-azure">
              <span>Carta Completa su TheFork</span>
              ${ICONS.arrowUpRight}
            </a>
            <a href="${data.info.social.instagramUrl}" target="_blank" rel="noopener" class="btn btn-ghost-light">
              <span>Segui @${data.info.social.instagramHandle}</span>
              ${ICONS.arrowUpRight}
            </a>
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

  // ───── 6. RIFATTO: Teatro delle Voci (Palcoscenico d'Autore — Zero Griglia di 3 Card) ─────
  function buildReviewsSection(data) {
    const d = data.reviews;
    const section = el('section', { className: 'section-reviews section-pad', id: 'recensioni' });
    const featured = d.featured || [];
    const first = featured[0] || {};

    const dots = featured.map((_, i) => `
      <button class="quote-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Testimonianza ${i + 1}"></button>
    `).join('');

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

        <!-- PALCOSCENICO CITAZIONE D'AUTORE CENTRALIZZATO -->
        <div class="quote-theater reveal-up">
          <div class="quote-mark">“</div>
          <blockquote class="quote-text-large" id="quoteText">“${first.text || ''}”</blockquote>

          <div class="quote-author-info">
            <strong class="quote-author-name" id="quoteAuthor">${first.author || ''}</strong>
            <span class="quote-author-sep">·</span>
            <span class="quote-author-source" id="quoteSource">${first.source || ''}</span>
          </div>

          <div class="reviews-theater-nav">
            <button class="quote-nav-btn" id="quotePrevBtn" aria-label="Recensione precedente">
              ${ICONS.arrowLeft}
            </button>
            <div class="quote-dots-group" id="quoteDots">
              ${dots}
            </div>
            <button class="quote-nav-btn" id="quoteNextBtn" aria-label="Recensione successiva">
              ${ICONS.arrowRight}
            </button>
          </div>
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
              <a href="${data.booking.theforkUrl}" target="_blank" rel="noopener" class="btn btn-botanic">
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

  // Lookbook Stage Piatti con Timeline Orizzontale & Crossfade
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
    const stripItems = Array.from(document.querySelectorAll('.dish-strip-item'));
    const prevBtn = document.getElementById('dishPrevBtn');
    const nextBtn = document.getElementById('dishNextBtn');

    let current = 0;
    const total = dishes.length;

    function selectDish(index) {
      current = (index + total) % total;
      const d = dishes[current];

      stripItems.forEach((item, i) => item.classList.toggle('active', i === current));

      stageImg.classList.add('switching');
      stageTitle.classList.add('fading');
      if (stageDesc) stageDesc.style.opacity = '0.3';

      setTimeout(() => {
        stageImg.src = d.image;
        stageVisual.dataset.lightbox = d.image;
        stageBadge.textContent = d.course;
        stageCounter.textContent = `0${current + 1} / 0${total}`;
        stageCourse.textContent = d.course;
        stageTitle.textContent = d.name;
        stageDesc.textContent = d.description;
        if (stageIngredients) {
          stageIngredients.innerHTML = `<span>🌿 ${d.ingredients || 'Ingredienti del mercato contadino di Ortigia'}</span>`;
        }

        stageImg.classList.remove('switching');
        stageTitle.classList.remove('fading');
        if (stageDesc) stageDesc.style.opacity = '1';
      }, 160);
    }

    stripItems.forEach((item, idx) => {
      item.addEventListener('click', () => selectDish(idx));
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

  // Teatro delle Recensioni (Quote Theater con Crossfade & Controlli)
  function initReviewsTheater(featured) {
    if (!featured.length) return;

    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const quoteSource = document.getElementById('quoteSource');
    const dots = Array.from(document.querySelectorAll('#quoteDots .quote-dot'));
    const prevBtn = document.getElementById('quotePrevBtn');
    const nextBtn = document.getElementById('quoteNextBtn');

    let current = 0;
    const total = featured.length;

    function setReview(index) {
      current = (index + total) % total;
      const r = featured[current];

      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));

      quoteText.classList.add('fading');

      setTimeout(() => {
        quoteText.textContent = `“${r.text}”`;
        quoteAuthor.textContent = r.author;
        quoteSource.textContent = r.source;
        quoteText.classList.remove('fading');
      }, 160);
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => setReview(idx));
    });

    prevBtn?.addEventListener('click', () => setReview(current - 1));
    nextBtn?.addEventListener('click', () => setReview(current + 1));

    // Auto-advance con pausa
    let timer = setInterval(() => setReview(current + 1), 7000);
    const theater = document.querySelector('.quote-theater');
    theater?.addEventListener('mouseenter', () => clearInterval(timer));
    theater?.addEventListener('mouseleave', () => {
      clearInterval(timer);
      timer = setInterval(() => setReview(current + 1), 7000);
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

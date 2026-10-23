/**
 * GUTKOWSKINO — Refined Sicilian Hospitality Showcase
 *
 * Art Direction: Carta d'Arte, Salvia dell'Orto, Calcarenite Dorata, Ceruleo Ionio
 * Motion Architecture (archetipo Premium / Editorial - SKILL.md):
 * - 3 Motion Layers: Primary (choreographed stagger <500ms) + Secondary (follow-through & counter-shadow) + Ambient (multi-rate sine floating & scroll parallax)
 * - Mediterranean Fine-Art SVG Outlines with IntersectionObserver ink-draw animation
 * - 4-Act Dish Stage transition with cascading botanical ingredient pills
 */

(function () {
  'use strict';

  const ICONS = {
    arrowUpRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>`,
    arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>`,
    arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
  };

  /* ── Collezione di Outline SVG Mediterranei a Tratto di Penna Fine-Art ── */
  const MED_SVGS = {
    // Illustrazione Hero: Natura Morta Mediterranea (Piatto veg con carciofo e agrumi, Posate artigianali e Calice di vino)
    heroStillLife: `
      <svg class="semilla-hero-svg svg-draw-trigger" viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Natura morta mediterranea vegetale: calice, posate e piatto d'autore">
        <defs>
          <linearGradient id="wineGlowHero" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--amber-warm)" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="var(--amber-warm)" stop-opacity="0.08"/>
          </linearGradient>
        </defs>

        <!-- 1. Sole / Raggiera Mediterranea in filigrana superiore -->
        <g class="ambient-float-slow" aria-hidden="true" opacity="0.85">
          <circle cx="260" cy="74" r="26" stroke="var(--amber-warm)" stroke-width="1.1" stroke-dasharray="3 3"/>
          <circle cx="260" cy="74" r="13" stroke="var(--amber-warm)" stroke-width="0.8"/>
          <path d="M260 38 V30 M260 110 V118 M216 74 H224 M296 74 H304 M229 43 L235 49 M285 99 L291 105 M291 43 L285 49 M229 99 L235 93" stroke="var(--amber-warm)" stroke-width="0.9" stroke-linecap="round"/>
        </g>

        <!-- 2. Il Grande Piatto in Ceramica di Ortigia al centro -->
        <circle class="svg-ink-path" cx="260" cy="305" r="148" stroke="var(--text-dark)" stroke-width="1.3"/>
        <circle class="svg-ink-path" cx="260" cy="305" r="136" stroke="var(--blue-levante)" stroke-width="0.9" stroke-dasharray="5 4"/>
        <circle class="svg-ink-path" cx="260" cy="305" r="116" stroke="var(--text-dark)" stroke-width="1.1"/>
        <path class="svg-ink-path" d="M144 305 Q 165 292, 186 305 T 228 305 T 270 305 T 312 305 T 354 305 T 376 305" stroke="var(--blue-levante)" stroke-width="0.9"/>

        <!-- 3. Vivande Vegetali nel Piatto -->
        <!-- Carciofo Spinoso Aretuseo -->
        <g class="svg-ink-path" id="heroArtichoke">
          <path d="M255 385 C255 355, 258 335, 260 305" stroke="var(--text-dark)" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M260 305 C235 305, 220 275, 232 245 C244 260, 254 268, 260 268 C266 268, 276 260, 288 245 C300 275, 285 305, 260 305 Z" stroke="var(--sage-green)" stroke-width="1.3" fill="none"/>
          <path d="M242 258 C230 234, 244 210, 260 196 C276 210, 290 234, 278 258" stroke="var(--sage-green)" stroke-width="1.2" fill="none"/>
          <path d="M230 286 C208 276, 200 252, 214 230 C226 244, 233 260, 238 270" stroke="var(--sage-green)" stroke-width="1" fill="none"/>
          <path d="M290 286 C312 276, 320 252, 306 230 C294 244, 287 260, 282 270" stroke="var(--sage-green)" stroke-width="1" fill="none"/>
          <path d="M252 230 C256 220, 264 220, 268 230" stroke="var(--sage-green)" stroke-width="1"/>
          <path d="M260 200 V235" stroke="var(--sage-green)" stroke-width="0.9" stroke-dasharray="2 3"/>
        </g>

        <!-- Limone di Siracusa IGP in sezione -->
        <g class="svg-ink-path ambient-float-mid" id="heroLemon">
          <circle cx="205" cy="270" r="32" stroke="var(--amber-warm)" stroke-width="1.3"/>
          <circle cx="205" cy="270" r="26" stroke="var(--amber-warm)" stroke-width="0.8"/>
          <path d="M205 245 V295 M180 270 H230 M188 253 L222 287 M222 253 L188 287" stroke="var(--amber-warm)" stroke-width="0.85"/>
          <circle cx="205" cy="270" r="2.5" fill="var(--amber-warm)"/>
          <circle cx="186" cy="305" r="2" fill="var(--amber-warm)" opacity="0.8"/>
          <circle cx="178" cy="295" r="1.5" fill="var(--amber-warm)" opacity="0.6"/>
        </g>

        <!-- Tralcio di Pomodorini Pachino -->
        <g class="svg-ink-path" id="heroTomatoes">
          <path d="M295 325 C310 320, 325 328, 335 342" stroke="var(--text-dark)" stroke-width="1.1"/>
          <circle cx="312" cy="340" r="13" stroke="var(--amber-warm)" stroke-width="1.2"/>
          <path d="M312 327 L310 323 M312 327 L315 323 M312 327 L308 327 M312 327 L316 327" stroke="var(--sage-green)" stroke-width="1"/>
          <circle cx="334" cy="355" r="11" stroke="var(--amber-warm)" stroke-width="1.1"/>
          <path d="M334 344 L332 340 M334 344 L337 340" stroke="var(--sage-green)" stroke-width="1"/>
        </g>

        <!-- Rametto Botanico di Erbe Aromatiche -->
        <g class="svg-ink-path" id="heroHerbs">
          <path d="M220 345 C235 365, 260 375, 285 370" stroke="var(--sage-green)" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M232 352 C226 348, 224 342, 230 340 M245 362 C245 355, 252 352, 256 356 M264 368 C266 360, 274 362, 272 368" stroke="var(--sage-green)" stroke-width="1"/>
        </g>

        <!-- 4. Il Calice da Vino Naturale (Lato Sinistro) -->
        <g class="svg-ink-path" id="heroWineGlass">
          <ellipse cx="112" cy="405" rx="30" ry="8" stroke="var(--text-dark)" stroke-width="1.3"/>
          <ellipse cx="112" cy="405" rx="20" ry="5" stroke="var(--text-dark)" stroke-width="0.75" stroke-dasharray="2 2"/>
          <path d="M112 405 V275" stroke="var(--text-dark)" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M112 275 C102 275, 84 252, 84 205 C84 158, 92 142, 112 142 C132 142, 140 158, 140 205 C140 252, 122 275, 112 275 Z" stroke="var(--text-dark)" stroke-width="1.3" fill="none"/>
          <ellipse cx="112" cy="142" rx="28" ry="7" stroke="var(--text-dark)" stroke-width="1.1"/>
          <path d="M88 200 Q 100 194, 112 200 T 136 200 C136 240, 122 265, 112 265 C102 265, 88 240, 88 200 Z" fill="url(#wineGlowHero)" stroke="var(--amber-warm)" stroke-width="1.2"/>
          <path d="M96 160 C93 180, 93 215, 98 235" stroke="var(--amber-warm)" stroke-width="0.9" stroke-linecap="round" stroke-dasharray="4 3"/>
        </g>

        <!-- 5. Le Posate da Tavola (Lato Destro) -->
        <!-- Forchetta da Bistrot a 4 rebbi -->
        <g class="svg-ink-path" id="heroFork">
          <path d="M405 160 V225 C405 240, 412 255, 412 275 V410 C412 418, 404 425, 396 422 C390 419, 392 410, 392 405 V275 C392 255, 399 240, 399 225 V160" stroke="var(--text-dark)" stroke-width="1.2" fill="none"/>
          <path d="M399 160 V115 M401 160 V115 M403 160 V115 M405 160 V115" stroke="var(--text-dark)" stroke-width="1.1" stroke-linecap="round"/>
          <path d="M396 158 H408" stroke="var(--text-dark)" stroke-width="1"/>
          <circle cx="402" cy="340" r="1.8" fill="var(--amber-warm)"/>
        </g>

        <!-- Coltello da Tavola -->
        <g class="svg-ink-path" id="heroKnife">
          <path d="M448 245 V415 C448 422, 456 425, 462 420 C466 416, 464 408, 464 402 V245" stroke="var(--text-dark)" stroke-width="1.2" fill="none"/>
          <path d="M444 245 H468" stroke="var(--text-dark)" stroke-width="1.2"/>
          <path d="M448 245 V140 C448 115, 464 125, 464 150 V245" stroke="var(--text-dark)" stroke-width="1.3" fill="none"/>
          <path d="M452 235 V150" stroke="var(--amber-warm)" stroke-width="0.85" stroke-dasharray="3 3"/>
        </g>

        <!-- 6. Rametto d'Ulivo (Sinistra) -->
        <g class="svg-ink-path" id="heroOlive">
          <path d="M60 280 C65 220, 85 160, 115 105" stroke="var(--sage-green)" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M72 235 C55 228, 52 215, 68 218 M84 195 C70 185, 72 172, 88 180 M98 152 C86 140, 90 128, 104 138" stroke="var(--sage-green)" stroke-width="1"/>
          <ellipse cx="62" cy="205" rx="5" ry="7" transform="rotate(-15 62 205)" stroke="var(--text-dark)" stroke-width="1.1" fill="var(--amber-warm)" fill-opacity="0.3"/>
        </g>

        <!-- 7. Spiga di grano siciliano (In alto a destra) -->
        <g class="svg-ink-path" id="heroWheat">
          <path d="M350 115 Q 380 90, 420 75" stroke="var(--amber-warm)" stroke-width="1" stroke-linecap="round"/>
          <path d="M365 105 L368 95 M380 96 L385 86 M395 88 L402 78 M410 81 L418 72" stroke="var(--amber-warm)" stroke-width="1" stroke-linecap="round"/>
        </g>
      </svg>`,

    // Fregio divisorio botanico (Ramo d'ulivo, bocciolo di cappero e sole)
    dividerBotanical: `
      <div class="med-section-divider svg-draw-trigger" aria-hidden="true">
        <svg viewBox="0 0 640 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="svg-ink-path" d="M20 22 H235" stroke="currentColor" stroke-width="0.85" stroke-dasharray="4 4"/>
          <path class="svg-ink-path" d="M405 22 H620" stroke="currentColor" stroke-width="0.85" stroke-dasharray="4 4"/>
          <path class="svg-ink-path" d="M248 22 C272 22, 286 11, 320 11 C354 11, 368 22, 392 22" stroke="currentColor" stroke-width="1.1"/>
          <path class="svg-ink-path" d="M248 22 C272 22, 286 33, 320 33 C354 33, 368 22, 392 22" stroke="currentColor" stroke-width="1.1"/>
          <path class="svg-ink-path" d="M276 18 C268 10, 256 12, 262 20" stroke="var(--sage-green)" stroke-width="1"/>
          <path class="svg-ink-path" d="M364 18 C372 10, 384 12, 378 20" stroke="var(--sage-green)" stroke-width="1"/>
          <circle class="svg-ink-path" cx="320" cy="22" r="4.5" stroke="var(--amber-warm)" stroke-width="1.2"/>
          <circle cx="298" cy="22" r="1.8" fill="var(--amber-warm)"/>
          <circle cx="342" cy="22" r="1.8" fill="var(--amber-warm)"/>
        </svg>
      </div>`,

    // Fregio divisorio marino (Onde dello Ionio e bussola di Levante)
    dividerMarine: `
      <div class="med-section-divider marine svg-draw-trigger" aria-hidden="true">
        <svg viewBox="0 0 640 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="svg-ink-path" d="M20 22 Q 55 12, 90 22 T 160 22 T 230 22 T 285 22" stroke="currentColor" stroke-width="1"/>
          <path class="svg-ink-path" d="M355 22 Q 390 12, 425 22 T 495 22 T 565 22 T 620 22" stroke="currentColor" stroke-width="1"/>
          <path class="svg-ink-path" d="M320 7 L324 18 L335 22 L324 26 L320 37 L316 26 L305 22 L316 18 Z" stroke="var(--amber-warm)" stroke-width="1.15"/>
          <circle class="svg-ink-path" cx="320" cy="22" r="12" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 2"/>
        </svg>
      </div>`,

    // Filigrana Sezione 1 (Filosofia): Arco di Ortigia, Carciofo Spinoso, Fico d'India e Ulivo
    watermarkBotanical: `
      <svg class="med-bg-illustration philo-watermark svg-draw-trigger" data-parallax-speed="0.12" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Cornice ad arco architettonico siciliano -->
        <path class="svg-ink-path" d="M50 490 V210 C50 110, 122 40, 210 40 C298 40, 370 110, 370 210 V490" stroke="currentColor" stroke-width="1.1"/>
        <path class="svg-ink-path" d="M64 490 V212 C64 120, 130 54, 210 54 C290 54, 356 120, 356 212 V490" stroke="currentColor" stroke-width="0.7" stroke-dasharray="4 4"/>
        <!-- Raggi solari stilizzati nella lunetta -->
        <circle class="svg-ink-path ambient-float-slow" cx="210" cy="135" r="24" stroke="var(--amber-warm)" stroke-width="1"/>
        <path class="svg-ink-path" d="M210 92 V102 M210 168 V178 M167 135 H177 M243 135 H253 M180 105 L187 112 M233 158 L240 165 M240 105 L233 112 M187 158 L180 165" stroke="var(--amber-warm)" stroke-width="0.9"/>
        <!-- Carciofo spinoso di Siracusa al centro -->
        <path class="svg-ink-path" d="M210 470 C210 410, 208 360, 210 315" stroke="currentColor" stroke-width="1.4"/>
        <path class="svg-ink-path" d="M210 315 C182 315, 165 282, 178 248 C192 264, 204 274, 210 274 C216 274, 228 264, 242 248 C255 282, 238 315, 210 315 Z" stroke="currentColor" stroke-width="1.15"/>
        <path class="svg-ink-path" d="M188 262 C175 236, 192 208, 210 194 C228 208, 245 236, 232 262" stroke="currentColor" stroke-width="1.15"/>
        <path class="svg-ink-path" d="M174 295 C148 286, 138 258, 154 234 C168 250, 176 266, 182 278" stroke="currentColor" stroke-width="1"/>
        <path class="svg-ink-path" d="M246 295 C272 286, 282 258, 266 234 C252 250, 244 266, 238 278" stroke="currentColor" stroke-width="1"/>
        <!-- Foglie sinuose alla base dello stelo -->
        <path class="svg-ink-path" d="M209 385 C175 375, 135 395, 118 430 C150 422, 182 405, 209 398" stroke="currentColor" stroke-width="1"/>
        <path class="svg-ink-path" d="M211 365 C245 355, 285 375, 302 410 C270 402, 238 385, 211 378" stroke="currentColor" stroke-width="1"/>
      </svg>`,

    // Filigrana Sezione 2 (La Cucina): Anfora ceramica, Limone aretuseo, Fiore di Cappero e Spiga
    watermarkGastronomic: `
      <svg class="med-bg-illustration kitchen-watermark svg-draw-trigger" data-parallax-speed="-0.1" viewBox="0 0 440 440" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle class="svg-ink-path" cx="220" cy="220" r="190" stroke="currentColor" stroke-width="0.8" stroke-dasharray="5 5"/>
        <circle class="svg-ink-path" cx="220" cy="220" r="176" stroke="currentColor" stroke-width="1"/>
        <!-- Anfora / Ceramica di Caltagirone & Ortigia -->
        <path class="svg-ink-path" d="M188 118 H252 M198 118 V142 C164 166, 152 218, 168 272 C178 304, 194 328, 194 342 H246 C246 328, 262 304, 272 272 C288 218, 276 166, 242 142 V118" stroke="currentColor" stroke-width="1.2"/>
        <!-- Manici dell'anfora -->
        <path class="svg-ink-path" d="M196 132 C160 132, 146 172, 164 198" stroke="currentColor" stroke-width="1.1"/>
        <path class="svg-ink-path" d="M244 132 C280 132, 294 172, 276 198" stroke="currentColor" stroke-width="1.1"/>
        <!-- Decorazione ad onde sull'anfora -->
        <path class="svg-ink-path" d="M162 222 Q 190 206, 220 222 T 278 222" stroke="var(--amber-warm)" stroke-width="1.1"/>
        <path class="svg-ink-path" d="M166 244 Q 192 228, 220 244 T 274 244" stroke="var(--blue-levante)" stroke-width="1"/>
        <!-- Agrume in sezione & Fiore di Cappero -->
        <circle class="svg-ink-path ambient-float-mid" cx="122" cy="306" r="36" stroke="var(--amber-warm)" stroke-width="1.1"/>
        <circle class="svg-ink-path ambient-float-mid" cx="122" cy="306" r="29" stroke="var(--amber-warm)" stroke-width="0.8"/>
        <path class="svg-ink-path ambient-float-mid" d="M122 277 V335 M93 306 H151 M102 286 L142 326 M142 286 L102 326" stroke="var(--amber-warm)" stroke-width="0.75"/>
        <!-- Rametto botanico di zafferano / timo -->
        <path class="svg-ink-path" d="M312 330 C320 280, 342 230, 360 180" stroke="var(--sage-green)" stroke-width="1.1"/>
        <path class="svg-ink-path" d="M322 290 C306 278, 304 260, 326 268 M334 252 C352 242, 356 224, 336 232 M346 214 C330 202, 328 184, 350 192" stroke="var(--sage-green)" stroke-width="1"/>
      </svg>`,

    // Filigrana Sezione 3 (Galleria Azzurra): Rosa dei Venti Ionica, Onde di Levante e Scogliera
    watermarkMarine: `
      <svg class="med-bg-illustration azure-watermark svg-draw-trigger" data-parallax-speed="0.14" viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle class="svg-ink-path" cx="240" cy="240" r="195" stroke="currentColor" stroke-width="0.9"/>
        <circle class="svg-ink-path" cx="240" cy="240" r="182" stroke="currentColor" stroke-width="0.7" stroke-dasharray="3 5"/>
        <circle class="svg-ink-path" cx="240" cy="240" r="118" stroke="currentColor" stroke-width="0.75"/>
        <!-- Rosa dei Venti di Ortigia -->
        <path class="svg-ink-path ambient-spin-very-slow" d="M240 38 L258 212 L432 240 L258 268 L240 442 L222 268 L48 240 L222 212 Z" stroke="currentColor" stroke-width="1.1"/>
        <path class="svg-ink-path" d="M115 115 L226 226 M365 115 L254 226 M365 365 L254 254 M115 365 L226 254" stroke="var(--amber-warm)" stroke-width="0.95"/>
        <!-- Onde del Mare di Levante -->
        <path class="svg-ink-path" d="M75 340 Q 116 320, 158 340 T 240 340 T 322 340 T 405 340" stroke="currentColor" stroke-width="1.2"/>
        <path class="svg-ink-path" d="M95 364 Q 132 346, 168 364 T 240 364 T 312 364 T 385 364" stroke="currentColor" stroke-width="1"/>
        <circle cx="240" cy="240" r="7" stroke="var(--amber-warm)" stroke-width="1.4"/>
      </svg>`,

    // Icone Sartoriali per i 3 Pilastri della Filosofia
    pillars: [
      // 01. Mercato di Ortigia (Arco storico, spiga e agrume)
      `<svg class="pillar-svg-icon" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path class="svg-ink-path" d="M10 48 V26 C10 15, 18 8, 28 8 C38 8, 46 15, 46 26 V48" stroke="currentColor" stroke-width="1.3"/>
        <path class="svg-ink-path" d="M6 48 H50" stroke="currentColor" stroke-width="1.3"/>
        <circle class="svg-ink-path" cx="28" cy="29" r="9" stroke="var(--amber-warm)" stroke-width="1.3"/>
        <path class="svg-ink-path" d="M28 20 C31 15, 36 16, 33 21" stroke="var(--sage-green)" stroke-width="1.2"/>
      </svg>`,
      // 02. Materia & Colore (Ceramica dipinta a mano & essenza)
      `<svg class="pillar-svg-icon" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path class="svg-ink-path" d="M8 28 C8 40, 17 46, 28 46 C39 46, 48 40, 48 28 Z" stroke="currentColor" stroke-width="1.3"/>
        <path class="svg-ink-path" d="M19 46 H37 M14 34 Q 21 30, 28 34 T 42 34" stroke="var(--amber-warm)" stroke-width="1.2"/>
        <path class="svg-ink-path" d="M22 22 C22 16, 26 14, 26 9 M30 22 C30 17, 34 15, 34 10" stroke="var(--sage-green)" stroke-width="1.2"/>
      </svg>`,
      // 03. Vini Naturali (Calice artigianale, vulcano Etna e brezza marina)
      `<svg class="pillar-svg-icon" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path class="svg-ink-path" d="M17 10 H39 L36 25 C35 31, 32 35, 28 35 C24 35, 21 31, 20 25 Z" stroke="currentColor" stroke-width="1.3"/>
        <path class="svg-ink-path" d="M28 35 V47 M19 47 H37" stroke="currentColor" stroke-width="1.3"/>
        <path class="svg-ink-path" d="M19 22 Q 24 19, 28 22 T 37 22" stroke="var(--amber-warm)" stroke-width="1.2"/>
        <circle cx="33" cy="15" r="1.5" fill="var(--amber-warm)"/>
      </svg>`
    ]
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

  function getServiceStatus(data) {
    try {
      const hours = data?.hours;
      if (hours?.statusNotice) {
        return { open: true, text: hours.statusNotice };
      }

      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
      const day = now.getDay();
      const hour = now.getHours() + now.getMinutes() / 60;

      const restDay = hours?.restDay !== undefined && hours?.restDay !== null ? hours.restDay : 3;
      const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
      const startStr = hours?.dinnerStart || '19:00';
      const endStr = hours?.dinnerEnd || '22:30';

      const [sh, sm] = startStr.split(':').map(Number);
      const [eh, em] = endStr.split(':').map(Number);
      const startNum = sh + (sm || 0) / 60;
      const endNum = eh + (em || 0) / 60;

      if (restDay !== 'none' && restDay !== null && day === parseInt(restDay, 10)) {
        return { open: false, text: `${dayNames[day]} riposo` };
      }
      if (hour >= startNum && hour <= endNum) {
        return { open: true, text: `Aperto ora · ${startStr}–${endStr}` };
      }
      return { open: true, text: `Cena · ${startStr}–${endStr}` };
    } catch {
      return { open: true, text: 'Cena · 19:00–22:30' };
    }
  }

  function formatIngredientPills(ingredientsStr) {
    const raw = ingredientsStr || 'Ingredienti di stagione · Mercato contadino di Ortigia';
    return raw
      .split('·')
      .map(s => s.trim())
      .filter(Boolean)
      .map((item, i) => `<span class="kps-ing-pill" style="--pill-idx:${i}">${item}</span>`)
      .join('');
  }

  function formatSemillaHeading(heading) {
    if (!heading) {
      return '<span>Cucina vegetale d\'autore</span><em class="semilla-title-em">sul mare di Levante</em>';
    }
    let clean = heading.replace(/<\/em>|<\/em|\/em>/gi, '</em>').replace(/<em[^>]*>/gi, '<em>');
    if (clean.includes('<em>') && clean.includes('</em>')) {
      const parts = clean.split(/<em>|<\/em>/i);
      return `
        <span>${parts[0].trim()}</span>
        ${parts[1] ? `<em class="semilla-title-em">${parts[1].trim()}</em>` : ''}
        ${parts[2] ? `<span>${parts[2].trim()}</span>` : ''}
      `;
    }
    return `<span>${clean}</span>`;
  }

  function formatHeroHeading(heading) {
    if (!heading) {
      return '<span class="title-primary">Cucina vegetale d\'autore</span><span class="title-secondary">sul mare di Levante</span>';
    }
    // Normalizza tag imperfetti tipo </em o /em>
    let clean = heading.replace(/<\/em>|<\/em|\/em>/gi, '</em>').replace(/<em[^>]*>/gi, '<em>');
    if (clean.includes('<em>') && clean.includes('</em>')) {
      const parts = clean.split(/<em>|<\/em>/i);
      return `
        ${parts[0] ? `<span class="title-primary">${parts[0].trim()}</span>` : ''}
        ${parts[1] ? `<span class="title-secondary">${parts[1].trim()}</span>` : ''}
        ${parts[2] ? `<span class="title-primary">${parts[2].trim()}</span>` : ''}
      `;
    }
    if (clean.includes('<em>')) {
      const [before, ...rest] = clean.split('<em>');
      return `
        ${before ? `<span class="title-primary">${before.trim()}</span>` : ''}
        <span class="title-secondary">${rest.join('').replace(/<[^>]+>/g, '').trim()}</span>
      `;
    }
    return `<span class="title-primary">${clean}</span>`;
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
      const resp = await fetch('data/restaurant.json?_t=' + Date.now(), { cache: 'no-store' });
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
    app.appendChild(buildUnifiedAzureGallery(data, unifiedPhotos));
    app.appendChild(buildReviewsSection(data));
    app.appendChild(buildInfoSection(data));
    app.appendChild(buildFooter(data));
    app.appendChild(buildLightbox());

    // Inizializzazioni interazioni e motion (3 Layers: Primary + Secondary + Ambient)
    initNavScroll();
    initMobileNav();
    initRevealAndSvgObserver();
    initMultiLayerParallax();
    initTactileFramesTilt();
    initDishStageCarousel(data.kitchen.dishes || []);
    initAzureFilterPill();
    initLightbox();
    initSectionNavDots();
  }

  // ───── 1. Navbar Semilla Style ─────
  function buildNavbar(data) {
    const brandName = (data.brand && data.brand.name) ? data.brand.name : 'Gutkowskino';
    const theforkUrl = (data.booking && data.booking.theforkUrl) || '#';

    const header = el('header', { className: 'navbar', id: 'navbar' });
    header.innerHTML = `
      <div class="navbar-inner semilla-nav-inner">
        <nav class="semilla-nav-group semilla-nav-left" id="navLinksLeft" aria-label="Navigazione Principale">
          <a href="#filosofia">FILOSOFIA</a>
          <a href="#cucina">CUCINA</a>
          <a href="#galleria-azzurra">TERRAZZA</a>
        </nav>

        <div class="semilla-nav-center">
          <a href="#" class="semilla-nav-brand">
            <span class="semilla-brand-name">${brandName}</span>
          </a>
        </div>

        <nav class="semilla-nav-group semilla-nav-right" id="navLinksRight" aria-label="Navigazione Secondaria">
          <a href="#recensioni">RECENSIONI</a>
          <a href="#contatti">CONTATTI</a>
          <a href="${theforkUrl}" target="_blank" rel="noopener" class="semilla-nav-cta">PRENOTA</a>
        </nav>

        <button class="nav-toggle semilla-nav-toggle" id="navToggle" aria-label="Apri menu">
          <span></span><span></span><span></span>
        </button>
      </div>`;
    return header;
  }

  // ───── 1b. Mobile Drawer Fullscreen (Boutique & Sartoriale) ─────
  function buildMobileDrawer(data) {
    const status = getServiceStatus(data);
    const drawer = el('div', { className: 'mobile-drawer', id: 'mobileDrawer', 'aria-hidden': 'true' });
    drawer.innerHTML = `
      <div class="mobile-drawer-header">
        <span class="mobile-drawer-logo">${data.brand.name}</span>
        <button class="mobile-drawer-close" id="mobileDrawerClose" aria-label="Chiudi menu">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <nav class="mobile-drawer-nav">
        <a href="#filosofia" class="mobile-nav-link" style="--i:0">
          <span class="mnl-num">01</span>
          <span class="mnl-text">La Filosofia</span>
        </a>
        <a href="#cucina" class="mobile-nav-link" style="--i:1">
          <span class="mnl-num">02</span>
          <span class="mnl-text">La Cucina d'Autore</span>
        </a>
        <a href="#galleria-azzurra" class="mobile-nav-link" style="--i:2">
          <span class="mnl-num">03</span>
          <span class="mnl-text">Terrazza & Galleria</span>
        </a>
        <a href="#recensioni" class="mobile-nav-link" style="--i:3">
          <span class="mnl-num">04</span>
          <span class="mnl-text">Le Recensioni</span>
        </a>
        <a href="#contatti" class="mobile-nav-link" style="--i:4">
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

  // ───── 2. Hero Semilla Style (Minimalista, Bordo Quadro, Scritta Cursiva, Titolo Display e Tasti Ovali) ─────
  function buildPostcardHero(data) {
    let heroBg = data.hero.backgroundImage || 'assets/images/hero-terrazza-1792755231068.webp';
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      heroBg = heroBg.replace('https://gutkowskino-demo.siracusalabs.app/', '');
    }

    const kickerText = (data.brand && data.brand.locationTag && data.brand.locationTag.includes('·')) 
      ? data.brand.locationTag.toUpperCase() 
      : 'ORTIGIA · SUL MARE DI LEVANTE';

    const formattedTitle = formatSemillaHeading(data.hero.heading);

    const section = el('section', { className: 'semilla-hero', id: 'hero' });
    section.innerHTML = `
      <!-- Margine Sinistro: Outline SVG Botanico Mediterraneo (Ramo d'Ulivo & Sole) -->
      <div class="semilla-side-svg semilla-side-left" aria-hidden="true">
        <svg viewBox="0 0 54 360" fill="none" xmlns="http://www.w3.org/2000/svg" class="med-vertical-svg">
          <path d="M27 10 Q 32 90, 24 180 T 28 270 T 26 350" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          <circle cx="27" cy="18" r="8" stroke="var(--amber-warm)" stroke-width="1.1"/>
          <circle cx="27" cy="18" r="4" fill="var(--amber-warm)" opacity="0.6"/>
          <path d="M27 6 V2 M27 34 V30 M15 18 H11 M39 18 H43 M18 9 L15 6 M36 27 L39 30 M36 9 L39 6 M18 27 L15 30" stroke="var(--amber-warm)" stroke-width="0.9"/>
          <path d="M26 65 C 12 55, 6 70, 24 78 C 20 68, 22 62, 26 65 Z" stroke="currentColor" stroke-width="1" fill="none"/>
          <circle cx="10" cy="80" r="3" stroke="var(--amber-warm)" stroke-width="0.9"/>
          <path d="M27 110 C 42 100, 48 115, 30 125 C 34 114, 32 108, 27 110 Z" stroke="currentColor" stroke-width="1" fill="none"/>
          <path d="M25 155 C 10 145, 5 162, 23 168 C 18 158, 21 152, 25 155 Z" stroke="currentColor" stroke-width="1" fill="none"/>
          <circle cx="9" cy="170" r="3" stroke="var(--amber-warm)" stroke-width="0.9"/>
          <path d="M27 205 C 44 195, 48 212, 29 218 C 34 208, 31 202, 27 205 Z" stroke="currentColor" stroke-width="1" fill="none"/>
          <path d="M26 250 C 11 240, 7 256, 24 262 C 19 252, 22 247, 26 250 Z" stroke="currentColor" stroke-width="1" fill="none"/>
          <circle cx="11" cy="265" r="3" stroke="var(--amber-warm)" stroke-width="0.9"/>
          <path d="M27 295 C 43 286, 47 302, 29 308 C 33 298, 31 292, 27 295 Z" stroke="currentColor" stroke-width="1" fill="none"/>
          <circle cx="43" cy="310" r="3" stroke="var(--amber-warm)" stroke-width="0.9"/>
          <path d="M26 335 C 22 345, 32 355, 27 350" stroke="currentColor" stroke-width="1.1"/>
        </svg>
      </div>

      <!-- Margine Destro: Outline SVG Marino Mediterraneo (Onde Ionio, Rosa dei Venti & Anfora) -->
      <div class="semilla-side-svg semilla-side-right" aria-hidden="true">
        <svg viewBox="0 0 54 360" fill="none" xmlns="http://www.w3.org/2000/svg" class="med-vertical-svg">
          <path d="M27 10 Q 34 50, 27 90 T 27 170 T 27 250 T 27 350" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/>
          <path d="M27 14 L30 25 L41 27 L30 29 L27 40 L24 29 L13 27 L24 25 Z" stroke="var(--amber-warm)" stroke-width="1.15"/>
          <circle cx="27" cy="27" r="14" stroke="currentColor" stroke-width="0.75" stroke-dasharray="2 2"/>
          <path d="M14 90 Q 27 78, 40 90" stroke="var(--blue-levante)" stroke-width="1.2"/>
          <path d="M17 96 Q 27 86, 37 96" stroke="currentColor" stroke-width="0.9"/>
          <path d="M20 150 H34 M22 150 V158 C14 166, 12 184, 18 202 C22 214, 27 220, 27 220 C27 220, 32 214, 36 202 C42 184, 40 166, 32 158 V150" stroke="currentColor" stroke-width="1.1"/>
          <path d="M21 155 C12 155, 8 168, 16 178" stroke="currentColor" stroke-width="0.9"/>
          <path d="M33 155 C42 155, 46 168, 38 178" stroke="currentColor" stroke-width="0.9"/>
          <path d="M17 182 Q 27 174, 37 182" stroke="var(--amber-warm)" stroke-width="0.9"/>
          <path d="M14 260 Q 27 248, 40 260" stroke="var(--blue-levante)" stroke-width="1.2"/>
          <path d="M17 266 Q 27 256, 37 266" stroke="currentColor" stroke-width="0.9"/>
          <circle cx="27" cy="310" r="7" stroke="var(--amber-warm)" stroke-width="1"/>
          <circle cx="27" cy="310" r="3.5" fill="var(--amber-warm)" opacity="0.7"/>
          <path d="M27 300 V296 M27 324 V320 M17 310 H13 M41 310 H37" stroke="var(--amber-warm)" stroke-width="0.85"/>
          <path d="M27 335 V350" stroke="currentColor" stroke-width="1"/>
        </svg>
      </div>

      <div class="semilla-hero-stage">
        <!-- Colonna Sinistra: Quadro Grande Incorniciato con Illustrazione d'Arte Mediterranea -->
        <div class="semilla-hero-col semilla-visual-col">
          <div class="semilla-photo-frame" data-tilt-frame>
            <div class="semilla-art-canvas" role="img" aria-label="Natura morta mediterranea: calice da vino naturale, posate artigianali e piatto vegetale">
              ${MED_SVGS.heroStillLife}
            </div>
          </div>
        </div>

        <!-- Colonna Destra: Eyebrow Cursivo, Titolo Display Serif e Bottone Ovale MENU -->
        <div class="semilla-hero-col semilla-content-col">
          <div class="semilla-content-wrap">
            <span class="semilla-eyebrow">${kickerText}</span>
            <h1 class="semilla-title">
              ${formattedTitle}
            </h1>
            <div class="semilla-btn-wrap">
              <a href="#cucina" class="semilla-oval-btn">
                <span>MENU</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    return section;
  }

  // ───── 3. SEZIONE 1 POST-HERO: Filosofia (Sfondo Calce & Salvia Botanica + Outline SVG Carciofo/Arco) ─────
  function buildPhilosophy(data) {
    const d = data.manifesto;
    const section = el('section', { className: 'section-philosophy section-pad', id: 'filosofia' });

    const values = d.pillars.map((p, i) => `
      <div class="value-col reveal-up delay-${(i % 3) + 1} svg-draw-trigger">
        <div class="value-col-top">
          ${MED_SVGS.pillars[i] || MED_SVGS.pillars[0]}
          <span class="value-col-num">0${i + 1} / RADICI</span>
        </div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
      </div>`).join('');

    section.innerHTML = `
      ${MED_SVGS.watermarkBotanical}
      <div class="container">
        ${MED_SVGS.dividerBotanical}
        <div class="philosophy-grid">
          <div class="reveal-up">
            <span class="section-kicker sage">L'Anima Botanica del Bistrot</span>
            <h2 class="heading-display">${d.heading}</h2>
            <p class="philosophy-lead">${d.lead}</p>
            <p class="philosophy-copy">${d.columnLeft}</p>
            <p class="philosophy-copy">${d.columnRight}</p>
          </div>

          <div class="philosophy-visuals reveal-up delay-1">
            <div class="philo-img-main" data-lightbox="${d.mainImage}" data-parallax-speed="-0.06" data-tilt-frame>
              <img src="${d.mainImage}" alt="Sala interna Gutkowskino" loading="lazy" decoding="async" referrerpolicy="no-referrer">
            </div>
            <div class="philo-img-secondary" data-lightbox="${d.secondaryImage}" data-parallax-speed="0.08" data-tilt-frame>
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

  // ───── 4. SEZIONE 2 POST-HERO: La Cucina (Sfondo Calcarenite Dorata + Outline SVG Anfora & Agrumi) ─────
  function buildKitchenLookbook(data) {
    const d = data.kitchen;
    const dishes = d.dishes || [];
    const first = dishes[0] || {};
    const totalDishes = dishes.length;

    const section = el('section', { className: 'section-kitchen', id: 'cucina' });

    section.innerHTML = `
      ${MED_SVGS.watermarkGastronomic}
      <div class="container">
        ${MED_SVGS.dividerBotanical}
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

          <div class="kps-details-card" id="dishDetailsCard">
            <div class="kps-top-nav">
              <span class="kps-counter" id="dishStageCounter">01 / 0${totalDishes}</span>
              <span class="kps-course-label" id="dishStageCourse">${first.course || ''}</span>
              <div class="kps-arrows">
                <button class="kps-arrow-btn" id="dishPrevBtn" aria-label="Piatto precedente">←</button>
                <button class="kps-arrow-btn" id="dishNextBtn" aria-label="Piatto successivo">→</button>
              </div>
            </div>

            <div class="kps-narrative-body" id="dishNarrativeBody">
              <h3 class="kps-dish-title" id="dishStageTitle">${first.name || ''}</h3>
              <p class="kps-dish-desc" id="dishStageDesc">${first.description || ''}</p>

              <div class="kps-ingredients" id="dishStageIngredients">
                <span class="kps-ing-label">Materia Prima del Giorno</span>
                <div class="kps-ing-pills-wrap" id="dishStageIngPills">
                  ${formatIngredientPills(first.ingredients)}
                </div>
              </div>
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
      </div>`;
    return section;
  }

  // ───── 5. SEZIONE 3 POST-HERO: Galleria Azzurra (Sfondo Acquerello Ceruleo Ionio + Outline SVG Rosa dei Venti & Onde) ─────
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
      ${MED_SVGS.watermarkMarine}
      <div class="container">
        ${MED_SVGS.dividerMarine}
        <div class="azure-gallery-header reveal-up">
          <div>
            <span class="section-kicker azure">Sul Lungomare di Levante · Ortigia</span>
            <h2 class="heading-display">La terrazza sul mare, <em>la sala e i piatti</em></h2>
            <p class="azure-header-sub">${d.sub}</p>
          </div>

          <div class="azure-filter-bar" id="azureFilters">
            <div class="azure-filter-pill" id="azureFilterPill"></div>
            <button class="azure-filter-btn active" data-filter="all">Tutti gli scatti</button>
            <button class="azure-filter-btn" data-filter="terrazza">Terrazza & Mare</button>
            <button class="azure-filter-btn" data-filter="piatti">I Piatti</button>
            <button class="azure-filter-btn" data-filter="sala">Sala & Dettagli</button>
          </div>
        </div>

        <div class="azure-mobile-hint">
          <span>Scorri in orizzontale (${unifiedPhotos.length} foto)</span>
          <span>Tocca per ingrandire ↗</span>
        </div>

        <div class="azure-photo-grid" id="azurePhotoGrid">
          ${itemsHtml}
        </div>
      </div>`;
    return section;
  }

  // ───── 6. Recensioni: Card Singole Stilizzate su Sfondo Carta d'Arte ─────
  function buildReviewsSection(data) {
    const d = data.reviews;
    const section = el('section', { className: 'section-reviews section-pad', id: 'recensioni' });
    const featured = d.featured || [];

    const cardsHtml = featured.map((r, i) => {
      const isTheFork = (r.source || '').toLowerCase().includes('thefork');
      const badgeClass = isTheFork ? 'badge-thefork' : 'badge-google';
      const badgeLabel = isTheFork ? 'TheFork · Verificata' : 'Google Maps · Locale';

      return `
        <article class="review-card reveal-up delay-${(i % 2) + 1}" data-tilt-frame>
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
        ${MED_SVGS.dividerBotanical}
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
        ${MED_SVGS.dividerMarine}
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
                    <span>${data.hours?.daysOpen || 'Giovedì — Martedì'}</span>
                    <span>${data.hours?.dinnerDisplay || (data.hours?.dinnerStart && data.hours?.dinnerEnd ? `${data.hours.dinnerStart} — ${data.hours.dinnerEnd}` : '19:00 — 22:30')}</span>
                    ${data.hours?.restDay !== 'none' && data.hours?.restDay !== null && data.hours?.restDay !== -1 ? `
                    <span style="color:var(--blue-levante);">${data.hours?.restDayName || 'Mercoledì'}</span>
                    <span style="color:var(--blue-levante);">${data.hours?.restDayLabel || 'Riposo settimanale'}</span>
                    ` : ''}
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
    const footer = el('footer', { className: 'footer', id: 'footer' });
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
     INTERACTIONS & 3-LAYER MOTION DIRECTOR LOGIC (SKILL.md)
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

  // Mobile Nav: Drawer Full-Screen con Scroll Lock Totale
  function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const drawer = document.getElementById('mobileDrawer');
    const closeBtn = document.getElementById('mobileDrawerClose');
    if (!toggle || !drawer) return;

    let savedScrollY = 0;

    function openDrawer() {
      savedScrollY = window.pageYOffset || document.documentElement.scrollTop;
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('menu-open');
      document.body.classList.add('menu-open');
      document.body.style.top = `-${savedScrollY}px`;
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
      document.body.style.top = '';
      window.scrollTo(0, savedScrollY);
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

  // Primary + Secondary Layer: Intersection Observer per Reveal e Self-Drawing SVG
  function initRevealAndSvgObserver() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view', 'svg-drawn');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
    );

    document.querySelectorAll('.reveal-up, .svg-draw-trigger').forEach(node => {
      observer.observe(node);
    });
  }

  // Ambient Layer: Parallasse Multi-Livello (<100px max displacement, disattivato su mobile)
  function initMultiLayerParallax() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const parallaxNodes = Array.from(document.querySelectorAll('[data-parallax-speed]'));
    if (!parallaxNodes.length) return;

    let ticking = false;

    function updateParallax() {
      if (window.innerWidth <= 860) {
        parallaxNodes.forEach(n => { n.style.transform = ''; });
        ticking = false;
        return;
      }

      const viewportCenter = window.innerHeight * 0.5;

      parallaxNodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        // Anima solo gli elementi vicini o dentro il viewport
        if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

        const speed = parseFloat(node.dataset.parallaxSpeed || '0.08');
        const distFromCenter = (rect.top + rect.height * 0.5) - viewportCenter;
        const clampedOffset = Math.max(-42, Math.min(42, distFromCenter * speed));

        node.style.setProperty('--parallax-y', `${clampedOffset.toFixed(1)}px`);
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    updateParallax();
  }

  // Secondary Layer: Tactile 3D Perspective Tilt & Counter-Motion Shadow (Desktop Only)
  function initTactileFramesTilt() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (reducedMotion || !isFinePointer) return;

    const frames = document.querySelectorAll('[data-tilt-frame]');
    frames.forEach(frame => {
      frame.addEventListener('mousemove', e => {
        if (window.innerWidth <= 860) return;
        const rect = frame.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        const rotateX = (relY * -3.2).toFixed(2);
        const rotateY = (relX * 3.2).toFixed(2);
        // Counter-Motion: l'ombra si muove in direzione opposta all'inclinazione
        const shadowX = (relX * -14).toFixed(1);
        const shadowY = (relY * -14 + 16).toFixed(1);

        frame.style.setProperty('--tilt-rx', `${rotateX}deg`);
        frame.style.setProperty('--tilt-ry', `${rotateY}deg`);
        frame.style.setProperty('--shadow-cx', `${shadowX}px`);
        frame.style.setProperty('--shadow-cy', `${shadowY}px`);
      });

      frame.addEventListener('mouseleave', () => {
        frame.style.setProperty('--tilt-rx', '0deg');
        frame.style.setProperty('--tilt-ry', '0deg');
        frame.style.setProperty('--shadow-cx', '0px');
        frame.style.setProperty('--shadow-cy', '14px');
      });
    });
  }

  // 4-Act Narrative Dish Stage Carousel con Cascata Pillole Ingredienti (<200ms stagger)
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
    const stageIngPills = document.getElementById('dishStageIngPills');
    const narrativeBody = document.getElementById('dishNarrativeBody');
    const prevBtn = document.getElementById('dishPrevBtn');
    const nextBtn = document.getElementById('dishNextBtn');

    if (!stageImgA || !stageImgB) return;

    let current = 0;
    const total = dishes.length;

    function selectDish(index) {
      const nextIdx = (index + total) % total;
      if (nextIdx === current && stageImgA.getAttribute('src')) return;
      current = nextIdx;
      const d = dishes[current];

      // Act 1: Anticipation & Exit (130ms ease-in)
      if (narrativeBody) narrativeBody.classList.add('is-transitioning');

      setTimeout(() => {
        // Act 2 & 3: Action & Staggered Follow-Through
        if (stageBadge) stageBadge.textContent = d.course;
        if (stageCounter) stageCounter.textContent = `0${current + 1} / 0${total}`;
        if (stageCourse) stageCourse.textContent = d.course;
        if (stageTitle) stageTitle.textContent = d.name;
        if (stageDesc) stageDesc.textContent = d.description;
        if (stageIngPills) {
          stageIngPills.innerHTML = formatIngredientPills(d.ingredients);
        }

        if (narrativeBody) narrativeBody.classList.remove('is-transitioning');
      }, 140);

      // ZERO-BLINK Crossfade con micro-scale cinematografico
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

    prevBtn?.addEventListener('click', () => selectDish(current - 1));
    nextBtn?.addEventListener('click', () => selectDish(current + 1));

    // Supporto Touch Swipe su Mobile
    const stageCard = document.querySelector('.kitchen-panoramic-stage');
    if (stageCard) {
      let touchStartX = 0;
      let touchEndX = 0;
      stageCard.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      stageCard.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) selectDish(current + 1);
          else selectDish(current - 1);
        }
      }, { passive: true });
    }
  }

  // Galleria Azzurra con Morphing Sliding Pill & Stagger (<400ms total budget)
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
          // Rispetta il budget massimo <500ms anche con 16 elementi (max 25ms * 12 = 300ms)
          const cappedDelay = Math.min(visibleIdx * 28, 320);
          item.style.transitionDelay = `${cappedDelay}ms`;
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

  // ───── 10. Segnaposto delle Sezioni Laterali a Pallini (Scroll Libero Nativo) ─────
  function initSectionNavDots() {
    const SECTION_CONFIG = [
      { id: 'hero', label: 'Home' },
      { id: 'filosofia', label: 'Filosofia' },
      { id: 'cucina', label: 'La Cucina' },
      { id: 'galleria-azzurra', label: 'Terrazza' },
      { id: 'recensioni', label: 'Recensioni' },
      { id: 'contatti', label: 'Contatti' },
      { id: 'footer', label: 'Info' }
    ];

    const existingDots = document.querySelector('.camera-nav-dots');
    if (existingDots) existingDots.remove();

    const dotsContainer = el('nav', { className: 'camera-nav-dots', 'aria-label': 'Navigazione rapida sezioni' });
    SECTION_CONFIG.forEach((dotData, idx) => {
      const dot = el('button', {
        className: `camera-dot ${idx === 0 ? 'active' : ''}`,
        'data-target': dotData.id,
        'data-tooltip': dotData.label,
        'aria-label': `Vai alla sezione ${dotData.label}`,
        type: 'button'
      });
      dot.addEventListener('click', () => {
        const target = document.getElementById(dotData.id);
        if (target) {
          const navbar = document.getElementById('navbar');
          const navH = navbar ? navbar.offsetHeight : 80;
          const top = dotData.id === 'hero' ? 0 : Math.max(0, target.offsetTop - navH);
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
      dotsContainer.appendChild(dot);
    });
    document.body.appendChild(dotsContainer);

    // Aggiorna il segnaposto attivo durante lo scroll libero
    function updateActiveDot() {
      const currentY = window.pageYOffset || document.documentElement.scrollTop;
      const vh = window.innerHeight;
      const scrollBottom = currentY + vh;
      const docHeight = document.documentElement.scrollHeight;

      let activeId = SECTION_CONFIG[0].id;

      if (scrollBottom >= docHeight - 60) {
        activeId = SECTION_CONFIG[SECTION_CONFIG.length - 1].id;
      } else {
        SECTION_CONFIG.forEach(sec => {
          const node = document.getElementById(sec.id);
          if (node) {
            const top = node.offsetTop;
            const h = node.offsetHeight;
            if (currentY >= top - vh * 0.4 && currentY < top + h - vh * 0.4) {
              activeId = sec.id;
            }
          }
        });
      }

      dotsContainer.querySelectorAll('.camera-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.target === activeId);
      });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveDot();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Click sui link di ancoraggio interni per scroll fluido
    document.addEventListener('click', e => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;
      const targetId = href.replace(/^#/, '');
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const navbar = document.getElementById('navbar');
        const navH = navbar ? navbar.offsetHeight : 80;
        const top = targetId === 'hero' ? 0 : Math.max(0, target.offsetTop - navH);
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });

    updateActiveDot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
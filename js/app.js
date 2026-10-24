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
    // Contorno Architettonico ad Arco con Chiave di Volta Solare
    archKeystoneContour: `
      <svg class="hero-arch-contour-svg" viewBox="0 0 460 680" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Contorno arco esterno (stroke 1.2px) -->
        <path class="svg-arch-path" d="M 6 670 V 240 A 224 224 0 0 1 454 240 V 670" stroke="var(--semilla-dark, #2B2623)" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
        <path class="svg-arch-dash" d="M 6 670 V 240 A 224 224 0 0 1 454 240 V 670" stroke="var(--amber-warm, #C88D56)" stroke-width="0.75" stroke-dasharray="3 3.5" opacity="0.6"/>
        
        <!-- Conci radiali architettonici a tutto sesto -->
        <g class="svg-arch-voussoirs" stroke="var(--amber-warm, #C88D56)" stroke-width="0.9" opacity="0.75">
          <line x1="423.9" y1="128.0" x2="432.6" y2="123.0"/>
          <line x1="387.7" y1="82.3" x2="394.8" y2="75.2"/>
          <line x1="341.5" y1="46.9" x2="346.5" y2="38.2"/>
          <line x1="287.7" y1="24.3" x2="290.3" y2="14.6"/>
          <line x1="172.3" y1="24.3" x2="169.7" y2="14.6"/>
          <line x1="118.5" y1="46.9" x2="113.5" y2="38.2"/>
          <line x1="72.3" y1="82.3" x2="65.2" y2="75.2"/>
          <line x1="36.1" y1="128.0" x2="27.4" y2="123.0"/>
        </g>

        <!-- Chiave di Volta Architettonica Solare (Apex: 230, 16) -->
        <g class="svg-arch-keystone" transform="translate(230, 16)">
          <!-- Raggi cardinali della chiave di volta -->
          <path d="M 0 -15 V -7 M 0 7 V 15 M -15 0 H -7 M 7 0 H 15" stroke="var(--amber-warm, #C88D56)" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M -9 -9 L -5 -5 M 5 5 L 9 9 M 9 -9 L 5 -5 M -5 5 L -9 9" stroke="var(--amber-warm, #C88D56)" stroke-width="0.85" stroke-linecap="round" stroke-dasharray="2 2"/>
          <!-- Cartiglio a rombo smussato -->
          <polygon points="0,-11 11,0 0,11 -11,0" fill="#FAF8F5" stroke="var(--semilla-dark, #2B2623)" stroke-width="1.2"/>
          <!-- Mirino e centro solare -->
          <circle cx="0" cy="0" r="4.8" stroke="var(--amber-warm, #C88D56)" stroke-width="1.05" fill="none"/>
          <circle cx="0" cy="0" r="1.8" fill="var(--amber-warm, #C88D56)"/>
        </g>

        <!-- Zoccolo / Plinto di base architettonico -->
        <g class="svg-arch-plinth" stroke="var(--semilla-dark, #2B2623)">
          <line x1="-2" y1="670" x2="14" y2="670" stroke-width="1.3" stroke-linecap="round"/>
          <circle cx="6" cy="658" r="2" fill="var(--amber-warm, #C88D56)" stroke="none" opacity="0.6"/>
          <line x1="446" y1="670" x2="462" y2="670" stroke-width="1.3" stroke-linecap="round"/>
          <circle cx="454" cy="658" r="2" fill="var(--amber-warm, #C88D56)" stroke="none" opacity="0.6"/>
        </g>
      </svg>`,

    // Illustrazione Hero: Riviera di Levante, Calice, Caraffa e Botanica
    heroStillLife: `
      <svg id="hero-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" fill="none" class="semilla-hero-svg w-full h-auto max-w-full drop-shadow-sm">
        <!-- Velature acquerello fuori registro -->
        <g id="hero-velature" opacity="0.18">
          <circle class="hero-wash" data-cx="424" data-cy="116" cx="424" cy="116" r="32" fill="#D69656" />
          <path class="hero-wash" data-cx="278" data-cy="141" d="M278 102 C254 128, 250 165, 280 180 C310 165, 306 128, 278 102 Z" fill="#5C7B67" />
          <ellipse class="hero-wash" data-cx="206" data-cy="208" cx="206" cy="208" rx="26" ry="12" transform="rotate(-18 206 208)" fill="#5C7B67" />
          <path class="hero-wash" data-cx="176" data-cy="304" d="M151 292 C154 316, 198 316, 201 292 C186 297, 166 297, 151 292 Z" fill="#C47D4E" />
          <ellipse class="hero-wash" data-cx="392" data-cy="368" rx="28" ry="15" fill="#E0B054" />
          <path class="hero-wash" data-cx="442" data-cy="228" d="M362 228 Q440 216, 522 230 Q440 242, 362 228 Z" fill="#4E7991" />
        </g>
        <!-- Tracciato Unico Continuo (One-Line Art) - Gutkowskino Ortigia -->
        <path id="hero-oneline-path" d="M 72 472 C 76 450, 80 432, 88 425 C 215 415, 385 415, 512 425 C 520 432, 524 450, 528 472 C 520 452, 514 415, 504 385 C 504 352, 504 322, 504 295 C 504 276, 472 276, 472 294 C 472 306, 488 308, 490 296 C 492 284, 464 282, 462 302 C 460 332, 458 362, 454 385 C 440 385, 426 385, 412 385 C 419 383, 425 374, 425 366 C 435 355, 452 355, 458 364 C 449 373, 434 372, 425 366 C 418 345, 360 345, 355 368 C 353 379, 368 385, 386 385 C 405 384, 415 376, 413 366 C 410 354, 368 354, 365 367 C 364 376, 378 380, 389 378 C 391 371, 389 361, 389 357 C 389 365, 388 373, 373 371 C 385 369, 395 368, 406 366 C 394 368, 382 374, 376 385 C 358 385, 334 385, 312 385 C 292 386, 272 386, 252 385 C 237 382, 231 365, 236 342 C 212 334, 208 282, 252 275 C 218 285, 221 329, 237 337 C 242 310, 250 286, 254 260 C 255 253, 250 251, 252 249 C 264 243, 294 243, 306 249 C 294 255, 276 255, 268 251 C 254 231, 230 217, 204 221 C 188 223, 173 217, 169 209 C 181 203, 196 211, 204 221 C 200 207, 206 191, 216 187 C 220 197, 214 211, 208 220 C 216 220, 221 232, 214 241 C 207 242, 205 230, 214 220 C 226 217, 234 201, 246 197 C 248 207, 240 219, 232 223 C 248 227, 264 239, 276 251 C 277 231, 278 217, 278 207 C 265 203, 257 195, 263 191 C 270 193, 275 199, 279 204 C 280 195, 280 187, 280 181 C 261 179, 245 163, 247 143 C 253 153, 264 165, 274 173 C 257 157, 251 133, 259 115 C 266 127, 272 145, 278 163 C 268 141, 270 111, 280 94 C 290 111, 292 141, 282 163 C 288 145, 294 127, 301 115 C 309 133, 303 157, 286 173 C 296 165, 307 153, 313 143 C 315 163, 299 179, 282 181 C 283 204, 284 229, 284 251 C 298 233, 316 211, 332 191 C 324 183, 326 173, 334 185 C 342 173, 352 163, 358 157 C 354 167, 344 179, 338 187 C 350 183, 360 181, 364 185 C 352 191, 340 193, 330 197 C 340 201, 348 201, 352 205 C 340 207, 328 205, 318 213 C 310 225, 306 239, 304 249 C 304 274, 318 301, 321 324 C 296 330, 266 330, 252 324 C 268 332, 298 332, 322 326 C 325 348, 322 376, 312 385 C 275 386, 220 385, 176 385 C 152 385, 146 379, 176 378 C 206 379, 200 385, 176 385 C 176 365, 176 345, 176 326 C 198 322, 206 288, 200 254 C 188 248, 164 248, 152 254 C 164 260, 188 260, 200 254 C 203 268, 204 280, 203 292 C 188 286, 164 286, 149 292 C 164 298, 188 298, 203 292 C 200 312, 190 325, 176 326 C 158 325, 148 310, 149 295 C 130 295, 110 295, 92 295 C 92 278, 122 278, 122 293 C 122 305, 106 307, 104 295 C 102 282, 82 284, 84 295 C 86 240, 110 175, 156 154 C 166 142, 174 146, 178 154 C 182 146, 190 140, 202 148 C 208 140, 212 132, 218 126 C 226 116, 234 120, 236 128 C 240 120, 248 114, 258 122 C 295 78, 355 76, 396 102 C 416 86, 448 96, 446 118 C 444 138, 412 144, 400 126 C 390 108, 408 88, 426 94 C 440 98, 442 120, 428 128 C 416 134, 406 122, 412 112 C 418 104, 428 110, 424 118 C 418 148, 395 195, 368 226 C 386 234, 402 218, 418 226 C 434 234, 452 218, 468 226 C 484 234, 502 222, 518 228" stroke="#354F60" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </svg>`,

    dividerBotanical: `
      <div class="med-section-divider svg-draw-trigger" aria-hidden="true">
        <svg viewBox="0 0 880 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="svg-ink-path" d="M30 22 H355" stroke="currentColor" stroke-width="0.85" stroke-dasharray="4 4"/>
          <path class="svg-ink-path" d="M525 22 H850" stroke="currentColor" stroke-width="0.85" stroke-dasharray="4 4"/>
          <path class="svg-ink-path" d="M368 22 C392 22, 406 11, 440 11 C474 11, 488 22, 512 22" stroke="currentColor" stroke-width="1.1"/>
          <path class="svg-ink-path" d="M368 22 C392 22, 406 33, 440 33 C474 33, 488 22, 512 22" stroke="currentColor" stroke-width="1.1"/>
          <path class="svg-ink-path" d="M396 18 C388 10, 376 12, 382 20" stroke="var(--sage-green)" stroke-width="1"/>
          <path class="svg-ink-path" d="M484 18 C492 10, 504 12, 498 20" stroke="var(--sage-green)" stroke-width="1"/>
          <circle class="svg-ink-path" cx="440" cy="22" r="4.5" stroke="var(--amber-warm)" stroke-width="1.2"/>
          <circle cx="418" cy="22" r="1.8" fill="var(--amber-warm)"/>
          <circle cx="462" cy="22" r="1.8" fill="var(--amber-warm)"/>
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

    // Frecce Sartoriali del Carosello Galleria (Stile Bussola di Levante)
    carouselArrowPrev: `
      <svg class="azure-nav-svg" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="22" cy="22" r="20" stroke="currentColor" stroke-width="1.1" stroke-dasharray="3 3" opacity="0.65"/>
        <circle cx="22" cy="22" r="16" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>
        <path d="M25 15 L17 22 L25 29" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="17" cy="22" r="1.6" fill="var(--amber-warm, #C88D56)"/>
      </svg>`,

    carouselArrowNext: `
      <svg class="azure-nav-svg" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="22" cy="22" r="20" stroke="currentColor" stroke-width="1.1" stroke-dasharray="3 3" opacity="0.65"/>
        <circle cx="22" cy="22" r="16" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>
        <path d="M19 15 L27 22 L19 29" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="27" cy="22" r="1.6" fill="var(--amber-warm, #C88D56)"/>
      </svg>`,

    // Fregi Angolari Architettonici dello Stage Galleria
    stageCorners: `
      <svg class="azure-stage-corner-svg tl" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 2 26 V 2 H 26" stroke="var(--semilla-dark, #2B2623)" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M 7 20 V 7 H 20" stroke="var(--amber-warm, #C88D56)" stroke-width="0.85" stroke-dasharray="2 2"/>
        <circle cx="7" cy="7" r="1.8" fill="var(--amber-warm, #C88D56)"/>
      </svg>
      <svg class="azure-stage-corner-svg tr" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 26 26 V 2 H 2" stroke="var(--semilla-dark, #2B2623)" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M 21 20 V 7 H 8" stroke="var(--amber-warm, #C88D56)" stroke-width="0.85" stroke-dasharray="2 2"/>
        <circle cx="21" cy="7" r="1.8" fill="var(--amber-warm, #C88D56)"/>
      </svg>
      <svg class="azure-stage-corner-svg bl" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 2 2 V 26 H 26" stroke="var(--semilla-dark, #2B2623)" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M 7 8 V 21 H 20" stroke="var(--amber-warm, #C88D56)" stroke-width="0.85" stroke-dasharray="2 2"/>
        <circle cx="7" cy="21" r="1.8" fill="var(--amber-warm, #C88D56)"/>
      </svg>
      <svg class="azure-stage-corner-svg br" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 26 2 V 26 H 2" stroke="var(--semilla-dark, #2B2623)" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M 21 8 V 21 H 8" stroke="var(--amber-warm, #C88D56)" stroke-width="0.85" stroke-dasharray="2 2"/>
        <circle cx="21" cy="21" r="1.8" fill="var(--amber-warm, #C88D56)"/>
      </svg>`,

    // Motivo Marino di raccordo tra stage e striscia miniature
    carouselMotif: `
      <svg viewBox="0 0 200 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 20 12 Q 45 4, 70 12 T 95 12" stroke="var(--blue-levante, #4E6E82)" stroke-width="1" stroke-dasharray="3 3"/>
        <circle cx="100" cy="12" r="3.5" stroke="var(--amber-warm, #C88D56)" stroke-width="1.2" fill="#FAF8F5"/>
        <circle cx="100" cy="12" r="1.2" fill="var(--amber-warm, #C88D56)"/>
        <path d="M 105 12 Q 130 4, 155 12 T 180 12" stroke="var(--blue-levante, #4E6E82)" stroke-width="1" stroke-dasharray="3 3"/>
      </svg>`,

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
    // Fonte unica e veritiera: tutte le foto gestite nel pannello Admin (data.gallery.photos)
    const photos = data.gallery?.photos || [];
    return photos.map(p => {
      let filterCat = 'piatti';
      if (p.category === 'ambiente') {
        filterCat = /Terrazza|Mare|Calici|Lungomare|Scogliera/i.test(p.title) ? 'terrazza' : 'sala';
      }
      return {
        url: p.image,
        title: p.title || 'Scatto Gutkowskino',
        tag: filterCat === 'terrazza' ? 'Terrazza & Mare' : (filterCat === 'sala' ? 'Sala & Tavola' : 'Dalla Cucina'),
        filterCat
      };
    }).filter(item => Boolean(item.url));
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
    initAzureCarousel(unifiedPhotos);
    initLightbox();
    initSectionNavDots();
    initHeroSvgInteractiveDisplacement();
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
    const section = el('section', { className: 'postcard-stage section-hero hero-arch-section', id: 'hero' });

    section.innerHTML = `
      <!-- Glifo Laterale Verticale di Levante (Sinistra) -->
      <div class="semilla-side-svg semilla-side-left" aria-hidden="true">
        <svg viewBox="0 0 54 360" fill="none" xmlns="http://www.w3.org/2000/svg" class="med-vertical-svg">
          <path d="M27 10 Q 34 50, 27 90 T 27 170 T 27 250 T 27 350" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/>
          <path d="M27 14 L30 25 L41 27 L30 29 L27 40 L24 29 L13 27 L24 25 Z" stroke="var(--amber-warm)" stroke-width="1.15"/>
          <circle cx="27" cy="27" r="14" stroke="currentColor" stroke-width="0.75" stroke-dasharray="2 2"/>
          <path d="M14 90 Q 27 78, 40 90" stroke="var(--blue-levante)" stroke-width="1.2"/>
          <path d="M20 185 H34 M22 185 V196 C18 206, 17 222, 21 238 C23 246, 27 252, 27 256 H27 C27 252, 31 246, 33 238 C37 222, 36 206, 32 196 V185" stroke="currentColor" stroke-width="1"/>
          <circle cx="27" cy="275" r="4" stroke="var(--amber-warm)" stroke-width="1"/>
          <circle cx="27" cy="305" r="2.5" fill="var(--amber-warm)"/>
        </svg>
      </div>

      <div class="hero-arch-container">
        <!-- Colonna Sinistra: Dialogo Editoriale Monumentale -->
        <div class="hero-arch-content">
          <div class="hero-arch-eyebrow-wrap">
            <span class="hero-arch-eyebrow-line" aria-hidden="true"></span>
            <span class="hero-arch-eyebrow">ORTIGIA · SUL MARE DI LEVANTE</span>
          </div>

          <h1 class="hero-arch-headline">
            <span class="hero-arch-title-row">
              <span class="hero-arch-word hero-word-main">Cucina</span>
              <span class="hero-arch-word hero-word-main">vegetale</span>
            </span>
            <span class="hero-arch-title-row">
              <span class="hero-arch-word hero-word-main">d'autore</span>
            </span>
            <span class="hero-arch-title-row">
              <em class="hero-arch-word hero-word-italic">sul mare di Levante</em>
            </span>
          </h1>

          <p class="hero-arch-manifesto">
            Un bistrot botanico affacciato sulla scogliera di Ortigia: dove l'orto siciliano e i vini naturali incontrano l'orizzonte dorato dello Ionio.
          </p>

          <div class="hero-arch-actions">
            <a href="#cucina" class="hero-arch-pill hero-arch-pill-primary">
              <span>MENU</span>
              <svg class="hero-pill-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6H10M6 2L10 6L6 10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <a href="#contatti" class="hero-arch-pill hero-arch-pill-secondary">
              <span>PRENOTA</span>
            </a>
          </div>

          <!-- Riga Coordinate & Metadati (come nel mockup allegato) -->
          <div class="hero-arch-coords-line">
            <span>37°01'34"N · 15°17'40"E · ORTIGIA · SIRACUSA</span>
          </div>
        </div>

        <!-- Colonna Destra: Arco Monumentale Botanico con Sigillo Terrazza -->
        <div class="hero-arch-visual">
          <div class="hero-botanical-arch-stage" data-tilt-frame data-lightbox="assets/images/hero-finestra-arco.webp" title="Clicca per ingrandire la Terrazza">
            <img 
              src="assets/images/hero-botanical-arch.webp" 
              alt="Bistrot Gutkowskino - Finestra ad arco panoramica e botanica sulla terrazza di Ortigia" 
              class="hero-botanical-arch-img"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    `;
    return section;
  }

  // ───── 3. SEZIONE 1 POST-HERO: Filosofia (Sfondo Calce & Salvia Botanica + Outline SVG Carciofo/Arco) ─────
  function buildPhilosophy(data) {
    const section = el('section', { className: 'section-philosophy', id: 'filosofia' });

    section.innerHTML = `
      <!-- Divisore Architettonico Superiore (come nel mockup allegato) -->
      <div class="philo-top-divider" aria-hidden="true">
        <svg viewBox="0 0 540 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 12 H225" stroke="#C88D56" stroke-width="0.8" opacity="0.6"/>
          <path d="M232 12 C245 6, 260 6, 270 6 C280 6, 295 6, 308 12 C295 18, 280 18, 270 18 C260 18, 245 18, 232 12 Z" stroke="#2B2623" stroke-width="1.1" fill="#FAF8F5"/>
          <circle cx="270" cy="12" r="2.2" fill="#C88D56"/>
          <circle cx="254" cy="12" r="1.3" fill="#2B2623" opacity="0.7"/>
          <circle cx="286" cy="12" r="1.3" fill="#2B2623" opacity="0.7"/>
          <path d="M315 12 H520" stroke="#C88D56" stroke-width="0.8" opacity="0.6"/>
        </svg>
      </div>

      <div class="container philo-container">
        <div class="philo-split-grid">
          
          <!-- Colonna Sinistra: Composizione Botanica con Doppia Cornice -->
          <div class="philo-visual-col reveal-up">
            <div class="philo-botanical-stage" data-tilt-frame data-lightbox="https://cdn.thefork.com/tf-lab/image/upload/w_1400,q_auto,f_auto,q_auto,f_jpg/restaurant/20b6c5c8-f1e3-462d-87be-e8523872b76d/3a353356-b582-4e31-8648-0eb702d983ab.png" title="Clicca per ingrandire gli spazi di Gutkowskino">
              <img 
                src="assets/images/philosophy-botanical-visual.webp" 
                alt="Atmosfera e dettagli botanici del Bistrot Gutkowskino a Ortigia"
                class="philo-botanical-img"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <!-- Colonna Destra: Dialogo Editoriale e Manifesto -->
          <div class="philo-content-col reveal-up delay-1">
            <div class="philo-eyebrow-wrap">
              <span class="philo-eyebrow">L'Anima Botanica del Bistrot</span>
            </div>

            <h2 class="philo-display-headline">
              <span class="philo-title-line">L'orto siciliano,</span>
              <em class="philo-title-em">la pietra e lo Ionio</em>
            </h2>

            <p class="philo-lead-statement">
              Gutkowskino è il bistrot vegetale dell'Hotel Gutkowski: una cucina contemporanea che lavora esclusivamente con il raccolto quotidiano del mercato di Ortigia e dei piccoli agricoltori aretusei.
            </p>

            <div class="philo-body-text">
              <p>
                Ogni portata nasce dalla lavorazione integrale del vegetale: fondi bruni di verdura ridotti lentamente, cotture alla brace, emulsioni di erbe spontanee, creme di mandorla e pistacchio, oli essenziali agli agrumi e fiori eduli.
              </p>
              <p>
                In sala, le pareti a calce illuminate dalle catenarie calde e il legno vivo si aprono sulla terrazza affacciata sugli scogli del Lungomare di Levante: un dialogo naturale tra il verde dell'orto e del mare di Ortigia.
              </p>
            </div>
          </div>

        </div>
      </div>
    `;
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
    const d = data.spaces || {};
    const section = el('section', { className: 'section-azure-gallery section-pad', id: 'galleria-azzurra' });

    section.innerHTML = `
      ${MED_SVGS.watermarkMarine}
      <div class="container">
        ${MED_SVGS.dividerMarine}
        <div class="azure-gallery-header reveal-up">
          <div>
            <span class="section-kicker azure">Sul Lungomare di Levante · Ortigia</span>
            <h2 class="heading-display">La terrazza sul mare, <em>la sala e i piatti</em></h2>
            <p class="azure-header-sub">${d.sub || "Dalla terrazza con vista sullo Ionio alla sala illuminata da candele: ogni spazio è pensato per un'esperienza intima e accogliente."}</p>
          </div>

          <div class="azure-filter-bar" id="azureFilters">
            <div class="azure-filter-pill" id="azureFilterPill"></div>
            <button class="azure-filter-btn active" data-filter="all">Tutti gli scatti</button>
            <button class="azure-filter-btn" data-filter="terrazza">Terrazza & Mare</button>
            <button class="azure-filter-btn" data-filter="piatti">I Piatti</button>
            <button class="azure-filter-btn" data-filter="sala">Sala & Dettagli</button>
          </div>
        </div>

        <!-- CAROUSEL COMPATTO D'AUTORE -->
        <div class="azure-carousel-wrap reveal-up delay-1">
          
          <!-- Stage Principale: Foto Grande in Risalto -->
          <div class="azure-stage" id="azureStage" data-lightbox="" title="Clicca per ingrandire">
            <div class="azure-stage-media">
              <img id="azureStageImgA" class="azure-stage-img active" src="" alt="" decoding="async">
              <img id="azureStageImgB" class="azure-stage-img" src="" alt="" decoding="async">
              <div class="azure-stage-wash" aria-hidden="true"></div>
            </div>

            <!-- Fregio Angolare Architettonico SVG -->
            <div class="azure-stage-corners" aria-hidden="true">
              ${MED_SVGS.stageCorners}
            </div>

            <!-- Frecce di Navigazione Carosello SVG -->
            <button class="azure-nav-btn prev" id="azurePrevBtn" aria-label="Foto precedente">
              ${MED_SVGS.carouselArrowPrev}
            </button>
            <button class="azure-nav-btn next" id="azureNextBtn" aria-label="Foto successiva">
              ${MED_SVGS.carouselArrowNext}
            </button>

            <!-- Didascalia e Metadati dello Scatto -->
            <div class="azure-stage-caption">
              <div class="asc-left">
                <span class="asc-tag" id="azureStageTag">Terrazza & Mare</span>
                <h3 class="asc-title" id="azureStageTitle">Terrazza Gutkowskino sul Mare</h3>
              </div>
              <div class="asc-right">
                <span class="asc-counter" id="azureStageCounter">01 / 16</span>
                <span class="asc-zoom-hint">Ingrandisci ↗</span>
              </div>
            </div>
          </div>

          <!-- Fregio Marino di Raccordo SVG -->
          <div class="azure-carousel-motif" aria-hidden="true">
            ${MED_SVGS.carouselMotif}
          </div>

          <!-- Striscia Miniature Compatta (Filmstrip / Thumbnails) -->
          <div class="azure-thumbs-container">
            <button class="azure-thumbs-scroll-btn prev" id="azureThumbScrollPrev" aria-label="Scorri miniature a sinistra">‹</button>
            <div class="azure-thumbs-track" id="azureThumbsTrack"></div>
            <button class="azure-thumbs-scroll-btn next" id="azureThumbScrollNext" aria-label="Scorri miniature a destra">›</button>
          </div>

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

  // Carosello Galleria Compatto con Miniature Multiple e Controlli SVG
  function initAzureCarousel(allPhotos) {
    if (!allPhotos || !allPhotos.length) return;

    const filterBar = document.getElementById('azureFilters');
    const pill = document.getElementById('azureFilterPill');
    const btns = filterBar ? filterBar.querySelectorAll('.azure-filter-btn') : [];

    const stage = document.getElementById('azureStage');
    const imgA = document.getElementById('azureStageImgA');
    const imgB = document.getElementById('azureStageImgB');
    const titleEl = document.getElementById('azureStageTitle');
    const tagEl = document.getElementById('azureStageTag');
    const counterEl = document.getElementById('azureStageCounter');
    const prevBtn = document.getElementById('azurePrevBtn');
    const nextBtn = document.getElementById('azureNextBtn');
    const thumbsTrack = document.getElementById('azureThumbsTrack');
    const thumbScrollPrev = document.getElementById('azureThumbScrollPrev');
    const thumbScrollNext = document.getElementById('azureThumbScrollNext');

    let activeFilter = 'all';
    let filteredPhotos = [...allPhotos];
    let currentIndex = 0;
    let activeImgEl = imgA;
    let inactiveImgEl = imgB;

    function movePillTo(button) {
      if (!button || !pill || window.innerWidth <= 860) return;
      const barRect = filterBar.getBoundingClientRect();
      const btnRect = button.getBoundingClientRect();
      const x = btnRect.left - barRect.left;
      pill.style.transform = `translateX(${x}px)`;
      pill.style.width = `${btnRect.width}px`;
    }

    function renderThumbs() {
      if (!thumbsTrack) return;
      thumbsTrack.innerHTML = filteredPhotos.map((p, idx) => `
        <button class="azure-thumb-card ${idx === currentIndex ? 'active' : ''}" data-thumb-idx="${idx}" aria-label="Foto ${idx + 1}: ${p.title}">
          <div class="azure-thumb-img-wrap">
            <img src="${p.url}" alt="${p.title}" loading="lazy" decoding="async">
          </div>
          <span class="azure-thumb-num">0${idx + 1}</span>
        </button>
      `).join('');

      thumbsTrack.querySelectorAll('.azure-thumb-card').forEach(card => {
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetIdx = parseInt(card.dataset.thumbIdx, 10);
          if (targetIdx !== currentIndex) {
            goToSlide(targetIdx);
          }
        });
      });

      scrollActiveThumbIntoView();
    }

    function scrollActiveThumbIntoView() {
      if (!thumbsTrack) return;
      const activeThumb = thumbsTrack.querySelector(`.azure-thumb-card[data-thumb-idx="${currentIndex}"]`);
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    function updateActiveThumbClass() {
      if (!thumbsTrack) return;
      thumbsTrack.querySelectorAll('.azure-thumb-card').forEach(card => {
        const idx = parseInt(card.dataset.thumbIdx, 10);
        card.classList.toggle('active', idx === currentIndex);
      });
      scrollActiveThumbIntoView();
    }

    function updateStagePhoto(photo) {
      if (!photo) return;

      // Crossfade fluido a due layer
      if (inactiveImgEl) {
        inactiveImgEl.src = photo.url;
        inactiveImgEl.alt = photo.title;
        inactiveImgEl.classList.add('active');
      }
      if (activeImgEl) {
        activeImgEl.classList.remove('active');
      }

      // Scambia riferimenti
      const temp = activeImgEl;
      activeImgEl = inactiveImgEl;
      inactiveImgEl = temp;

      // Aggiorna testi e contatore
      if (titleEl) titleEl.textContent = photo.title || 'Scatto Gutkowskino';
      if (tagEl) tagEl.textContent = photo.tag || 'Terrazza & Mare';
      const numStr = String(currentIndex + 1).padStart(2, '0');
      const totalStr = String(filteredPhotos.length).padStart(2, '0');
      if (counterEl) counterEl.textContent = `${numStr} / ${totalStr}`;

      // Aggiorna lightbox trigger
      if (stage) stage.dataset.lightbox = photo.url;
    }

    function goToSlide(newIndex) {
      if (!filteredPhotos.length) return;
      currentIndex = (newIndex + filteredPhotos.length) % filteredPhotos.length;
      updateStagePhoto(filteredPhotos[currentIndex]);
      updateActiveThumbClass();
    }

    function applyCategoryFilter(filter) {
      activeFilter = filter;
      if (filter === 'all') {
        filteredPhotos = [...allPhotos];
      } else {
        filteredPhotos = allPhotos.filter(p => p.filterCat === filter);
      }
      if (!filteredPhotos.length) filteredPhotos = [...allPhotos];
      currentIndex = 0;
      updateStagePhoto(filteredPhotos[0]);
      renderThumbs();
    }

    // Event listeners frecce carosello
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    // Scroll manuale striscia miniature
    if (thumbScrollPrev) {
      thumbScrollPrev.addEventListener('click', () => {
        if (thumbsTrack) thumbsTrack.scrollBy({ left: -260, behavior: 'smooth' });
      });
    }

    if (thumbScrollNext) {
      thumbScrollNext.addEventListener('click', () => {
        if (thumbsTrack) thumbsTrack.scrollBy({ left: 260, behavior: 'smooth' });
      });
    }

    // Touch swipe sullo stage
    if (stage) {
      let touchStartX = 0;
      let touchStartY = 0;
      stage.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      stage.addEventListener('touchend', (e) => {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            goToSlide(currentIndex + 1);
          } else {
            goToSlide(currentIndex - 1);
          }
        }
      }, { passive: true });
    }

    // Filtri Categoria
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        movePillTo(btn);
        applyCategoryFilter(btn.dataset.filter);
        if (window.innerWidth <= 860) {
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    });

    requestAnimationFrame(() => {
      const activeBtn = filterBar ? filterBar.querySelector('.azure-filter-btn.active') : null;
      if (activeBtn) movePillTo(activeBtn);
    });

    window.addEventListener('resize', () => {
      const activeBtn = filterBar ? filterBar.querySelector('.azure-filter-btn.active') : null;
      if (activeBtn) movePillTo(activeBtn);
    });

    // Inizializza primo stato
    applyCategoryFilter('all');
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
  
  /* ── Spostamento Fluido e Organico della Porzione di SVG su Hover/Mousemove ── */
  function initHeroSvgInteractiveDisplacement() {
    const heroArt = document.querySelector('.semilla-hero-art');
    const heroSvg = document.getElementById('hero-svg');
    const oneLinePath = document.getElementById('hero-oneline-path');
    const washes = document.querySelectorAll('.hero-wash');

    if (!heroArt || !heroSvg || !oneLinePath) return;

    // Parse the initial path into command chunks and coordinate points
    const rawD = oneLinePath.getAttribute('d');
    const tokens = rawD.trim().split(/([MCQzZ])/).filter(t => t.trim().length > 0);
    const parsedCommands = [];
    const baseCoords = []; // flat array of [x, y] coordinates

    let currentCmd = null;
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i].trim();
      if ('MCQzZ'.includes(t)) {
        currentCmd = t;
      } else {
        const nums = t.split(/[\s,]+/).filter(Boolean).map(Number);
        const startIndex = baseCoords.length / 2;
        for (let j = 0; j < nums.length; j += 2) {
          baseCoords.push(nums[j], nums[j + 1]);
        }
        parsedCommands.push({
          cmd: currentCmd,
          pointCount: nums.length / 2,
          startIndex
        });
      }
    }

    const totalPoints = baseCoords.length / 2;
    const currentOffsets = new Float32Array(totalPoints * 2);
    const targetOffsets = new Float32Array(totalPoints * 2);

    // Wash state tracking
    const washStates = Array.from(washes).map(wash => ({
      el: wash,
      cx: parseFloat(wash.getAttribute('data-cx') || 0),
      cy: parseFloat(wash.getAttribute('data-cy') || 0),
      currX: 0,
      currY: 0,
      targetX: 0,
      targetY: 0
    }));

    let isHovering = false;
    let mouseSvgX = -9999;
    let mouseSvgY = -9999;
    let animFrameId = null;

    function getSvgCoordinates(e) {
      const rect = heroSvg.getBoundingClientRect();
      const scaleX = 600 / rect.width;
      const scaleY = 500 / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }

    function onPointerMove(e) {
      isHovering = true;
      const coords = getSvgCoordinates(e);
      mouseSvgX = coords.x;
      mouseSvgY = coords.y;

      const RADIUS = 115;
      const STRENGTH = 15;

      // Update target displacement for points near cursor
      for (let i = 0; i < totalPoints; i++) {
        const bx = baseCoords[i * 2];
        const by = baseCoords[i * 2 + 1];
        const dx = bx - mouseSvgX;
        const dy = by - mouseSvgY;
        const dist = Math.hypot(dx, dy);

        if (dist < RADIUS && dist > 0.001) {
          // Smooth bell-curve falloff
          const factor = Math.pow(1 - dist / RADIUS, 2);
          const push = factor * STRENGTH;
          targetOffsets[i * 2] = (dx / dist) * push;
          targetOffsets[i * 2 + 1] = (dy / dist) * push;
        } else {
          targetOffsets[i * 2] = 0;
          targetOffsets[i * 2 + 1] = 0;
        }
      }

      // Update target displacement for watercolor washes
      washStates.forEach(w => {
        const dx = w.cx - mouseSvgX;
        const dy = w.cy - mouseSvgY;
        const dist = Math.hypot(dx, dy);
        const WASH_RADIUS = 140;
        if (dist < WASH_RADIUS && dist > 0.001) {
          const factor = Math.pow(1 - dist / WASH_RADIUS, 1.8);
          const push = factor * 18;
          w.targetX = (dx / dist) * push;
          w.targetY = (dy / dist) * push;
        } else {
          w.targetX = 0;
          w.targetY = 0;
        }
      });

      if (!animFrameId) {
        animFrameId = requestAnimationFrame(animateLoop);
      }
    }

    function onPointerLeave() {
      isHovering = false;
      mouseSvgX = -9999;
      mouseSvgY = -9999;
      for (let i = 0; i < totalPoints * 2; i++) {
        targetOffsets[i] = 0;
      }
      washStates.forEach(w => {
        w.targetX = 0;
        w.targetY = 0;
      });
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(animateLoop);
      }
    }

    function animateLoop() {
      let maxDiff = 0;
      const LERP = 0.12;

      // Lerp one-line path points
      for (let i = 0; i < totalPoints * 2; i++) {
        const diff = targetOffsets[i] - currentOffsets[i];
        currentOffsets[i] += diff * LERP;
        const absDiff = Math.abs(diff);
        if (absDiff > maxDiff) maxDiff = absDiff;
      }

      // Lerp washes
      washStates.forEach(w => {
        const dx = w.targetX - w.currX;
        const dy = w.targetY - w.currY;
        w.currX += dx * LERP;
        w.currY += dy * LERP;
        const diff = Math.max(Math.abs(dx), Math.abs(dy));
        if (diff > maxDiff) maxDiff = diff;
        w.el.style.transform = `translate(${w.currX.toFixed(2)}px, ${w.currY.toFixed(2)}px)`;
      });

      // Build updated path string
      let newD = '';
      for (let c = 0; c < parsedCommands.length; c++) {
        const cmdObj = parsedCommands[c];
        newD += (c === 0 ? '' : ' ') + cmdObj.cmd;
        for (let p = 0; p < cmdObj.pointCount; p++) {
          const ptIdx = cmdObj.startIndex + p;
          const x = (baseCoords[ptIdx * 2] + currentOffsets[ptIdx * 2]).toFixed(1);
          const y = (baseCoords[ptIdx * 2 + 1] + currentOffsets[ptIdx * 2 + 1]).toFixed(1);
          newD += ` ${x} ${y}`;
        }
      }
      oneLinePath.setAttribute('d', newD);

      // Continue animation if still moving or settling
      if (maxDiff > 0.05 || isHovering) {
        animFrameId = requestAnimationFrame(animateLoop);
      } else {
        // Snap back cleanly to original path when settled
        oneLinePath.setAttribute('d', rawD);
        washStates.forEach(w => {
          w.currX = 0;
          w.currY = 0;
          w.el.style.transform = '';
        });
        animFrameId = null;
      }
    }

    heroArt.addEventListener('pointermove', onPointerMove, { passive: true });
    heroArt.addEventListener('pointerleave', onPointerLeave, { passive: true });
  }

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

    // Dettaglio Superiore: Mirino / Croce solare in cerchio (⊕)
    const topSymbol = el('div', { className: 'camera-nav-symbol top', 'aria-hidden': 'true' });
    topSymbol.innerHTML = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.3"/>
      <path d="M10 2.5 V17.5 M2.5 10 H17.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    </svg>`;
    dotsContainer.appendChild(topSymbol);

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

    // Dettaglio Inferiore: Asse meridiano con archi contrapposti
    const bottomSymbol = el('div', { className: 'camera-nav-symbol bottom', 'aria-hidden': 'true' });
    bottomSymbol.innerHTML = `<svg viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2 V26" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M4.5 9.5 Q10 14, 15.5 9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M4.5 18.5 Q10 14, 15.5 18.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    </svg>`;
    dotsContainer.appendChild(bottomSymbol);

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
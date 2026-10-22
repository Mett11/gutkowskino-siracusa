# Gutkowskino · Cucina Vegetale

> **Bistrot di cucina vegetale contemporanea** affacciato sul Lungomare di Levante a Ortigia (Siracusa), all'interno dello storico **Hotel Gutkowski**.

[![Website](https://img.shields.io/badge/Live_Site-GitHub_Pages-2D543D?style=flat-square)](https://mett11.github.io/gutkowskino-siracusa/)
[![Instagram](https://img.shields.io/badge/Instagram-@gutkowskino__-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/gutkowskino_/)
[![TheFork](https://img.shields.io/badge/TheFork-Prenota-00A680?style=flat-square)](https://www.thefork.it/ristorante/gutkowskino-r706715)

---

## 🌿 Panoramica

Sito vetrina editoriale, materico e *data-driven* per il bistrot **Gutkowskino**. L'architettura separa completamente i contenuti (dati del menu, orari, storia, recensioni, galleria) dalla logica di rendering e dal design system.

### Caratteristiche
- **Data-Driven Architecture**: Tutto il contenuto è centralizzato in [`data/restaurant.json`](data/restaurant.json).
- **Tipografia Editoriale Mediterranea**: *Instrument Serif*, *Marcellus* e *Lora*.
- **Palette Materica**: Ispirata alla pietra calcarea di Ortigia, all'argilla, al verde cappero e al profondo mare Ionio.
- **Micro-interazioni & Performance**: Nessun framework o dipendenza pesante, Vanilla JavaScript puro, CSS Custom Properties, layout fluido e responsive mobile-first.
- **Stato Cucina in Tempo Reale**: Calcolo dinamico dello stato di apertura della cucina con indicatore visivo.
- **Accessibilità & SEO**: Meta tag Open Graph completi, semantica HTML5 curata.

---

## 📁 Struttura del Progetto

```text
├── index.html              # Markup principale e meta tags SEO/Social
├── css/
│   └── style.css           # Design system, token CSS, layout fluido e animazioni
├── js/
│   └── app.js              # Motore di rendering dinamico e micro-interazioni
├── data/
│   └── restaurant.json     # Unica fonte di verità per dati, menu e contenuti
├── .gitignore
└── README.md
```

---

## 🚀 Sviluppo Locale

Non richiede build step. Puoi avviare qualsiasi web server statico nella cartella di progetto:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Apri quindi il browser su `http://localhost:8080`.

---

## 📍 Informazioni

- **Indirizzo**: Lungomare di Levante Elio Vittorini 18, 96100 Siracusa (Ortigia)
- **Hotel**: Piano 0, Hotel Gutkowski
- **Prenotazioni**: [TheFork](https://www.thefork.it/ristorante/gutkowskino-r706715) / Tel: 0931 465830

# Jadila District Evaluation Survey

A dependency-free web project (HTML + CSS + JS, no libraries) for collecting residents' opinions on developing the Jadila district. The UI is Arabic (RTL).

## Project structure

```
M/
├── index.html            # Semantic markup + SVG icon library
├── css/
│   ├── tokens.css        # Design tokens (colors, shadows, sizes)
│   ├── base.css          # Reset + fonts
│   ├── layout.css        # Top progress bar + hero + orbs + scroll reveal
│   ├── components.css    # Cards + options + buttons + animations
│   └── responsive.css    # Mobile-first: 380px / 600px / 960px
├── js/
│   ├── config.js         # API URL + constants (edit here)
│   ├── survey-data.js    # All questions and sections (single source)
│   ├── utils.js          # esc + helpers
│   ├── storage.js        # Draft persistence in localStorage
│   ├── api.js            # collect() + submitSurvey()
│   ├── validation.js     # Validation rules
│   ├── renderer.js       # Form rendering + icons
│   ├── progress.js       # Progress bar + counter
│   └── main.js           # Entry point + event wiring
└── assets/
    └── favicon.svg
```

Scripts are classic (no `type="module"`, shared via `window.Survey*` namespaces), so the page works both from `file://` and over `http`.

## Icons & animation

- 7 stroke-style SVG icons defined as `<symbol>` in `index.html` and used via `<use>` — lightweight, tinted with `currentColor`, each section getting its own background tint from the `ICONS` table in `renderer.js`.
- The hero has 3 animated blurred orbs (`drift`) plus staggered content entrance (`rise`).
- Sections and cards reveal gradually on scroll via `IntersectionObserver` in `main.js` (the `rv` class).
- Animated shine on the progress bar (`shimmer`) and the submit button, a pop (`pop`) when an answer is selected, and a drawn checkmark on the success screen (`draw`).
- All animations are disabled under `prefers-reduced-motion`.

## Running

Double-click `index.html` to open it directly, or serve it locally:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Customizing

- **Submit endpoint:** `js/config.js` (`SCRIPT_URL`)
- **Questions:** `js/survey-data.js` (`sections` array)
- **Colors:** `css/tokens.css`
- **Validation rules:** `js/validation.js`
- **Section icons:** `index.html` (the symbols) + the `ICONS` table in `js/renderer.js`

## Features

- Responsive / adaptive (mobile / tablet / desktop)
- Full validation with per-question error messages + scroll to first error
- Correct, accessible choice controls (`label` + `input` + `:has(:checked)`)
- Conditional "Other" text field merged into the submission
- Auto-saved draft + progress bar + success screen

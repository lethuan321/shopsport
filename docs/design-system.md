# Sport Store Design System

This project uses a shared design system layer in `assets/css/design-system.css` and `assets/js/design-system.js`.

## Tokens

- Colors: primary `#2563eb`, primary dark `#1d4ed8`, success `#22c55e`, warning `#f59e0b`, danger `#ef4444`.
- Dark mode surfaces avoid pure black and use `#0f172a`, `#111827`, and `#1e293b`.
- Radius: `12px`, `16px`, `20px`.
- Shadows: `--ds-shadow-sm`, `--ds-shadow-md`, `--ds-shadow-lg`.
- Transition: `--ds-transition` equals `0.3s` with a shared easing curve.

## Components

- Buttons: `.ds-btn`, `.ds-btn--primary`, `.ds-btn--ghost`.
- Cards: `.ds-card`, `.ds-card--lift`.
- Empty states: `.ds-empty`.
- Alerts: `.ds-alert`, `.ds-alert--success`, `.ds-alert--danger`.
- Loading: `.ds-skeleton`, `.ds-progress`, `.ds-button-loading`.
- Mobile UX: `.ds-mobile-nav` is injected for storefront pages.

## Accessibility

- Visible `:focus-visible` ring.
- Reduced-motion support with `prefers-reduced-motion`.
- Images receive lazy loading and async decoding via JS.
- Mobile nav uses `aria-label` and `aria-current`.

## Dark Mode

`design-system.js` reads `sport-store-theme` from `localStorage`, falls back to system preference, and applies `data-theme` to the document element.

## SCSS

SCSS architecture is scaffolded in `assets/scss/` for future build integration. The compiled runtime CSS currently lives in `assets/css/`.

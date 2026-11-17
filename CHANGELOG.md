# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `tokens.json` as the single source of truth for palette, radii, shadows and type scale; `scripts/sync-tokens.js` checks `tokens.css` and regenerates the `reference.html` DATA block (`npm run tokens:check` / `tokens:sync`)
- Automated gates: `test:contrast` (36 light/dark WCAG pairs), `test:a11y` (axe-core in real Chrome, six pages, zero-violation gate), `test:links` (local files + anchors), `validate:html` (html-validate with a project config)
- Playwright visual-regression setup (`playwright.config.js`, `tests/visual/pages.spec.js`) covering six desktop pages plus wallet/sidebar at 375px; baselines are generated with `npm run test:visual:update`
- CI `quality` job runs token/HTML/contrast/link/axe checks on every push and PR

### Changed
- Lighthouse accessibility assertion tightened from 0.9 to 1.0 (desktop and mobile); performance stays a warning to avoid flaky shared-runner failures
- Dark-mode `--danger-fg` raised from `#ff453a` to `#ff6b61` so 14px destructive text reaches 5.0:1 on `--surface`

### Fixed
- Fixed WCAG contrast violation: `account.html` tier feature bullet marks used `--text-4` (decorative-only, ~2.2:1) for functional content — raised to `--text-2` (~5.1:1)
- Fixed all remaining small-text contrast failures (71 axe nodes across 6 pages): 10–14px `--text-3`/`--text-4` text now uses `--text-2` / new `--text-caption`; heat tags use `--heat-ink`; `--success-fg` darkened to `#146c2e`; destructive text uses `--danger-fg`
- Replaced closed-sheet `aria-hidden`-only hiding with `inert` + focus return in `reference.html`, `account.html`, and `wallet.html` — no more keyboard focus traps behind invisible overlays
- `wallet.html` tab bar rewritten as native `<button>`s with `aria-current="page"`; removed invalid `aria-controls` references; added a visible “取消” button and a `role="status"` confirmation when an option is chosen
- Touch targets raised to 44px effective (switch, checkbox/radio, slider, menu rows, toolbar buttons, text links) without changing their visual size
- Focus indicator changed from the 1.29:1 translucent halo to a 2px solid `--accent` ring with 2px offset across every page
- Added the missing `glass-base`, `glass-clear-base`, `glass-check`, `glass-radio`, `glass-slider`, and `glass-context` classes to all five degradation blocks; added a global `prefers-reduced-motion` fallback
- Added `--z-scrim` (85) and `--z-system` (110); home indicator and toasts now use them instead of borrowing popover/toast tiers
- Fixed `.manage-link.danger` in `account.html` using `--text-2` (indistinguishable from normal link) — changed to `--danger-fg` to visually mark destructive action
- Fixed `tokens.css` `--grad-green` missing space after colon (formatting inconsistency)
- Fixed hardcoded `rgba(0,0,0,0.05)` backgrounds in `account.html` (`.btn-quiet`, `.sheet .ghost`) — now uses new `--btn-quiet-bg` token with dark-mode variant (fixes invisible quiet buttons in dark mode)
- Fixed `var` declarations in `account.html`, `wallet.html`, and `reference.html` focus-trap code — changed to `const` for consistency with modern JS
- Fixed scroll event listeners in `account.html` and `wallet.html` lacking rAF throttling — added `requestAnimationFrame` debounce
- Renamed `$()` helper in `reference.html` to `byId()` to avoid global namespace collision with jQuery/Prototype
- Added missing `reference.html` to mobile Lighthouse CI job (desktop tested 3 pages, mobile only tested 2)
- Replaced non-existent `dequelabs/axe-api-action@v1` with `@axe-core/cli` in CI — axe scan now covers all six pages (reference, account, wallet, toolbar, sidebar, liquid-controls) and requires no API key
- Fixed `reference.html` four-level grey swatch from `#6e6e73` to `#aeaeb2` to match `tokens.css --text-4`
- Fixed invalid font shorthand `font: 700 18px/-apple-system` in `reference.html` sheet title (line-height was parsed as font-family, declaration dropped)
- Added focus trap and `aria-hidden` toggling to `reference.html` modal sheet (aligned with `account.html` and `wallet.html` implementations)
- Filled empty `.ic` placeholder divs in `wallet.html` sheet options with Lucide SVG icons (credit-card, arrow-transfer, scan)
- Unified `components.md` segmented control class from `.seg` to `.c-seg` to match the shared CSS block
- Added `aria-labelledby` associations to all toggle switches in `account.html`
- Replaced emoji brand mark in `reference.html` with a text-based brand monogram (aligned with `icons.md` "no emoji as icons" rule)
- Fixed mixed Chinese in English documentation: `app.md` ("原型" → "prototype") and `icons.md` (rule 1 Chinese clause translated to English)
- Corrected `--link #2997ff` comment in `tokens.css` — now accurately documents as "LARGE TEXT / non-text AA only (3.0:1)" instead of misleading "WCAG AA compliant"
- Added ARIA dialog roles, focus trap, and keyboard navigation to `examples/wallet.html` (aligned with `account.html`)
- Added tab-bar ARIA to `wallet.html` — later superseded by native buttons + `aria-current` (see above), because `role="tab"` without real tabpanels made `aria-controls` invalid
- Converted wallet glass-chip links to semantic `<button>` elements

### Changed
- `reference.html` now links `tokens.css` via `<link>` and uses `var(--…)` throughout — eliminates token drift between the living style guide and the token source
- Upgraded `treosh/lighthouse-ci-action` from v11 to v12 in CI
- Raised Lighthouse accessibility threshold from 0.85 to 0.9 and best-practices threshold from 0.85 to 0.9 in `.lighthouserc.json`
- Added dark-mode, `prefers-reduced-motion`, and `prefers-reduced-transparency` support to `reference.html`
- `components.md` inline styles extracted to reusable CSS classes while preserving copy-paste usability
- `icons.md` icon count description corrected to reflect the actual curated set (20 core icons)

### Added
- New `--btn-quiet-bg` design token in `tokens.css` (light + dark mode) for quiet/ghost button backgrounds
- `examples/wallet.html` and `examples/account.html` now reference `tokens.css` via `<link>` and include dark-mode `@media` overrides
- Added `prefers-reduced-motion` and `prefers-reduced-transparency` support to `wallet.html`
- GitHub Actions CI workflow for Lighthouse + axe accessibility auditing
- `CONTRIBUTING.md`, Issue templates, and `CODEOWNERS`
- Security red-line rule in `SKILL.md` prohibiting `innerHTML` concatenation with dynamic data
- `CHANGELOG.md`

## [2.0.0] - 2026-07-29

### Changed — Breaking: dual-track glass philosophy
- **Philosophy shift**: from "glass as seasoning" to "liquid glass as the control layer material" (WWDC 2025 Liquid Glass)
- Content surfaces (articles, lists, form inputs) = solid #fff + shadow, NO glass
- Control surfaces (nav, toolbar, tab bar, sidebar, modal, popover, switches/sliders/segmented, floating buttons, checkboxes/radios, context menu) = liquid glass as MAIN material
- `patterns.md`: "Glass vs solid" decision tree → "Content surface vs Control surface" decision tree
- `SKILL.md`: philosophy rule 2, 3, 5 updated; anti-slop and self-check updated
- `design-system.md` Section 4: completely rewritten as "Liquid Glass recipe family" with two base materials, state system, dark-mode tuning, degradation ladder, concentric corner radii
- `review.md`: added "Control-layer glass audit" section with surface classification table and audit checklist
- `checklist.md`: Glass section replaced with "Glass (dual-track model)"; added ARIA & state controls section
- `app.md`: all control surfaces (nav, tab bar, sidebar, sheet) upgraded to glass state tokens; new Sidebar section; z-index tokens
- `README.md` / `README.zh-CN.md`: tagline, philosophy, file table, self-check updated for dual-track model
- `CONTRIBUTING.md`: dual-track philosophy with explicit prohibitions

### Added
- `tokens.css`: z-index hierarchy (--z-ground through --z-toast), glass material tiers (Regular/Clear), glass state variables (rest/active/pressed/scrolled), glass backgrounds (light/dark variants for regular/surface/clear), glass highlights/edges/shadows/hairlines/dim, 5-level performance degradation ladder
- `components.md`: 11 new liquid glass control-layer components (glass toolbar, tab bar, sidebar, segmented control, switch, slider, popover/dropdown, tooltip, FAB, checkbox/radio, context menu)
- `icons.md`: 5 new icons (bookmark, more-horizontal, more-vertical, sidebar, panel-right); glass-surface icon rules section
- `motion.md`: "Control-layer dynamic deformation" section (glass state transitions, materialize extension, sidebar refraction, rAF scroll handling, reduced-motion state communication, ARIA)
- `reference.html`: expanded Section 05 with control-layer glass showcase, state system demo, degradation ladder demo
- `examples/toolbar.html`: new — glass toolbar with rest/hover/scrolled states
- `examples/sidebar.html`: new — glass sidebar with collapse/expand and concentric radii
- `examples/liquid-controls.html`: new — all glass control components showcase

### Fixed
- `examples/account.html` and `examples/wallet.html`: hard-coded glass values replaced with var(--glass-*) tokens; z-index replaced with var(--z-*) tokens; glass state transitions added

## [0.1.0] - 2026-07-25

### Initial Release
- Design tokens (colors, type, radii, shadows, motion curves) with dark mode support
- Component library (nav, panels, cards, sheets, tab bars, toggles, buttons, CTA)
- Page patterns & decision trees (reading, index, dashboard, form)
- Motion specs (spring physics, interruptibility, reduced-motion media queries)
- iOS app patterns (Dynamic Island, safe areas, tab bars, bottom sheets)
- Live reference HTML (living style guide)
- Two full HTML examples (account page, wallet app)
- Line-icon system (Lucide-based, 20 curated icons)
- Review & checklist modes for auditing existing UIs
- Accessibility fixes over upstream: WCAG AA contrast, focus-visible, ARIA roles, keyboard nav
- Security fixes over upstream: replaced innerHTML with safe DOM methods

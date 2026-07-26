# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Fixed WCAG contrast violation: `account.html` tier feature bullet marks used `--text-4` (decorative-only, ~2.2:1) for functional content — changed to `--text-3` (~3.5:1)
- Fixed `.manage-link.danger` in `account.html` using `--text-2` (indistinguishable from normal link) — changed to `--danger-fg` to visually mark destructive action
- Fixed `tokens.css` `--grad-green` missing space after colon (formatting inconsistency)
- Fixed hardcoded `rgba(0,0,0,0.05)` backgrounds in `account.html` (`.btn-quiet`, `.sheet .ghost`) — now uses new `--btn-quiet-bg` token with dark-mode variant (fixes invisible quiet buttons in dark mode)
- Fixed `var` declarations in `account.html`, `wallet.html`, and `reference.html` focus-trap code — changed to `const` for consistency with modern JS
- Fixed scroll event listeners in `account.html` and `wallet.html` lacking rAF throttling — added `requestAnimationFrame` debounce
- Renamed `$()` helper in `reference.html` to `byId()` to avoid global namespace collision with jQuery/Prototype
- Added missing `reference.html` to mobile Lighthouse CI job (desktop tested 3 pages, mobile only tested 2)
- Replaced non-existent `dequelabs/axe-api-action@v1` with `@axe-core/cli` in CI — axe scan now covers all three pages (account, wallet, reference) and requires no API key
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
- Added `role="tablist"`, `role="tab"`, `aria-selected` to wallet tab bar
- Converted wallet glass-chip links to semantic `<button>` elements

### Changed
- `reference.html` now links `tokens.css` via `<link>` and uses `var(--…)` throughout — eliminates token drift between the living style guide and the token source
- Upgraded `treosh/lighthouse-ci-action` from v11 to v12 in CI
- Raised Lighthouse accessibility threshold from 0.85 to 0.9 and best-practices threshold from 0.85 to 0.9 in `.lighthouserc.json`
- Added dark-mode, `prefers-reduced-motion`, and `prefers-reduced-transparency` support to `reference.html`
- `components.md` inline styles extracted to reusable CSS classes while preserving copy-paste usability
- `icons.md` icon count description corrected to reflect actual curated set (~15 core icons)

### Added
- New `--btn-quiet-bg` design token in `tokens.css` (light + dark mode) for quiet/ghost button backgrounds
- `examples/wallet.html` and `examples/account.html` now reference `tokens.css` via `<link>` and include dark-mode `@media` overrides
- Added `prefers-reduced-motion` and `prefers-reduced-transparency` support to `wallet.html`
- GitHub Actions CI workflow for Lighthouse + axe accessibility auditing
- `CONTRIBUTING.md`, Issue templates, and `CODEOWNERS`
- Security red-line rule in `SKILL.md` prohibiting `innerHTML` concatenation with dynamic data
- `CHANGELOG.md`

## [0.1.0] - 2026-07-25

### Initial Release
- Design tokens (colors, type, radii, shadows, motion curves) with dark mode support
- Component library (nav, panels, cards, sheets, tab bars, toggles, buttons, CTA)
- Page patterns & decision trees (reading, index, dashboard, form)
- Motion specs (spring physics, interruptibility, reduced-motion media queries)
- iOS app patterns (Dynamic Island, safe areas, tab bars, bottom sheets)
- Live reference HTML (living style guide)
- Two full HTML examples (account page, wallet app)
- Line-icon system (Lucide-based, ~15 curated icons)
- Review & checklist modes for auditing existing UIs
- Accessibility fixes over upstream: WCAG AA contrast, focus-visible, ARIA roles, keyboard nav
- Security fixes over upstream: replaced innerHTML with safe DOM methods
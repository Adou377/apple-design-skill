# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Corrected `--link #2997ff` comment in `tokens.css` — now accurately documents as "LARGE TEXT / non-text AA only (3.0:1)" instead of misleading "WCAG AA compliant"
- Added ARIA dialog roles, focus trap, and keyboard navigation to `examples/wallet.html` (aligned with `account.html`)
- Added `role="tablist"`, `role="tab"`, `aria-selected` to wallet tab bar
- Converted wallet glass-chip links to semantic `<button>` elements

### Added
- `examples/wallet.html` and `examples/account.html` now reference `tokens.css` via `<link>` and include dark-mode `@media` overrides
- Added `prefers-reduced-motion` and `prefers-reduced-transparency` support to `wallet.html`
- GitHub Actions CI workflow for Lighthouse + axe accessibility auditing
- `CONTRIBUTING.md`, Issue templates, and `CODEOWNERS`
- Security red-line rule in `SKILL.md` prohibiting `innerHTML` concatenation with dynamic data
- `CHANGELOG.md`

### Changed
- `components.md` inline styles extracted to reusable CSS classes while preserving copy-paste usability
- `icons.md` icon count description corrected to reflect actual curated set (~15 core icons)

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

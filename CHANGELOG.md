# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed — accessibility & consistency remediation (2026-11-18)
- Contrast: removed every 12–13.5px use of `--text-3`; gradient overlays now use solid `#fff`. Measured 3.1–3.9:1 → ≥4.5:1.
- Closed sheets are now `inert` + `aria-hidden` (no focusable elements in the accessibility tree); removed invalid `aria-controls` references.
- Degradation ladder covers every glass class through one `:is(...)` list; `account`/`wallet` gained `prefers-contrast` and `@supports` fallbacks.
- Added a global `prefers-reduced-motion` animation stop and per-page transition reduction; removed the motion.md staggered-blur contradiction.
- `reference.html` showcase now uses real buttons, `role="switch"`, `role="slider"`, keyboard-operable segmented control and tab bar.
- Unified H1 to `clamp(28px,5vw,44px)` / 1.08, hero measure to 600px, glass transitions to `.3s var(--ease-spring)`, and z-index usage to the documented ladder.
- Replaced Unicode/emoji glyphs, ad-hoc SVG stroke widths, raw shadows/greys and 22px radius literals with tokens.
- Fixed invalid `var(--glass-blur-rest/active/scrolled)` snippets, non-throttled scroll example, 40px touch targets, and silent mobile sidebar state.
- Added `<meta name="description">`, unified `lang="zh-CN"`, fixed heading order and 5-column responsive grids, added `<noscript>` fallback.
- Fixed tag-chip contrast (`最热` 2.9:1, `热议` 4.1:1, `普通标签` 4.5:1 borderline) with new `--heat-fg` / `--x-blue-strong` tokens; corrected `reference.html` sheet z-index to `--z-modal` and its title to `h2`.

### Fixed
- Corrected contrast audit: `--text-3` (#86868b) is **3.6:1**, below AA for body text. It is now documented and enforced as large-text-only; all small functional text uses `--text-2` (#6e6e73, 5.07:1).
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
- `reference.html` now links `tokens.css` via `<link>` and reads color/radius/shadow swatches live from CSS custom properties — the remaining self-declared values are gone
- Upgraded `treosh/lighthouse-ci-action` from v11 to v12 in CI
- Raised Lighthouse accessibility threshold from 0.85 to 0.9 and best-practices threshold from 0.85 to 0.9 in `.lighthouserc.json`
- Added dark mode to `reference.html`; reduced-motion now covers the sheet (cross-fade, no travel) and decorative loops
- `components.md` inline styles extracted to reusable CSS classes while preserving copy-paste usability
- `icons.md` icon count description corrected to reflect the actual curated set (21 icons)

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
- `tokens.css`: z-index hierarchy (--z-ground through --z-toast), glass material tiers (Regular/Clear), glass state variables (rest/active/pressed/scrolled), glass backgrounds (light/dark variants for regular/surface/clear), glass highlights/edges/shadows/hairlines/dim, 4-level performance degradation ladder
- `components.md`: 11 new liquid glass control-layer components (glass toolbar, tab bar, sidebar, segmented control, switch, slider, popover/dropdown, tooltip, FAB, checkbox/radio, context menu)
- `icons.md`: 5 new icons (scan added later in Unreleased) (bookmark, more-horizontal, more-vertical, sidebar, panel-right); glass-surface icon rules section
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
- Line-icon system (Lucide-based, ~15 curated icons)
- Review & checklist modes for auditing existing UIs
- Accessibility fixes over upstream: WCAG AA contrast, focus-visible, ARIA roles, keyboard nav
- Security fixes over upstream: replaced innerHTML with safe DOM methods

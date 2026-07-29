# Checklist — the gate before "done"

Run this on any page/component before claiming it's finished. Every box must be checked or consciously waived. Pair it with a visual compare against `reference.html`.

## Surface & layout
- [ ] Page ground is `#f5f5f7` (COOL — not warm cream/beige/off-white).
- [ ] Content sits on `#fff` surfaces; container centered (`max-width` 720 reading / 1080 grid), side padding 22px.
- [ ] Sibling same-kind items use **one panel + hairline dividers** (`rgba(0,0,0,0.07)`), not separate bordered/tinted cards.
- [ ] Layout is flex/grid + `gap` — not inline elements + margin.
- [ ] Sections separated by `clamp(34px,6vw,56px)`; panels sized to content, not all equal-padded.

## Glass (dual-track model)
- [ ] **Content vs control classification**: every surface is classified — content surfaces (articles, lists, form inputs, static text) = solid `#fff` + `var(--sh-card)`/`var(--sh-panel)`; control surfaces (nav, toolbar, sidebar, modal, popover, tab bar, switches, FAB) = liquid glass.
- [ ] No `backdrop-filter` on content surfaces — articles, list rows, form inputs, static text are solid white.
- [ ] No flat `#fff` on control surfaces — nav, toolbar, sidebar, tab bar, modal, popover, switches, FAB use liquid glass.
- [ ] **Glass recipe matching**: text-bearing controls use Regular (`var(--glass-regular-blur)` + `var(--glass-regular-sat)`); controls over rich media use Clear (`var(--glass-clear-blur)` + `var(--glass-clear-sat)`).
- [ ] **State functions**: glass control surfaces have rest → active → pressed → scrolled transitions wired to `var(--glass-blur-*)`, `var(--glass-sat-*)`, `var(--glass-shadow-*)`. Blur, saturation, and shadow transition as one unit (same duration + easing).
- [ ] **Dark-mode vibrancy**: each glass surface has a `prefers-color-scheme: dark` override using `-dark` token variants (`var(--glass-bg-regular-dark)`, `var(--glass-edge-dark)`, `var(--glass-hairline-dark)`, `var(--glass-highlight-dark)`).
- [ ] **Degradation ladder**: all `.glass-*` classes covered by the 5-level ladder in `tokens.css` (reduced-transparency → reduced-data → contrast → @supports → print).
- [ ] **Concentric radii**: nested glass controls use inner radius = outer radius minus padding, pulled from named tiers (no invented in-between values).
- [ ] **z-index tokens**: all z-index uses `var(--z-*)` (ground 0, content 10, sticky 50, sidebar 60, fab 70, popover 80, modal 90, toast 100) — no hard-coded values.
- [ ] Glass-on-color (CTA) has blurred light orbs behind it (something to refract).

## Type
- [ ] System font stack (SF / PingFang) — no Inter/Roboto/Arial as the brand face.
- [ ] Big titles have **negative letter-spacing** (bigger → more negative).
- [ ] Long body line-height ≥ 1.85.
- [ ] Numbers use `tabular-nums`.
- [ ] CJK↔Latin have a half-width space between them.

## Color
- [ ] Body world is grayscale; color appears only as accent (one blue) / heat (one orange) / brand / live.
- [ ] No tinted backgrounds, colored left-bars, multi-color, or gradient washes on plain content.
- [ ] At most one accent color competing in a single view.

## Radius & shadow
- [ ] Radius taken from named tiers (pill 999 / chip 6 / thumb 12 / sheet 16 / card 18 / panel 22 / hero 26) — no ad-hoc values.
- [ ] Concentric corner radii on nested glass controls (inner radius = outer radius minus padding, lands on a named tier).
- [ ] Shadows are two-layer (tight contact + soft spread); no single hard drop-shadow; no hard black borders.
- [ ] Glass shadows use `var(--glass-shadow-*)` tokens (rest/active/pressed/scrolled/floating) — not hard-coded values.

## Motion & a11y
- [ ] Hover = gentle lift (`translateY(-2~-3px)`) or row tint, 0.15–0.25s.
- [ ] No opacity-fade entrance keyframes on async-rendered content.
- [ ] Touch targets ≥ 44px; mobile collapses to one column, secondary info hidden.
- [ ] Glass control state transitions use `var(--ease-spring)`; scroll-driven changes rAF-throttled with `passive: true`.

## ARIA & state controls
- [ ] Glass controls with state carry correct ARIA: `role="tab"` + `aria-selected` on tab bar; `role="switch"` + `aria-checked` on switches; `role="slider"` + `aria-valuenow` on sliders; `aria-expanded` on popover/sidebar triggers; `role="menu"` + `role="menuitem"` on context menus.
- [ ] Accessibility state and visual state never desync — `aria-expanded`/`aria-hidden` flip in the same handler as the glass state transition.
- [ ] Dialogs/sheets have `role="dialog"`, `aria-modal="true"`, focus trap, and Escape to close.
- [ ] Text contrast ≥ 4.5:1 for body text on glass; bump to `--text-2` over Clear glass on bright media (vibrancy).
- [ ] `prefers-reduced-motion` respected on glass state transitions (cross-fade, no travel).

## Restraint
- [ ] Removed avoidable noise: extra icons, stat padding, decorative emoji, "in today's world" filler.
- [ ] Every element carries meaning; nothing is there just to look "rich / techy / designed".

## Final
- [ ] Side-by-side, it looks like it belongs on the same page as `reference.html`.

## Motion (only if the UI has interactive layers — full list in motion.md)
- [ ] Press feedback on pointer-down; enter/exit same path, origin anchored to trigger.
- [ ] `--ease-spring`/`--ease-out-quart` (no `linear`/default `ease`); no overshoot without momentum.
- [ ] Glass materializes (blur+scale+opacity together); only `transform`/`opacity` animated.
- [ ] Glass control surfaces use state tokens (`var(--glass-blur-rest/active/scrolled)`, `var(--glass-shadow-*)`) — blur, saturation, and shadow transition as one unit.
- [ ] Scroll-driven glass state changes are rAF-throttled; `passive: true` on the listener.
- [ ] `prefers-reduced-motion` / `prefers-reduced-transparency` / `prefers-contrast` all handled (5-level degradation ladder).

## Interaction foundations
- [ ] Every screen answers: where am I / where can I go / what's there / how out.
- [ ] Controls sit next to what they affect; labels are specific, not generic.
- [ ] Inline validation; undo over confirmation dialogs (confirm only irreversible).
- [ ] Sticky chrome uses scroll-edge (hairline appears only when content scrolls beneath via `var(--glass-shadow-scrolled)` + `var(--glass-hairline-*)`), not a permanent border.

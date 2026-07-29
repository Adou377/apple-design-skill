# Review mode — audit an existing UI against the system

Use when the user has existing CSS / a page / a component and asks "is this Apple enough / what can be improved / make it consistent". You are a design reviewer with the design-system as the ruler.

## First: find the real visual surface
Code that *generates content* (markdown, JSON, data) usually has no design of its own — the look lives in the **rendering layer**. Before reviewing, locate where pixels are actually decided:
- A content generator (`gen_*.mjs`, a CMS, an API) → the design lever is its **theme CSS / template / component**, not the generator.
- Say so explicitly. Don't pretend to "design-review" a JSON builder; point at the CSS/template it feeds.

## Process
1. **Inventory.** Read the target file(s) in full. Note every color, font, radius, shadow, border, spacing decision.
2. **Classify surfaces.** For every surface, decide: is it a **content surface** (articles, lists, form inputs, static text — must be solid `#fff` + shadow) or a **control surface** (nav, toolbar, sidebar, modal, popover, tab bar, switches, FAB — must be liquid glass)? Flag any mismatch: glass on content = P0; flat white on a control = P0.
3. **Score against `design-system.md`** on each axis: ground/surface, color (accent vs grayscale), type (stack + tracking + line-height), spacing/radius/shadow tiers, glass usage (dual-track: correct material on each surface type), hierarchy, responsive.
4. **Run `checklist.md` + the anti-slop list** (in `SKILL.md`). Flag each violation with `file:line` and the exact offending value.
5. **Prioritize** findings:
   - **P0** — breaks the aesthetic outright (wrong accent hue everywhere, warm ground, fragmented colored cards, generic font as brand face, glass on content surfaces, flat white on control surfaces, hard-coded z-index).
   - **P1** — inconsistency / drift (ad-hoc radius, #333 instead of #1d1d1f, hard divider instead of hairline, glass missing state transitions, missing dark-mode glass tuning).
   - **P2** — polish (slightly-off radius tier, spare emoji, minor spacing, non-concentric inner radius).
6. **Map each fix to a token** (`tokens.css`) and a component/pattern. Never propose a raw value a token already names. Glass fixes map to `var(--glass-*)`; z-index fixes map to `var(--z-*)`.
7. **Implement toward `reference.html`**, then **re-render and compare** (screenshot the result; it must read like the same family). Fix until it does.

## Output format
Lead with one honest sentence on where the design lever actually is. Then a prioritized table:

| Pri | Finding (`file:line`) | Now | → Apple |
|---|---|---|---|
| P0 | accent everywhere `rgba(255,125,77)` | warm orange | Apple blue `#0071e3`; grayscale body |
| P0 | `h2 border-left:4px orange` | colored left-bar (fragmentation) | drop bar; hierarchy via weight/size |
| P0 | `article .glass-bg` `style.css:42` | glass on content surface | solid `#fff` + `var(--sh-card)`; remove `backdrop-filter` |
| P0 | `.tabbar background:#fff` `app.css:18` | flat white on control surface | `var(--glass-bg-regular-light)` + glass tokens |
| P1 | text `#333` | generic grey | `#1d1d1f` / `#6e6e73` |
| P1 | `hr 2px rgba(0,0,0,.1)` | hard rule | hairline `1px rgba(0,0,0,.07)` |
| P1 | `.glass-nav` no state transitions `style.css:88` | static glass | add rest→scrolled transitions via `var(--glass-*)` |

End with the single highest-leverage change (usually: re-theme the one CSS file that everything renders through).

## Control-layer glass audit

After the general review, run a focused audit on every surface to verify the **dual-track model** is correctly applied. This catches the two most common glass mistakes: glassifying content and rendering controls as flat white.

### Surface type classification table

| Surface | Type | Expected material | Common violation |
|---|---|---|---|
| Article / prose body | Content | Solid `#fff` + `var(--sh-card)` | Glass blur applied (P0) |
| List rows / panel | Content | Solid `#fff` + hairline | Glass blur applied (P0) |
| Form input / textarea | Content | Solid `#fff` + `var(--sh-card)` | Glass blur applied (P0) |
| Static text / labels | Content | Solid (no material) | Glass blur applied (P0) |
| Nav / toolbar | Control | Regular glass `var(--glass-bg-regular-*)` | Flat `#fff` (P0) |
| Tab bar | Control | Regular glass + `role="tablist"` | Flat `#fff` (P0) |
| Sidebar | Control | Regular glass at `var(--z-sidebar)` | Flat `#fff` (P0) |
| Modal / sheet | Control | Surface glass `var(--glass-bg-surface-*)` | Flat `#fff` (P0) |
| Popover / dropdown | Control | Regular glass at `var(--z-popover)` | Flat `#fff` (P0) |
| Tooltip | Control | Regular glass at `var(--z-popover)` | Flat `#fff` (P0) |
| Switch / slider | Control | Clear glass `var(--glass-bg-clear-*)` | Flat `#fff` (P0) |
| Segmented control | Control | Regular glass track | Flat `#fff` track (P0) |
| FAB | Control | Regular glass at `var(--z-fab)` + `var(--glass-shadow-floating)` | Flat `#fff` (P0) |
| Checkbox / radio | Control | Clear glass + accent on checked | Flat `#fff` no glass (P1) |
| Context menu | Control | Regular glass at `var(--z-popover)` | Flat `#fff` (P0) |

### Audit checklist

- [ ] Every `backdrop-filter` in the CSS is on a **control surface** — never on articles, list rows, form inputs, or static text.
- [ ] Every control surface (nav, toolbar, sidebar, tab bar, modal, popover, tooltip, switch, FAB) uses `var(--glass-*)` tokens — not hard-coded `rgba()` blur/sat values.
- [ ] Glass control surfaces have **state transitions** (rest → active → scrolled) wired to `var(--glass-blur-*)`, `var(--glass-sat-*)`, `var(--glass-shadow-*)`.
- [ ] Dark-mode glass tuning present: each glass surface has a `prefers-color-scheme: dark` override using the `-dark` token variants.
- [ ] Z-index values use `var(--z-*)` tokens — no hard-coded `z-index: 50`, `z-index: 80`, etc.
- [ ] Concentric corner radii on nested glass controls (popover → inner items; toolbar → inner pills).
- [ ] The 5-level degradation ladder in `tokens.css` covers all `.glass-*` classes used on the page.
- [ ] ARIA attributes present on stateful glass controls (`aria-expanded`, `aria-selected`, `aria-checked`, `role="tablist"`/`"tab"`).

## Worked example (real)
**Target:** a WeChat-article generator's theme CSS (doocs "default"), reached via two `gen_*.mjs` content scripts.
- **Lever:** the scripts emit markdown/JSON; the look is entirely in `theme.css`. Reviewed the CSS, not the scripts.
- **P0 found:** primary accent was warm orange `rgba(255,125,77)` on links / strong / inline-code / h3; `h2`/`blockquote` had orange colored left-bars + orange tint backgrounds; body text `#333`. Every one is an anti-slop hit (color-as-decoration, colored left-bar fragmentation, generic grey, warm accent). A `backdrop-filter: blur(12px)` was also applied to the article body (glass on a content surface — dual-track violation).
- **Fix:** accent → Apple blue `#0071e3`; grayscale body `#1d1d1f`/`#6e6e73`; dropped the colored left-bars (heading hierarchy now from weight+size); blockquote → light-grey panel + faint hairline rule; `hr` → hairline; inline code → grey chip; heat-orange reserved only for genuine "hottest" emphasis; titles negative-tracked; removed a 3-line emoji CTA pile per the restraint rule; removed `backdrop-filter` from the article body (content surface stays solid white); the sticky nav bar was re-themed to use `var(--glass-bg-regular-light)` + `var(--glass-blur-rest)` + `var(--glass-sat-rest)` with a rest→scrolled state transition.
- **Result:** the article body now reads as the same Apple family as its (already-Apple) cover image. Verified by re-render.

The lesson: the most valuable review output is often *"these N files all render through ONE theme that's off-system — re-theme that, and everything downstream becomes consistent."*

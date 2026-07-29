# Apple Liquid Glass — design system spec

The full reference. `SKILL.md` is the workflow + philosophy; this is the detailed ground truth. Values live in `tokens.css`; components in `components.md`; the rendered showcase in `reference.html`.

---

## 0. Philosophy (priority order when deciding)
1. **Unified surface > fragmented cards.** Group sibling content on one white panel + hairline dividers.
2. **Dual-track materials: glass is seasoning on content, the main material on controls.** Content surfaces (articles, lists, form inputs, static text) = solid `#fff` + shadow. Control surfaces (nav, toolbar, sidebar, modal, popover, tab bar, switches, FAB) = liquid glass — dynamic, state-aware, content-adaptive.
3. **Restraint is luxury on content surfaces.** Solve with whitespace + hierarchy before adding borders/fills/icons/numbers.
4. **Hierarchy from weight + size + grayscale**, not color. Color = accent only.
5. **Quality is in the details.** Negative tracking, tabular-nums, hairlines, gentle lift, concentric corner radii, state-aware glass deformation, 5-level degradation ladder.

## 1. Color

### Neutrals (skeleton)
| Role | Value |
|---|---|
| Page ground | `#f5f5f7` (cool — never warm/cream) |
| Surface / card | `#ffffff` |
| Row hover | `#fbfbfd` |
| Text primary | `#1d1d1f` |
| Text body / secondary | `#424245` (long body) / `#6e6e73` (summary, meta) |
| Text tertiary | `#86868b` |
| Text quaternary / placeholder | `#aeaeb2` |
| Faint (numbers, arrows) | `#d2d2d7` |
| Hairline divider | `rgba(0,0,0,0.07)` |

### Accents (emphasis ONLY)
| Role | Value |
|---|---|
| Apple blue (action/link/focus) | `#0071e3` (on tint: `#0066cc`) |
| Indigo (gradient 2nd stop) | `#5e5ce6` |
| Platform/brand (e.g. X) | `#1d9bf0` |
| Heat (hottest) | text `#ff6b00`, bg `rgba(255,107,0,0.1)` |
| Live / online | `#30d158` (pulsing) |

### Signature gradients (hero / CTA / placeholder art ONLY)
- blue-purple `linear-gradient(135deg,#0a84ff,#5e5ce6)` · warm `#ff9f0a→#ff375f` · green-blue `#30d158→#0a84ff` · CTA `#0071e3→#5e5ce6`

> **Forbidden:** full-bleed gradient washes, inventing new hues, warm cream/beige ground, multiple accent colors at once.

## 2. Type

Stack (always system; never Inter/Roboto):
```
-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display',
'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif
```
`-webkit-font-smoothing: antialiased;`

| Role | Size | Weight | Tracking | Line-height |
|---|---|---|---|---|
| H1 | `clamp(27px,5vw,46px)` | 700 | `-0.03em` | 1.1–1.18 |
| H2 | `clamp(20px,3.4vw,26px)` | 700 | `-0.02em` | 1.25 |
| H3 / item title | `15.5–18px` | 600 | `-0.01em` | 1.4–1.45 |
| Long body | `clamp(16px,2.6vw,18px)` | 400 | — | **1.85–1.9** |
| Summary / lede | `15–19px` | 400 | — | 1.55–1.7 |
| meta / byline | `12–13.5px` | 400–550 | — | 1.6 |
| Tag / chip | `11–12px` | 500–650 | — | — |

**Iron rules:** titles negative tracking (bigger = more negative); long body line-height ≥ 1.85; numbers `font-variant-numeric: tabular-nums`; multiline clamp via `-webkit-line-clamp`.

**Refinements (from Apple's typography practice):**
- `font-optical-sizing: auto` on the root — SF ships optical size tables; one line, free quality.
- **Leading tracks size inversely** (the table above encodes it — state it as the rule): tight on large display text, loose on body; tighten for dense data UI, loosen for tall-ascender scripts.
- **Respect the user's text size**: prefer `rem`/`em` for spacing tied to text (padding around copy, gaps in text stacks) so layout scales with user font settings. Existing px projects: adopt on new surfaces; don't mass-convert.
- Hierarchy = weight + size + leading **as a set**; emphasize with weight before size (presence without extra space).

## 3. Spacing · radius · shadow

**Radius tiers** (don't invent in-between): pill/button/tag `999px` · tiny mark/brand monogram `6px` · thumbnail `12px` · **overlay sheet/modal button `16px`** · card `18px` · panel `22px` · hero/CTA `26px`. (The sheet-button tier exists because full-width stacked actions in an overlay want a touch more radius than a thumbnail but less than a card — without it, builds improvise a one-off `14px`.)

**Shadow** (always two-layer; never one hard shadow):
- card `0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.05)`
- panel `0 1px 3px rgba(0,0,0,.05), 0 14px 40px rgba(0,0,0,.05)`
- hover lift `0 12px 32px rgba(0,0,0,.1)` (with `translateY(-3px)`)
- colored CTA `0 20px 54px rgba(0,113,227,.24)` (tinted)
- **overlay (modal/sheet/popover)** `0 2px 8px rgba(0,0,0,.10), 0 30px 80px rgba(0,0,0,.24)` — deeper than panel (it floats above a dimmed page), **still two-layer**. Don't ship a single `0 30px 80px` — that's the one-hard-shadow trap in overlay clothing.

**Component greys** — a meter/progress track and a toggle-off track need a fill grey that's *visible but quiet*; use `--track #e8e8ed` (between `--hover` and `--faint`), not a hand-picked one-off. Toggle-on fill = the view's one accent.

**Touch targets** — controls need ≥44px **hit area** even when the visual is smaller (an iOS-style toggle is ~26px tall but its clickable box should reach 44px; pad the control or make the whole row the target).

**Layout:** reading container `max-width:720px`; grid/dense `1080px`; side padding `22px`; section gap `clamp(34px,6vw,56px)`. Always flex/grid + `gap` (never inline + margin).

## 4. Liquid Glass recipe family

Liquid Glass is the **main material for control surfaces** — dynamic, state-aware, content-adaptive. It is *not* applied to content surfaces (articles, lists, form inputs, static text remain solid `#fff`). All values below are token-driven; never hard-code a raw blur/sat/shadow that a `--glass-*` token already names.

### Two base materials

Apple's HIG defines two glass variants — map them to web `backdrop-filter` via tokens:

| Material | Blur | Saturation | Use when |
|---|---|---|---|
| **Regular** | `var(--glass-regular-blur)` (20px) | `var(--glass-regular-sat)` (180%) | Text-bearing controls: nav, toolbar, sidebar, modal, popover, tab bar. Default when legibility matters. |
| **Clear** | `var(--glass-clear-blur)` (10px) | `var(--glass-clear-sat)` (100%) | Floating over rich media (photos, video). Highly translucent — prioritize seeing the content behind. |

On native Apple platforms these are `Glass.regular` / `Glass.clear` (SwiftUI); on the web we approximate with `backdrop-filter` — the dynamic light refraction of native Liquid Glass cannot be fully replicated.

**Regular (text-bearing control):**
```css
background: var(--glass-bg-regular-light);
backdrop-filter: saturate(var(--glass-regular-sat)) blur(var(--glass-regular-blur));
-webkit-backdrop-filter: saturate(var(--glass-regular-sat)) blur(var(--glass-regular-blur));
border-bottom: 1px solid var(--hairline);
box-shadow: var(--glass-shadow-rest);
```

**Clear (over rich media):**
```css
background: var(--glass-bg-clear-light);
border: var(--glass-edge-light);
backdrop-filter: blur(var(--glass-clear-blur));
-webkit-backdrop-filter: blur(var(--glass-clear-blur));
```
If the underlying content is bright, add `var(--glass-dim)` as a dimming layer behind the clear element to preserve contrast.

Glass needs **something to refract**: place blurred light orbs (`filter:blur(46–50px)` translucent circles) behind glass elements on a colored CTA.

### State system (rest → active → pressed → scrolled)

Glass is **state-aware** — blur, saturation, and shadow shift to communicate interaction. All four states use tokens:

| State | Blur | Saturation | Shadow | Highlight |
|---|---|---|---|---|
| **Rest** | `var(--glass-blur-rest)` | `var(--glass-sat-rest)` | `var(--glass-shadow-rest)` | `var(--glass-highlight-light)` |
| **Active** (pointer-down) | `var(--glass-blur-active)` | `var(--glass-sat-active)` | `var(--glass-shadow-active)` | `var(--glass-highlight-pressed)` |
| **Pressed** (selected/commit) | `var(--glass-blur-rest)` | `var(--glass-sat-rest)` | `var(--glass-shadow-pressed)` | `var(--glass-highlight-pressed)` |
| **Scrolled** (content beneath) | `var(--glass-blur-scrolled)` | `var(--glass-sat-scrolled)` | `var(--glass-shadow-scrolled)` | `var(--glass-highlight-light)` |

```css
.glass-control {
  background: var(--glass-bg-regular-light);
  backdrop-filter: saturate(var(--glass-sat-rest)) blur(var(--glass-blur-rest));
  -webkit-backdrop-filter: saturate(var(--glass-sat-rest)) blur(var(--glass-blur-rest));
  box-shadow: var(--glass-shadow-rest);
  transition: backdrop-filter .3s var(--ease-spring), box-shadow .3s var(--ease-spring),
              background .3s var(--ease-spring);
}
.glass-control:active {
  backdrop-filter: saturate(var(--glass-sat-active)) blur(var(--glass-blur-active));
  -webkit-backdrop-filter: saturate(var(--glass-sat-active)) blur(var(--glass-blur-active));
  box-shadow: var(--glass-shadow-active);
}
```

### Dark mode tuning

Glass backgrounds, highlights, and edges are light/dark adaptive. In dark mode, backgrounds darken, highlights dim (white inset becomes near-invisible), and edges thin out. Each token has a `-light` / `-dark` pair:

```css
@media (prefers-color-scheme: dark) {
  .glass-control {
    background: var(--glass-bg-regular-dark);
    box-shadow: var(--glass-shadow-rest);
  }
  .glass-clear {
    background: var(--glass-bg-clear-dark);
    border: var(--glass-edge-dark);
  }
}
```
Dark glass hairlines use `var(--glass-hairline-dark)`; highlights switch to `var(--glass-highlight-dark)`.

### Degradation ladder (5 levels)

Glass degrades gracefully through standard media queries — no hardware sniffing. The ladder in `tokens.css` covers every `.glass-*` class:

| Level | Trigger | Behavior |
|---|---|---|
| 1 | `prefers-reduced-transparency: reduce` | Solid `var(--surface)`, no `backdrop-filter`, hairline border. |
| 2 | `prefers-reduced-data: save` | Blur only (drop saturation) — lighter payload. |
| 3 | `prefers-contrast: more` | Solid `var(--surface)`, no blur, stronger border (`rgba(0,0,0,0.35)`). |
| 4 | `@supports not (backdrop-filter)` | Near-opaque fallback (`rgba(245,245,247,0.94)` / dark `0.94`). |
| 5 | `@media print` | White background, no blur, no shadow, `#ccc` border. |

Add the `.glass-perf` utility class to force Regular blur on a specific element when the full degradation chain isn't needed.

### Concentric corner radii

When a glass control surface contains nested elements (a glass popover with inner buttons, a glass toolbar with inner pills), use **concentric radii**: inner element radius = outer radius minus its inset padding. This creates the visually continuous curve Apple uses across nested materials.

```
outer radius 22px → inner padding 8px → inner radius 14px
outer radius 18px → inner padding 6px → inner radius 12px
```
Always pull from the named tier set: `--r-pill 999 · --r-chip 6 · --r-thumb 12 · --r-sheet 16 · --r-card 18 · --r-panel 22 · --r-hero 26`. Never invent an in-between radius to "look right" — instead adjust the padding so the inner radius lands on a tier.

### Material depth grammar (how materials express hierarchy)
- **Weight encodes hierarchy.** Heavier/darker materials separate *structural* regions (sidebars, sheets); lighter materials mark *interactive* elements (buttons, chips). **Never stack a light translucent surface on another** — legibility collapses.
- **Bigger surface = thicker material.** A full sheet gets stronger blur + deeper shadow than a small chip. Context-aware shadow: `var(--glass-shadow-floating)` for FABs and floating islands; `var(--glass-shadow-active)` for engaged controls.
- **Dim to focus, separate to keep flow.** A *modal* task = surface + dimming scrim (background pushed back via `var(--glass-dim)`). A *parallel, non-blocking* panel = translucency + offset **without** a scrim, so flow isn't broken. Stacked sheets progressively dim/push back each parent.
- **Vibrancy for text on glass.** Over translucent surfaces don't use flat gray text — raise contrast, bump weight slightly, add a small letter-spacing increase. Put color on a solid layer, never on the glass foreground.
- **Scroll edge, not hard divider.** Under sticky chrome, don't ship a permanent 1px border. Show the hairline/shadow **only once content actually scrolls beneath** (toggle a `.scrolled` class; at top the nav sits flush on the ground). Use `var(--glass-shadow-scrolled)` and `var(--glass-hairline-light)` / `var(--glass-hairline-dark)`:
```css
.nav { border-bottom: 1px solid transparent; transition: border-color .3s, box-shadow .3s; }
.nav.scrolled { border-bottom-color: var(--glass-hairline-light); box-shadow: var(--glass-shadow-scrolled); }
```
```js
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });
```

### z-index hierarchy

Control surfaces stack on a tokenized z-index ladder. Never hard-code a raw z-index — use `var(--z-*)`:

| Token | Value | Surface |
|---|---|---|
| `--z-ground` | 0 | Page background |
| `--z-content` | 10 | Normal content flow |
| `--z-sticky` | 50 | Sticky nav, toolbar |
| `--z-sidebar` | 60 | Sidebar |
| `--z-fab` | 70 | Floating action button, floating island |
| `--z-popover` | 80 | Dropdown, popover, tooltip |
| `--z-modal` | 90 | Modal, full-screen scrim |
| `--z-toast` | 100 | Global toast |

✅ **Glass (control surfaces):** nav, toolbar, tab bar, sidebar, modal, popover/dropdown/tooltip, switches/sliders/segmented controls, floating buttons (FAB), checkboxes/radios, context menu, labels inside a colored CTA, source badge on hero art.
❌ **Not glass (content surfaces):** articles, list rows, form inputs, static text, plain content cards, between white blocks — solid `#fff` + `var(--sh-card)` / `var(--sh-panel)`.

## 5. Components
See `components.md` for paste-ready code. Core set: glass nav · page hero · **unified panel list** · card grid · segmented pill control · tags · buttons · colored CTA with orbs · live dot. Two segmented styles: black pill (strong filter) / white pill (light toggle). Glass control-layer set: glass toolbar · glass tab bar · glass sidebar · glass segmented control · glass switch · glass slider · glass popover/dropdown · glass tooltip · glass FAB · glass checkbox/radio · glass context menu — all using `var(--glass-*)` tokens with state transitions and dark mode.

## 6. Motion
- **Static content — tiny budget**: hover lift (card `translateY(-2~-3px)` + deeper shadow, `0.15–0.25s var(--ease-out-quart)`), pulse dot, segmented slide. That's enough.
- **No entrance opacity-fade keyframes on async content** (a re-render can stick it at 0). Render directly; rely on hover/interaction motion.
- **Interactive layers (dialog/sheet/popover/drawer) — full fluid treatment**: see `motion.md`. Key rules: feedback on pointer-down; enter `~400ms var(--ease-spring)` / exit `~250-300ms` same path; `transform-origin` anchored to trigger; glass **materializes** (blur+scale+opacity together); transitions (not keyframes) so re-trigger mid-flight reverses; three `prefers-reduced-*` media queries mandatory.

## 7. Responsive
- Mobile-first; all sizes via `clamp()`. One design adapts PC↔mobile — don't build two.
- Breakpoint ~`680px`: two-column → one; hide secondary info (`.hide-sm`); denser default layout. Touch targets ≥ 44px.

## 8. Content & copy
- CJK + Latin: half-width space between them ("iPhone 17 Pro 号称…"). Full-width CJK punctuation; half-width for model numbers/digits.
- Numbers must mean something; delete stat padding. Emoji only as *informational* signals (live dot, 🔥 heat) — never decorative confetti.
- Voice: confident, professional, lightly opinionated; never breathless filler.

## 9. Self-check
Use the checklist in `SKILL.md` before claiming done; and compare visually to `reference.html`.

## 10. Token quick-ref
```
ground #f5f5f7 · surface #fff · hover #fbfbfd
text #1d1d1f #424245 #6e6e73 #86868b #aeaeb2 #d2d2d7 · hairline rgba(0,0,0,.07)
accent #0071e3 · indigo #5e5ce6 · X #1d9bf0 · heat #ff6b00 · live #30d158
radius pill 999 · chip 6 · thumb 12 · sheet 16 · card 18 · panel 22 · hero 26
shadow card / panel / lift / cta / overlay (all two-layer) · track #e8e8ed
container 720 read / 1080 grid · pad 22 · section clamp(34,6vw,56)
z-index ground(0) content(10) sticky(50) sidebar(60) fab(70) popover(80) modal(90) toast(100)
glass Regular: blur20 sat180 · Clear: blur10 sat100
glass states: blur rest/active(+4)/scrolled(+2) · sat rest/active(200)/scrolled(rest)
glass bg: regular-light/dark · surface-light/dark · clear-light/dark
glass highlights/edges/shadows(rest/active/pressed/scrolled/floating)/hairlines/dim
glass degradation: reduced-transparency → reduced-data → contrast → @supports → print
```

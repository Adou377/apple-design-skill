# Motion — fluid interaction layer

> Distilled and adapted from [emilkowalski/skills](https://github.com/emilkowalski/skills) `apple-design` (MIT © 2026 Emil Kowalski),
> itself distilled from Apple's WWDC talks (*Designing Fluid Interfaces* 2018, *The Details of UI Typography* 2020, *Principles of Great Design* 2026).
> Adapted here to this skill's restraint philosophy and no-framework CSS-first stack.

**Scope split — the one decision that keeps restraint:**

| Surface | Motion budget |
|---|---|
| **Static content** (articles, lists, panels) | Tiny: hover lift, pulse dot, segmented slide. **No entrance keyframes on async content** (re-render can stick it at 0). |
| **Interactive layers** (dialog, sheet, popover, drawer, anything the user summons/dismisses) | Full fluid treatment below. This is where "feels like Apple" lives. |

The through-line: **motion starts from the current on-screen value, inherits the user's velocity, and can be grabbed or reversed at any instant.**

---

## 1. Response — kill latency

- **Feedback on pointer-down, not release.** A button highlights the instant it's pressed; waiting for `click` feels dead.
- Feedback is **continuous during** the interaction (drag/slider tracks 1:1), never only at the end.
- Audit every latency on the input path: debounces, artificial timers, transition waits.

```css
.button:active { transform: scale(0.97); transition: transform 100ms ease-out; }
```

## 2. Springs (or spring-like easing) — parameters that matter

Apple's two designer parameters: **damping ratio** (1.0 = no overshoot; ~0.8 = slight bounce) and **response** (time-to-target feel, not fixed duration).

| Interaction | Damping | Response |
|---|---|---|
| Default UI (menus, dialogs appearing) | `1.0` (critically damped) | `0.3–0.4` |
| Drawer / sheet | `0.8` | `0.3` |
| Move / reposition | `1.0` | `0.4` |

**House rule: overshoot only when the gesture carried momentum** (a flick, a throw). Bounce on a menu that merely faded in feels wrong.

**CSS-first approximation** (no JS lib): a critically-damped spring reads as a strong ease-out. Use these two curves:

```css
:root {
  --ease-spring: cubic-bezier(0.32, 0.72, 0, 1);   /* enter: fast start, long settle (sheet/dialog standard) */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1); /* small moves: hover, segmented slide */
}
/* enter ~400ms with --ease-spring; exit ~250-300ms, same path (§4) */
```

When real gesture physics are needed (drag-to-dismiss with velocity handoff), use a spring library (Motion: `animate(el, {...}, { type:'spring', bounce: 0, duration: 0.4, velocity })`) or WAAPI with the current presentation value.

## 3. Interruptibility — the single most important principle

- **Never lock out input during a transition.** A closing dialog the user re-summons should reverse from where it is — not finish closing first.
- **Animate from the presentation (current) value, never the logical target** — on interrupt, read the live computed transform and start there.
- CSS transitions on `transform`/`opacity` *are* interruptible (they retarget from the current value) — CSS `@keyframes` are **not**; avoid keyframes for anything the user can re-trigger mid-flight.

## 4. Spatial consistency — same path, anchored origin

- **Enter and exit along the same path.** Slides in from bottom → dismisses to bottom. In-from-right/out-the-bottom reads as broken.
- **Anchor to the trigger**: set `transform-origin` toward the element that summoned the layer (popover grows from its button; a dialog summoned from a bottom bar rises from it). The spatial relationship is the explanation.
- Mirror easing on reversible transitions (inverse bézier for the return path).

## 5. Materialize — glass arrives as material, not as a fade

For liquid-glass surfaces (this skill's control surfaces — nav/overlay/CTA/sheet), **animate blur + scale + opacity together** on enter/exit, so the surface reads as a physical material arriving:

```css
.sheet {
  opacity: 0; transform: translateY(12px) scale(0.98);
  backdrop-filter: blur(0px) saturate(var(--glass-sat-rest));
  -webkit-backdrop-filter: blur(0px) saturate(var(--glass-sat-rest));
  transition: opacity .4s var(--ease-spring), transform .4s var(--ease-spring),
              backdrop-filter .4s var(--ease-spring), -webkit-backdrop-filter .4s var(--ease-spring);
}
.sheet.open {
  opacity: 1; transform: none;
  backdrop-filter: blur(var(--glass-blur-rest)) saturate(var(--glass-sat-rest));
  -webkit-backdrop-filter: blur(var(--glass-blur-rest)) saturate(var(--glass-sat-rest));
}
```

Scrim: plain opacity fade (`.25s`), slightly faster than the surface so the surface is the star.

## 6. Gesture upgrades (only when a surface is truly draggable)

- **1:1 tracking** with Pointer Events + `setPointerCapture`; respect the grab offset; keep a short position/timestamp history for release velocity.
- **Velocity handoff**: the settle animation starts at the finger's release velocity (`velocity` option in Motion; normalized form `v / (target − current)`).
- **Momentum projection** for flicks: `projected = current + (v/1000) · d/(1−d)` with `d ≈ 0.998`; snap to the target nearest the *projection*, not the release point.
- **Decide reverse-vs-commit by velocity sign at release**, not by position.
- **Rubber-band at boundaries**: `(overshoot · dim · 0.55) / (dim + 0.55·|overshoot|)` — progressive resistance, never a hard stop.
- Small movement threshold (~10px hysteresis) before committing to a direction.

## 7. Frame-level smoothness

- Animate **only `transform` and `opacity`** (compositor-friendly); `will-change` where motion is imminent — and remove it after.
- `requestAnimationFrame` is the display-synced clock for JS-driven motion.

## 8. Reduced motion & transparency — three independent signals

Bake all three into every interactive layer; reduced motion means *gentler*, not *none*:

```css
@media (prefers-reduced-motion: reduce) {
  .sheet { transition: opacity 200ms ease; transform: none !important; }  /* cross-fade, no travel */
}
@media (prefers-reduced-transparency: reduce) {
  .glass { background: var(--surface); backdrop-filter: none; -webkit-backdrop-filter: none; }
}
@media (prefers-contrast: more) {
  .glass { background: var(--surface); border: 1px solid rgba(0,0,0,.35); }
}
```

Also: no full-viewport moving backgrounds; no slow loops near one cycle per 5s; ease dark↔light theme changes.

## 9. Multimodal feedback (sparingly)

Causality (feedback fires on the causal event), harmony (visual/sound/haptic on the same frame), utility (only meaningful moments: success, error, commit, snap). Over-feedback trains people to ignore all of it — this is the motion version of "restraint is luxury".

## 10. Control-layer dynamic deformation

Glass control surfaces (nav, toolbar, sidebar, tab bar, popover) are **dynamic materials** — they deform in response to user interaction and scroll position. This section covers the motion patterns that make glass feel alive, not static.

### Glass state transitions (rest → active → scrolled)

Each glass control surface transitions through token-driven states. The motion budget is small but perceptible — blur, saturation, and shadow shift together, never independently:

```css
.glass-control {
  backdrop-filter: saturate(var(--glass-sat-rest)) blur(var(--glass-blur-rest));
  -webkit-backdrop-filter: saturate(var(--glass-sat-rest)) blur(var(--glass-blur-rest));
  box-shadow: var(--glass-shadow-rest);
  transition: backdrop-filter .3s var(--ease-spring),
              -webkit-backdrop-filter .3s var(--ease-spring),
              box-shadow .3s var(--ease-spring);
}
.glass-control:active {
  backdrop-filter: saturate(var(--glass-sat-active)) blur(var(--glass-blur-active));
  -webkit-backdrop-filter: saturate(var(--glass-sat-active)) blur(var(--glass-blur-active));
  box-shadow: var(--glass-shadow-active);
}
.glass-control.scrolled {
  backdrop-filter: saturate(var(--glass-sat-scrolled)) blur(var(--glass-blur-scrolled));
  -webkit-backdrop-filter: saturate(var(--glass-sat-scrolled)) blur(var(--glass-blur-scrolled));
  box-shadow: var(--glass-shadow-scrolled);
}
```

Key: the transition duration (`.3s`) and easing (`--ease-spring`) are shared across all three properties so the material deforms as one coherent unit — never a staggered "blur changes, then shadow catches up" effect.

### Glass materialize extension

Section 5 covers materialize for summoned layers (sheet, dialog). For **persistent** glass controls that toggle visibility (a collapsing sidebar, a toolbar that slides in), extend the materialize pattern with the glass state tokens:

```css
.glass-toolbar {
  opacity: 0; transform: translateY(-8px);
  backdrop-filter: blur(0px) saturate(var(--glass-sat-rest));
  -webkit-backdrop-filter: blur(0px) saturate(var(--glass-sat-rest));
  transition: opacity .4s var(--ease-spring), transform .4s var(--ease-spring),
              backdrop-filter .4s var(--ease-spring),
              -webkit-backdrop-filter .4s var(--ease-spring);
}
.glass-toolbar.visible {
  opacity: 1; transform: none;
  backdrop-filter: blur(var(--glass-blur-rest)) saturate(var(--glass-sat-rest));
  -webkit-backdrop-filter: blur(var(--glass-blur-rest)) saturate(var(--glass-sat-rest));
}
```

The blur animates from `0px` to the rest value — the glass "condenses" into existence, not just fades in. This is the materialize principle applied to persistent controls, not just summoned layers.

### Sidebar refraction animation

When a glass sidebar opens/closes, the content beneath it should shift, not just get covered. The sidebar's glass material refracts the content edge as it slides in:

```css
.glass-sidebar {
  transform: translateX(-100%);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  transition: transform .4s var(--ease-spring),
              backdrop-filter .4s var(--ease-spring) .1s,
              -webkit-backdrop-filter .4s var(--ease-spring) .1s;
}
.glass-sidebar.open {
  transform: translateX(0);
  backdrop-filter: blur(var(--glass-blur-rest)) saturate(var(--glass-sat-rest));
  -webkit-backdrop-filter: blur(var(--glass-blur-rest)) saturate(var(--glass-sat-rest));
}
/* Content shifts right, revealing the refraction */
.content-shifted { transform: translateX(80px); transition: transform .4s var(--ease-spring); }
```

The `.1s` delay on `backdrop-filter` lets the panel start sliding before the glass materializes — the refraction effect reads as the content "bending" behind the arriving surface. On exit, reverse: blur collapses first, then the panel slides out.

### rAF-throttled scroll handling

Glass state transitions on scroll (rest → scrolled) fire on every scroll event. **Never attach a heavy class toggle directly to the scroll listener** — throttle with `requestAnimationFrame`:

```js
let ticking = false;
const glassNav = document.querySelector('.glass-nav');
addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      glassNav.classList.toggle('scrolled', scrollY > 8);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
```

This ensures the class toggle fires at most once per frame — no layout thrash, no jank. The `passive: true` flag prevents the listener from blocking scroll. For multiple glass surfaces (nav + sidebar + toolbar), batch all toggles in the same rAF callback.

### Reduced-motion state communication

Under `prefers-reduced-motion: reduce`, glass state transitions still fire — but the *visual* change should be a cross-fade, not a travel or scale. The state itself (rest vs scrolled) is **semantic information**, not decoration: a scrolled nav tells the user "there is content above the fold." Keep the state communication, remove the motion:

```css
@media (prefers-reduced-motion: reduce) {
  .glass-control, .glass-toolbar, .glass-sidebar {
    transition: opacity 200ms ease !important;
    transform: none !important;
  }
  /* Glass blur still transitions — it's the material, not the motion */
  .glass-control { transition: backdrop-filter .2s ease, box-shadow .2s ease; }
}
```

### ARIA for state controls

Glass controls that change state must communicate that state to assistive technology:

- **Scrolled nav**: no ARIA needed (visual-only state; screen readers don't need to know scroll position).
- **Active tab**: `role="tab"`, `aria-selected="true/false"`, `aria-current="page"` on the current tab.
- **Switch/slider**: `role="switch"` / `role="slider"`, `aria-checked` / `aria-valuenow`, and announce state change via `aria-live="polite"` on a status region if the change is non-obvious.
- **Opened popover/sidebar**: `aria-expanded="true/false"` on the trigger; `aria-hidden="true/false"` on the surface; focus management on open/close.
- **Context menu**: `role="menu"`, `role="menuitem"` on children, `aria-expanded` on the trigger.

```html
<!-- Example: glass sidebar trigger -->
<button type="button" aria-expanded="false" aria-controls="sidebar1" aria-label="Toggle sidebar">
  <svg ...><!-- sidebar icon --></svg>
</button>
<aside id="sidebar1" class="glass-sidebar" role="navigation" aria-hidden="true" ...>
```

Sync the `aria-expanded` / `aria-hidden` flip with the glass state transition in the same event handler — the accessibility state and the visual state must never desync.

---

## Motion self-check (gate for any interactive layer)

- [ ] Press feedback on pointer-**down** (`:active` scale), instant.
- [ ] Enter/exit on the **same path**; `transform-origin` anchored to the trigger.
- [ ] Easing is `--ease-spring` / `--ease-out-quart` (or a real spring) — no `linear`, no default `ease`.
- [ ] Enter ~350–450ms, exit ~250–300ms; **no overshoot** unless the gesture carried momentum.
- [ ] Glass surfaces **materialize** (blur+scale+opacity together), scrim fades slightly faster.
- [ ] Glass control surfaces use **state tokens** (`var(--glass-blur-rest/active/scrolled)`, `var(--glass-shadow-*)`) — blur, saturation, and shadow transition as one unit, not staggered.
- [ ] Scroll-driven glass state changes are **rAF-throttled** (no direct class toggle on scroll); `passive: true` on the listener.
- [ ] Glass control state changes are **communicated via ARIA** (`aria-expanded`, `aria-selected`, `aria-checked`); accessibility state and visual state never desync.
- [ ] Input is **never locked** during transitions; re-trigger mid-flight reverses smoothly (CSS transition, not keyframes).
- [ ] Only `transform`/`opacity` animated.
- [ ] All three media queries present: `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast`.

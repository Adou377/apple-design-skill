# Components — copy-paste library

All snippets use the `tokens.css` custom properties (`var(--…)`). Paste the **shared CSS** block below once per page, then copy individual component HTML. Keep the **structure** and the **tokens**; don't re-introduce raw values or fragment the surfaces. See these rendered together in `reference.html`.

## Shared CSS (paste once per page)

```css
/* ── Component classes (reference tokens.css for var(--…) values) ── */

/* Nav */
.c-nav{position:sticky;top:0;z-index:var(--z-sticky);}
.c-nav-inner{max-width:var(--max-grid);margin:0 auto;padding:0 var(--pad-x);height:54px;
  display:flex;align-items:center;justify-content:space-between;gap:16px;}
.c-brand{display:flex;align-items:center;gap:9px;text-decoration:none;color:var(--text);}
.c-brand-name{font-size:15px;font-weight:650;letter-spacing:-0.01em;}
.c-nav-search{display:inline-flex;align-items:center;height:32px;padding:0 14px;
  border-radius:var(--r-pill);background:rgba(0,0,0,0.05);color:var(--text);font-size:13px;
  font-weight:550;text-decoration:none;}

/* Hero */
.c-hero{max-width:var(--max-read);margin:0 auto;padding:clamp(36px,6vw,64px) var(--pad-x) clamp(20px,4vw,32px);}
.c-eyebrow{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:600;
  letter-spacing:0.14em;color:var(--text-3);}
.c-eyebrow-dot{width:7px;height:7px;border-radius:50%;background:var(--live);animation:pulse-dot 2.2s infinite;}
.c-hero h1{margin-top:15px;font-size:clamp(32px,6vw,52px);font-weight:700;letter-spacing:-0.03em;line-height:1.06;}
.c-hero p{margin-top:16px;font-size:clamp(15px,2.5vw,18px);color:var(--text-2);line-height:1.6;max-width:560px;}

/* Unified panel list */
.c-panel{background:var(--surface);border-radius:var(--r-panel);box-shadow:var(--sh-panel);overflow:hidden;}
.c-panel-row{display:block;padding:16px clamp(17px,3vw,24px);color:var(--text);text-decoration:none;}
.c-panel-row h3{font-size:17px;font-weight:600;letter-spacing:-0.01em;line-height:1.45;}
.c-panel-row p{margin-top:4px;font-size:13.5px;color:var(--text-2);}
.c-panel-row + .c-panel-row{border-top:1px solid var(--hairline);}
.c-panel-row:hover{background:var(--hover);transition:background .15s;}

/* Card grid */
.c-card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px;}
.c-card{background:var(--surface);border-radius:var(--r-card);box-shadow:var(--sh-card);
  padding:18px;color:var(--text);text-decoration:none;display:block;
  transition:transform .2s,box-shadow .2s;}
.c-card:hover{transform:translateY(-3px);box-shadow:var(--sh-lift);}
.c-card h3{font-size:17px;font-weight:600;letter-spacing:-0.01em;}
.c-card p{margin-top:6px;font-size:13.5px;color:var(--text-2);line-height:1.5;}

/* Segmented control */
.c-seg{display:inline-flex;background:rgba(0,0,0,0.05);border-radius:var(--r-pill);padding:3px;gap:2px;}
.c-seg button{border:none;cursor:pointer;font-size:13px;font-weight:500;padding:7px 15px;
  border-radius:var(--r-pill);background:transparent;color:var(--text-2);transition:all .25s cubic-bezier(.25,.1,.25,1);}
.c-seg button.active{background:var(--surface);color:var(--text);font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,0.12);}

/* Tags */
.c-tag-mono{font-family:var(--mono);font-size:10.5px;font-weight:700;color:#fff;background:var(--x-blue);padding:2px 7px;border-radius:var(--r-chip);}
.c-tag-plain{font-size:11.5px;color:var(--text-2);background:rgba(0,0,0,0.05);padding:3px 10px;border-radius:var(--r-pill);}
.c-tag-accent{font-size:11.5px;color:var(--accent-link);background:rgba(0,113,227,0.08);padding:3px 10px;border-radius:var(--r-pill);font-weight:550;}
.c-tag-heat{font-size:11.5px;font-weight:650;color:var(--heat);background:var(--heat-bg);padding:3px 10px;border-radius:var(--r-pill);}

/* Buttons */
.c-btn-primary{display:inline-flex;align-items:center;height:44px;padding:0 22px;border-radius:var(--r-pill);
  background:var(--accent);color:#fff;font-size:15px;font-weight:600;text-decoration:none;}
.c-btn-secondary{display:inline-flex;align-items:center;height:44px;padding:0 19px;border-radius:var(--r-pill);
  background:rgba(255,255,255,0.8);border:1px solid rgba(0,0,0,0.08);box-shadow:0 1px 2px rgba(0,0,0,0.05);
  color:var(--text);font-size:14px;font-weight:550;text-decoration:none;}

/* Colored CTA */
.c-cta{position:relative;overflow:hidden;border-radius:var(--r-hero);padding:clamp(26px,4vw,40px);
  background:var(--grad-cta);box-shadow:var(--sh-cta);}
.c-cta-orb{position:absolute;border-radius:50%;}
.c-cta-inner{position:relative;}
.c-cta h2{font-size:clamp(18px,3vw,24px);font-weight:700;color:#fff;letter-spacing:-0.02em;}
.c-cta p{margin-top:10px;font-size:14px;color:rgba(255,255,255,0.82);line-height:1.6;max-width:460px;}
.c-cta-actions{display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;}
.c-glass-chip{display:inline-flex;align-items:center;height:42px;padding:0 18px;border-radius:var(--r-pill);
  color:#fff;font-size:13.5px;font-weight:550;text-decoration:none;}
```

---

## 1. Sticky glass nav

A control surface that overlaps scrolling content — Regular glass is mandatory here.

```html
<header class="glass-nav" style="position:sticky; top:0; z-index:var(--z-sticky);">
  <div style="max-width:var(--max-grid); margin:0 auto; padding:0 var(--pad-x); height:54px;
              display:flex; align-items:center; justify-content:space-between; gap:16px;">
    <a href="/" style="display:flex; align-items:center; gap:9px; text-decoration:none; color:var(--text);">
      <img src="/icon.png" width="24" height="24" alt="">
      <span style="font-size:15px; font-weight:650; letter-spacing:-0.01em;">Brand</span>
    </a>
    <a href="/search" style="display:inline-flex; align-items:center; height:32px; padding:0 14px;
       border-radius:var(--r-pill); background:rgba(0,0,0,0.05); color:var(--text); font-size:13px;
       font-weight:550; text-decoration:none;">Ask AI</a>
  </div>
</header>
```

## 2. Page hero

```html
<section style="max-width:var(--max-read); margin:0 auto; padding:clamp(36px,6vw,64px) var(--pad-x) clamp(20px,4vw,32px);">
  <div style="display:flex; align-items:center; gap:9px; font-size:12px; font-weight:600;
              letter-spacing:0.14em; color:var(--text-3);">
    <span style="width:7px; height:7px; border-radius:50%; background:var(--live); animation:pulse-dot 2.2s infinite;"></span>
    EYEBROW · LIVE
  </div>
  <h1 style="margin-top:15px; font-size:clamp(32px,6vw,52px); font-weight:700; letter-spacing:-0.03em; line-height:1.06;">
    The headline
  </h1>
  <p style="margin-top:16px; font-size:clamp(15px,2.5vw,18px); color:var(--text-2); line-height:1.6; max-width:560px;">
    One restrained sub-line. No filler, no "in today's world".
  </p>
</section>
```

## 3. Unified panel list ⭐ (the anti-fragmentation pattern)

Sibling items go on **one** white panel, separated by hairlines — never as separate bordered cards.

```html
<div style="background:var(--surface); border-radius:var(--r-panel); box-shadow:var(--sh-panel); overflow:hidden;">
  <a class="row" href="#" style="display:block; padding:16px clamp(17px,3vw,24px); color:var(--text); text-decoration:none;">
    <h3 style="font-size:17px; font-weight:600; letter-spacing:-0.01em; line-height:1.45;">Row title</h3>
    <p style="margin-top:4px; font-size:13.5px; color:var(--text-2);">One line of supporting context.</p>
  </a>
  <a class="row" href="#" style="display:block; padding:16px clamp(17px,3vw,24px); color:var(--text); text-decoration:none;">
    <h3 style="font-size:17px; font-weight:600; letter-spacing:-0.01em; line-height:1.45;">Another row</h3>
    <p style="margin-top:4px; font-size:13.5px; color:var(--text-2);">Continuous surface, not islands.</p>
  </a>
</div>
```
```css
.row + .row { border-top: 1px solid var(--hairline); } /* adjacent-sibling → no leading/trailing line */
.row:hover  { background: var(--hover); transition: background .15s; }
```

## 4. Standard card + grid

For genuinely independent items (e.g. article cards). Still no colored borders.

```html
<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(290px, 1fr)); gap:14px;">
  <a class="card" href="#" style="background:var(--surface); border-radius:var(--r-card); box-shadow:var(--sh-card);
     padding:18px; color:var(--text); text-decoration:none; display:block;">
    <h3 style="font-size:17px; font-weight:600; letter-spacing:-0.01em;">Card title</h3>
    <p style="margin-top:6px; font-size:13.5px; color:var(--text-2); line-height:1.5;">Summary…</p>
  </a>
</div>
```
```css
.card { transition: transform .2s, box-shadow .2s; }
.card:hover { transform: translateY(-3px); box-shadow: var(--sh-lift); }
```

## 5. Segmented pill control (apple.com style)

Grey track + a single moving pill. Two selected styles: **black** (strong filter) / **white** (light toggle). Uses the shared `.c-seg` class from the CSS block above.

```html
<div class="c-seg">
  <button data-seg="a">Unified</button>
  <button data-seg="b">Grid</button>
  <button data-seg="c">Focus</button>
</div>
```
```css
/* Extends the shared .c-seg / .c-seg button from the CSS block above */
.c-seg button.active {                 /* WHITE pill (light toggle) */
  background:var(--surface); color:var(--text); font-weight:600; box-shadow:0 1px 3px rgba(0,0,0,0.12);
}
.c-seg button.active--black {          /* BLACK pill (strong filter) */
  background:var(--text); color:#fff; box-shadow:0 1px 2px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.16);
}
```
```js
const seg = document.querySelector('.c-seg');
seg.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  seg.querySelectorAll('button').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
});
seg.querySelector('button').classList.add('active');
```

## 6. Tags / chips

```html
<span style="font-family:var(--mono); font-size:10.5px; font-weight:700; color:#fff; background:var(--x-blue); padding:2px 7px; border-radius:var(--r-chip);">X</span>
<span style="font-size:11.5px; color:var(--text-2); background:rgba(0,0,0,0.05); padding:3px 10px; border-radius:var(--r-pill);">plain tag</span>
<span style="font-size:11.5px; color:var(--accent-link); background:rgba(0,113,227,0.08); padding:3px 10px; border-radius:var(--r-pill); font-weight:550;">accent tag</span>
<span style="font-size:11.5px; font-weight:650; color:var(--heat); background:var(--heat-bg); padding:3px 10px; border-radius:var(--r-pill);">hottest</span>
```

## 7. Buttons

```html
<!-- primary -->
<a style="display:inline-flex; align-items:center; height:44px; padding:0 22px; border-radius:var(--r-pill);
   background:var(--accent); color:#fff; font-size:15px; font-weight:600; text-decoration:none;">Primary →</a>
<!-- secondary / light glass -->
<a style="display:inline-flex; align-items:center; height:44px; padding:0 19px; border-radius:var(--r-pill);
   background:rgba(255,255,255,0.8); border:1px solid rgba(0,0,0,0.08); box-shadow:0 1px 2px rgba(0,0,0,0.05);
   color:var(--text); font-size:14px; font-weight:550; text-decoration:none;">Secondary</a>
```
Touch target ≥ 44px high.

## 8. Colored CTA with liquid-glass ⭐

Glass needs *something to refract* — put blurred light orbs behind the glass elements.

```html
<section style="position:relative; overflow:hidden; border-radius:var(--r-hero); padding:clamp(26px,4vw,40px);
                background:var(--grad-cta); box-shadow:var(--sh-cta);">
  <div style="position:absolute; width:260px; height:260px; border-radius:50%; background:rgba(255,255,255,0.18); filter:blur(46px); top:-80px; right:-40px;"></div>
  <div style="position:absolute; width:200px; height:200px; border-radius:50%; background:rgba(120,80,255,0.5); filter:blur(50px); bottom:-90px; left:12%;"></div>
  <div style="position:relative;">
    <h2 style="font-size:clamp(18px,3vw,24px); font-weight:700; color:#fff; letter-spacing:-0.02em;">CTA headline</h2>
    <p style="margin-top:10px; font-size:14px; color:rgba(255,255,255,0.82); line-height:1.6; max-width:460px;">Supporting line.</p>
    <div style="display:flex; gap:10px; margin-top:20px; flex-wrap:wrap;">
      <a class="glass-chip" style="display:inline-flex; align-items:center; height:42px; padding:0 18px; border-radius:var(--r-pill); color:#fff; font-size:13.5px; font-weight:550; text-decoration:none;">Glass button</a>
    </div>
  </div>
</section>
```

## 9. Responsive notes
- All sizes via `clamp()`; one design auto-adapts PC↔mobile (don't build two).
- Breakpoint ~`680px`: two-column → one (`.ds-2col { grid-template-columns:1fr; }`), hide secondary info (`.hide-sm`), pick a denser default layout.
- Section spacing `clamp(34px,6vw,56px)`; panels short or tall as content needs (don't pad everything equally).

---

## 10. Glass control-layer components

Liquid Glass is the **main material for control surfaces**. Every component below uses `var(--glass-*)` tokens — never hard-coded blur/sat/shadow. Each carries state transitions (rest → active → pressed → scrolled), dark-mode tuning, ARIA attributes, and `var(--z-*)` z-index. The 5-level degradation ladder in `tokens.css` covers all `.glass-*` classes automatically.

### Glass shared CSS (paste once with the block above)

```css
/* ── Glass control-layer base (all tokens from tokens.css) ── */
.glass-base{
  background:var(--glass-bg-regular-light);
  backdrop-filter:saturate(var(--glass-sat-rest)) blur(var(--glass-blur-rest));
  -webkit-backdrop-filter:saturate(var(--glass-sat-rest)) blur(var(--glass-blur-rest));
  box-shadow:var(--glass-shadow-rest);
  transition:backdrop-filter .3s var(--ease-spring),box-shadow .3s var(--ease-spring),
    background .3s var(--ease-spring),transform .15s var(--ease-out-quart);
}
.glass-base:active{
  backdrop-filter:saturate(var(--glass-sat-active)) blur(var(--glass-blur-active));
  -webkit-backdrop-filter:saturate(var(--glass-sat-active)) blur(var(--glass-blur-active));
  box-shadow:var(--glass-shadow-active);
}
.glass-base.pressed{
  backdrop-filter:saturate(var(--glass-sat-rest)) blur(var(--glass-blur-rest));
  -webkit-backdrop-filter:saturate(var(--glass-sat-rest)) blur(var(--glass-blur-rest));
  box-shadow:var(--glass-shadow-pressed);
}
.glass-base.scrolled{
  backdrop-filter:saturate(var(--glass-sat-scrolled)) blur(var(--glass-blur-scrolled));
  -webkit-backdrop-filter:saturate(var(--glass-sat-scrolled)) blur(var(--glass-blur-scrolled));
  box-shadow:var(--glass-shadow-scrolled);
}
@media (prefers-color-scheme:dark){
  .glass-base{background:var(--glass-bg-regular-dark);}
  .glass-clear-base{background:var(--glass-bg-clear-dark);border:var(--glass-edge-dark);}
}
.glass-clear-base{
  background:var(--glass-bg-clear-light);
  border:var(--glass-edge-light);
  backdrop-filter:blur(var(--glass-clear-blur));
  -webkit-backdrop-filter:blur(var(--glass-clear-blur));
  box-shadow:var(--glass-shadow-rest);
  transition:backdrop-filter .3s var(--ease-spring),box-shadow .3s var(--ease-spring);
}
```

### 10a. Glass toolbar

A horizontal control bar (actions, search, title) that floats above content. Regular glass — it carries text.

```html
<div class="glass-toolbar glass-base" role="toolbar" aria-label="Document actions"
     style="position:sticky;top:0;z-index:var(--z-sticky);border-radius:var(--r-pill);
            padding:6px 10px;display:flex;align-items:center;gap:8px;margin:0 22px;">
  <button type="button" aria-label="Back" style="height:36px;width:36px;border:none;border-radius:var(--r-pill);
          background:transparent;color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;">
    <svg class="ic" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
  </button>
  <span style="font-size:15px;font-weight:600;letter-spacing:-0.01em;color:var(--text);flex:1;">Document</span>
  <button type="button" aria-label="Share" style="height:36px;width:36px;border:none;border-radius:var(--r-pill);
          background:transparent;color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;">
    <svg class="ic" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M6 12v6a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 18v-6"/></svg>
  </button>
</div>
```

### 10b. Glass tab bar

Bottom navigation with real line icons. One accent on the active tab; the rest grey.

```html
<nav class="glass-tabbar glass-base" role="tablist" aria-label="Main navigation"
     style="position:fixed;bottom:0;left:0;right:0;z-index:var(--z-sticky);
            border-radius:var(--r-pill) var(--r-pill) 0 0;padding:8px 0 max(8px,env(safe-area-inset-bottom));
            display:flex;justify-content:space-around;align-items:flex-start;border-top:1px solid var(--glass-hairline-light);">
  <a class="tab on" role="tab" aria-selected="true" aria-current="page"
     style="display:flex;flex-direction:column;align-items:center;gap:3px;width:64px;font-size:10px;
            font-weight:500;color:var(--accent);text-decoration:none;">
    <svg class="ic" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10.5h18"/><circle cx="17" cy="14.5" r="1.25"/></svg>Wallet
  </a>
  <a class="tab" role="tab" aria-selected="false"
     style="display:flex;flex-direction:column;align-items:center;gap:3px;width:64px;font-size:10px;
            font-weight:500;color:var(--text-3);text-decoration:none;">
    <svg class="ic" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>Me
  </a>
</nav>
```

### 10c. Glass sidebar

A vertical navigation panel (iPad / desktop). Regular glass. Concentric radii: outer `--r-panel` (22), inner items `--r-pill`.

```html
<aside class="glass-sidebar glass-base" role="navigation" aria-label="Sidebar"
      style="position:fixed;top:0;left:0;bottom:0;width:260px;z-index:var(--z-sidebar);
             padding:16px 12px;display:flex;flex-direction:column;gap:4px;border-right:1px solid var(--glass-hairline-light);">
  <a href="#" style="height:44px;padding:0 14px;border-radius:var(--r-pill);display:flex;align-items:center;gap:10px;
     font-size:15px;font-weight:550;color:var(--text);text-decoration:none;background:rgba(0,0,0,0.05);">
    <svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>Home
  </a>
  <a href="#" style="height:44px;padding:0 14px;border-radius:var(--r-pill);display:flex;align-items:center;gap:10px;
     font-size:15px;font-weight:550;color:var(--text-2);text-decoration:none;">
    <svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>Search
  </a>
</aside>
```

### 10d. Glass segmented control

A glass-track segmented control with state transitions. Inner pill radius is concentric: outer `--r-pill` (999), inner padding 3px → inner pill also `--r-pill`.

```html
<div class="glass-seg glass-base" role="group" aria-label="View mode"
     style="display:inline-flex;border-radius:var(--r-pill);padding:3px;gap:2px;">
  <button type="button" aria-pressed="true"
          style="border:none;cursor:pointer;font-size:13px;font-weight:600;padding:7px 15px;
                 border-radius:var(--r-pill);background:var(--surface);color:var(--text);
                 box-shadow:0 1px 3px rgba(0,0,0,0.12);">Unified</button>
  <button type="button" aria-pressed="false"
          style="border:none;cursor:pointer;font-size:13px;font-weight:500;padding:7px 15px;
                 border-radius:var(--r-pill);background:transparent;color:var(--text-2);">Grid</button>
</div>
```

### 10e. Glass switch

An iOS-style toggle. Glass track + accent thumb. `role="switch"` + `aria-checked`.

```html
<button type="button" class="glass-switch" role="switch" aria-checked="false" aria-label="Toggle setting"
        style="width:51px;height:31px;border:none;border-radius:var(--r-pill);cursor:pointer;
               position:relative;background:var(--glass-bg-clear-light);
               backdrop-filter:blur(var(--glass-clear-blur));
               -webkit-backdrop-filter:blur(var(--glass-clear-blur));
               border:var(--glass-edge-light);transition:background .3s var(--ease-spring);">
  <span class="glass-switch-thumb" aria-hidden="true"
        style="position:absolute;top:2px;left:2px;width:27px;height:27px;border-radius:50%;
               background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);
               transition:transform .3s var(--ease-spring),background .3s var(--ease-spring);"></span>
</button>
```
```css
.glass-switch[aria-checked="true"]{background:var(--accent);border-color:transparent;}
.glass-switch[aria-checked="true"] .glass-switch-thumb{transform:translateX(20px);}
.glass-switch:active .glass-switch-thumb{transform:scale(1.05);}
@media (prefers-color-scheme:dark){
  .glass-switch{background:var(--glass-bg-clear-dark);border:var(--glass-edge-dark);}
}
```

### 10f. Glass slider

A range input with glass track and accent fill. State-aware shadow on the thumb.

```html
<input type="range" class="glass-slider" min="0" max="100" value="40"
       aria-label="Volume" role="slider"
       style="-webkit-appearance:none;appearance:none;width:100%;height:31px;background:transparent;cursor:pointer;">
```
```css
.glass-slider{
  background:var(--glass-bg-clear-light);
  backdrop-filter:blur(var(--glass-clear-blur));
  -webkit-backdrop-filter:blur(var(--glass-clear-blur));
  border-radius:var(--r-pill);border:var(--glass-edge-light);height:6px;margin:12px 0;
}
.glass-slider::-webkit-slider-thumb{
  -webkit-appearance:none;width:27px;height:27px;border-radius:50%;background:#fff;
  box-shadow:var(--glass-shadow-rest);border:none;transition:box-shadow .2s var(--ease-spring);
}
.glass-slider::-webkit-slider-thumb:active{box-shadow:var(--glass-shadow-active);transform:scale(1.1);}
.glass-slider::-moz-range-thumb{
  width:27px;height:27px;border-radius:50%;background:#fff;border:none;
  box-shadow:var(--glass-shadow-rest);transition:box-shadow .2s var(--ease-spring);
}
@media (prefers-color-scheme:dark){
  .glass-slider{background:var(--glass-bg-clear-dark);border:var(--glass-edge-dark);}
}
```

### 10g. Glass popover / dropdown

A floating menu anchored to a trigger. Clear glass if over media; Regular if over text content. Concentric radii: outer `--r-panel` (22), inner items `--r-pill`.

```html
<div class="glass-popover glass-base" role="menu" aria-label="Actions"
     style="position:absolute;z-index:var(--z-popover);border-radius:var(--r-panel);
            padding:6px;min-width:200px;">
  <button type="button" role="menuitem"
          style="width:100%;height:40px;padding:0 14px;border:none;border-radius:var(--r-pill);
                 background:transparent;color:var(--text);font-size:14px;font-weight:500;
                 text-align:left;cursor:pointer;">Edit</button>
  <button type="button" role="menuitem"
          style="width:100%;height:40px;padding:0 14px;border:none;border-radius:var(--r-pill);
                 background:transparent;color:var(--text);font-size:14px;font-weight:500;
                 text-align:left;cursor:pointer;">Duplicate</button>
  <button type="button" role="menuitem" aria-disabled="false"
          style="width:100%;height:40px;padding:0 14px;border:none;border-radius:var(--r-pill);
                 background:transparent;color:var(--danger);font-size:14px;font-weight:500;
                 text-align:left;cursor:pointer;">Delete</button>
</div>
```
```css
.glass-popover{transform-origin:top right;transform:scale(0.96);opacity:0;pointer-events:none;
  transition:opacity .25s var(--ease-spring),transform .25s var(--ease-spring);}
.glass-popover.open{transform:scale(1);opacity:1;pointer-events:auto;}
```

### 10h. Glass tooltip

A tiny glass bubble — short text only, no interactive elements. Clear glass. `role="tooltip"` + `aria-describedby` on the trigger.

```html
<button type="button" aria-describedby="tip1" style="border:none;background:transparent;cursor:pointer;">?</button>
<span class="glass-tooltip" id="tip1" role="tooltip"
      style="position:absolute;z-index:var(--z-popover);border-radius:var(--r-pill);
             padding:6px 12px;font-size:12px;font-weight:500;color:var(--text);white-space:nowrap;
             background:var(--glass-bg-regular-light);
             backdrop-filter:saturate(var(--glass-sat-rest)) blur(var(--glass-blur-rest));
             -webkit-backdrop-filter:saturate(var(--glass-sat-rest)) blur(var(--glass-blur-rest));
             box-shadow:var(--glass-shadow-rest);pointer-events:none;">Quick tip text</span>
```
```css
.glass-tooltip{opacity:0;transform:translateY(4px);
  transition:opacity .2s var(--ease-out-quart),transform .2s var(--ease-out-quart);}
.glass-tooltip.show{opacity:1;transform:none;}
```

### 10i. Glass FAB (floating action button)

A circular glass button that floats above content. `--z-fab` z-index, `--glass-shadow-floating`.

```html
<button type="button" class="glass-fab glass-base" aria-label="Add new item"
        style="position:fixed;bottom:max(24px,env(safe-area-inset-bottom));right:24px;
               z-index:var(--z-fab);width:56px;height:56px;border:none;border-radius:50%;
               display:flex;align-items:center;justify-content:center;cursor:pointer;
               box-shadow:var(--glass-shadow-floating);">
  <svg class="ic" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent)"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 5v14"/><path d="M5 12h14"/>
  </svg>
</button>
```
```css
.glass-fab{transition:transform .2s var(--ease-spring),box-shadow .3s var(--ease-spring);}
.glass-fab:active{transform:scale(0.92);box-shadow:var(--glass-shadow-pressed);}
```

### 10j. Glass checkbox / radio

Glass-backed check controls with accent fill on checked state. `role="checkbox"` / `role="radio"` + `aria-checked`.

```html
<!-- Checkbox -->
<button type="button" class="glass-check" role="checkbox" aria-checked="true" aria-label="Accept terms"
        style="width:24px;height:24px;border:none;border-radius:7px;cursor:pointer;position:relative;
               background:var(--glass-bg-clear-light);backdrop-filter:blur(var(--glass-clear-blur));
               -webkit-backdrop-filter:blur(var(--glass-clear-blur));border:var(--glass-edge-light);">
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)"
       stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
       style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
    <path d="M5 12l5 5L20 6"/>
  </svg>
</button>
<!-- Radio -->
<button type="button" class="glass-radio" role="radio" aria-checked="false" aria-label="Option A"
        style="width:24px;height:24px;border:none;border-radius:50%;cursor:pointer;position:relative;
               background:var(--glass-bg-clear-light);backdrop-filter:blur(var(--glass-clear-blur));
               -webkit-backdrop-filter:blur(var(--glass-clear-blur));border:var(--glass-edge-light);">
</button>
```
```css
.glass-check[aria-checked="true"]{background:var(--accent);border-color:transparent;}
.glass-radio[aria-checked="true"]::after{content:'';position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:var(--accent);}
@media (prefers-color-scheme:dark){
  .glass-check,.glass-radio{background:var(--glass-bg-clear-dark);border:var(--glass-edge-dark);}
}
```

### 10k. Glass context menu

A right-click / long-press menu. Regular glass (carries text). `role="menu"` + `role="menuitem"`.

```html
<div class="glass-context glass-base" role="menu" aria-label="Context actions"
     style="position:fixed;z-index:var(--z-popover);border-radius:var(--r-panel);padding:6px;min-width:180px;">
  <button type="button" role="menuitem"
          style="width:100%;height:40px;padding:0 14px;border:none;border-radius:var(--r-pill);
                 background:transparent;color:var(--text);font-size:14px;font-weight:500;
                 text-align:left;cursor:pointer;">Copy</button>
  <button type="button" role="menuitem"
          style="width:100%;height:40px;padding:0 14px;border:none;border-radius:var(--r-pill);
                 background:transparent;color:var(--text);font-size:14px;font-weight:500;
                 text-align:left;cursor:pointer;">Paste</button>
  <div style="height:1px;margin:4px 8px;background:var(--glass-hairline-light);"></div>
  <button type="button" role="menuitem"
          style="width:100%;height:40px;padding:0 14px;border:none;border-radius:var(--r-pill);
                 background:transparent;color:var(--danger);font-size:14px;font-weight:500;
                 text-align:left;cursor:pointer;">Delete</button>
</div>
```
```css
.glass-context{transform-origin:top left;transform:scale(0.95);opacity:0;pointer-events:none;
  transition:opacity .2s var(--ease-spring),transform .2s var(--ease-spring);}
.glass-context.open{transform:scale(1);opacity:1;pointer-events:auto;}
.glass-context button:hover{background:rgba(0,0,0,0.05);}
@media (prefers-color-scheme:dark){
  .glass-context button:hover{background:rgba(255,255,255,0.08);}
  .glass-context>div{background:var(--glass-hairline-dark)!important;}
}
```

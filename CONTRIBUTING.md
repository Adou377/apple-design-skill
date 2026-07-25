# Contributing to apple-design-skill

Thank you for your interest in improving this design skill! This guide covers how to contribute effectively.

## Getting Started

1. **Fork** the repository and clone your fork locally.
2. Create a feature branch: `git checkout -b fix/your-fix-name`
3. Make your changes following the guidelines below.
4. Test by opening `reference.html` and both examples in a browser — your changes must look like they belong on the same page.
5. Submit a pull request to `main`.

## Design Philosophy (read before editing)

This skill is built on five rules (see `SKILL.md`):

1. **Unified surface > fragmented cards** — one panel + hairlines, not separate bordered cards.
2. **Glass is seasoning, not the dish** — `backdrop-filter` only where layers overlap.
3. **Restraint is luxury** — whitespace and hierarchy over decoration.
4. **Hierarchy from weight + size + grayscale, not color** — one accent blue, everything else grayscale.
5. **Apple quality lives in details** — negative tracking, `tabular-nums`, hairline dividers.

Any contribution that violates these rules will be requested for changes.

## What to Contribute

### Welcome
- **Accessibility improvements** — better ARIA, keyboard nav, focus management, contrast fixes.
- **New components** that follow the existing token system and design rules.
- **Bug fixes** in examples, tokens, or documentation.
- **Documentation improvements** — clearer wording, better examples, translations.
- **Security hardening** — removing unsafe DOM patterns, adding CSP guidance.

### Please Avoid
- Adding component libraries or framework dependencies (this skill is framework-agnostic).
- Introducing color beyond the established accent/heat/brand palette.
- Adding emoji as icons or decorative elements.
- Fragmenting panels into separate cards.
- Using `innerHTML` to concatenate dynamic data (security red line — see `SKILL.md`).

## Code Style

### HTML/CSS
- Reference all values via `var(--…)` tokens — never hard-code hex/px that a token already names.
- Use `clamp()` for responsive sizing; one design auto-adapts PC ↔ mobile.
- Touch targets ≥ 44px.
- Include `prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-contrast` media queries for interactive layers.

### Markdown
- Keep documentation concise and scannable.
- Use tables for token references and size charts.
- Include copy-paste-ready code blocks.

### Accessibility Checklist (gate before PR)
- [ ] All interactive elements are keyboard accessible (Tab, Enter/Space, Escape for dialogs).
- [ ] Dialogs/sheets have `role="dialog"`, `aria-modal="true"`, focus trap, and Escape to close.
- [ ] Toggle controls have `role="switch"` and `aria-checked`.
- [ ] Text contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text (WCAG AA).
- [ ] `prefers-reduced-motion` respected on all animated elements.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
fix(a11y): add focus trap to wallet.html bottom sheet
feat(components): add search bar component
docs(tokens): correct --link contrast documentation
```

## Reporting Issues

Use the provided Issue templates (Bug Report or Feature Request). Include:
- What you expected vs. what happened.
- Browser/OS if it's a rendering issue.
- A screenshot if applicable.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

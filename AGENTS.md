# AGENTS.md

This repository is a small static wedding website built with plain HTML, CSS, and JavaScript. The goal is to keep the site simple, accessible, fast, and easy to maintain without introducing framework overhead or unnecessary complexity.

## Project intent

- Serve as a polished wedding microsite for Jon & Elissa.
- Stay static and low-maintenance: no bundlers, no framework, no package manager requirements.
- Prioritize readability, accessibility, responsiveness, and minimal JavaScript.
- Keep edits targeted and easy to review.

## Repository map

- `index.html`: landing page structure and content
- `wedding-party.html`: wedding party page structure and member data
- `assets/css/styles.css`: all styling, layout, and responsive behavior
- `assets/js/main.js`: navigation, modal logic, scroll reveal, and countdown behavior
- `README.md`: project context and preview instructions

## Core principles for AI work

### 1) Keep the solution minimal

- Prefer the smallest change that resolves the issue.
- Do not refactor unrelated code just because it is nearby.
- Avoid adding abstractions, helper layers, or new architecture unless the repository already requires it.
- Do not introduce external libraries, build tooling, or package dependencies for simple page updates.

### 2) Preserve the current architecture

This project is intentionally static and simple. Follow that pattern:

- HTML for structure and content
- CSS for styling, responsive behavior, and visual polish
- JavaScript only for small interactive behaviors
- No React, no TypeScript, no component system, no complex state management

If a task can be solved with plain HTML/CSS/JS, prefer that route.

### 3) Optimize for code quality over cleverness

Good work here means:

- Semantic HTML
- Accessible labels and ARIA attributes when needed
- Mobile-first responsive layout
- Small, readable functions
- Clear naming and minimal duplication
- No dead code or unused variables
- Safe interaction patterns that degrade gracefully

### 4) Optimize for token efficiency and low-credit usage

When working in this repo, minimize wasted context and unnecessary exploration.

Before editing, do the following in order:

1. Read the specific file(s) directly related to the task.
2. Prefer one precise search or symbol lookup over broad repo scans.
3. Avoid reading the whole CSS or JS files unless the issue truly requires it.
4. Make the smallest patch that addresses the real root cause.
5. Stop once the task is fixed and validated.

Do not:

- rewrite entire files for minor fixes
- add large boilerplate or comments for obvious code
- ask for permission to do standard, contained changes
- propose speculative redesigns or broad cleanup unrelated to the request

## Working rules for agents

### Preferred workflow

- Start with one targeted read of the relevant file or block.
- Understand the exact root cause before changing code.
- If the issue is visual, inspect the HTML structure and CSS selectors first.
- If the issue is interactivity, inspect the matching JS behavior and DOM selectors.
- Make the patch and validate via a quick local preview or browser-level check when possible.

### Editing expectations

- Prefer surgical edits over large rewrites.
- Keep formatting consistent with the existing code style.
- Preserve existing comments and section naming when they are useful.
- If a fix is repeated across multiple pages, fix the root pattern once instead of duplicating ad hoc edits.
- Do not add noisy comments unless they clarify a non-obvious behavior or compatibility concern.

### Accessibility and UX requirements

- Keep navigation keyboard-friendly.
- Preserve accessible names and `aria-*` states for interactive elements.
- Respect reduced-motion preferences when adding animation.
- Do not rely on color alone to communicate meaning.
- Keep text contrast readable and respectable.
- Avoid introducing broken links or invalid anchors.

### Performance expectations

- Keep page weight low.
- Do not add large image assets or multiple font families without clear benefit.
- Avoid unnecessary animation or repeated DOM queries in tight loops.
- Keep JS simple and event-driven.
- Reuse CSS variables and existing patterns before creating new ones.

## Change-specific guidance

### Content updates

- Update only the relevant HTML text and preserve surrounding structure.
- Keep headings, links, and semantics consistent.
- For event details, dates, names, and contact links, prefer direct, explicit edits over template changes.

### Styling updates

- Prefer small CSS adjustments using existing selectors and variables.
- Reuse established spacing, color, and typography tokens instead of inventing new ones.
- Check mobile and desktop behavior if the CSS affects layout.

### JavaScript updates

- Prefer targeted DOM queries and event handlers.
- Guard against missing elements before manipulating them.
- Avoid unnecessary async complexity for simple UI interactions.
- Keep functions cohesive and small; do not create hidden state when plain DOM data is enough.

## Quality checklist before finishing

Before claiming work is done, verify all of the following:

- The change matches the request exactly.
- No unrelated files were modified.
- The fix is minimal and easy to review.
- HTML remains valid and semantic.
- CSS does not break mobile layout or global styling.
- JS does not throw errors in common flows.
- Links, IDs, and navigation still work.
- No dead code or duplicate logic was introduced.

## Rejection rules

Do not do the following unless explicitly requested:

- broad refactors
- framework migration
- package installation for trivial tasks
- redesigns that change site personality or visual direction
- complex state management or data models
- speculative feature work or “while you’re here” cleanup
- repeated full-file rewrites

## Local validation

Use a real mobile-size check before concluding the work is ready. This site is heavily responsive, so validation should happen at the phone viewport that matches the primary mobile experience.

```bash
cd /Users/jonfrisch/repositories/je-wedding
python3 -m http.server 8000
```

Then open the site in a browser and check the page at a mobile viewport of 390 x 844 (iPhone 12 Pro) to confirm the layout, spacing, nav behavior, and typography render correctly. Validate the relevant page in that size before finishing, especially for:

- mobile navigation toggle
- hero spacing and typography
- text wrapping and overflow
- tap target sizing
- overlay and modal behavior
- any sticky or fixed-position elements

If a bug is mobile-specific, reproduce it at 390 x 844 and fix it there before considering the task complete.

## Final instruction to future agents

Treat this repository as a quality-first, low-overhead static site. Do not spend credits on large explorations, broad refactors, or unnecessary scaffolding. Favor precise edits, strong accessibility, minimal code, and repository-specific consistency.

If a task seems unclear, fix the exact issue with the minimum necessary read and patch cycle. Quality beats quantity, and low-noise work beats big, expensive rewrites.

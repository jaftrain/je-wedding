# Website QA Checklist

Choose checks that match the requested route and risk. Record the environment and evidence; do not mark untested items as passed.

## Functionality and content

- Load every in-scope route directly and through navigation; check status, title, expected primary heading/content, active-page indication, and browser back/forward.
- Exercise each control with pointer and keyboard. Check mobile menu state (`aria-expanded`), dialogs (open, close, Escape, focus), forms (validation, errors, success), downloads, and no-JavaScript messaging.
- Validate date/time, timezone assumptions, calendar downloads, map directions, contact/RSVP destinations, and route/base-path behavior against source data. Do not submit real forms or make bookings.
- Look for stale, placeholder, contradictory, truncated, duplicated, or misleading content and inaccessible empty/error/loading states.
- Verify external destinations cautiously. Check the exact destination and safe new-tab behavior; network blocks, redirects, anti-bot responses, and `HEAD` failures are not automatically dead links.

## Loading, reliability, and performance

- Inspect first load and reload with cache disabled if possible. Record failed requests, response codes, console/page errors, redirects, load state, and whether critical content is visible without waiting on noncritical third parties.
- Check all local HTML, script, stylesheet, image, font, CSS `url()`, and calendar targets. Check internal fragments, case-sensitive paths, and GitHub Pages project-site base paths.
- Inspect the byte size and dimensions of images/fonts; prefer appropriately sized responsive modern formats. Reserve image dimensions/aspect ratios to reduce layout shift. Lazy-load below-the-fold images, not the primary hero/LCP image. Avoid preloading assets that are not critical.
- Look for render-blocking or unnecessary resources, repeated downloads, oversized payloads, unused assets, font-display flashes, long tasks, layout shifts, and layout work on scroll. Recommend measurement before speculative rewrites.
- Use Lighthouse or equivalent lab tooling if available and note browser, throttling, cache, and run variability. Lab LCP/TBT are not field Core Web Vitals. Field Core Web Vitals are assessed at the 75th percentile: good LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1; poor is LCP > 4 s, INP > 500 ms, CLS > 0.25. Do not claim field compliance from one local run.

## Accessibility and responsive behavior

- Check semantic landmarks, a useful heading hierarchy, page title/language, link purpose, image alternatives (empty alt for decorative images), form labels/instructions, accessible names, and accurate ARIA state.
- Navigate using keyboard only. Verify logical focus order, visible focus, no traps (except intentional modal containment), Escape behavior, and focus restoration. Test zoom/reflow and reduced-motion preferences.
- Inspect contrast, text resizing, target size/spacing, touch and hover behavior, captions/transcripts where media exists, and status/error announcements.
- Test at the repository's 390 × 844 mobile target, a wide desktop viewport, and a narrow viewport (320 CSS px where supported). Check horizontal overflow, sticky/fixed controls, clipping, overlapping text, and page bottom content—not only the first screen.
- WCAG automated tools catch only a subset of failures. Manually review context-sensitive requirements and state that an automated scan is not a conformance audit.

## Security, privacy, and deployment

- Check whether content or credentials are exposed in HTML, JavaScript, source maps, static assets, URLs, local storage, or error output. A client-side password prompt/hidden DOM is not access control.
- Review external scripts/fonts, target-blank links, mixed content, forms, storage, and accidental personal/secret data. Avoid probing or exploiting production systems.
- For GitHub Pages, remember that it serves static files. Confirm actual site visibility/access-control configuration with the owner; do not label a client-side gate as private authentication.
- Check deployment workflow/path assumptions and verify the built artifact contains intended public files only. Do not change deployment settings or deploy without explicit authorization.

## Finding quality

For each confirmed issue give: severity and confidence, affected route/device, concise title, exact evidence, numbered reproduction steps, expected versus actual result, user impact, minimal suggested fix, whether the fix was applied, and retest evidence. Keep speculative concerns in a separate recommendations/limitations section.

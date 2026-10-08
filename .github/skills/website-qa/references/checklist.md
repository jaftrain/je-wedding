# Website QA Checklist

Choose checks that match the requested routes, user journeys, and risk. Record the environment and evidence; do not mark untested items as passed. Treat this as a coverage guide, not a requirement to run every check on every change.

## 1. Critical flows and functionality

- Load every in-scope route directly and through navigation. Check status, title, expected primary heading/content, active-page indication, and browser back/forward.
- Exercise core journeys and account actions that exist on the site, including navigation, signup/login, checkout, search, filters, and other important interactions. For this wedding site, verify the password gate and relevant RSVP/contact flows without submitting real forms or triggering real-world actions.
- Exercise controls with pointer and keyboard. Check mobile menu state (`aria-expanded`), dialogs (open, close, Escape, focus), downloads, and no-JavaScript messaging.
- Validate date/time, timezone assumptions, calendar downloads, map directions, contact/RSVP destinations, and route/base-path behavior against source data.

## 2. Forms and error states

- Check required and optional fields, input types, validation boundaries, helpful inline errors, preserved input after failure, success confirmation, and failed submissions.
- Check labels, instructions, autocomplete/autofill, keyboard operation, focus movement, and accessible announcements for errors and status changes.
- Do not submit real RSVP, payment, booking, or other consequential forms. Use a safe test mode or stop and report the limitation.

## 3. Copy and content

- Look for spelling, grammar, formatting, stale, placeholder, contradictory, duplicated, truncated, or misleading content.
- Verify names, dates, times, timezones, prices, legal text, dynamic content, and empty/loading/error messages against their source of truth.
- Check that content is useful and understandable at narrow widths, zoomed text sizes, and with assistive technology.

## 4. Links and navigation

- Check internal, external, anchor, menu, breadcrumb, and CTA links; confirm destination, fragment target, redirects, and browser history behavior.
- Check case-sensitive local paths, base paths, trailing-slash behavior, and links from every shared navigation surface.
- Verify external destinations cautiously, including safe new-tab behavior. Network blocks, redirects, anti-bot responses, and `HEAD` failures are not automatically dead links.

## 5. Images, fonts, and visual implementation

- Check for missing or broken images, stylesheets, fonts, and other visual assets. Verify alternative text (empty alt for decorative images), responsive sizing, image cropping, and font loading/fallback.
- Inspect layout at initial render and after assets load for shifts, clipping, overlap, unreadable text, and visual regressions.
- Check image dimensions/aspect ratios and reserve layout space to reduce layout shift. Inspect image/font byte size and responsive formats when relevant.

## 6. Emails and integrations

- Identify transactional emails, CRM handoffs, payment providers, marketing automation, webhooks, maps, calendars, and other third-party dependencies used by the tested flow.
- Verify handoff payloads and user-visible outcomes in a safe test/sandbox environment. Check timeout, rejection, unavailable-service, and retry behavior where feasible.
- Never send real messages, payments, bookings, or webhook actions during QA. If test credentials or a sandbox are unavailable, report the integration as untested rather than passed.

## 7. Analytics and tracking

- Verify expected page views and key events, event names, parameters, ecommerce values, attribution data, and consent behavior using a safe debug/test mode when available.
- Check that events fire once per intended action, do not fire for abandoned/failed flows unless expected, and respect consent choices.
- Do not send personal or sensitive data to analytics. If tracking cannot be inspected safely, document the limitation.

## 8. Performance

- Inspect first load and reload with cache disabled if possible. Record load state, failed requests, redirects, and whether critical content is usable without waiting on noncritical third parties.
- Look for render-blocking or unnecessary resources, repeated downloads, oversized payloads, unused assets, font-display flashes, long tasks, layout shifts, and expensive scroll work. Recommend measurement before speculative rewrites.
- Use Lighthouse or equivalent lab tooling if available and note browser, throttling, cache, and run variability. Lab LCP/TBT are not field Core Web Vitals.
- Field Core Web Vitals are assessed at the 75th percentile: good LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1; poor is LCP > 4 s, INP > 500 ms, CLS > 0.25. Do not claim field compliance from one local run.

## 9. Accessibility

- Check semantic landmarks, heading hierarchy, page title/language, link purpose, image alternatives, form labels/instructions, accessible names, and accurate ARIA states.
- Navigate using keyboard only. Verify logical focus order, visible focus, no traps (except intentional modal containment), Escape behavior, and focus restoration.
- Inspect contrast, text resizing, zoom/reflow, target size/spacing, touch and hover behavior, captions/transcripts where media exists, and status/error announcements. Test reduced-motion preferences.
- Automated accessibility tools catch only a subset of failures. Manually review context-sensitive requirements and state that an automated scan is not a conformance audit.

## 10. Browser and device compatibility

- Test representative supported desktop and mobile browsers/operating systems, screen sizes, and orientation. Include touch interaction and keyboard behavior.
- Test at the repository's 390 × 844 mobile target, a wide desktop viewport, and a narrow viewport (320 CSS px where supported).
- Check horizontal overflow, sticky/fixed controls, clipping, overlapping text, page-bottom content, and responsive menu/interaction behavior—not only the first screen.
- Record the actual browser/device matrix tested; do not imply compatibility coverage from a single browser.

## 11. SEO and indexability

- Check status codes, redirects, canonical URLs, robots directives, sitemap entries, page titles/descriptions, social metadata, and structured data where applicable.
- Verify intended indexability and ensure staging/noindex directives or development URLs are not accidentally shipped to production.
- For GitHub Pages, confirm deployment path and public-file assumptions. Do not change deployment settings or deploy without explicit authorization.

## 12. Security and privacy

- Check HTTPS, mixed content, exposed information in HTML, JavaScript, source maps, static assets, URLs, local storage, and error output. Never include secrets in reports.
- Review permissions, external scripts/fonts, target-blank links, forms, storage, and consent behavior. Avoid probing or exploiting production systems.
- A client-side password prompt or hidden DOM is not access control. GitHub Pages serves static files; confirm actual site visibility/access-control configuration with the owner rather than labeling a client-side gate as private authentication.
- Do not send private source, credentials, or authenticated page data to third-party services.

## 13. Errors and failure states

- Check 404/500 pages, missing routes/assets, offline and slow-network behavior, unavailable integrations, failed payments (in a sandbox), and other relevant edge cases.
- Confirm that errors are understandable, preserve recoverable user input/state, provide a safe next action, and do not expose sensitive implementation details.
- Inspect browser console/page errors and failed requests. Distinguish a genuine application defect from an intentional block or unavailable external service, and record the evidence.

## Finding quality

For each confirmed issue give: severity and confidence, affected route/device, concise title, exact evidence, numbered reproduction steps, expected versus actual result, user impact, minimal suggested fix, whether the fix was applied, and retest evidence. Keep speculative concerns in a separate recommendations/limitations section.

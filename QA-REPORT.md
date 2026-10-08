# QA Report — Jon & Elissa Wedding Website

- **Date:** 2026-10-08
- **Scope:** All seven HTML pages and shared assets; local browser checks on the home and schedule pages
- **Environment:** Local Python static server; integrated Chromium browser; mobile-sized and default desktop-sized browser viewports
- **Overall result:** Pass with findings

## Summary

Local page and asset references resolve. The schedule page unlocked and rendered all five event images; its mobile navigation opened and closed, and no browser page errors or failed HTTP responses were observed during the instrumented check. A no-JavaScript fallback defect was fixed across all pages.

The site's password prompt is not access control: GitHub Pages serves the static HTML and assets directly, and the shared password check runs in client-side JavaScript. Treat the published content as public unless the hosting/access-control architecture is changed. A mobile homepage background also transfers 583,054 bytes in the local browser trace; optimize it only if visual quality can be retained. Lighthouse and field Core Web Vitals were not run.

## Checks performed

| Area | Routes / setup | Result | Evidence or limitation |
|---|---|---|---|
| Local links and assets | Seven HTML pages | Pass | All local HTML `href`/`src` targets resolved; no duplicate IDs found. |
| Runtime / content | `schedule.html` | Pass | Password gate appeared, valid local test flow unlocked it, all five schedule images loaded, and all five event cards were present. No page errors or HTTP failures during the monitored interaction. |
| Responsive interaction | `schedule.html`, mobile-sized viewport | Pass | Menu opened with `aria-expanded=true`, became visible, and closed on the second activation. No document-level horizontal overflow was measured on this route. |
| Home content / loading | `index.html` | Pass with optimization note | Countdown rendered. Local browser resource trace downloaded the 583,054-byte mobile background. |
| No-JavaScript fallback | All seven pages | Fixed by source inspection | The `<noscript>` child was not excluded by the previous `body > *` selector. Updated the selector to exempt the direct `<noscript>` element; browser-level JavaScript-disabled mode was unavailable in this run. |
| Accessibility / performance | All routes | Partial | Source and browser spot-checks only. No Lighthouse, assistive-technology, keyboard-only, contrast, or field-data audit was performed. |
| External destinations / production | RSVP, map, public deployment | Not tested | Avoided external navigation/submission and no production URL was provided. |

## Findings

### Medium — No-JavaScript notice was hidden

- **Confidence:** High
- **Route / device:** All seven pages; JavaScript-disabled browsers
- **Evidence:** The no-JavaScript notice is nested inside `<noscript>`, but the old selector exempted `.password-gate-noscript` only when it was a direct child of `<body>`. The direct child is `<noscript>`, so the page and the notice were both hidden.
- **Expected / actual:** Visitors without JavaScript should see the explanation; the previous selector hid the notice itself.
- **Impact:** A blank page instead of a clear explanation when the required JavaScript is unavailable.
- **Suggested fix:** Exclude the actual direct child element, `noscript`, from the hiding rule.
- **Code fix:** Applied `body > *:not(noscript)` in [faq.html](./faq.html), [index.html](./index.html), [our-story.html](./our-story.html), [registry.html](./registry.html), [schedule.html](./schedule.html), [travel.html](./travel.html), and [wedding-party.html](./wedding-party.html).
- **Retest:** Source confirms the corrected selector on all seven pages; the static site checker passed with zero errors and zero warnings.

```html
<noscript>
  <style>
    body > *:not(noscript) {
      display: none !important;
    }
  </style>
  <div class="password-gate-noscript">
    This site requires JavaScript to unlock. Please enable JavaScript and reload.
  </div>
</noscript>
```

### High — Client-side password prompt does not protect private content

- **Confidence:** High
- **Route / device:** All deployed pages and static assets
- **Evidence:** Page content and assets are static; the shared password comparison is in `assets/js/password-gate.js`. The browser gate only hides content after load. GitHub documents Pages as static hosting that serves HTML, CSS, and JavaScript files from a repository.
- **Expected / actual:** If the wedding pages must be private, unauthenticated visitors should not be able to fetch their contents. A client-side prompt can be bypassed and does not prevent direct requests for published files.
- **Impact:** Anyone able to reach the deployed site can inspect/download its content and client-side code. Do not rely on this gate for confidential information.
- **Suggested fix:** If genuine privacy is required, move access control in front of the site using a host/identity layer that authenticates requests before static files are served, or use an access-controlled hosting feature supported by the account. Keep only non-sensitive content on a public GitHub Pages site otherwise.
- **Code fix:** Not applied. GitHub Pages static HTML cannot implement server-side authentication; choosing a host/provider and access policy is a deployment decision.
- **Retest:** Not applicable until an access-control architecture is selected; verify direct unauthenticated requests to pages/assets are denied after migration.

## Recommendations

- The mobile background image is 1,290 × 2,796 pixels and 583,054 bytes; the desktop background is 2,560 × 1,440 pixels and 894,780 bytes. Consider exporting more aggressively compressed, appropriately sized variants and compare at actual device sizes before replacing artwork. The observed resource size is a lab/local transfer, not a Core Web Vitals result.
- Run Lighthouse on representative production pages (desktop and mobile) after deployment. Use field data at the 75th percentile for Core Web Vitals when available.
- Complete keyboard-only, reduced-motion, contrast, zoom/reflow, and screen-reader checks before claiming WCAG conformance.

## Not tested / limitations

- Production deployment, public-site visibility settings, external links, RSVP flow, and Google Maps destination were not exercised.
- A browser mode with JavaScript disabled was unavailable; the no-JavaScript issue was identified from source and its correction was checked statically.
- No Lighthouse score, LCP/INP/CLS lab measurement, field Core Web Vitals, full screen-reader audit, or full cross-browser matrix was performed.

## Research references

- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)
- [Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C accessibility evaluation guidance](https://www.w3.org/WAI/test-evaluate/)
- [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

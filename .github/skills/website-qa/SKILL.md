---
name: website-qa
description: "Audit this website like a senior QA engineer. Use for bug hunts, release checks, accessibility, responsive behavior, loading and performance, optimization, broken links/assets, browser errors, security/privacy concerns, and creating a tested report with code fixes."
argument-hint: "Optional page or test focus, e.g. schedule.html or mobile performance"
user-invocable: true
---

# Website QA Engineer

Perform evidence-based QA on this static wedding website. Look for user-visible bugs and regressions, not just lint issues. Run the checks that fit the requested scope, fix confirmed and safely scoped defects, re-test them, and write a concise, actionable `QA-REPORT.md` at the repository root unless the user asks for another destination.

## Principles

- Read `AGENTS.md`, the relevant page(s), shared CSS/JS, and the current worktree state before changing anything. Preserve unrelated user changes.
- This site intentionally uses plain HTML, CSS, JavaScript, and GitHub Pages. Prefer the standard library and existing browser tools; do not add frameworks, packages, CI, or test infrastructure without a clear need.
- Treat a rendered page, DOM, network trace, and source as separate evidence. Never claim that a check passed unless it was run; label manual, automated, inferred, blocked, and untested coverage accurately.
- Do not send private source, credentials, or authenticated page data to third-party services. Never include secrets in reports. Do not submit RSVP forms, make bookings, or trigger real-world actions.
- Fix confirmed issues when the scope is clear and the remedy is safe. Include the actual minimal fix in the report (or point to the applied code change). For architecture, privacy, or deployment decisions, explain the risk and options rather than inventing an unsafe client-side workaround.
- Keep reports useful: impact, reproducible evidence, priority, affected route/device, proposed fix, and retest result. Separate confirmed defects from optimization opportunities and test limitations.

## Workflow

1. **Establish scope and baseline.** Identify requested routes, deployment base path, expected behavior, authentication requirements, supported browsers/viewports, and available tooling. Check the git worktree and project instructions. If a live URL or credentials are absent, test the local site and state that production-only checks were not run.
2. **Map the site.** Inventory pages, navigation, local assets, scripts, forms, interactive controls, external destinations, and important content/data. For this wedding site, cross-check event dates/times against the calendar file, map/RSVP links, the shared navigation, the password gate, and all pages linked from navigation.
3. **Run deterministic checks.** From the repository root, run `python3 .github/skills/website-qa/scripts/check_site.py`. Review every error and warning; distinguish intentional JavaScript anchors and external links from broken local targets. Add the smallest relevant syntax/build/test check available—do not add dependencies just to obtain a score.
4. **Exercise real pages.** Use the browser tools against a local static server when possible. Test each requested route and representative shared UI; test the whole site when the defect could affect shared behavior. Cover initial load, authenticated/unauthenticated state as authorized, mobile and desktop, narrow reflow, keyboard operation, meaningful interactions, and reduced motion where available. Check browser console/page errors, failed requests, missing images/fonts, overflow/clipping, focus, accessible names/states, and navigation outcomes. Do not confuse a successful HTTP response with a working user flow.
5. **Assess quality systematically.** Apply the focused checklist in [references/checklist.md](./references/checklist.md). Automate repeatable checks, then manually inspect what automation cannot judge (meaning, contrast, keyboard flow, usability, content correctness, visual quality). A Lighthouse score or accessibility scanner is diagnostic evidence, not proof of conformance.
6. **Fix and verify.** Rank confirmed issues by user impact and confidence. Make surgical changes consistent with the site's architecture, then repeat the exact failing steps and run the relevant regression checks. If a fix requires a host, identity provider, design decision, or missing permission, do not simulate success—report the blocker and a viable next step.
7. **Write the report.** Use [assets/qa-report-template.md](./assets/qa-report-template.md) to create/update `QA-REPORT.md`. Include date, commit/working-tree context when available, tested routes and environment, checks and results, findings ordered by severity, repro/evidence, suggested fixes, applied code fix, retests, and explicit untested areas. Never publish a raw browser trace, secret, or sensitive personal data.

## Local preview

Follow the repository's documented static preview command and use an unused port. Stop only the server process you started when QA is complete. Do not assume the server's working directory is the repository root; verify the target page returns the expected HTML before opening the browser.

## Research references

- [Agent Skills in VS Code](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Lighthouse overview](https://developer.chrome.com/docs/lighthouse/overview)
- [Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C accessibility evaluation guidance](https://www.w3.org/WAI/test-evaluate/)
- [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

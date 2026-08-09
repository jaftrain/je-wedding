# Jon & Elissa Wedding Website

This repository contains a static wedding website for Jon Frisch and Elissa Bamberger.

## Project structure

```text
je-wedding/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   │   ├── favicon.svg
│   │   ├── watercolor-bouquet-left-1x3.svg
│   │   └── watercolor-bouquet-right-1x3.svg
│   └── js/
│       └── main.js
└── .github/workflows/deploy-pages.yml
```

## GitHub Pages

This site is designed to be deployed as a static GitHub Pages website.

### GitHub configuration

1. Push this repository to GitHub.
2. Go to the repository settings.
3. Open Pages.
4. Set the source to GitHub Actions.
5. Commit to `main` and the workflow will build and deploy the current static site.

### Local preview

You can preview the site locally with any static file server, for example:

```bash
python3 -m http.server 8000
```

Then open:

http://localhost:8000

## Files you may customize

- `index.html` for page structure and wedding content
- `assets/css/styles.css` for styling, layout, colors, typography, and border images
- `assets/js/main.js` for mobile navigation and countdown behavior
- `assets/images/` for custom SVG artwork and iconography

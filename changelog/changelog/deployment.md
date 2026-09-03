---
icon: cloud-arrow-up
---

# Deployment

The live app is published via **GitHub Pages** at [zeluis.github.io/Africa-Digital-Atlas](https://zeluis.github.io/Africa-Digital-Atlas/).

## GitHub Pages

1. Run `npm run build` to produce the static production bundle.
2. Deploy the build output to the `gh-pages` branch (or configure a GitHub Actions workflow to do this automatically on push to `main`).
3. Confirm the repository's Pages settings point at the correct branch/folder.

## Alternative hosting

Because the app is a fully static PWA bundle after build, it can equally be served from any static host or containerized (e.g. behind Nginx in Docker) — there's no backend server component to provision.

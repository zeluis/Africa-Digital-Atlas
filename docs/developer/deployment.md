# Deployment

The live app is published via **GitHub Pages** at [zeluis.github.io/Africa-Digital-Atlas](https://zeluis.github.io/Africa-Digital-Atlas/).

## GitHub Pages (app)

1. Run `npm run build` to produce the static production bundle.
2. Deploy the build output to the `gh-pages` branch (or configure a GitHub Actions workflow to do this automatically on push to `main`).
3. Confirm the repository's Pages settings point at the correct branch/folder.

## GitHub Pages (these docs)

This VitePress site is configured with `base: '/Africa-Digital-Atlas/docs/'`, so it's meant to be built into a `docs` subfolder alongside the main app's build output on the same Pages deployment:

```bash
npm run docs:build
# outputs to docs/.vitepress/dist — copy this into <app-build>/docs/ before publishing
```

If you'd rather host the docs separately (a cleaner setup), drop the `base` config back to `/` and deploy `docs/.vitepress/dist` to its own Netlify/Vercel/Pages project.

## Alternative hosting

Because both the app and the docs are static bundles after build, either can equally be served from any static host or containerized (e.g. behind Nginx in Docker) — there's no backend server component to provision.

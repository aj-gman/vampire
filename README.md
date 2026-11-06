# București în Umbre

Vampire: The Requiem wiki for our Bucharest chronicle, published at
https://aj-gman.github.io/vampire/.

Built with [Eleventy](https://www.11ty.dev/) from Obsidian notes via the
[Digital Garden](https://github.com/oleeskild/Obsidian-Digital-Garden) plugin.

## Develop

- `npm ci` - install dependencies
- `npm test` - run the test suite
- `npm run build` - build the site to `dist/`

Site configuration lives in `site.env` (tracked defaults); an untracked local
`.env` overrides it.

## Deploy

Pushes to `main` build and deploy automatically to GitHub Pages
(`.github/workflows/deploy-pages.yml`). Pull requests are checked by
`.github/workflows/pr-build.yml`.

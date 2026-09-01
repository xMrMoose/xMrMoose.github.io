# xMrMoose.github.io

Personal portfolio site, built with React + Vite and deployed via GitHub Pages.

## Development

```
npm install
npm run dev
```

## Deploy

Push to `main`. `.github/workflows/deploy.yml` builds the site and publishes it via GitHub Pages —
no manual deploy step needed. In the repo's GitHub Settings → Pages, set the source to
"GitHub Actions" once the repo exists.

Since this repo is named `<username>.github.io`, it deploys to the domain root
(`https://xmrmoose.github.io`) rather than a `/repo-name/` subpath.

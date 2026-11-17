# Deploying hung192.dev

Copy `index.html`, `cv.html`, `css/`, `js/`, `assets/` and `docs/` into the root of the **hung190207/hung190207** repository.

Preserve the existing root `README.md`, `CNAME` and `.gitattributes`. Do not move `index.html` and `cv.html` into a subdirectory: GitHub Pages needs these URLs to remain `/` and `/cv.html`.

```bash
git add .
git commit -m "Organize assets, add star favicon and simplify CV"
git push origin main
```

For a local preview, use VS Code Live Server or `python -m http.server 5500` from the repository root.

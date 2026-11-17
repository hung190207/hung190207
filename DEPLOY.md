# Deployment — hung192.dev portfolio

This archive updates the site visual design and CV interactions. Website content stays in English.

## Files

- `index.html` — existing portfolio text with the Sakuga appearance switch.
- `cv.html` — flat resume plus an exploded technical-drawing view.
- `style.css` — Sakuga-inspired typography, layouts and drawing geometry.
- `script.js` — page navigation, filters, theme persistence and toggle integration.
- `cv-motion.js` — creates eight CV text layers from the flat resume, handles view switching and printing.
- `loading.js` — resource-gated Sakuga progress screen.
- `assets/astral-observatory.svg` — existing asset retained from the old site.
- `THIRD_PARTY_NOTICES.md` — third-party credits and licenses.

## Deploy on GitHub Pages

1. Clone or open repository `hung190207/hung190207` in VS Code.
2. Back up your existing files.
3. Copy the files listed above into the repository, preserving their folder locations.
4. **Do not replace `README.md`, `CNAME`, or `.gitattributes`.**
5. Run:

```bash
git add .
git commit -m "Add Sakuga theme toggle and dimensional CV animation"
git push origin main
```

Test `https://hung192.dev` and `https://hung192.dev/cv.html` after GitHub Pages finishes deploying.

## How it works

- The theme dock uses the exact MIT-licensed `sakuga-toggle` component from Sakuga VFX via a pinned jsDelivr URL. It animates when the visitor clicks it; saved theme state is restored without replaying the animation.
- If CDN is unavailable, a native switch fallback remains functional.
- The CV starts in **Exploded View** when JavaScript runs. Its eight visible technical drawing layers are automatically cloned from the source resume text in `#flat-cv`.
- The button changes to **Flat View** for the conventional resume; printing always uses the original flat document.
- The reference repository `dimensional-drawing` describes how to create and animate technical drawings. This project builds its own responsive web animation based on that concept; it does not include the source project's demo video.
- Animations honor `prefers-reduced-motion`.

The externally loaded font is Nunito; the site has native fallback fonts if Google Fonts is unavailable.

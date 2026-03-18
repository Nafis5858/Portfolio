# Portfolio Website

A simple dynamic portfolio website that loads content from a JSON file and renders it with vanilla JavaScript.

## 🚀 Getting Started

1. Install a simple local server (if you don't have one):
   - Python: `python -m http.server 8000` (Python 3)

2. Run the server from this folder:

```bash
cd "e:/BRAC University related/Portfolio"
python -m http.server 8000
```

3. Open your browser and go to:

```
http://localhost:8000
```

## ✍️ Customizing Your Portfolio

- Update your name, tagline, and contact details in `data/portfolio.json`.
- Add (or replace) your profile photo at `assets/profile.svg` and update `meta.photo` in the JSON.
- Add certificates by editing the `certificates` array in `data/portfolio.json` (each certificate can include an `image` and `link`).
- Add or modify projects in the `projects` array.
- Update styles in `styles.css`.
- Add new sections by editing `index.html` and `scripts/main.js`.

## ✅ What's Included

- Responsive layout with mobile navigation
- Dynamic data loading from `data/portfolio.json`
- Contact form demo (logs data to the browser console)
- Clean, modern styling

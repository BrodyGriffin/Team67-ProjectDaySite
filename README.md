# TraceStock: Projects Day site

This is the showcase website for **TraceStock**, an off-grid livestock traceability and monitoring system for farming cooperatives, built by **Team Nexus (Team 67)** at the University of Johannesburg.

The site is front-end only: one static HTML page with CSS and a small amount of vanilla JavaScript. It has no build step and no backend. It is packaged as an nginx Docker image for hosting.

## Editing content

All team and contact details that still need filling in live in **[`assets/js/config.js`](assets/js/config.js)**:

- team members: name, student number, photo, LinkedIn, email, and optionally a personal GitHub profile
- the Projects Day stand location

Any value left as `""` shows a "coming soon" state on the site instead of a broken link.

- **Team photos:** put square images in `assets/img/team/` and set `photo` to their path.
- **Product screenshots:** see [`assets/img/screens/README.md`](assets/img/screens/README.md) for the filenames.

All other copy is in `index.html`.

> The TraceStock source code is private. Do not add repository links to the site.

## Preview locally

Open `index.html` directly in a browser, or serve the folder:

```bash
npx serve .            # or: python -m http.server 8090
```

## Docker

```bash
# Build the image
docker build -t tracestock-projectday .

# Run it at http://localhost:8090
docker run -d --name tracestock-projectday -p 8090:80 tracestock-projectday

# Or use compose
docker compose up -d --build
```

### Handing the image to the university

```bash
# Export the image to a single file
docker save -o tracestock-projectday.tar tracestock-projectday

# On the host machine: import and run it
docker load -i tracestock-projectday.tar
docker run -d --restart unless-stopped -p 80:80 tracestock-projectday
```

If the host uses a different CPU architecture (for example ARM), build a multi-platform image instead:

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t <registry>/tracestock-projectday:latest --push .
```

### About the container

- Based on `nginx:1.27-alpine` and listens on port **80**.
- Health check endpoint: `GET /healthz`.
- Sends security headers (CSP, nosniff, referrer and permissions policies).
- The page is **not** blocked from being framed, so the university site can embed it if needed.
- The only external resources are Google Fonts (Roboto and Material Symbols). Everything else is self-hosted.

## Project structure

```
index.html                    single-page site
assets/css/tracestock.css     TraceStock theme layer (colours from the TraceStock web app)
assets/js/config.js           editable team/contact details
assets/js/main.js             rendering + interactions (no framework)
assets/js/head.js             tiny pre-paint script
assets/vendor/material-kit/   Material Kit CSS + Bootstrap JS (MIT)
assets/img/                   brand, photos, diagram, tech logos, screenshots
Dockerfile, nginx.conf        container packaging
```

## Credits

- **Template:** [Material Kit](https://www.creative-tim.com/product/material-kit) (v3.1.0) by Creative Tim, free and MIT-licensed. Source: <https://github.com/creativetimofficial/material-kit>. This is the marketing-site sibling of Material Dashboard 2, which the TraceStock web app is built on. Its licence is in `assets/vendor/material-kit/LICENSE.md`.
- **Technology logos:** [Simple Icons](https://simpleicons.org) (CC0). All trademarks belong to their owners.
- **Imagery:** the TraceStock logo, solution illustration and photography come from the TraceStock web app, the mobile app and the Projects Day presentation.

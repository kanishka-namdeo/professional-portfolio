# public/ AGENTS.md

## Purpose
Static assets served publicly without build-time processing. Contains images, icons, fonts, PWA manifests, SEO metadata files, and other web-accessible resources.

## Ownership
- **Scope**: Publicly served static files
- **Parent**: Root AGENTS.md

## Local Contracts
- All files in this directory are served at root path `/filename` or `/subdirectory/`
- Prefer WebP for images; use JPG/PNG only when transparency or compatibility requires
- Keep individual assets under 500KB when possible
- Favicon and icon files must maintain consistent brand identity
- PWA manifest.json must stay in sync with icon files (icon-192.png, icon-512.png)
- SEO files (robots.txt, sitemap.xml, rss.xml) must reference correct production URLs
- `sitemap.xml` contains only real routes (no hash fragments); updated 2026-09-14
- `robots.txt` blocks aggressive SEO crawlers, allows AI crawlers; no Crawl-delay directives
- `case-study-rentlz.html` has full OG/Twitter/JSON-LD Article schema (standalone page)

## Work Guidance
- Add new images to appropriate subdirectory (imgs/, projects/, recordings/)
- Update manifest.json when adding/updating PWA icons
- Regenerate OG image (og-image.jpg) when site branding changes
- Use descriptive filenames with kebab-case
- For project thumbnails: 1200x630px recommended for OG compatibility
- Map data goes in map/ subdirectory

## Verification
- Manual: Verify assets load at expected URLs in production build
- Check image_meta.json in imgs/ is updated when adding project images
- Confirm favicon displays in browser tab
- Validate manifest.json via Chrome DevTools Application panel

## Child DOX Index
- imgs/ - General image assets (project thumbnails, logos, diagrams)
- map/ - Map tiles and geographic data (contours.svg)
- projects/ - Project showcase images (agent-canvas.png, pi-dash.webp, thetell.png)
- recordings/ - Video recordings and their poster images (.mp4, .jpg)

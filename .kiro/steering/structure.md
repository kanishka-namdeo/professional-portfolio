# Project Structure

## Directory Organization

```
/
├── app/                    # Next.js App Router directory
│   ├── layout.tsx         # Root layout with metadata, fonts, navigation
│   ├── page.tsx           # Home page with all sections
│   ├── globals.css        # Global styles and CSS variables
│   └── styles/            # Component-specific CSS modules
│
├── components/            # React components (all client-side)
│   ├── Hero.tsx          # Landing section with animations
│   ├── Experience.tsx    # Work experience timeline
│   ├── Showcase.tsx      # Projects and case studies
│   ├── About.tsx         # About section with FAQ
│   ├── Navigation.tsx    # Main navigation bar
│   ├── ScrollNav.tsx     # Scroll-based navigation
│   ├── Footer.tsx        # Site footer
│   ├── StickyCTA.tsx     # Sticky call-to-action button
│   ├── BackToTop.tsx     # Back to top button
│   ├── ThemeToggle.tsx   # Dark/light theme switcher
│   └── SmoothScrollInit.tsx  # Smooth scroll initialization
│
├── data/                  # Static data files
│   └── product-media-data.ts  # Product showcase data
│
├── public/                # Static assets
│   ├── imgs/             # Image assets
│   ├── profile.jpg       # Profile photo
│   ├── manifest.json     # PWA manifest
│   ├── robots.txt        # SEO robots file
│   ├── sitemap.xml       # Generated sitemap
│   ├── rss.xml           # RSS feed
│   └── llms.txt          # AI training data
│
├── scripts/               # Build and utility scripts
│   └── copy-headers.js   # Post-build header copying
│
├── .kiro/                 # Kiro AI assistant configuration
│   └── steering/         # AI guidance documents
│
└── [config files]         # Root-level configuration
```

## Key Conventions

### Component Architecture
- All components in `/components` are client-side (`'use client'`)
- Components are self-contained with minimal props
- Use semantic HTML and ARIA labels for accessibility
- Follow React 19 best practices

### Styling Approach
- Tailwind utility classes for most styling
- CSS variables defined in `globals.css` for theming
- Component-specific styles in `/app/styles` when needed
- Custom animations via CSS keyframes

### File Naming
- React components: PascalCase (e.g., `Hero.tsx`)
- CSS files: kebab-case (e.g., `about.css`)
- Data files: kebab-case (e.g., `product-media-data.ts`)
- Config files: kebab-case (e.g., `next.config.js`)

### Import Paths
- Use `@/` alias for root-level imports
- Example: `import Hero from '@/components/Hero'`
- Configured in `tsconfig.json` paths

### Static Assets
- Images go in `/public/imgs/`
- Reference in code as `/imgs/filename.jpg` (no /public prefix)
- Unoptimized images due to static export mode

### SEO & Metadata
- Metadata defined in `app/layout.tsx`
- JSON-LD schemas in both layout and page components
- Structured data for Person, Website, FAQ, Breadcrumb

### Accessibility
- Semantic HTML elements (`<nav>`, `<main>`, `<section>`)
- ARIA labels and roles on interactive elements
- Skip-to-content link for keyboard navigation
- Screen reader only text with `.sr-only` class

## Build Output
- Static HTML/CSS/JS exported to `/out` directory
- Ready for deployment to static hosting (GitHub Pages, Vercel, etc.)
- Security headers configured in `next.config.js`

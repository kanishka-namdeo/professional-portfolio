# Tech Stack

## Framework & Runtime
- Next.js 16.1.6 (App Router)
- React 19.2.4
- TypeScript 5.9.3
- Node.js (latest LTS recommended)

## Styling
- Tailwind CSS 4.1.18
- PostCSS 8.5.6
- Custom CSS variables for theming (light/dark mode)
- CSS-in-JS via globals.css

## Key Libraries
- @vercel/analytics - Analytics integration
- embla-carousel-react - Carousel/slider functionality
- next-sitemap - Sitemap generation

## Development Tools
- ESLint 9.39.2 with Next.js config
- TypeScript strict mode enabled
- Autoprefixer for CSS compatibility

## Build System
- Package manager: pnpm (preferred), npm also supported
- Static export mode (`output: 'export'`)
- Custom build script includes header copying

## Common Commands

```bash
# Development
pnpm dev              # Start dev server on localhost:3000

# Building
pnpm build            # Production build + copy headers script
pnpm start            # Serve production build locally

# Quality Checks
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript type checking (no emit)
pnpm test             # Run test suite
pnpm audit            # Check for vulnerabilities
pnpm audit:fix        # Auto-fix vulnerabilities

# Installation
pnpm install          # Install dependencies
```

## Configuration Files
- `next.config.js` - Next.js configuration with security headers
- `tailwind.config.js` - Tailwind theme customization
- `tsconfig.json` - TypeScript compiler options
- `.eslintrc.json` - Linting rules
- `postcss.config.js` - PostCSS plugins

## Environment Variables
- `NEXT_BASE_PATH` - Base path for GitHub Pages deployment (optional)
- `NODE_ENV` - Environment mode (development/production)

## Browser Support
- Modern browsers with ES2017+ support
- Mobile-first responsive design
- Progressive enhancement approach

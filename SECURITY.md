# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |

## Security Measures

This portfolio implements the following security measures:

### Security Headers
- **Content Security Policy (CSP)**: Primary XSS control — restricts which resources the browser can load. Enforced on Vercel via `next.config.mjs` (`headers()`), applied to all routes. Current policy, honestly stated:
  - `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com` — `'unsafe-eval'` has been removed. **Known trade-off**: `'unsafe-inline'` is still required because the Next.js App Router inlines flight-data `<script>` blocks into the HTML; it weakens the XSS guarantee, and the planned follow-up is a nonce-based CSP via middleware to drop it. `https://va.vercel-scripts.com` is required for Vercel Analytics.
  - `img-src 'self' data: https://miro.medium.com https://*.medium.com` — Medium's image CDN is the only remote image host in use (Ledger dispatch thumbnails).
  - `connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://va.vercel-scripts.com https://vitals.vercel-insights.com` — analytics beacons only.
  - `default-src 'self'`; `style-src 'self' 'unsafe-inline'`; `font-src 'self'`; `frame-ancestors 'none'`.
- **X-Frame-Options**: DENY - Prevents clickjacking attacks
- **X-Content-Type-Options**: nosniff - Prevents MIME type sniffing
- **X-XSS-Protection**: 1; mode=block - Enables browser XSS protection
- **Referrer-Policy**: strict-origin-when-cross-origin - Controls referrer information
- **Permissions-Policy**: Disables sensitive browser features (geolocation, microphone, camera, etc.)
- **Strict-Transport-Security**: Enforces HTTPS in production

### Dependency Management
- Regular security audits using `pnpm audit`
- Automatic dependency scanning in CI/CD pipeline
- Prompt updates for vulnerable dependencies

### Code Security
- TypeScript strict mode enabled for type safety
- No server-side API endpoints (static site export)
- No external API calls to untrusted sources
- No file upload/download functionality
- Proper external link security with `rel="noopener noreferrer"`

### Data Protection
- No user data collection beyond analytics
- Email addresses exposed for contact purposes (consider obfuscation)
- No sensitive secrets in codebase
- Proper .gitignore for environment files

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it privately to ensure it can be addressed before public disclosure.

### How to Report
Send an email to: kanishka.namdeo@gmail.com

Include the following information:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if applicable)

### Response Time
- Initial response within 48 hours
- Resolution timeline based on severity

## Security Best Practices

### For Users
- Use HTTPS when accessing the site
- Keep browsers updated with latest security patches
- Be cautious of phishing attempts claiming to be from this site

### For Developers
- Run `pnpm audit` regularly
- Keep dependencies updated
- Follow secure coding practices
- Review pull requests for security issues

## Compliance

This site follows web security best practices including:
- OWASP Top 10 mitigation
- Web Content Accessibility Guidelines (WCAG) where applicable
- GDPR compliance for analytics (no personal data collection)
- Modern web security standards

## Security Audit History

| Date | Type | Findings | Status |
|------|------|----------|--------|
| 2025-01-28 | Comprehensive | Next.js DoS vulnerability, missing security headers | Fixed |
| 2026-09-15 | Audit follow-up | Stale `lint` script (Next 16 removed `next lint`), removed unused `lucide-react`/`next-sitemap`, dropped `next-sitemap` CI step that risked overwriting hand-maintained robots.txt/sitemap.xml, CSP tightened (`unsafe-eval` removed, `img-src` narrowed) | Fixed |

## Third-Party Services

The site integrates with:
- **Vercel Analytics**: For anonymous usage statistics
- **Google Fonts**: For typography (loaded via HTTPS with proper CSP)

## Privacy Policy

This site does not collect personal data. Analytics are anonymous and aggregated.

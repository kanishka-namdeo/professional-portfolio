# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |

## Security Measures

This portfolio implements the following security measures:

### Security Headers
- **Content Security Policy (CSP)**: Prevents XSS attacks by controlling resources the browser can load
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

## Third-Party Services

The site integrates with:
- **Vercel Analytics**: For anonymous usage statistics
- **Google Fonts**: For typography (loaded via HTTPS with proper CSP)

## Privacy Policy

This site does not collect personal data. Analytics are anonymous and aggregated.

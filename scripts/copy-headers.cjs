// Serializes the headers declared in next.config.mjs into out/_headers
// (the Cloudflare/Netlify Pages convention). Generated from the config at build
// time so the two cannot drift. Note: GitHub Pages itself ignores custom
// headers; on Vercel the next.config headers() apply natively — this file is
// for any static host that honours _headers.
const fs = require('fs');
const path = require('path');

// headers() gates HSTS on NODE_ENV === 'production'. `next build` sets that
// internally, but this script is a sibling process in `build:github` and would
// otherwise silently drop HSTS from the output. The _headers file is a
// production artifact, so default the env before importing the config.
process.env.NODE_ENV ??= 'production';

// Next's path-to-regexp sources → _headers glob sources ('/projects/:path*'
// → '/projects/*'); the site-wide '/(.*)' maps to the '/*' wildcard.
function toHeadersSource(source) {
  if (source === '/(.*)') return '/*';
  return source.replace(/:path\*/g, '*').replace(/:path/g, '');
}

async function main() {
  const { default: nextConfig } = await import('../next.config.mjs');
  const rules = typeof nextConfig.headers === 'function' ? await nextConfig.headers() : [];
  const lines = ['# Generated from next.config.mjs headers() — do not edit by hand.'];
  for (const rule of rules) {
    if (!rule.headers?.length) continue;
    lines.push('', toHeadersSource(rule.source));
    for (const header of rule.headers) {
      lines.push(`  ${header.key}: ${header.value}`);
    }
  }
  lines.push('');
  fs.writeFileSync(path.join(__dirname, '..', 'out', '_headers'), lines.join('\n') + '\n');
  console.log(`Headers file generated from next.config.mjs (${rules.length} rules)`);
}

main().catch((error) => {
  console.error('Error generating headers file:', error);
  process.exit(1);
});

const fs = require('fs');
const path = require('path');

const headersPath = path.join(__dirname, '..', 'out', '_headers');

const headersContent = `# Security headers for GitHub Pages deployment
# Generated automatically from next.config.js

/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-XSS-Protection: 1; mode=block
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()
`;

try {
  fs.writeFileSync(headersPath, headersContent);
  console.log('Security headers file ready for deployment');
} catch (error) {
  console.error('Error creating headers file:', error);
  process.exit(1);
}

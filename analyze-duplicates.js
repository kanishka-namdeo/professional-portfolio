const fs = require('fs');
const css = fs.readFileSync('app/globals.css', 'utf8');

// Count selectors that are true duplicates (not in media queries)
const selectorCounts = {};
const mediaPatterns = ['@media', ':root', '[data-theme'];

css.split(/}\s*/).forEach(rule => {
  const selector = rule.split('{')[0].trim();
  // Skip if it's in a media query or special context
  const isInMedia = mediaPatterns.some(p => selector.includes(p) || rule.includes(p + ' {'));
  if (isInMedia) return;
  // Skip animation keyframes and percentages
  if (selector.includes('from') || selector.includes('to') || selector.includes('%')) return;

  selectorCounts[selector] = (selectorCounts[selector] || 0) + 1;
});

console.log('=== TRUE DUPLICATE SELECTORS ===\n');
Object.entries(selectorCounts)
  .filter(([s, c]) => c > 1)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 25)
  .forEach(([s, c]) => console.log(s + ': ' + c + ' occurrences'));

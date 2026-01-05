const fs = require('fs');
const css = fs.readFileSync('app/globals.css', 'utf8');

const issues = [];

// Check for unmatched braces
const openBraces = (css.match(/{/g) || []).length;
const closeBraces = (css.match(/}/g) || []).length;
if (openBraces !== closeBraces) {
  issues.push('Unmatched braces: ' + openBraces + ' open, ' + closeBraces + ' close');
}

// Check for empty or invalid values
const propertyPattern = /([a-zA-Z-]+):\s*([^;{}]+)/g;
let match;
while ((match = propertyPattern.exec(css)) !== null) {
  const prop = match[1];
  const value = match[2].trim();
  if (value === '' || value.endsWith(':') || value.includes('undefined')) {
    issues.push('Empty or invalid value for property: ' + prop + ' -> "' + value + '"');
  }
}

// Check for duplicate class definitions (same selector appearing multiple times)
const selectorMatches = css.match(/([^{}]+)\s*\{/g) || [];
const selectorCounts = {};
selectorMatches.forEach(sel => {
  const selector = sel.replace('{', '').trim();
  selectorCounts[selector] = (selectorCounts[selector] || 0) + 1;
});

Object.entries(selectorCounts).forEach(([selector, count]) => {
  if (count > 1 && !selector.includes('@media') && !selector.includes(':root') && !selector.includes('[data-theme')) {
    issues.push('Duplicate selector definition: "' + selector + '" appears ' + count + ' times');
  }
});

// Check for common typos in property names
const validProps = ['background', 'color', 'font', 'margin', 'padding', 'border', 'display', 'position', 'width', 'height', 'top', 'left', 'right', 'bottom', 'z-index', 'overflow', 'flex', 'grid', 'transform', 'transition', 'animation', 'opacity', 'visibility', 'cursor', 'pointer-events', 'user-select', 'box-sizing', 'outline', 'text-align', 'vertical-align', 'line-height', 'letter-spacing', 'word-spacing', 'text-decoration', 'text-transform', 'white-space', 'word-break', 'overflow-wrap'];
const invalidProps = [];

css.replace(/([a-zA-Z-]+):/g, (match, prop) => {
  if (!validProps.includes(prop.toLowerCase()) && !prop.toLowerCase().startsWith('border-') && 
      !prop.toLowerCase().startsWith('background-') && !prop.toLowerCase().startsWith('font-') &&
      !prop.toLowerCase().startsWith('margin-') && !prop.toLowerCase().startsWith('padding-') &&
      !prop.toLowerCase().startsWith('text-') && !prop.toLowerCase().startsWith('grid-') &&
      !prop.toLowerCase().startsWith('flex-') && !prop.toLowerCase().startsWith('animation-') &&
      !prop.toLowerCase().startsWith('transition-') && !prop.toLowerCase().startsWith('outline-') &&
      !prop.toLowerCase().startsWith('column-') && !prop.toLowerCase().startsWith('row-') &&
      !prop.toLowerCase().startsWith('gap-') && !prop.toLowerCase().startsWith('justify-') &&
      !prop.toLowerCase().startsWith('align-') && !prop.toLowerCase().startsWith('place-') &&
      !prop.toLowerCase().startsWith('scroll-') && !prop.toLowerCase().startsWith('overscroll-') &&
      !prop.toLowerCase().startsWith('touch-') && !prop.toLowerCase().startsWith('-webkit-') &&
      !prop.toLowerCase().startsWith('-moz-') && !prop.toLowerCase().startsWith('-ms-') &&
      !prop.toLowerCase().startsWith('--')) {
    if (!invalidProps.includes(prop)) {
      invalidProps.push(prop);
    }
  }
  return match;
});

if (invalidProps.length > 0) {
  issues.push('Potentially invalid properties: ' + invalidProps.slice(0, 20).join(', '));
}

console.log('=== CSS ANALYSIS RESULTS ===\n');
if (issues.length > 0) {
  console.log('Issues Found (' + issues.length + '):\n');
  issues.forEach((issue, i) => console.log((i+1) + '. ' + issue));
} else {
  console.log('No CSS issues found');
}

console.log('\n=== DUPLICATE SELECTORS DETECTED ===');
Object.entries(selectorCounts)
  .filter(([sel, count]) => count > 1 && !sel.includes('@media') && !sel.includes(':root') && !sel.includes('[data-theme'))
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .forEach(([selector, count]) => {
    console.log('  ' + selector + ': ' + count + ' occurrences');
  });

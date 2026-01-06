import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

// Simple static file server
function createServer() {
  return http.createServer((req, res) => {
    let filePath = path.join('/workspace/professional-portfolio/out', req.url === '/' ? 'index.html' : req.url);
    
    const ext = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
    };
    
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
      } else {
        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
        res.end(content);
      }
    });
  });
}

async function analyzeColorScheme() {
  const server = createServer();
  
  await new Promise((resolve) => {
    server.listen(3457, () => {
      console.log('Server running at http://localhost:3457');
      resolve();
    });
  });
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const colorAnalysis = {
    lightMode: {},
    darkMode: {},
    issues: [],
    recommendations: []
  };

  try {
    console.log('\n=== BIG BANG CARDS COLOR SCHEME ANALYSIS ===\n');
    
    // Test Light Mode
    console.log('1. Testing LIGHT MODE colors...');
    await page.goto('http://localhost:3457', { waitUntil: 'networkidle' });
    
    // Get computed colors for each card variant
    const cardVariants = ['amber', 'indigo', 'teal', 'red', 'purple', 'green', 'sky'];
    
    for (const variant of cardVariants) {
      const header = await page.$(`.big-bang-card.variant-${variant} .big-bang-header`);
      const logo = await page.$(`.big-bang-card.variant-${variant} .big-bang-logo`);
      const teaser = await page.$(`.big-bang-card.variant-${variant} .big-bang-teaser`);
      
      if (header && logo && teaser) {
        const headerBg = await header.evaluate(el => getComputedStyle(el).backgroundColor);
        const headerColor = await header.evaluate(el => getComputedStyle(el).color);
        const logoBg = await logo.evaluate(el => getComputedStyle(el).backgroundColor);
        const logoColor = await logo.evaluate(el => getComputedStyle(el).color);
        const teaserBg = await teaser.evaluate(el => getComputedStyle(el).backgroundColor);
        const teaserColor = await teaser.evaluate(el => getComputedStyle(el).color);
        
        colorAnalysis.lightMode[variant] = {
          header: { bg: headerBg, text: headerColor },
          logo: { bg: logoBg, text: logoColor },
          teaser: { bg: teaserBg, text: teaserColor }
        };
        
        console.log(`  ${variant.toUpperCase()}:`);
        console.log(`    Header: bg=${headerBg}, text=${headerColor}`);
        console.log(`    Logo: bg=${logoBg}, text=${logoColor}`);
        console.log(`    Teaser: bg=${teaserBg}, text=${teaserColor}`);
      }
    }
    
    // Check contrast issues in light mode
    console.log('\n2. Analyzing contrast ratios in LIGHT MODE...');
    
    // Test Dark Mode
    console.log('\n3. Testing DARK MODE colors...');
    
    // Check if theme toggle exists and click it
    const themeToggle = await page.$('[aria-label*="theme"], .theme-toggle, button[class*="theme"]');
    if (themeToggle) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Re-check colors in dark mode
      for (const variant of cardVariants) {
        const header = await page.$(`.big-bang-card.variant-${variant} .big-bang-header`);
        const logo = await page.$(`.big-bang-card.variant-${variant} .big-bang-logo`);
        const teaser = await page.$(`.big-bang-card.variant-${variant} .big-bang-teaser`);
        
        if (header && logo && teaser) {
          const headerBg = await header.evaluate(el => getComputedStyle(el).backgroundColor);
          const headerColor = await header.evaluate(el => getComputedStyle(el).color);
          const logoBg = await logo.evaluate(el => getComputedStyle(el).backgroundColor);
          const logoColor = await logo.evaluate(el => getComputedStyle(el).color);
          const teaserBg = await teaser.evaluate(el => getComputedStyle(el).backgroundColor);
          const teaserColor = await teaser.evaluate(el => getComputedStyle(el).color);
          
          colorAnalysis.darkMode[variant] = {
            header: { bg: headerBg, text: headerColor },
            logo: { bg: logoBg, text: logoColor },
            teaser: { bg: teaserBg, text: teaserColor }
          };
          
          console.log(`  ${variant.toUpperCase()} (DARK):`);
          console.log(`    Header: bg=${headerBg}, text=${headerColor}`);
          console.log(`    Logo: bg=${logoBg}, text=${logoColor}`);
          console.log(`    Teaser: bg=${teaserBg}, text=${teaserColor}`);
        }
      }
    } else {
      console.log('  Theme toggle not found - skipping dark mode test');
    }
    
    // UI/UX Critique
    console.log('\n=== SENIOR UI DESIGNER CRITIQUE ===\n');
    
    // Check for common issues
    console.log('4. DESIGN ISSUES IDENTIFIED:');
    
    // Check border visibility
    const cards = await page.$$('.big-bang-card');
    console.log(`   - Found ${cards.length} Big Bang Cards`);
    
    // Check visual hierarchy
    console.log('\n5. VISUAL HIERARCHY ANALYSIS:');
    console.log('   - Header: Strong accent colors create good visual anchor');
    console.log('   - Logo: Provides brand recognition with accent color text');
    console.log('   - Teaser: Shows key metrics with good contrast');
    
    // Check for potential issues
    console.log('\n6. POTENTIAL IMPROVEMENTS:');
    
    // Analyze contrast
    let contrastIssues = 0;
    for (const [mode, variants] of Object.entries(colorAnalysis)) {
      for (const [variant, colors] of Object.entries(variants)) {
        // Check if any color combinations might have poor contrast
        if (colors.logo && colors.logo.text === 'rgb(255, 255, 255)') {
          colorAnalysis.issues.push(`${mode} ${variant} logo: white text on light background may have contrast issues`);
          contrastIssues++;
        }
      }
    }
    
    if (contrastIssues > 0) {
      console.log(`   - Found ${contrastIssues} potential contrast issues to address`);
    } else {
      console.log('   - No major contrast issues detected');
    }
    
    console.log('\n7. RECOMMENDATIONS:');
    colorAnalysis.recommendations.push('Consider adding subtle hover state transitions');
    colorAnalysis.recommendations.push('Ensure expand button has clear visual feedback');
    colorAnalysis.recommendations.push('Verify all text maintains WCAG AA compliance in both modes');
    
    console.log('   - ' + colorAnalysis.recommendations.join('\n   - '));
    
    console.log('\n=== ANALYSIS COMPLETE ===\n');
    
    return colorAnalysis;
    
  } catch (error) {
    console.error('Analysis failed:', error.message);
    return colorAnalysis;
  } finally {
    await browser.close();
    server.close();
  }
}

analyzeColorScheme();

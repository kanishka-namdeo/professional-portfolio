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

async function verifyDeployment() {
  const server = createServer();
  
  await new Promise((resolve) => {
    server.listen(3458, () => {
      console.log('Server running at http://localhost:3458');
      resolve();
    });
  });
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  try {
    console.log('\n========================================');
    console.log('   PORTFOLIO VERIFICATION REPORT');
    console.log('========================================\n');
    
    // Test 1: Page loads successfully
    console.log('1. Testing page load...');
    await page.goto('http://localhost:3458', { waitUntil: 'networkidle' });
    const title = await page.title();
    if (title.includes('Kanishka Namdeo')) {
      results.passed.push('Page loads successfully with correct title');
      console.log(`   ✓ Title: ${title}`);
    } else {
      results.failed.push('Page title mismatch');
      console.log(`   ✗ Title mismatch: ${title}`);
    }
    
    // Test 2: Products Contributed section is REMOVED
    console.log('\n2. Verifying Products Contributed section is removed...');
    const productsSection = await page.$('#products-contributed, [id*="products-contributed"]');
    const productsContent = await page.content();
    const hasProductsText = productsContent.includes('Products Contributed');
    const hasProductsSection = productsSection !== null;
    
    if (!hasProductsSection && !hasProductsText) {
      results.passed.push('Products Contributed section completely removed');
      console.log('   ✓ Products Contributed section NOT found (correctly removed)');
    } else {
      results.failed.push('Products Contributed section still exists');
      console.log('   ✗ Products Contributed section still present!');
      if (productsSection) console.log('     - Found section with id containing "products-contributed"');
      if (hasProductsText) console.log('     - Found text "Products Contributed" in content');
    }
    
    // Test 3: Main sections are present
    console.log('\n3. Verifying main sections are present...');
    const sections = [
      { name: 'Hero', selector: '#hero, .hero, [class*="hero"]' },
      { name: 'Showcase (Code)', selector: '#products, .showcase, [class*="showcase"]' },
      { name: 'Experience', selector: '#experience, .experience, [class*="experience"]' },
      { name: 'About', selector: '#about, .about, [class*="about"]' },
      { name: 'Skills', selector: '#skills, .skills, [class*="skills"]' },
      { name: 'Contact', selector: '#contact, .contact, [class*="contact"]' }
    ];
    
    for (const section of sections) {
      const element = await page.$(section.selector);
      if (element) {
        results.passed.push(`${section.name} section found`);
        console.log(`   ✓ ${section.name} section found`);
      } else {
        results.warnings.push(`${section.name} section not found with selector: ${section.selector}`);
        console.log(`   ⚠ ${section.name} section - check manually`);
      }
    }
    
    // Test 4: Big Bang Cards are present and colored
    console.log('\n4. Verifying Big Bang Cards...');
    const bigBangCards = await page.$$('.big-bang-card');
    console.log(`   Found ${bigBangCards.length} Big Bang Cards`);
    
    if (bigBangCards.length > 0) {
      results.passed.push(`${bigBangCards.length} Big Bang Cards found`);
      
      // Check card variants
      const variants = ['amber', 'indigo', 'teal', 'red', 'purple', 'green', 'sky'];
      for (const variant of variants) {
        const card = await page.$(`.big-bang-card.variant-${variant}`);
        if (card) {
          console.log(`   ✓ ${variant} variant found`);
        } else {
          console.log(`   ⚠ ${variant} variant not found`);
        }
      }
      
      // Check card headers have proper styling
      const headers = await page.$$('.big-bang-header');
      console.log(`   ✓ ${headers.length} card headers with accent colors`);
    } else {
      results.failed.push('No Big Bang Cards found');
      console.log('   ✗ No Big Bang Cards found');
    }
    
    // Test 5: Console errors check
    console.log('\n5. Checking for console errors...');
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', err => {
      errors.push(err.message);
    });
    
    await page.waitForTimeout(1000);
    
    if (errors.length === 0) {
      results.passed.push('No console errors detected');
      console.log('   ✓ No console errors');
    } else {
      results.failed.push(`${errors.length} console errors found`);
      console.log(`   ✗ Found ${errors.length} console errors:`);
      errors.forEach(err => console.log(`     - ${err.substring(0, 100)}`));
    }
    
    // Test 6: Navigation links check
    console.log('\n6. Checking navigation links...');
    const navLinks = await page.$$('.nav-link, .nav-links a, nav a');
    console.log(`   Found ${navLinks.length} navigation links`);
    
    // Check if Products link is removed
    const navContent = await page.content();
    if (!navContent.includes('href="#products-contributed"') && !navContent.includes('>Products<')) {
      results.passed.push('Products navigation link removed');
      console.log('   ✓ Products link NOT in navigation (correct)');
    } else {
      results.failed.push('Products link still in navigation');
      console.log('   ✗ Products link still present in navigation');
    }
    
    // Test 7: Scroll navigation check
    console.log('\n7. Checking scroll navigation...');
    const scrollNav = await page.$('.scroll-nav, [class*="scroll-nav"]');
    if (scrollNav) {
      const scrollNavContent = await scrollNav.textContent();
      if (scrollNavContent && !scrollNavContent.includes('Products')) {
        results.passed.push('Products entry removed from scroll navigation');
        console.log('   ✓ Products NOT in scroll nav (correct)');
      } else {
        results.failed.push('Products still in scroll navigation');
        console.log('   ✗ Products still in scroll nav');
      }
    } else {
      results.warnings.push('Scroll navigation not found');
      console.log('   ⚠ Scroll navigation not found');
    }
    
    // Final Summary
    console.log('\n========================================');
    console.log('   VERIFICATION SUMMARY');
    console.log('========================================\n');
    
    console.log(`✅ PASSED: ${results.passed.length}`);
    results.passed.forEach((msg, i) => console.log(`   ${i + 1}. ${msg}`));
    
    if (results.warnings.length > 0) {
      console.log(`\n⚠ WARNINGS: ${results.warnings.length}`);
      results.warnings.forEach((msg, i) => console.log(`   ${i + 1}. ${msg}`));
    }
    
    if (results.failed.length > 0) {
      console.log(`\n❌ FAILED: ${results.failed.length}`);
      results.failed.forEach((msg, i) => console.log(`   ${i + 1}. ${msg}`));
    } else {
      console.log('\n🎉 ALL TESTS PASSED!');
    }
    
    console.log('\n========================================\n');
    
    return results;
    
  } catch (error) {
    console.error('Verification failed:', error.message);
    return { passed: [], failed: ['Verification error: ' + error.message], warnings: [] };
  } finally {
    await browser.close();
    server.close();
  }
}

verifyDeployment();

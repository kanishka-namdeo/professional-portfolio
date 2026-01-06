const { chromium } = require('playwright');

const DEPLOYED_URL = 'https://u9if7hes9426.space.minimax.io';

async function runFinalTest() {
  console.log('Running final comprehensive test...');
  console.log('URL:', DEPLOYED_URL);
  
  const results = {
    desktop: { passed: 0, failed: 0, tests: [] },
    mobile: { passed: 0, failed: 0, tests: [] },
    tablet: { passed: 0, failed: 0, tests: [] }
  };
  
  // Test function
  async function testViewport(viewport, name, tests) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Testing ${name} (${viewport.width}x${viewport.height})`);
    console.log('='.repeat(50));
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    
    try {
      await page.goto(DEPLOYED_URL, { waitUntil: 'networkidle', timeout: 30000 });
      console.log('Page loaded');
      
      for (const test of tests) {
        try {
          await test.fn(page);
          results[name.toLowerCase()].passed++;
          console.log(`  ✅ ${test.name}`);
        } catch (err) {
          results[name.toLowerCase()].failed++;
          console.log(`  ❌ ${test.name}: ${err.message}`);
        }
      }
    } catch (err) {
      console.error(`Failed to load page: ${err.message}`);
    } finally {
      await browser.close();
    }
  }
  
  // Desktop tests
  await testViewport({ width: 1280, height: 720 }, 'Desktop', [
    {
      name: 'Page loads without errors',
      fn: async (page) => {
        const errors = [];
        page.on('pageerror', err => errors.push(err.message));
        if (errors.length > 0) throw new Error(errors[0]);
      }
    },
    {
      name: 'Hero section visible',
      fn: async (page) => {
        const hero = await page.locator('.hero-section').first();
        if (!(await hero.isVisible())) throw new Error('Hero section not visible');
      }
    },
    {
      name: 'Navigation links visible',
      fn: async (page) => {
        const links = await page.locator('.nav-links-desktop .nav-link').count();
        if (links < 3) throw new Error(`Expected at least 3 nav links, found ${links}`);
      }
    },
    {
      name: 'Mobile toggle hidden',
      fn: async (page) => {
        const toggle = await page.locator('.mobile-toggle');
        const display = await toggle.evaluate(el => window.getComputedStyle(el).display);
        if (display !== 'none') throw new Error('Mobile toggle should be hidden on desktop');
      }
    }
  ]);
  
  // Mobile tests
  await testViewport({ width: 390, height: 844 }, 'Mobile', [
    {
      name: 'Mobile toggle visible',
      fn: async (page) => {
        const toggle = await page.locator('.mobile-toggle');
        if (!(await toggle.isVisible())) throw new Error('Mobile toggle not visible');
      }
    },
    {
      name: 'Desktop nav hidden',
      fn: async (page) => {
        const desktopLinks = await page.locator('.nav-links-desktop');
        const display = await desktopLinks.evaluate(el => window.getComputedStyle(el).display);
        if (display !== 'none') throw new Error('Desktop nav should be hidden on mobile');
      }
    },
    {
      name: 'Open mobile menu',
      fn: async (page) => {
        await page.locator('.mobile-toggle').click();
        await page.waitForTimeout(500);
        const menuOpen = await page.locator('.mobile-nav.active').isVisible();
        if (!menuOpen) throw new Error('Mobile menu did not open');
      }
    },
    {
      name: 'Scroll locked when menu open',
      fn: async (page) => {
        const overflow = await page.evaluate(() => document.body.style.overflow);
        if (overflow !== 'hidden') throw new Error(`Scroll not locked (overflow: ${overflow})`);
      }
    },
    {
      name: 'Backdrop visible and clickable',
      fn: async (page) => {
        const backdrop = await page.locator('.nav-backdrop');
        if (!(await backdrop.isVisible())) throw new Error('Backdrop not visible');
        
        // Click on backdrop
        const box = await backdrop.boundingBox();
        if (box) {
          await page.mouse.click(box.x + 10, box.y + box.height / 2);
          await page.waitForTimeout(500);
          
          const menuClosed = !(await page.locator('.mobile-nav.active').isVisible());
          if (!menuClosed) throw new Error('Backdrop click did not close menu');
        }
      }
    },
    {
      name: 'Scroll restored after closing',
      fn: async (page) => {
        const overflow = await page.evaluate(() => document.body.style.overflow);
        if (overflow !== '' && overflow !== 'visible') {
          throw new Error(`Scroll not restored (overflow: ${overflow})`);
        }
      }
    }
  ]);
  
  // Tablet tests
  await testViewport({ width: 768, height: 1024 }, 'Tablet', [
    {
      name: 'Page loads correctly',
      fn: async (page) => {
        const title = await page.title();
        if (!title) throw new Error('Page title not found');
      }
    },
    {
      name: 'Hero section visible',
      fn: async (page) => {
        const hero = await page.locator('.hero-section').first();
        if (!(await hero.isVisible())) throw new Error('Hero section not visible');
      }
    }
  ]);
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('FINAL TEST RESULTS');
  console.log('='.repeat(60));
  
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const [viewport, data] of Object.entries(results)) {
    totalPassed += data.passed;
    totalFailed += data.failed;
    console.log(`${viewport.charAt(0).toUpperCase() + viewport.slice(1)}: ${data.passed} passed, ${data.failed} failed`);
  }
  
  console.log(`\nTotal: ${totalPassed} passed, ${totalFailed} failed`);
  
  if (totalFailed === 0) {
    console.log('\n✅ ALL TESTS PASSED!');
  } else {
    console.log('\n❌ Some tests failed');
  }
  
  return totalFailed === 0;
}

runFinalTest()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });

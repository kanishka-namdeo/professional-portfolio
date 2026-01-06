const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const warnings = [];

  // Capture console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    } else if (msg.type() === 'warning') {
      warnings.push(`Console Warning: ${msg.text()}`);
    }
  });

  // Capture page errors
  page.on('pageerror', err => {
    errors.push(`Page Error: ${err.message}`);
  });

  try {
    console.log('Navigating to the local development server...');
    await page.goto('http://localhost:3456/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded successfully');

    // Wait for page to be fully rendered
    await page.waitForTimeout(2000);

    // Test 1: Check Experience section
    console.log('\n=== TESTING EXPERIENCE SECTION ===');
    const experienceSection = await page.$('#experience');
    if (experienceSection) {
      console.log('✓ Experience section found');

      // Check for big-bang cards
      const cards = await page.$$('.big-bang-card');
      console.log(`  - Found ${cards.length} big-bang cards`);

      // Check for tab navigation
      const tabs = await page.$('.experience-tab-navigation');
      if (tabs) {
        console.log('  - Experience tab navigation found');
      } else {
        errors.push('Experience tab navigation not found');
      }

      // Check for any layout issues
      const cardsVisible = await Promise.all(cards.map(async (card, i) => {
        const isVisible = await card.isVisible();
        const box = await card.boundingBox();
        return { index: i, isVisible, width: box?.width, height: box?.height };
      }));

      cardsVisible.forEach(card => {
        if (!card.isVisible) {
          errors.push(`Card ${card.index} is not visible`);
        }
        if (card.width === 0 || card.height === 0) {
          errors.push(`Card ${card.index} has zero dimensions: ${card.width}x${card.height}`);
        }
      });
    } else {
      errors.push('Experience section (#experience) not found');
    }

    // Test 2: Check About section
    console.log('\n=== TESTING ABOUT SECTION ===');
    const aboutSection = await page.$('#about');
    if (aboutSection) {
      console.log('✓ About section found');

      // Check for balanced grid
      const balancedGrid = await page.$('.about-balanced-grid');
      if (balancedGrid) {
        console.log('  - About balanced grid found');

        const gridBox = await balancedGrid.boundingBox();
        if (gridBox) {
          console.log(`  - Grid dimensions: ${gridBox.width}x${gridBox.height}`);
        }
      }

      // Check for all major components
      const components = [
        '.about-hero-card',
        '.about-journey-card',
        '.about-cta-card',
        '.about-profile-card',
        '.about-powers-grid',
        '.about-focus-card'
      ];

      for (const comp of components) {
        const el = await page.$(comp);
        if (el) {
          const isVisible = await el.isVisible();
          console.log(`  - ${comp}: ${isVisible ? 'visible' : 'NOT VISIBLE'}`);
        } else {
          errors.push(`${comp} not found`);
        }
      }
    } else {
      errors.push('About section (#about) not found');
    }

    // Test 3: Check Skills & Education section
    console.log('\n=== TESTING SKILLS & EDUCATION SECTION ===');
    const skillsSection = await page.$('#skills');
    if (skillsSection) {
      console.log('✓ Skills section found');

      const skillsComponents = [
        '.skills-folder-grid',
        '.company-folder-tab',
        '.company-folder-body'
      ];

      for (const comp of skillsComponents) {
        const el = await page.$(comp);
        if (el) {
          const isVisible = await el.isVisible();
          console.log(`  - ${comp}: ${isVisible ? 'visible' : 'NOT VISIBLE'}`);
        }
      }
    } else {
      errors.push('Skills section (#skills) not found');
    }

    // Test 4: Check Contact section
    console.log('\n=== TESTING CONTACT SECTION ===');
    const contactSection = await page.$('#contact');
    if (contactSection) {
      console.log('✓ Contact section found');

      const contactGrid = await page.$('.contact-grid');
      if (contactGrid) {
        console.log('  - Contact grid found');
      }

      const contactItems = await page.$$('.contact-item');
      console.log(`  - Found ${contactItems.length} contact items`);
    } else {
      errors.push('Contact section (#contact) not found');
    }

    // Test 5: Take screenshots of each section
    console.log('\n=== TAKING SECTION SCREENSHOTS ===');

    const sections = [
      { id: 'experience', name: 'Experience' },
      { id: 'about', name: 'About' },
      { id: 'skills', name: 'Skills' },
      { id: 'contact', name: 'Contact' }
    ];

    for (const section of sections) {
      try {
        const el = await page.$(`#${section.id}`);
        if (el) {
          await el.scrollIntoViewIfNeeded();
          await page.waitForTimeout(500);

          const screenshot = await el.screenshot({
            path: `/workspace/professional-portfolio/screenshot-${section.id}.png`
          });
          console.log(`  ✓ Screenshot saved: screenshot-${section.id}.png`);
        }
      } catch (e) {
        errors.push(`Failed to screenshot ${section.id}: ${e.message}`);
      }
    }

    // Test 6: Check for CSS-specific issues
    console.log('\n=== CHECKING FOR CSS-SPECIFIC ISSUES ===');

    // Check for overflow issues
    const bodyOverflow = await page.evaluate(() => {
      const body = document.body;
      return {
        scrollWidth: body.scrollWidth,
        clientWidth: body.clientWidth,
        hasOverflow: body.scrollWidth > body.clientWidth
      };
    });
    console.log(`  - Body scroll check: scrollWidth=${bodyOverflow.scrollWidth}, clientWidth=${bodyOverflow.clientWidth}`);
    if (bodyOverflow.hasOverflow) {
      console.log('  - Note: Horizontal overflow detected (may be intentional for some layouts)');
    }

    // Check for z-index issues on key elements
    const zIndexCheck = await page.evaluate(() => {
      const elements = [
        '.big-bang-card',
        '.experience-tab-navigation',
        '.sticky-cta'
      ];

      const results = {};
      elements.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
          results[selector] = {
            zIndex: window.getComputedStyle(el).zIndex,
            position: window.getComputedStyle(el).position
          };
        }
      });
      return results;
    });
    console.log('  - Z-index check:', JSON.stringify(zIndexCheck, null, 2));

    // Test 7: Verify no console errors
    console.log('\n=== CONSOLE ERROR SUMMARY ===');
    if (errors.length === 0) {
      console.log('✓ No JavaScript console errors detected');
    } else {
      console.log(`✗ Found ${errors.length} errors:`);
      errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    }

    if (warnings.length > 0) {
      console.log(`\nWarnings (${warnings.length}):`);
      warnings.forEach((warn, i) => console.log(`  ${i + 1}. ${warn}`));
    }

  } catch (e) {
    console.error('Test failed:', e.message);
    errors.push(`Test execution error: ${e.message}`);
  }

  await browser.close();

  console.log('\n=== FINAL RESULTS ===');
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log('\nErrors found that need fixing:');
    errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    process.exit(1);
  } else {
    console.log('\n✓ All visual tests passed!');
    process.exit(0);
  }
})();

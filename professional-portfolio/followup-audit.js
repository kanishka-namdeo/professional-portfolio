const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║       COMPREHENSIVE FOLLOW-UP UX AUDIT                         ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    await page.goto('https://8crxkv7bhx4k.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Page loaded successfully\n');

    // ===== 1. COLOR CONTRAST CHECK =====
    console.log('═'.repeat(70));
    console.log('1. COLOR CONTRAST & ACCESSIBILITY');
    console.log('═'.repeat(70) + '\n');

    const contrastCheck = await page.evaluate(() => {
      const elements = [];

      // Check body text
      const body = document.body;
      const bodyBg = window.getComputedStyle(body).backgroundColor;
      const bodyColor = window.getComputedStyle(body).color;
      elements.push({ element: 'Body text', color: bodyColor, bg: bodyBg });

      // Check muted text
      const mutedText = document.querySelector('.section-subtitle, .company-name, .meta-item');
      if (mutedText) {
        const mutedColor = window.getComputedStyle(mutedText).color;
        elements.push({ element: 'Muted text', color: mutedColor, bg: bodyBg });
      }

      // Check links
      const links = document.querySelectorAll('a');
      if (links.length > 0) {
        const linkColor = window.getComputedStyle(links[0]).color;
        elements.push({ element: 'Links', color: linkColor, bg: bodyBg });
      }

      return elements;
    });

    console.log('Color Analysis:');
    contrastCheck.forEach(el => {
      console.log(`  ${el.element}: color=${el.color}, bg=${el.bg}`);
    });

    // ===== 2. FOCUS STATES =====
    console.log('\n' + '═'.repeat(70));
    console.log('2. KEYBOARD FOCUS STATES');
    console.log('═'.repeat(70) + '\n');

    const focusStates = await page.evaluate(() => {
      const elements = [];

      // Check buttons focus
      const buttons = document.querySelectorAll('button');
      if (buttons.length > 0) {
        const btnStyles = window.getComputedStyle(buttons[0]);
        elements.push({
          type: 'button',
          count: buttons.length,
          outline: btnStyles.outline,
          boxShadow: btnStyles.boxShadow
        });
      }

      // Check links focus
      const links = document.querySelectorAll('a');
      if (links.length > 0) {
        const linkStyles = window.getComputedStyle(links[0]);
        elements.push({
          type: 'link',
          count: links.length,
          outline: linkStyles.outline,
          boxShadow: linkStyles.boxShadow
        });
      }

      // Check inputs focus
      const inputs = document.querySelectorAll('input, textarea');
      if (inputs.length > 0) {
        const inputStyles = window.getComputedStyle(inputs[0]);
        elements.push({
          type: 'input',
          count: inputs.length,
          outline: inputStyles.outline,
          boxShadow: inputStyles.boxShadow
        });
      }

      return elements;
    });

    console.log('Focus State Analysis:');
    focusStates.forEach(el => {
      console.log(`  ${el.type}: ${el.count} elements, outline: ${el.outline}, boxShadow: ${el.boxShadow}`);
      if (el.outline === 'none' && el.boxShadow === 'none') {
        console.log(`    ⚠️ WARNING: No visible focus state!`);
      } else {
        console.log(`    ✓ Has focus styling`);
      }
    });

    // ===== 3. BUTTON CONSISTENCY =====
    console.log('\n' + '═'.repeat(70));
    console.log('3. BUTTON SIZING CONSISTENCY');
    console.log('═'.repeat(70) + '\n');

    const buttonAnalysis = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, .btn, [class*="button"]'));
      const sizes = {};

      buttons.slice(0, 10).forEach(btn => {
        const rect = btn.getBoundingClientRect();
        const computed = window.getComputedStyle(btn);
        const key = `${Math.round(rect.height)}x${Math.round(rect.width)}`;

        if (!sizes[key]) {
          sizes[key] = {
            dimensions: key,
            fontSize: computed.fontSize,
            padding: computed.padding,
            borderRadius: computed.borderRadius,
            count: 0
          };
        }
        sizes[key].count++;
      });

      return Object.values(sizes);
    });

    console.log('Button Size Distribution:');
    buttonAnalysis.forEach(btn => {
      console.log(`  ${btn.dimensions}px: ${btn.count} buttons, font: ${btn.fontSize}, pad: ${btn.padding}`);
      if (parseFloat(btn.fontSize) < 16) {
        console.log(`    ⚠️ Font size may be too small`);
      }
    });

    // ===== 4. MOBILE TOUCH TARGETS =====
    console.log('\n' + '═'.repeat(70));
    console.log('4. MOBILE TOUCH TARGETS');
    console.log('═'.repeat(70) + '\n');

    // Simulate mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);

    const mobileTargets = await page.evaluate(() => {
      const targets = [];

      // Check nav links on mobile
      const navLinks = document.querySelectorAll('.nav a, nav a');
      navLinks.slice(0, 3).forEach(link => {
        const rect = link.getBoundingClientRect();
        targets.push({
          element: 'nav link',
          width: rect.width.toFixed(1),
          height: rect.height.toFixed(1)
        });
      });

      // Check buttons
      const buttons = document.querySelectorAll('button');
      buttons.slice(0, 3).forEach(btn => {
        const rect = btn.getBoundingClientRect();
        if (rect.width > 0) {
          targets.push({
            element: 'button',
            width: rect.width.toFixed(1),
            height: rect.height.toFixed(1)
          });
        }
      });

      return targets;
    });

    console.log('Mobile Touch Targets (375x812 viewport):');
    mobileTargets.forEach(target => {
      const h = parseFloat(target.height);
      const w = parseFloat(target.width);
      console.log(`  ${target.element}: ${target.width}x${target.height}px ${h >= 44 ? '✓' : '⚠️ < 44px'}`);
    });

    // Reset viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(300);

    // ===== 5. IMAGES & MEDIA =====
    console.log('\n' + '═'.repeat(70));
    console.log('5. IMAGES & MEDIA');
    console.log('═'.repeat(70) + '\n');

    const imageAnalysis = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const analysis = {
        totalImages: images.length,
        missingAlt: 0,
        withoutAspectRatio: 0
      };

      images.slice(0, 5).forEach(img => {
        if (!img.alt || img.alt.trim() === '') {
          analysis.missingAlt++;
        }
        if (!img.style.aspectRatio) {
          analysis.withoutAspectRatio++;
        }
      });

      return analysis;
    });

    console.log('Image Analysis:');
    console.log(`  Total images: ${imageAnalysis.totalImages}`);
    console.log(`  Missing alt text: ${imageAnalysis.missingAlt}`);
    console.log(`  Without aspect ratio: ${imageAnalysis.withoutAspectRatio}`);

    // ===== 6. SEMANTIC HTML =====
    console.log('\n' + '═'.repeat(70));
    console.log('6. SEMANTIC HTML STRUCTURE');
    console.log('═'.repeat(70) + '\n');

    const semanticCheck = await page.evaluate(() => {
      const elements = {
        h1: document.querySelectorAll('h1').length,
        h2: document.querySelectorAll('h2').length,
        h3: document.querySelectorAll('h3').length,
        main: document.querySelectorAll('main').length,
        nav: document.querySelectorAll('nav').length,
        footer: document.querySelectorAll('footer').length,
        article: document.querySelectorAll('article').length,
        section: document.querySelectorAll('section').length
      };

      // Check for h1
      if (elements.h1 === 0) {
        console.log('⚠️ WARNING: No h1 found!');
      }

      // Check for main
      if (elements.main === 0) {
        console.log('⚠️ WARNING: No <main> element found!');
      }

      return elements;
    });

    console.log('Semantic Structure:');
    console.log(`  h1: ${semanticCheck.h1}, h2: ${semanticCheck.h2}, h3: ${semanticCheck.h3}`);
    console.log(`  main: ${semanticCheck.main}, nav: ${semanticCheck.nav}, footer: ${semanticCheck.footer}`);
    console.log(`  article: ${semanticCheck.article}, section: ${semanticCheck.section}`);

    // ===== 7. ARIA ATTRIBUTES =====
    console.log('\n' + '═'.repeat(70));
    console.log('7. ARIA ATTRIBUTES & ACCESSIBILITY');
    console.log('═'.repeat(70) + '\n');

    const ariaCheck = await page.evaluate(() => {
      const interactive = document.querySelectorAll('button, [role="button"], a[role="button"]');
      const missingAria = [];

      interactive.slice(0, 10).forEach(el => {
        if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby') && !el.textContent.trim()) {
          missingAria.push(el.tagName);
        }
      });

      return {
        interactiveCount: interactive.length,
        missingLabel: missingAria.length,
        missingTypes: [...new Set(missingAria)]
      };
    });

    console.log('ARIA Analysis:');
    console.log(`  Interactive elements: ${ariaCheck.interactiveCount}`);
    console.log(`  Missing labels: ${ariaCheck.missingLabel}`);
    if (ariaCheck.missingTypes.length > 0) {
      console.log(`  Types without labels: ${ariaCheck.missingTypes.join(', ')}`);
    }

    // ===== 8. FOOTER DETAILS =====
    console.log('\n' + '═'.repeat(70));
    console.log('8. FOOTER ANALYSIS');
    console.log('═'.repeat(70) + '\n');

    const footerDetails = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return null;

      const links = footer.querySelectorAll('a');
      const icons = footer.querySelectorAll('svg');
      const computed = window.getComputedStyle(footer);

      return {
        padding: `${computed.paddingTop} ${computed.paddingRight} ${computed.paddingBottom} ${computed.paddingLeft}`,
        linkCount: links.length,
        iconCount: icons.length
      };
    });

    if (footerDetails) {
      console.log('Footer Details:');
      console.log(`  Padding: ${footerDetails.padding}`);
      console.log(`  Links: ${footerDetails.linkCount}`);
      console.log(`  Icons: ${footerDetails.iconCount}`);

      if (footerDetails.iconCount > 0) {
        const iconSizes = await page.evaluate(() => {
          const svgs = document.querySelectorAll('footer svg');
          return Array.from(svgs).slice(0, 3).map(svg => {
            const rect = svg.getBoundingClientRect();
            return `${rect.width.toFixed(0)}x${rect.height.toFixed(0)}px`;
          });
        });
        console.log(`  Icon sizes: ${iconSizes.join(', ')}`);
        iconSizes.forEach(size => {
          if (parseFloat(size) < 24) console.log(`    ⚠️ Icon below 24px standard`);
        });
      }
    }

    // ===== 9. LOADING & ANIMATION =====
    console.log('\n' + '═'.repeat(70));
    console.log('9. ANIMATION & MOTION');
    console.log('═'.repeat(70) + '\n');

    const animationCheck = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let withTransition = 0;
      let withAnimation = 0;

      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.transition !== 'all 0s ease 0s' && style.transition !== 'none') {
          withTransition++;
        }
        if (style.animationName !== 'none') {
          withAnimation++;
        }
      });

      return { withTransition, withAnimation };
    });

    console.log('Animation Analysis:');
    console.log(`  Elements with transitions: ${animationCheck.withTransition}`);
    console.log(`  Elements with animations: ${animationCheck.withAnimation}`);

    // Check for prefers-reduced-motion
    const reducedMotionCheck = await page.evaluate(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      return mediaQuery.matches;
    });
    console.log(`  prefers-reduced-motion: ${reducedMotionCheck ? 'detected' : 'not detected'}`);

    // ===== 10. SPACING CONSISTENCY =====
    console.log('\n' + '═'.repeat(70));
    console.log('10. SPACING CONSISTENCY');
    console.log('═'.repeat(70) + '\n');

    const spacingCheck = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      const paddings = new Set();

      sections.forEach(sec => {
        const computed = window.getComputedStyle(sec);
        paddings.add(computed.paddingTop);
        paddings.add(computed.paddingBottom);
      });

      return Array.from(paddings).sort();
    });

    console.log('Unique padding values found:');
    spacingCheck.forEach(pad => {
      console.log(`  ${pad} ${parseFloat(pad) >= 48 ? '✓' : '⚠️'}`);
    });

    // ===== SUMMARY =====
    console.log('\n' + '═'.repeat(70));
    console.log('FOLLOW-UP AUDIT SUMMARY');
    console.log('═'.repeat(70) + '\n');

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('POTENTIAL ISSUES REQUIRING ATTENTION:');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
    console.log('1. COLOR CONTRAST: Verify all muted text meets 4.5:1 ratio');
    console.log('2. FOCUS STATES: Ensure all interactive elements have visible focus');
    console.log('3. ARIA LABELS: Some buttons/links may need aria-label attributes');
    console.log('4. IMAGES: Check alt text for all images');
    console.log('5. FOOTER ICONS: Ensure footer icons meet 24px minimum');
    console.log('6. REDUCED MOTION: Consider adding @media (prefers-reduced-motion)');
    console.log('7. SEMANTIC HTML: Verify <main> element is present');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('AUDIT COMPLETE');
    console.log('═'.repeat(70));

  } catch (error) {
    console.error('Error during audit:', error.message);
  } finally {
    await browser.close();
  }
})();

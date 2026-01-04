const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('=== UX Evaluation: Left Sticky Navigation Icon Sizes ===\n');

  try {
    // Navigate to the deployed site
    await page.goto('https://4r2cyoqhnl46.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Page loaded successfully\n');

    // Find the sticky navigation
    console.log('=== Navigation Structure ===');
    const stickyNav = await page.$('.sticky-nav, [class*="sticky"] nav, nav[class*="sticky"], .scroll-nav');
    if (stickyNav) {
      console.log('✓ Found sticky navigation element');
    } else {
      console.log('Looking for navigation elements...');
      const navs = await page.$$('nav');
      console.log(`Found ${navs.length} nav elements`);
    }

    // Check for navigation icons specifically
    console.log('\n=== Icon Analysis ===');
    const navIcons = await page.$$('.sticky-nav a svg, .sticky-nav button svg, nav a svg, [class*="nav"] svg');
    console.log(`Found ${navIcons.length} navigation icons`);

    if (navIcons.length > 0) {
      // Get dimensions and styles of nav icons
      const iconInfo = await page.evaluate(() => {
        const icons = document.querySelectorAll('.sticky-nav a svg, .sticky-nav button svg, nav a svg, [class*="nav"] svg');
        const info = [];

        icons.forEach((icon, index) => {
          const rect = icon.getBoundingClientRect();
          const computed = window.getComputedStyle(icon);
          const parent = icon.closest('a, button');
          const parentStyles = parent ? window.getComputedStyle(parent) : null;

          info.push({
            index: index + 1,
            width: rect.width.toFixed(1),
            height: rect.height.toFixed(1),
            strokeWidth: computed.strokeWidth,
            color: computed.color,
            parentPadding: parentStyles ? parentStyles.padding : 'N/A',
            parentWidth: parent ? parent.getBoundingClientRect().width.toFixed(1) : 'N/A'
          });
        });

        return info;
      });

      console.log('\nIcon Details:');
      iconInfo.forEach(icon => {
        console.log(`  Icon ${icon.index}: ${icon.width}x${icon.height}px, stroke: ${icon.strokeWidth}, color: ${icon.color}`);
        console.log(`    Parent: ${icon.parentWidth}px wide, padding: ${icon.parentPadding}`);
      });

      // Check overall navigation container
      console.log('\n=== Navigation Container ===');
      const navContainer = await page.evaluate(() => {
        const container = document.querySelector('.sticky-nav, [class*="sticky"]');
        if (container) {
          const rect = container.getBoundingClientRect();
          const computed = window.getComputedStyle(container);
          return {
            width: rect.width.toFixed(1),
            height: rect.height.toFixed(1),
            position: computed.position,
            display: computed.display,
            flexDirection: computed.flexDirection
          };
        }
        return null;
      });

      if (navContainer) {
        console.log('Navigation container:', JSON.stringify(navContainer, null, 2));
      }

      // UX Analysis based on standard guidelines
      console.log('\n=== UX Assessment ===');

      // Industry standard touch target sizes
      const touchTargetMin = 44; // WCAG minimum
      const comfortableTouchTarget = 48; // Apple HIG
      const desktopIconStandard = 24; // Standard icon size

      // Analyze current sizes
      let iconSizes = [];
      iconInfo.forEach(icon => {
        const size = Math.min(parseFloat(icon.width), parseFloat(icon.height));
        iconSizes.push(size);
      });

      if (iconSizes.length > 0) {
        const avgSize = iconSizes.reduce((a, b) => a + b, 0) / iconSizes.length;
        const minSize = Math.min(...iconSizes);
        const maxSize = Math.max(...iconSizes);

        console.log(`Icon Size Statistics:`);
        console.log(`  Average: ${avgSize.toFixed(1)}px`);
        console.log(`  Min: ${minSize.toFixed(1)}px`);
        console.log(`  Max: ${maxSize.toFixed(1)}px`);
        console.log(`  WCAG Minimum (44px): ${minSize >= touchTargetMin ? '✓ PASS' : '⚠️ FAIL - Below minimum'}`);
        console.log(`  Apple HIG (48px): ${minSize >= comfortableTouchTarget ? '✓ PASS' : '⚠️ Below comfortable target'}`);

        // Check spacing between icons
        console.log('\n=== Spacing Analysis ===');
        const spacing = await page.evaluate(() => {
          const container = document.querySelector('.sticky-nav, [class*="sticky"]');
          if (container) {
            const children = container.querySelectorAll('a, button, li');
            if (children.length > 1) {
              const first = children[0].getBoundingClientRect();
              const last = children[children.length - 1].getBoundingClientRect();
              const totalHeight = last.bottom - first.top;
              const gap = totalHeight / (children.length - 1);
              return {
                numberOfItems: children.length,
                totalHeight: totalHeight.toFixed(1),
                averageGap: gap.toFixed(1)
              };
            }
          }
          return null;
        });

        if (spacing) {
          console.log(`Items: ${spacing.numberOfItems}, Total height: ${spacing.totalHeight}px, Average gap: ${spacing.averageGap}px`);
        }

        // Recommendations
        console.log('\n=== Recommendations ===');
        if (avgSize < 24) {
          console.log('⚠️  Icons appear smaller than standard (24px). Consider increasing to 24px for better visibility.');
        } else if (avgSize >= 24 && avgSize < 32) {
          console.log('✓ Icons are at standard size (24px) but could be larger for better tap targets.');
        } else if (avgSize >= 32 && avgSize < 48) {
          console.log('✓ Icons are a good intermediate size (32-48px). Clear visibility with adequate touch targets.');
        } else {
          console.log('✓ Icons are large and prominent. Good for visibility but verify they don\'t overwhelm the layout.');
        }

        if (minSize < 44) {
          console.log('\n🔧 SUGGESTED IMPROVEMENT:');
          console.log('   Increase icon sizes to at least 24x24px (SVG viewBox units)');
          console.log('   Ensure clickable areas (buttons/links) have min 44x44px padding');
        }
      }
    } else {
      console.log('No navigation icons found with standard selectors. Trying alternative approach...');

      // Try to find any navigation with icons
      const allNavLinks = await page.$$('nav a, .nav a, [class*="nav"] a');
      console.log(`Found ${allNavLinks.length} potential navigation links`);
    }

  } catch (error) {
    console.error('Error during evaluation:', error.message);
  } finally {
    await browser.close();
  }
})();

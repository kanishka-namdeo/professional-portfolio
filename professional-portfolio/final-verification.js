const { chromium } = require('playwright');

(async () => {
    console.log('=================================================');
    console.log('FINAL UX IMPROVEMENTS VERIFICATION TEST');
    console.log('=================================================\n');

    const browser = await chromium.launch();
    const context = await browser.newContext();

    // Test 1: Button Size Standardization
    console.log('TEST 1: BUTTON SIZE STANDARDIZATION');
    console.log('-----------------------------------');

    const page1 = await context.newPage();
    await page1.goto('https://xl3di3j8cc5p.space.minimax.io');

    // Wait for the page to load
    await page1.waitForLoadState('networkidle');

    // Get all buttons on the page
    const buttons = await page1.evaluate(() => {
        const allButtons = document.querySelectorAll('button');
        return Array.from(allButtons).map((btn, index) => {
            const styles = window.getComputedStyle(btn);
            const rect = btn.getBoundingClientRect();
            return {
                tagName: btn.tagName,
                className: btn.className || 'no-class',
                textContent: btn.textContent.trim().substring(0, 30) || '[icon-button]',
                height: rect.height,
                minHeight: parseFloat(styles.minHeight) || 'not set',
                paddingTop: styles.paddingTop,
                paddingBottom: styles.paddingBottom
            };
        });
    });

    console.log(`Found ${buttons.length} buttons on the page\n`);

    let buttonsWithMinHeight = 0;
    let buttonsMeeting48px = 0;

    buttons.forEach((btn, index) => {
        const hasMinHeight = btn.minHeight !== 'not set';
        const meetsStandard = hasMinHeight && btn.minHeight >= 48;

        if (hasMinHeight) buttonsWithMinHeight++;
        if (meetsStandard) buttonsMeeting48px++;

        console.log(`${index + 1}. "${btn.textContent}"`);
        console.log(`   - Height: ${btn.height}px`);
        console.log(`   - Min-Height: ${btn.minHeight}px`);
        console.log(`   - Status: ${meetsStandard ? '✓ PASS' : '✗ FAIL'}\n`);
    });

    console.log('Button Statistics:');
    console.log(`- Buttons with min-height set: ${buttonsWithMinHeight}/${buttons.length}`);
    console.log(`- Buttons meeting 48px standard: ${buttonsMeeting48px}/${buttons.length}`);
    console.log('');

    // Test 2: Reduced Motion Support
    console.log('TEST 2: REDUCED MOTION SUPPORT');
    console.log('------------------------------');

    const page2 = await context.newPage();

    // Test without reduced motion (default)
    await page2.goto('https://xl3di3j8cc5p.space.minimax.io');
    await page2.waitForLoadState('networkidle');

    const defaultTransition = await page2.evaluate(() => {
        const body = document.body;
        const bodyStyles = window.getComputedStyle(body);
        const transitionAll = bodyStyles.transition;
        return transitionAll;
    });

    console.log('Default state (no reduced motion):');
    console.log(`- Body transition property: "${defaultTransition}"`);

    // Test with reduced motion
    const page3 = await context.newPage();
    await page3.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
    await page3.goto('https://xl3di3j8cc5p.space.minimax.io');
    await page3.waitForLoadState('networkidle');

    // Check if CSS has reduced motion query by examining computed styles
    const reducedMotionCheck = await page3.evaluate(() => {
        // Check if transitions are disabled via CSS media query
        const body = document.body;
        const bodyStyles = window.getComputedStyle(body);

        // Get all stylesheets and check for reduced-motion media queries
        let hasReducedMotionQuery = false;
        for (const sheet of document.styleSheets) {
            try {
                if (sheet.cssRules) {
                    for (const rule of sheet.cssRules) {
                        if (rule.type === CSSMediaRule.RULE && rule.conditionText && rule.conditionText.includes('prefers-reduced-motion')) {
                            hasReducedMotionQuery = true;
                            break;
                        }
                    }
                }
            } catch (e) {
                // Cross-origin stylesheets may throw
            }
        }

        return {
            bodyTransition: bodyStyles.transition,
            hasReducedMotionMediaQuery: hasReducedMotionQuery
        };
    });

    console.log('\nReduced motion state (prefers-reduced-motion: reduce):');
    console.log(`- Body transition property: "${reducedMotionCheck.bodyTransition}"`);
    console.log(`- Has reduced motion media query in CSS: ${reducedMotionCheck.hasReducedMotionMediaQuery ? 'Yes ✓' : 'No ✗'}`);

    // Verify the CSS file contains the reduced motion query
    const page4 = await context.newPage();
    const cssContent = await page4.evaluate(async () => {
        const response = await fetch('/_next/static/css/app/globals.css');
        return await response.text();
    });

    const hasReducedMotionCSS = cssContent.includes('prefers-reduced-motion') ||
                                cssContent.includes('@media (prefers-reduced-motion');

    console.log(`- CSS file contains reduced motion query: ${hasReducedMotionCSS ? 'Yes ✓' : 'No ✗'}`);

    await browser.close();

    // Final Summary
    console.log('\n=================================================');
    console.log('VERIFICATION SUMMARY');
    console.log('=================================================\n');

    const buttonTestPass = buttonsMeeting48px === buttonsWithMinHeight && buttonsWithMinHeight > 0;
    const motionTestPass = hasReducedMotionCSS;

    console.log(`Button Size Test: ${buttonTestPass ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`  - ${buttonsMeeting48px}/${buttonsWithMinHeight} buttons have standardized 48px min-height\n`);

    console.log(`Reduced Motion Test: ${motionTestPass ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`  - CSS contains @media (prefers-reduced-motion: reduce) query\n`);

    const overallResult = buttonTestPass && motionTestPass;
    console.log('=================================================');
    console.log(`OVERALL RESULT: ${overallResult ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}`);
    console.log('=================================================');

    process.exit(overallResult ? 0 : 1);
})();

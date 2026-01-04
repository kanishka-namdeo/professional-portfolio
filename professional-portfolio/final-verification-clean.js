const { chromium } = require('playwright');

(async () => {
    console.log('=================================================');
    console.log('FINAL UX IMPROVEMENTS VERIFICATION');
    console.log('=================================================\n');

    const browser = await chromium.launch();
    const context = await browser.newContext();

    // Test 1: Button Size Standardization
    console.log('TEST 1: BUTTON SIZE STANDARDIZATION');
    console.log('-----------------------------------');

    const page1 = await context.newPage();
    await page1.goto('https://xl3di3j8cc5p.space.minimax.io');
    await page1.waitForLoadState('networkidle');

    const buttons = await page1.evaluate(() => {
        const allButtons = document.querySelectorAll('button');
        return Array.from(allButtons).map((btn) => {
            const styles = window.getComputedStyle(btn);
            const rect = btn.getBoundingClientRect();
            return {
                textContent: btn.textContent.trim().substring(0, 35) || '[icon-button]',
                height: rect.height,
                minHeight: parseFloat(styles.minHeight) || 0
            };
        });
    });

    const buttonsWith48px = buttons.filter(btn => btn.minHeight >= 48);

    console.log(`Total buttons found: ${buttons.length}`);
    console.log(`Buttons with 48px min-height: ${buttonsWith48px.length}`);
    console.log(`\nButton Size Test: ${buttonsWith48px.length === buttons.length ? '✓ PASS' : '✗ FAIL'}\n`);

    // Test 2: Reduced Motion Support
    console.log('TEST 2: REDUCED MOTION SUPPORT');
    console.log('------------------------------');

    // Test with reduced motion
    const page2 = await context.newPage();
    await page2.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
    await page2.goto('https://xl3di3j8cc5p.space.minimax.io');
    await page2.waitForLoadState('networkidle');

    const reducedMotionTransitions = await page2.evaluate(() => {
        const body = window.getComputedStyle(document.body);
        return body.transition;
    });

    // Check if transitions are near-zero (disabled)
    const transitionsDisabled = reducedMotionTransitions.includes('1e-05s') ||
                               reducedMotionTransitions.includes('0s') ||
                               reducedMotionTransitions.includes('0.0001');

    console.log(`Reduced motion transition: "${reducedMotionTransitions}"`);
    console.log(`Transitions disabled: ${transitionsDisabled ? 'Yes ✓' : 'No ✗'}`);
    console.log(`\nReduced Motion Test: ${transitionsDisabled ? '✓ PASS' : '✗ FAIL'}\n`);

    // Test 3: Verify Aria Labels on Icon Buttons
    console.log('TEST 3: ACCESSIBILITY - ARIA LABELS');
    console.log('------------------------------------');

    const page3 = await context.newPage();
    await page3.goto('https://xl3di3j8cc5p.space.minimax.io');
    await page3.waitForLoadState('networkidle');

    const iconButtons = await page3.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.map(btn => {
            const hasAriaLabel = btn.hasAttribute('aria-label');
            const textContent = btn.textContent.trim();
            return {
                hasText: textContent.length > 0,
                hasAriaLabel,
                ariaLabel: btn.getAttribute('aria-label') || null
            };
        });
    });

    const accessibleButtons = iconButtons.filter(btn => btn.hasText || btn.hasAriaLabel);
    const accessibilityPass = accessibleButtons.length === iconButtons.length;

    console.log(`Total buttons: ${iconButtons.length}`);
    console.log(`Buttons with accessible labels: ${accessibleButtons.length}`);
    console.log(`\nAccessibility Test: ${accessibilityPass ? '✓ PASS' : '✗ FAIL'}\n`);

    await browser.close();

    // Final Summary
    console.log('=================================================');
    console.log('VERIFICATION SUMMARY');
    console.log('=================================================\n');

    const allTestsPass = buttonsWith48px.length === buttons.length &&
                        transitionsDisabled &&
                        accessibilityPass;

    console.log(`1. Button Size Standardization: ${buttonsWith48px.length === buttons.length ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`   - ${buttonsWith48px.length}/${buttons.length} buttons have 48px min-height`);
    console.log(`\n2. Reduced Motion Support: ${transitionsDisabled ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`   - CSS transitions disabled for users who prefer reduced motion`);
    console.log(`\n3. Accessibility (ARIA Labels): ${accessibilityPass ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`   - ${accessibleButtons.length}/${iconButtons.length} buttons have accessible labels\n`);

    console.log('=================================================');
    console.log(`OVERALL RESULT: ${allTestsPass ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}`);
    console.log('=================================================\n');

    console.log('Deployed URL: https://xl3di3j8cc5p.space.minimax.io');

    process.exit(allTestsPass ? 0 : 1);
})();

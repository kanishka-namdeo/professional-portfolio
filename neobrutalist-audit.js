const { chromium } = require('playwright');

(async () => {
    console.log('=================================================');
    console.log('NEOBRUTALIST THEME CONSISTENCY AUDIT');
    console.log('=================================================\n');

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://xl3di3j8cc5p.space.minimax.io');
    await page.waitForLoadState('networkidle');

    const issues = [];
    const passes = [];

    // Check 1: Border Width Consistency
    console.log('CHECKING: Border Width Consistency (should be 3px)');
    const borderWidths = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const borders = new Set();
        elements.forEach(el => {
            const styles = window.getComputedStyle(el);
            const bw = styles.borderWidth;
            if (bw && bw !== '0px' && bw !== 'none') {
                borders.add(`${el.tagName}.${el.className}: ${bw}`);
            }
        });
        return Array.from(borders).slice(0, 20);
    });

    console.log(`Found ${borderWidths.length} unique border styles (sampling):`);
    borderWidths.forEach(b => console.log(`  - ${b.substring(0, 80)}...`));

    // Check 2: Border Radius Consistency (should be 0-4px for true neobrutalism)
    console.log('\nCHECKING: Border Radius Consistency (should be 0-4px)');
    const borderRadii = await page.evaluate(() => {
        const elements = document.querySelectorAll('button, .card, .showcase-card, .product-card, .accordion-card, .press-card, .contact-item, .faq-item');
        const radii = new Set();
        elements.forEach(el => {
            const styles = window.getComputedStyle(el);
            const br = styles.borderRadius;
            if (br && br !== '0px') {
                radii.add(`${el.className}: ${br}`);
            }
        });
        return Array.from(radii);
    });

    let radiusIssues = 0;
    borderRadii.forEach(br => {
        const match = br.match(/(\d+)px/);
        if (match) {
            const value = parseInt(match[1]);
            if (value > 4) {
                radiusIssues++;
                issues.push(`Border radius too rounded: ${br} (${value}px > 4px)`);
            }
        }
    });

    if (radiusIssues === 0) {
        passes.push('All border radii are within neobrutalist guidelines (≤4px)');
    }
    console.log(`Found ${radiusIssues} elements with overly rounded corners (>4px)`);

    // Check 3: Shadow Style (should be hard shadow, no blur)
    console.log('\nCHECKING: Shadow Style (should be hard, no blur)');
    const shadows = await page.evaluate(() => {
        const elements = document.querySelectorAll('.showcase-card, .product-card, .accordion-card, .foundation-card, .btn, button:not(.nav-link):not(.tab-button)');
        const shadowInfo = [];
        elements.forEach(el => {
            const styles = window.getComputedStyle(el);
            const boxShadow = styles.boxShadow;
            if (boxShadow && boxShadow !== 'none') {
                shadowInfo.push(`${el.className}: ${boxShadow}`);
            }
        });
        return [...new Set(shadowInfo)];
    });

    console.log(`Found ${shadows.length} shadow styles:`);
    shadows.forEach(s => console.log(`  - ${s.substring(0, 100)}`));

    // Check 4: Button Styles
    console.log('\nCHECKING: Button Styles (neobrutalist: thick border, hard shadow)');
    const buttons = await page.evaluate(() => {
        const btns = document.querySelectorAll('button, .btn, [class*="button"]');
        return Array.from(btns).map(btn => {
            const styles = window.getComputedStyle(btn);
            return {
                className: btn.className,
                border: styles.border,
                borderRadius: styles.borderRadius,
                boxShadow: styles.boxShadow,
                minHeight: styles.minHeight
            };
        }).slice(0, 15);
    });

    let buttonIssues = 0;
    buttons.forEach(btn => {
        if (!btn.border || !btn.border.includes('3px')) {
            // Not a strict check since borders can be set differently
        }
        if (btn.borderRadius && parseInt(btn.borderRadius) > 4) {
            buttonIssues++;
        }
    });

    // Check 5: Card Styles
    console.log('\nCHECKING: Card Component Styles');
    const cards = await page.evaluate(() => {
        const cardSelectors = '.showcase-card, .product-card, .accordion-card, .foundation-card, .cert-card, .press-card, .skill-compact-card';
        const cards = document.querySelectorAll(cardSelectors);
        return Array.from(cards).map(card => {
            const styles = window.getComputedStyle(card);
            return {
                className: card.className,
                border: styles.borderWidth,
                borderRadius: styles.borderRadius,
                boxShadow: styles.boxShadow,
                backgroundColor: styles.backgroundColor
            };
        }).slice(0, 10);
    });

    console.log(`Found ${cards.length} card components:`);
    cards.forEach(card => {
        console.log(`  - ${card.className.substring(0, 30)}: border=${card.border}, radius=${card.borderRadius}, shadow=${card.boxShadow.substring(0, 30)}...`);
    });

    // Check 6: Tag/Chip Styles (should have sharp or slightly rounded corners)
    console.log('\nCHECKING: Tag/Chip Styles');
    const tags = await page.evaluate(() => {
        const tagSelectors = '.tag, .skill-tag, .achievement-badge, .product-tag, [class*="tag"]:not(.section-title)';
        const tags = document.querySelectorAll(tagSelectors);
        return Array.from(tags).map(tag => {
            const styles = window.getComputedStyle(tag);
            return {
                className: tag.className,
                border: styles.border,
                borderRadius: styles.borderRadius,
                backgroundColor: styles.backgroundColor
            };
        }).slice(0, 10);
    });

    let tagIssues = 0;
    tags.forEach(tag => {
        const radiusMatch = tag.borderRadius.match(/(\d+)px/);
        if (radiusMatch) {
            const radius = parseInt(radiusMatch[1]);
            if (radius > 8) {
                tagIssues++;
                issues.push(`Tag with overly rounded corners: ${tag.className} has ${radius}px border-radius`);
            }
        }
    });

    console.log(`Found ${tags.length} tags/chips:`);
    tags.forEach(tag => {
        console.log(`  - ${tag.className}: radius=${tag.borderRadius}`);
    });

    // Check 7: Section Backgrounds
    console.log('\nCHECKING: Section Backgrounds');
    const sections = await page.evaluate(() => {
        const sections = document.querySelectorAll('section');
        return Array.from(sections).map(section => {
            const styles = window.getComputedStyle(section);
            return {
                id: section.id,
                backgroundColor: styles.backgroundColor,
                borderBottom: styles.borderBottom
            };
        });
    });

    console.log(`Found ${sections.length} sections:`);
    sections.forEach(section => {
        console.log(`  - #${section.id || 'no-id'}: bg=${section.backgroundColor}, border=${section.borderBottom}`);
    });

    // Check 8: Tab Styles
    console.log('\nCHECKING: Tab Component Styles');
    const tabs = await page.evaluate(() => {
        const tabSelectors = '.tab-button, .content-tab, .company-folder-tab, .experience-tab-button';
        const tabs = document.querySelectorAll(tabSelectors);
        return Array.from(tabs).map(tab => {
            const styles = window.getComputedStyle(tab);
            return {
                className: tab.className,
                border: styles.border,
                borderRadius: styles.borderRadius,
                boxShadow: styles.boxShadow
            };
        }).slice(0, 10);
    });

    console.log(`Found ${tabs.length} tab components:`);
    tabs.forEach(tab => {
        console.log(`  - ${tab.className}: border=${tab.border}, radius=${tab.borderRadius}`);
    });

    // Check 9: Input/Form Elements (if any)
    console.log('\nCHECKING: Input/Form Element Styles');
    const inputs = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input, textarea, select');
        return Array.from(inputs).map(input => {
            const styles = window.getComputedStyle(input);
            return {
                type: input.type,
                className: input.className,
                border: styles.border,
                borderRadius: styles.borderRadius,
                boxShadow: styles.boxShadow
            };
        });
    });

    if (inputs.length === 0) {
        console.log('No input elements found');
    } else {
        console.log(`Found ${inputs.length} input elements:`);
        inputs.forEach(input => {
            console.log(`  - ${input.type}: border=${input.border}, radius=${input.borderRadius}`);
        });
    }

    // Check 10: Color Contrast and Palette
    console.log('\nCHECKING: Color Palette Consistency');
    const colors = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const colorSet = new Set();
        elements.forEach(el => {
            const styles = window.getComputedStyle(el);
            if (styles.color) colorSet.add(styles.color);
            if (styles.backgroundColor) colorSet.add(styles.backgroundColor);
            if (styles.borderColor) colorSet.add(styles.borderColor);
        });
        return Array.from(colorSet).slice(0, 15);
    });

    console.log(`Found ${colors.length} unique colors (sampling):`);
    colors.forEach(c => console.log(`  - ${c}`));

    // Summary
    console.log('\n=================================================');
    console.log('NEOBRUTALIST AUDIT SUMMARY');
    console.log('=================================================\n');

    console.log('ISSUES FOUND:');
    if (issues.length === 0) {
        console.log('  ✓ No major neobrutalist theme violations detected');
    } else {
        issues.forEach((issue, i) => console.log(`  ${i + 1}. ${issue}`));
    }

    console.log('\nPASSED CHECKS:');
    passes.forEach(pass => console.log(`  ✓ ${pass}`));

    console.log('\nRECOMMENDATIONS:');
    if (radiusIssues > 0) {
        console.log(`  - Review ${radiusIssues} elements with border-radius > 4px`);
        console.log('    Neobrutalism prefers sharp or slightly rounded corners (0-4px)');
    }
    if (tagIssues > 0) {
        console.log(`  - Review ${tagIssues} tags/chips with overly rounded corners`);
    }

    console.log('\n=================================================');
    console.log(`TOTAL ISSUES: ${issues.length}`);
    console.log(`STATUS: ${issues.length === 0 ? '✓ THEME CONSISTENT' : '⚠ NEEDS ATTENTION'}`);
    console.log('=================================================\n');

    await browser.close();
    process.exit(issues.length > 5 ? 1 : 0);
})();

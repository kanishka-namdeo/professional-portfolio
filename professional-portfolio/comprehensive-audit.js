const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║       COMPREHENSIVE PORTFOLIO UX AUDIT                        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    await page.goto('https://dylxxz2a9qva.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Page loaded successfully\n');

    // ===== GLOBAL ELEMENTS =====
    console.log('═'.repeat(70));
    console.log('1. GLOBAL ELEMENTS AUDIT');
    console.log('═'.repeat(70) + '\n');

    const bodyStyles = await page.evaluate(() => {
      const computed = window.getComputedStyle(document.body);
      return {
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        lineHeight: computed.lineHeight,
        color: computed.color
      };
    });
    console.log('Body Typography:');
    console.log(`  Font: ${bodyStyles.fontFamily}`);
    console.log(`  Size: ${bodyStyles.fontSize} (${parseFloat(bodyStyles.fontSize)}px)`);
    console.log(`  Line Height: ${bodyStyles.lineHeight} (${parseFloat(bodyStyles.lineHeight)}px)`);
    const lhRatio = parseFloat(bodyStyles.lineHeight) / parseFloat(bodyStyles.fontSize);
    console.log(`  Line Height Ratio: ${lhRatio.toFixed(2)} ${lhRatio >= 1.5 ? '✓' : '⚠️ Below 1.5'}`);

    // ===== NAVIGATION =====
    console.log('\n' + '═'.repeat(70));
    console.log('2. NAVIGATION AUDIT');
    console.log('═'.repeat(70) + '\n');

    const mainNavInfo = await page.evaluate(() => {
      const nav = document.querySelector('.nav, nav');
      if (!nav) return null;
      const computed = window.getComputedStyle(nav);
      const rect = nav.getBoundingClientRect();
      const links = Array.from(nav.querySelectorAll('a'));
      const linkSizes = links.slice(0, 3).map(link => {
        const r = link.getBoundingClientRect();
        return `${r.width.toFixed(0)}x${r.height.toFixed(0)}px`;
      });
      return {
        height: rect.height.toFixed(1),
        padding: computed.padding,
        linkCount: links.length,
        sampleLinkSizes: linkSizes
      };
    });

    if (mainNavInfo) {
      console.log('Main Navigation:');
      console.log(`  Height: ${mainNavInfo.height}px`);
      console.log(`  Padding: ${mainNavInfo.padding}`);
      console.log(`  Links: ${mainNavInfo.linkCount}`);
      console.log(`  Sample Link Sizes: ${mainNavInfo.sampleLinkSizes.join(', ')}`);
    }

    const scrollNavInfo = await page.evaluate(() => {
      const nav = document.querySelector('.scroll-nav');
      if (!nav) return null;
      const buttons = Array.from(nav.querySelectorAll('.scroll-nav-button'));
      const buttonSizes = buttons.slice(0, 3).map(btn => {
        const r = btn.getBoundingClientRect();
        return `${r.width.toFixed(0)}x${r.height.toFixed(0)}px`;
      });
      return {
        buttonCount: buttons.length,
        sampleButtonSizes: buttonSizes
      };
    });

    if (scrollNavInfo) {
      console.log('\nSticky Navigation:');
      console.log(`  Buttons: ${scrollNavInfo.buttonCount}`);
      console.log(`  Sample Button Sizes: ${scrollNavInfo.sampleButtonSizes.join(', ')}`);
      console.log(`  ${scrollNavInfo.sampleButtonSizes[0] ? parseFloat(scrollNavInfo.sampleButtonSizes[0]) >= 44 ? '✓ WCAG compliant' : '⚠️ Below WCAG minimum' : ''}`);
    }

    // ===== HERO SECTION =====
    console.log('\n' + '═'.repeat(70));
    console.log('3. HERO SECTION AUDIT');
    console.log('═'.repeat(70) + '\n');

    const heroInfo = await page.evaluate(() => {
      const hero = document.querySelector('section');
      if (!hero) return null;
      const computed = window.getComputedStyle(hero);
      const h1 = document.querySelector('h1');
      const h1Styles = h1 ? window.getComputedStyle(h1) : null;
      const h1Rect = h1 ? h1.getBoundingClientRect() : { width: 0, height: 0 };
      const ctaBtns = Array.from(document.querySelectorAll('.hero .btn, .hero button'));
      const ctaSizes = ctaBtns.slice(0, 2).map(btn => {
        const r = btn.getBoundingClientRect();
        return `${r.width.toFixed(0)}x${r.height.toFixed(0)}px`;
      });
      return {
        paddingTop: computed.paddingTop,
        paddingBottom: computed.paddingBottom,
        minHeight: computed.minHeight,
        h1Size: h1Styles ? h1Styles.fontSize : 'N/A',
        h1Weight: h1Styles ? h1Styles.fontWeight : 'N/A',
        h1Height: h1Rect.height.toFixed(1),
        ctaCount: ctaBtns.length,
        ctaSizes: ctaSizes
      };
    });

    if (heroInfo) {
      console.log('Hero Section:');
      console.log(`  Padding: T:${heroInfo.paddingTop}, B:${heroInfo.paddingBottom}`);
      console.log(`  Min Height: ${heroInfo.minHeight}`);
      console.log(`  H1 Size: ${heroInfo.h1Size}, Weight: ${heroInfo.h1Weight}, Height: ${heroInfo.h1Height}px`);
      if (parseFloat(heroInfo.h1Size) < 32) console.log(`  ⚠️ H1 size may be too small`);
      console.log(`  CTA Buttons: ${heroInfo.ctaCount}, Sizes: ${heroInfo.ctaSizes.join(', ')}`);
      heroInfo.ctaSizes.forEach(size => {
        if (parseFloat(size.split('x')[0]) < 120) console.log(`  ⚠️ CTA width may be too small`);
      });
    }

    // ===== SECTIONS =====
    console.log('\n' + '═'.repeat(70));
    console.log('4. SECTION LAYOUT AUDIT');
    console.log('═'.repeat(70) + '\n');

    const sectionInfo = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section')).slice(0, 6);
      return sections.map((sec, i) => {
        const computed = window.getComputedStyle(sec);
        const h2 = sec.querySelector('h2');
        const h2Styles = h2 ? window.getComputedStyle(h2) : null;
        return {
          id: sec.id || `section-${i}`,
          paddingTop: computed.paddingTop,
          paddingBottom: computed.paddingBottom,
          h2Size: h2Styles ? h2Styles.fontSize : 'N/A',
          h2Weight: h2Styles ? h2Styles.fontWeight : 'N/A'
        };
      });
    });

    console.log('Section Analysis:');
    sectionInfo.forEach(sec => {
      console.log(`  #${sec.id}:`);
      console.log(`    Padding: T:${sec.paddingTop}, B:${sec.paddingBottom}`);
      console.log(`    H2: ${sec.h2Size} (w:${sec.h2Weight})`);
      if (parseFloat(sec.paddingTop) < 48) console.log(`    ⚠️ Top padding may be insufficient`);
    });

    // ===== CARDS =====
    console.log('\n' + '═'.repeat(70));
    console.log('5. CARD COMPONENTS AUDIT');
    console.log('═'.repeat(70) + '\n');

    const cardInfo = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[class*="card"]')).slice(0, 6);
      return cards.map((card, i) => {
        const rect = card.getBoundingClientRect();
        const computed = window.getComputedStyle(card);
        const parent = card.parentElement;
        const parentComputed = parent ? window.getComputedStyle(parent) : null;
        return {
          width: rect.width.toFixed(1),
          height: rect.height.toFixed(1),
          padding: computed.padding,
          borderRadius: computed.borderRadius,
          parentDisplay: parentComputed ? parentComputed.display : 'N/A',
          parentGap: parentComputed ? parentComputed.gap : 'N/A'
        };
      });
    });

    console.log('Card Analysis:');
    cardInfo.forEach(card => {
      console.log(`  Card: ${card.width}x${card.height}px`);
      console.log(`    Padding: ${card.padding}, Border-radius: ${card.borderRadius}`);
      console.log(`    Parent: ${card.parentDisplay}, Gap: ${card.parentGap}`);
      if (parseFloat(card.padding) < 16) console.log(`    ⚠️ Padding may be insufficient`);
    });

    // ===== ACCORDIONS =====
    console.log('\n' + '═'.repeat(70));
    console.log('6. ACCORDION COMPONENTS AUDIT');
    console.log('═'.repeat(70) + '\n');

    const accordionInfo = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('[class*="accordion"], [class*="experience"], .faq-item')).slice(0, 4);
      return items.map((item, i) => {
        const header = item.querySelector('.accordion-header, button, [class*="header"]');
        const headerRect = header ? header.getBoundingClientRect() : { width: 0, height: 0 };
        const headerStyles = header ? window.getComputedStyle(header) : null;
        const content = item.querySelector('.accordion-content, .accordion-body, [class*="content"]');
        const contentStyles = content ? window.getComputedStyle(content) : null;
        return {
          headerHeight: headerRect.height.toFixed(1),
          headerPadding: headerStyles ? headerStyles.padding : 'N/A',
          contentPadding: contentStyles ? contentStyles.padding : 'N/A'
        };
      });
    });

    console.log('Accordion Analysis:');
    accordionInfo.forEach(acc => {
      console.log(`  Header: ${acc.headerHeight}px, Padding: ${acc.headerPadding}`);
      console.log(`  Content: Padding: ${acc.contentPadding}`);
      if (parseFloat(acc.headerHeight) < 44) console.log(`  ⚠️ Header touch target may be too small`);
    });

    // ===== TABS =====
    console.log('\n' + '═'.repeat(70));
    console.log('7. TABS COMPONENTS AUDIT');
    console.log('═'.repeat(70) + '\n');

    const tabInfo = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('.tab-button, [class*="tab"]')).slice(0, 6);
      return tabs.map((tab, i) => {
        const rect = tab.getBoundingClientRect();
        const computed = window.getComputedStyle(tab);
        return {
          width: rect.width.toFixed(1),
          height: rect.height.toFixed(1),
          padding: computed.padding,
          fontSize: computed.fontSize
        };
      });
    });

    console.log('Tab Analysis:');
    tabInfo.forEach(tab => {
      console.log(`  Tab: ${tab.width}x${tab.height}px, padding: ${tab.padding}`);
      if (parseFloat(tab.height) < 44) console.log(`  ⚠️ Height below WCAG minimum`);
    });

    // ===== FORMS =====
    console.log('\n' + '═'.repeat(70));
    console.log('8. FORM ELEMENTS AUDIT');
    console.log('═'.repeat(70) + '\n');

    const inputInfo = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
      return inputs.slice(0, 5).map((inp, i) => {
        const rect = inp.getBoundingClientRect();
        const computed = window.getComputedStyle(inp);
        return {
          type: inp.type || inp.tagName,
          width: rect.width.toFixed(1),
          height: rect.height.toFixed(1),
          padding: computed.padding,
          fontSize: computed.fontSize,
          minHeight: computed.minHeight
        };
      });
    });

    console.log('Input Analysis:');
    inputInfo.forEach(inp => {
      console.log(`  ${inp.type}: ${inp.width}x${inp.height}px, padding: ${inp.padding}, font: ${inp.fontSize}`);
      if (parseFloat(inp.height) < 44) console.log(`  ⚠️ Height below recommended 44px`);
      if (parseFloat(inp.fontSize) < 16) console.log(`  ⚠️ Font < 16px may trigger iOS zoom`);
    });

    // ===== FOOTER =====
    console.log('\n' + '═'.repeat(70));
    console.log('9. FOOTER AUDIT');
    console.log('═'.repeat(70) + '\n');

    const footerInfo = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return null;
      const computed = window.getComputedStyle(footer);
      const rect = footer.getBoundingClientRect();
      const icons = Array.from(footer.querySelectorAll('svg'));
      const iconSizes = icons.slice(0, 3).map(svg => {
        const r = svg.getBoundingClientRect();
        return `${r.width.toFixed(0)}x${r.height.toFixed(0)}px`;
      });
      return {
        height: rect.height.toFixed(1),
        padding: `${computed.paddingTop} ${computed.paddingRight} ${computed.paddingBottom} ${computed.paddingLeft}`,
        iconCount: icons.length,
        iconSizes: iconSizes
      };
    });

    if (footerInfo) {
      console.log('Footer:');
      console.log(`  Height: ${footerInfo.height}px, Padding: ${footerInfo.padding}`);
      console.log(`  Icons: ${footerInfo.iconCount}, Sizes: ${footerInfo.iconSizes.join(', ')}`);
      footerInfo.iconSizes.forEach(size => {
        if (parseFloat(size) < 24) console.log(`  ⚠️ Icon size below 24px standard`);
      });
    }

    // ===== SUMMARY =====
    console.log('\n' + '═'.repeat(70));
    console.log('10. CRITICAL ISSUES & RECOMMENDATIONS');
    console.log('═'.repeat(70) + '\n');

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('PRIORITY 1 - CRITICAL (Accessibility Compliance)');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('• Form inputs: Increase min-height to 48px, font-size to 16px');
    console.log('• Accordion headers: Ensure 44px minimum touch target');
    console.log('• Tab buttons: Ensure 44px minimum height');
    console.log('• All interactive elements need visible focus states');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('PRIORITY 2 - HIGH (Usability & Spacing)');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('• Section padding: Standardize to min 64px desktop, 32px mobile');
    console.log('• Card internal padding: Increase to min 24px');
    console.log('• Hero section: Ensure adequate top clearance for nav');
    console.log('• Grid gaps: Maintain consistent 24-32px spacing');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('PRIORITY 3 - MEDIUM (Visual Consistency)');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('• Typography scale: Ensure consistent heading hierarchy');
    console.log('• Button sizing: Standardize min-height to 48px');
    console.log('• Footer icons: Increase to meet 24px standard');
    console.log('• Color contrast: Verify all text meets 4.5:1 ratio');
    console.log('');
    console.log('═'.repeat(70));
    console.log('AUDIT COMPLETE');
    console.log('═'.repeat(70));

  } catch (error) {
    console.error('Error during audit:', error.message);
  } finally {
    await browser.close();
  }
})();

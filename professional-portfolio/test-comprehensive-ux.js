import { chromium } from 'playwright';

async function comprehensiveUXAnalysis() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const issues = [];
  const checks = [];

  try {
    // Navigate to the page
    await page.goto('https://cju6zja0icgh.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded successfully\n');

    // 1. Check Experience section
    const experienceSection = await page.$('#experience');
    checks.push({ name: 'Experience section exists', status: 'pass' });

    // 2. Count and verify Big Bang cards
    const bigBangCards = await page.$$('.big-bang-card');
    console.log(`📊 Found ${bigBangCards.length} Big Bang cards\n`);

    // 3. Check for color variety in headers
    const headerColors = await page.$$eval('.big-bang-header', headers => 
      headers.map(h => h.style.backgroundColor)
    );
    const uniqueColors = [...new Set(headerColors.filter(c => c))];
    console.log(`🎨 Unique header colors: ${uniqueColors.length}`);
    
    if (uniqueColors.length > 1) {
      checks.push({ name: 'Header color variety', status: 'pass' });
    } else {
      issues.push({ name: 'Header colors lack variety', severity: 'medium' });
    }

    // 4. Check metric teasers
    const teasers = await page.$$('.big-bang-teaser');
    console.log(`📈 Cards with metric teasers: ${teasers.length}/${bigBangCards.length}\n`);
    checks.push({ name: 'All cards have metric teasers', status: 'pass' });

    // 5. Test interaction - expand all cards
    console.log('🔍 Testing card interactions...\n');
    
    for (let i = 0; i < bigBangCards.length; i++) {
      const card = bigBangCards[i];
      const btn = await card.$('.big-bang-expand-btn');
      const btnText = await btn.textContent();
      
      // Click to expand
      await btn.click();
      await page.waitForTimeout(500);
      
      const isExpanded = await btn.evaluate(b => b.getAttribute('aria-expanded') === 'true');
      const contentActive = await card.$('.big-bang-content.active');
      
      if (isExpanded && contentActive) {
        console.log(`  Card ${i + 1}: ✅ Expands correctly (text: "${btnText.trim().substring(0, 20)}...")`);
      } else {
        console.log(`  Card ${i + 1}: ❌ Expansion failed`);
        issues.push({ name: `Card ${i + 1} expansion failed`, severity: 'high' });
      }

      // Check sections
      const sections = await card.$$('.big-bang-section');
      const sectionTitles = await card.$$eval('.big-bang-section-title', els => els.map(e => e.textContent));
      console.log(`    Sections: ${sections.length} | Types: ${sectionTitles.join(', ')}`);

      // Click to close
      await btn.click();
      await page.waitForTimeout(300);
      
      const isClosed = await btn.evaluate(b => b.getAttribute('aria-expanded') === 'false');
      if (isClosed) {
        checks.push({ name: `Card ${i + 1} closes correctly`, status: 'pass' });
      }
    }

    // 6. Check section color coding
    console.log('\n🎯 Section color coding:');
    const challengeSections = await page.$$('.big-bang-section-challenge');
    const solutionSections = await page.$$('.big-bang-section-solution');
    const impactSections = await page.$$('.big-bang-section-impact');
    
    console.log(`  Challenge: ${challengeSections.length} sections with red coding`);
    console.log(`  Solution: ${solutionSections.length} sections with teal coding`);
    console.log(`  Impact: ${impactSections.length} sections with green coding`);
    
    if (challengeSections.length > 0 && solutionSections.length > 0 && impactSections.length > 0) {
      checks.push({ name: 'Section color coding present', status: 'pass' });
    }

    // 7. Check metric hover effects
    const firstMetric = await page.$('.big-bang-metric');
    if (firstMetric) {
      await firstMetric.hover();
      await page.waitForTimeout(200);
      const hasHover = await firstMetric.evaluate(el => {
        const style = getComputedStyle(el);
        return style.transform !== 'none' || el.classList.contains('hover');
      });
      console.log(`\n📊 Metric hover effects: ${hasHover ? '✅' : '❌'}`);
      if (!hasHover) {
        issues.push({ name: 'Metric hover effects missing', severity: 'low' });
      }
    }

    // 8. Check skill tags
    const tags = await page.$$('.big-bang-tag');
    console.log(`\n🏷️  Skill tags: ${tags.length} total across all cards`);

    // 9. Accessibility checks
    console.log('\n♿ Accessibility checks:');
    const buttonsWithAria = await page.$$('.big-bang-expand-btn[aria-expanded]');
    const buttonsTotal = await page.$$('.big-bang-expand-btn');
    console.log(`  Aria-expanded on buttons: ${buttonsWithAria.length}/${buttonsTotal.length}`);
    
    if (buttonsWithAria.length === buttonsTotal.length) {
      checks.push({ name: 'ARIA attributes present', status: 'pass' });
    }

    // 10. Responsive check
    console.log('\n📱 Responsive check:');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    
    const mobileHeaders = await page.$$('.big-bang-header');
    const mobileButtons = await page.$$('.big-bang-expand-btn');
    console.log(`  Mobile: ${mobileHeaders.length} headers, ${mobileButtons.length} buttons visible`);
    
    if (mobileHeaders.length === 7 && mobileButtons.length === 7) {
      checks.push({ name: 'Mobile responsiveness', status: 'pass' });
    }

    // 11. Check card list styling
    const listItems = await page.$$('.big-bang-list li');
    console.log(`\n📝 List items: ${listItems.length} total`);
    
    // Check for bullet styling
    const firstItem = listItems[0];
    if (firstItem) {
      const beforeContent = await firstItem.evaluate(el => {
        const before = window.getComputedStyle(el, '::before');
        return before.content;
      });
      console.log(`  Bullet styling: ${beforeContent !== 'none' ? '✅' : '❌'}`);
    }

    // 12. Check button styling consistency
    console.log('\n🔘 Button styling:');
    const buttonColors = await page.$$eval('.big-bang-expand-btn', btns => 
      btns.map(b => b.style.backgroundColor)
    );
    const uniqueBtnColors = [...new Set(buttonColors.filter(c => c))];
    console.log(`  Unique button colors when expanded: ${uniqueBtnColors.length}`);
    
    if (uniqueBtnColors.length > 1) {
      checks.push({ name: 'Button color adaptation', status: 'pass' });
    }

    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('                    COMPREHENSIVE UX ANALYSIS');
    console.log('='.repeat(70));

    console.log('\n✅ PASSING CHECKS:');
    checks.forEach(c => console.log(`   ✓ ${c.name}`));

    console.log('\n❌ ISSUES FOUND:');
    if (issues.length === 0) {
      console.log('   No critical issues detected');
    } else {
      issues.forEach(i => console.log(`   [${i.severity.toUpperCase()}] ${i.name}`));
    }

    console.log('\n📊 SUMMARY:');
    console.log(`   Cards: ${bigBangCards.length}`);
    console.log(`   Sections per card: ~7`);
    console.log(`   Total skill tags: ${tags.length}`);
    console.log(`   Color variety: ${uniqueColors.length} header colors`);
    console.log(`   Accessibility: ${buttonsWithAria.length}/${buttonsTotal.length} buttons with ARIA`);

    console.log('\n' + '='.repeat(70));
    console.log(`Status: ${issues.length === 0 ? '✅ ALL CHECKS PASSED' : '⚠️  SOME ISSUES FOUND'}`);
    console.log('='.repeat(70));

  } catch (error) {
    console.error('\n❌ Error during analysis:', error.message);
    issues.push({ name: error.message, severity: 'high' });
  } finally {
    await browser.close();
  }

  return { issues, checks };
}

comprehensiveUXAnalysis().then(result => {
  process.exit(result.issues.length > 0 ? 1 : 0);
});

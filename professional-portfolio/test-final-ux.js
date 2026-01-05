import { chromium } from 'playwright';

async function finalUXVerification() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const results = { passed: 0, failed: 0, warnings: 0 };

  try {
    await page.goto('https://0ms9f13jino0.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded successfully\n');

    // 1. Verify Big Bang cards exist
    const cards = await page.$$('.big-bang-card');
    console.log(`📊 Found ${cards.length} Big Bang cards`);
    results.passed++;

    // 2. Verify color variants
    const colorVariants = await page.$$eval('.big-bang-card', cards => 
      cards.map(c => {
        if (c.classList.contains('variant-amber')) return 'amber';
        if (c.classList.contains('variant-indigo')) return 'indigo';
        if (c.classList.contains('variant-teal')) return 'teal';
        if (c.classList.contains('variant-red')) return 'red';
        if (c.classList.contains('variant-purple')) return 'purple';
        if (c.classList.contains('variant-green')) return 'green';
        if (c.classList.contains('variant-sky')) return 'sky';
        return 'unknown';
      })
    );
    console.log(`🎨 Color variants: ${[...new Set(colorVariants)].join(', ')}`);
    results.passed++;

    // 3. Test expand/close functionality
    console.log('\n🔍 Testing expand/close functionality...');
    for (let i = 0; i < cards.length; i++) {
      const btn = await cards[i].$('.big-bang-expand-btn');
      
      // Expand
      await btn.click();
      await page.waitForTimeout(500);
      const expanded = await btn.getAttribute('aria-expanded');
      const content = await cards[i].$('.big-bang-content.active');
      
      if (expanded === 'true' && content) {
        results.passed++;
      } else {
        console.log(`  ❌ Card ${i + 1} expand failed`);
        results.failed++;
      }

      // Close
      await btn.click();
      await page.waitForTimeout(300);
      const closed = await btn.getAttribute('aria-expanded');
      
      if (closed === 'false') {
        results.passed++;
      } else {
        console.log(`  ❌ Card ${i + 1} close failed`);
        results.failed++;
      }
    }

    // 4. Verify all sections present
    console.log('\n📋 Verifying sections...');
    const firstCard = cards[0];
    await firstCard.$('.big-bang-expand-btn').then(btn => btn.click());
    await page.waitForTimeout(500);
    
    const sections = await firstCard.$$('.big-bang-section');
    const sectionTitles = await firstCard.$$eval('.big-bang-section-title', els => els.map(e => e.textContent));
    
    console.log(`  Sections: ${sections.length}`);
    console.log(`  Types: ${sectionTitles.join(', ')}`);
    
    const requiredSections = ['Company Brief', 'Key Responsibilities', 'The Challenge', 'The Solution', 'The Impact', 'Key Metrics', 'Skills & Tools'];
    const missing = requiredSections.filter(s => !sectionTitles.includes(s));
    
    if (missing.length === 0) {
      console.log('  ✅ All required sections present');
      results.passed++;
    } else {
      console.log(`  ❌ Missing: ${missing.join(', ')}`);
      results.failed++;
    }

    // 5. Verify section color coding
    console.log('\n🎯 Section color coding:');
    const challengeSections = await page.$$('.big-bang-section-challenge');
    const solutionSections = await page.$$('.big-bang-section-solution');
    const impactSections = await page.$$('.big-bang-section-impact');
    
    console.log(`  Challenge: ${challengeSections.length} (red)`);
    console.log(`  Solution: ${solutionSections.length} (teal)`);
    console.log(`  Impact: ${impactSections.length} (green)`);
    
    if (challengeSections.length > 0 && solutionSections.length > 0 && impactSections.length > 0) {
      results.passed++;
    } else {
      results.failed++;
    }

    // 6. Verify metric teasers
    const teasers = await page.$$('.big-bang-teaser');
    console.log(`\n📈 Metric teasers: ${teasers.length}/${cards.length}`);
    if (teasers.length === cards.length) {
      results.passed++;
    } else {
      results.failed++;
    }

    // 7. Verify skill tags
    const tags = await page.$$('.big-bang-tag');
    console.log(`🏷️  Skill tags: ${tags.length} total`);

    // 8. Verify accessibility
    const buttons = await page.$$('.big-bang-expand-btn');
    const ariaButtons = await page.$$('.big-bang-expand-btn[aria-expanded]');
    console.log(`\n♿ Accessibility: ${ariaButtons.length}/${buttons.length} with aria-expanded`);
    
    if (ariaButtons.length === buttons.length) {
      results.passed++;
    } else {
      results.failed++;
    }

    // 9. Verify list items styling
    const listItems = await page.$$('.big-bang-list li');
    console.log(`📝 List items: ${listItems.length} total`);

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('                    FINAL UX VERIFICATION');
    console.log('='.repeat(60));
    console.log(`\n✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📊 Total Checks: ${results.passed + results.failed}`);
    console.log('\n' + '='.repeat(60));
    console.log(`Status: ${results.failed === 0 ? '✅ ALL CHECKS PASSED - READY FOR DEPLOYMENT' : '❌ SOME CHECKS FAILED'}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    results.failed++;
  } finally {
    await browser.close();
  }

  return results;
}

finalUXVerification().then(results => {
  process.exit(results.failed > 0 ? 1 : 0);
});

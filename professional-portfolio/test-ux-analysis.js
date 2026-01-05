import { chromium } from 'playwright';

async function analyzeExperienceSection() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const issues = [];
  const warnings = [];
  const checks = [];

  try {
    // Navigate to the page
    await page.goto('https://cju6zja0icgh.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('✓ Page loaded successfully\n');

    // Check if Experience section exists
    const experienceSection = await page.$('#experience');
    if (experienceSection) {
      checks.push({ name: 'Experience section exists', status: 'pass' });
    } else {
      issues.push({ name: 'Experience section missing', severity: 'critical' });
    }

    // Check for Big Bang cards
    const bigBangCards = await page.$$('.big-bang-card');
    console.log(`Found ${bigBangCards.length} Big Bang cards\n`);

    if (bigBangCards.length === 0) {
      issues.push({ name: 'No Big Bang cards found', severity: 'critical' });
    } else {
      checks.push({ name: `Big Bang cards present: ${bigBangCards.length}`, status: 'pass' });
    }

    // Test card interaction - click first card
    if (bigBangCards.length > 0) {
      const firstCard = bigBangCards[0];
      const expandBtn = await firstCard.$('.big-bang-expand-btn');
      
      if (expandBtn) {
        await expandBtn.click();
        await page.waitForTimeout(600);
        
        const content = await firstCard.$('.big-bang-content.active');
        if (content) {
          checks.push({ name: 'Card expands on click', status: 'pass' });
          
          // Check all sections are present
          const sections = await firstCard.$$('.big-bang-section');
          console.log(`Expanded card has ${sections.length} sections\n`);
          
          if (sections.length < 5) {
            warnings.push({ name: 'Fewer sections than expected', detail: `Found ${sections.length}, expected ~6-7` });
          } else {
            checks.push({ name: `All sections present: ${sections.length}`, status: 'pass' });
          }

          // Check for specific sections
          const sectionTitles = await firstCard.$$eval('.big-bang-section-title', els => els.map(el => el.textContent));
          console.log('Section titles found:', sectionTitles);
          
          const requiredSections = ['Company Brief', 'Key Responsibilities', 'The Challenge', 'The Solution', 'The Impact', 'Key Metrics', 'Skills & Tools'];
          const missingSections = requiredSections.filter(s => !sectionTitles.includes(s));
          
          if (missingSections.length > 0) {
            warnings.push({ name: 'Missing sections', detail: missingSections.join(', ') });
          } else {
            checks.push({ name: 'All required sections present', status: 'pass' });
          }
        } else {
          issues.push({ name: 'Card content not expanding', severity: 'high' });
        }

        // Click again to close
        await expandBtn.click();
        await page.waitForTimeout(600);
        
        const contentAfterClose = await firstCard.$('.big-bang-content:not(.active)');
        if (contentAfterClose) {
          checks.push({ name: 'Card closes on click', status: 'pass' });
        } else {
          warnings.push({ name: 'Card not closing properly' });
        }
      } else {
        issues.push({ name: 'Expand button missing', severity: 'high' });
      }
    }

    // Check button visibility and styling
    const buttons = await page.$$('.big-bang-expand-btn');
    for (let i = 0; i < Math.min(buttons.length, 3); i++) {
      const btn = buttons[i];
      const isVisible = await btn.isVisible();
      const text = await btn.textContent();
      console.log(`Button ${i + 1} text: "${text.trim()}" | Visible: ${isVisible}`);
    }

    // Check header styling consistency
    const headers = await page.$$('.big-bang-header');
    for (let i = 0; i < Math.min(headers.length, 3); i++) {
      const header = headers[i];
      const bgColor = await header.evaluate(el => getComputedStyle(el).backgroundColor);
      console.log(`Header ${i + 1} background: ${bgColor}`);
    }

    // Check for metric teasers
    const teasers = await page.$$('.big-bang-teaser');
    console.log(`\n${teasers.length} cards have metric teasers\n`);

    if (teasers.length < bigBangCards.length) {
      warnings.push({ name: 'Not all cards have metric teasers', detail: `${teasers.length}/${bigBangCards.length} have teasers` });
    }

    // Check skill tags
    const tags = await page.$$('.big-bang-tag');
    console.log(`Found ${tags.length} skill tags across all cards\n`);

    // Check responsive behavior
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mobileHeaders = await page.$$('.big-bang-header');
    console.log(`Mobile view - Headers visible: ${mobileHeaders.length}`);
    
    // Go back to desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(300);

    // Check for accessibility issues
    const buttonsWithAria = await page.$$('.big-bang-expand-btn[aria-expanded]');
    console.log(`\n${buttonsWithAria.length} buttons have aria-expanded attribute`);

    if (buttonsWithAria.length !== buttons.length) {
      warnings.push({ name: 'Missing aria attributes on some buttons' });
    }

    // Print results
    console.log('\n' + '='.repeat(60));
    console.log('UX ANALYSIS RESULTS');
    console.log('='.repeat(60));

    console.log('\n✅ PASSING CHECKS:');
    checks.forEach(c => console.log(`  ✓ ${c.name}`));

    console.log('\n⚠️  WARNINGS:');
    if (warnings.length === 0) {
      console.log('  No warnings');
    } else {
      warnings.forEach(w => console.log(`  ⚠️  ${w.name}${w.detail ? ': ' + w.detail : ''}`));
    }

    console.log('\n❌ ISSUES FOUND:');
    if (issues.length === 0) {
      console.log('  No critical issues');
    } else {
      issues.forEach(i => console.log(`  ❌ [${i.severity}] ${i.name}`));
    }

    console.log('\n' + '='.repeat(60));

  } catch (error) {
    console.error('Error during analysis:', error.message);
    issues.push({ name: error.message, severity: 'high' });
  } finally {
    await browser.close();
  }

  return { issues, warnings, checks };
}

analyzeExperienceSection().then(result => {
  console.log('\nAnalysis complete!');
  process.exit(result.issues.length > 0 ? 1 : 0);
});

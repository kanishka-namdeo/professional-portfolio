/**
 * Comprehensive Visual Audit Script
 * Expert UI/UX Design Audit using Playwright
 */

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  // Test across multiple viewports
  const viewports = [
    { name: 'Desktop', width: 1280, height: 800 },
    { name: 'Laptop', width: 1024, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 812 }
  ];

  const auditResults = {
    timestamp: new Date().toISOString(),
    sections: {},
    issues: [],
    accessibility: [],
    performance: [],
    visual: [],
    interactions: []
  };

  for (const viewport of viewports) {
    console.log('\n' + '='.repeat(60));
    console.log('  VIEWPORT: ' + viewport.name + ' (' + viewport.width + 'x' + viewport.height + ')');
    console.log('='.repeat(60));

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 2
    });
    
    const page = await context.newPage();
    
    // Collect all types of issues
    const pageErrors = [];
    const consoleErrors = [];
    const consoleWarnings = [];
    const layoutIssues = [];
    const visualIssues = [];

    // Set up comprehensive error monitoring
    page.on('pageerror', err => pageErrors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
      if (msg.type() === 'warning') consoleWarnings.push(msg.text());
    });

    try {
      console.log('\n🌐 Loading page...');
      await page.goto('https://5vzr77fxtxr6.space.minimax.io/', { 
        waitUntil: 'networkidle',
        timeout: 60000 
      });
      
      // Wait for animations to complete
      await page.waitForTimeout(2000);
      
      console.log('✓ Page loaded successfully');

      // ========================================
      // 1. HERO SECTION AUDIT
      // ========================================
      console.log(`\n🎨 AUDITING HERO SECTION...`);
      
      const heroSection = await page.$('section[id="hero"], .hero-section');
      if (heroSection) {
        const heroBox = await heroSection.boundingBox();
        console.log(`  ✓ Hero section found: ${heroBox?.width}x${heroBox?.height}px`);
        
        // Check hero content elements
        const heroElements = [
          { selector: '.hero-title, h1', name: 'Main Title' },
          { selector: '.hero-subtitle, .hero-tagline', name: 'Tagline' },
          { selector: '.hero-cta, .cta-button', name: 'CTA Button' },
          { selector: '.hero-stats, .hero-metrics', name: 'Stats/Metrics' },
          { selector: '.availability-badge', name: 'Availability Badge' }
        ];

        for (const el of heroElements) {
          const element = await page.$(el.selector);
          if (element) {
            const isVisible = await element.isVisible();
            const box = await element.boundingBox();
            console.log(`  ✓ ${el.name}: ${isVisible ? 'visible' : 'hidden'} (${box?.width}x${box?.height}px)`);
          } else {
            console.log(`  ⚠ ${el.name}: NOT FOUND`);
            auditResults.issues.push({ type: 'missing', section: 'Hero', element: el.name });
          }
        }

        // Check for proper text contrast
        const title = await page.$('.hero-title, h1');
        if (title) {
          const textColor = await title.evaluate(el => getComputedStyle(el).color);
          console.log(`  ℹ Title text color: ${textColor}`);
        }
      } else {
        console.log(`  ❌ Hero section NOT FOUND`);
        auditResults.issues.push({ type: 'missing', section: 'Hero', element: 'Section container' });
      }

      // ========================================
      // 2. SHOWCASE / CODE SECTION AUDIT
      // ========================================
      console.log(`\n🎨 AUDITING SHOWCASE SECTION...`);
      
      const showcaseSection = await page.$('#showcase, section[id="showcase"]');
      if (showcaseSection) {
        console.log(`  ✓ Showcase section found`);
        
        // Check for showcase cards
        const showcaseCards = await page.$$('.showcase-card, .code-card, [class*="card"]');
        console.log(`  ✓ Found ${showcaseCards.length} showcase cards`);
        
        // Check for carousel/slider
        const carousel = await page.$('.carousel, .embla, .skills-carousel');
        if (carousel) {
          console.log(`  ✓ Carousel component found`);
          
          // Check carousel navigation
          const prevBtn = await page.$('.carousel-btn.prev, .embla__button--prev, .carousel-nav.prev');
          const nextBtn = await page.$('.carousel-btn.next, .embla__button--next, .carousel-nav.next');
          console.log(`  ✓ Carousel navigation: Prev=${prevBtn ? '✓' : '❌'}, Next=${nextBtn ? '✓' : '❌'}`);
        }
      }

      // ========================================
      // 3. EXPERIENCE SECTION AUDIT
      // ========================================
      console.log(`\n🎨 AUDITING EXPERIENCE SECTION...`);
      
      const experienceSection = await page.$('#experience, section[id="experience"]');
      if (experienceSection) {
        console.log(`  ✓ Experience section found`);
        
        // Check big-bang cards
        const bigBangCards = await page.$$('.big-bang-card');
        console.log(`  ✓ Found ${bigBangCards.length} big-bang cards`);
        
        // Verify each card has proper structure
        for (let i = 0; i < bigBangCards.length; i++) {
          const card = bigBangCards[i];
          const cardBox = await card.boundingBox();
          const isVisible = await card.isVisible();
          
          // Check internal card structure
          const header = await card.$('.big-bang-header');
          const logo = await card.$('.big-bang-logo');
          const companyName = await card.$('.big-bang-company-name');
          const expandBtn = await card.$('.big-bang-expand-btn');
          
          console.log(`  📋 Card ${i + 1}: ${isVisible ? 'visible' : 'hidden'} | ` +
            `Size: ${cardBox?.width.toFixed(0)}x${cardBox?.height.toFixed(0)}px | ` +
            `Header: ${header ? '✓' : '❌'} | ` +
            `Logo: ${logo ? '✓' : '❌'} | ` +
            `Expand: ${expandBtn ? '✓' : '❌'}`);
          
          if (!isVisible || !header || !logo) {
            auditResults.issues.push({ 
              type: 'structure', 
              section: 'Experience', 
              element: `Big-bang card ${i + 1}`,
              details: { isVisible, hasHeader: !!header, hasLogo: !!logo }
            });
          }
        }
        
        // Check tab navigation
        const tabNav = await page.$('.experience-tab-navigation');
        const tabButtons = await page.$$('.experience-tab-button');
        console.log(`  ✓ Tab navigation: ${tabNav ? 'container ✓' : 'container ❌'} | ${tabButtons.length} tabs`);
        
        // Check for any overflow issues
        const sectionBox = await experienceSection.boundingBox();
        const scrollWidth = await page.evaluate(() => document.getElementById('experience')?.scrollWidth || 0);
        const clientWidth = await page.evaluate(() => document.getElementById('experience')?.clientWidth || 0);
        
        if (scrollWidth > clientWidth) {
          console.log(`  ⚠️ Horizontal overflow detected: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`);
          auditResults.visual.push({ type: 'overflow', section: 'Experience', severity: 'medium' });
        }
      }

      // ========================================
      // 4. ABOUT SECTION AUDIT
      // ========================================
      console.log(`\n🎨 AUDITING ABOUT SECTION...`);
      
      const aboutSection = await page.$('#about, section[id="about"]');
      if (aboutSection) {
        console.log(`  ✓ About section found`);
        
        // Check balanced grid layout
        const balancedGrid = await page.$('.about-balanced-grid');
        if (balancedGrid) {
          const gridBox = await balancedGrid.boundingBox();
          console.log(`  ✓ Balanced grid: ${gridBox?.width.toFixed(0)}x${gridBox?.height.toFixed(0)}px`);
        }
        
        // Check all about components
        const aboutComponents = [
          { selector: '.about-hero-card', name: 'Hero Card' },
          { selector: '.about-hero-quote', name: 'Quote' },
          { selector: '.about-journey-card', name: 'Journey Card' },
          { selector: '.about-cta-card', name: 'CTA Card' },
          { selector: '.about-profile-card', name: 'Profile Card' },
          { selector: '.about-powers-grid', name: 'Powers Grid' },
          { selector: '.about-focus-card', name: 'Focus Card' },
          { selector: '.about-journey-metrics', name: 'Journey Metrics' }
        ];
        
        for (const comp of aboutComponents) {
          const element = await page.$(comp.selector);
          if (element) {
            const isVisible = await element.isVisible();
            const box = await element.boundingBox();
            const opacity = await element.evaluate(el => getComputedStyle(el).opacity);
            console.log(`  ✓ ${comp.name}: ${isVisible ? 'visible' : 'hidden'} | Opacity: ${opacity}`);
          } else {
            console.log(`  ⚠ ${comp.name}: NOT FOUND`);
          }
        }
        
        // Check profile image
        const profileImage = await page.$('.profile-image');
        if (profileImage) {
          const imgBox = await profileImage.boundingBox();
          console.log(`  ✓ Profile image: ${imgBox?.width.toFixed(0)}x${imgBox?.height.toFixed(0)}px`);
        }
      }

      // ========================================
      // 5. SKILLS & EDUCATION SECTION AUDIT
      // ========================================
      console.log(`\n🎨 AUDITING SKILLS & EDUCATION SECTION...`);
      
      const skillsSection = await page.$('#skills, section[id="skills"]');
      if (skillsSection) {
        console.log(`  ✓ Skills section found`);
        
        // Check folder grid layout
        const folderGrid = await page.$('.skills-folder-grid, .skills-compact-grid');
        if (folderGrid) {
          const gridBox = await folderGrid.boundingBox();
          console.log(`  ✓ Skills grid: ${gridBox?.width.toFixed(0)}x${gridBox?.height.toFixed(0)}px`);
        }
        
        // Check company folder tabs
        const folderTabs = await page.$$('.company-folder-tab');
        console.log(`  ✓ Found ${folderTabs.length} company tabs`);
        
        // Check folder content
        const folderBodies = await page.$$('.company-folder-body');
        console.log(`  ✓ Found ${folderBodies.length} folder content areas`);
        
        // Check for skills tags
        const skillTags = await page.$$('.skill-tag, .big-bang-tag');
        console.log(`  ✓ Found ${skillTags.length} skill tags`);
      }

      // ========================================
      // 6. CONTACT SECTION AUDIT
      // ========================================
      console.log(`\n🎨 AUDITING CONTACT SECTION...`);
      
      const contactSection = await page.$('#contact, section[id="contact"]');
      if (contactSection) {
        console.log(`  ✓ Contact section found`);
        
        // Check contact grid
        const contactGrid = await page.$('.contact-grid');
        if (contactGrid) {
          const gridBox = await contactGrid.boundingBox();
          console.log(`  ✓ Contact grid: ${gridBox?.width.toFixed(0)}x${gridBox?.height.toFixed(0)}px`);
        }
        
        // Check contact items
        const contactItems = await page.$$('.contact-item');
        console.log(`  ✓ Found ${contactItems.length} contact items`);
        
        // Verify each contact item has icon and content
        for (let i = 0; i < contactItems.length; i++) {
          const item = contactItems[i];
          const icon = await item.$('.contact-item-icon, [class*="icon"]');
          const content = await item.$('.contact-item-content, [class*="content"]');
          console.log(`  📋 Contact ${i + 1}: Icon=${icon ? '✓' : '❌'}, Content=${content ? '✓' : '❌'}`);
        }
        
        // Check FAQ items
        const faqItems = await page.$$('.faq-item, .faq-question');
        console.log(`  ✓ Found ${faqItems.length} FAQ items`);
      }

      // ========================================
      // 7. STICKY CTA & NAVIGATION AUDIT
      // ========================================
      console.log(`\n🎨 AUDITING NAVIGATION & STICKY ELEMENTS...`);
      
      // Check sticky CTA
      const stickyCTA = await page.$('.sticky-cta, .sticky-cta-button');
      if (stickyCTA) {
        const ctaBox = await stickyCTA.boundingBox();
        const ctaPosition = await stickyCTA.evaluate(el => {
          const style = window.getComputedStyle(el);
          return { position: style.position, bottom: style.bottom, right: style.right };
        });
        console.log(`  ✓ Sticky CTA: Position=${ctaPosition.position}, Bottom=${ctaPosition.bottom}, Right=${ctaPosition.right}`);
      }
      
      // Check main navigation
      const mainNav = await page.$('nav, .nav-main, .navigation');
      if (mainNav) {
        console.log(`  ✓ Main navigation found`);
      }
      
      // Check scroll navigation
      const scrollNav = await page.$('.scroll-nav, [class*="scroll-nav"]');
      if (scrollNav) {
        console.log(`  ✓ Scroll navigation found`);
      }

      // ========================================
      // 8. ACCESSIBILITY AUDIT
      // ========================================
      console.log(`\n♿ AUDITING ACCESSIBILITY...`);
      
      // Check for alt attributes on images
      const images = await page.$$('img');
      let imagesWithoutAlt = 0;
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        if (!alt && alt !== '') imagesWithoutAlt++;
      }
      console.log(`  ${images.length} images total, ${imagesWithoutAlt} missing alt text`);
      if (imagesWithoutAlt > 0) {
        auditResults.accessibility.push({ type: 'missing-alt', count: imagesWithoutAlt, severity: 'high' });
      }
      
      // Check for ARIA labels on interactive elements
      const buttons = await page.$$('button');
      let buttonsWithoutAria = 0;
      for (const btn of buttons) {
        const ariaLabel = await btn.getAttribute('aria-label');
        const textContent = await btn.textContent();
        if (!ariaLabel && !textContent.trim()) buttonsWithoutAria++;
      }
      console.log(`  ${buttons.length} buttons total, ${buttonsWithoutAria} missing accessible names`);
      if (buttonsWithoutAria > 0) {
        auditResults.accessibility.push({ type: 'button-accessibility', count: buttonsWithoutAria, severity: 'medium' });
      }
      
      // Check heading hierarchy
      const headings = await page.$$('h1, h2, h3, h4, h5, h6');
      const headingLevels = await page.evaluate(() => {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        return Array.from(headings).map(h => ({
          level: h.tagName,
          text: h.textContent?.substring(0, 30)
        }));
      });
      console.log(`  Found ${headings.length} heading elements`);
      
      // Check for skip link
      const skipLink = await page.$('.skip-link, [class*="skip-link"]');
      console.log(`  Skip link: ${skipLink ? '✓ Found' : '❌ Not found'}`);

      // ========================================
      // 9. VISUAL DESIGN AUDIT
      // ========================================
      console.log(`\n🎨 AUDITING VISUAL DESIGN...`);
      
      // Check color contrast basics
      const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      const textColor = await page.evaluate(() => getComputedStyle(document.body).color);
      console.log(`  Body background: ${bodyBg}`);
      console.log(`  Body text color: ${textColor}`);
      
      // Check for proper spacing consistency
      const sections = await page.$$('section[class*="section"], section[id]');
      console.log(`  Found ${sections.length} sections to check spacing`);
      
      // Check for animations
      const animatedElements = await page.$$('.animate-on-scroll, [class*="animate"]');
      console.log(`  Found ${animatedElements.length} animated elements`);
      
      // Check for dark mode support
      const hasDarkMode = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') !== null || 
               window.matchMedia('(prefers-color-scheme: dark)').matches;
      });
      console.log(`  Dark mode support: ${hasDarkMode ? '✓ Detected' : '⚠️ Not detected'}`);

      // ========================================
      // 10. INTERACTION AUDIT
      // ========================================
      console.log(`\n🖱️ AUDITING INTERACTIONS...`);
      
      // Test big-bang card expansion
      const firstCard = await page.$('.big-bang-card');
      if (firstCard) {
        const expandBtn = await firstCard.$('.big-bang-expand-btn');
        if (expandBtn) {
          const initialHeight = (await firstCard.boundingBox()).height;
          await expandBtn.click();
          await page.waitForTimeout(500);
          const expandedHeight = (await firstCard.boundingBox()).height;
          console.log(`  Card expand interaction: ${expandedHeight > initialHeight ? '✓ Works' : '❌ Failed'} | ` +
            `Height change: ${initialHeight.toFixed(0)}px → ${expandedHeight.toFixed(0)}px`);
        }
      }
      
      // Test tab switching
      const tabButtons = await page.$$('.experience-tab-button');
      if (tabButtons.length > 1) {
        const secondTab = tabButtons[1];
        const initialCards = await page.$$('.big-bang-card');
        await secondTab.click();
        await page.waitForTimeout(300);
        const afterTabCards = await page.$$('.big-bang-card');
        console.log(`  Tab switch: ${afterTabCards.length !== initialCards.length ? '✓ Works' : '⚠️ May need optimization'} | ` +
          `Cards before: ${initialCards.length}, after: ${afterTabCards.length}`);
      }

      // ========================================
      // 11. TAKE SECTION SCREENSHOTS
      // ========================================
      console.log(`\n📸 TAKING SECTION SCREENSHOTS...`);
      
      const sectionIds = ['hero', 'showcase', 'experience', 'about', 'skills', 'contact'];
      for (const sectionId of sectionIds) {
        try {
          const section = await page.$(`#${sectionId}, section[id="${sectionId}"]`);
          if (section) {
            await section.scrollIntoViewIfNeeded();
            await page.waitForTimeout(300);
            
            const filename = `audit-${viewport.name.toLowerCase()}-${sectionId}.png`;
            await section.screenshot({ path: `/workspace/professional-portfolio/${filename}` });
            console.log(`  ✓ Saved: ${filename}`);
          }
        } catch (e) {
          console.log(`  ⚠ Could not screenshot ${sectionId}: ${e.message}`);
        }
      }

      // ========================================
      // 12. PAGE-LEVEL CHECKS
      // ========================================
      console.log(`\n📊 PAGE-LEVEL ANALYSIS...`);
      
      const pageMetrics = await page.evaluate(() => {
        return {
          scrollHeight: document.documentElement.scrollHeight,
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          bodyChildren: document.body.children.length,
          totalLinks: document.querySelectorAll('a').length,
          totalButtons: document.querySelectorAll('button').length,
          totalImages: document.querySelectorAll('img').length,
          totalForms: document.querySelectorAll('form').length
        };
      });
      
      console.log(`  Page scroll height: ${pageMetrics.scrollHeight}px`);
      console.log(`  Total sections/elements: ${pageMetrics.bodyChildren}`);
      console.log(`  Interactive links: ${pageMetrics.totalLinks}`);
      console.log(`  Buttons: ${pageMetrics.totalButtons}`);
      console.log(`  Images: ${pageMetrics.totalImages}`);

      // ========================================
      // CONSOLE ERROR SUMMARY
      // ========================================
      console.log(`\n📋 CONSOLE ERROR SUMMARY:`);
      console.log(`  Page errors: ${pageErrors.length}`);
      console.log(`  Console errors: ${consoleErrors.length}`);
      console.log(`  Console warnings: ${consoleWarnings.length}`);
      
      if (consoleErrors.length > 0) {
        console.log(`  ⚠️ Errors:`);
        consoleErrors.forEach((err, i) => console.log(`    ${i + 1}. ${err.substring(0, 100)}`));
        auditResults.performance.push({ type: 'console-errors', count: consoleErrors.length, severity: 'high' });
      }

    } catch (error) {
      console.log(`\n❌ Error during audit: ${error.message}`);
      auditResults.issues.push({ type: 'audit-error', message: error.message });
    }

    await context.close();
  }

  // ========================================
  // FINAL SUMMARY
  // ========================================
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  COMPREHENSIVE VISUAL AUDIT COMPLETE`);
  console.log('═'.repeat(60));
  
  console.log(`\n📊 AUDIT RESULTS SUMMARY:`);
  console.log(`  Total issues found: ${auditResults.issues.length}`);
  console.log(`  Accessibility issues: ${auditResults.accessibility.length}`);
  console.log(`  Performance issues: ${auditResults.performance.length}`);
  console.log(`  Visual issues: ${auditResults.visual.length}`);
  
  if (auditResults.issues.length > 0) {
    console.log(`\n🔴 CRITICAL ISSUES:`);
    auditResults.issues.forEach((issue, i) => {
      console.log(`  ${i + 1}. [${issue.type.toUpperCase()}] ${issue.section}: ${issue.element}`);
    });
  }
  
  if (auditResults.accessibility.length > 0) {
    console.log(`\n🟡 ACCESSIBILITY CONCERNS:`);
    auditResults.accessibility.forEach((issue, i) => {
      console.log(`  ${i + 1}. [${issue.type}] ${issue.count} items (Severity: ${issue.severity})`);
    });
  }

  console.log(`\n✅ OVERALL ASSESSMENT: ${auditResults.issues.length === 0 ? 'EXCELLENT - No critical issues found!' : 'GOOD - Some issues identified that should be addressed'}`);

  await browser.close();
  
  // Save detailed results
  const fs = require('fs');
  fs.writeFileSync('/workspace/professional-portfolio/comprehensive-audit-results.json', JSON.stringify(auditResults, null, 2));
  console.log(`\n📁 Detailed results saved to: comprehensive-audit-results.json`);
})();

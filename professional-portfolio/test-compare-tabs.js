const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Comparing ContactFAQ tabs with Skills tabs...\n');

  try {
    // Navigate to the deployed site
    await page.goto('https://76bw7g7v4nrg.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Page loaded successfully\n');

    // Check ContactFAQ tabs
    console.log('=== ContactFAQ Tabs ===');
    const contactTabButtons = await page.$$('#contact .tab-button');
    console.log(`Found ${contactTabButtons.length} ContactFAQ tab buttons`);

    if (contactTabButtons.length > 0) {
      const contactTab = contactTabButtons[0];
      const styles = await contactTab.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          border: computed.border,
          borderRadius: computed.borderRadius,
          padding: computed.padding,
          fontWeight: computed.fontWeight,
          fontSize: computed.fontSize,
          display: computed.display,
          alignItems: computed.alignItems,
          gap: computed.gap,
          fontFamily: computed.fontFamily
        };
      });
      console.log('ContactFAQ Tab styles:', JSON.stringify(styles, null, 2));
    }

    // Check Skills tabs
    console.log('\n=== Skills Tabs ===');
    const skillsTabButtons = await page.$$('#skills .skills-tab-button');
    console.log(`Found ${skillsTabButtons.length} Skills tab buttons`);

    if (skillsTabButtons.length > 0) {
      const skillsTab = skillsTabButtons[0];
      const styles = await skillsTab.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          border: computed.border,
          borderRadius: computed.borderRadius,
          padding: computed.padding,
          fontWeight: computed.fontWeight,
          fontSize: computed.fontSize,
          display: computed.display,
          alignItems: computed.alignItems,
          gap: computed.gap,
          fontFamily: computed.fontFamily
        };
      });
      console.log('Skills Tab styles:', JSON.stringify(styles, null, 2));
    }

    // Compare inactive states
    console.log('\n=== Inactive Tab Comparison ===');

    // Get the FAQ tab (should be inactive by default)
    const faqTab = await page.$('#contact .tab-button:nth-child(2)');
    if (faqTab) {
      const styles = await faqTab.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          border: computed.border,
          borderRadius: computed.borderRadius
        };
      });
      console.log('ContactFAQ Inactive Tab:', JSON.stringify(styles, null, 2));
    }

    // Get the Skills tab (should be inactive by default - credentials is active)
    const skillsInactiveTab = await page.$('#skills .skills-tab-button:nth-child(2)');
    if (skillsInactiveTab) {
      const styles = await skillsInactiveTab.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          border: computed.border,
          borderRadius: computed.borderRadius
        };
      });
      console.log('Skills Inactive Tab:', JSON.stringify(styles, null, 2));
    }

    // Check the tab navigation containers
    console.log('\n=== Tab Navigation Containers ===');
    const contactNav = await page.$('#contact .tab-navigation');
    const skillsNav = await page.$('#skills .skills-tab-navigation');

    if (contactNav && skillsNav) {
      const contactNavStyles = await contactNav.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          justifyContent: computed.justifyContent,
          gap: computed.gap,
          marginBottom: computed.marginBottom
        };
      });

      const skillsNavStyles = await skillsNav.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          justifyContent: computed.justifyContent,
          gap: computed.gap,
          marginBottom: computed.marginBottom
        };
      });

      console.log('ContactFAQ Navigation:', JSON.stringify(contactNavStyles, null, 2));
      console.log('Skills Navigation:', JSON.stringify(skillsNavStyles, null, 2));
    }

  } catch (error) {
    console.error('Error during testing:', error.message);
  } finally {
    await browser.close();
  }
})();

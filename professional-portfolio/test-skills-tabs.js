const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Testing Skills & Qualifications tabs...');

  try {
    // Navigate to the deployed site
    await page.goto('https://76bw7g7v4nrg.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Page loaded successfully');

    // Check if the Skills section exists
    const skillsSection = await page.$('#skills');
    if (skillsSection) {
      console.log('✓ Skills section found');
    } else {
      console.log('✗ Skills section not found');
    }

    // Check for the new tab button class
    const tabButtons = await page.$$('.skills-tab-button');
    console.log(`Found ${tabButtons.length} skills-tab-button elements`);

    // Check for old folder-tab class (should not exist)
    const oldFolderTabs = await page.$$('.folder-tab');
    console.log(`Found ${oldFolderTabs.length} folder-tab elements (should be 0)`);

    // Get computed styles for the tabs
    if (tabButtons.length > 0) {
      const firstTab = tabButtons[0];
      const styles = await firstTab.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          border: computed.border,
          borderRadius: computed.borderRadius,
          padding: computed.padding,
          fontWeight: computed.fontWeight,
          display: computed.display,
          alignItems: computed.alignItems,
          gap: computed.gap
        };
      });
      console.log('Tab styles:', JSON.stringify(styles, null, 2));
    }

    // Test clicking on Skills tab
    const skillsTabBtn = await page.$('.skills-tab-button:nth-child(2)');
    if (skillsTabBtn) {
      await skillsTabBtn.click();
      console.log('✓ Clicked on Skills tab');

      // Wait a bit for the content to change
      await page.waitForTimeout(500);

      // Check if skills content is now visible
      const skillsContent = await page.$('.skills-folder-content.active');
      if (skillsContent) {
        console.log('✓ Skills content is now active');
      } else {
        console.log('✗ Skills content is not active after click');
      }
    }

    console.log('\nTest completed successfully');

  } catch (error) {
    console.error('Error during testing:', error.message);
  } finally {
    await browser.close();
  }
})();

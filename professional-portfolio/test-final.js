const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Testing corrected Skills tabs implementation...\n');

  try {
    // Navigate to the deployed site
    await page.goto('https://4r2cyoqhnl46.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Page loaded successfully\n');

    // Check that Skills section now uses .tab-button and .tab-navigation classes
    console.log('=== Checking Class Usage ===');
    const skillsTabButtons = await page.$$('#skills .tab-button');
    const skillsTabNav = await page.$('#skills .tab-navigation');

    console.log(`Found ${skillsTabButtons.length} .tab-button elements in Skills section`);
    console.log(`Found ${skillsTabNav ? '1' : '0'} .tab-navigation element in Skills section`);

    if (skillsTabButtons.length === 0) {
      console.log('✗ ERROR: No .tab-button classes found - implementation may be wrong');
    } else {
      console.log('✓ Skills section now uses .tab-button class (same as ContactFAQ)');
    }

    // Compare styles between ContactFAQ and Skills tabs
    console.log('\n=== Style Comparison ===');

    // ContactFAQ active tab
    const contactActiveTab = await page.$('#contact .tab-button.active');
    // Skills active tab
    const skillsActiveTab = await page.$('#skills .tab-button.active');

    if (contactActiveTab && skillsActiveTab) {
      const contactStyles = await contactActiveTab.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          border: computed.border,
          borderRadius: computed.borderRadius,
          padding: computed.padding,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight
        };
      });

      const skillsStyles = await skillsActiveTab.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          border: computed.border,
          borderRadius: computed.borderRadius,
          padding: computed.padding,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight
        };
      });

      console.log('ContactFAQ Active Tab:', JSON.stringify(contactStyles, null, 2));
      console.log('\nSkills Active Tab:', JSON.stringify(skillsStyles, null, 2));

      // Compare key properties
      const match = (
        contactStyles.backgroundColor === skillsStyles.backgroundColor &&
        contactStyles.color === skillsStyles.color &&
        contactStyles.border === skillsStyles.border &&
        contactStyles.borderRadius === skillsStyles.borderRadius &&
        contactStyles.padding === skillsStyles.padding &&
        contactStyles.fontSize === skillsStyles.fontSize
      );

      console.log('\n=== Match Result ===');
      if (match) {
        console.log('✓ TABS MATCH PERFECTLY! Implementation is correct.');
      } else {
        console.log('✗ Tabs still have differences. Implementation needs more work.');
      }
    }

    // Test tab navigation functionality
    console.log('\n=== Functionality Test ===');
    const skillsTab2 = await page.$('#skills .tab-button:nth-child(2)');
    if (skillsTab2) {
      await skillsTab2.click();
      await page.waitForTimeout(300);

      const skillsActive = await page.$('#skills .tab-button:nth-child(2).active');
      const skillsPanelActive = await page.$('#skills .tab-panel:nth-child(2).active');

      if (skillsActive && skillsPanelActive) {
        console.log('✓ Tab switching functionality works correctly');
      } else {
        console.log('✗ Tab switching not working properly');
      }
    }

  } catch (error) {
    console.error('Error during testing:', error.message);
  } finally {
    await browser.close();
  }
})();

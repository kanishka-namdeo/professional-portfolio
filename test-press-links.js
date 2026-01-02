/**
 * Playwright Test Script for Press Section Links
 * Tests all press items to verify if their URLs load correctly in the modal iframe
 * 
 * This script:
 * 1. Iterates through all unique press items
 * 2. Clicks on each press card to open the modal
 * 3. Waits for the iframe to load (or timeout after 7 seconds)
 * 4. Checks if the iframe successfully loaded content or was blocked
 * 5. Logs the URL and loading status for each item
 */

const { chromium } = require('playwright');

const TEST_URL = 'https://fho68qln3tno.space.minimax.io/'; // Latest deployed version

// Press items data (from Press.tsx) - using unique items only
const pressItems = [
  {
    title: 'Wildlife Surveillance and Anti-poaching System Installed by Rajasthan Government',
    url: 'https://nayarajasthan.wordpress.com/2018/06/06/wildlife-surveillance-and-anti-poaching-system-installed-by-rajasthan-government/',
  },
  {
    title: 'Waste Collection Drones',
    url: 'https://fb.watch/u1MvvTNV-Q/',
  },
  {
    title: 'Robots Are No Threat But An Aide To Support Production',
    url: 'https://r3pl1c4.substack.com/p/robots-are-no-threat-but-an-aide',
  },
  {
    title: 'Maharashtra Embraces Startups, Signs Pacts for Works Worth ₹15 Lakh',
    url: 'https://www.thehindu.com/news/cities/mumbai/state-embraces-startups-signs-pacts-for-works-worth-15-lakh/article24301791.ece',
  },
  {
    title: 'Welcome Trashfin, The Water Bodies Cleaner',
    url: 'https://mumbaimirror.indiatimes.com/mumbai/civic/welcome-trashfin-the-water-bodies-cleaner/articleshow/64891123.cms',
  },
  {
    title: 'Indian Startup Develops Wasteshark Water Surface Cleaning Drone',
    url: 'https://futureentech.com/indian-startup-wastershark-water-surface-cleaning-drone/',
  },
];

async function testPressLinks() {
  console.log('=== Press Links Test Suite ===\n');
  console.log(`Starting test at: ${new Date().toISOString()}`);
  console.log(`Target URL: ${TEST_URL}\n`);

  const browser = await chromium.launch({
    headless: true,
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  
  const page = await context.newPage();
  
  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  try {
    // Navigate to the page
    console.log('Navigating to the press section page...');
    await page.goto(TEST_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded successfully.\n');

    // Scroll to the press section to make it visible
    await page.evaluate(() => {
      const pressSection = document.getElementById('press');
      if (pressSection) {
        pressSection.scrollIntoView({ behavior: 'instant' });
      }
    });

    // Wait for press cards to be visible
    await page.waitForSelector('.press-card', { timeout: 10000 });
    console.log('Press cards are visible.\n');

    // Get all unique press cards (first occurrence of each unique item)
    const allCards = await page.locator('.press-card').all();
    console.log(`Found ${allCards.length} total cards (includes duplicates for infinite scroll).\n`);

    // Test each unique press item
    for (let i = 0; i < pressItems.length; i++) {
      const item = pressItems[i];
      console.log(`--- Testing Press Item ${i + 1}/${pressItems.length} ---`);
      console.log(`Title: ${item.title}`);
      console.log(`URL: ${item.url}`);

      try {
        // Use JavaScript to find and click the card by aria-label
        await page.evaluate((title) => {
          const cards = document.querySelectorAll('.press-card');
          for (const card of cards) {
            if (card.getAttribute('aria-label') === title) {
              card.click();
              break;
            }
          }
        }, item.title);
        console.log('Clicked on press card.');

        // Wait for modal to open
        await page.waitForSelector('.article-modal-overlay', { timeout: 5000 });
        console.log('Modal opened.');

        // Wait for iframe to attempt loading
        await page.waitForSelector('.article-modal-iframe', { timeout: 5000 });
        console.log('Iframe element found.');

        // Wait for either iframe to load or fallback to appear (10 seconds total)
        // Component has a 5-second countdown before showing fallback
        const timeout = 10000;
        const startTime = Date.now();
        let iframeLoaded = false;
        let showFallback = false;
        let finalIframeSrc = '';
        
        // Track if we've seen the loader being hidden (content loaded or fallback shown)
        let loaderHiddenDetected = false;
        let loaderHiddenTime = 0;

        while (Date.now() - startTime < timeout) {
          // Check iframe and fallback state
          const iframeInfo = await page.evaluate(() => {
            const iframe = document.querySelector('.article-modal-iframe');
            const fallback = document.querySelector('.article-modal-fallback');
            const loader = document.querySelector('.article-modal-loader');
            
            if (!iframe) {
              return { error: 'Iframe not found' };
            }

            // Get computed styles to check visibility
            const fallbackStyles = fallback ? window.getComputedStyle(fallback) : null;
            const fallbackDisplay = fallbackStyles ? fallbackStyles.display : 'none';
            const fallbackVisibility = fallbackStyles ? fallbackStyles.visibility : 'visible';
            
            const loaderStyles = loader ? window.getComputedStyle(loader) : null;
            const loaderDisplay = loaderStyles ? loaderStyles.display : 'none';
            
            return {
              src: iframe.src || '',
              isHidden: iframe.classList.contains('iframe-hidden'),
              isIframeHidden: iframe.offsetParent === null,
              fallbackDisplay,
              fallbackVisibility,
              loaderDisplay,
              // Check if loader is actually visible to user
              loaderVisible: loader && loader.offsetParent !== null,
            };
          });

          finalIframeSrc = iframeInfo.src;
          
          // Check if fallback is visible (not display:none and not visibility:hidden)
          const isFallbackVisible = iframeInfo.fallbackDisplay !== 'none' && 
                                    iframeInfo.fallbackVisibility !== 'hidden';
          
          if (isFallbackVisible) {
            showFallback = true;
            console.log('Fallback is visible (website blocks embedding).');
            console.log(`  - Fallback display: ${iframeInfo.fallbackDisplay}, visibility: ${iframeInfo.fallbackVisibility}`);
            break;
          }

          // Check if loader is hidden (either content loaded or fallback will show)
          if (!iframeInfo.loaderVisible && !isFallbackVisible) {
            if (!loaderHiddenDetected) {
              loaderHiddenDetected = true;
              loaderHiddenTime = Date.now() - startTime;
              console.log(`Loader hidden after ${loaderHiddenTime}ms.`);
            }
            
            // If loader is hidden and iframe is not hidden, content likely loaded
            if (!iframeInfo.isHidden && !iframeInfo.isIframeHidden && finalIframeSrc && finalIframeSrc !== 'about:blank') {
              iframeLoaded = true;
              console.log('Iframe loaded successfully (loader hidden, content visible).');
              break;
            }
          }

          await page.waitForTimeout(500);
        }

        // Determine final status
        const elapsed = Date.now() - startTime;
        let status = 'unknown';
        let notes = '';

        if (iframeLoaded) {
          status = 'success';
          notes = 'Iframe loaded successfully (loader hidden, content visible)';
          passedCount++;
        } else if (showFallback) {
          status = 'blocked';
          notes = 'Website blocks iframe embedding (fallback shown after countdown)';
          // This is expected behavior, not a failure
          passedCount++;
        } else if (finalIframeSrc === 'about:blank' || finalIframeSrc === '') {
          status = 'failed';
          notes = 'Iframe src is about:blank or empty after timeout';
          failedCount++;
        } else if (elapsed >= timeout) {
          status = 'timeout';
          notes = `Timed out after ${elapsed}ms waiting for content`;
          failedCount++;
        } else {
          status = 'uncertain';
          notes = `Finished with src="${finalIframeSrc}", loader hidden at ${loaderHiddenTime}ms`;
          // Consider this a partial success since loader hid
          passedCount++;
        }

        console.log(`Status: ${status.toUpperCase()}`);
        console.log(`Notes: ${notes}`);
        console.log(`Time elapsed: ${elapsed}ms\n`);

        results.push({
          index: i + 1,
          title: item.title,
          url: item.url,
          status,
          notes,
          elapsed,
        });

        // Close the modal
        const closeBtn = page.locator('.article-modal-close-btn');
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
          console.log('Modal closed.\n');
        } else {
          // Try pressing Escape
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);
        }

        // Wait a bit before next test
        await page.waitForTimeout(1000);

      } catch (error) {
        console.log(`ERROR: ${error.message}`);
        failedCount++;
        
        results.push({
          index: i + 1,
          title: item.title,
          url: item.url,
          status: 'error',
          notes: error.message,
          elapsed: 0,
        });
        
        // Try to close modal if open
        try {
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);
        } catch (e) {}
        
        console.log('');
      }
    }

  } catch (error) {
    console.error('Fatal error during test:', error);
  } finally {
    await browser.close();
  }

  // Print summary
  console.log('=== TEST SUMMARY ===\n');
  console.log(`Total items tested: ${pressItems.length}`);
  console.log(`Passed (success or expected blocked): ${passedCount}`);
  console.log(`Failed (errors or timeouts): ${failedCount}`);
  console.log(`Success rate: ${((passedCount / pressItems.length) * 100).toFixed(1)}%\n`);

  console.log('=== DETAILED RESULTS ===\n');
  
  // Print results in a table format
  console.log('| # | Status | Title | URL |');
  console.log('|---|--------|-------|-----|');
  
  results.forEach((result) => {
    const titleShort = result.title.length > 50 
      ? result.title.substring(0, 47) + '...' 
      : result.title;
    const urlShort = result.url.length > 50 
      ? result.url.substring(0, 47) + '...' 
      : result.url;
    const statusIcon = result.status === 'success' ? '✓' 
                      : result.status === 'blocked' ? '⚠' 
                      : result.status === 'error' ? '✗' 
                      : '?';
    
    console.log(`| ${result.index} | ${statusIcon} ${result.status.toUpperCase()} | ${titleShort} | ${urlShort} |`);
  });

  console.log('\n=== END OF TEST ===');

  // Return results for programmatic use
  return {
    total: pressItems.length,
    passed: passedCount,
    failed: failedCount,
    results,
  };
}

// Run the test
testPressLinks()
  .then((results) => {
    process.exit(results.failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });

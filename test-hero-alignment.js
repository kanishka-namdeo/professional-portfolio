/**
 * Playwright Test Script for Hero Section Alignment
 * Verifies that the hero section has consistent alignment with other sections on wide screens
 */

const { chromium } = require('playwright');

const TEST_URL = 'https://9leyh57vaivy.space.minimax.io/';

async function testHeroAlignment() {
  console.log('=== Hero Section Alignment Test ===\n');
  console.log(`Testing: ${TEST_URL}\n`);

  const browser = await chromium.launch({
    headless: true,
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to the page
    console.log('Navigating to the page...');
    await page.goto(TEST_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded.\n');

    // Test 1: Check if hero uses container class
    console.log('Test 1: Checking if hero section uses container...');
    const heroHasContainer = await page.evaluate(() => {
      const hero = document.querySelector('#hero');
      const container = hero?.querySelector('.container');
      return {
        heroExists: !!hero,
        containerExists: !!container,
        containerWidth: container ? getComputedStyle(container).width : 'N/A',
        containerMaxWidth: container ? getComputedStyle(container).maxWidth : 'N/A',
        containerMargin: container ? getComputedStyle(container).margin : 'N/A',
        containerPadding: container ? getComputedStyle(container).padding : 'N/A',
      };
    });
    console.log(`  Hero exists: ${heroHasContainer.heroExists}`);
    console.log(`  Container exists: ${heroHasContainer.containerExists}`);
    console.log(`  Container width: ${heroHasContainer.containerWidth}`);
    console.log(`  Container max-width: ${heroHasContainer.containerMaxWidth}`);
    console.log(`  Container margin: ${heroHasContainer.containerMargin}`);
    console.log(`  Container padding: ${heroHasContainer.containerPadding}\n`);

    // Test 2: Check hero section padding
    console.log('Test 2: Checking hero section padding...');
    const heroPadding = await page.evaluate(() => {
      const hero = document.querySelector('#hero');
      return hero ? getComputedStyle(hero).padding : 'N/A';
    });
    console.log(`  Hero padding: ${heroPadding}\n`);

    // Test 3: Compare hero container alignment with another section (e.g., #products)
    console.log('Test 3: Comparing alignment between hero and other sections...');
    const alignmentComparison = await page.evaluate(() => {
      const heroContainer = document.querySelector('#hero .container');
      const productsSection = document.querySelector('#products');
      const productsContainer = productsSection?.querySelector('.container');
      
      if (!heroContainer || !productsContainer) {
        return { error: 'Could not find containers to compare' };
      }

      const heroRect = heroContainer.getBoundingClientRect();
      const productsRect = productsContainer.getBoundingClientRect();

      return {
        heroLeft: heroRect.left,
        heroRight: heroRect.right,
        heroWidth: heroRect.width,
        productsLeft: productsRect.left,
        productsRight: productsRect.right,
        productsWidth: productsRect.width,
        leftAligned: Math.abs(heroRect.left - productsRect.left) < 2,
        rightAligned: Math.abs(heroRect.right - productsRect.right) < 2,
        widthMatch: Math.abs(heroRect.width - productsRect.width) < 2,
      };
    });

    if (alignmentComparison.error) {
      console.log(`  Error: ${alignmentComparison.error}\n`);
    } else {
      console.log(`  Hero left position: ${alignmentComparison.heroLeft}px`);
      console.log(`  Products left position: ${alignmentComparison.productsLeft}px`);
      console.log(`  Left edges aligned: ${alignmentComparison.leftAligned ? '✓ YES' : '✗ NO'}`);
      console.log(`  Hero right position: ${alignmentComparison.heroRight}px`);
      console.log(`  Products right position: ${alignmentComparison.productsRight}px`);
      console.log(`  Right edges aligned: ${alignmentComparison.rightAligned ? '✓ YES' : '✗ NO'}`);
      console.log(`  Hero width: ${alignmentComparison.heroWidth}px`);
      console.log(`  Products width: ${alignmentComparison.productsWidth}px`);
      console.log(`  Widths match: ${alignmentComparison.widthMatch ? '✓ YES' : '✗ NO'}\n`);
    }

    // Test 4: Check that hero content is properly contained
    console.log('Test 4: Checking hero content alignment within container...');
    const contentAlignment = await page.evaluate(() => {
      const heroContent = document.querySelector('.hero-content-wrapper');
      const heroContainer = document.querySelector('#hero .container');
      
      if (!heroContent || !heroContainer) {
        return { error: 'Could not find elements to check' };
      }

      const contentRect = heroContent.getBoundingClientRect();
      const containerRect = heroContainer.getBoundingClientRect();

      return {
        contentLeft: contentRect.left,
        containerLeft: containerRect.left,
        contentRight: contentRect.right,
        containerRight: containerRect.right,
        isContained: contentRect.left >= containerRect.left && 
                     contentRect.right <= containerRect.right,
        leftOffset: Math.round(contentRect.left - containerRect.left),
      };
    });

    if (contentAlignment.error) {
      console.log(`  Error: ${contentAlignment.error}\n`);
    } else {
      console.log(`  Content left offset from container: ${contentAlignment.leftOffset}px`);
      console.log(`  Content is contained within container: ${contentAlignment.isContained ? '✓ YES' : '✗ NO'}\n`);
    }

    // Summary
    console.log('=== TEST SUMMARY ===');
    const allAligned = alignmentComparison.leftAligned && 
                      alignmentComparison.rightAligned && 
                      contentAlignment.isContained;
    
    if (allAligned) {
      console.log('✓ Hero section is properly aligned with other sections on wide screens!');
    } else {
      console.log('✗ Hero section alignment needs attention.');
      if (!alignmentComparison.leftAligned) {
        console.log('  - Left edges are not aligned');
      }
      if (!alignmentComparison.rightAligned) {
        console.log('  - Right edges are not aligned');
      }
      if (!contentAlignment.isContained) {
        console.log('  - Content is not properly contained');
      }
    }

  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testHeroAlignment()
  .catch((error) => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });

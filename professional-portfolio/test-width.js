import { chromium } from 'playwright';

async function verifyWidthConsistency() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://k1f4p8hbc8rs.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded\n');

    // Check container max-width
    const containerMaxWidth = await page.$eval('.container', el => {
      return window.getComputedStyle(el).maxWidth;
    });
    console.log(`📐 Container max-width: ${containerMaxWidth}`);

    // Check big-bang-container width
    const cardContainerWidth = await page.$eval('.big-bang-container', el => {
      return {
        width: window.getComputedStyle(el).width,
        maxWidth: window.getComputedStyle(el).maxWidth
      };
    });
    console.log(`📐 Big Bang Container: width=${cardContainerWidth.width}, maxWidth=${cardContainerWidth.maxWidth}`);

    // Check individual card width
    const cardWidth = await page.$eval('.big-bang-card', el => {
      return {
        width: window.getComputedStyle(el).width,
        maxWidth: window.getComputedStyle(el).maxWidth
      };
    });
    console.log(`📐 Big Bang Card: width=${cardWidth.width}, maxWidth=${cardWidth.maxWidth}`);

    // Check spacing consistency
    const headerPadding = await page.$eval('.big-bang-header', el => {
      return window.getComputedStyle(el).padding;
    });
    console.log(`📏 Header padding: ${headerPadding}`);

    const bodyPadding = await page.$eval('.big-bang-body', el => {
      return window.getComputedStyle(el).padding;
    });
    console.log(`📏 Body padding: ${bodyPadding}`);

    // Verify cards span full width
    const cardsSpanFullWidth = cardWidth.width === cardWidth.maxWidth && cardWidth.maxWidth !== '0px';
    console.log(`\n✅ Cards span full container width: ${cardsSpanFullWidth}`);

    // Check for theme spacing variables
    const spacingConsistent = headerPadding.includes('24px') || headerPadding.includes('32px');
    console.log(`✅ Spacing uses theme scale: ${spacingConsistent}`);

    console.log('\n' + '='.repeat(50));
    console.log('WIDTH VERIFICATION COMPLETE');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

verifyWidthConsistency();

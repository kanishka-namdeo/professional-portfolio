const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║       UX IMPROVEMENTS VERIFICATION                             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    await page.goto('https://8crxkv7bhx4k.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Page loaded successfully\n');

    // ===== VERIFY SECTION TITLE SIZING =====
    console.log('═'.repeat(70));
    console.log('1. SECTION TITLE VERIFICATION');
    console.log('═'.repeat(70) + '\n');

    const sectionTitles = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      return sections.slice(0, 5).map((sec, i) => {
        const h2 = sec.querySelector('h2, .section-title');
        const h2Styles = h2 ? window.getComputedStyle(h2) : null;
        const h2Rect = h2 ? h2.getBoundingClientRect() : { width: 0, height: 0 };
        return {
          id: sec.id || `section-${i}`,
          h2Size: h2Styles ? h2Styles.fontSize : 'N/A',
          h2Height: h2Rect.height.toFixed(1)
        };
      });
    });

    console.log('Section Title Sizes:');
    sectionTitles.forEach(sec => {
      const size = parseFloat(sec.h2Size);
      console.log(`  #${sec.id}: ${sec.h2Size} (${size >= 28 ? '✓ Good' : '⚠️ Too small'})`);
    });

    // ===== VERIFY SECTION PADDING =====
    console.log('\n' + '═'.repeat(70));
    console.log('2. SECTION PADDING VERIFICATION');
    console.log('═'.repeat(70) + '\n');

    const sectionPadding = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section')).slice(0, 6);
      return sections.map((sec, i) => {
        const computed = window.getComputedStyle(sec);
        return {
          id: sec.id || `section-${i}`,
          paddingTop: computed.paddingTop,
          paddingBottom: computed.paddingBottom
        };
      });
    });

    console.log('Section Padding:');
    sectionPadding.forEach(sec => {
      const pt = parseFloat(sec.paddingTop);
      console.log(`  #${sec.id}: T:${sec.paddingTop}, B:${sec.paddingBottom} ${pt >= 64 ? '✓' : '⚠️'}`);
    });

    // ===== VERIFY CARD PADDING =====
    console.log('\n' + '═'.repeat(70));
    console.log('3. CARD PADDING VERIFICATION');
    console.log('═'.repeat(70) + '\n');

    const cardPadding = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.product-card, .showcase-card, .foundation-card')).slice(0, 4);
      return cards.map((card, i) => {
        const rect = card.getBoundingClientRect();
        const computed = window.getComputedStyle(card);
        return {
          type: card.className.split(' ')[0],
          width: rect.width.toFixed(1),
          padding: computed.padding,
          borderRadius: computed.borderRadius
        };
      });
    });

    console.log('Card Padding:');
    cardPadding.forEach(card => {
      const pad = parseFloat(card.padding);
      console.log(`  ${card.type}: ${card.width}x?px, padding: ${card.padding} ${pad >= 16 ? '✓' : '⚠️'}`);
    });

    // ===== SUMMARY =====
    console.log('\n' + '═'.repeat(70));
    console.log('VERIFICATION SUMMARY');
    console.log('═'.repeat(70) + '\n');

    const allH2Good = sectionTitles.every(sec => parseFloat(sec.h2Size) >= 28);
    const allPaddingGood = sectionPadding.every(sec => parseFloat(sec.paddingTop) >= 48);
    const allCardPaddingGood = cardPadding.every(card => parseFloat(card.padding) >= 16);

    console.log(`Section Titles: ${allH2Good ? '✓ All sizes corrected' : '⚠️ Some still too small'}`);
    console.log(`Section Padding: ${allPaddingGood ? '✓ All meet minimum' : '⚠️ Some need adjustment'}`);
    console.log(`Card Padding: ${allCardPaddingGood ? '✓ All have padding' : '⚠️ Some still missing'}`);

    if (allH2Good && allPaddingGood && allCardPaddingGood) {
      console.log('\n🎉 ALL UX IMPROVEMENTS VERIFIED SUCCESSFULLY!');
    } else {
      console.log('\n⚠️ Some improvements may need additional fixes.');
    }

    console.log('\n' + '═'.repeat(70));

  } catch (error) {
    console.error('Error during verification:', error.message);
  } finally {
    await browser.close();
  }
})();

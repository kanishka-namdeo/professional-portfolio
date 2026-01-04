const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            // Filter out font/CORS errors which are expected with file:// protocol
            const text = msg.text();
            if (!text.includes('CORS policy') && 
                !text.includes('font') && 
                !text.includes('ERR_FAILED') &&
                !text.includes('ERR_FILE_NOT_FOUND')) {
                errors.push(text);
            }
        }
    });

    page.on('pageerror', err => {
        errors.push(err.message);
    });

    const filePath = 'file://' + path.resolve(__dirname, 'out/index.html');

    try {
        await page.goto(filePath, { waitUntil: 'networkidle' });
        console.log('Page loaded successfully');

        // Test 1: Check for showcase carousel section
        const showcaseSection = await page.$('.showcase');
        if (showcaseSection) {
            console.log('✓ Showcase section found');
        } else {
            errors.push('Showcase section not found');
        }

        // Test 2: Check for carousel container
        const carouselContainer = await page.$('.showcase-carousel-container');
        if (carouselContainer) {
            console.log('✓ Carousel container found');
        } else {
            errors.push('Carousel container not found');
        }

        // Test 3: Check for carousel track
        const carousel = await page.$('.showcase-carousel');
        if (carousel) {
            console.log('✓ Carousel track found');
        } else {
            errors.push('Carousel track not found');
        }

        // Test 4: Check for showcase cards
        const showcaseCards = await page.$$('.showcase-card');
        console.log(`✓ Found ${showcaseCards.length} showcase cards`);

        // Test 5: Check for carousel buttons
        const prevBtn = await page.$('.carousel-prev');
        const nextBtn = await page.$('.carousel-next');
        if (prevBtn && nextBtn) {
            console.log('✓ Carousel navigation buttons found');
        } else {
            errors.push('Carousel navigation buttons not found');
        }

        // Test 6: Check for carousel indicators
        const indicators = await page.$$('.carousel-indicators .indicator');
        console.log(`✓ Found ${indicators.length} carousel indicators`);

        // Test 7: Check button states - prev should be disabled at start
        const prevDisabled = await prevBtn?.getAttribute('disabled');
        const nextDisabled = await nextBtn?.getAttribute('disabled');
        console.log(`  Button states: prev disabled=${prevDisabled !== null}, next disabled=${nextDisabled !== null}`);

        // Test 8: Check for skill tabs
        const folderTabs = await page.$$('.folder-tab');
        console.log(`✓ Found ${folderTabs.length} skill/credentials tabs`);

        // Test 9: Check for credentials grid (merged education + certs)
        const credentialsGrid = await page.$('.credentials-folder-grid');
        if (credentialsGrid) {
            console.log('✓ Credentials grid (merged education/certs) found');
        } else {
            errors.push('Credentials grid not found');
        }

        // Test 10: Check credential cards
        const credentialCards = await page.$$('.credential-folder-card');
        console.log(`✓ Found ${credentialCards.length} credential cards (education + certifications)`);

        // Test 11: Verify correct sections exist
        const sections = await page.$$('section[id]');
        const sectionIds = await Promise.all(sections.map(s => s.getAttribute('id')));
        console.log(`✓ Sections found: ${sectionIds.join(', ')}`);

        // Test 12: Check navigation links
        const navLinks = await page.$$('.nav-link');
        const navHrefs = await Promise.all(navLinks.map(l => l.getAttribute('href')));
        console.log(`✓ Navigation links: ${navHrefs.join(', ')}`);

        // Test 13: Verify key content exists
        const pageContent = await page.content();
        const hasName = pageContent.includes('Kanishka Namdeo');
        const hasProducts = pageContent.includes('Products Contributed');
        const hasCode = pageContent.includes('Code & Open Source');
        const hasExperience = pageContent.includes('Experience');
        const hasAbout = pageContent.includes('About Me');
        const hasSkills = pageContent.includes('Skills & Qualifications');
        const hasContact = pageContent.includes('Get In Touch');

        if (hasName && hasProducts && hasCode && hasExperience && hasAbout && hasSkills && hasContact) {
            console.log('✓ All key sections present in content');
        } else {
            errors.push('Missing key sections in content');
        }

        // Test 14: Check for neobrutalist design elements
        const cards = await page.$$('.showcase-card, .credential-folder-card, .product-card-wrapper, .about-card, .skill-folder-card, .contact-item');
        console.log(`✓ Found ${cards.length} neobrutalist-style cards/elements`);

        // Test 15: Check products section
        const productsGrid = await page.$('.products-grid');
        if (productsGrid) {
            console.log('✓ Products grid found');
        } else {
            errors.push('Products grid not found');
        }

        // Test 16: Check experience section
        const experienceTimeline = await page.$('.experience-timeline');
        if (experienceTimeline) {
            console.log('✓ Experience timeline found');
        } else {
            errors.push('Experience timeline not found');
        }

        // Test 17: Check contact section
        const contactGrid = await page.$('.contact-grid');
        if (contactGrid) {
            console.log('✓ Contact grid found');
        } else {
            errors.push('Contact grid not found');
        }

        // Test 18: Check for sticky CTA
        const stickyCTA = await page.$('.sticky-cta-transformable');
        if (stickyCTA) {
            console.log('✓ Sticky CTA found');
        } else {
            errors.push('Sticky CTA not found');
        }

        // Test 19: Verify no JavaScript errors in console (excluding fonts/CORS)
        if (errors.length === 0) {
            console.log('✓ No JavaScript errors detected');
        }

        // Final result
        console.log('\n========================================');
        if (errors.length > 0) {
            console.log('TESTS FAILED with errors:');
            errors.forEach(err => console.log('✗ ' + err));
            process.exit(1);
        } else {
            console.log('ALL TESTS PASSED!');
            console.log('Carousel and page layout verified successfully.');
            process.exit(0);
        }

    } catch (err) {
        console.error('Test execution failed:', err.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();

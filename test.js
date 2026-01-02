const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });

    page.on('pageerror', err => {
        errors.push(err.message);
    });

    const filePath = 'file://' + path.resolve(__dirname, 'out/index.html');

    try {
        await page.goto(filePath);
        console.log('Page loaded successfully');

        // Check for navigation
        const nav = await page.$('.nav');
        if (nav) {
            console.log('Navigation found');
        } else {
            errors.push('Navigation not found');
        }

        // Check for press link in navigation
        const pressNavLink = await page.$('.nav-link[href="#press"]');
        if (pressNavLink) {
            console.log('Press link found in navigation');
        } else {
            errors.push('Press link not found in navigation');
        }

        // Check for hero section
        const hero = await page.$('.hero');
        if (hero) {
            console.log('Hero section found');
        } else {
            errors.push('Hero section not found');
        }

        // Check for main heading
        const mainHeading = await page.$('.hero-content h1');
        if (mainHeading) {
            const text = await mainHeading.textContent();
            console.log(`Main heading found: "${text.trim().substring(0, 50)}..."`);
        } else {
            errors.push('Main heading not found');
        }

        // Check for hero stats
        const heroStats = await page.$('.hero-stats');
        if (heroStats) {
            console.log('Hero stats found');
        } else {
            errors.push('Hero stats not found');
        }

        // Check for about section
        const aboutSection = await page.$('#about');
        if (aboutSection) {
            console.log('About section found');
        } else {
            errors.push('About section not found');
        }

        // Check for experience section
        const experienceSection = await page.$('#experience');
        if (experienceSection) {
            console.log('Experience section found');
        } else {
            errors.push('Experience section not found');
        }

        // Check for experience timeline items
        const experienceItems = await page.$$('.experience-item');
        console.log(`Found ${experienceItems.length} experience items`);

        // Check for skills section
        const skillsSection = await page.$('#skills');
        if (skillsSection) {
            console.log('Skills section found');
        } else {
            errors.push('Skills section not found');
        }

        // Check for skill categories
        const skillCategories = await page.$$('.skill-category');
        console.log(`Found ${skillCategories.length} skill categories`);

        // Check for certifications section
        const certsSection = await page.$('#certifications');
        if (certsSection) {
            console.log('Certifications section found');
        } else {
            errors.push('Certifications section not found');
        }

        // Check for certification cards
        const certCards = await page.$$('.cert-card');
        console.log(`Found ${certCards.length} certification cards`);

        // Check for press section
        const pressSection = await page.$('#press');
        if (pressSection) {
            console.log('Press & Media section found');
        } else {
            errors.push('Press & Media section not found');
        }

        // Check for press cards
        const pressCards = await page.$$('.press-card');
        console.log(`Found ${pressCards.length} press cards`);

        // Check for products section
        const productsSection = await page.$('#products');
        if (productsSection) {
            console.log('Products Contributed section found');
        } else {
            errors.push('Products Contributed section not found');
        }

        // Check for product cards
        const productCards = await page.$$('.product-card');
        console.log(`Found ${productCards.length} product cards`);

        // Check for products link in navigation
        const productsNavLink = await page.$('.nav-link[href="#products"]');
        if (productsNavLink) {
            console.log('Products link found in navigation');
        } else {
            errors.push('Products link not found in navigation');
        }

        // Check for contact section
        const contactSection = await page.$('#contact');
        if (contactSection) {
            console.log('Contact section found');
        } else {
            errors.push('Contact section not found');
        }

        // Check for contact info items
        const contactItems = await page.$$('.contact-item');
        console.log(`Found ${contactItems.length} contact items`);

        // Check for footer
        const footer = await page.$('.footer');
        if (footer) {
            console.log('Footer found');
        } else {
            errors.push('Footer not found');
        }

        // Verify content from master_data.json is present
        const pageContent = await page.content();
        if (pageContent.includes('Kanishka Namdeo')) {
            console.log('Name present in content');
        } else {
            errors.push('Name not found in content');
        }

        if (pageContent.includes('MoveInSync')) {
            console.log('MoveInSync experience present');
        } else {
            errors.push('MoveInSync experience not found');
        }

        if (pageContent.includes('Dubai')) {
            console.log('Location present');
        } else {
            errors.push('Location not found');
        }

        // Check for neobrutalist design elements - hard shadows
        const hardShadowElements = await page.$$('[class*="shadow"]');
        console.log(`Found ${hardShadowElements.length} shadow elements`);

        // Check for cards (neobrutalist design pattern)
        const cardElements = await page.$$('.about-card, .quick-info-card, .skill-category, .cert-card, .education-card, .hero-card');
        if (cardElements.length >= 10) {
            console.log(`Found ${cardElements.length} neobrutalist cards`);
        } else {
            errors.push(`Expected at least 10 cards, found ${cardElements.length}`);
        }

        // Check for stat items
        const statItems = await page.$$('.stat-item');
        console.log(`Found ${statItems.length} stat items`);

        // Check for experience skills tags
        const skillTags = await page.$$('.skill-tag');
        console.log(`Found ${skillTags.length} skill tags`);

        // Check for achievement badges
        const achievementBadges = await page.$$('.achievement-badge');
        console.log(`Found ${achievementBadges.length} achievement badges`);

        if (errors.length > 0) {
            console.log('\nTest failed with errors:');
            errors.forEach(err => console.log('- ' + err));
            process.exit(1);
        } else {
            console.log('\nAll tests passed! Professional neobrutalist layout verified.');
            process.exit(0);
        }

    } catch (err) {
        console.error('Test failed:', err.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();

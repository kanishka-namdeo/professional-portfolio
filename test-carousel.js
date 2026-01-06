const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3462;

// Simple static file server
const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'out', req.url === '/' ? 'index.html' : req.url);

  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
  };

  const contentType = contentTypes[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

async function runTest() {
  // Start server
  await new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      resolve();
    });
  });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to page
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded');

    // Scroll carousel into view
    await page.evaluate(() => {
      const carousel = document.querySelector('.showcase-carousel-container');
      if (carousel) {
        carousel.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    });
    console.log('Carousel scrolled into view');

    // Get initial transform
    const initialTransform = await page.evaluate(() => {
      const track = document.querySelector('.showcase-carousel');
      return track ? track.style.transform : null;
    });
    console.log('Initial transform:', initialTransform);

    // Get position info for event dispatching
    const positionInfo = await page.evaluate(() => {
      const container = document.querySelector('.showcase-carousel-container');
      const track = document.querySelector('.showcase-carousel');
      if (!container || !track) return null;

      const rect = container.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        height: rect.height,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2
      };
    });

    if (!positionInfo) {
      throw new Error('Could not find carousel elements');
    }

    console.log('Position info:', positionInfo);

    // Dispatch mousedown on the track
    await page.evaluate((pos) => {
      const track = document.querySelector('.showcase-carousel');
      if (!track) return;

      const mousedown = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: pos.left + 50,
        clientY: pos.centerY
      });
      track.dispatchEvent(mousedown);
      console.log('Mousedown dispatched');
    }, positionInfo);

    // Small delay for React state update
    await page.waitForTimeout(100);

    // Dispatch mousemove on window (move 100px right)
    await page.evaluate((pos) => {
      const mousemove = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: pos.left + 150,
        clientY: pos.centerY
      });
      window.dispatchEvent(mousemove);
      console.log('Mousemove dispatched');
    }, positionInfo);

    // Small delay for state update
    await page.waitForTimeout(100);

    // Check transform after drag
    const transformDuringDrag = await page.evaluate(() => {
      const track = document.querySelector('.showcase-carousel');
      return track ? track.style.transform : null;
    });
    console.log('Transform during drag:', transformDuringDrag);

    // Dispatch mouseup on window
    await page.evaluate((pos) => {
      const mouseup = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: pos.left + 150,
        clientY: pos.centerY
      });
      window.dispatchEvent(mouseup);
      console.log('Mouseup dispatched');
    }, positionInfo);

    // Small delay for snap animation
    await page.waitForTimeout(200);

    // Check final transform
    const finalTransform = await page.evaluate(() => {
      const track = document.querySelector('.showcase-carousel');
      return track ? track.style.transform : null;
    });
    console.log('Final transform:', finalTransform);

    // Results
    console.log('\n=== Test Results ===');
    console.log('Initial:', initialTransform);
    console.log('During drag:', transformDuringDrag);
    console.log('Final:', finalTransform);

    const dragWorked = transformDuringDrag && transformDuringDrag !== 'translateX(0px)' && transformDuringDrag !== '';
    if (dragWorked) {
      console.log('\n✓ SUCCESS: Drag functionality is working!');
      console.log('The transform changed during drag.');
    } else {
      console.log('\n✗ FAILED: Drag transform did not change');
    }

  } catch (err) {
    console.error('Test failed:', err.message);
  } finally {
    await browser.close();
    server.close();
  }
}

runTest();

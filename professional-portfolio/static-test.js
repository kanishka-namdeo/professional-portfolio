import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3456;

// Simple static file server
function createServer() {
  return http.createServer((req, res) => {
    let filePath = path.join('/workspace/professional-portfolio/out', req.url === '/' ? 'index.html' : req.url);
    
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
    
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
      } else {
        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
        res.end(content);
      }
    });
  });
}

async function testPortfolio() {
  const server = createServer();
  
  await new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      resolve();
    });
  });
  
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

  try {
    console.log('Navigating to http://localhost:3456...');
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle' });
    
    // Check page title
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Check for main content
    const content = await page.content();
    const hasContent = content.length > 1000;
    console.log(`Page has substantial content: ${hasContent}`);
    
    // Check for common sections
    const sections = ['Hero', 'About', 'Experience', 'Skills', 'Contact'];
    const foundSections = sections.filter(section => 
      content.toLowerCase().includes(section.toLowerCase())
    );
    console.log(`Found sections: ${foundSections.join(', ')}`);
    
    // Report errors
    if (errors.length > 0) {
      console.log('\nConsole Errors Found:');
      errors.forEach(err => console.log(`  - ${err}`));
    } else {
      console.log('\nNo console errors detected!');
    }
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
  }
}

testPortfolio();

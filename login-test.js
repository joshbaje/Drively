const puppeteer = require('puppeteer');
require('dotenv').config();

(async () => {
  try {
    // Launch the browser
    const browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      defaultViewport: null,
      args: ['--start-maximized'] // Open browser maximized
    });

    // Create a new page
    const page = await browser.newPage();

    // Navigate to the login page
    await page.goto('http://localhost:3000/Drively/#/login', { 
      waitUntil: 'networkidle0' 
    });

    // Wait for the email input field
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    // Enter email
    await page.type('input[type="email"]', 'bajejosh@gmail.com');

    // Enter password
    await page.type('input[type="password"]', 'password:1');

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation or authentication response
    await page.waitForNavigation({ 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });

    // Take a screenshot to verify login state
    await page.screenshot({ path: 'login-result.png' });

    // Optional: Check for elements that indicate successful login
    try {
      // Wait for an element that should only be visible after login
      await page.waitForSelector('.user-dashboard', { timeout: 5000 });
      console.log('Login successful! Redirected to dashboard.');
    } catch (dashboardError) {
      console.log('Dashboard not found. Checking for other login indicators.');
      
      // Take screenshot of current page for debugging
      await page.screenshot({ path: 'login-debug.png' });

      // Check for error messages
      const errorElements = await page.$$('.error-message');
      if (errorElements.length > 0) {
        const errorTexts = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('.error-message'))
            .map(el => el.textContent);
        });
        console.error('Login Error Messages:', errorTexts);
      }
    }

    // Optional: Log current URL
    console.log('Current URL:', await page.url());

    // Optional: Get page content for debugging
    const pageContent = await page.content();
    console.log('Page Content Length:', pageContent.length);

    // Close the browser
    await browser.close();

  } catch (error) {
    console.error('Login test failed:', error);
    
    // In case of unhandled error, take a screenshot
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.screenshot({ path: 'error-screenshot.png' });
    await browser.close();
  }
})();
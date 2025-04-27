// Cloudflare Worker-compatible screenshot function
import puppeteer from '@cloudflare/puppeteer';

/**
 * Take a screenshot of a URL using Cloudflare Workers Browser Rendering (Puppeteer API).
 * @param {string} url - The URL to screenshot.
 * @param {object} [options] - Screenshot options (see Puppeteer docs: https://pptr.dev/api/puppeteer.pagescreenshotoptions/)
 * @returns {Promise<Uint8Array>} - Screenshot image bytes (PNG by default)
 */
export async function takeScreenshot(url, options = {}) {
  if (!url) {
    throw new Error('Missing required parameter: url');
  }

  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // You can customize options, e.g. { fullPage: true, type: 'jpeg' }
    const screenshot = await page.screenshot(options);
    return screenshot;
  } catch (err) {
    // Log error for observability and return a generic error message
    console.error('Screenshot failed:', err);
    throw new Error('Failed to capture screenshot. The URL may be unreachable or invalid, or browser rendering failed.');
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        // Log but do not throw
        console.error('Failed to close browser:', closeErr);
      }
    }
  }
}

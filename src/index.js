// Cloudflare Worker-compatible screenshot function
import puppeteer from '@cloudflare/puppeteer';

/**
 * Flareshot screenshot client for Cloudflare Workers
 */
export class Flareshot {
  /**
   * @param {Object} binding - The browser binding from Cloudflare Worker env (e.g., env.BROWSER)
   */
  constructor(binding) {
    if (!binding) throw new Error('Missing required browser binding');
    this.binding = binding;
  }

  /**
   * Take a screenshot of a URL.
   * @param {string} url - The URL to screenshot.
   * @param {object} [options] - Screenshot options (see Puppeteer docs)
   * @returns {Promise<Uint8Array>} - Screenshot image bytes (PNG by default)
   */
  async takeScreenshot(url, options = {}) {
    if (!url) {
      throw new Error('Missing required parameter: url');
    }
    let browser;
    try {
      browser = await puppeteer.launch(this.binding);
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
      const screenshot = await page.screenshot(options);
      return screenshot;
    } catch (err) {
      console.error('Screenshot failed:', err);
      throw new Error('Failed to capture screenshot. The URL may be unreachable or invalid, or browser rendering failed.');
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (closeErr) {
          console.error('Failed to close browser:', closeErr);
        }
      }
    }
  }
}

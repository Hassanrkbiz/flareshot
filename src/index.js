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

      // Optionally set viewport if width or height provided
      if (options.width || options.height) {
        await page.setViewport({
          width: options.width || 800, // fallback default if only height is provided
          height: options.height || 600, // fallback default if only width is provided
        });
      }

      await page.goto(url, { waitUntil: 'networkidle2' });

      // Prepare screenshot options
      const screenshotOptions = { ...options };
      // Remove width/height from screenshotOptions, as they are not valid for page.screenshot
      delete screenshotOptions.width;
      delete screenshotOptions.height;

      // Handle quality: only valid for jpeg
      if (screenshotOptions.quality !== undefined) {
        screenshotOptions.type = 'jpeg';
        // Clamp quality between 0 and 100
        screenshotOptions.quality = Math.max(0, Math.min(100, Number(screenshotOptions.quality)));
      }

      const screenshot = await page.screenshot(screenshotOptions);
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

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

      // Device emulation presets
      const devices = {
        mobile: {
          viewport: { width: 375, height: 812, isMobile: true, deviceScaleFactor: 2 },
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
        },
        tablet: {
          viewport: { width: 768, height: 1024, isMobile: true, deviceScaleFactor: 2 },
          userAgent: 'Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
        },
        desktop: {
          viewport: { width: 1366, height: 768, isMobile: false, deviceScaleFactor: 1 },
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      };

      // Set device emulation if requested
      if (options.device && devices[options.device]) {
        const device = devices[options.device];
        await page.setViewport(device.viewport);
        await page.setUserAgent(device.userAgent);
      } else if (options.width || options.height) {
        // Optionally set viewport if width or height provided
        await page.setViewport({
          width: options.width || 800, // fallback default if only height is provided
          height: options.height || 600, // fallback default if only width is provided
        });
      }

      await page.goto(url, { waitUntil: 'networkidle2' });

      // Add delay support (max 10s)
      const delay = Math.min(Number(options.delay) || 0, 10);
      if (delay > 0) {
        // Use standard JS sleep instead of page.waitForTimeout for Cloudflare compatibility
        await new Promise(res => setTimeout(res, delay * 1000));
      }

      // Prepare screenshot options
      const screenshotOptions = { ...options };
      // Remove width/height/device/delay from screenshotOptions, as they are not valid for page.screenshot
      delete screenshotOptions.width;
      delete screenshotOptions.height;
      delete screenshotOptions.device;
      delete screenshotOptions.delay;

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

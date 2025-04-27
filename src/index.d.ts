export interface ScreenshotOptions {
  /** Screenshot options as per Puppeteer: https://pptr.dev/api/puppeteer.pagescreenshotoptions/ */
  [key: string]: any;
}

/**
 * Flareshot screenshot client for Cloudflare Workers
 */
export class Flareshot {
  /**
   * @param binding The browser binding from Cloudflare Worker env (e.g., env.BROWSER)
   */
  constructor(binding: any);

  /**
   * Take a screenshot of a URL.
   * @param url The URL to screenshot.
   * @param options Screenshot options (see Puppeteer docs)
   * @returns Screenshot image bytes (PNG by default)
   */
  takeScreenshot(url: string, options?: ScreenshotOptions): Promise<Uint8Array>;
}

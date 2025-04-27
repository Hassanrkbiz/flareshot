export interface ScreenshotOptions {
  /** Screenshot options as per Puppeteer: https://pptr.dev/api/puppeteer.pagescreenshotoptions/ */
  [key: string]: any;
}

/**
 * Take a screenshot of a URL using Cloudflare Workers Browser Rendering (Puppeteer API).
 * @param url The URL to screenshot.
 * @param options Screenshot options (see Puppeteer docs)
 * @returns Screenshot image bytes (PNG by default)
 */
export function takeScreenshot(url: string, options?: ScreenshotOptions): Promise<Uint8Array>;

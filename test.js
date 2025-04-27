import { takeScreenshot } from './src/index.js';

(async () => {
  try {
    const image = await takeScreenshot('https://example.com', { fullPage: true });
    // In Cloudflare Workers, you would return the image as a Response
    // Example:
    // return new Response(image, { headers: { 'Content-Type': 'image/png' } });
    console.log('Screenshot captured (binary data, not saved to disk in Worker environment)');
  } catch (err) {
    console.error('Screenshot failed:', err.message);
  }
})();

import { Flareshot } from './src/index.js';

// Simulate a Cloudflare Worker binding for local test (replace with env.BROWSER in Worker)
const fakeBinding = {}; // Replace with actual binding in production

(async () => {
  try {
    const client = new Flareshot(fakeBinding);
    const image = await client.takeScreenshot('https://example.com', {
      fullPage: true,
      width: 1200, // optional
      height: 800, // optional
      type: 'jpeg',
      quality: 85, // optional, JPEG only, 0-100
    });
    // In Cloudflare Workers, return as Response
    // return new Response(image, { headers: { 'Content-Type': 'image/jpeg' } });
    console.log('Screenshot captured (binary data, not saved to disk in Worker environment)');
  } catch (err) {
    console.error('Screenshot failed:', err.message);
  }
})();

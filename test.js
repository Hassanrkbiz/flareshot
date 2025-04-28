import { Flareshot } from './src/index.js';

// Simulate a Cloudflare Worker binding for local test (replace with env.BROWSER in Worker)
const fakeBinding = {}; // Replace with actual binding in production

(async () => {
  try {
    const client = new Flareshot(fakeBinding);
    // Desktop screenshot with 2s delay
    const desktopImg = await client.takeScreenshot('https://example.com', {
      device: 'desktop',
      delay: 2,
      fullPage: true,
      type: 'jpeg',
      quality: 85,
    });
    console.log('Desktop screenshot captured (binary data)');

    // Mobile screenshot with 5s delay
    const mobileImg = await client.takeScreenshot('https://example.com', {
      device: 'mobile',
      delay: 5,
      fullPage: true,
      type: 'png',
    });
    console.log('Mobile screenshot captured (binary data)');

    // Tablet screenshot with 0 delay
    const tabletImg = await client.takeScreenshot('https://example.com', {
      device: 'tablet',
      delay: 0,
      fullPage: true,
      type: 'jpeg',
      quality: 90,
    });
    console.log('Tablet screenshot captured (binary data)');

    // In Cloudflare Workers, return as Response
    // return new Response(image, { headers: { 'Content-Type': 'image/jpeg' } });
  } catch (err) {
    console.error('Screenshot failed:', err.message);
  }
})();

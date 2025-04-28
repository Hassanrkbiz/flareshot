# flareshot

Take screenshots of URLs using Cloudflare Workers Browser Rendering (Puppeteer API).

## Requirements
- Cloudflare Worker with Browser Rendering enabled (available for free users)

## Installation

```sh
npm install flareshot
```

## Usage (in a Worker)

```js
import { Flareshot } from 'flareshot';

// In your Cloudflare Worker handler:
export default {
  async fetch(request, env) {
    const client = new Flareshot(env.BROWSER);
    const image = await client.takeScreenshot('https://example.com', {
      fullPage: true,
      // Device emulation: choose one of 'desktop', 'tablet', 'mobile'
      device: 'mobile', // optional
      // Delay before screenshot (in seconds, max 10)
      delay: 3, // optional
      // You can also still use width/height instead of device
      // width: 1200,
      // height: 800,
      type: 'jpeg', // optional, default is PNG
      quality: 90, // optional, JPEG only, 0-100
    });
    return new Response(image, { headers: { 'Content-Type': 'image/png' } });
  }
}
```

## Options
- `url`: URL to screenshot
- `binding`: The browser binding from Cloudflare Worker environment (e.g., `env.BROWSER`)
- `options`: (optional) Additional options for Puppeteer screenshot (see Puppeteer docs)
  - `device` (optional): `'mobile'`, `'tablet'`, or `'desktop'` for automatic viewport and user agent emulation
  - `delay` (optional): Delay in seconds before screenshot (max 10)
  - `width` (optional): Set viewport width (overrides device)
  - `height` (optional): Set viewport height (overrides device)
  - `quality` (optional, JPEG only): JPEG quality (0-100, clamped)

### Example: Desktop, Tablet, Mobile Screenshots

```js
const desktopImg = await client.takeScreenshot('https://example.com', { device: 'desktop', delay: 2 });
const tabletImg = await client.takeScreenshot('https://example.com', { device: 'tablet', delay: 0 });
const mobileImg = await client.takeScreenshot('https://example.com', { device: 'mobile', delay: 5 });
```

## License
MIT

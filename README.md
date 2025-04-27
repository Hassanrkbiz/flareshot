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
      width: 1200, // optional
      height: 800, // optional
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
  - `width` (optional): Set viewport width
  - `height` (optional): Set viewport height
  - `quality` (optional, JPEG only): JPEG quality (0-100, clamped)

## License
MIT

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
    const image = await client.takeScreenshot('https://example.com', { fullPage: true });
    return new Response(image, { headers: { 'Content-Type': 'image/png' } });
  }
}
```

## Usage (local test, Node.js)

> This package is intended for Cloudflare Workers, but you can test the API locally (see `test.js`).

```js
const { takeScreenshot } = require('flareshot');
const fs = require('fs');

(async () => {
  const buffer = await takeScreenshot('https://example.com', {
    fullPage: true,
    type: 'jpeg',
    // any Puppeteer screenshot options
  });
  fs.writeFileSync('screenshot.png', buffer);
})();
```

## Options
- `url`: URL to screenshot
- `binding`: The browser binding from Cloudflare Worker environment (e.g., `env.BROWSER`)
- `options`: (optional) Additional options for Puppeteer screenshot (see Puppeteer docs)

## License
MIT

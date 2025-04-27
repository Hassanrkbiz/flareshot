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
import { takeScreenshot } from 'flareshot';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url).searchParams.get('url');
    if (!url) return new Response('Missing url param', { status: 400 });
    const image = await takeScreenshot(url, { fullPage: true });
    return new Response(image, {
      headers: { 'Content-Type': 'image/png' }
    });
  }
};
```

## Usage (local test, Node.js)

> This package is intended for Cloudflare Workers, but you can test the API locally (see `test.js`).

```js
const { takeScreenshot } = require('flareshot');
const fs = require('fs');

(async () => {
  const buffer = await takeScreenshot('https://example.com', {
    renderOptions: {
      // width: 1280,
      // height: 800,
      // full_page: true
    }
  });
  fs.writeFileSync('screenshot.png', buffer);
})();
```

## Options
- `url`: URL to screenshot
- `renderOptions`: (optional) Additional options for rendering (see Cloudflare docs)

## License
MIT

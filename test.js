import { takeScreenshot } from './src/index.js';
import fs from 'fs';

(async () => {
  try {
    const image = await takeScreenshot('https://example.com', { fullPage: true });
    fs.writeFileSync('screenshot.png', image);
    console.log('Screenshot saved as screenshot.png');
  } catch (err) {
    console.error('Screenshot failed:', err.message);
  }
})();

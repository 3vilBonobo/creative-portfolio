import base from '../vite.config.js';
import { mergeConfig } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Local QA evidence only. This config is never used by the production build.
export default mergeConfig(base, {
  plugins: [{
    name: 'floor03-local-evidence',
    configureServer(server) {
      server.middlewares.use('/__floor03-evidence', async (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
        try {
          let body = '';
          for await (const chunk of req) {
            body += chunk;
            if (body.length > 8_000_000) throw new Error('Evidence too large');
          }
          const { filename, data } = JSON.parse(body);
          if (!/^[a-z0-9-]+\.jpg$/.test(filename)) throw new Error('Invalid evidence filename');
          const bytes = Buffer.from(data, 'base64');
          if (bytes[0] !== 255 || bytes[1] !== 216) throw new Error('Expected browser JPEG');
          const directory = resolve('art-production/staging/floor-03-about/v004/browser');
          await mkdir(directory, { recursive: true });
          await writeFile(resolve(directory, filename), bytes, { flag: 'wx' });
          res.end(`Saved ${filename}`);
        } catch (error) {
          res.statusCode = 400;
          res.end(String(error));
        }
      });
    },
  }],
});

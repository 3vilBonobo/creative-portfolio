import { createServer } from 'vite';
// A development preview without HMR keeps parallel floor edits from resetting
// the catalogue during orientation tests. No application configuration changes.
const server = await createServer({ server: { port: 5175, strictPort: true, watch: null, hmr: false } });
await server.listen();
server.printUrls();

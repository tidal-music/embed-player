/* eslint-env node, esm */
import { createServer } from 'http';

import app from './server.js';

const server = createServer(app);
let currentApp = app;

server.listen(3000);

// eslint-disable-next-line no-console
console.log(
  'Embed is running at port :3000. Test page available at http://localhost:3000/test',
);

// @ts-expect-error - HMR
if (import.meta.hot) {
  // @ts-expect-error - HMR
  import.meta.hot.accept('./server', () => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
}

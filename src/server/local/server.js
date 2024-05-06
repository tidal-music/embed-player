/*

  Please note that this is only a local express server for development to
  mimic the lambda. To add logic to the SSR, add it to hander.js, which is used by this
  local server and the AWS Lambda file.

  Handler.js is the agnostic part of the machine. :)

 */

import express from 'express';

/* eslint-disable import/no-unresolved */
// @ts-expect-error - You need to build before you can run!
import { embed as embedHandler } from '../../../dist/server/handler.js';
/* eslint-enable import/no-unresolved */

const app = express();

// isOnLambda = mimicking prod locally, use dist, else src.
const s3Folder = 'dist/client';

app.use('/local-embed-resources/', express.static(s3Folder));

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/', async (req, res) => {
  const embedResult = await embedHandler({
    queryStringParameters: req.query,
  });

  res.send(embedResult.body);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/:type/:id?', async (req, res) => {
  const embedResult = await embedHandler({
    pathParameters: req.params,
    queryStringParameters: req.query,
  });

  res
    .set(embedResult.headers)
    .status(embedResult.statusCode)
    .send(embedResult.body);
});

export default app;

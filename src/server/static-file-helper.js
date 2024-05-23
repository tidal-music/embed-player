// @ts-expect-error - TS cannot find it?
import hashTable from '../../dist/hash-table.json' assert { type: 'json' };

/**
 * True when testing prod locally, false if dev env.
 */
export const isOnLambda =
  process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV;

export const isOnLambdaProd = process.env.AWS_ENV
  ? process.env.AWS_ENV.indexOf('prod') !== -1
  : false;
const isOnLambdaStage = process.env.AWS_ENV
  ? process.env.AWS_ENV.indexOf('stage') !== -1
  : false;

/**
 * True for real production, false for local prod and dev.
 */
export const isLambdaForSure =
  isOnLambda && (isOnLambdaProd || isOnLambdaStage);

/**
 * Gives the link to front-end resources.
 * @param {string} srcFileName
 */

export function getStaticFileLink(srcFileName) {
  const distFilePath = hashTable[srcFileName];

  if (isLambdaForSure && distFilePath) {
    return `/embed-resources/${distFilePath}`;
  }

  if (!distFilePath) {
    console.error('Missing from hash table:', {
      distFilePath,
      srcFileName,
    });
  }

  return isOnLambda
    ? `/local-embed-resources/${distFilePath}`
    : `/local-embed-resources/${srcFileName}`;
}

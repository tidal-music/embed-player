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

const s3BucketName = isOnLambdaProd ? '' : '.stage';
/**
 * Gives link to resource on S3 if on Lambda, if locally, uses /s3 endpoint.
 * @param {string} srcFileName
 */

export function getS3Link(srcFileName) {
  const distFilePath = hashTable[srcFileName];

  if (isLambdaForSure && distFilePath) {
    return `https://embed${s3BucketName}.tidal.com/embed-resources/${distFilePath}`;
  }

  if (!distFilePath) {
    console.error('Missing from hash table:', {
      distFilePath,
      srcFileName,
    });
  }

  return isOnLambda ? `/local-embed-resources/${distFilePath}` : `/local-embed-resources/${srcFileName}`;
}

/* eslint-env node */
import { renderEmbed, renderError } from './render.js';
import { isOnLambdaProd } from './static-file-helper.js';
import { generateHTML as generateTestPageHTML } from './test-page/handler.js';

// Private function to print object
/*
function printObj (o, indent) {
  let str = '';
  let p;

  for (p in o) {
    if (o.hasOwnProperty(p)) {
      str += indent + '"' + p + '": ';
      if (typeof o[p] === 'string' || typeof o[p] === 'number') {
        str += '"' + o[p] + '"';
      } else {
        str += '{<br />' + printObj(o[p], indent + '  ') + '}';
      }
      str += ',<br />';
    }
  }

  return str;
}
*/

/**
 * @typedef {'gridify'|'classic'} Layout
 */

/** @typedef HandlerOptions
 * @prop {string} itemId
 * @prop {string} country
 * @prop {boolean} disableAnalytics
 * @prop {Layout} layout
 * @prop {boolean} coverInitially
 */

async function getData(endpoint, country, xForwardedFor) {
  const url = new URL(`https://api.tidal.com/v1/${endpoint}`);

  if (endpoint.includes('/items')) {
    url.searchParams.append('replace', 'true');
    url.searchParams.append('limit', '50');
  }

  url.searchParams.append('countryCode', country);

  if (process.env.EMBED_API_TOKEN) {
    url.searchParams.append('token', process.env.EMBED_API_TOKEN);
  } else {
    console.error(
      'You are running without setting an EMBED_API_TOKEN variable.',
    );
  }

  const headers = new Headers();

  if (xForwardedFor) {
    headers.append('X-Forwarded-For', xForwardedFor);
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    throw new Error(`Response is not OK (${response.status}).`);
  }

  if (response.status === 204) {
    return undefined;
  }

  const json = await response.json();

  if ('status' in json && json.status === 404) {
    throw new Error('404');
  }

  return json;
}

function respondWith(body, statusCode = 200) {
  const cacheTime = isOnLambdaProd ? 300 : 60;

  return {
    body,
    headers: {
      'Cache-Control': `max-age=${cacheTime}`,
      'Content-Type': 'text/html',
    },
    statusCode,
  };
}

function getModulesFromDynamicPage(dynamicPageResponse, type) {
  const allModules = dynamicPageResponse.rows.map(row => row.modules).flat();

  return allModules.filter(m => m.type === type);
}

/**
 * @param {HandlerOptions} options
 */
async function mix(options) {
  const { country, itemId } = options;

  const response = await getData(
    `pages/mix?mixId=${itemId}&deviceType=BROWSER`,
    country,
  );

  const embedItem = getModulesFromDynamicPage(response, 'MIX_HEADER')[0].mix;
  const mediaItems = getModulesFromDynamicPage(response, 'TRACK_LIST')[0]
    .pagedList;

  return renderEmbed({
    ...options,
    embedItem,
    itemType: 'mix',
    mediaItems,
  });
}

/**
 * @param {HandlerOptions} options
 */
async function album(options) {
  const { country, itemId } = options;

  const [embedItem, mediaItems] = await Promise.all([
    getData(`albums/${itemId}`, country),
    getData(`albums/${itemId}/items`, country),
  ]);

  return renderEmbed({
    ...options,
    embedItem,
    itemType: 'albums',
    mediaItems,
  });
}

/**
 * @param {HandlerOptions & { renderThumbnails: boolean }} options
 */
async function playlist(options) {
  const { country, itemId } = options;

  const [embedItem, mediaItems] = await Promise.all([
    getData(`playlists/${itemId}`, country),
    getData(`playlists/${itemId}/items`, country),
  ]);

  return renderEmbed({
    ...options,
    embedItem,
    itemType: 'playlists',
    mediaItems,
  });
}

/**
 * @param {string} itemId
 * @param {string} country
 */
async function getVideoData(itemId, country) {
  const data = await getData(`videos/${itemId}`, country);

  let streamType = data.type === 'Live Stream' ? 'LIVE' : 'ON_DEMAND';

  let videoId = data.id;

  const playbackInfo = await getData(
    `videos/${itemId}/playbackinfoprepaywall/v4?videoquality=HIGH&assetpresentation=FULL`,
    country,
  );

  const { streamType: _streamType, videoId: _videoId } = playbackInfo;

  streamType = _streamType;
  videoId = _videoId;

  return Object.assign({}, data, { id: videoId, streamType });
}

/**
 * @param {HandlerOptions & { xForwardedFor: string }} options
 */
async function video(options) {
  const { country, itemId, xForwardedFor } = options;

  const embedItem = await getVideoData(itemId, country);
  const possiblyUpdatedItemId = embedItem.id; // If replaced
  const embedConfig = await getData(
    `embed/${possiblyUpdatedItemId}`,
    country,
    xForwardedFor,
  );
  const limitedLiveStreamPreview = Boolean(
    embedConfig?.previewEnabled && embedConfig.previewTimer,
  );

  return renderEmbed({
    ...options,
    country,
    embedItem,
    itemId: possiblyUpdatedItemId,
    itemType: 'videos',
    layout: 'gridify', // Videos can never be classic.
    limitedLiveStreamPreview,
  });
}

/**
 * @param {HandlerOptions} options
 */
async function track(options) {
  const { country, itemId } = options;

  const embedItem = await getData(`tracks/${itemId}`, country);

  return renderEmbed({
    ...options,
    embedItem,
    itemType: 'tracks',
  });
}

function redirectWimpEmbed(queryParams) {
  let { type } = queryParams;
  const cacheTime = isOnLambdaProd ? 300 : 60;

  switch (type) {
    case 'a':
      type = 'albums';
      break;
    case 'p':
      type = 'playlists';
      break;
    case 't':
      type = 'tracks';
      break;
    default:
      return respondWith('Invalid WiMP embed type:' + type, 501);
  }

  const response = {
    body: null,
    headers: {
      'Cache-Control': `max-age=${cacheTime}`,
      Location: `https://embed.tidal.com/${type}/${queryParams.id}`,
    },
    statusCode: 301,
  };

  return response;
}

const rootRouteHTML = `
  <blockquote style="margin-top:1rem">
    <p>
      <em>
        It's me, hi 👋, I'm the problem, it's me 😈
      </em>
    </p>
  </blockquote>
  <cite>– <a href="https://tidal.com/artist/3557299"  target="_blank">Taylor Swift</a>
  <br><br>
  <iframe src="/tracks/255207225" width="500" height="122" frameborder="0"></iframe>
  <br><br>
  <p>
    You're looking for the test page. <a href="/test"  target="_blank">It's here.</a>
  </p>
`;

// The Lambda entry point for embed player
export const embed = async event => {
  let country = 'US';

  let xForwardedFor;

  let responseBody = rootRouteHTML;

  let responseHTTPCode = 200;

  if (event.headers?.['CloudFront-Viewer-Country']) {
    country = event.headers['CloudFront-Viewer-Country'];
  }

  if (event.headers?.['CloudFront-Viewer-Country']) {
    xForwardedFor = event.headers['X-Forwarded-For'];
  }

  /*
  country =
    event.queryStringParameters && event.queryStringParameters.debugCountryCode ?
      event.queryStringParameters.debugCountryCode :
      country;
  */

  const renderThumbnails = Boolean(event.queryStringParameters?.thumbnails);
  const disableAnalytics = Boolean(
    event.queryStringParameters?.disableAnalytics,
  );
  const coverInitially = Boolean(event.queryStringParameters?.coverInitially);

  const layout =
    event.queryStringParameters &&
    event.queryStringParameters.layout === 'gridify'
      ? 'gridify'
      : 'classic';

  if (event.pathParameters) {
    const itemId = event.pathParameters.id;

    try {
      switch (event.pathParameters.type) {
        case 'albums':
          responseBody = await album({
            country,
            coverInitially,
            disableAnalytics,
            itemId,
            layout,
          });
          break;
        case 'embedded':
          return redirectWimpEmbed(event.queryStringParameters);
        case 'mix':
          responseBody = await mix({
            country,
            coverInitially,
            disableAnalytics,
            itemId,
            layout,
          });
          break;
        case 'playlists':
          responseBody = await playlist({
            country,
            coverInitially,
            disableAnalytics,
            itemId,
            layout,
            renderThumbnails,
          });
          break;
        case 'test':
          responseBody = generateTestPageHTML(event.queryStringParameters);
          break;
        case 'tracks':
          responseBody = await track({
            country,
            coverInitially,
            disableAnalytics,
            itemId,
            layout,
          });
          break;
        case 'videos':
          responseBody = await video({
            country,
            coverInitially: false,
            disableAnalytics,
            itemId,
            layout: 'gridify',
            xForwardedFor,
          });
          break;
        default:
          responseBody = 'Invalid embed type:' + event.pathParameters.type;
          break;
      }
    } catch (error) {
      // console.error(error);
      responseBody = renderError();
      responseHTTPCode = error.status;
    }
  }

  return respondWith(responseBody, responseHTTPCode);
};

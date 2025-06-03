/* eslint-env node */
import { readFile } from 'fs/promises';
import { join } from 'path';

// Give syntax highlighting with Lit IDE plugins for template strings.
const html = String.raw;

const frontEndJavaScript = await readFile(
  join(import.meta.dirname, 'main.js'),
  'utf-8',
);
const frontEndStyles = await readFile(
  join(import.meta.dirname, 'styles.css'),
  'utf-8',
);

function getRandomTrackID() {
  const dankIds = [
    1766030, // Crazy in Love - Beyoncé, JAY-Z
    264898197, // Ecstasy of Soul
    121938135, // Ludwig Göransson - The Mandalorian
    267449398, // Hooja Älven
    32033408, // Muminpappan och havet
  ];

  return dankIds[Math.floor(Math.random() * dankIds.length)];
}

function getRandomVideoID() {
  const dankIds = [
    71196108, // dafty punky feely coming
    80124794, // MGMT
    348988463,
    64065078, // darling darling
    26136887, // Crazy In Love - Beyoncé, JAY-Z
    64575017, // It Must Have Been Love - Roxette
    26196180, // All I wan't for chistmas is you - Mariah Carey (4:3 aspect)
  ];

  return dankIds[Math.floor(Math.random() * dankIds.length)];
}

function getRandomMixID() {
  const dankIds = [
    '00893bafbc41a9d6a7282dd3fb9849', // Jeremy's september 2020 mix
    '010fb744f46d79884fa6c875a2a11d', // Jeremy's all time most listened mix
    '002b80b44bca5e9b276c00ce264efb', // Jeremy's My Mix #3 2020-10-05
  ];

  return dankIds[Math.floor(Math.random() * dankIds.length)];
}

function getRandomAlbumID() {
  const dankIds = [
    159932869, // Iron Maiden - Nights of the Dead (Master)
    68638834, // Green Day - American Idiot (Master with some explicit tracks)
    1550545, // Discovery - Daft Punk
    160581228, // Olafur Arnalds - some kind of peace (Master)
    158853192, // Asassins Creed Valhalla
    8335044, // Eine kleine Nachtmusik - Mozart (Long ass names)
    49617266, // Rajala - TOSAB
    1844956, // Basshunter (Master)
    33130772, // The Celtic Collection 2
    77625021, // Grease
  ];

  return dankIds[Math.floor(Math.random() * dankIds.length)];
}

function getRandomVideoPlaylistID() {
  const dankIds = [
    '90f29031-4b86-459d-a22b-c438cee75435',
    '2e763788-b816-4011-a0c6-7cd9f08e5e6c',
    '5ebe3635-f2ad-4382-9d41-53d15548a5a0',
  ];

  return dankIds[Math.floor(Math.random() * dankIds.length)];
}

function getRandomPlaylistID() {
  const dankIds = [
    'b0d95b5e-7c4f-4dae-b042-b8c6228c2ba4', // Pop Life (Editorial)
    '82d162e7-c491-4695-8354-d1da6be19832', // Real Love (Editorial)
    'c989958b-c60a-4bdc-b58f-25236c6c1e8a', // Top 100 Norway (Editorial)
    '0215d466-9f41-45bd-8c7b-75166fffb175', // Jeremy's "Chill and cozy" Playlist
    '72d9ce98-87ae-4eea-b470-b72b2f543db0', // Avicii Essentials
    'ca2faacb-7acf-4e64-a504-6f4586db19fb', // TIDAL Rising Norge (Editorial)
    '1f15b248-609b-45cd-97c9-dd13e6c94342', //
    'b87651e8-5270-4e5a-827c-509514439aef',
  ];

  return dankIds[Math.floor(Math.random() * dankIds.length)];
}

export const generateHTML = queryParameters => {
  // Is running as a Lambda
  // const isProd = process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV;
  const embedBaseUrl = '';
  const oldWimp = queryParameters ? queryParameters.oldWimp : false;

  const previewEmbedFormats = html`
    <article>
      <details>
        <summary>
          <h2>Albums</h2>
        </summary>

        <h5 id="album-example-1">Album Classic - 444x122</h5>
        <iframe
          src="${embedBaseUrl}/albums/${getRandomAlbumID()}"
          loading="lazy"
          width="444"
          height="122"
        ></iframe>

        <h5 id="album-example-2">Album Grid - 360x360</h5>
        <iframe
          src="${embedBaseUrl}/albums/${getRandomAlbumID()}?layout=gridify"
          loading="lazy"
          width="360"
          height="360"
        ></iframe>

        <h5 id="album-example-3">Album Classic - 360x360</h5>
        <iframe
          src="${embedBaseUrl}/albums/${getRandomAlbumID()}"
          loading="lazy"
          width="360"
          height="360"
        ></iframe>

        <h5 id="album-example-4">Album Classic with list - 600x700</h5>
        <iframe
          src="${embedBaseUrl}/albums/${getRandomAlbumID()}"
          loading="lazy"
          width="600"
          height="700"
        ></iframe>

        <h5 id="album-example-5">Album with list - 800x300</h5>
        <iframe
          src="${embedBaseUrl}/albums/${getRandomAlbumID()}"
          loading="lazy"
          width="850"
          height="300"
        ></iframe>

        <h5 id="album-example-5">Album with list - 800x300 (w explicits)</h5>
        <iframe
          src="${embedBaseUrl}/albums/177723939"
          loading="lazy"
          width="850"
          height="300"
        ></iframe>

        <h5 id="album-example-7">Cover slide to classic + list below</h5>
        <iframe
          src="${embedBaseUrl}/albums/${getRandomAlbumID()}?coverInitially=true"
          loading="lazy"
          width="360"
          height="360"
        ></iframe>

        <h5 id="album-example-4">
          Album Classic with list - 600x700 - Many artists
        </h5>
        <iframe
          src="${embedBaseUrl}/albums/353983134?coverInitially=true"
          loading="lazy"
          width="600"
          height="700"
        ></iframe>
      </details>
    </article>

    <article style="background-color: antiquewhite;">
      <details>
        <summary>
          <h2>Tracks</h2>
        </summary>

        <h5 id="track-example-1">Track Classic - 348x122</h5>
        <iframe
          src="${embedBaseUrl}/tracks/${getRandomTrackID()}"
          loading="lazy"
          width="348"
          height="122"
        ></iframe>

        <h5 id="track-example-2">Track Classic - 400x96</h5>
        <iframe
          src="${embedBaseUrl}/tracks/${getRandomTrackID()}"
          loading="lazy"
          width="400"
          height="96"
        ></iframe>

        <h5 id="track-example-3">Track Classic - 500x122 (force light mode)</h5>
        <iframe
          src="${embedBaseUrl}/tracks/${getRandomTrackID()}"
          style="color-scheme: light;"
          loading="lazy"
          width="500"
          height="122"
        ></iframe>

        <h5 id="track-example-4">Track Classic - 600x122 (force dark mode)</h5>
        <iframe
          src="${embedBaseUrl}/tracks/${getRandomTrackID()}"
          style="color-scheme: dark;"
          loading="lazy"
          width="600"
          height="122"
        ></iframe>

        <h5 id="track-example-5">Track Grid - 200x200</h5>
        <iframe
          src="${embedBaseUrl}/tracks/${getRandomTrackID()}?layout=gridify"
          loading="lazy"
          width="200"
          height="200"
        ></iframe>

        <h5 id="track-example-6">Track Grid - 350x350</h5>
        <iframe
          src="${embedBaseUrl}/tracks/${getRandomTrackID()}?layout=gridify"
          loading="lazy"
          width="350"
          height="350"
        ></iframe>

        <h5 id="track-example-7">Track Grid - 550x550</h5>
        <iframe
          src="${embedBaseUrl}/tracks/${getRandomTrackID()}?layout=gridify"
          loading="lazy"
          width="550"
          height="550"
        ></iframe>
      </details>
    </article>

    <article>
      <details>
        <summary>
          <h2>On-Demand Videos</h2>
        </summary>

        <h5 id="video-example-1">Video small - 500x282</h5>
        <iframe
          src="${embedBaseUrl}/videos/${getRandomVideoID()}"
          loading="lazy"
          width="500"
          height="282"
        ></iframe>

        <h5 id="video-example-3">Video big - 720x406</h5>
        <iframe
          src="${embedBaseUrl}/videos/${getRandomVideoID()}"
          loading="lazy"
          width="720"
          height="406"
        ></iframe>

        <h5 id="video-exlusive-badge-example">Video Exlusive Badge Example</h5>
        <iframe
          src="${embedBaseUrl}/videos/90570909"
          loading="lazy"
          width="720"
          height="406"
        ></iframe>
      </details>
    </article>

    <article>
      <details>
        <summary>
          <h2>Playlists</h2>
        </summary>

        <h5 id="playlist-example-1">Classic - 444x122</h5>
        <iframe
          src="${embedBaseUrl}/playlists/${getRandomPlaylistID()}"
          loading="lazy"
          width="444"
          height="122"
        ></iframe>

        <h5 id="playlist-example-2">Grid - 360x360</h5>
        <iframe
          src="${embedBaseUrl}/playlists/${getRandomPlaylistID()}?layout=gridify"
          loading="lazy"
          width="360"
          height="360"
        ></iframe>

        <h5 id="playlist-example-3">Classic - 700x600 - List below</h5>
        <iframe
          src="${embedBaseUrl}/playlists/${getRandomPlaylistID()}"
          loading="lazy"
          width="700"
          height="600"
        ></iframe>

        <h5 id="playlist-example-4">Classic - 850x300 - List on side</h5>
        <iframe
          src="${embedBaseUrl}/playlists/${getRandomPlaylistID()}"
          loading="lazy"
          width="850"
          height="300"
        ></iframe>

        <h4>Video only playlists</h4>
        <p>
          Playlist that only contain videos are allowed to have the thumbnail
          attribute.
        </p>
        <p>They also always show a "grid" player instead of a "classic" one.</p>

        <h5 id="playlist-example-5">800x600 - List below</h5>
        <iframe
          src="${embedBaseUrl}/playlists/${getRandomVideoPlaylistID()}"
          loading="lazy"
          width="600"
          height="800"
        ></iframe>

        <h5 id="playlist-example-6">800x600 - List below - With thumbnails</h5>
        <iframe
          src="${embedBaseUrl}/playlists/${getRandomVideoPlaylistID()}?thumbnails=true"
          loading="lazy"
          width="600"
          height="800"
        ></iframe>

        <h5 id="playlist-example-8">850x300 - List on side</h5>
        <iframe
          src="${embedBaseUrl}/playlists/${getRandomVideoPlaylistID()}"
          loading="lazy"
          width="850"
          height="300"
        ></iframe>

        <h5 id="playlist-example-7">
          850x300 - List on side - With thumbnails
        </h5>
        <iframe
          src="${embedBaseUrl}/playlists/${getRandomVideoPlaylistID()}?thumbnails=true"
          loading="lazy"
          width="850"
          height="300"
        ></iframe>

        <h5 id="playlist-example-10">Grid - 500x282</h5>
        <iframe
          src="${embedBaseUrl}/playlists/${getRandomVideoPlaylistID()}?layout=grid"
          loading="lazy"
          width="500"
          height="282"
        ></iframe>

        <h5 id="playlist-example-12">600x800 - List below</h5>
        <iframe
          src="${embedBaseUrl}/playlists/${getRandomVideoPlaylistID()}?thumbnails=true"
          loading="lazy"
          width="600"
          height="800"
        ></iframe>

        <h4>Mixed playlists</h4>

        <p>Playlists containing both videos and tracks.</p>

        <h5 id="playlist-example-14">600x800 - List below</h5>
        <iframe
          src="${embedBaseUrl}/playlists/c3c18106-c4f5-4021-bb18-108255c1f450"
          loading="lazy"
          width="600"
          height="800"
        ></iframe>

        <h5 id="playlist-example-15">800x350 - List side</h5>
        <iframe
          src="${embedBaseUrl}/playlists/c3c18106-c4f5-4021-bb18-108255c1f450"
          loading="lazy"
          width="850"
          height="300"
        ></iframe>

        <h5 id="playlist-example-16">Grid - 360x360</h5>
        <iframe
          src="${embedBaseUrl}/playlists/c3c18106-c4f5-4021-bb18-108255c1f450?layout=gridify"
          loading="lazy"
          width="360"
          height="360"
        ></iframe>

        <h5 id="album-example-7">Cover slide to classic + list below</h5>
        <iframe
          src="${embedBaseUrl}/playlists/${getRandomPlaylistID()}?coverInitially=true"
          loading="lazy"
          width="360"
          height="360"
        ></iframe>

        <h4>Square playlist edge cases</h4>

        <h5>Old rectangular editorial playlist image</h5>
        <iframe
          src="${embedBaseUrl}/playlists/b87651e8-5270-4e5a-827c-509514439aef"
          loading="lazy"
          width="850"
          height="300"
        ></iframe>
      </details>
    </article>

    <article>
      <details>
        <summary>
          <h2>Mixes</h2>
        </summary>

        <h5 id="mix-example-1">Mix Classic - 444x122</h5>
        <iframe
          src="${embedBaseUrl}/mix/${getRandomMixID()}"
          loading="lazy"
          width="444"
          height="122"
        ></iframe>

        <h5 id="mix-example-2">Mix Grid - 360x360</h5>
        <iframe
          src="${embedBaseUrl}/mix/${getRandomMixID()}?layout=gridify"
          loading="lazy"
          width="360"
          height="360"
        ></iframe>

        <h5 id="mix-example-3">Mix Classic - 360x360</h5>
        <iframe
          src="${embedBaseUrl}/mix/${getRandomMixID()}"
          loading="lazy"
          width="360"
          height="360"
        ></iframe>

        <h5 id="mix-example-4">Mix Classic with list - 600x700</h5>
        <iframe
          src="${embedBaseUrl}/mix/${getRandomMixID()}"
          loading="lazy"
          width="600"
          height="700"
        ></iframe>

        <h5 id="mix-example-5">Mix with list - 800x300</h5>
        <iframe
          src="${embedBaseUrl}/mix/${getRandomMixID()}"
          loading="lazy"
          width="800"
          height="300"
        ></iframe>

        <h5 id="mix-example-7">Cover slide to classic + list below</h5>
        <iframe
          src="${embedBaseUrl}/mix/${getRandomMixID()}?coverInitially=true"
          loading="lazy"
          width="360"
          height="360"
        ></iframe>
      </details>
    </article>

    <article>
      <details id="explicit">
        <summary>
          <h2>Explicit</h2>
        </summary>

        <h5 id="track-example-2">Track Classic</h5>
        <iframe
          src="${embedBaseUrl}/tracks/106750510"
          loading="lazy"
          width="400"
          height="122"
        ></iframe>

        <h5 id="track-example-6">Track Grid</h5>
        <iframe
          src="${embedBaseUrl}/tracks/573301?layout=gridify"
          loading="lazy"
          width="500"
          height="500"
        ></iframe>

        <h5 id="clean-example-video">Video Grid</h5>
        <iframe
          src="${embedBaseUrl}/videos/94781839"
          loading="lazy"
          width="500"
          height="282"
        ></iframe>

        <h5 id="album-example-1">Album Classic</h5>
        <iframe
          src="${embedBaseUrl}/albums/166631639"
          loading="lazy"
          width="444"
          height="122"
        ></iframe>

        <h5 id="clean-example-album">Album Grid</h5>
        <iframe
          src="${embedBaseUrl}/albums/18283830?layout=gridify"
          loading="lazy"
          width="500"
          height="500"
        ></iframe>

        <h5 id="clean-example-track">Track Grid (cleanInitially)</h5>
        <iframe
          src="${embedBaseUrl}/tracks/119644843?cleanInitially=true&layout?gridify"
          loading="lazy"
          width="500"
          height="500"
        ></iframe>

        <h5 id="clean-example-video">Video Grid (cleanInitially)</h5>
        <iframe
          src="${embedBaseUrl}/videos/64415005?cleanInitially=true"
          loading="lazy"
          width="500"
          height="500"
        ></iframe>

        <h5 id="clean-example-album">Album Grid (cleanInitially)</h5>
        <iframe
          src="${embedBaseUrl}/albums/120419967?cleanInitially=true"
          loading="lazy"
          width="500"
          height="500"
        ></iframe>
      </details>
    </article>

    <article>
      <details>
        <summary>
          <h2>
            Clean initially for TIDAL.com (grids with cleanInitially=true)
          </h2>
        </summary>

        <h5 id="clean-example-track">Track Grid</h5>
        <iframe
          src="${embedBaseUrl}/tracks/${getRandomTrackID()}?cleanInitially=true&layout=gridifty"
          loading="lazy"
          width="500"
          height="500"
        ></iframe>

        <h5 id="clean-example-video">Video Grid</h5>
        <iframe
          src="${embedBaseUrl}/videos/${getRandomVideoID()}?cleanInitially=true"
          loading="lazy"
          width="500"
          height="282"
        ></iframe>

        <h5 id="clean-example-album">Album Grid</h5>
        <iframe
          src="${embedBaseUrl}/albums/${getRandomAlbumID()}?cleanInitially=true&layout=gridifty"
          loading="lazy"
          width="500"
          height="500"
        ></iframe>

        <h5 id="clean-example-playlist">Playlist Grid</h5>
        <iframe
          src="${embedBaseUrl}/playlists/${getRandomPlaylistID()}?cleanInitially=true&layout=gridifty"
          loading="lazy"
          width="500"
          height="500"
        ></iframe>
      </details>
    </article>

    <article>
      <details>
        <summary>
          <h2>Custom thingies</h2>
        </summary>

        <h4>Track - media events sent at onplay, onpause and onended</h4>
        <iframe
          src="${embedBaseUrl}/tracks/${getRandomTrackID()}?sendMediaEvents=true"
          loading="lazy"
          width="348"
          height="122"
        ></iframe>

        <h4>Track - toggle playback via command</h4>
        <div data-trigger-playback-victim="true">
          <iframe
            src="${embedBaseUrl}/tracks/${getRandomTrackID()}"
            loading="lazy"
            width="348"
            height="122"
          ></iframe>
        </div>
        <button id="trigger-play-button">Play</button>
        <button id="trigger-pause-button">Pause</button>

        <h4>Video - media events sent at onplay, onpause and onended</h4>
        <iframe
          src="${embedBaseUrl}/videos/${getRandomVideoID()}?sendMediaEvents=true"
          loading="lazy"
          width="500"
          height="282"
        ></iframe>
      </details>
    </article>

    <article>
      <details>
        <summary>
          <h2>Errors</h2>
        </summary>

        <h4>Track error</h4>
        <iframe
          src="${embedBaseUrl}/tracks/4981787465393"
          loading="lazy"
          width="348"
          height="122"
        ></iframe>

        <h4>Video error</h4>
        <iframe
          src="${embedBaseUrl}/videos/4981793"
          loading="lazy"
          width="500"
          height="282"
        ></iframe>

        <h4>Album error - Not found</h4>
        <iframe
          src="${embedBaseUrl}/albums/4981793"
          loading="lazy"
          width="444"
          height="122"
        ></iframe>

        <h4>Playlist error - Not found</h4>
        <iframe
          src="${embedBaseUrl}/playlists/4981793"
          loading="lazy"
          width="540"
          height="360"
        ></iframe>

        <h4>Collection error - All tracks unstreamable</h4>
        <iframe
          src="${embedBaseUrl}/playlists/d7be72b1-a80c-4c02-b786-ceebceb28952"
          loading="lazy"
          width="600"
          height="700"
        ></iframe>
        <iframe
          src="${embedBaseUrl}/playlists/d7be72b1-a80c-4c02-b786-ceebceb28952"
          loading="lazy"
          width="600"
          height="122"
        ></iframe>

        <h4>Collection error - Some tracks unstreamable</h4>
        <iframe
          src="${embedBaseUrl}/playlists/bfd5fc87-584b-41d0-862b-897a09412a75"
          loading="lazy"
          width="600"
          height="700"
        ></iframe>
        <iframe
          src="${embedBaseUrl}/playlists/bfd5fc87-584b-41d0-862b-897a09412a75"
          loading="lazy"
          width="600"
          height="122"
        ></iframe>

        <h4>No image - should show fallback image</h4>
        <iframe
          src="${embedBaseUrl}/playlists/050acbe2-a4e3-4525-862a-c168035e9dec"
          loading="lazy"
          width="600"
          height="700"
        ></iframe>
      </details>
    </article>
  `;

  const wimpEmbeds = [
    '100%x80',
    '100%x125',
    '100%x170',
    '100%x175',
    '100%x185',
    '100%x350',
    '100%x400',

    '275x125',
    '620x150',
    '460x170',
    '486x175',
    '380x175',
    '472x175',
    '590x175',
    '300x180',

    '600x250',

    '267x300',

    '617x300',
    '600x300',
    '250x330',
    '267x350',
    '250x350',
    '460x350',
    '486x350',
    '550x350',
    '590x350',
    '600x350',
    '620x350',
    '472x350',
    '620x370',
    '620x375',
    '300x380',
    '325x380',
    '650x381',

    '250x400',
    '267x400',
    '460x400',
    '486x400',
    '472x400',
    '590x400',
    '620x400',
    '600x400',
    '617x400',
    '650x400',
    '600x450',
    '650x450',
    '650x500',
    '620x800',
  ];

  const wimpEmbedDivs = wimpEmbeds.map(emb => {
    let [w, h] = emb.split('x');

    w = w === '100%' ? '100%' : w + 'px';
    h += 'px';

    return html`
      <h3 style="margin-top:60px">${w} X ${h}</h3>

      <h5 style="margin:20px 0 0 0" id="ads-example">Album</h5>
      <div
        style="max-width:900px"
        class="tidal-embed old-wimp"
        data-emergence="hidden"
        data-width="${w}"
        data-height="${h}"
        data-type="albums"
        data-id="${getRandomAlbumID()}"
      ></div>

      <h5 style="margin-bottom:0" id="ads-example">Track</h5>
      <div
        style="max-width:900px"
        class="tidal-embed old-wimp"
        data-emergence="hidden"
        data-width="${w}"
        data-height="${h}"
        data-type="tracks"
        data-id="${getRandomTrackID()}"
      ></div>

      <h5 style="margin-bottom:0" id="ads-example">Video</h5>
      <div
        style="max-width:900px"
        class="tidal-embed old-wimp"
        data-emergence="hidden"
        data-width="${w}"
        data-height="${h}"
        data-type="videos"
        data-id="${getRandomVideoID()}"
      ></div>

      <h5 style="margin-bottom:0" id="ads-example">Playlist</h5>
      <div
        style="max-width:900px"
        class="tidal-embed old-wimp"
        data-emergence="hidden"
        data-width="${w}"
        data-height="${h}"
        data-type="playlists"
        data-id="${getRandomPlaylistID()}"
      ></div>
    `;
  });

  const markup = html`
    <!doctype html>
    <html>
      <head>
        <meta name="robots" content="noindex" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"
        />
        <meta charset="utf-8" />
        <title>Types Test Page - TIDAL Embed Player</title>
        <style>
          ${frontEndStyles}
        </style>
      </head>
      <body>
        <header>
          <h1>TIDAL Embed Types Test Page</h1>
          <button
            onclick="document.querySelector('main').classList.toggle('animate')"
          >
            Toggle animation
          </button>
        </header>
        <main>
          ${oldWimp ? wimpEmbedDivs.join('') : previewEmbedFormats}
          <!--
        <h4>Code example:</h4>
        <code>
        &lt;div data-width=&quot;444&quot; data-height=&quot;96&quot; src=&quot;${embedBaseUrl} data-type="albums" data-id="${getRandomAlbumID()}"&quot;&gt;&lt;/div&gt;
        </code>
        -->
          <script type="module">
            ${frontEndJavaScript};
          </script>
        </main>
      </body>
    </html>
  `;

  return markup;
};

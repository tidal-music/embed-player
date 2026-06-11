import * as esbuild from 'esbuild';
import { writeFile } from 'fs/promises';
import { clean } from 'esbuild-plugin-clean';
import postcss from 'esbuild-postcss';

// Create a context for incremental builds
const buildText = '🔨 Building with esbuild';

const entryPoints = [
  'src/client/js/app.js',
  'src/client/css/main.css',
  'src/client/css/grid-additions.css',
  'src/client/css/list-item.css',
  'src/client/css/error.css',
];

console.debug(buildText + '...');
console.time(buildText);
const context = await esbuild.context({
  entryPoints,
  entryNames: '[dir]/[name]-[hash]',
  bundle: true,
  outdir: 'dist/client',
  splitting: true,
  minify: true,
  sourcemap: true,
  target: 'es2022',
  platform: 'browser',
  format: 'esm',
  metafile: true,
  define: {
    // @ts-ignore
    'process.env.EMBED_API_TOKEN': `'${process.env.EMBED_API_TOKEN}'`,
    'process.env.EMBED_API_PUBLIC_KEY': `'${process.env.EMBED_API_PUBLIC_KEY}'`,
    'process.env.EMBED_API_TOKEN__NOSTR': `'${process.env.EMBED_API_TOKEN__NOSTR}'`,
  },
  plugins: [
    clean({
      patterns: ['dist/client']
    }),
    postcss()
  ]
});

// Manually do an incremental build
const result = await context.rebuild();

if (result.metafile) {
  // https://bundle-buddy.com/esbuild
  await writeFile('./dist/client/metafile.json', JSON.stringify(result.metafile));

  const hashTable = entryPoints.reduce((obj, entryPoint) => {
    const outputs = result.metafile.outputs;

    if (outputs) {
      const value = Object.entries(outputs).find(([key, value]) => value.entryPoint === entryPoint);

      if (value) {
        const original = entryPoint.split('client/')[1];
        const hashed = value[0].split('client/')[1];

        obj[original] = hashed;
      }
    }

    return obj;
  }, {});

  await writeFile('./dist/hash-table.json', JSON.stringify(hashTable));
}

console.timeEnd(buildText);

/*
if (process.env.NODE_ENV === 'development') {
  // Enable watch mode
  await context.watch();

  // Enable serve mode
  await context.serve();
}
*/

context.dispose();

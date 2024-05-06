import * as esbuild from 'esbuild';
import { clean } from 'esbuild-plugin-clean';
import { copy } from 'esbuild-plugin-copy';

// Create a context for incremental builds
const buildText = '🔨 Building with esbuild';

const entryPoints = [
  'src/server/handler.js'
];

console.debug(buildText + '...');
console.time(buildText);
const context = await esbuild.context({
  entryPoints,
  bundle: true,
  outdir: 'dist/server',
  splitting: false,
  minify: false,
  sourcemap: true,
  target: 'es2022',
  platform: 'node',
  format: 'esm',
  plugins: [
    clean({
      patterns: ['dist/server']
    }),
    copy({
      resolveFrom: 'cwd',
      assets: {
        from: [
          './src/server/test-page/main.js',
          './src/server/test-page/styles.css'
        ],
        to: ['./dist/server'],
      }
    }),
  ]
});

await context.rebuild();

console.timeEnd(buildText);

context.dispose();

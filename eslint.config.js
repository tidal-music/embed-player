import tidal from 'eslint-config-tidal';

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  ...tidal,
  {
    files: ['*.js'],
    ignores: ['hash-table.json'],
  },
  {
    ignores: [
      'node_modules/*',
      /* Build output folders, etc */
    ],
  },
  {
    rules: {
      'import/no-default-export': 'off',
    },
  },
  /* Add any overrides here */
];

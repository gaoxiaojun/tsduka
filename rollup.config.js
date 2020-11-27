/* eslint-disable @typescript-eslint/no-var-requires */
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const { preserveShebangs } = require('rollup-plugin-preserve-shebangs');
const pkg = require('./package.json');

module.exports = {
  input: ['src/cli.ts', 'src/recover.ts', 'src/update.ts', 'src/aggregator.ts', 'src/merge.ts'],
  output: {
    format: 'cjs',
    dir: 'bin'
  },
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    'path',
    'fs',
    'fs/promises',
    'process',
    'readline'
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: { compilerOptions: { module: 'es2015' } },
      typescript: require('typescript')
    }),
    preserveShebangs()
  ],
};
import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2020',
  },
  {
    entry: { global: 'src/global.ts' },
    format: ['iife'],
    // Do not set globalName: tsup would assign the module namespace
    // ({ default: api }) to that var and overwrite window.DarkReaderAwareThemeToggle
    // that src/global.ts sets to the real API. Window assignment is the contract.
    outDir: 'dist',
    target: 'es2020',
    minify: true,
    sourcemap: true,
    outExtension() {
      return { js: '.js' };
    },
  },
]);

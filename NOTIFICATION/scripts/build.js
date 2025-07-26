require('esbuild')
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: ['node18'],
    outdir: 'dist',
    alias: {
      '@': './src',
    },
  })
  .catch(() => process.exit(1));

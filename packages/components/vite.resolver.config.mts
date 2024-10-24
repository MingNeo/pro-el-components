import path from 'node:path'
import dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [dts({
    entryRoot: 'src',
    outDir: 'dist/resolver',
    tsconfigPath: path.resolve(__dirname, 'tsconfig.json'),
    include: ['src/resolver.ts'],
    rollupTypes: true,
    insertTypesEntry: false,
  })],
  build: {
    outDir: 'dist/resolver',
    emptyOutDir: true,
    sourcemap: false,
    lib: {
      entry: path.resolve(__dirname, 'src/resolver.ts'),
      name: 'ProElComponentsResolver',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es')
          return 'resolver.es.js'
        if (format === 'cjs')
          return 'resolver.js'
        return `resolver.${format}.js`
      },
    },
    rollupOptions: {
      external: ['unplugin-vue-components'],
      output: {
        exports: 'named',
        globals: {
          'unplugin-vue-components': 'UnpluginVueComponents',
        },
      },
    },
  },
})

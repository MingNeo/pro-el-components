import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'mock-css',
      enforce: 'pre',
      load(id) {
        if (/\.(css|scss|sass|less)$/.test(id)) {
          return ''
        }
      },
    },
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    server: {
      deps: {
        inline: ['element-plus'],
      },
    },
    coverage: {
      provider: 'v8' // or 'istanbul'
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'pro-el-components': resolve(__dirname, 'src'),
      'pro-el-components/components': resolve(__dirname, 'src/components'),
      'pro-el-components/composables': resolve(__dirname, 'src/composables'),
    },
  },
})

import type { ComponentResolver } from 'unplugin-vue-components/types'
import fs from 'node:fs'
import path from 'node:path'
import Vue from '@vitejs/plugin-vue'
import { glob } from 'glob'
import dts from 'unplugin-dts/vite'
// import AutoImport from 'unplugin-auto-import/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import Components from 'unplugin-vue-components/vite'
import ElementPlusResolver from 'unplugin-element-plus/vite'
import { defineConfig } from 'vite'

export function IconResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith('Iconify'))
        return { name: 'Icon', from: '@iconify/vue' }
    },
  }
}

// 外部依赖
const external = [
  'vue',
  'element-plus',
  '@vueuse/core',
  'lodash-es',
  'vue-router',
  'vue-i18n',
  '@element-plus/icons-vue',
  'markdown-it',
  'prismjs',
  'pro-el-components',
  'dayjs',
  'virtual:uno.css',
]

// 外部依赖函数形式，用于更精确的匹配
function externalFn(id: string) {
  // 不外部化 element-plus 的样式文件
  // if (id.includes('element-plus') && id.includes('.css')) {
  //   return false
  // }
  return external.includes(id) || external.some(item => id.startsWith(item))
}

// 获取所有组件的入口文件
function getComponentEntries() {
  const entries: Record<string, string> = {}

  // 1. 先匹配有 index.vue 的组件
  const componentFiles = glob.sync(['src/components/*/index.vue'], { cwd: __dirname })
  componentFiles.forEach((file) => {
    const name = file.split('/')[2] // 获取组件名
    if (name) {
      entries[name] = path.resolve(__dirname, file)
    }
  })

  // 2. 再匹配没有 index.vue 但有同名 .vue 文件的组件
  const allComponentDirs = glob.sync(['src/components/*/'], { cwd: __dirname })
  allComponentDirs.forEach((dir) => {
    const componentName = dir.split('/')[2]
    if (componentName && !entries[componentName]) {
      // 查找同名的 .vue 文件
      const componentFile = path.resolve(__dirname, dir, `${componentName}.vue`)
      if (fs.existsSync(componentFile)) {
        entries[componentName] = componentFile
      }
    }
  })

  // 3. 添加 composables
  const composableFiles = glob.sync(['src/composables/*/index.ts'], { cwd: __dirname })
  composableFiles.forEach((file) => {
    const name = file.split('/')[2] // 获取 composable 名
    if (name) {
      entries[name] = path.resolve(__dirname, file)
    }
  })

  return entries
}

export default defineConfig(({ mode }) => {
  const isBuildComponents = mode === 'build-components'

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    plugins: [
      ElementPlusResolver({ useSource: false }) as any,
      Vue(),
      dts({
        entryRoot: 'src',
        outDir: isBuildComponents ? 'dist/es' : 'dist/lib',
        tsconfigPath: path.resolve(__dirname, 'tsconfig.json'),
        include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.vue'],
        exclude: ['src/**/__tests__/**/', 'src/**/demos/**/', 'src/**/*.stories.ts', 'resolver.ts'],
        bundleTypes: !isBuildComponents,
        processor: 'vue',
        cleanVueFileName: true,
      }),
      // 自定义插件：为没有样式的组件创建空的 style.css 文件，并优化 UnoCSS 样式提取
      isBuildComponents && {
        name: 'create-empty-styles',
        generateBundle(_options, bundle) {
          if (isBuildComponents) {
            const entries = getComponentEntries()
            Object.keys(entries).forEach((componentName) => {
              // composables不需要样式文件，跳过
              if (componentName.startsWith('use')) {
                return
              }

              // 根据组件名决定样式文件路径
              const stylePath = `components/${componentName}/style.css`

              const hasStyleFile = Object.keys(bundle).some(fileName =>
                fileName.includes(`${componentName}/style.css`),
              )
              if (!hasStyleFile) {
                this.emitFile({
                  type: 'asset',
                  fileName: stylePath,
                  source: '/* 此组件无独立样式 */\n',
                })
              }
            })
          }
        },
      },
    ].filter(Boolean),
    build: {
      emptyOutDir: !isBuildComponents,
      sourcemap: false,
      // 为组件构建启用更细粒度的CSS代码分割
      cssCodeSplit: isBuildComponents,
      cssMinify: true,
      // 对于组件构建，使用 rollup 的多入口模式而不是 lib 模式
      ...(isBuildComponents && {
        outDir: 'dist/es',
        lib: false,
        rollupOptions: {
          input: getComponentEntries(),
          external: (id) => {
            // 相对路径模块内联
            if (id.startsWith('.') || id.startsWith('/'))
              return false
            if (id.startsWith('pro-el-components/components/') && id.endsWith('.css'))
              return true
            return externalFn(id)
          },
          preserveEntrySignatures: 'strict',
          // 添加treeshake配置优化打包
          treeshake: {
            moduleSideEffects: (id) => {
              // pro-el-components 的 CSS 文件应该被视为有副作用
              if (id.startsWith('pro-el-components/components/') && id.endsWith('.css')) {
                return true
              }
              return false
            },
          },
          // 强制每个入口文件独立，不共享代码
          output: {
            format: 'es',
            dir: 'dist/es',
            entryFileNames: (chunkInfo) => {
              // 根据入口文件路径判断应该输出到哪个目录
              const name = chunkInfo.name
              if (name && name.startsWith('use')) {
                // composables 输出到 composables 目录
                return `composables/${name}/index.js`
              }
              else {
                // 其他组件输出到 components 目录
                return `components/${name}/index.js`
              }
            },
            // 强制禁用所有代码分割，所有代码内联到入口文件
            manualChunks: (id) => {
              // Vue SFC的各个部分（script、style、template）应该内联到主入口文件
              if (id.includes('vue&type=') || id.includes('vue_type_')) {
                return null // 内联到入口文件
              }
              // Vue插件辅助工具强制内联到组件中
              if (id.includes('_plugin-vue_export-helper')) {
                return null // 强制内联，不创建单独文件
              }
              // 其他代码也内联
              return null
            },
            // 对于多入口构建，不使用 inlineDynamicImports（会冲突）
            inlineDynamicImports: false,
            // 禁用代码分割优化
            hoistTransitiveImports: false,
            // 控制生成的文件输出位置
            chunkFileNames: (chunkInfo) => {
              // 所有chunk都应该被内联，如果还有生成，放到对应组件目录
              const name = chunkInfo.name || 'unknown'
              // 根据chunk的facadeModuleId来判断应该放到哪个组件目录
              if (chunkInfo.facadeModuleId) {
                const modulePath = chunkInfo.facadeModuleId
                if (modulePath.includes('/components/') && modulePath.includes('/index.vue')) {
                  const componentName = modulePath.match(/\/components\/([^/]+)\/index\.vue/)?.[1]
                  if (componentName) {
                    return `components/${componentName}/${name}.js`
                  }
                }
                if (modulePath.includes('/composables/')) {
                  const composableName = modulePath.match(/\/composables\/([^/]+)\//)?.[1]
                  if (composableName) {
                    return `composables/${composableName}/${name}.js`
                  }
                }
              }
              // 如果无法确定位置，仍然放到assets（理想情况下不应该到这里）
              return `assets/${name}.js`
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name?.endsWith('.css')) {
                // 从文件名中提取组件名来确定CSS输出位置
                const cssName = assetInfo.name.replace('.css', '')
                if (cssName.startsWith('use')) {
                  // composables不需要样式文件，放到assets目录
                  return `assets/${assetInfo.name}`
                }
                else {
                  return `components/${cssName}/style.css`
                }
              }
              return 'assets/[name].[ext]'
            },
          },
        },
      }),
      // 非组件构建的 rollup 配置
      ...(!isBuildComponents && {
        outDir: 'dist/lib',
        lib: {
          entry: path.resolve(__dirname, 'src/index.ts'),
          name: 'ProElComponents',
          formats: ['es', 'cjs'],
          fileName: (format) => {
            if (format === 'es')
              return 'pro-el-components.es.js'
            if (format === 'cjs')
              return 'pro-el-components.cjs.js'
            return `pro-el-components.${format}.js`
          },
        },
        rollupOptions: {
          external: externalFn,
          preserveEntrySignatures: 'strict',
          output: {
            format: 'es',
            globals: {
              'vue': 'Vue',
              'element-plus': 'ElementPlus',
              '@vueuse/core': 'VueUse',
              'lodash-es': '_',
              'vue-router': 'VueRouter',
              'vue-i18n': 'VueI18n',
              'markdown-it': 'markdownIt',
              'prismjs': 'Prism',
            },
          },
        },
      }),
    },
  }
})

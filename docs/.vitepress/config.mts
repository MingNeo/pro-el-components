import type { ComponentResolver } from 'unplugin-vue-components/types'
import path from 'node:path'
import Unocss from 'unocss/vite'
// import AutoImport from 'unplugin-auto-import/vite'
import ElementPlusResolver from 'unplugin-element-plus/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
// import mkcert from 'vite-plugin-mkcert'
import { defineConfig } from 'vitepress'
import { ssePlugin } from './mockSse'

// function IconResolver(): ComponentResolver {
//   return {
//     type: 'component',
//     resolve: (name: string) => {
//       if (name.startsWith('Iconify'))
//         return { name: 'Icon', from: '@iconify/vue' }
//     },
//   }
// }

function DemoResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (_name: string) => {
      if (_name === 'Demo')
        return { name: 'Demo', from: '@/components/Demo/index.vue' }
    },
  }
}

// 解决循环引用的插件 - 将所有对 pro-el-components 的导入重定向到虚拟模块
function resolveCircularImportsPlugin() {
  const srcPath = path.resolve(__dirname, '../../packages/components/src')

  return {
    name: 'resolve-circular-imports',
    enforce: 'pre' as const,
    resolveId(source: string, importer: string | undefined) {
      // 拦截所有对 pro-el-components 的导入（不带子路径）
      if (source === 'pro-el-components') {
        // 直接返回虚拟模块，完全跳过 index.ts，避免循环引用
        return {
          id: 'virtual:pro-el-components-no-circular',
          moduleSideEffects: false,
        }
      }

      return null
    },
    load(id: string) {
      // 为虚拟模块提供内容，直接重新导出所有内容
      // 不加载 index.ts，直接从各自的导出文件导出
      if (id === 'virtual:pro-el-components-no-circular') {
        return `// 虚拟模块，避免循环引用
export * from '${srcPath}/components/index.ts'
export * from '${srcPath}/composables/index.ts'
export * from '${srcPath}/utils/index.ts'

// 提供默认导出用于全局注册（如果需要）
// 注意：docs 环境通常不需要全局注册，所以这里提供一个空的 install
export default {
  install: () => {
    console.warn('pro-el-components: 全局注册在 docs 环境中被禁用以避免循环引用')
  }
}`
      }
      return null
    },
  }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'pro-el-components',
  description: 'custom components',
  base: '/pro-el-components/', // GitHub Pages 部署路径
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' },
      { text: '组合函数', link: '/composables/' },
      { text: '布局', link: '/layouts/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          link: '/guide/index',
          items: [
            { text: '快速开始', link: '/guide/quickstart' },
          ],
        },
      ],
      '/components/': [
        {
          text: '组件总览',
          items: [{
            text: '组件总览',
            link: '/components/index',
          }],
        },
        {
          text: 'ProTable',
          items: [
            { text: 'ProTable 高级表格', link: '/components/Table' },
          ],
        },
        {
          text: '表单组件',
          items: [
            { text: 'FormFields 表单块生成器', link: '/components/FormFields' },
            { text: 'Field 表单组件', link: '/components/Field' },
            { text: 'Select 选择器', link: '/components/Select' },
            { text: 'RemoteSelect 远程选择器', link: '/components/RemoteSelect' },
            { text: 'Cascader 级联选择', link: '/components/Cascader' },
            // { text: 'Upload 上传', link: '/components/Upload' },
            { text: 'SearchForm 搜索表单', link: '/components/SearchForm' },
            { text: 'ModalForm 弹窗表单', link: '/components/ModalForm' },
            { text: 'TableForm 表格表单', link: '/components/TableForm' },
            { text: 'TableSelector 表格选择器', link: '/components/TableSelector' },
          ],
        },
        {
          text: '基础组件',
          items: [
            // { text: 'SwiperCard 横向滚动切换卡片', link: '/components/swiperCard' },
            { text: 'Dialog 对话框', link: '/components/Dialog' },
            { text: 'ButtonActions 操作按钮组', link: '/components/ButtonActions' },
            { text: 'StatusText 状态文本', link: '/components/StatusText' },
            { text: 'TextSummary 文本摘要', link: '/components/TextSummary' },
            { text: 'Clipboard 剪贴板', link: '/components/Clipboard' },
          ],
        },
        {
          text: '布局',
          items: [
            { text: 'PageHeader 页头', link: '/components/PageHeader' },
            { text: 'PageContainer 页面容器', link: '/components/PageContainer' },
            { text: 'SectionHeader 章节标题', link: '/components/SectionHeader' },
            { text: 'TableModal 表格模态框', link: '/components/TableModal' },
            { text: 'ModalSelector 模态选择器', link: '/components/ModalSelector' },
            { text: 'ModalDetail 模态详情', link: '/components/ModalDetail' },
            { text: 'DetailPage 详情页', link: '/components/DetailPage' },
            { text: 'ListPage 列表页', link: '/components/ListPage' },
          ],
        },
        // {
        //   text: 'AI组件',
        //   items: [
        //     { text: 'Chat 聊天组件', link: '/components/Chat' },
        //     { text: 'SubmitTextarea 高级提交输入框', link: '/components/submitTextarea' },
        //     // { text: 'ChatInput 聊天输入框', link: '/components/ChatInput' },
        //     // { text: 'ChatOutput 聊天输出框', link: '/components/ChatOutput' },
        //     // { text: 'ChatHistory 聊天历史', link: '/components/ChatHistory' },
        //     // { text: 'ChatSteps 聊天步骤', link: '/components/ChatSteps' },
        //   ],
        // },
      ],
      '/composables/': [
        {
          text: '组合函数',
          items: [
            { text: '使用说明', link: '/composables/' },
            { text: 'useRequest 自动请求管理', link: '/composables/useRequest' },
            { text: 'useTableList 列表数据管理', link: '/composables/useTableList' },
            // { text: 'useCountdown 倒计时', link: '/composables/useCountdown' },
            { text: 'useDarkMode 黑暗模式', link: '/composables/useDarkMode' },
            // { text: 'useChat 流式对话', link: '/composables/useChat' },
            { text: 'useSelection 列表多选', link: '/composables/useSelection' },
            { text: 'usePageStorage 页面数据存储', link: '/composables/usePageStorage' },
            { text: 'useStreamData 自动流式管理', link: '/composables/useStreamData' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mingNeo/pro-el-components' },
    ],
  },
  vite: {
    resolve: {
      alias: [
        // 子路径 alias - 用于处理样式文件等资源导入
        {
          find: /^pro-el-components\/components\/(.+)$/,
          replacement: `${path.resolve(__dirname, '../../packages/components/src/components')}/$1`,
        },
        {
          find: /^pro-el-components\/composables\/(.+)$/,
          replacement: `${path.resolve(__dirname, '../../packages/components/src/composables')}/$1`,
        },
        // 注意：主路径 pro-el-components 由 Vite 插件处理，不在这里配置
        // 这样可以避免加载 index.ts 导致的循环引用
        {
          find: '@/',
          replacement: `${path.resolve(__dirname, '../../packages/components/src')}/`,
        },
      ],
      // 不跟随符号链接，确保 alias 优先级高于 node_modules
      preserveSymlinks: false,
    },
    // 排除 pro-el-components 的预构建，强制使用 alias
    optimizeDeps: {
      exclude: ['pro-el-components'],
    },
    // 确保 pro-el-components 只被解析一次，避免循环引用
    dedupe: ['pro-el-components'],
    // SSR 配置，处理 element-plus 等库的 CSS 导入问题
    ssr: {
      noExternal: ['element-plus', 'lodash-es', '@vueuse/core', '@vueuse/shared'],
    },
    plugins: [
      // mkcert({ hosts: ['components.local.smzdm.com'] }), // 生成证书
      resolveCircularImportsPlugin() as any,
      Unocss(),
      // AutoImport({
      //   resolvers: [ElementPlusResolver()],
      //   imports: [
      //     'vue',
      //     'vue-i18n',
      //     '@vueuse/head',
      //     '@vueuse/core',
      //   ],
      //   dirs: [
      //     '../packages/components/src/composables/**/*.ts',
      //     '../packages/components/src/utils/**/*.ts',
      //   ],
      //   vueTemplate: true,
      // }),
      // https://github.com/antfu/unplugin-vue-components
      Components({
        resolvers: [
          // ElementPlusResolver(),
          // IconResolver(),
          DemoResolver(),
        ],
        // dirs: ['../packages/components/src/components'],
        excludeNames: [/^demo.*/],
        // directoryAsNamespace: true,
        // globalNamespaces: ['common'],
      }),

      ElementPlusResolver({ useSource: false }) as any,
      ssePlugin(),
    ],
  },
})

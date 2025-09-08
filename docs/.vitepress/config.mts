import type { ComponentResolver } from 'unplugin-vue-components/types'
import path from 'node:path'
import process from 'node:process'
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

// const isDev = process.argv[2] === 'dev'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'pro-el-components',
  description: 'custom components',
  base: '/pro-el-components/', // GitHub Pages 部署路径
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' },
      { text: '组合函数', link: '/composables/' },
      { text: '布局', link: '/layouts/' },
    ],

    sidebar: [
      {
        text: '指南',
        link: '/guide/index',
        items: [
          { text: '快速开始', link: '/guide/quickstart' },
        ],
      },
      {
        text: '组件',
        items: [
          // { text: 'SwiperCard 横向滚动切换卡片', link: '/components/swiperCard' },
          { text: 'Dialog 对话框', link: '/components/Dialog' },
          { text: 'TextSummary 文本摘要', link: '/components/TextSummary' },
          { text: 'Clipboard 剪贴板', link: '/components/Clipboard' },
          { text: 'ButtonActions 操作按钮组', link: '/components/ButtonActions' },
          { text: 'SectionHeader 章节标题', link: '/components/SectionHeader' },
          { text: 'StatusText 状态文本', link: '/components/StatusText' },
        ],
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
      {
        text: '布局',
        items: [
          { text: 'PageHeader 页头', link: '/components/PageHeader' },
          { text: 'ListPage 列表页内容', link: '/components/ListPage' },
          { text: 'PageContainer 页面容器', link: '/components/PageContainer' },
        ],
      },
      {
        text: '高级',
        items: [
          { text: 'TableModal 表格模态框', link: '/components/TableModal' },
          { text: 'ModalDetail 模态详情', link: '/components/ModalDetail' },
          { text: 'ModalSelector 模态选择器', link: '/components/ModalSelector' },
          { text: 'DetailPage 页面详情', link: '/components/DetailPage' },
        ],
      },
      {
        text: 'compostions',
        items: [
          { text: '使用说明', link: '/composables/' },
          { text: 'useTableList 列表数据管理', link: '/composables/useTableList' },
          // { text: 'useCountdown 倒计时', link: '/composables/useCountdown' },
          { text: 'useDarkMode 黑暗模式', link: '/composables/useDarkMode' },
          { text: 'useRequest 自动请求管理', link: '/composables/useRequest' },
          { text: 'useStreamData 自动流式管理', link: '/composables/useStreamData' },
          // { text: 'useChat 流式对话', link: '/composables/useChat' },
          { text: 'useSelection 列表多选', link: '/composables/useSelection' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mingNeo/pro-el-components' },
    ],
  },
  vite: {
    resolve: {
      alias: {
        '@': `${path.resolve(__dirname, '../../packages/components/src')}/`,
        // 'components': `${path.resolve(__dirname, '../../packages/components/src/components')}/`,
        // 'composables': `${path.resolve(__dirname, '../../packages/components/src/composables')}/`,
      },
    },
    // server: {
    //   host: '0.0.0.0',
    //   port: 443,
    //   open: 'https://components.local.smzdm.com',
    // },
    // SSR 配置，处理 element-plus 等库的 CSS 导入问题
    ssr: {
      noExternal: ['element-plus', 'lodash-es', '@vueuse/core', '@vueuse/shared'],
    },
    plugins: [
      // mkcert({ hosts: ['components.local.smzdm.com'] }), // 生成证书
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

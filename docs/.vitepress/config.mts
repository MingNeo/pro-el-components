import path from 'node:path'
import mkcert from 'vite-plugin-mkcert'
import { defineConfig } from 'vitepress'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

function IconResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith('Iconify'))
        return { name: 'Icon', from: '@iconify/vue' }
      // 暂时使用iconify，后续可能指定自己icon组件
      if (name.startsWith('Icon'))
        return { name: 'Icon', from: '@iconify/vue' }
    },
  }
}

function DemoResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (_name: string) => {
      return { name: 'Demo', from: 'Demo.vue' }
    },
  }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'pro-element-plus',
  description: 'custom components',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '组件', link: '/components/' },
      { text: '组合函数', link: '/composables/' },
      { text: '布局', link: '/layouts/' },
    ],

    sidebar: [
      {
        text: '组件',
        items: [
          { text: 'SubmitTextarea 高级提交输入框', link: '/components/submitTextarea' },
          { text: 'MarkdownView markdown渲染', link: '/components/markdownView' },
          { text: 'SwiperCard 横向滚动切换卡片', link: '/components/swiperCard' },
          { text: 'ButtonActions 列表页操作按钮', link: '/components/common/ButtonActions' },
          { text: 'Cascader 级联选择', link: '/components/common/Cascader' },
          { text: 'Table 表格', link: '/components/common/Table' },
          { text: 'SearchForm 搜索表单', link: '/components/common/SearchForm' },
          { text: 'Select 选择器', link: '/components/common/Select' },
          { text: 'FormItemsBuilder 表单项构建器', link: '/components/common/FormItemsBuilder' },
          { text: 'Upload 上传', link: '/components/common/Upload' },
          { text: 'TextSummary 文本摘要', link: '/components/common/TextSummary' },
          { text: 'ExpandCollapseText 展开折叠文本', link: '/components/common/ExpandCollapseText' },
          { text: 'Card 卡片', link: '/components/common/Card' },
          { text: 'Clipboard 剪贴板', link: '/components/common/Clipboard' },
          { text: 'HeaderBar 头部栏', link: '/components/common/HeaderBar' },
          { text: 'Link 链接', link: '/components/common/Link' },
          { text: 'LinkActions 链接操作', link: '/components/common/LinkActions' },
          { text: 'ListPageContent 列表页内容', link: '/components/common/ListPageContent' },
          { text: 'Modal 模态框', link: '/components/common/Modal' },
          { text: 'ModalDetail 模态详情', link: '/components/common/ModalDetail' },
          { text: 'ModalForm 模态表单', link: '/components/common/ModalForm' },
          { text: 'ModalSelector 模态选择器', link: '/components/common/ModalSelector' },
          { text: 'PageHeader 页头', link: '/components/common/PageHeader' },
          { text: 'RemoteSelect 远程选择', link: '/components/common/RemoteSelect' },
          { text: 'SectionHeader 章节标题', link: '/components/common/SectionHeader' },
          { text: 'StatusText 状态文本', link: '/components/common/StatusText' },
          { text: 'TableForm 表格表单', link: '/components/common/TableForm' },
          { text: 'TableModal 表格模态框', link: '/components/common/TableModal' },
          { text: 'TableSelector 表格选择器', link: '/components/common/TableSelector' },
          { text: 'TableTabs 表格标签页', link: '/components/common/TableTabs' },
          { text: 'Tabs 标签页', link: '/components/common/Tabs' },
        ],
      },
      {
        text: 'compostions',
        items: [
          { text: '使用说明', link: '/composables/' },
          { text: 'useListData 列表数据管理', link: '/composables/useListData' },
          { text: 'useCountdown 倒计时', link: '/composables/useCountdown' },
          { text: 'useDarkMode 黑暗模式', link: '/composables/useDarkMode' },
          { text: 'useRequest 自动请求管理', link: '/composables/useRequest' },
          { text: 'useStreamData 自动流式管理', link: '/composables/useStreamData' },
          { text: 'useChat 流式对话', link: '/composables/useChat' },
        ],
      },
      {
        text: '布局',
        items: [
          { text: 'Layout 布局', link: '/layouts/layout' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://gitlab-team.zdm.net/fe/pro-element-plus' },
    ],
  },
  vite: {
    resolve: {
      alias: {
        '@': `${path.resolve(__dirname, '../../packages/components/src')}/`,
        'components': `${path.resolve(__dirname, '../../packages/components/src/components')}/`,
        'composables': `${path.resolve(__dirname, '../../packages/components/src/composables')}/`,
        'layouts': `${path.resolve(__dirname, '../../packages/components/src/layouts')}/`,
      },
    },
    // server: {
    //   host: '0.0.0.0',
    //   port: 443,
    //   open: 'https://components.local.smzdm.com',
    // },
    plugins: [
      // mkcert({ hosts: ['components.local.smzdm.com'] }), // 生成证书
      Unocss(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: [
          'vue',
          'vue-i18n',
          '@vueuse/head',
          '@vueuse/core',
        ],
        dirs: [
          '../packages/components/src/composables/**/*.ts',
          '../packages/components/src/utils/**/*.ts',
        ],
        vueTemplate: true,
      }),
      // https://github.com/antfu/unplugin-vue-components
      Components({
        resolvers: [ElementPlusResolver(), IconResolver(), DemoResolver()],
        dirs: ['../packages/components/src/components'],
        excludeNames: [/^demo.*/],
        directoryAsNamespace: true,
        globalNamespaces: ['common'],
      }),
    ],
  },
})

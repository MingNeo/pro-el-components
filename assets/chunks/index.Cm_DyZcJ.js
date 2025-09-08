const n=`import type { App } from 'vue'

// 导入所有组件用于全局注册
import {
  ProButtonActions,
  ProCard,
  ProCascader,
  ProCheckbox,
  ProClipboard,
  ProDetailPage,
  ProDetailPageContent,
  ProDialog,
  ProExpandCollapseText,
  ProField,
  ProFormFields,
  ProListPage,
  ProListPageContent,
  ProModalDetail,
  ProModalForm,
  ProModalSelector,
  ProPageContainer,
  ProPageHeader,
  ProPageWrapper,
  ProQuickLogin,
  ProRadio,
  ProRemoteSelect,
  ProSearchForm,
  ProSectionHeader,
  ProSelect,
  ProSideBar,
  ProStatusText,
  ProSubmitTextarea,
  ProSwiperCard,
  ProTable,
  ProTableForm,
  ProTableModal,
  ProTableSelector,
  ProTableTabs,
  ProTextSummary,
  ProUpload,
} from './components'

// 导入 Element Plus 样式
// import 'element-plus/dist/index.css'

// 重新导出所有组件和类型定义
export * from './components'
export * from './composables/index'
export * from './utils'

// 组件注册映射表 - 用于全局注册
const components = {
  ProButtonActions,
  ProCard,
  ProCascader,
  ProCheckbox,
  ProClipboard,
  ProDetailPageContent,
  ProDialog,
  ProExpandCollapseText,
  ProField,
  ProFormFields,
  ProListPageContent,
  ProModalDetail,
  ProModalForm,
  ProModalSelector,
  ProPageContainer,
  ProRadio,
  ProRemoteSelect,
  ProSearchForm,
  ProSectionHeader,
  ProSelect,
  ProStatusText,
  ProSubmitTextarea,
  ProSwiperCard,
  ProTable,
  ProTableForm,
  ProTableModal,
  ProTableSelector,
  ProTableTabs,
  ProTextSummary,
  ProUpload,
  // 布局组件
  ProDetailPage,
  ProListPage,
  ProPageHeader,
  ProPageWrapper,
  ProQuickLogin,
  ProSideBar,
}

// 安装函数 - 注册所有组件
function install(app: App) {
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component)
  })
  return app
}

// 默认导出
export default {
  install,
}
`;export{n as default};

# 组件总览

Pro El Components 提供了丰富的业务组件，帮助您快速构建企业级中台应用。所有组件都基于 Element Plus 设计，保持一致的用户体验。

## 设计原则

- **兼容性优先** - 完全兼容 Element Plus 的所有原始用法，支持渐进式升级
- **业务导向** - 专注解决中台系统常见业务场景
- **灵活可扩展** - 支持自定义配置，满足不同业务需求
- **开箱即用** - 提供合理的默认配置，降低使用门槛

## 📦 组件分类

### 数据展示

高效展示各种数据格式，提供丰富的交互功能。

| 组件                                   | 描述         | 特性                                 |
| -------------------------------------- | ------------ | ------------------------------------ |
| [ProTable](/components/Table)          | 高级表格组件 | 自动分页、列配置、数据格式化、操作列 |
| [StatusText](/components/StatusText)   | 状态文本显示 | 多种状态样式、自定义颜色、图标支持   |
| [TextSummary](/components/TextSummary) | 文本摘要组件 | 展开收起、字数限制、优雅截断         |

### 数据录入

快速构建各种表单，提升数据录入效率。

| 组件                                     | 描述         | 特性                           |
| ---------------------------------------- | ------------ | ------------------------------ |
| [FormFields](/components/FormFields)     | 表单项生成器 | 配置化生成、多种布局、联动支持 |
| [Field](/components/Field)               | 统一表单字段 | 多种输入类型、验证规则、格式化 |
| [SearchForm](/components/SearchForm)     | 搜索表单组件 | 快速筛选、重置功能、响应式布局 |
| [RemoteSelect](/components/RemoteSelect) | 远程选择器   | 异步加载、搜索过滤、无限滚动   |
| [Cascader](/components/Cascader)         | 级联选择器   | 多级联动、异步加载、自定义显示 |
| [Select](/components/Select)             | 增强选择器   | 多选支持、搜索功能、自定义选项 |

### 反馈组件

提供用户操作反馈，提升交互体验。

| 组件                                   | 描述       | 特性                         |
| -------------------------------------- | ---------- | ---------------------------- |
| [Dialog](/components/Dialog)           | 增强对话框 | 拖拽支持、全屏模式、嵌套处理 |
| [ModalForm](/components/ModalForm)     | 弹窗表单   | 表单验证、提交处理、加载状态 |
| [ModalDetail](/components/ModalDetail) | 弹窗详情   | 数据展示、打印功能、操作按钮 |

### 导航组件

帮助用户快速定位和操作。

| 组件                                       | 描述       | 特性                           |
| ------------------------------------------ | ---------- | ------------------------------ |
| [ButtonActions](/components/ButtonActions) | 操作按钮组 | 权限控制、批量操作、响应式隐藏 |
| [SectionHeader](/components/SectionHeader) | 章节标题   | 分割线样式、图标支持、操作区域 |
| [TableSelector](/components/TableSelector) | 表格选择器 | 弹窗选择、多选支持、搜索过滤   |

### 布局组件

提供标准化的页面布局结构。

| 组件                                       | 描述       | 特性                         |
| ------------------------------------------ | ---------- | ---------------------------- |
| [PageContainer](/components/PageContainer) | 页面容器   | 面包屑、标题栏、内容区域     |
| [PageHeader](/components/PageHeader)       | 页面头部   | 返回按钮、标题描述、操作区域 |
| [ListPage](/components/ListPage)           | 列表页容器 | 搜索区域、表格区域、分页组件 |

### 工具组件

提供常用的工具功能。

| 组件                                         | 描述       | 特性                           |
| -------------------------------------------- | ---------- | ------------------------------ |
| [Clipboard](/components/Clipboard)           | 剪贴板操作 | 一键复制、成功提示、兼容性处理 |
| [SubmitTextarea](/components/submitTextarea) | 提交文本框 | 快捷键提交、字数统计、自动扩展 |

## 快速开始

### 全量引入

```javascript
import ProElComponents from 'pro-el-components'
import { createApp } from 'vue'
import 'pro-el-components/dist/style.css'

const app = createApp(App)
app.use(ProElComponents)
```

### 按需引入

```javascript
import { ProFormFields, ProTable } from 'pro-el-components'

// 在组件中使用
export default {
  components: {
    ProTable,
    ProFormFields
  }
}
```

## 💡 最佳实践

1. **组件组合** - 多个组件可以自由组合使用，构建复杂的业务场景
2. **渐进升级** - 可以逐步替换现有的 Element Plus 组件
3. **自定义扩展** - 通过插槽和事件机制灵活扩展功能
4. **类型安全** - 充分利用 TypeScript 类型定义，提升开发效率

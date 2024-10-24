# Pro-el-components

[![NPM Version](https://img.shields.io/npm/v/pro-el-components.svg)](https://www.npmjs.com/package/pro-el-components)
<!-- [![License](https://img.shields.io/npm/l/pro-el-components.svg)](LICENSE) -->
[![Built with Element Plus](https://img.shields.io/badge/Built%20with-Element%20Plus-409eff)](https://element-plus.org/)

> 🚀 基于 Element Plus 的企业级高级组件库，专为中台系统打造，提供开箱即用的业务组件和解决方案。

## ✨ 特性

- 🎯 **企业级** - 专注中台业务场景，提供高质量的业务组件
- 🔧 **开箱即用** - 丰富的业务组件，快速构建中台应用
- 🎨 **优雅易用** - 基于 Element Plus 设计语言，保持一致的用户体验
- 🔀 **TypeScript** - 完整的 TypeScript 支持，提供优秀的开发体验
- 🎭 **主题定制** - 支持主题定制，满足不同品牌需求
- 📦 **按需加载** - 支持树摇优化，减小打包体积

## 🔧 快速开始

### 环境要求

- Node.js >= 16.0.0
- Vue 3.x
- Element Plus >= 2.0.0

### 安装

```bash
# 使用 npm
npm install pro-el-components

# 使用 yarn
yarn add pro-el-components

# 使用 pnpm
pnpm add pro-el-components
```

### 基本使用

```vue
<script setup>
import { ProTable } from 'pro-el-components'

const columns = [
  { label: '姓名', prop: 'name' },
  { label: '年龄', prop: 'age' },
  { label: '地址', prop: 'address' }
]

const tableData = [
  { name: '张三', age: 18, address: '北京市朝阳区' }
]
</script>

<template>
  <ProTable
    :columns="columns"
    :data="tableData"
    :loading="loading"
  />
</template>
```

## 📚 文档与示例

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动文档站点
pnpm run docs:dev
```

### 在线文档

- 📖 [文档](https://mingneo.github.io/pro-el-components/)

## 🏗️ 主要组件

### 数据展示

- **ProTable** - 高级表格组件，支持自动分页、列配置、数据格式化
- **StatusText** - 状态文本组件，支持多种状态显示
- **TextSummary** - 文本摘要组件，支持展开收起

### 数据录入

- **ProFormFields** - 表单项生成器，快速构建复杂表单
- **SearchForm** - 搜索表单组件，标准化搜索界面
- **RemoteSelect** - 远程选择器，支持异步数据加载

### 反馈

- **Dialog** - 增强对话框组件
- **ModalForm** - 弹窗表单组件
- **Loading** - 智能加载组件

### 布局
- **ListPage** - 列表页容器

## 📄 许可证

本项目基于 [MIT](LICENSE) 许可证开源。

## 🤝 支持

如果这个项目对你有帮助，请给我们一个 ⭐️

---

<div align="center">
  Made with ❤️ by Klose
</div>

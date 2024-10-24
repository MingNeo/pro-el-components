# ProTable 高级表格

> 🚀 基于 Element Plus Table 的高级表格组件，专为中台系统设计，提供开箱即用的数据展示解决方案。

## ✨ 特性亮点

在中台工程中，表格是最常用的数据展示组件。

在每个中台工程中，大家几乎都会对表格进行二次封装，但是封装的方式基本上都是**错误**的！

传统的表格封装往往只考虑了快速配置，忽略了维护成本和自定义扩展的灵活性。但是高级组件最重要的并不是快速配置，而是能快速配置的同时保持原有的灵活性。

**ProTable 的优势：**

- ✅ **完全兼容** - 100% 兼容 Element Plus Table原始用法，改个组件名即可无缝升级。同时，你完全可以配合原始用法来自由扩充你想要的功能。
- 🔧 **配置驱动** - 通过简单配置快速生成表格列和操作按钮
- 🎨 **可视化配置** - 内置列显示/隐藏控制器，用户可自定义显示
- 🎯 **智能映射** - 自动映射枚举数据和状态显示
- 📝 **类型格式化** - 内置多种数据类型格式化器
- 📏 **自适应高度** - 可选自动计算表格高度，充分利用页面空间
- 📄 **分页集成** - 内置分页组件，简化分页逻辑

## 🚀 基础使用

### 快速开始

只需将 `ElTable` 替换为 `ProTable`，即可享受高级功能：

<demo src="@/components/Table/demos/demo1.vue" title="基础用法" />

### 内置格式映射 & 动态操作

通过配置快速实现枚举、日期、文件、图片等数据映射和动态操作按钮：

<demo src="@/components/Table/demos/demo2.vue" title="内置格式映射 & 动态操作列" />

### 自定义渲染

支持自定义组件渲染，满足复杂业务需求：

<demo src="@/components/Table/demos/demo3.vue" title="自定义组件渲染" />

### 完全兼容 Element Plus 原生用法

ProTable 100% 兼容 Element Plus Table 的原生写法。只需将 `<ElTable>` 替换为 `<ProTable>`，即可在保持原有代码不变的情况下，享受按钮控制、内置分页等高级功能：

<demo src="@/components/Table/demos/demo4.vue" title="完全兼容原生用法" />

> 💡 **兼容性说明**
> - 支持 Element Plus Table 的所有事件、方法、属性和插槽

### 混合使用配置式和模板式列
ProTable 支持同时使用配置式列（columns）和Elment plus 的 ElTableColumn 组件，让你可以渐进式迁移或灵活选择最适合的方式：

<demo src="@/components/Table/demos/demo5.vue" title="配置式与模板式混合使用" />
## 🔧 高级功能

### 列配置管理

当启用 `columnSetting` 时，用户可以自定义列的显示和隐藏：

```vue
<template>
  <ProTable
    :columns="columns"
    :data="tableData"
    :column-setting="true"
    table-id="user-table"
  />
</template>
```

> 💡 **注意事项**
> - 如果启用了columnSetting，且页面中有多个表格，必须设置不同的 `tableId` 用于区分
> - 如果只有一个表格，`tableId` 会根据路由路径自动生成

### Slot

完全兼容 Element Plus Table 的插槽用法，可与配置生成的列内容共存：

| 插槽名称             | 说明                                                                                                                           | 对应原生插槽  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| `default`            | 自定义默认内容                                                                                                                 | `default`     |
| `append`             | 表格最后一行后的内容。如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。 若表格有合计行，该 slot 会位于合计行之上。 | `append`      |
| `empty`              | 数据为空时的自定义内容                                                                                                         | `empty`       |
| `column-header`      | 自定义列头内容                                                                                                                 | `header`      |
| `column-default`     | 自定义列内容， 等同ElTableColumn的default插槽                                                                                  | `default`     |
| `column-filter-icon` | 自定义过滤图标， 等同等同ElTableColumn的default插槽的filter-icon插槽                                                           | `filter-icon` |

### 动态分页查询

结合 `useTableList` 实现完整的分页查询功能：

```vue
<script setup>
import { useTableList } from 'pro-el-components'

const {
  data,
  loading,
  pagination,
  searchData,
  search: { submit, reset }
} = useTableList(api.getUserList)

// 搜索表单配置
const searchFields = [
  { label: '用户名', prop: 'username', component: 'input' },
  { label: '状态', prop: 'status', component: 'select', options: statusOptions }
]

// 表格列配置
const columns = [
  { label: 'ID', prop: 'id', width: '80px' },
  { label: '用户名', prop: 'username' },
  { label: '邮箱', prop: 'email' },
  {
    label: '状态',
    prop: 'status',
    renderAs: 'enum',
    fieldProps: { options: statusOptions }
  },
  {
    label: '操作',
    actions: [
      { text: '编辑', onClick: row => handleEdit(row) },
      { text: '删除', onClick: row => handleDelete(row), danger: true }
    ]
  }
]
</script>

<template>
  <div>
    <!-- 搜索表单 -->
    <SearchForm
      :fields="searchFields"
      :search="{ submit, reset }"
      :default-value="searchData"
    />

    <!-- 数据表格 -->
    <ProTable
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      column-setting
    />
  </div>
</template>
```

## 📋 API 参考

### ProTable Props

在 [Element Plus Table](https://element-plus.org/zh-CN/component/table.htm) 的基础上，新增以下配置：

| 参数            | 说明               | 类型              | 默认值   |
| --------------- | ------------------ | ----------------- | -------- |
| `columnSetting` | 是否启用列配置功能 | `boolean`         | `false`  |
| `columns`       | 表格列配置数组     | `Column[]`        | `[]`     |
| `loading`       | 加载状态           | `boolean`         | `false`  |
| `pagination`    | 分页配置对象       | `PaginationProps` | -        |
| `tableId`       | 表格唯一标识       | `string`          | 自动生成 |

### Column 配置

| 参数           | 说明                               | 类型                                                 | 默认值 |
| -------------- | ---------------------------------- | ---------------------------------------------------- | ------ |
| `label`        | 列标题                             | `string`                                             | -      |
| `prop`         | 数据字段名                         | `string`                                             | -      |
| `width`        | 列宽度                             | `string \| number`                                   | -      |
| `customRender` | 自定义渲染函数，优先级高于renderAs | `(value, row, index) => VNode`                       | -      |
| `renderAs`     | 内置渲染器类型                     | `'file' \| 'date' \| 'image' \| 'enum' \| Component` | -      |
| `fieldProps`   | 渲染器属性                         | `Record<string, any>`                                | `{}`   |
| `actions`      | 操作按钮配置                       | `Action[] \| (row, column, index) => Action[]`       | -      |

### Action 配置

| 参数          | 说明               | 类型                           | 默认值               |
| ------------- | ------------------ | ------------------------------ | -------------------- |
| `text`        | 按钮文本           | `string`                       | -                    |
| `onClick`     | 点击事件处理函数   | `(row, column, index) => void` | -                    |
| `confirm`     | 是否显示确认对话框 | `boolean`                      | `false`              |
| `confirmText` | 确认对话框文本     | `string`                       | `'确认执行此操作？'` |
| `danger`      | 是否为危险操作样式 | `boolean`                      | `false`              |

## 🔗 相关链接

- [Element Plus Table](https://element-plus.org/zh-CN/component/table.html) - 查看原始 Table 组件文档
- [useTableList](/composables/useTableList) - 配套的数据管理 Hook
- [SearchForm](/components/SearchForm) - 搭配使用的搜索表单组件

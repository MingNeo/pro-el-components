# Composables 组合函数

Vue 3 的组合式 API 为我们提供了强大的逻辑复用能力。Pro El Components 内置了一系列实用的 Composables，帮助您快速处理常见的业务逻辑。

### 数据管理

处理各种数据获取、缓存和状态管理需求。

| Composable                                    | 描述         | 核心功能                 |
| --------------------------------------------- | ------------ | ------------------------ |
| [useTableList](/composables/useTableList)     | 表格列表管理 | 分页查询、搜索、加载状态 |
| [useRequest](/composables/useRequest)         | 请求管理     | 防抖、错误处理、重试机制 |
| [useSelection](/composables/useSelection)     | 选择状态管理 | 多选、全选、反选逻辑     |
| [usePageStorage](/composables/usePageStorage) | 页面缓存     | 表单数据、滚动位置缓存   |
| [useUrlData](/composables/useUrlData)         | URL 状态同步 | 查询参数、路由状态管理   |

### UI 交互

提升用户界面交互体验的实用工具。

| Composable                                  | 描述     | 核心功能               |
| ------------------------------------------- | -------- | ---------------------- |
| [useDarkMode](/composables/useDarkMode)     | 暗黑模式 | 主题切换、系统偏好检测 |
| [useStreamData](/composables/useStreamData) | 流式数据 | SSE 连接、实时数据更新 |

## 🚀 快速开始

### 基本使用

```vue
<script setup>
import { useTableList } from 'pro-el-components'

// 定义数据获取函数
async function fetchData(params) {
  const response = await api.getUserList(params)
  return {
    data: response.data.list,
    total: response.data.total
  }
}

// 使用 useTableList 管理表格状态
const {
  data,
  loading,
  pagination,
  searchData,
  search: { submit, reset }
} = useTableList(fetchData)
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
    />
  </div>
</template>
```

## 💡 最佳实践

### 1. 合理组合使用

```vue
<script setup>
// ✅ 推荐：将相关的 composables 组合使用
const tableState = useTableList(fetchData)
const selectionState = useSelection()
const urlState = useUrlData(['keyword', 'status'])

// 组合成业务逻辑
function handleSearch(params) {
  urlState.updateParams(params)
  tableState.search.submit(params)
}
</script>
```

### 2. 类型定义

```typescript
// ✅ 推荐：明确定义类型
interface UserItem {
  id: number
  name: string
  email: string
}

const {
  data,
  loading
} = useTableList<UserItem>(fetchUserList)

// data 的类型自动推导为 UserItem[]
```

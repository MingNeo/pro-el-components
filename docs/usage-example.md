# 使用示例

## 在 Vue 项目中使用 pro-el-components

### 1. 安装依赖

```bash
npm install pro-el-components element-plus
```

### 2. 使用方式

#### 方式一：完整引入（推荐用于全功能项目）

```javascript
import ElementPlus from 'element-plus'
import ProElComponents from 'pro-el-components'
// main.js
import { createApp } from 'vue'
import App from './App.vue'

// 引入样式
import 'element-plus/dist/index.css'
import 'pro-el-components/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(ProElComponents)
app.mount('#app')
```

#### 方式二：按需引入（推荐用于优化打包体积）

```vue
<script>
import { ProTable } from 'pro-el-components'
import 'pro-el-components/components/table/style.css'

export default {
  components: { ProTable },
}
</script>

<template>
  <ProTable ... />
</template>
```

#### 方式三：自动导入（推荐）

配置 `vite.config.js`：

```javascript
import vue from '@vitejs/plugin-vue'
import { ProElComponentsResolver } from 'pro-el-components/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver(), ProElComponentsResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        ProElComponentsResolver() // 会自动按需导入组件和样式
      ],
    }),
  ],
})
```

在 `main.js` 中只需要导入 Element Plus 样式：

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'

// 引入 Element Plus 样式
import 'element-plus/dist/index.css'

const app = createApp(App)
app.mount('#app')
```

在组件中直接使用，无需手动导入：

```vue
<script setup>
// 无需手动导入组件
const columns = [
  { label: '姓名', prop: 'name' },
  { label: '年龄', prop: 'age' },
  { label: '地址', prop: 'address' }
]

const data = ref([
  { name: '张三', age: 18, address: '北京市朝阳区' },
  { name: '李四', age: 25, address: '上海市浦东新区' }
])

const loading = ref(false)

const searchFields = [
  { label: '姓名', prop: 'name', type: 'input' },
  { label: '年龄', prop: 'age', type: 'number' }
]

function handleSearch(params) {
  console.log('搜索参数:', params)
}
</script>

<template>
  <div>
    <!-- 自动导入 ProTable 组件和样式 -->
    <ProTable
      :columns="columns"
      :data="data"
      :loading="loading"
    />

    <!-- 自动导入 ProSearchForm 组件和样式 -->
    <ProSearchForm
      :fields="searchFields"
      @search="handleSearch"
    />
  </div>
</template>
```

### 3. 高级配置

#### 自定义 ProElComponentsResolver 选项

```javascript
// vite.config.js
import { ProElComponentsResolver } from 'pro-el-components/resolver'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        ProElComponentsResolver({
          importStyle: true, // 是否自动导入样式（默认为 true）
          packageName: 'pro-el-components', // 包名
          prefix: 'Pro' // 组件前缀
        })
      ],
    }),
  ],
})
```

#### 样式导入说明

**推荐做法：** 启用自动导入样式以实现真正的按需加载：

```javascript
// vite.config.js
ProElComponentsResolver({
  importStyle: true // 启用按需样式自动导入（默认）
})
```

**可选：** 如果你想禁用自动导入样式：

```javascript
// vite.config.js
ProElComponentsResolver({
  importStyle: false // 禁用样式自动导入
})
```

然后在入口文件中手动导入全局样式：

```javascript
// main.js
import 'pro-el-components/dist/index.css'
```

> **优势：** 组件解析器会自动按需导入每个组件的独立样式文件，只有使用的组件样式才会被打包，实现最佳的性能优化。

### 4. 组件使用示例

#### ProTable 高级表格

```vue
<script setup>
import { ref } from 'vue'

const columns = [
  {
    label: '姓名',
    prop: 'name',
    sortable: true
  },
  {
    label: '状态',
    prop: 'status',
    render: (row) => {
      return h(ProStatusText, {
        status: row.status,
        options: {
          active: '正常',
          inactive: '禁用'
        }
      })
    }
  },
  {
    label: '操作',
    width: 200,
    render: (row) => {
      return h(ProButtonActions, {
        actions: [
          { label: '编辑', type: 'primary', onClick: () => editRow(row) },
          { label: '删除', type: 'danger', onClick: () => deleteRow(row) }
        ]
      })
    }
  }
]

const tableData = ref([])
const loading = ref(false)
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

function handlePageChange(page, pageSize) {
  pagination.value.page = page
  pagination.value.pageSize = pageSize
  loadData()
}

function handleSortChange(sortConfig) {
  console.log('排序配置:', sortConfig)
  loadData()
}

async function loadData() {
  loading.value = true
  try {
    // 模拟 API 请求
    const response = await fetch('/api/users')
    const data = await response.json()
    tableData.value = data.list
    pagination.value.total = data.total
  }
  catch (error) {
    console.error('加载数据失败:', error)
  }
  finally {
    loading.value = false
  }
}

function editRow(row) {
  console.log('编辑行:', row)
}

function deleteRow(row) {
  console.log('删除行:', row)
}
</script>

<template>
  <ProTable
    :columns="columns"
    :data="tableData"
    :loading="loading"
    :pagination="pagination"
    @page-change="handlePageChange"
    @sort-change="handleSortChange"
  />
</template>
```

#### ProSearchForm 搜索表单

```vue
<script setup>
import { ref } from 'vue'

const searchFields = [
  {
    label: '用户名',
    prop: 'username',
    type: 'input',
    placeholder: '请输入用户名'
  },
  {
    label: '状态',
    prop: 'status',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '正常', value: 'active' },
      { label: '禁用', value: 'inactive' }
    ]
  },
  {
    label: '创建时间',
    prop: 'dateRange',
    type: 'daterange',
    placeholder: ['开始日期', '结束日期']
  }
]

const searching = ref(false)

async function handleSearch(params) {
  searching.value = true
  try {
    console.log('搜索参数:', params)
    // 执行搜索逻辑
  }
  finally {
    searching.value = false
  }
}

function handleReset() {
  console.log('重置搜索')
}
</script>

<template>
  <ProSearchForm
    :fields="searchFields"
    :loading="searching"
    @search="handleSearch"
    @reset="handleReset"
  />
</template>
```

### 5. 布局组件示例

#### ProListPage 列表页面

```vue
<script setup>
// 组件逻辑
</script>

<template>
  <ProListPage title="用户管理">
    <template #actions>
      <el-button type="primary" @click="addUser">
        <el-icon><Plus /></el-icon>
        新增用户
      </el-button>
    </template>

    <ProSearchForm
      :fields="searchFields"
      @search="handleSearch"
    />

    <ProTable
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      @page-change="handlePageChange"
    />
  </ProListPage>
</template>
```

### 6. 样式定制

#### 使用 CSS 变量定制主题

```css
/* 在你的全局样式文件中 */
:root {
  --primary-color: #1890ff;
  --bg-color-white: #ffffff;
  --content-background: #f5f5f5;
  --background-active: #e6f7ff;
  --active-color: #1890ff;
  --text-color: #333333;
  --text-color-grey: #999999;
}
```

#### 覆盖组件样式

```css
/* 覆盖 ProTable 样式 */
.t-pro-table {
  --el-table-border-color: #e4e7ed;
  --el-table-header-bg-color: #fafafa;
}

/* 覆盖 ProSearchForm 样式 */
.t-pro-search-form {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### 7. 常见问题

#### Q: 样式没有生效？

A: 请确保：
1. 已正确引入样式文件 `import 'pro-el-components/style.css'`
2. 如果使用自动导入，请确保 ProElComponentsResolver 配置正确
3. 检查是否有其他样式覆盖了组件样式

#### Q: 组件无法自动导入？

A: 请检查：
1. 是否正确安装了 `unplugin-vue-components` 和 `unplugin-auto-import`
2. vite.config.js 中是否正确配置了 ProElComponentsResolver
3. 组件名是否以 `Pro` 开头

#### Q: 如何获取技术支持？

A:
1. 查看 [GitHub Issues](https://github.com/mingNeo/pro-el-components/issues)
2. 提交问题时请包含：
   - 组件版本
   - 使用的 Vue 版本
   - 完整的错误信息
   - 最小复现代码

### 8. 最佳实践

1. **性能优化**：使用按需导入或自动导入来减少打包体积
2. **类型安全**：结合 TypeScript 使用，获得更好的开发体验
3. **样式管理**：使用 CSS 变量进行主题定制，避免深度覆盖样式
4. **组件封装**：基于 pro-el-components 组件创建业务组件，提高复用性

---

## 总结

pro-el-components 提供了多种使用方式，你可以根据项目需求选择最合适的方式：

- **完整引入**：快速开始，适合功能丰富的项目
- **按需引入**：更好的性能，适合对体积敏感的项目
- **自动导入**：最佳开发体验，适合现代化的开发流程

无论选择哪种方式，都能享受到 pro-el-components 带来的高效开发体验。

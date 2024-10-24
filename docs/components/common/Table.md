# Table
基础Table 组件。

对element-plus 的Table组件扩充了以下功能：
- 当column.key的值为'actions'时，可以使用actions字段基于[LinkActions](../LinkActions/README.md)自动生成按钮列表。
- 可视化配置列显示隐藏、排序功能
- 拖拽并本地保存列宽
- 增加renderType与mapping用于使用内置方式格式化数据
- 设置autoHeight，或在ListPageContent组件中时，自动计算高度，铺满底部空间
- date、枚举、文件等类型，自动格式化显示

其他所有用法与a-table一致。

<script setup>
  import demo1 from 'components/common/Table/demos/demo1.vue'
  import demo1Code from 'components/common/Table/demos/demo1.vue?raw'
</script>
<demo :comp="demo1" :code="demo1Code" />
## 使用方法

```html
<script lang="ts" setup>
const data = ref([{
  name: '22',
}])

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '操作',
    key: 'actions',
    dataIndex: 'actions',
    width: 150,
    actions: [{
      text: '详情',
      onClick: handleShowDetail,
    }, {
      text: '编辑',
      onClick: handleEdit,
    }, {
      text: '删除',
      danger: true,
      onClick: (record: any) => handleDelete(record?.id),
      confirm: true,
      confirmText: '请确认是否删除？',
    }],
  },
]
</script>

<template>
  <table
    :columns="columns" :data="data" class="w-100%" :loading="loading"
    :pagination="pagination"
  />
</template>
```

actions也仍然可以使用slot方式，将与根据column.actions生成的列内容共存
```html
<template>
  <table
    :columns="columns" :data="data" class="w-100%" :loading="loading"
    :pagination="pagination"
  >
    <template #bodyCell="{ column, record }">
      <div v-if="column.key === 'actions'">
        <a @click="handleShowDetail(record, column)">详情</a>
      </div>
    </template>
  </table>
</template>
```

#### 动态分页请求
结合useTableList、useTablePage (url参数) 使用
```vue
<script setup>
import useTablePage from '@/composables/useTablePage'

const {
  data,
  loading,
  pagination,
  searchData,
  search: { submit, reset },
} = useTablePage(fetchData)

const searchFields = [/** ... */]
const columns = [/** ... */]
</script>

<template>
  <div>
    <SearchForm :fields="searchFields" :search="search" :default-value="searchData" />
    <table
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
    />
  </div>
</template>
```

#### 排序
```vue
<script setup>
import useTablePage from '@/composables/useTablePage'

const {
  data,
  loading,
  pagination,
  searchData,
  search: { submit, reset },
  onTableChange // 排序需要使用onTableChange
} = useTablePage(fetchData)

const searchFields = [/** ... */]
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    sorter: true // 配置sorter
  },
]
</script>

<template>
  <div>
    <SearchForm :fields="searchFields" :search="search" :default-value="searchData" />
    <table
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      @change="onTableChange"
    />
  </div>
</template>
```

## API
| 参数          | 说明                   | 类型    | 默认值 |
| ------------- | ---------------------- | ------- | ------ |
| columnSetting | 用于配置列的显示与隐藏 | boolean | false  |
| columns       | 表格列的配置           | array   | -      |
| data          | 表格数据               | array   | -      |
| loading       | 是否显示加载中         | boolean | false  |
| pagination    | 分页配置               | object  | -      |

### columns
| 参数                | 说明                                                                                | 类型                          | 默认值 |
| ------------------- | ----------------------------------------------------------------------------------- | ----------------------------- | ------ |
| title               | 列的标题                                                                            | string                        | -      |
| dataIndex           | 列数据在数据项中对应的路径                                                          | string                        | -      |
| key                 | 列的唯一标识                                                                        | string                        | -      |
| sorter              | 是否排序                                                                            | boolean                       | false  |
| width               | 列的宽度                                                                            | string                        | -      |
| fixed               | 列是否固定在左侧或者右侧                                                            | string                        | -      |
| customRender        | 用于自定义格式化内容                                                                | function                      | -      |
| renderType          | 使用内置格式化对应格式数据展示，如有customRender此配置无效                          | 'file' \| 'date' \| undefined | -      |
| mapping             | 用于映射的枚举数据集，使用与select组件的options同样格式。如有customRender此配置无效 | { label, value }[]            | -      |
| actions             | 操作列配置                                                                          | array                         | -      |
| actions.text        | 操作列的文本                                                                        | string                        | -      |
| actions.onClick     | 操作列的点击事件                                                                    | function                      | -      |
| actions.confirm     | 操作列的确认提示                                                                    | boolean                       | false  |
| actions.confirmText | 操作列的确认提示文本                                                                | string                        | -      |
| actions.danger      | 操作列是否标红高亮                                                                  | boolean                       | false  |

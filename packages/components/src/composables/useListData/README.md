## useListData

这是一个自定义 Hook，可用于管理包含分页和搜索功能的列表数据。使用 Vue3 的 Composition API 实现。

### 使用方法
需要用到searchFormRef及searchState，searchState也可自己定义，关联form model即可，无需传给该hook
``` html
<script setup>
import useListData from '@/composables/useListData'

const { searchFormRef, loading, currentPage, pageSize, total, listData, onSizeChange, onCurrentChange, pagination } = useListData(fetchData)
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      :model="searchState"
      name="advanced_search"
      class="search-form"
    >
      <el-form-item name="name" label="姓名">
        <el-input v-model:value="searchState.name" placeholder="placeholder" />
      </el-form-item>
      <el-button type="primary" html-type="submit" @click="() => submit()">
        搜索
      </el-button>
    </el-form>
    <el-table class="vp-raw w-full" v-loading="loading" :data="listData">
      <ElTableColumn prop="date" label="日期" width="180" />
      <ElTableColumn prop="name" label="姓名" width="180" />
      <ElTableColumn prop="address" label="地址" />
    </el-table>
    <el-pagination
      class="m-t-10px"
      :current-page="current"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[5, 10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
  </div>
</template>
```

### API
```javascript
const { data, loading } = useListData(service, configs)
```

#### configs
| 参数              | 类型                  | 默认值                            | 描述                                |
| ----------------- | --------------------- | --------------------------------- | ----------------------------------- |
| immediate         | boolean               | true                              | 是否在加载时立即获取数据            |
| form              | -                     |                                   | form表单实例, 如不传则自动生成      |
| defaultSearchData | object                | {}                                | 默认的搜索数据                      |
| defaultPageSize   | number                | 10                                | 默认每页显示的行数                  |
| getTotal          | (data: any) => number | (data: any) => data?.value?.total | 定义如何获取请求返回列表数据的total |
| getList           | (data: any) => any[]  | (data: any) => data?.value?.data  |                                     | [] | 定义如何获取请求返回列表数据的total |
| onReset           | () => any             |                                   | 自定义清空处理                      |
| mergeData         | () => any             |                                   | 自定义清空处理                      |

### 返回值

| 参数            | 类型                                                                               | 描述                                                                 |
| --------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| searchState     | computed<Record<string, any>>                                                      | 当前页搜索表单state，可选                                            |
| listData        | computed<ListData[]>                                                               | 当前页表格数据源                                                     |
| fetchData       | Function                                                                           | 用于手工请求并触发刷新, 如需重置请求参数并请求可直接调用search.reset |
| loadNextPage    | Function                                                                           | 加载下一页数据, 通常设置mergeData为true，用于动态下滑加载下一页等    |
| loading         | boolean                                                                            | 表示数据是否正在加载                                                 |
| onSortChange    | (page: { pageSize: number; current: number; }, _filters: any, sorter: any) => void | 列表页change, 见Element-plus，通常只有在需要排序时需要用到           |
| currentPage     | number                                                                             | 当前页码                                                             |
| pageSize        | number                                                                             | 每页显示的行数                                                       |
| total           | number                                                                             | 数据总数                                                             |
| onCurrentChange | function                                                                           | 当页码改变时的回调函数                                               |
| onSizeChange    | function                                                                           | 当每页行数改变时的回调函数                                           |
| reset           | function                                                                           | 用于重置搜索表单的函数                                               |
| search.submit   | function                                                                           | 用于提交搜索表单的函数                                               |
| search.reset    | function                                                                           | 用于重置搜索表单的函数                                               |
| searchFormRef   | ref                                                                                | 当前搜索表单ref                                                      |

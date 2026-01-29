const n=`<script setup lang="ts">
import { ProTable, useTableList, useTableSelection } from 'pro-el-components'
import { ref } from 'vue'

// 模拟 API 请求
async function fetchData({ pageNo, pageSize }: { pageNo: number, pageSize: number }) {
  const allData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: \`用户 \${i + 1}\`,
    age: 20 + (i % 30),
    city: ['北京', '上海', '广州', '深圳'][i % 4],
  }))

  return {
    total: allData.length,
    data: allData.slice((pageNo - 1) * pageSize, pageNo * pageSize),
  }
}

// 使用列表 hooks
const { data, loading, pagination } = useTableList(fetchData, {
  defaultPageSize: 10,
})

// 表格引用
const tableRef = ref()

// 使用选择 hooks
const {
  selectedRows,
  handleSelect,
  handleSelectAll,
  clearSelection,
} = useTableSelection({
  tableRef,
  data,
  loading,
  idKey: 'id',
  onChange: (rows) => {
    console.log('已选中:', rows.length, '条数据', rows)
  },
})

// 列配置
const columns = [
  { type: 'selection' },
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'city', label: '城市' },
]
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-header">
      <div>已选中: <strong>{{ selectedRows.length }}</strong> 条</div>
      <el-button @click="clearSelection">
        清空选择
      </el-button>
    </div>

    <ProTable
      ref="tableRef"
      :data="data"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      @select="handleSelect"
      @select-all="handleSelectAll"
    />

    <div class="demo-footer">
      <h4>选中的数据:</h4>
      <pre>{{ selectedRows }}</pre>
    </div>
  </div>
</template>

<style scoped>
  .demo-container {
    padding: 16px;
  }

  .demo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 4px;
  }

  .demo-footer {
    margin-top: 16px;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 4px;
  }

  .demo-footer h4 {
    margin: 0 0 8px 0;
  }

  .demo-footer pre {
    margin: 0;
    padding: 8px;
    background: white;
    border-radius: 4px;
    max-height: 200px;
    overflow: auto;
  }
</style>
`;export{n as default};

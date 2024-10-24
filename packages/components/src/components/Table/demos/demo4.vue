<script lang="ts" setup>
import { ElButton, ElSwitch, ElTableColumn, ElTag } from 'element-plus'
import { ref } from 'vue'
import ProTable from '../index.vue'

// 表格数据
const tableData = ref([
  {
    id: 1,
    date: '2024-01-20',
    name: '张三',
    address: '上海市普陀区金沙江路 1518 弄',
    status: 'active',
    tags: ['开发', '前端'],
    amount: 1234.56,
  },
  {
    id: 2,
    date: '2024-01-21',
    name: '李四',
    address: '上海市浦东新区世纪大道 123 号',
    status: 'inactive',
    tags: ['设计', 'UI'],
    amount: 2345.67,
  },
  {
    id: 3,
    date: '2024-01-22',
    name: '王五',
    address: '北京市朝阳区望京SOHO',
    status: 'active',
    tags: ['产品', '管理'],
    amount: 3456.78,
  },
  {
    id: 4,
    date: '2024-01-23',
    name: '赵六',
    address: '深圳市南山区科技园',
    status: 'active',
    tags: ['测试', 'QA'],
    amount: 4567.89,
  },
])

// 选中的行
const multipleSelection = ref<any[]>([])

// 处理选择变化
function handleSelectionChange(val: any[]) {
  multipleSelection.value = val
  console.log('选中的数据:', val)
}

// 编辑行
function handleEdit(index: number, row: any) {
  console.log('编辑:', index, row)
}

// 删除行
function handleDelete(index: number, row: any) {
  console.log('删除:', index, row)
  tableData.value.splice(index, 1)
}

// 切换状态
function handleStatusChange(val: boolean, row: any) {
  row.status = val ? 'active' : 'inactive'
  console.log('状态变更:', row)
}

// 分页配置（使用 ProTable 的内置分页）
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 50,
})
</script>

<template>
  <div class="demo-container">
    <div class="mb-4">
      <ElButton size="small" :disabled="multipleSelection.length === 0">
        批量删除 ({{ multipleSelection.length }})
      </ElButton>
    </div>

    <!-- 完全兼容 Element Plus 原生写法 -->
    <!-- 只需将 等同ElTable 替换为 ProTable，即可享受额外功能 -->
    <ProTable
      :data="tableData"
      :pagination="pagination"
      column-setting
      border
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- 使用Element Plus 的TableColumn组件 -->
      <ElTableColumn type="selection" width="55" />

      <ElTableColumn type="index" label="序号" width="60" />

      <ElTableColumn prop="date" label="日期" width="120" sortable />

      <ElTableColumn prop="name" label="姓名" width="100">
        <template #default="{ row }">
          <ElTag type="info">
            {{ row.name }}
          </ElTag>
        </template>
      </ElTableColumn>

      <ElTableColumn prop="address" label="地址" show-overflow-tooltip />

      <ElTableColumn prop="tags" label="标签" width="200">
        <template #default="{ row }">
          <ElTag
            v-for="tag in row.tags"
            :key="tag"
            class="mr-1"
            size="small"
          >
            {{ tag }}
          </ElTag>
        </template>
      </ElTableColumn>

      <ElTableColumn prop="amount" label="金额" width="120" sortable>
        <template #default="{ row }">
          <span class="text-primary">¥{{ row.amount.toFixed(2) }}</span>
        </template>
      </ElTableColumn>

      <ElTableColumn prop="status" label="状态" width="100">
        <template #default="{ row }">
          <ElSwitch
            v-model="row.status"
            active-value="active"
            inactive-value="inactive"
            @change="(val) => handleStatusChange(val, row)"
          />
        </template>
      </ElTableColumn>

      <ElTableColumn fixed="right" label="操作" width="150">
        <template #default="{ row, $index }">
          <ElButton
            link
            type="primary"
            size="small"
            @click="handleEdit($index, row)"
          >
            编辑
          </ElButton>
          <ElButton
            link
            type="danger"
            size="small"
            @click="handleDelete($index, row)"
          >
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </ProTable>
  </div>
</template>

<style scoped>
  .demo-container {
    padding: 20px;
  }

  .text-primary {
    color: #409eff;
    font-weight: 500;
  }
</style>

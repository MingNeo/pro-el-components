const n=`<script lang="ts" setup>
import { ElButton, ElTableColumn, ElTag } from 'element-plus'
import { ref } from 'vue'
import ProTable from '../index.vue'

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '产品 A',
    category: 'electronics',
    price: 299.99,
    stock: 150,
    status: 1,
    createTime: new Date('2024-01-20'),
  },
  {
    id: 2,
    name: '产品 B',
    category: 'clothing',
    price: 59.99,
    stock: 0,
    status: 0,
    createTime: new Date('2024-01-19'),
  },
  {
    id: 3,
    name: '产品 C',
    category: 'food',
    price: 19.99,
    stock: 500,
    status: 1,
    createTime: new Date('2024-01-18'),
  },
])

// 状态枚举
const statusOptions = [
  { label: '下架', value: 0, type: 'danger' },
  { label: '在售', value: 1, type: 'success' },
]

// 分类枚举
const categoryOptions = [
  { label: '电子产品', value: 'electronics' },
  { label: '服装', value: 'clothing' },
  { label: '食品', value: 'food' },
]

// 使用配置式定义部分列
const columns = [
  {
    label: '分类',
    prop: 'category',
    renderAs: 'enum',
    fieldProps: {
      options: categoryOptions,
    },
  },
  // 价格和库存将使用模板式定义
  {
    label: '状态',
    prop: 'status',
    renderAs: 'enum',
    fieldProps: {
      options: statusOptions,
      type: 'tag',
    },
  },
  {
    label: '创建时间',
    prop: 'createTime',
    renderAs: 'date',
    fieldProps: {
      format: 'YYYY-MM-DD',
    },
  },
  // 操作列将使用模板式定义
]

// 操作处理
function handleEdit(row: any) {
  console.log('编辑产品:', row)
}

function handleDelete(row: any) {
  console.log('删除产品:', row)
}

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 100,
})
<\/script>

<template>
  <div class="demo-container">
    <h3 class="mb-4">
      混合使用：配置式列 + 模板式列
    </h3>

    <!-- 混合使用配置式和模板式列定义 -->
    <ProTable
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      border
      table-id="demo5"
    >
      <!-- 使用模板式定义产品名称列（排在columns配置之前） -->
      <ElTableColumn prop="name" label="产品名称" width="150">
        <template #default="{ row }">
          <div class="flex items-center">
            <ElTag size="small" class="mr-2">
              {{ row.id }}
            </ElTag>
            <span class="font-bold">{{ row.name }}</span>
          </div>
        </template>
      </ElTableColumn>

      <!-- 使用模板式定义价格列 -->
      <ElTableColumn prop="price" label="价格" width="120" sortable>
        <template #default="{ row }">
          <span class="text-primary font-bold">
            ¥{{ row.price.toFixed(2) }}
          </span>
        </template>
      </ElTableColumn>

      <!-- 使用模板式定义库存列 -->
      <ElTableColumn prop="stock" label="库存" width="100" sortable>
        <template #default="{ row }">
          <ElTag
            :type="row.stock > 0 ? 'success' : 'danger'"
            effect="plain"
          >
            {{ row.stock > 0 ? \`\${row.stock} 件\` : '缺货' }}
          </ElTag>
        </template>
      </ElTableColumn>

      <!-- 使用模板式定义操作列 -->
      <ElTableColumn fixed="right" label="操作" width="150">
        <template #default="{ row }">
          <ElButton
            link
            type="primary"
            size="small"
            @click="handleEdit(row)"
          >
            编辑
          </ElButton>
          <ElButton
            link
            type="danger"
            size="small"
            @click="handleDelete(row)"
          >
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </ProTable>

    <div class="mt-4 text-gray-500 text-sm">
      <p>💡 提示：</p>
      <ul class="list-disc pl-6">
        <li>配置式列：ID、产品图片、分类、状态、创建时间</li>
        <li>模板式列：产品名称、价格、库存、操作</li>
        <li>所有列都可以通过列配置按钮进行显示/隐藏控制</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
  .demo-container {
    padding: 20px;
  }

  .text-primary {
    color: #409eff;
  }

  .font-bold {
    font-weight: 600;
  }

  .text-gray-500 {
    color: #909399;
  }
</style>
`;export{n as default};

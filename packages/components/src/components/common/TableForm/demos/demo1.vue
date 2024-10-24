<script setup>
const data = ref([
  {
    sortIndex: 0,
    name: '111',
    gender: 'male',
  },
  {
    sortIndex: 1,
    name: '22',
    gender: 'female',
    phone: '122222',
  },
  {
    sortIndex: 2,
    name: '33',
    gender: 'male',
    createAt: Date.now(),
  },
])

const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 100,
    customCell: (_, index) => ({
      rowSpan: index === 2 ? 2 : index === 3 ? 0 : 1,
    }),
  },
  {
    title: '姓名',
    dataIndex: 'name',
    type: 'input',
    width: 100,
    required: true,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    type: 'number',
    width: 100,
    // customCell: () => ({ rowSpan: 0 }),
  },
  {
    title: '电话',
    dataIndex: 'phone',
    type: 'text',
    width: 100,
  },
  {
    title: '性别',
    dataIndex: 'gender',
    type: 'select',
    width: 100,
    fieldProps: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
  },
  {
    title: '注册时间',
    dataIndex: 'createAt',
    type: 'datePicker',
    width: 200,
  },
])

const viewMode = ref()

function toggleMode() {
  viewMode.value = !viewMode.value
}
</script>

<template>
  <div>
    <div>表单数据: {{ JSON.stringify(data) }}</div>
    <el-button @click="toggleMode">
      {{ !viewMode ? '改为查看模式' : '改为编辑模式' }}
    </el-button>
    <TableForm v-model="data" draggable :columns="columns" :view-mode="viewMode" />
  </div>
</template>

const n=`<script lang="ts" setup>
import { ref } from 'vue'
import ProTable from '../index.vue'

const dataSource = ref(Array.from({ length: 10 }).fill(0).map((_, index) => ({
  name: \`用户\${index}\`,
  status: Math.random() > 0.5 ? 'enabled' : 'disabled',
  createdAt: new Date(),
})))

const columns = [
  { label: '姓名', prop: 'name' },
  {
    label: '状态',
    prop: 'status',
    renderAs: 'enum',
    fieldProps: {
      options: [{
        label: '启用',
        value: 'enabled',
        status: 'success', // 配置status则显示状态样式
      }, {
        label: '禁用',
        value: 'disabled',
        status: 'error',
      }],
    },
  },
  { label: '创建时间', prop: 'createdAt', renderAs: 'date', fieldProps: { format: 'YYYY-MM-DD HH:mm:ss' } },
  {
    label: '操作',
    prop: 'actions',
    columnType: 'actions',
    width: 150,
    // actions可以是个函数，返回一个Action数组
    actions: (record: any) => [{
      text: '详情',
      onClick: () => { },
    }, {
      text: '编辑',
      onClick: () => { },
    }, record.status === 'enabled'
      ? {
          text: '禁用',
          danger: true,
          onClick: (_record: any) => { },
          confirm: true,
          confirmText: '请确认是否禁用？',
        }
      : {
          text: '启用',
          onClick: (_record: any) => { },
        }],
  },
]
<\/script>

<template>
  <ProTable table-id="demo2" :columns="columns" :data="dataSource" class="w-full" column-setting />
</template>
`;export{n as default};

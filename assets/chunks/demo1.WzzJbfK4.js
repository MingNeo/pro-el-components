const n=`<script lang="ts" setup>
import type { ButtonAction } from '../../ButtonActions/types'
import { ref } from 'vue'
import ProTable from '../index.vue'

const dataSource = ref(Array.from({ length: 5 }).fill(0).map((_, index) => ({
  name: \`用户\${index}\`,
  phone: \`\${13200000000 + index}\`,
})))

const columns = [
  { label: '姓名', prop: 'name' },
  { label: '电话', prop: 'phone' },
  {
    label: '操作',
    prop: 'actions',
    columnType: 'actions',
    width: 150,
    maxCount: 2,
    actions: [{
      text: '详情',
      onClick: () => { },
    }, {
      text: '编辑',
      onClick: () => { },
    }, {
      text: '删除',
      danger: true,
      onClick: (_record: any) => { },
      confirm: true,
      confirmText: '请确认是否删除？',
    }, {
      text: '测试按钮1',
      onClick: (_record: any) => { },
    }, {
      text: '测试按钮2',
      onClick: (_record: any) => { },
    }],
  },
]

const tableActions: ButtonAction[] = [
  {
    text: '新增',
    type: 'primary',
    onClick: () => { },
  },
]
<\/script>

<template>
  <ProTable table-id="demo1" :columns="columns" :data="dataSource" class="w-full" column-setting :actions="tableActions" />
</template>
`;export{n as default};

const n=`<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'
import TableModal from '../index.vue'

const data = Array.from({ length: 20 }).fill('').map((v, i) => ({
  gender: Math.round(Math.random()) ? '男' : '女',
  name: \`用户\${i + 1}\`,
  nickname: \`用户\${i + 1}\`,
  phone: '132xxxxxxxxx',
  userId: i + 1,
}))
async function getUserList(params: Record<string, any>) {
  await new Promise(resolve => setTimeout(resolve, 100))
  return {
    data: ['name', 'gender', 'phone'].reduce((prev, cur) => {
      return params[cur] ? prev.filter((item: any) => item[cur].includes(params[cur])) : prev
    }, data),
    total: data.length,
  }
}

const visible = ref(false)

const columns = [
  {
    label: 'id',
    prop: 'userId',
    key: 'userId',
  },
  {
    label: '姓名',
    prop: 'name',
    key: 'name',
  },
]
<\/script>

<template>
  <div class="p-4">
    <ElButton @click="visible = true">
      显示弹窗
    </ElButton>
    <TableModal
      v-model="visible"
      title="选择用户"
      :width="600"
      :service="getUserList"
      :columns="columns"
    />
  </div>
</template>
`;export{n as default};

const n=`<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'
import ModalSelector from '../index.vue'

const data = Array.from({ length: 20 }).fill('').map((v, i) => ({
  gender: Math.round(Math.random()) ? '男' : '女',
  name: \`用户\${i + 1}\`,
  nickname: \`用户\${i + 1}\`,
  phone: '132xxxxxxxxx',
  userId: i + 1,
}))
async function getUserList(params: Record<string, any>) {
  return {
    data: ['name', 'gender', 'phone'].reduce((prev, cur) => {
      return params[cur] ? prev.filter((item: any) => item[cur].includes(params[cur])) : prev
    }, data),
    total: data.length,
  }
}
// import { getUserList } from '@/api/user'

const visible = ref(false)
const value = ref([])

const searchFields = [
  {
    label: '姓名',
    prop: 'username',
    type: 'input',
  },
  {
    label: '手机号',
    prop: 'phoneNumber',
    type: 'input',
    fieldProps: {
      placeholder: '请输入手机号',
    },
  },
  {
    label: '性别',
    prop: 'gender',
    type: 'select',
    options: [
      { label: '男', value: '男' },
      { label: '女', value: '女' },
    ],
  },
]

const columns = [
  {
    label: 'id',
    prop: 'userId',
  },
  {
    label: '用户名',
    prop: 'username',
  },
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '手机号',
    prop: 'phoneNumber',
  },
  {
    label: '性别',
    prop: 'gender',
  },
]
<\/script>

<template>
  <div class="flex items-center">
    <ElButton @click="visible = true">
      {{ value?.length ? value.map((v: any) => v.name).join(',') : '请选择' }}
    </ElButton>
    <ModalSelector
      v-model="visible"
      :value="value" :width="800" :search-fields="searchFields" :service="getUserList"
      :columns="columns" row-key="userId" @confirm="(v: any) => { value = v }"
    />
  </div>
</template>
`;export{n as default};

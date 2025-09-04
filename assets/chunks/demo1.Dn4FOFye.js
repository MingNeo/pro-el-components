const n=`<script setup>
import { ElForm, ElSwitch } from 'element-plus'
import { ref } from 'vue'
import TableForm from '../index.vue'

const data = ref({
  formData: [
    {
      name: '111',
      gender: 'male',
    },
    {
      name: '22',
      gender: 'female',
      phone: '122222',
    },
    {
      name: '33',
      gender: 'male',
      createAt: Date.now(),
    },
  ],
})

const columns = ref([
  {
    label: '姓名',
    prop: 'name',
    type: 'input',
    width: 140,
    required: true,
  },
  {
    label: '年龄',
    prop: 'age',
    type: 'number',
    width: 160,
  },
  {
    label: '性别',
    prop: 'gender',
    type: 'select',
    width: 140,
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
  {
    label: '注册时间',
    prop: 'createAt',
    type: 'datePicker',
    width: 200,
  },
])

const viewMode = ref()
<\/script>

<template>
  <div>
    <ElSwitch v-model="viewMode" class="mb-2" active-text="预览" inactive-text="编辑" />
    <ElForm :model="data" layout="vertical">
      <TableForm v-model="data.formData" prop-prefix="formData" :columns="columns" :view-mode="viewMode" />
    </ElForm>

    <div>
      表单数据:
      <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
  </div>
</template>
`;export{n as default};

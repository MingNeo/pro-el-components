const n=`<script lang="ts" setup>
import { ElButton } from 'element-plus'
import { reactive, ref } from 'vue'
import ModalForm from '../index.vue'

const showModal = ref(false)

const fields = [
  {
    prop: 'name',
    label: '用户名',
    required: true,
  },
  {
    prop: 'age',
    label: '年龄',
    type: 'number',
    required: true,
  },
  {
    prop: 'address',
    label: '地址',
    type: 'textarea',
    rules: [{ required: true, message: '请输入地址' }],
  },
]

const formData = reactive({
  name: '',
  age: '',
  address: '',
})

function handleSubmit(value: any) {
  // eslint-disable-next-line no-console
  console.log('submit', value)
  showModal.value = false
}
<\/script>

<template>
  <div class="p-2">
    <ElButton @click="showModal = true">
      创建用户
    </ElButton>
  </div>

  <ModalForm
    v-model="showModal"
    title="创建用户"
    :fields="fields"
    :default-value="formData"
    @ok="handleSubmit"
  />
</template>
`;export{n as default};

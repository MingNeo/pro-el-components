const e=`<script setup>
import { ElButton, ElCard, ElForm, ElMessage, ElStep, ElSteps } from 'element-plus'
import { ref } from 'vue'
import ProFormFields from '../index.vue'
import CountrySelectorField from './CountrySelectorField.vue'

const formRef = ref()

const data = ref({
  name: '',
  gender: '',
  phone: '',
})

const fields1 = ref([
  {
    label: '姓名',
    prop: 'name',
    type: 'input',
    // required: true,
    rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  },
])

const fields2 = ref([
  {
    label: '电话',
    prop: 'phone',
    type: 'input',
  },
  {
    label: '性别',
    prop: 'gender',
    type: 'select',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
])

const fields3 = ref([{
  label: '国家',
  prop: 'country',
  type: 'component',
  component: CountrySelectorField,
}])

const activeKey = ref(0)

async function goToNext() {
  if (activeKey.value === 0) {
    const result = await formRef.value.validateField(fields1.value.map(v => v.prop), valid => valid)

    if (!result)
      return
  }

  activeKey.value++
}
<\/script>

<template>
  <ElCard header="Steps表单示例">
    <ElSteps :active="activeKey">
      <ElStep title="Step 1" />
      <ElStep title="Step 2" />
      <ElStep title="Step 3" />
    </ElSteps>

    <div class="p-[20px]">
      <ElForm ref="formRef" :model="data">
        <ProFormFields v-if="activeKey === 0" v-model="data" :column="2" :fields="fields1" />
        <ProFormFields v-if="activeKey === 1" v-model="data" :column="2" :fields="fields2" />
        <ProFormFields v-if="activeKey === 2" v-model="data" :column="2" :fields="fields3" />
        <div class="mt-[20px] text-right">
          <ElButton v-if="activeKey > 0" class="mr-[8px]" @click="activeKey--">
            上一步
          </ElButton>
          <ElButton v-if="activeKey < 2" type="primary" @click="goToNext">
            下一步
          </ElButton>
          <ElButton
            v-else
            type="primary"
            @click="ElMessage.success('Processing complete!')"
          >
            完成
          </ElButton>
        </div>
      </ElForm>
    </div>

    <h5 class="mt-4">
      FormData:
    </h5>
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
  </ElCard>
</template>
`;export{e as default};

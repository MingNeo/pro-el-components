const n=`<script setup lang="ts">
import { ElButton, ElForm } from 'element-plus'
import { computed, markRaw, ref, watch } from 'vue'
import ProFormFields from '../index.vue'
import { treeData as treeDataExample } from './constant'
import CountrySelectorField from './CountrySelectorField.vue'
import RatingsField from './RatingsField.vue'

const props = defineProps<{
  column: number
  viewMode: boolean
}>()

const emit = defineEmits<{
  (e: 'change', data: any): void
}>()

const formRef = ref()

const data = ref({
  name: '',
  gender: 'male',
  phone: '',
})

const treeData = ref(treeDataExample)

const formItemProps = {
  labelWidth: '100px',
  labelPosition: 'left',
} as const

const fields = computed(() => [
  {
    label: '姓名',
    prop: 'name',
    type: 'input',
    required: true,
  },
  {
    label: '年龄',
    prop: 'age',
    type: 'number',
    column: props.column === 1 ? 2 : props.column,
  },
  {
    label: '性别',
    prop: 'gender',
    type: 'select',
    column: props.column === 1 ? 2 : props.column,
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
  {
    label: '电话',
    prop: 'phone',
    type: 'input',
    rules: [{
      pattern: /^\\d{11}$/,
      message: '请输入正确的电话号码',
    }, {
      required: true,
      message: '请输入电话号码',
    }],
  },
  {
    label: '加入时间',
    prop: 'joinTime',
    type: 'datePicker',
    fieldProps: {
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    label: '测试',
    prop: 'test',
    type: 'slider',
    fieldProps: {
      min: 0,
      max: 100,
      step: 1,
    },
  },
  {
    label: '部门',
    prop: 'tree',
    type: 'treeSelect',
    fieldProps: {
      data: treeData.value,
    },
  },
  // 自定义组件
  {
    label: '国家',
    prop: 'country',
    type: 'component',
    component: markRaw(CountrySelectorField),
  },
  // 自定义组件
  {
    label: '评分矩阵',
    prop: 'rate',
    type: 'component',
    // 在computed中，使用markRaw来标记组件，优化性能
    component: markRaw(RatingsField),
    column: 1,
    fieldProps: {
      dimensions: [
        { key: 'pm', name: '沟通', description: '沟通能力' },
        { key: 'ps', name: '审美', description: '审美能力' },
      ],
    },
  },
])

function handleSubmit() {
  formRef.value.validate((valid: any) => {
    console.log(valid)
  })
}

watch(data, (val: any) => {
  emit('change', val)
}, { deep: true, immediate: true })
<\/script>

<template>
  <ElForm ref="formRef" :model="data" label-width="auto">
    <ProFormFields v-model="data" :column="props.column" :view-mode="props.viewMode" :fields="fields" :form-item-props="formItemProps" />
    <ElButton class="mt-[10px]" type="primary" @click="handleSubmit">
      submit
    </ElButton>
  </ElForm>
</template>
`;export{n as default};

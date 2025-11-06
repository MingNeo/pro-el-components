<script setup>
import { ElButton, ElCard, ElForm, ElFormItem, ElInput } from 'element-plus'
import { markRaw, ref } from 'vue'
import ProFormFields from '../index.vue'
import CountrySelectorField from './CountrySelectorField.vue'

const formData = ref({
  name: 'klose',
  age: 12,
  country: '',
})

const fields1 = ref([
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
  },
])

const fields2 = ref([{
  label: '国家',
  prop: 'country',
  type: 'component',
  // 在computed中，使用markRaw来标记组件，优化性能
  component: markRaw(CountrySelectorField),
}])
</script>

<template>
  <ElCard header="自由组合">
    <ElForm :model="formData">
      <ProFormFields v-model="formData" :column="3" :fields="fields1" />
      <h3 class="my-4 text-[40px] color-red">
        中间我插个html元素
      </h3>
      <ProFormFields v-model="formData" :column="3" :fields="fields2" />
      <p class="mb-4">
        再来个普通的el-form-item
      </p>
      <ElFormItem label="备注">
        <ElInput v-model="formData.remark" type="textarea" />
      </ElFormItem>
      <ElButton type="primary" html-type="submit">
        submit
      </ElButton>
    </ElForm>
  </ElCard>
</template>

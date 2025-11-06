<script lang="ts" setup>
import { ElForm, ElSwitch } from 'element-plus'
import { ref } from 'vue'
import ProField from '../index.vue'

const formData = ref({
  text: '',
  number: 0,
  password: '',
  date: '',
  dateRange: [],
  select: null,
  multipleSelect: null,
  rate: null,
  radio: null,
  checkbox: [],
  color: null,
  cascader: null,
  image: 'https://picsum.photos/200/100?random=1',
  file: [{
    name: '文件1',
    url: 'https://picsum.photos/200/100?random=1',
  }],
})
const viewMode = ref(false)
</script>

<template>
  <ElForm class="demo-container">
    <ElSwitch v-model="viewMode" active-text="预览" inactive-text="编辑" />
    <ProField
      v-model="formData.text"
      label="文本"
      prop="text"
      field-type="input"
      :view-mode="viewMode"
      :field-props="{ placeholder: '请输入文本' }"
    />

    <ProField
      v-model="formData.number"
      label="数字"
      prop="number"
      field-type="number"
      :view-mode="viewMode"
      :field-props="{ placeholder: '请输入数字' }"
    />

    <ProField
      v-model="formData.password"
      label="密码"
      prop="password"
      field-type="password"
      :view-mode="viewMode"
      :field-props="{ placeholder: '请输入密码' }"
    />

    <ProField
      v-model="formData.date"
      label="日期"
      prop="date"
      field-type="date"
      :view-mode="viewMode"
      :field-props="{ placeholder: '请选择日期' }"
    />

    <ProField
      v-model="formData.dateRange"
      label="日期区间"
      prop="dateRange"
      field-type="dateRange"
      :view-mode="viewMode"
      :field-props="{ placeholder: '请选择日期' }"
    />

    <ProField
      v-model="formData.select"
      label="下拉单选"
      prop="select"
      field-type="select"
      :view-mode="viewMode"
      :field-props="{ placeholder: '请选择', options: [{ label: '选项1', value: 1 }, { label: '选项2', value: 2 }] }"
    />

    <ProField
      v-model="formData.multipleSelect"
      label="下拉多选"
      prop="multipleSelect"
      field-type="select"
      :view-mode="viewMode"
      :field-props="{ placeholder: '请选择', multiple: true, options: [{ label: '选项1', value: 1 }, { label: '选项2', value: 2 }] }"
    />

    <ProField
      v-model="formData.rate"
      label="评分"
      prop="rate"
      field-type="rate"
      :view-mode="viewMode"
    />

    <ProField
      v-model="formData.radio"
      label="单选"
      prop="radio"
      field-type="radio"
      :view-mode="viewMode"
      :field-props="{ options: [{ label: '选项1', value: 1 }, { label: '选项2', value: 2 }] }"
    />

    <ProField
      v-model="formData.checkbox"
      label="多选"
      prop="checkbox"
      field-type="checkbox"
      :view-mode="viewMode"
      :field-props="{ options: [{ label: '选项1', value: 1 }, { label: '选项2', value: 2 }] }"
    />

    <ProField
      v-model="formData.color"
      label="颜色"
      prop="color"
      field-type="color"
      :view-mode="viewMode"
    />

    <ProField
      v-model="formData.cascader"
      label="级联"
      prop="cascader"
      field-type="cascader"
      :view-mode="viewMode"
    />

    <ProField
      v-model="formData.image"
      label="图片"
      prop="image"
      field-type="image"
      :view-mode="viewMode"
    />

    <ProField
      v-model="formData.file"
      label="文件"
      prop="file"
      field-type="file"
      :view-mode="viewMode"
    />
  </ElForm>
  <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
</template>

<style scoped>
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>

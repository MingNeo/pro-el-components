<script setup>
import { ElCard, ElRadioButton, ElRadioGroup, ElSwitch } from 'element-plus'
import { computed, ref } from 'vue'
import ProSearchForm from '../index.vue'

const showLabel = ref(false)
const column = ref(2)
const inline = ref(false)
const fields = computed(() => [
  {
    label: '用户名',
    prop: 'username',
    type: 'input',
    fieldProps: {
      placeholder: '请输入用户名',
    },
  },
  {
    label: '性别',
    prop: 'gender',
    type: 'select',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
    fieldProps: {
      placeholder: '请选择性别',
      class: inline.value ? 'min-w-[100px]' : '', // 用于 inline 模式下，设置最小宽度
    },
  },
  {
    label: '创建时间',
    prop: 'createdDate',
    type: 'rangePicker',
    mappingProp: ['createdDateStart', 'createdDateEnd'], // 将单条搜索字段映射为多字段
    fieldProps: {
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      class: inline.value ? 'max-w-[180px]' : '', // 用于 inline 模式下，设置最小宽度
    },
  },
  {
    label: '测试1',
    prop: 'test1',
    type: 'input',
    fieldProps: {
      placeholder: '请输入测试1',
    },
  },
  {
    label: '测试2',
    prop: 'test2',
    type: 'input',
    fieldProps: {
      placeholder: '请输入测试2',
    },
  },
  {
    label: '测试3',
    prop: 'test3',
    type: 'input',
    fieldProps: {
      placeholder: '请输入测试3',
    },
  },
])
</script>

<template>
  <ElCard class="flex flex-col gap-3">
    <template #header>
      <div class="flex items-center gap-2">
        <span>显示label</span>
        <ElSwitch v-model="showLabel" />
        <span>列数</span>
        <ElRadioGroup v-model="column" size="small">
          <ElRadioButton label="2" :value="2" />
          <ElRadioButton label="3" :value="3" />
          <ElRadioButton label="4" :value="4" />
        </ElRadioGroup>
        <span>Inline</span>
        <ElSwitch v-model="inline" size="small" />
      </div>
    </template>
    <h4 class="my-3">
      默认
    </h4>
    <ProSearchForm :fields="fields" :show-label="showLabel" :form-props="{ inline }" :column="column" class="border border-solid border-gray-200 rounded-md px-3 pt-3 pb-[2px]" />

    <h4 class="my-3">
      超过一行收起
    </h4>
    <ProSearchForm :fields="fields" :collapsible="true" :show-label="showLabel" :column="column" class="border border-solid border-gray-200 rounded-md px-3 pt-3 pb-[2px]" />

    <h4 class="my-3">
      指定收起时展示的字段
    </h4>
    <ProSearchForm :fields="fields" :collapsible="true" :collapsed-fields="['username']" :show-label="showLabel" :column="column" class="border border-solid border-gray-200 rounded-md px-3 pt-3 pb-[2px]" />
  </ElCard>
</template>

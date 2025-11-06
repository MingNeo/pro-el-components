const e=`<script setup lang="ts">
import { ElSwitch } from 'element-plus'
import { ref } from 'vue'
import ProCheckbox from '../index.vue'
import getData from './mock'

const value = ref()
const selectedValues = ref([])
const options = ref([{
  label: '选项1',
  value: '1',
}, {
  label: '选项2',
  value: '2',
}])
const viewMode = ref(false)
<\/script>

<template>
  <div class="p-2">
    <ElSwitch v-model="viewMode" class="mb-2" active-text="预览" inactive-text="编辑" />
    <div class="flex flex-col gap-2">
      <label>直接设置options: </label>
      <ProCheckbox
        v-model="value"
        :options="options"
        :view-mode="viewMode"
      />
      <label>通过service设置options: </label>
      <ProCheckbox
        v-model="selectedValues"
        :service="getData"
        :view-mode="viewMode"
      />
    </div>
  </div>
</template>
`;export{e as default};

<script setup lang="ts">
import { ref } from 'vue'
import Checkbox from '../index.vue'
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
</script>

<template>
  <div class="p-2">
    <el-switch v-model="viewMode" class="mb-2" active-text="预览" inactive-text="编辑" />
    <div class="flex flex-col gap-2">
      <label>直接设置options: </label>
      <Checkbox
        v-model="value"
        :options="options"
        :view-mode="viewMode"
      />
      <label>通过service设置options: </label>
      <Checkbox
        v-model="selectedValues"
        :service="getData as any"
        :view-mode="viewMode"
      />
    </div>
  </div>
</template>

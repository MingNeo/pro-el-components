<script setup lang="ts">
import { ElSwitch } from 'element-plus'
import { ref } from 'vue'
import ProCascader from '../index.vue'
import getData from './mock'

const value = ref('efficiency')
const multipleValue = ref(['side nav', 'basic'])
const viewMode = ref(false)
</script>

<template>
  <form class="flex flex-col gap-4 p-4">
    <ElSwitch v-model="viewMode" class="mb-2" active-text="预览" inactive-text="编辑" />
    <ProCascader
      v-model="value"
      :service="getData"
      clearable
      :view-mode="viewMode"
    />
    <ProCascader
      v-model="multipleValue"
      :service="getData"
      clearable
      :props="{ multiple: true }"
      :view-mode="viewMode"
    />
  </form>
</template>

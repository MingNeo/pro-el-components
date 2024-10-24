<script setup lang="ts">
import { ref } from 'vue'
import Select from '../index.vue'
import getData from './mock'

const value = ref()
const selectedValues = ref([])
const viewMode = ref(false)
</script>

<template>
  <div class="p-2">
    <el-switch v-model="viewMode" class="mb-2" active-text="预览" inactive-text="编辑" />
    <div class="flex flex-col gap-2">
      <label>单选: </label>
      <Select
        v-model="value"
        :service="getData"
        :view-mode="viewMode"
      />
      <label>多选: </label>
      <Select
        v-model="selectedValues"
        :service="getData"
        multiple
        :view-mode="viewMode"
      />
    </div>
  </div>
</template>

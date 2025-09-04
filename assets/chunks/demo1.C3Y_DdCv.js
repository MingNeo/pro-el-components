const e=`<script setup lang="ts">
import { ref } from 'vue'
import Cascader from '../index.vue'
import getData from './mock'

const value = ref('efficiency')
const multipleValue = ref(['side nav', 'basic'])
const viewMode = ref(false)
<\/script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <el-switch v-model="viewMode" class="mb-2" active-text="预览" inactive-text="编辑" />
    <Cascader
      v-model="value"
      :service="getData"
      clearable
      :view-mode="viewMode"
    />
    <Cascader
      v-model="multipleValue"
      :service="getData"
      clearable
      :props="{ multiple: true }"
      :view-mode="viewMode"
    />
  </div>
</template>
`;export{e as default};

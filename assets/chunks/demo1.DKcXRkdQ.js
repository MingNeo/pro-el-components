const e=`<script setup lang="ts">
import { ElSwitch } from 'element-plus'
import { ref } from 'vue'
import ProRadio from '../index.vue'

const value = ref()
const viewMode = ref(false)
const options = ref([
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
])
<\/script>

<template>
  <div class="p-2">
    <ElSwitch v-model="viewMode" class="mb-2" active-text="预览" inactive-text="编辑" />
    <div class="flex flex-col gap-2">
      <ProRadio
        v-model="value"
        :view-mode="viewMode"
        :options="options"
      />
    </div>
  </div>
</template>
`;export{e as default};

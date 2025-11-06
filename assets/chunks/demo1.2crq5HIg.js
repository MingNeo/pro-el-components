const n=`<script setup lang="ts">
import { ElCard, ElRadioButton, ElRadioGroup, ElSwitch } from 'element-plus'
import { reactive, ref } from 'vue'
import Demo1Content from './Demo1Content.vue'

defineProps<{
  title?: string
}>()

const formData = ref({})

const config = reactive({
  viewMode: false,
  column: 1,
})

function handleChange(data: any) {
  formData.value = data
}
<\/script>

<template>
  <ElCard :header="title">
    <template #header>
      <div class="flex items-center gap-2">
        <span>{{ title }}</span>
        <ElSwitch v-model="config.viewMode" active-text="预览" inactive-text="编辑" />
        <span>列数</span>
        <ElRadioGroup v-model="config.column" size="small">
          <ElRadioButton label="1" :value="1" />
          <ElRadioButton label="2" :value="2" />
          <ElRadioButton label="3" :value="3" />
        </ElRadioGroup>
      </div>
    </template>
    <Demo1Content :column="config.column" :view-mode="config.viewMode" @change="handleChange" />
    <h5 class="mt-4 border-solid border-0 border-b border-gray-200">
      FormData:
    </h5>
    <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
  </ElCard>
</template>
`;export{n as default};

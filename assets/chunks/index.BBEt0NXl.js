const e=`<script setup lang="ts">
import { ref, watch } from 'vue'

interface PropsType {
  tabs: { name: string, id: string }[]
  modelValue?: string
}

defineOptions({
  name: 'ProTableTabs',
  inheritAttrs: false,
})

const props = defineProps<PropsType>()
const emits = defineEmits(['update:modelValue'])
const modelValue = ref(props.modelValue)

watch(modelValue, (newValue) => {
  emits('update:modelValue', newValue)
})
<\/script>

<template>
  <div class="tabs-container">
    <ElTabs v-model="modelValue" v-bind="$attrs">
      <ElTabPane v-for="item in tabs" :key="item.id" :label="item.name">
        <slot name="tabPane" :data="item" />
      </ElTabPane>
    </ElTabs>
  </div>
</template>
`;export{e as default};

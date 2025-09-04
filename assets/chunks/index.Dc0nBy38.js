const e=`<script setup lang="ts">
import type { RecordType, TableSelectorProps } from 'pro-el-components'
import { ElDialog } from 'element-plus'
import { ProTableSelector } from 'pro-el-components'
import 'pro-el-components/components/TableSelector/style.css'
import { computed, ref, watchEffect } from 'vue'

interface ModalSelectorProps extends Omit<TableSelectorProps, 'modelValue'> {
  title?: string
  width?: number
  modelValue: boolean
  value?: RecordType | RecordType[]
}

defineOptions({
  name: 'ProModalSelector',
})

const props = withDefaults(defineProps<ModalSelectorProps>(), { title: '请选择' })
const emit = defineEmits(['update:modelValue', 'confirm', 'change'])

const visible = computed({
  get() {
    return props.modelValue
  },
  set(_value: boolean) {
    emit('update:modelValue', _value)
  },
})

const selected = ref()

watchEffect(() => {
  if (visible.value)
    selected.value = props.value
})

function handleOk() {
  emit('confirm', selected.value)
  emit('change', selected.value)
  visible.value = false
}
<\/script>

<template>
  <ElDialog v-model="visible" :width="width" :title="title" destroy-on-close @ok="handleOk">
    <ProTableSelector v-bind="props" v-model="selected" title="">
      <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
        <slot :name="key" v-bind="slotProps || {}" />
      </template>
    </ProTableSelector>
  </ElDialog>
</template>
`;export{e as default};

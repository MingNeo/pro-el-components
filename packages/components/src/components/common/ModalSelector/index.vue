<script setup lang="ts">
  import type { RecordType, TableSelectorProps } from '@/components/common/TableSelector/types'

  const props = withDefaults(defineProps<{
    title?: string
    width?: number
    modelValue: boolean
    value?: RecordType | RecordType[]
  } & TableSelectorProps>(), { title: '请选择' })
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
</script>

<template>
  <modal v-model="visible" :width="width" :title="title" destroy-on-close @ok="handleOk">
    <table-selector v-bind="props" v-model="selected">
      <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
        <slot :name="key" v-bind="slotProps || {}" />
      </template>
    </table-selector>
  </modal>
</template>

<style lang="css" scoped></style>

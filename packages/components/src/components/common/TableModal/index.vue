<script lang="ts" setup>
  import type { TableProps } from 'element-plus'

  type Columns = TableProps<any> & {
    actions?: Record<string, any>[]
  }

  const props = defineProps<{
    visible: boolean
    title?: string
    dataSource?: Record<string, any>
    service?: (...args: any[]) => Promise<any>
    columns?: Columns
  }>()

  const emit = defineEmits(['update:visible'])

  const { dataSource: data, search, loading, pagination } = useTableList(props.service || (async (..._args: any) => { }), { immediate: false })

  watch(() => props.visible, (val, prevVal) => {
    props.service && !props.dataSource && val && !prevVal && search.submit()
  })
</script>

<template>
  <modal
    :visible="visible" :title="props.title" :footer="false" destroy-on-close width="700px" @update:visible="emit('update:visible', $event)"
  >
    <table
      :columns="columns" :pagination="dataSource ? $attrs.pagination : pagination" :data-source="dataSource ?? data" class="w-[100%]" :loading="loading" :column-setting="false"
    />
  </modal>
</template>

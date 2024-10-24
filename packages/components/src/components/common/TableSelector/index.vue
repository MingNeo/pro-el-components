<script setup lang="ts">
  import type { RecordType, TableSelectorProps } from '@/components/common/TableSelector/types'
  import useTableList from '@/composables/useTableList'

  defineOptions({ inheritAttrs: false })
  const props = withDefaults(defineProps<TableSelectorProps>(), { showSearchActions: true, rowKey: 'id', nameKey: 'name', type: 'checkbox', scroll: {} })
  const emit = defineEmits(['update:modelValue', 'change'])

  const tableListService = props.service || (async ({ pageNo, pageSize }) => {
    return { total: props.data?.length, data: props.data?.slice((pageNo - 1) * pageSize, pageNo * pageSize) }
  })

  const { dataSource, search, loading, pagination } = useTableList(tableListService, { defaultPageSize: 10 })

  const value = computed({
    get() {
      return (props.modelValue ? (props.type === 'checkbox' ? props.modelValue : [props.modelValue]) : []) as RecordType[]
    },
    set(v: RecordType[]) {
      const changeValue = props.type === 'checkbox' ? v : v[0]
      emit('update:modelValue', changeValue)
      emit('change', changeValue, changeValue)
    },
  })

  const selectedRowKeys = computed(() => value.value.map(row => row[props.rowKey]))

  const getCheckboxProps = (record: RecordType) => ({ disabled: props.setRowDisabled?.(record) })

  function handleChange(_: any, selectedRows: RecordType[]) {
    let result
    if (props.type === 'checkbox') {
      const otherPagesSelectedRows = value.value.filter(item => !dataSource.value?.some(it => it[props.rowKey] === item[props.rowKey]))
      result = [...otherPagesSelectedRows, ...selectedRows]
    }
    else {
      result = selectedRows
    }
    value.value = result
  }

  function handleDelete(key: string) {
    value.value = value.value.filter(item => item[props.rowKey] !== key)
  }
</script>

<template>
  <el-form-item>
    <search-form
      v-if="service && searchFields?.length"
      class="search-form mb-[12px]" :column="searchColumn || 2" :fields="searchFields"
      :search="search" :advanced-type="false" :show-actions="showSearchActions"
      :form-item-options="{}"
    />
    <div v-if="type === 'checkbox' && value.length" class="mb-[12px]">
      <el-tag v-for="item in value" :key="item[rowKey]" closable @close="handleDelete(item[rowKey])">
        {{ item[nameKey] }}
      </el-tag>
    </div>
    <table
      :columns="columns"
      :data-source="dataSource"
      :row-key="rowKey"
      :row-selection="{ type, selectedRowKeys, getCheckboxProps, onChange: handleChange }" :loading="loading"
      :pagination="pagination"
      :scroll="scroll"
    >
      <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
        <slot :name="key" v-bind="slotProps || {}" />
      </template>
    </table>
  </el-form-item>
</template>

<style lang="scss" scoped>
  .search-form {
    padding: 0;
    box-shadow: none;
    margin-bottom: 10px;
  }
</style>

<script lang="ts" setup>
import type { ButtonAction, Column, SearchFormProps } from 'pro-el-components'
import { ProPageHeader, ProSearchForm, ProSectionHeader, ProTable } from 'pro-el-components'
import { provide } from 'vue'
import 'pro-el-components/components/PageContainer/style.css'
import 'pro-el-components/components/SearchForm/style.css'
import 'pro-el-components/components/SectionHeader/style.css'
import 'pro-el-components/components/Table/style.css'
import './style.css'

interface ListPageProps {
  // 页面标题
  title?: string
  showHeader?: boolean
  // 按钮操作
  headerActions?: ButtonAction[]
  actions?: ButtonAction[]
  // 搜索表单配置
  searchForm?: SearchFormProps['formProps']
  // 表格配置
  columns: Column[]
  // 表格数据
  data: any[]
}

defineOptions({
  name: 'ProListPage',
})

withDefaults(defineProps<ListPageProps>(), {
  showHeader: false,
})

const emit = defineEmits<{
  search: [params: Record<string, any>]
  reset: []
  tableChange: [pagination: any, filters: any, sorter: any]
  back: []
}>()

provide('isInListPage', true)

// 处理搜索事件
function handleSearch(params: Record<string, any>) {
  emit('search', params)
}

// 处理重置事件
function handleReset() {
  emit('reset')
}

// 处理返回事件
function handleBack() {
  emit('back')
}

// 处理表格变化事件
function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('tableChange', pagination, filters, sorter)
}
</script>

<template>
  <div class="pro-list-page">
    <ProPageHeader
      v-if="!!headerActions?.length || showHeader"
      class="pro-list-page-header" :title="title" :actions="headerActions" v-bind="$attrs"
      @back="handleBack"
    >
      <template #title>
        <slot name="title" />
      </template>
      <template #actions>
        <slot name="headerActions" />
      </template>
    </ProPageHeader>

    <!-- 搜索表单 -->
    <ProSearchForm
      v-if="searchForm?.fields?.length"
      :fields="searchForm?.fields"
      v-bind="searchForm"
      class="pro-list-page-search"
      @search="handleSearch"
      @reset="handleReset"
    >
      <template #actions="searchFormActionProps">
        <slot name="searchActions" v-bind="searchFormActionProps" />
      </template>
    </ProSearchForm>

    <ProSectionHeader v-if="actions?.length || $slots.actionBarLeft || $slots.actionBarRight || $slots.actionBarActions" class="pro-list-page-table__header" :actions="actions">
      <template #left>
        <slot name="actionBarLeft" />
      </template>
      <template #right>
        <slot name="actionBarRight" />
      </template>
      <template #actions>
        <slot name="actionBarActions" />
      </template>
    </ProSectionHeader>

    <!-- 表格 -->
    <ProTable
      v-if="columns?.length"
      :columns="columns"
      :data="data"
      @change="handleTableChange"
    >
      <template #column-header="{ column, $index }">
        <slot name="tableColumnHeader" v-bind="{ column, $index }" />
      </template>
      <template #column-default="{ row, column, $index }">
        <slot name="tableColumnDefault" v-bind="{ row, column, $index }" />
      </template>
      <template #column-filter-icon>
        <slot name="tableColumnFilterIcon" />
      </template>
    </ProTable>

    <!-- 其他内容插槽 -->
    <slot />
  </div>
</template>

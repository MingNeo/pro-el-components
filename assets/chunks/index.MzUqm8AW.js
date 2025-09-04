const n=`<script lang="ts" setup>
import type { ButtonAction, Column, SearchFormProps } from 'pro-el-components'
import { ProPageContainer, ProSearchForm, ProSectionHeader, ProTable } from 'pro-el-components'
import 'pro-el-components/components/PageContainer/style.css'
import 'pro-el-components/components/SearchForm/style.css'
import 'pro-el-components/components/SectionHeader/style.css'
import 'pro-el-components/components/Table/style.css'
import { provide } from 'vue'
import './style.css'

interface ListPageProps {
  // 页面标题
  title?: string
  showHeader?: boolean
  // 按钮操作
  headerActions?: ButtonAction[]
  actions?: ButtonAction[]
  // 搜索表单配置
  searchFields?: SearchFormProps['fields']
  searchProps?: SearchFormProps['formProps']
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

// 处理表格变化事件
function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('tableChange', pagination, filters, sorter)
}
<\/script>

<template>
  <ProPageContainer class="pro-list-page" :title="title" :actions="headerActions" :show-header="!!headerActions?.length || showHeader">
    <template #actions>
      <slot name="headerActions" />
    </template>

    <!-- 搜索表单 -->
    <ProSearchForm
      v-if="searchFields?.length"
      v-bind="searchProps"
      class="pro-list-page-search"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    >
      <template #actions="searchFormActionProps">
        <slot name="searchActions" v-bind="searchFormActionProps" />
      </template>
    </ProSearchForm>

    <div class="pro-list-page-table">
      <ProSectionHeader class="pro-list-page-table__header" :actions="actions">
        <template #left>
          <slot name="actionBarLeft" />
        </template>
        <template #right>
          <slot name="actionBarRight" />
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
    </div>

    <!-- 其他内容插槽 -->
    <slot />
  </ProPageContainer>
</template>
`;export{n as default};

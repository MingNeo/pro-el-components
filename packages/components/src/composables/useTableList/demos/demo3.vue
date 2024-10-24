<script setup>
import { ElButton, ElForm, ElFormItem, ElInput, ElPagination, ElTable, ElTableColumn } from 'element-plus'
import { useTableList } from '../index'
import { getData } from './mock'

const { searchFormRef, searchState, loading, data, pagination, search } = useTableList(getData)
</script>

<template>
  <div class="p-4">
    <ElForm
      ref="searchFormRef"
      :model="searchState"
      name="advanced_search"
      class="search-form"
      inline
    >
      <ElFormItem name="name" label="姓名">
        <ElInput v-model="searchState.name" placeholder="placeholder" />
      </ElFormItem>
      <ElButton type="primary" class="mb-[18px]" html-type="submit" @click="() => search.submit()">
        搜索
      </ElButton>
    </ElForm>
    <ElTable v-loading="loading" class="vp-raw w-full" :data="data">
      <ElTableColumn prop="date" label="日期" width="180" />
      <ElTableColumn prop="name" label="姓名" width="180" />
      <ElTableColumn prop="address" label="地址" />
    </ElTable>
    <ElPagination
      class="vp-raw mt-[10px]"
      :page-sizes="[5, 10, 20, 30, 40]"
      layout="sizes, pager, total"
      v-bind="pagination"
    />
  </div>
</template>

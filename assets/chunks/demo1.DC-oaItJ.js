const a=`<script lang="ts" setup>
import { useTableList } from '../index'
import { getData } from './mock'

const { loading, data, pagination } = useTableList(getData, { defaultPageSize: 5 })
<\/script>

<template>
  <div class="mb-2 flex flex-col gap-2">
    <ElTable v-loading="loading" class="vp-raw w-full" :data="data">
      <ElTableColumn prop="date" label="日期" width="180" />
      <ElTableColumn prop="name" label="姓名" width="180" />
      <ElTableColumn prop="address" label="地址" />
    </ElTable>
    <ElPagination :page-sizes="[5, 10, 20, 30, 40]" v-bind="pagination" />
  </div>
</template>
`;export{a as default};

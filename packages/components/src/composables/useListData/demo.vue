<script lang="ts" setup>
  import useListData from './index'

  async function getData({ currentNo, pageSize }) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      data: Array.from({ length: pageSize }).fill(0).map((_, index) => ({
        date: `2016-05-0${index + currentNo}`,
        name: `王小虎${index + currentNo}`,
        address: `上海市普陀区金沙江路 1518 弄${index + currentNo}号`,
      })),
      total: 100,
    }
  }

  const { currentPage, loading, pageSize, total, listData, onSizeChange, onCurrentChange } = useListData(({ pageNo, pageSize }) => {
    const currentNo = ((pageNo || 1) - 1) * (pageSize || 10) + 1
    return getData({ currentNo, pageSize })
  }, { immediate: true, defaultPageSize: 5 })
</script>

<template>
  <div>
    {{ pagination }}
    <ElTable v-loading="loading" class="vp-raw" :data="listData" style="width: 100%">
      <ElTableColumn prop="date" label="日期" width="180" />
      <ElTableColumn prop="name" label="姓名" width="180" />
      <ElTableColumn prop="address" label="地址" />
    </ElTable>
    <ElPagination
      class="vp-raw m-t-10px"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[5, 10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
  </div>
</template>

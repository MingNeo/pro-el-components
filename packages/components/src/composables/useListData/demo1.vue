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

  const { currentPage, loading, listData, loadNextPage } = useListData(({ pageNo, pageSize }) => {
    const currentNo = ((pageNo || 1) - 1) * (pageSize || 10) + 1
    return getData({ currentNo, pageSize })
  }, { immediate: true, defaultPageSize: 5 })
</script>

<template>
  <div>
    <ul v-infinite-scroll="loadNextPage" class="infinite-list" style="overflow: auto">
      <li v-for="i in listData" :key="i" class="infinite-list-item">
        {{ i.name }}
      </li>
      <div v-if="loading">
        loading
      </div>
    </ul>
  </div>
</template>

<style scoped>
  .infinite-list {
    height: 300px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .infinite-list .infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 10px;
    color: var(--el-color-primary);
  }

  .infinite-list .infinite-list-item+.list-item {
    margin-top: 10px;
  }
</style>

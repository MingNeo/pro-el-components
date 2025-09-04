const n=`<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useTableList } from '../index'
import { getData } from './mock'

const showList = ref([])
const { loading, data, loadNextPage } = useTableList(getData, { defaultPageSize: 5 })

watch(data, (newVal = []) => {
  showList.value.push(...newVal)
}, { immediate: true })
<\/script>

<template>
  <div>
    <ul v-infinite-scroll="loadNextPage" :infinite-scroll-immediate="false" class="infinite-list" style="overflow: auto">
      <li v-for="i in showList" :key="i" class="infinite-list-item">
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
`;export{n as default};

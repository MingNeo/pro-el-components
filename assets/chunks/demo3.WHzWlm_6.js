const n=`<script lang="ts" setup>
import type { Column } from '../types'
import dayjs from 'dayjs'
import { ref } from 'vue'
import ProTable from '../index.vue'

const dataSource = ref(Array.from({ length: 10 }).fill(0).map((_, index) => ({
  image: \`https://picsum.photos/200/300?random=\${index}\`,
  file: [{
    name: '文件1',
    url: \`https://picsum.photos/200/300?random=\${index}\`,
  }, {
    name: '文件2',
    url: \`https://picsum.photos/200/300?random=\${index}\`,
  }],
  date: dayjs().subtract(index, 'day').format('YYYY-MM-DD'),
})))

const columns: Column[] = [
  { label: '图片', prop: 'image', renderAs: 'image' },
  { label: '文件', prop: 'file', renderAs: 'file' },
  { label: '日期', prop: 'date', renderAs: 'date' },
  { label: '链接', prop: 'link', renderAs: 'link' },

]
<\/script>

<template>
  <ProTable table-id="demo3" :columns="columns" :data="dataSource" class="w-full" column-setting />
</template>
`;export{n as default};

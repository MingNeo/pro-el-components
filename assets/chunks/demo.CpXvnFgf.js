const n=`<script lang="ts" setup>
import PageHeader from '../index.vue'

const tabs = [
  {
    title: '标签 1',
    name: 'tab1',
  },
  {
    title: '标签 2',
    name: 'tab2',
  },
  {
    title: '标签 3',
    name: 'tab3',
  },
]
<\/script>

<template>
  <div class="flex flex-col gap-4 bg-gray-100 p-4">
    <PageHeader
      title="标题 1"
      show-header
      show-back
      :actions="[{ text: '新增', type: 'primary', onClick: () => { } }]"
    />

    <PageHeader
      title="标题 2"
      show-header
      show-back
      :actions="[{ text: '新增', type: 'primary', onClick: () => { } }]"
      :tabs="tabs"
    />

    <PageHeader
      title="标题 3"
      show-header
      show-back
    />
  </div>
</template>
`;export{n as default};

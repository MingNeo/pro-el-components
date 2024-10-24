# SwiperCard
左右带悬浮按钮的多个卡片

<script setup>
  import SwiperCard from 'components/SwiperCard/index.vue'

  const list = Array.from({ length: 10 }, (v, i) => i + 1)
</script>

## 用法
<br />

<div class="w-[500px]">
  <SwiperCard class="h-40px">
    <div v-for="item in list" :key="item" class="h-[40px] w-[100px] bg-blue-500 rounded-2">{{ item }}</div>
  </SwiperCard>
</div>

```vue
<script setup>
import SwiperCard from 'components/SwiperCard/index.vue'
</script>

<template>
  <SwiperCard />
</template>
```

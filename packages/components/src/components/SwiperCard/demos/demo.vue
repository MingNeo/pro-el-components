<script setup>
import SwiperCard from '../index.vue'

const list = Array.from({ length: 10 }, (v, i) => i + 1)
</script>

<template>
  <SwiperCard class="h-[40px]">
    <div v-for="item in list" :key="item" class="h-[40px] w-[100px] bg-blue-500 rounded-2">
      {{ item }}
    </div>
  </SwiperCard>
</template>

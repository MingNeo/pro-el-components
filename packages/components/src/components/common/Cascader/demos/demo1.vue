<script setup lang="ts">
  import getData from './mock'

  const value = ref()
</script>

<template>
  <Cascader
    v-model="value"
    :service="getData"
    clearable
  />
  <h5> 回显: </h5>
  <Cascader
    :model-value="value"
    :service="getData"
    view-mode
  />
</template>

<script lang="ts" setup>
const emit = defineEmits(['submit', 'reset'])

function onSearchReset() {
  emit('reset')
}
</script>

<template>
  <!-- <el-row> -->
  <div class="w-[100%] text-right inline-block">
    <el-button type="primary" html-type="submit">
      搜索
    </el-button>
    <el-button class="clear-btn m-0 ml-2" @click="onSearchReset">
      清空
    </el-button>
  </div>
  <!-- </el-row> -->
</template>

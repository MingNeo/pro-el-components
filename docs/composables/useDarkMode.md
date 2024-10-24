# useDarkMode

切换黑暗模式

```vue
<script lang="ts" setup>
const { isDark, toggleDarkMode } = useDarkMode()
</script>

<template>
  <div @click="toggleDarkMode">
    {{ isDark ? '黑暗模式' : '明亮模式' }}
  </div>
</template>
```

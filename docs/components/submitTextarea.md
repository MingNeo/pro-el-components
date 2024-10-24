# Textarea
- 自动高度
- 回车提交，防止中文拼音输入中回车触发提交
- 受控/非受控模式
- 非受控模式提交自动清空

<script setup>
  import { ref } from 'vue'
  import Textarea from 'components/Textarea/index.vue'

  const value = ref('')
</script>

## 用法
<br />

<p>{{ value }}</p>
<Textarea @submit="v => value = v" />

```vue
<script setup>
import { ref } from 'vue'
import Textarea from 'components/Textarea/index.vue'

const value = ref('')
</script>

<template>
  <Textarea @submit="v => value = v" />
</template>
```

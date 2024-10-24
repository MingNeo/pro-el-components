# TableModal
表格模态框组件

<script setup>
  import demo1 from 'components/common/TableModal/demos/demo1.vue'
  import demo1Code from 'components/common/TableModal/demos/demo1.vue?raw'
</script>
<demo :comp="demo1" :code="demo1Code" />

### 用法
```html
<script setup lang="ts">
import { getUserList } from '@/api/user'

const visible = ref(false)
const value = ref()

const columns = [
  {
    title: 'id',
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
]
</script>

<template>
  <el-button @click="visible = true">
    显示弹窗
  </el-button>
  <table-modal
    v-model:visible="visible" title="选择用户"
    :width="600"
    :service="getUserList"
    :columns="columns"
  />
</template>

```

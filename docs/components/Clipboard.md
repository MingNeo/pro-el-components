# Clipboard 剪贴板

> 📋 一键复制文本到剪贴板的实用组件，提供优雅的用户反馈和兼容性处理。

## 基础用法

<script setup>
  import Demo1 from '@/components/Clipboard/demos/demo1.vue'
  import Demo1Code from '@/components/Clipboard/demos/demo1.vue?raw'
</script>

<demo :comp="Demo1" :code="Demo1Code" title="基础用法" />

## API

### Props

| 参数             | 说明               | 类型      | 默认值       |
| ---------------- | ------------------ | --------- | ------------ |
| `text`           | 要复制的文本内容   | `string`  | `''`         |
| `tooltip`        | 复制按钮的提示文案 | `string`  | `'复制'`     |
| `successMessage` | 复制成功的提示信息 | `string`  | `'复制成功'` |
| `disabled`       | 是否禁用复制功能   | `boolean` | `false`      |

### Events

| 事件名    | 说明           | 参数             |
| --------- | -------------- | ---------------- |
| `success` | 复制成功时触发 | `(text: string)` |
| `error`   | 复制失败时触发 | `(error: Error)` |

### Slots

| 插槽名    | 说明           | 参数                                    |
| --------- | -------------- | --------------------------------------- |
| `default` | 自定义触发元素 | `{ copy: Function, disabled: boolean }` |

## 使用示例

### 基础复制

```vue
<template>
  <!-- 简单文本复制 -->
  <ProClipboard text="Hello World!" />

  <!-- 自定义提示文案 -->
  <ProClipboard
    text="https://example.com/share/12345"
    tooltip="复制链接"
    success-message="链接已复制到剪贴板"
  />
</template>
```

### 自定义触发元素

```vue
<template>
  <ProClipboard text="要复制的内容">
    <template #default="{ copy, disabled }">
      <el-button
        type="primary"
        :disabled="disabled"
        @click="copy"
      >
        <el-icon><DocumentCopy /></el-icon>
        复制内容
      </el-button>
    </template>
  </ProClipboard>
</template>
```

### 事件处理

```vue
<script setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const shareUrl = ref('https://example.com/share/12345')

function handleCopySuccess(text) {
  console.log('复制成功:', text)
  ElMessage.success('链接已复制，快去分享吧！')
}

function handleCopyError(error) {
  console.error('复制失败:', error)
  ElMessage.error('复制失败，请手动复制')
}
</script>

<template>
  <ProClipboard
    :text="shareUrl"
    @success="handleCopySuccess"
    @error="handleCopyError"
  />
</template>
```

### 动态内容复制

```vue
<script setup>
import { computed, ref } from 'vue'

const userId = ref(12345)
const shareCode = computed(() => `INVITE_${userId.value}_${Date.now()}`)
</script>

<template>
  <div class="share-panel">
    <el-input v-model="shareCode" readonly />
    <ProClipboard
      :text="shareCode"
      tooltip="复制邀请码"
      success-message="邀请码已复制"
    />
  </div>
</template>
```

## 💡 最佳实践

### 1. 合理的提示文案

```vue
<!-- ✅ 推荐：明确的提示文案 -->
<ProClipboard
  text="产品链接"
  tooltip="复制产品链接"
  success-message="产品链接已复制到剪贴板"
/>

<!-- ❌ 避免：模糊的提示 -->
<ProClipboard text="内容" tooltip="复制" />
```

### 2. 错误处理

```vue
<script setup>
function handleError(error) {
  // 提供备选方案
  ElMessageBox.alert(
    `自动复制失败，请手动复制：${text.value}`,
    '复制失败',
    {
      confirmButtonText: '我知道了',
      type: 'warning'
    }
  )
}
</script>

<template>
  <Clipboard
    :text="text"
    @error="handleError"
  />
</template>
```

### 3. 条件禁用

```vue
<script setup>
import { computed, ref } from 'vue'

const userToken = ref('')
const isLoggedIn = ref(false)

// 只有登录用户才能复制令牌
watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    userToken.value = generateToken()
  }
  else {
    userToken.value = ''
  }
})
</script>

<template>
  <Clipboard
    :text="userToken"
    :disabled="!userToken"
    tooltip="复制访问令牌"
  />
</template>
```

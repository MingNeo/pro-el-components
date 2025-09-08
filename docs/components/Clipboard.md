# Clipboard 剪贴板

> 📋 一键复制文本到剪贴板的实用组件，提供优雅的用户反馈和兼容性处理。

## ✨ 特性

- **🚀 简单易用** - 只需传入要复制的文本，一键完成复制操作
- **✅ 成功反馈** - 内置成功提示，用户操作反馈清晰
- **🔧 兼容性好** - 自动处理浏览器兼容性问题
- **🎨 自定义样式** - 支持自定义按钮样式和提示文案
- **⚡ 零依赖** - 基于现代浏览器原生 API 实现

## 🎯 适用场景

- **分享链接** - 快速复制页面链接或分享地址
- **代码展示** - 复制代码片段到剪贴板
- **表单数据** - 复制表单中的重要信息
- **用户信息** - 复制用户ID、邀请码等

## 🚀 基础使用

<script setup>
  import Demo1 from '@/components/Clipboard/demos/demo1.vue'
  import Demo1Code from '@/components/Clipboard/demos/demo1.vue?raw'
</script>

<demo :comp="Demo1" :code="Demo1Code" title="基础用法" />

## 📋 API 参考

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

## 💻 使用示例

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

## 🔧 技术实现

Clipboard 组件基于现代浏览器的 `navigator.clipboard` API 实现，对于不支持的浏览器会自动降级到 `document.execCommand` 方法：

```javascript
async function copyToClipboard(text) {
  try {
    // 优先使用现代 API
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)

    if (!successful)
      throw new Error('复制失败')
    return true
  }
  catch (error) {
    console.error('复制操作失败:', error)
    throw error
  }
}
```

## 🔗 相关链接

- [Clipboard API MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API)
- [Element Plus Button](https://element-plus.org/zh-CN/component/button.html) - 自定义按钮样式
- [Element Plus Message](https://element-plus.org/zh-CN/component/message.html) - 消息提示组件

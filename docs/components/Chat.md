# Chat 聊天组件

一个基于 Vue 3 的聊天界面组件,支持消息发送、文件上传、Markdown 渲染等功能。

- 💬 支持文本消息、Markdown、代码高亮
- 📎 支持文件和图片上传
- 👍 消息反馈(点赞/踩)
- 🔄 支持重置对话
- 💡 智能提示建议
- 🌓 支持气泡/无气泡两种模式，支持左侧对齐或左右对齐
- ⌨️ 支持快捷键发送
- 🎨 基于 Tailwind CSS 的现代界面

## 使用

<demo src="@/components/Chat/demos/ChatDemo.vue" />
```vue
<script setup>
import { ref } from 'vue'
import Chat from '@your-scope/chat'
const messages = ref([])
const roleConfig = {
  assistant: {
    name: 'AI助手',
    avatar: '/ai-avatar.png'
  },
  user: {
    name: '我',
    avatar: '/user-avatar.png'
  }
}
function handleMessageSend(content, attachment) {
// 处理发送消息
}
</script>

<template>
  <Chat
    v-model:chats="messages"
    :role-config="roleConfig"
    @message-send="handleMessageSend"
  />
</template>
```
## Props

| 名称               | 类型                                     | 默认值            | 说明                   |
| ------------------ | ---------------------------------------- | ----------------- | ---------------------- |
| chats              | `Message[]`                              | `[]`              | 聊天消息列表           |
| role-config        | `RoleConfig`                             | -                 | 角色配置               | **** |
| hints              | `string[]`                               | `[]`              | 提示建议列表           |
| mode               | `'bubble' \| 'noBubble' \| 'userBubble'` | `'bubble'`        | 消息气泡模式           |
| align              | `'leftRight' \| 'leftAlign'`             | `'leftRight'`     | 消息对齐方式           | **** |
| show-clear-context | `boolean`                                | `false`           | 是否显示清空上下文按钮 |
| show-stop-generate | `boolean`                                | `false`           | 是否显示停止生成按钮   | **** |
| send-hot-key       | `'enter' \| 'shift+enter'`               | `'enter'`         | 发送消息快捷键         |
| placeholder        | `string`                                 | `'请输入消息...'` | 输入框占位文本         |

## Events

| 名称         | 参数                                        | 说明               |
| ------------ | ------------------------------------------- | ------------------ |
| message-send | `(content: string, attachment: FileItem[])` | 发送消息时触发     |
| clear        | -                                           | 清空上下文时触发   |
| hint-click   | `(hint: string)`                            | 点击提示建议时触发 |
| chats-change | `(chats: Message[])`                        | 消息列表变化时触发 |

## 类型定义

### Message

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system' | 'divider'
  content: string | ContentItem[]
  createAt?: number
  status?: 'loading' | 'error' | 'complete' | 'incomplete'
  like?: boolean
  dislike?: boolean
  attachment?: FileItem[]
}
```

### RoleConfig
```typescript
interface RoleConfig {
  user?: RoleInfo
  assistant?: RoleInfo
  system?: RoleInfo
  [key: string]: RoleInfo | undefined
}
interface RoleInfo {
  name?: string
  avatar?: string
  color?: string
  [key: string]: any
}
```
## 自定义主题

组件使用 Tailwind CSS 构建,你可以通过覆盖以下 CSS 变量来自定义主题:
```css
:root {
  --chat-primary: #3b82f6;
  --chat-bg: #ffffff;
  --chat-text: #374151;
  --chat-border: #e5e7eb;
}
```

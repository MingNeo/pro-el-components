<script setup lang="ts">
import { ElButton, ElInput } from 'element-plus'
import { ref } from 'vue'
import ChatDialog from '../../../components/ChatDialog/ChatDialog.vue'
import { useStreamData } from '../index'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const inputMessage = ref('')
const messages = ref<Message[]>([])

let contentText = ''
const {
  isStreaming,
  content,
  start,
  reset: resetStream,
} = useStreamData({
  url: '/stream',
  formatResponse: response => response?.data?.result || '',
  onStart: () => {
    // eslint-disable-next-line no-console
    console.log('开始接收流数据')
    contentText = ''
    messages.value.push({
      role: 'assistant',
      content: contentText,
    })
  },
  onMessage: (chunk) => {
    contentText += chunk
    messages.value[messages.value.length - 1].content = contentText
  },
})

async function handleSend() {
  if (!inputMessage.value.trim())
    return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: inputMessage.value,
  })

  try {
    // 开始流式接收响应
    await start(inputMessage.value)

    messages.value[messages.value.length - 1].content = content.value

    // 清空输入
    inputMessage.value = ''
  }
  catch (err) {
    console.error('发送失败:', err)
  }
}

function handleReset() {
  inputMessage.value = ''
  messages.value = []
  resetStream()
}
</script>

<template>
  <div class="chat-demo">
    <ChatDialog
      :messages="messages"
      :loading="isStreaming"
    />

    <div class="input-area">
      <ElInput
        v-model="inputMessage"
        type="textarea"
        :rows="3"
        placeholder="输入消息"
        @keydown.enter.exact.prevent="handleSend"
      />

      <div class="buttons">
        <ElButton
          v-loading="isStreaming"
          type="primary"
          @click="handleSend"
        >
          发送
        </ElButton>
        <ElButton @click="handleReset">
          清空对话
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .chat-demo {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .input-area {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
</style>

<script setup lang="ts">
import { ElButton, ElInput } from 'element-plus'
import { ref } from 'vue'
import { useStreamData } from '../index'

const message = ref('')

const {
  status,
  content,
  error,
  isStreaming,
  start,
  stop,
  reset: resetStream,
} = useStreamData({
  // 使用相对路径，会被代理到开发服务器
  url: '/stream',
  formatResponse: response => response?.data?.result || '',
  onStart: () => {
    // eslint-disable-next-line no-console
    console.log('开始接收流数据')
  },
  onMessage: (chunk) => {
    // eslint-disable-next-line no-console
    console.log('收到新消息:', chunk)
  },
  onFinish: () => {
    // eslint-disable-next-line no-console
    console.log('接收完成')
  },
  onError: (err) => {
    console.error('发生错误:', err)
  },
})

async function handleStart() {
  try {
    await start(message.value)
  }
  catch (err) {
    console.error('启动失败:', err)
  }
}

function handleStop() {
  stop()
}

function handleReset() {
  message.value = ''
  resetStream()
}
</script>

<template>
  <div class="stream-demo">
    <div class="controls">
      <ElInput
        v-model="message"
        placeholder="输入消息"
        style="width: 200px"
      />
      <ElButton
        v-loading="isStreaming"
        type="primary"
        @click="handleStart"
      >
        开始接收
      </ElButton>
      <ElButton
        :disabled="!isStreaming"
        @click="handleStop"
      >
        停止
      </ElButton>
      <ElButton @click="handleReset">
        重置
      </ElButton>
    </div>

    <div class="status">
      当前状态: {{ status }}
    </div>

    <div class="content">
      <div v-if="error" class="error">
        错误: {{ error.message }}
      </div>
      <div v-else class="stream-content">
        {{ content || '等待接收数据...' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .stream-demo {
    padding: 20px;
  }

  .controls {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
  }

  .status {
    margin-bottom: 10px;
    color: #666;
  }

  .content {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-height: 100px;
  }

  .error {
    color: #ff4d4f;
  }

  .stream-content {
    white-space: pre-wrap;
    word-break: break-all;
  }
</style>

import { onUnmounted, ref } from 'vue'
import { v4 as uuid } from 'uuid'
import { fetchEvent } from './fetch-event-source'

interface ResultData {
  status?: string
  content?: string
}

interface Configs {
  scrollToBottom?: (force?: boolean) => void
  url: string
  method?: string
  formatChatData?: (data: any) => ResultData
  /* 请求参数中prompt的key */
  textKey: string
  onMessage?: (data: any, text: string) => void
}

type Status = 'idle' | 'fetching' | 'outputting' | 'error' | 'cancel'
// type AnswerStatus = 'idle' | 'fetching' | 'outputting' | 'error'

/**
 * 流式逻辑
 * @param {Configs} configs - 一个包含回调函数和配置的对象
 * @param {Function} configs.scrollToBottom - 数据获取成功或发生错误后滚动到页面底部的回调函数
 * @param {string} configs.url - 获取流数据的 URL
 * @param {string} configs.method - 请求方法，默认为 POST
 * @param {string} configs.textKey - 在请求体中包含文本的键名
 * @param {Function} configs.onMessage - 处理获取到的消息的回调函数
 * @returns {object} - 一个包含提问数据和方法的对象
 */
export function useStreamData({
  scrollToBottom = () => { },
  url = '',
  method = 'post',
  textKey = 'content',
  onMessage,
}: Configs) {
  let controller = new AbortController()

  const questionData = ref<Record<string, any>>({ content: '' })
  const status = ref<Status>('idle')
  const answerId = ref()
  // const answerStatus = ref<AnswerStatus>('idle')
  const resultText = ref('')
  // const resultData = ref('')
  // const currentId = ref()

  /**
   * 开始提问新问题，往屏幕上输出问题、发出sse请求并流式输出结果
   */
  async function startQuestion(query: Record<string, any>) {
    const promptText = query[textKey]

    if (status.value === 'fetching')
      return

    if (!query && !promptText.trim())
      return

    // const questionId = `q_local_${uuid()}`
    answerId.value = uuid()

    // 结束历史请求, 清空一些历史数据
    controller.abort()
    controller = new AbortController()
    status.value = 'fetching'
    // answerStatus.value = 'idle'
    resultText.value = ''

    scrollToBottom(true)

    try {
      // 使用sse 请求对话信息
      await fetchEvent({
        url,
        method,
        data: query,
        signal: controller.signal,
        onMessage: async (result: any) => {
          // answerStatus.value = 'outputting'
          status.value = 'outputting'
          const newText = await _outputContent({ ...result }) as string
          onMessage?.(result, newText)
          scrollToBottom()
        },
      })
    }
    catch (error: any) {
      ElMessage.error(error.message)
      scrollToBottom(true)
      resultText.value = error.message
      status.value = 'error'
      // answerStatus.value = 'error'
      console.warn('error', error)
    }
    finally {
      status.value = 'idle'
      // answerStatus.value = 'idle'
      scrollToBottom(true)
    }
  }

  async function _outputContent(result: any) {
    try {
      const content = result?.data?.result || ''
      if (!content)
        return

      if (!result)
        return await new Promise(resolve => setTimeout(resolve, 100))

      resultText.value = (resultText.value || '') + content
      return resultText.value
    }
    catch (error) {
      throw new Error(`解析消息失败: ${error}`)
    }
  }

  /**
   * 输入完成提交输入框内容并开始对话
   */
  async function quickStart(content?: string) {
    if (content && content.trim() !== '')
      startQuestion({ [textKey]: content })
  }

  function cancelFetch() {
    controller.abort()
    status.value = 'idle'
  }

  function resetState() {
    resultText.value = ''
    status.value = 'idle'
  }

  onUnmounted(() => {
    if (status.value)
      controller.abort()
  })

  return {
    questionData,
    status,
    startQuestion,
    quickStart,
    cancelFetch,
    // answerStatus,
    resultText,
    resetState,
  }
}

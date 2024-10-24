import process from 'node:process'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'

const app = express()

// 配置CORS和body解析
app.use(cors())
app.use(bodyParser.json())

// 模拟一些响应数据
const mockResponses = [
  '正在初始化...',
  '正在处理数据...',
  '分析中...',
  '即将完成...',
  '处理完成！',
]

// SSE路由处理
app.post('/stream', (req, res) => {
  // 设置SSE所需的headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // 获取请求中的消息
  const userMessage = req.body.content || '默认消息'

  let messageIndex = 0

  // 模拟流式响应
  const interval = setInterval(() => {
    if (messageIndex >= mockResponses.length) {
      clearInterval(interval)
      res.end()
      return
    }

    const response = {
      data: {
        result: `${mockResponses[messageIndex]}\n用户消息: ${userMessage}\n`,
      },
    }

    // 发送SSE消息
    res.write(`data: ${JSON.stringify(response)}\n\n`)
    messageIndex++
  }, 1000)

  // 客户端断开连接时清理
  req.on('close', () => {
    clearInterval(interval)
  })
})

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 启动服务器
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SSE测试服务器运行在 http://localhost:${PORT}`)
})

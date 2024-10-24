import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

// 模拟响应数据
const mockResponses = [
  '正在初始化...\n',
  '正在处理数据...\n',
  '分析中...\n',
  '即将完成...\n',
  '处理完成！\n',
]

export function ssePlugin(): Plugin {
  return {
    name: 'sse-mock',
    configureServer(server) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next) => {
        if (req.url === '/stream' && req.method === 'POST') {
          // 设置SSE headers
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          })

          // 读取请求体
          let body = ''
          req.on('data', (chunk) => {
            body += chunk.toString()
          })

          req.on('end', async () => {
            const userMessage = JSON.parse(body).content || '默认消息'

            // 创建延时函数
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

            // 异步发送所有消息
            try {
              res.write(`data: ${JSON.stringify({ data: { result: `收到用户信息: ${userMessage}\n` } })}\n\n`)
              for (let i = 0; i < mockResponses.length; i++) {
                const response = {
                  data: {
                    result: mockResponses[i],
                  },
                }

                res.write(`data: ${JSON.stringify(response)}\n\n`)
                await delay(1000) // 等待1000ms后发送下一条
              }
              res.end()
            }
            catch (error) {
              res.end()
            }

            // 客户端断开连接时的处理
            req.on('close', () => {
              // 连接关闭时的处理
              res.end()
            })
          })
        }
        else if (req.url === '/stream' && req.method === 'OPTIONS') {
          // 处理 CORS 预检请求
          res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          })
          res.end()
        }
        else {
          next()
        }
      })
    },
  }
}

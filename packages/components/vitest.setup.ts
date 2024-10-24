import { config } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'

// 创建 Vue 应用实例并注册 Element Plus
const app = createApp({})
app.use(ElementPlus)

// 配置 Vue Test Utils
config.global.plugins = [ElementPlus]

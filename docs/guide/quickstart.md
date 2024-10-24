# 快速开始

```bash
npm install pro-el-components element-plus
```
## 用法
### 完整引入
如果你对打包后的文件大小不是很在乎，那么使用完整导入会更方便。

```javascript
import ElementPlus from 'element-plus'
import ProElComponents from 'pro-el-components'
// main.js
import { createApp } from 'vue'
import App from './App.vue'

// 引入样式
import 'element-plus/dist/index.css'
import 'pro-el-components/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(ProElComponents)
app.mount('#app')
```

## 按需引入

### 自动导入（推荐）

配置 `vite.config.js`：

```javascript
import vue from '@vitejs/plugin-vue'
import { ProElComponentsResolver } from 'pro-el-components/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver(), ProElComponentsResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        ProElComponentsResolver() // 会自动按需导入组件和样式
      ],
    }),
  ],
})
```

在 `main.js` 中只需要导入 Element Plus 样式：

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'

// 引入 Element Plus 样式
import 'element-plus/dist/index.css'

const app = createApp(App)
app.mount('#app')
```

## 手工导入

```vue
<script>
import { ProTable } from 'pro-el-components'
import 'pro-el-components/components/table/style.css'

export default {
  components: { ProTable },
}
</script>

<template>
  <ProTable ... />
</template>
```

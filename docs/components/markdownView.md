# MarkdownView
- markdown预览
- 内置默认markdown UI样式
- 可复制的、代码高亮的代码块
- vue 自动处理，防止template、script等被当作html渲染

<script setup>
  import { ref } from 'vue'
  import MarkdownView from 'components/MarkdownView/index.vue'

  const value = ref(`# 一级标题

## 二级标题

### 三级标题

这里是普通的文本段落，你可以使用*斜体*或**粗体**来强调某些内容。

无序列表：
- 项目一
- 项目二
- 项目三

有序列表：
1. 第一项
2. 第二项
3. 第三项

链接：[百度](https://www.baidu.com)

插入图片：
![这是一张图片](https://via.placeholder.com/150)

代码块：
\`\`\`javascript
console.log("Hello, Markdown!")
\`\`\`
表格：
| 标题一   | 标题二   | 标题三   |
| -------- | -------- | -------- |
| 单元格一 | 单元格二 | 单元格三 |
| 单元格四 | 单元格五 | 单元格六 |
`)
</script>

## 用法
<br />
<MarkdownView class="md-code-section-demo vp-raw" :content="value" />

<style>
.md-code-section-demo {
  border: solid 1px #ddd;
  padding: 10px;
  border-radius: 5px;
}
</style>

```vue
<script setup>
import { ref } from 'vue'
import MarkdownView from 'components/MarkdownView/index.vue'

const value = ref('')
</script>

<template>
  <MarkdownView :content="value" />
</template>
```

###  代码块配置
```js
import mdCodeSection from 'markdown-it-code-section'

// language
mdCodeSection.setLanguage({
  copy: '复制',
  copied: '已复制！'
})
```

#### 加载自定义的语法高亮
See [prismjs](https://prismjs.com/)

```javascript
import loadLanguages from 'prismjs/components/index';

loadLanguages([
  'c',
  'objectivec',
  'xml',
]);
```
#### 加载自定义的样式
```js
import 'markdown-it-code-section/dist/styles.css'
import 'prismjs/themes/prism-dark.min.css'
```

titlebar的样式可以通过css变量进行配置
```css
:root {
  --md-code-section-text: #c9d1d9;
  --md-code-section-bg: #0d1117;
  --md-code-section-title: #c9d1d9;
}
```

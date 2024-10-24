import postcss from 'postcss'
import postcssNesting from 'postcss-nesting'
import fs from 'fs'
import path from 'path'

// 读取一个样式文件测试
const cssContent = fs.readFileSync(
  path.resolve('./src/components/ButtonActions/style.css'),
  'utf-8'
)

// 使用 postcss 处理
postcss([postcssNesting()])
  .process(cssContent, { from: 'src/components/ButtonActions/style.css' })
  .then(result => {
    console.log('PostCSS 处理成功！')
    console.log('处理后的 CSS 片段：')
    console.log(result.css.substring(0, 500) + '...')
  })
  .catch(err => {
    console.error('PostCSS 处理失败：', err)
  })

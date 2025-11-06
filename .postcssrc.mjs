import { postcssIsolateStyles } from 'vitepress'
import postcssNested from 'postcss-nested'

export default {
  plugins: [
    postcssNested({}),
    postcssIsolateStyles({
      includeFiles: [/vp-doc\.css/], // 默认为 /base\.css/
    })
  ],
}

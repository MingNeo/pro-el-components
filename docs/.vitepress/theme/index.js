import DefaultTheme from 'vitepress/theme'
import 'uno.css'
import Demo from './components/Demo/index.vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('Demo', Demo)
  },
}

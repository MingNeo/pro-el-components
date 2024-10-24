---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Pro El Components"
  text: "企业级高级组件库"
  tagline: "基于 Element Plus 的高级组件库，让开发更高效"
  # image:
  #   src: /logo.svg
  #   alt: Pro El Components
  actions:
    - theme: brand
      text: 指南
      link: /guide/index
    - theme: alt
      text: 组件
      link: /components/index
    - theme: alt
      text: 组合函数
      link: /composables/index
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/mingNeo/pro-el-components

features:
  - icon: 🚀
    title: 开箱即用
    details: 丰富的业务组件，快速构建中台应用，专注业务逻辑而非重复造轮子
  - icon: 🎯
    title: 企业级
    details: 专为中台系统设计，提供完整的数据展示、表单处理、页面布局解决方案
  - icon: 🔧
    title: 高度灵活
    details: 完全兼容 Element Plus，支持渐进式升级，可自由搭配原生组件使用
  - icon: 💎
    title: TypeScript 支持
    details: 完整的 TypeScript 类型定义，提供优秀的开发体验和代码提示
  - icon: 🎨
    title: 设计统一
    details: 基于 Element Plus 设计语言，保持一致的用户体验和视觉效果
  - icon: 📦
    title: 按需加载
    details: 支持树摇优化和按需引入，有效减小项目打包体积
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #409eff 30%, #67c23a);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #409eff 50%, #67c23a 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>

// 使用Vite的import.meta.glob动态导入组件
export const modules = import.meta.glob([
  '@/**/*.{vue,ts,js,md}',
])

export const modulesContent = import.meta.glob([
  '@/**/*.{vue,ts,js,md}',
], {
  query: '?raw',
})

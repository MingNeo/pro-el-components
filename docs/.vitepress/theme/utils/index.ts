// 使用Vite的import.meta.glob动态导入组件
export const modules = import.meta.glob([
  '../../../../packages/**/*.{vue,ts,js}',
])

export const modulesContent = import.meta.glob([
  '../../../../packages/**/*.{vue,ts,js}',
], {
  query: '?raw',
})

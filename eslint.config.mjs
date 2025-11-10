import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'warn',
    'antfu/top-level-function': 'off',
  },
}, {
  files: ['**/*.{js,mjs,cjs,ts,vue}'],
})

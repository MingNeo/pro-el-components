import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'warn',
  },
}, {
  files: ['**/*.{js,mjs,cjs,ts,vue}'],
})

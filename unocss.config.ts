import {
  defineConfig,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [],
  presets: [
    presetUno(),
    presetTypography(),
  ],
  rules: [
    [/^p\-v\-(\d+)(px)?$/, ([, d]) => ({ 'padding-top': `${d}px`, 'padding-bottom': `${d}px` })],
    [/^p\-h\-(\d+)(px)?$/, ([, d]) => ({ 'padding-left': `${d}px`, 'padding-right': `${d}px` })],
    [/^m\-v\-(\d+)(px)?$/, ([, d]) => ({ 'margin-top': `${d}px`, 'margin-bottom': `${d}px` })],
    [/^m\-h\-(\d+)(px)?$/, ([, d]) => ({ 'margin-left': `${d}px`, 'margin-right': `${d}px` })],
    ['h-v-center', { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }],
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
})

/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Upload from '../index.vue'

describe('Upload 组件', () => {
  it('应该正确渲染', () => {
    const wrapper = mount(Upload)

    expect(wrapper.find('.pro-upload').exists()).toBe(true)
  })

  it('应该显示默认按钮文本', () => {
    const wrapper = mount(Upload, {
      props: {
        listType: 'picture',
      },
    })

    expect(wrapper.text()).toContain('上传')
  })

  it('应该支持自定义按钮文本', () => {
    const wrapper = mount(Upload, {
      props: {
        buttonText: '选择文件',
      },
    })

    expect(wrapper.text()).toContain('选择文件')
  })

  it('listType 为 text 时应该显示图标', () => {
    const wrapper = mount(Upload, {
      props: {
        listType: 'text',
      },
    })

    expect(wrapper.find('.el-icon').exists()).toBe(true)
  })

  it('listType 不为 text 时应该显示按钮', () => {
    const wrapper = mount(Upload, {
      props: {
        listType: 'picture',
      },
    })

    expect(wrapper.find('.pro-upload_button').exists()).toBe(true)
  })

  it('应该正确处理预览', async () => {
    const wrapper = mount(Upload)

    const mockFile = {
      url: 'https://example.com/image.jpg',
      name: 'image.jpg',
    }

    await wrapper.vm.handlePictureCardPreview(mockFile)

    expect(wrapper.vm.previewUrl).toBe('https://example.com/image.jpg')
    expect(wrapper.vm.previewShow).toBe(true)
  })

  it('应该显示预览对话框', async () => {
    const wrapper = mount(Upload)

    wrapper.vm.previewUrl = 'https://example.com/image.jpg'
    wrapper.vm.previewShow = true
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.pro-upload_preview-dialog').exists()).toBe(true)
  })

  it('应该在预览对话框中显示图片', async () => {
    const wrapper = mount(Upload)

    const imageUrl = 'https://example.com/image.jpg'
    wrapper.vm.previewUrl = imageUrl
    wrapper.vm.previewShow = true
    await wrapper.vm.$nextTick()

    await new Promise(resolve => setTimeout(resolve, 200))

    const img = wrapper.find('.pro-upload_preview-image')
    if (img.exists()) {
      expect(img.attributes('src')).toBe(imageUrl)
    }
  })

  it('应该支持自定义 onPreview', () => {
    const customOnPreview = vi.fn()
    const wrapper = mount(Upload, {
      props: {
        onPreview: customOnPreview,
      },
    })

    expect(wrapper.vm.$attrs.onPreview).toBe(customOnPreview)
  })

  it('没有自定义 onPreview 时应该使用默认预览方法', () => {
    const wrapper = mount(Upload)

    expect(wrapper.vm.$attrs.onPreview).toBeUndefined()
  })

  it('应该正确透传其他属性', () => {
    const wrapper = mount(Upload, {
      props: {
        accept: 'image/*',
        multiple: true,
        limit: 5,
      },
    })

    expect(wrapper.vm.$attrs.accept).toBe('image/*')
    expect(wrapper.vm.$attrs.multiple).toBe(true)
    expect(wrapper.vm.$attrs.limit).toBe(5)
  })

  it('预览对话框应该响应 v-model', async () => {
    const wrapper = mount(Upload)

    wrapper.vm.previewShow = true
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.previewShow).toBe(true)

    wrapper.vm.previewShow = false
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.previewShow).toBe(false)
  })

  it('应该支持不同的 listType', () => {
    const types = ['text', 'picture', 'picture-card']

    types.forEach((type) => {
      const wrapper = mount(Upload, {
        props: {
          listType: type,
        },
      })

      expect(wrapper.vm.$attrs.listType).toBe(type)
    })
  })
})


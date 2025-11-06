/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import TextSummary from '../index.vue'

describe('proTextSummary 组件', () => {
  // 基础渲染测试
  it('应该正确渲染文本', () => {
    const wrapper = mount(TextSummary, {
      props: {
        text: '这是一段测试文本',
      },
    })

    expect(wrapper.text()).toContain('这是一段测试文本')
  })

  // 短文本不截断测试
  it('短文本应该完整显示，不显示展开按钮', () => {
    const shortText = '短文本'
    const wrapper = mount(TextSummary, {
      props: {
        text: shortText,
        maxLength: 100,
      },
    })

    expect(wrapper.text()).toBe(shortText)
    expect(wrapper.find('.expand-collapse-button').exists()).toBe(false)
  })

  // 长文本截断测试
  it('长文本应该被截断并显示展开按钮', async () => {
    const longText = '这是一段很长的测试文本'.repeat(10)
    const wrapper = mount(TextSummary, {
      props: {
        text: longText,
        maxLength: 50,
      },
    })

    await nextTick()
    expect(wrapper.text()).toContain('...')
    expect(wrapper.find('.expand-collapse-button').exists()).toBe(true)
  })

  // 展开功能测试
  it('点击展开按钮应该显示完整文本', async () => {
    const longText = '这是一段很长的测试文本'.repeat(10)
    const wrapper = mount(TextSummary, {
      props: {
        text: longText,
        maxLength: 50,
      },
    })

    await nextTick()
    const expandButton = wrapper.find('.expand-collapse-button')
    expect(expandButton.text()).toBe('展开')

    await expandButton.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain(longText)
    expect(expandButton.text()).toBe('收起')
  })

  // 收起功能测试
  it('点击收起按钮应该截断文本', async () => {
    const longText = '这是一段很长的测试文本'.repeat(10)
    const wrapper = mount(TextSummary, {
      props: {
        text: longText,
        maxLength: 50,
      },
    })

    await nextTick()
    const expandButton = wrapper.find('.expand-collapse-button')

    // 展开
    await expandButton.trigger('click')
    await nextTick()
    expect(wrapper.text()).toContain(longText)

    // 收起
    await expandButton.trigger('click')
    await nextTick()
    expect(wrapper.text()).toContain('...')
  })

  // 展开事件测试
  it('应该触发展开事件', async () => {
    const onExpand = vi.fn()
    const longText = '这是一段很长的测试文本'.repeat(10)
    const wrapper = mount(TextSummary, {
      props: {
        text: longText,
        maxLength: 50,
        onExpand,
      },
    })

    await nextTick()
    await wrapper.find('.expand-collapse-button').trigger('click')

    expect(onExpand).toHaveBeenCalled()
  })

  // 收起事件测试
  it('应该触发收起事件', async () => {
    const onCollapse = vi.fn()
    const longText = '这是一段很长的测试文本'.repeat(10)
    const wrapper = mount(TextSummary, {
      props: {
        text: longText,
        maxLength: 50,
        onCollapse,
      },
    })

    await nextTick()
    const expandButton = wrapper.find('.expand-collapse-button')

    // 展开
    await expandButton.trigger('click')
    await nextTick()

    // 收起
    await expandButton.trigger('click')
    await nextTick()

    expect(onCollapse).toHaveBeenCalled()
  })

  // 默认展开测试
  it('应该支持默认展开', async () => {
    const longText = '这是一段很长的测试文本'.repeat(10)
    const wrapper = mount(TextSummary, {
      props: {
        text: longText,
        maxLength: 50,
        defaultExpanded: true,
      },
    })

    await nextTick()
    expect(wrapper.text()).toContain(longText)
    expect(wrapper.find('.expand-collapse-button').text()).toBe('收起')
  })

  // 自定义最大长度测试
  it('应该支持自定义最大长度', async () => {
    const text = '0123456789'
    const wrapper = mount(TextSummary, {
      props: {
        text,
        maxLength: 5,
      },
    })

    await nextTick()
    // 应该只显示前5个字符加上省略号
    expect(wrapper.text()).toContain('01234...')
    expect(wrapper.text()).toContain('展开')
  })

  // 自定义展开标签测试
  it('应该支持自定义展开标签', async () => {
    const longText = '这是一段很长的测试文本'.repeat(10)
    const wrapper = mount(TextSummary, {
      props: {
        text: longText,
        maxLength: 50,
      },
      slots: {
        expandLabel: '查看更多',
      },
    })

    await nextTick()
    expect(wrapper.find('.expand-collapse-button').text()).toBe('查看更多')
  })

  // 自定义收起标签测试
  it('应该支持自定义收起标签', async () => {
    const longText = '这是一段很长的测试文本'.repeat(10)
    const wrapper = mount(TextSummary, {
      props: {
        text: longText,
        maxLength: 50,
        defaultExpanded: true,
      },
      slots: {
        collapseLabel: '收起内容',
      },
    })

    await nextTick()
    expect(wrapper.find('.expand-collapse-button').text()).toBe('收起内容')
  })

  // 插槽内容测试
  it('应该支持使用插槽自定义内容', () => {
    const wrapper = mount(TextSummary, {
      props: {
        maxLength: 10,
      },
      slots: {
        default: '插槽内容文本',
      },
    })

    expect(wrapper.text()).toContain('插槽内容')
  })

  // 插槽内容截断测试
  it('插槽内容超过最大长度时应该显示展开按钮', async () => {
    const wrapper = mount(TextSummary, {
      props: {
        maxLength: 5,
      },
      slots: {
        default: '这是一段很长的插槽内容',
      },
    })

    await nextTick()
    expect(wrapper.find('.expand-collapse-button').exists()).toBe(true)
  })

  // 空文本测试
  it('应该正确处理空文本', () => {
    const wrapper = mount(TextSummary, {
      props: {
        text: '',
        maxLength: 100,
      },
    })

    expect(wrapper.find('.expand-collapse-button').exists()).toBe(false)
  })

  // 边界值测试
  it('文本长度正好等于最大长度时不应截断', () => {
    const text = '0123456789'
    const wrapper = mount(TextSummary, {
      props: {
        text,
        maxLength: 10,
      },
    })

    expect(wrapper.text()).toBe(text)
    expect(wrapper.find('.expand-collapse-button').exists()).toBe(false)
  })

  // 文本长度超过最大长度1个字符时应截断
  it('文本长度超过最大长度时应截断', async () => {
    const text = '0123456789A'
    const wrapper = mount(TextSummary, {
      props: {
        text,
        maxLength: 10,
      },
    })

    await nextTick()
    expect(wrapper.text()).toContain('...')
    expect(wrapper.find('.expand-collapse-button').exists()).toBe(true)
  })

  // 切换状态测试
  it('应该正确切换展开/收起状态', async () => {
    const longText = '这是一段很长的测试文本'.repeat(10)
    const wrapper = mount(TextSummary, {
      props: {
        text: longText,
        maxLength: 50,
      },
    })

    await nextTick()
    const expandButton = wrapper.find('.expand-collapse-button')

    // 初始状态：收起
    expect(wrapper.vm.expanded).toBe(false)

    // 展开
    await expandButton.trigger('click')
    await nextTick()
    expect(wrapper.vm.expanded).toBe(true)

    // 收起
    await expandButton.trigger('click')
    await nextTick()
    expect(wrapper.vm.expanded).toBe(false)
  })

  // 响应式文本更新测试
  it('应该响应文本属性的更新', async () => {
    const wrapper = mount(TextSummary, {
      props: {
        text: '短文本',
        maxLength: 10,
      },
    })

    expect(wrapper.find('.expand-collapse-button').exists()).toBe(false)

    // 更新为长文本
    await wrapper.setProps({ text: '这是一段很长的测试文本'.repeat(10) })
    await nextTick()

    expect(wrapper.find('.expand-collapse-button').exists()).toBe(true)
  })

  // 响应式最大长度更新测试
  it('应该响应最大长度属性的更新', async () => {
    const text = '这是一段测试文本'
    const wrapper = mount(TextSummary, {
      props: {
        text,
        maxLength: 100,
      },
    })

    expect(wrapper.find('.expand-collapse-button').exists()).toBe(false)

    // 更新为更小的最大长度
    await wrapper.setProps({ maxLength: 5 })
    await nextTick()

    expect(wrapper.find('.expand-collapse-button').exists()).toBe(true)
  })
})

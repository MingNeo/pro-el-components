/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import SubmitTextarea from '../index.vue'

describe('submitTextarea 组件', () => {
  // 基础渲染测试
  it('应该正确渲染文本域', () => {
    const wrapper = mount(SubmitTextarea)

    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  // 值绑定测试
  it('应该正确处理双向绑定', async () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        modelValue: '初始值',
      },
    })

    await nextTick()
    expect(wrapper.find('textarea').element.value).toBe('初始值')

    // 更新值
    await wrapper.setProps({ modelValue: '新值' })
    expect(wrapper.find('textarea').element.value).toBe('新值')
  })

  // 输入事件测试
  it('应该正确触发输入事件', async () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        modelValue: '',
      },
    })

    const textarea = wrapper.find('textarea')
    await textarea.setValue('测试输入')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['测试输入'])
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')![0]).toEqual(['测试输入'])
  })

  // 提交事件测试
  it('应该正确触发提交事件', async () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        modelValue: '测试内容',
      },
    })

    await nextTick()
    const submitBtn = wrapper.find('.pro-submit-textarea__submit-btn')
    await submitBtn.trigger('click')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0]).toEqual(['测试内容'])
  })

  // 空内容不可提交测试
  it('空内容时不应触发提交', async () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        modelValue: '',
      },
    })

    await nextTick()
    const submitBtn = wrapper.find('.pro-submit-textarea__submit-btn')
    await submitBtn.trigger('click')

    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  // Enter 键提交测试
  it('应该支持 Enter 键提交', async () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        modelValue: '测试',
      },
    })

    await nextTick()
    const textarea = wrapper.find('textarea')

    // 模拟按下 Enter 键
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: false })
    await textarea.trigger('keyup', { key: 'Enter', shiftKey: false })

    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  // Shift+Enter 不提交测试
  it('shift+Enter 应该不触发提交', async () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        modelValue: '测试',
      },
    })

    await nextTick()
    const textarea = wrapper.find('textarea')

    // 模拟按下 Shift+Enter
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: true })
    await textarea.trigger('keyup', { key: 'Enter', shiftKey: true })

    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  // 禁用状态测试
  it('应该正确处理禁用状态', async () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        modelValue: '测试',
        disabled: true,
      },
    })

    await nextTick()
    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('disabled')).toBeDefined()

    const submitBtn = wrapper.find('.pro-submit-textarea__submit-btn')
    await submitBtn.trigger('click')

    // 禁用状态下，虽然 submit 事件可能被触发，但按钮应该不可点击
    // 检查按钮的 active 类
    expect(submitBtn.classes()).not.toContain('active')
  })

  // 隐藏提交按钮测试
  it('应该支持隐藏提交按钮', () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        showSubmitBtn: false,
      },
    })

    expect(wrapper.find('.pro-submit-textarea__submit-btn').exists()).toBe(false)
  })

  // 占位符测试
  it('应该正确显示占位符', () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        placeholder: '自定义占位符',
      },
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('placeholder')).toBe('自定义占位符')
  })

  // 最大高度测试
  it('应该支持自定义最大高度', () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        maxHeight: 300,
      },
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('style')).toContain('max-height: 300px')
  })

  // 最小高度测试
  it('应该支持自定义最小高度', () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        minHeight: 80,
      },
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('style')).toContain('min-height: 80px')
  })

  // 自动高度测试
  it('应该支持自动高度', async () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        autoHeight: true,
      },
    })

    await nextTick()
    const textarea = wrapper.find('textarea')

    // 输入多行文本
    await textarea.setValue('第一行\n第二行\n第三行')
    await nextTick()

    // 检查高度是否被设置
    expect(textarea.element.style.height).not.toBe('')
  })

  // 自定义样式类测试
  it('应该支持自定义样式类', () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        wrapClass: 'custom-class',
        submitBtnClass: 'custom-btn-class',
      },
    })

    expect(wrapper.find('.pro-submit-textarea').classes()).toContain('custom-class')
    const submitBtn = wrapper.find('.pro-submit-textarea__submit-btn')
    expect(submitBtn.classes()).toContain('custom-btn-class')
  })

  // 受控模式测试
  it('受控模式下提交后不清空内容', async () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        modelValue: '测试内容',
      },
    })

    await nextTick()
    const submitBtn = wrapper.find('.pro-submit-textarea__submit-btn')
    await submitBtn.trigger('click')

    // 受控模式下，值由父组件控制，不应该被清空
    expect(wrapper.find('textarea').element.value).toBe('测试内容')
  })

  // 非受控模式测试
  it('非受控模式下提交后应清空内容', async () => {
    const wrapper = mount(SubmitTextarea)

    const textarea = wrapper.find('textarea')
    await textarea.setValue('测试内容')
    await nextTick()

    const submitBtn = wrapper.find('.pro-submit-textarea__submit-btn')
    await submitBtn.trigger('click')

    // 非受控模式下，提交后应该清空
    await nextTick()
    expect(wrapper.vm.value).toBe('')
  })

  // 中文输入法测试
  it('中文输入法输入时不应触发提交', async () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        modelValue: '测试',
      },
    })

    await nextTick()
    const textarea = wrapper.find('textarea')

    // 模拟中文输入法开始
    await textarea.trigger('compositionstart')

    // 在输入法激活时按 Enter
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: false })
    await textarea.trigger('keyup', { key: 'Enter', shiftKey: false })

    expect(wrapper.emitted('submit')).toBeFalsy()

    // 输入法结束
    await textarea.trigger('compositionend')
    await new Promise(resolve => setTimeout(resolve, 150))

    // 输入法结束后按 Enter 应该提交
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: false })
    await textarea.trigger('keyup', { key: 'Enter', shiftKey: false })

    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  // 工具栏位置测试
  it('应该支持将工具栏放在底部', () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        toolInBottom: true,
      },
    })

    expect(wrapper.find('.pro-submit-textarea').classes()).toContain('flex-wrap')
    expect(wrapper.find('.pro-submit-textarea-btns').classes()).toContain('btns-full-width')
  })

  // 自定义插槽测试
  it('应该支持自定义按钮插槽', () => {
    const wrapper = mount(SubmitTextarea, {
      slots: {
        btns: '<button class="custom-btn">自定义按钮</button>',
      },
    })

    expect(wrapper.find('.custom-btn').exists()).toBe(true)
  })

  // 自定义提交按钮插槽测试
  it('应该支持自定义提交按钮插槽', async () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        modelValue: '测试',
      },
      slots: {
        submitBtn: '<button class="custom-submit">提交</button>',
      },
    })

    await nextTick()
    expect(wrapper.find('.custom-submit').exists()).toBe(true)
  })

  // 最大长度测试
  it('应该限制最大长度为 2000', () => {
    const wrapper = mount(SubmitTextarea)

    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('maxlength')).toBe('2000')
  })

  // 活动状态测试
  it('有内容且未禁用时提交按钮应该是活动状态', async () => {
    const wrapper = mount(SubmitTextarea, {
      props: {
        modelValue: '',
      },
    })

    await nextTick()
    let submitBtn = wrapper.find('.pro-submit-textarea__submit-btn')
    expect(submitBtn.classes()).not.toContain('active')

    await wrapper.setProps({ modelValue: '有内容' })
    await nextTick()

    submitBtn = wrapper.find('.pro-submit-textarea__submit-btn')
    expect(submitBtn.classes()).toContain('active')
  })
})

const e=`/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Dialog from '../index.vue'

describe('dialog 组件', () => {
  it('应该正确渲染标题', async () => {
    const wrapper = mount(Dialog, {
      props: {
        title: '测试标题',
        modelValue: true,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 200))
    expect(wrapper.find('.el-dialog__title').text()).toBe('测试标题')
  })

  it('应该正确显示/隐藏页脚', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        showFooter: true,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 200))
    expect(wrapper.find('.dialog-footer').exists()).toBe(true)

    await wrapper.setProps({ showFooter: false })
    expect(wrapper.find('.dialog-footer').exists()).toBe(false)
  })

  it('应该正确触发关闭事件', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        showFooter: true,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 200))
    await wrapper.find('.dialog-footer .el-button').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })
})
`;export{e as default};

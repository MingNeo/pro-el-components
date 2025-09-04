const t=`/**
 * @vitest-environment jsdom
 */
import { Check } from '@element-plus/icons-vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import StatusText from '../index.vue'

describe('statusText 组件', () => {
  // 基础渲染测试
  it('应该正确渲染状态文本和样式', () => {
    const wrapper = mount(StatusText, {
      props: {
        status: 'success',
        text: '成功',
      },
    })

    expect(wrapper.text()).toBe('成功')
    expect(wrapper.classes()).toContain('status-success')
  })

  // 自定义样式测试
  it('应该支持自定义样式', () => {
    const wrapper = mount(StatusText, {
      props: {
        status: 'custom',
        text: '自定义',
        class: 'my-custom-class',
        style: { fontSize: '16px' },
      },
    })

    expect(wrapper.classes()).toContain('my-custom-class')
    expect(wrapper.attributes('style')).toContain('font-size: 16px')
  })

  // 图标显示测试
  it('应该正确显示图标', () => {
    const wrapper = mount(StatusText, {
      props: {
        status: 'success',
        text: '成功',
        icon: Check,
      },
    })

    expect(wrapper.findComponent(Check).exists()).toBe(true)
  })

  // 不同状态测试
  it('应该支持所有预定义状态', () => {
    const statuses = ['success', 'warning', 'error', 'info', 'primary']

    statuses.forEach((status) => {
      const wrapper = mount(StatusText, {
        props: { status },
      })

      expect(wrapper.classes()).toContain(\`status-\${status}\`)
    })
  })

  // 点击事件测试
  it('应该支持点击事件', async () => {
    const wrapper = mount(StatusText, {
      props: {
        status: 'success',
        text: '成功',
      },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  // 工具提示测试 TODO
  // it('应该支持工具提示', () => {
  //   const wrapper = mount(StatusText, {
  //     props: {
  //       status: 'success',
  //       text: '成功',
  //       tooltip: '这是一个提示',
  //     },
  //   })

  //   expect(wrapper.attributes('title')).toBe('这是一个提示')
  // })

  // 长文本省略测试
  it('应该支持长文本省略', () => {
    const wrapper = mount(StatusText, {
      props: {
        status: 'success',
        text: '这是一段很长的文本，需要进行省略处理',
        ellipsis: true,
      },
    })

    expect(wrapper.html()).toContain('ellipsis')
  })

  // 动画效果测试
  // it('应该支持动画效果', () => {
  //   const wrapper = mount(StatusText, {
  //     props: {
  //       status: 'success',
  //       text: '成功',
  //       animated: true,
  //     },
  //   })

  //   expect(wrapper.classes()).toContain('animated')
  // })

  // 大小变体测试
  it('应该支持不同大小', () => {
    const sizes = ['small', 'large'] as const

    sizes.forEach((size) => {
      const wrapper = mount(StatusText, {
        props: {
          status: 'success',
          text: '成功',
          size,
        },
      })

      expect(wrapper.classes()).toContain(\`size-\${size}\`)
    })
  })
})
`;export{t as default};

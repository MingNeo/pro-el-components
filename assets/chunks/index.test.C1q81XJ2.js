const e=`/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import SectionHeader from '../index.vue'

describe('sectionHeader', () => {
  it('renders title correctly', () => {
    const wrapper = mount(SectionHeader, {
      props: {
        title: '测试标题',
      },
    })
    expect(wrapper.text()).toContain('测试标题')
  })

  it('renders subtitle when provided', () => {
    const wrapper = mount(SectionHeader, {
      props: {
        title: '测试标题',
        subtitle: '测试副标题',
      },
    })
    expect(wrapper.text()).toContain('测试副标题')
  })

  it('shows border when bordered prop is true', () => {
    const wrapper = mount(SectionHeader, {
      props: {
        title: '测试标题',
        bordered: true,
      },
    })
    expect(wrapper.classes()).toContain('bordered')
  })

  it('triggers onClick callback', async () => {
    const onClick = vi.fn()
    const wrapper = mount(SectionHeader, {
      props: {
        title: '测试标题',
        onClick,
      },
    })
    await wrapper.find('.pro-section-header__left').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('renders custom slots correctly', () => {
    const wrapper = mount(SectionHeader, {
      slots: {
        left: '<div class="custom-left">左侧内容</div>',
        right: '<div class="custom-right">右侧内容</div>',
      },
    })
    expect(wrapper.find('.custom-left').exists()).toBe(true)
    expect(wrapper.find('.custom-right').exists()).toBe(true)
  })
})
`;export{e as default};

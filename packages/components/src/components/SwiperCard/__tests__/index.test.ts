/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SwiperCard from '../index.vue'

describe('swiperCard 组件', () => {
  // Mock offsetWidth and scrollWidth
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 500,
    })

    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      value: 1000,
    })
  })

  it('应该正确渲染', () => {
    const wrapper = mount(SwiperCard, {
      slots: {
        default: '<div class="item">Item 1</div>',
      },
    })

    expect(wrapper.find('.pro-swiper-card').exists()).toBe(true)
  })

  it('应该渲染插槽内容', () => {
    const wrapper = mount(SwiperCard, {
      slots: {
        default: '<div class="swiper-item">Item 1</div><div class="swiper-item">Item 2</div>',
      },
    })

    expect(wrapper.findAll('.swiper-item').length).toBe(2)
  })

  it('初始状态 translateX 应该为 0', () => {
    const wrapper = mount(SwiperCard)

    expect(wrapper.vm.translateX).toBe(0)
  })

  it('初始状态不应该显示动画', () => {
    const wrapper = mount(SwiperCard)

    expect(wrapper.vm.showAnimate).toBe(false)
  })

  it('应该包含左右按钮', () => {
    const wrapper = mount(SwiperCard)

    expect(wrapper.find('.swiper-left-btn').exists()).toBe(true)
    expect(wrapper.find('.swiper-right-btn').exists()).toBe(true)
  })

  it('应该包含内容容器', () => {
    const wrapper = mount(SwiperCard)

    expect(wrapper.find('.pro-swiper-card-container').exists()).toBe(true)
    expect(wrapper.find('.pro-swiper-card-content').exists()).toBe(true)
  })

  it('moveRight 应该增加 translateX', async () => {
    const wrapper = mount(SwiperCard, {
      slots: {
        default: `
          <div class="item" style="width: 100px; margin-right: 8px;">Item 1</div>
          <div class="item" style="width: 100px; margin-right: 8px;">Item 2</div>
          <div class="item" style="width: 100px; margin-right: 8px;">Item 3</div>
        `,
      },
    })

    // Mock querySelector and offsetWidth
    const mockElement = {
      offsetWidth: 100,
      scrollWidth: 1000,
      querySelector: vi.fn().mockReturnValue({
        children: [{ offsetWidth: 100 }],
        scrollWidth: 1000,
      }),
    }

    wrapper.vm.container = mockElement as any

    const initialTranslateX = wrapper.vm.translateX

    await wrapper.vm.moveRight()

    expect(wrapper.vm.translateX).toBeGreaterThan(initialTranslateX)
  })

  // it('moveLeft 应该减少 translateX', async () => {
  //   const wrapper = mount(SwiperCard)

  //   const mockElement = {
  //     offsetWidth: 500,
  //     scrollWidth: 1000,
  //     querySelector: vi.fn().mockReturnValue({
  //       children: [{ offsetWidth: 100 }],
  //       scrollWidth: 1000,
  //     }),
  //   }

  //   wrapper.vm.container = mockElement as any
  //   wrapper.vm.translateX = 200

  //   await wrapper.vm.moveLeft()

  //   expect(wrapper.vm.translateX).toBeLessThan(200)
  // })

  // it('translateX 为 0 时 moveLeft 不应该改变位置', async () => {
  //   const wrapper = mount(SwiperCard)

  //   wrapper.vm.translateX = 0

  //   await wrapper.vm.moveLeft()

  //   expect(wrapper.vm.translateX).toBe(0)
  // })

  // it('setTranslateX 应该限制在有效范围内', () => {
  //   const wrapper = mount(SwiperCard)

  //   const mockElement = {
  //     offsetWidth: 500,
  //     querySelector: vi.fn().mockReturnValue({
  //       scrollWidth: 1000,
  //     }),
  //   }

  //   wrapper.vm.container = mockElement as any

  //   // 设置负值应该被限制为 0
  //   wrapper.vm.setTranslateX(-100)
  //   expect(wrapper.vm.translateX).toBe(0)

  //   // 设置超过最大值应该被限制为最大值
  //   wrapper.vm.setTranslateX(1000)
  //   expect(wrapper.vm.translateX).toBe(500) // maxOffset = 1000 - 500 = 500
  // })

  // it('setShowAnimate 应该设置动画状态', () => {
  //   const wrapper = mount(SwiperCard)

  //   expect(wrapper.vm.showAnimate).toBe(false)

  //   wrapper.vm.setShowAnimate()

  //   expect(wrapper.vm.showAnimate).toBe(true)
  // })

  // it('handleCheckShowBtn 应该更新按钮显示状态', () => {
  //   const wrapper = mount(SwiperCard)

  //   const mockElement = {
  //     offsetWidth: 500,
  //     querySelector: vi.fn().mockReturnValue({
  //       scrollWidth: 1000,
  //     }),
  //   }

  //   wrapper.vm.container = mockElement as any

  //   // translateX = 0, 左按钮不显示，右按钮显示
  //   wrapper.vm.translateX = 0
  //   wrapper.vm.handleCheckShowBtn()

  //   expect(wrapper.vm.showLeft).toBe(false)
  //   expect(wrapper.vm.showRight).toBe(true)

  //   // translateX > 0, 左按钮显示
  //   wrapper.vm.translateX = 100
  //   wrapper.vm.handleCheckShowBtn()

  //   expect(wrapper.vm.showLeft).toBe(true)
  // })

  // it('应该在鼠标进入时检查按钮显示', async () => {
  //   const wrapper = mount(SwiperCard)

  //   const mockElement = {
  //     offsetWidth: 500,
  //     querySelector: vi.fn().mockReturnValue({
  //       scrollWidth: 1000,
  //     }),
  //   }

  //   wrapper.vm.container = mockElement as any

  //   await wrapper.find('.pro-swiper-card').trigger('mouseenter')

  //   // handleCheckShowBtn 应该被调用
  //   expect(wrapper.vm.showLeft).toBeDefined()
  //   expect(wrapper.vm.showRight).toBeDefined()
  // })

  // it('点击左按钮应该调用 moveLeft', async () => {
  //   const wrapper = mount(SwiperCard)

  //   const moveLeftSpy = vi.spyOn(wrapper.vm, 'moveLeft')

  //   await wrapper.find('.swiper-left-btn').trigger('click')

  //   expect(moveLeftSpy).toHaveBeenCalled()
  // })

  // it('点击右按钮应该调用 moveRight', async () => {
  //   const wrapper = mount(SwiperCard)

  //   const moveRightSpy = vi.spyOn(wrapper.vm, 'moveRight')

  //   await wrapper.find('.swiper-right-btn').trigger('click')

  //   expect(moveRightSpy).toHaveBeenCalled()
  // })

  // it('应该正确应用 transform 样式', () => {
  //   const wrapper = mount(SwiperCard)

  //   wrapper.vm.translateX = 100

  //   const content = wrapper.find('.pro-swiper-card-content')
  //   expect(content.attributes('style')).toContain('translateX')
  // })

  // it('有动画时应该添加动画类', async () => {
  //   const wrapper = mount(SwiperCard)

  //   wrapper.vm.showAnimate = true
  //   await wrapper.vm.$nextTick()

  //   const content = wrapper.find('.pro-swiper-card-content')
  //   expect(content.classes()).toContain('transition-animate')
  // })

  // it('无动画时不应该有动画类', () => {
  //   const wrapper = mount(SwiperCard)

  //   wrapper.vm.showAnimate = false

  //   const content = wrapper.find('.pro-swiper-card-content')
  //   expect(content.classes()).not.toContain('transition-animate')
  // })

  // it('应该正确透传属性', () => {
  //   const wrapper = mount(SwiperCard, {
  //     attrs: {
  //       'data-testid': 'swiper',
  //       'class': 'custom-class',
  //     },
  //   })

  //   expect(wrapper.attributes('data-testid')).toBe('swiper')
  // })

  // it('showLeft 为 false 时不应该显示左按钮', async () => {
  //   const wrapper = mount(SwiperCard)

  //   wrapper.vm.showLeft = false
  //   await wrapper.vm.$nextTick()

  //   const leftBtn = wrapper.find('.swiper-left-btn')
  //   expect(leftBtn.element.style.display).toBe('none')
  // })

  // it('容器应该有正确的类名', async () => {
  //   const wrapper = mount(SwiperCard)

  //   wrapper.vm.showLeft = true
  //   wrapper.vm.showRight = true
  //   await wrapper.vm.$nextTick()

  //   const container = wrapper.find('.pro-swiper-card-container')
  //   expect(container.classes()).toContain('show-left')
  //   expect(container.classes()).toContain('show-right')
  // })

  // it('getMaxOffset 应该返回正确的最大偏移量', () => {
  //   const wrapper = mount(SwiperCard)

  //   const mockElement = {
  //     offsetWidth: 500,
  //     querySelector: vi.fn().mockReturnValue({
  //       scrollWidth: 1000,
  //     }),
  //   }

  //   wrapper.vm.container = mockElement as any

  //   const maxOffset = wrapper.vm.getMaxOffset()
  //   expect(maxOffset).toBe(500) // 1000 - 500
  // })
})

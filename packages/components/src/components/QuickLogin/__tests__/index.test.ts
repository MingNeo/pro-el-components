/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { ElMessage } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'
import QuickLogin from '../index.vue'

vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElMessage: {
      error: vi.fn(),
    },
  }
})

describe('QuickLogin 组件', () => {
  const mockGetCaptcha = vi.fn().mockResolvedValue(undefined)
  const mockLogin = vi.fn().mockResolvedValue(undefined)

  it('应该正确渲染', () => {
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login: mockLogin,
      },
    })

    expect(wrapper.find('.pro-quick-login').exists()).toBe(true)
  })

  it('应该显示默认标题', () => {
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login: mockLogin,
      },
    })

    expect(wrapper.text()).toContain('登录')
  })

  it('应该渲染用户名输入框', () => {
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login: mockLogin,
      },
    })

    const usernameInput = wrapper.find('input[placeholder="请输入账号"]')
    expect(usernameInput.exists()).toBe(true)
  })

  it('应该渲染验证码输入框', () => {
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login: mockLogin,
      },
    })

    const codeInput = wrapper.find('input[placeholder="验证码"]')
    expect(codeInput.exists()).toBe(true)
  })

  it('应该渲染获取验证码按钮', () => {
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login: mockLogin,
      },
    })

    expect(wrapper.text()).toContain('获取验证码')
  })

  it('应该正确调用获取验证码方法', async () => {
    const getCaptcha = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha,
        login: mockLogin,
      },
    })

    await wrapper.vm.handleGetCaptcha()

    expect(getCaptcha).toHaveBeenCalled()
  })

  it('获取验证码成功后应该触发 captchaSent 事件', async () => {
    const getCaptcha = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha,
        login: mockLogin,
      },
    })

    await wrapper.vm.handleGetCaptcha()

    expect(wrapper.emitted('captchaSent')).toBeTruthy()
  })

  it('获取验证码失败时应该显示错误信息', async () => {
    const errorMessage = '网络错误'
    const getCaptcha = vi.fn().mockRejectedValue(new Error(errorMessage))
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha,
        login: mockLogin,
      },
    })

    await wrapper.vm.handleGetCaptcha()

    expect(ElMessage.error).toHaveBeenCalled()
  })

  it('应该支持自定义验证码失败提示', async () => {
    const customMessage = '自定义错误提示'
    const getCaptcha = vi.fn().mockRejectedValue(new Error('error'))
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha,
        login: mockLogin,
        errorMessages: {
          captchaFailed: customMessage,
        },
      },
    })

    await wrapper.vm.handleGetCaptcha()

    expect(ElMessage.error).toHaveBeenCalledWith(expect.stringContaining(customMessage))
  })

  it('应该正确调用登录方法', async () => {
    const login = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login,
      },
    })

    wrapper.vm.formData.username = 'testuser'
    wrapper.vm.formData.code = '123456'

    await wrapper.vm.handleSubmit()

    expect(login).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'testuser',
        code: '123456',
      }),
    )
  })

  it('登录成功后应该触发 success 事件', async () => {
    const login = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login,
      },
    })

    await wrapper.vm.handleSubmit()

    expect(wrapper.emitted('success')).toBeTruthy()
  })

  it('登录失败时应该显示错误信息', async () => {
    const login = vi.fn().mockRejectedValue(new Error('登录失败'))
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login,
      },
    })

    await wrapper.vm.handleSubmit()

    expect(ElMessage.error).toHaveBeenCalled()
  })

  it('应该支持自定义登录失败提示', async () => {
    const customMessage = '自定义登录失败提示'
    const login = vi.fn().mockRejectedValue(new Error('error'))
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login,
        errorMessages: {
          loginFailed: customMessage,
        },
      },
    })

    await wrapper.vm.handleSubmit()

    expect(ElMessage.error).toHaveBeenCalledWith(expect.stringContaining(customMessage))
  })

  it('应该使用默认倒计时时长 60 秒', () => {
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login: mockLogin,
      },
    })

    expect(wrapper.vm.$props.countdownDuration).toBe(60)
  })

  it('应该支持自定义倒计时时长', () => {
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login: mockLogin,
        countdownDuration: 120,
      },
    })

    expect(wrapper.vm.$props.countdownDuration).toBe(120)
  })

  it('应该支持自定义类名', () => {
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login: mockLogin,
        className: 'custom-class',
      },
    })

    expect(wrapper.find('.pro-quick-login.custom-class').exists()).toBe(true)
  })

  it('应该包含记住协议的复选框', () => {
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login: mockLogin,
      },
    })

    expect(wrapper.find('.quick-login__agreement').exists()).toBe(true)
  })

  it('未勾选协议时登录按钮应该禁用', () => {
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login: mockLogin,
      },
    })

    const loginButton = wrapper.find('.quick-login__submit')
    expect(loginButton.attributes('disabled')).toBeDefined()
  })

  it('应该支持标题插槽', () => {
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login: mockLogin,
      },
      slots: {
        title: '自定义标题',
      },
    })

    expect(wrapper.text()).toContain('自定义标题')
  })

  it('应该支持表单头部插槽', () => {
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login: mockLogin,
      },
      slots: {
        formHeader: '<div class="custom-header">表单头部</div>',
      },
    })

    expect(wrapper.find('.custom-header').exists()).toBe(true)
  })

  it('应该支持协议文本插槽', () => {
    const wrapper = mount(QuickLogin, {
      props: {
        getCaptcha: mockGetCaptcha,
        login: mockLogin,
      },
      slots: {
        agreementText: '自定义协议文本',
      },
    })

    expect(wrapper.text()).toContain('自定义协议文本')
  })
})


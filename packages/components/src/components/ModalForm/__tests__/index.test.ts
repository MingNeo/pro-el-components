/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { ElDialog, ElForm, ElFormItem } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ModalForm from '../index.vue'

describe('modalForm 组件', () => {
  // 基础渲染测试
  it('正确渲染基础组件', async () => {
    const wrapper = mount(ModalForm, {
      props: {
        modelValue: true,
        title: '测试标题',
        fields: [
          {
            prop: 'name',
            label: '姓名',
            type: 'input',
            required: true,
          },
        ],
      },
    })

    await nextTick()

    expect(wrapper.findComponent(ElDialog).exists()).toBe(true)
    expect(wrapper.findComponent(ElForm).exists()).toBe(true)
    expect(wrapper.findComponent(ElFormItem).exists()).toBe(true)
    expect(wrapper.html()).toContain('测试标题')
  })

  // 表单数据测试
  it('正确处理表单数据', async () => {
    const defaultValue = { name: '测试' }
    const wrapper = mount(ModalForm, {
      props: {
        modelValue: true,
        defaultValue,
      },
    })

    expect(wrapper.vm.formData).toEqual(defaultValue)

    // 测试数据更新
    await wrapper.setProps({ defaultValue: { name: '新测试' } })
    expect(wrapper.vm.formData).toEqual({ name: '新测试' })
  })

  // 按钮操作测试
  it('正确处理按钮点击事件', async () => {
    const onCancel = vi.fn()
    const onOk = vi.fn()
    const onUpdateModelValue = vi.fn()

    const wrapper = mount(ModalForm, {
      props: {
        'modelValue': true,
        'onUpdate:modelValue': onUpdateModelValue,
        onCancel,
        onOk,
      },
    })

    // 等待组件挂载完成
    await nextTick()

    // 测试取消按钮
    const cancelBtn = wrapper.find('button.el-button:first-child')
    await cancelBtn.trigger('click')
    await nextTick()
    expect(onCancel).toHaveBeenCalled()
    expect(onUpdateModelValue).toHaveBeenCalledWith(false)

    // 测试确定按钮
    const submitBtn = wrapper.find('button.el-button--primary')
    await submitBtn.trigger('click')
    await nextTick()
    expect(onOk).toHaveBeenCalled()
    expect(onUpdateModelValue).toHaveBeenCalledWith(false)
  })

  // 视图模式测试
  it('在视图模式下正确显示', async () => {
    const wrapper = mount(ModalForm, {
      props: {
        modelValue: true,
        viewMode: true,
        defaultValue: { name: '测试用户' },
        fields: [
          {
            prop: 'name',
            label: '姓名',
            type: 'input',
          },
        ],
      },
    })
    await nextTick()
    // 视图模式下不应该显示输入框
    expect(wrapper.find('.el-input').exists()).toBe(false)
    // 应该显示文本值
    expect(wrapper.find('.el-form-item__content').text()).toBe('测试用户')

    const submitBtn = wrapper.find('button.el-button--primary')
    expect(submitBtn.text()).toBe('确定')
  })

  // 表单重置测试
  it('正确处理表单重置', async () => {
    const defaultValue = { name: '测试' }
    const onUpdateModelValue = vi.fn()

    const wrapper = mount(ModalForm, {
      props: {
        'modelValue': true,
        defaultValue,
        'resetOnClose': true,
        'onUpdate:modelValue': onUpdateModelValue,
      },
    })

    // 等待初始挂载
    await nextTick()

    // 修改表单数据
    wrapper.vm.formData = { name: '新值' }
    await nextTick()
    expect(wrapper.vm.formData).toEqual({ name: '新值' })

    // 触发关闭按钮点击
    const cancelBtn = wrapper.findAll('button.el-button').filter(btn => btn.text().includes('取消'))[0]
    await cancelBtn.trigger('click')
    await nextTick()

    // 验证数据是否重置
    expect(wrapper.vm.formData).toEqual(defaultValue)
    expect(onUpdateModelValue).toHaveBeenCalledWith(false)
  })

  // 测试表单数据的响应性
  it('正确响应表单数据的变化', async () => {
    const wrapper = mount(ModalForm, {
      props: {
        modelValue: true,
        defaultValue: { name: '初始值' },
      },
    })

    await nextTick()
    expect(wrapper.vm.formData).toEqual({ name: '初始值' })

    // 直接修改表单数据
    wrapper.vm.formData = { name: '修改后的值' }
    await nextTick()
    expect(wrapper.vm.formData).toEqual({ name: '修改后的值' })

    // 通过 props 更新
    await wrapper.setProps({ defaultValue: { name: '通过props更新' } })
    await nextTick()
    expect(wrapper.vm.formData).toEqual({ name: '通过props更新' })
  })

  // 加载状态测试
  it('正确显示加载状态', async () => {
    const wrapper = mount(ModalForm, {
      props: {
        modelValue: true,
        loading: true,
      },
    })

    await nextTick()

    expect(wrapper.find('.el-overlay-dialog').exists()).toBe(true)

    // 确认按钮应该被禁用
    const submitBtn = wrapper.findAll('.el-button').filter(btn => btn.text().includes('确定'))[0]
    expect(submitBtn).not.toBeTruthy()
  })

  // 表单验证测试
  it('应该在提交前进行表单验证', async () => {
    const onOk = vi.fn()
    const wrapper = mount(ModalForm, {
      props: {
        modelValue: true,
        fields: [
          {
            prop: 'name',
            label: '姓名',
            type: 'input',
            required: true,
          },
        ],
        onOk,
      },
    })

    await nextTick()
    // 不填写必填字段直接提交
    const submitBtn = wrapper.findAll('button').find(btn => btn.text().includes('提交'))
    await submitBtn!.trigger('click')

    // 验证失败,onOk不应被调用
    expect(onOk).not.toHaveBeenCalled()
  })

  // 自定义按钮测试
  it('应该支持自定义操作按钮', async () => {
    const customActions: any[] = [
      { text: '保存草稿', onClick: vi.fn() },
      { text: '提交', type: 'primary', onClick: vi.fn() },
    ]

    const wrapper = mount(ModalForm, {
      props: {
        modelValue: true,
        actions: customActions,
      },
    })

    await nextTick()
    const buttons = wrapper.findAll('.el-button')
    expect(buttons).toHaveLength(customActions.length)
    expect(buttons[0].text()).toBe('保存草稿')
    expect(buttons[1].text()).toBe('提交')
  })
})

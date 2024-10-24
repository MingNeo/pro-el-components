/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ModalDetail from '../index.vue'

describe('modalDetail 组件', () => {
  // 基础渲染测试
  it('正确渲染组件', () => {
    const wrapper = mount(ModalDetail, {
      props: {
        modelValue: true,
        fields: [],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  // 测试不同模式下的标题显示
  it('根据不同模式显示正确的标题', () => {
    const title = {
      create: '创建',
      edit: '编辑',
      detail: '详情',
    }

    const wrapper = mount(ModalDetail, {
      props: {
        modelValue: true,
        fields: [],
        title,
      },
    })
    expect(wrapper.props('title')).toEqual(title)
  })

  // 测试表单数据变更事件
  it('正确触发表单数据变更事件', async () => {
    const wrapper = mount(ModalDetail, {
      props: {
        'modelValue': true,
        'fields': [],
        'onUpdate:formData': (e: any) => wrapper.setProps({ formData: e }),
      },
    })

    const formData = { name: '测试' }
    await (wrapper.vm as any).handleFormDataChange(formData)

    expect(wrapper.emitted('update:formData')?.[0][0]).toEqual(formData)
    expect(wrapper.emitted('formChange')?.[0][0]).toEqual(formData)
  })

  // 测试提交功能
  it('正确处理表单提交', async () => {
    const updateService = vi.fn()
    const createService = vi.fn()

    const wrapper = mount(ModalDetail, {
      props: {
        modelValue: true,
        fields: [],
        updateService,
        createService,
      },
    })

    const formData = { name: '测试数据' }

    // 测试创建模式
    await (wrapper.vm as any).handleOk(formData)
    expect(createService).toHaveBeenCalledWith(formData)

    // 测试编辑模式
    await wrapper.setProps({
      formData: { id: 1 },
      idKey: 'id',
    })

    await (wrapper.vm as any).handleOk(formData)
    expect(updateService).toHaveBeenCalledWith(formData)
  })

  // 测试取消操作
  it('正确处理取消操作', async () => {
    const wrapper = mount(ModalDetail, {
      props: {
        modelValue: true,
        fields: [],
      },
    })

    await (wrapper.vm as any).handleCancel()
    expect(wrapper.emitted('update:modelValue')?.[0][0]).toBe(false)
  })

  // 测试查看模式
  it('在查看模式下正确渲染', () => {
    const wrapper = mount(ModalDetail, {
      props: {
        modelValue: true,
        fields: [],
        viewMode: true,
      },
    })

    expect(wrapper.vm.mode).toBe('detail')
  })

  // 测试打开事件
  it('在打开时触发open事件', async () => {
    const wrapper = mount(ModalDetail, {
      props: {
        modelValue: false,
        fields: [],
      },
    })

    await wrapper.setProps({ modelValue: true })
    expect(wrapper.emitted('open')).toBeTruthy()
  })
})

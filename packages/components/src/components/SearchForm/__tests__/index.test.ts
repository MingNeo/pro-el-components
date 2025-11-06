/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { ElForm } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import ProFormFields from '../../FormFields/index.vue'
import SearchForm from '../index.vue'

describe('proSearchForm 组件', () => {
  const mockFields = [
    { prop: 'name', label: '名称', type: 'input' },
    { prop: 'status', label: '状态', type: 'select', options: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] },
    { prop: 'date', label: '日期', type: 'datePicker' },
  ]

  // 基础渲染测试
  it('应该正确渲染搜索表单', () => {
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
      },
    })

    expect(wrapper.findComponent(ElForm).exists()).toBe(true)
    expect(wrapper.findComponent(ProFormFields).exists()).toBe(true)
  })

  // 字段渲染测试
  it('应该正确渲染所有字段', async () => {
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
      },
    })

    await nextTick()
    const formFields = wrapper.findComponent(ProFormFields)
    expect(formFields.props('fields')).toHaveLength(3)
  })

  // 提交事件测试
  it('应该正确触发提交事件', async () => {
    const onSubmit = vi.fn()
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
        defaultValue: { name: '测试' },
        onSubmit,
      },
    })

    await nextTick()
    const submitButton = wrapper.findAll('.el-button').find(btn => btn.text().includes('搜索'))
    await submitButton?.trigger('click')

    expect(onSubmit).toHaveBeenCalledWith({ name: '测试' })
  })

  // 重置事件测试
  it('应该正确触发重置事件', async () => {
    const onReset = vi.fn()
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
        defaultValue: { name: '测试' },
        onReset,
      },
    })

    await nextTick()
    const resetButton = wrapper.findAll('.el-button').find(btn => btn.text().includes('重置'))
    await resetButton?.trigger('click')

    expect(onReset).toHaveBeenCalledWith({})
  })

  // 表单数据变化测试
  it('应该正确处理表单数据变化', async () => {
    const onChange = vi.fn()
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
        defaultValue: {},
        onChange,
      },
    })

    await nextTick()
    // 修改表单数据
    wrapper.vm.searchFormData = { name: '新值' }
    await nextTick()

    expect(onChange).toHaveBeenCalled()
  })

  // 默认值测试
  it('应该正确设置默认值', async () => {
    const defaultValue = { name: '默认名称', status: 1 }
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
        defaultValue,
      },
    })

    await nextTick()
    expect(wrapper.vm.searchFormData).toEqual(defaultValue)
  })

  // 折叠功能测试
  it('应该正确处理折叠功能', async () => {
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
        collapsible: true,
        defaultCollapsed: true,
        collapseRows: 1,
        column: 2,
      },
    })

    await nextTick()
    // 默认折叠状态只显示部分字段
    expect(wrapper.vm.showFields).toHaveLength(2)

    // 点击展开按钮
    const collapseButton = wrapper.findAll('.el-button').find(btn => btn.text().includes('展开'))
    await collapseButton?.trigger('click')
    await nextTick()

    // 展开后显示所有字段
    expect(wrapper.vm.showFields).toHaveLength(3)
  })

  // 自定义折叠字段测试
  it('应该支持自定义折叠字段', async () => {
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
        collapsible: true,
        defaultCollapsed: true,
        collapsedFields: ['name', 'status'],
      },
    })

    await nextTick()
    // 只显示指定的字段
    expect(wrapper.vm.showFields).toHaveLength(2)
    expect(wrapper.vm.showFields.map((f: any) => f.prop)).toEqual(['name', 'status'])
  })

  // 列数配置测试
  it('应该支持自定义列数', () => {
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
        column: 4,
      },
    })

    const formFields = wrapper.findComponent(ProFormFields)
    expect(formFields.props('column')).toBe(4)
  })

  // 隐藏操作按钮测试
  it('应该支持隐藏操作按钮', async () => {
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
        showActions: false,
      },
    })

    await nextTick()
    const buttons = wrapper.findAll('.el-button')
    expect(buttons.filter(btn => btn.text().includes('查询') || btn.text().includes('重置'))).toHaveLength(0)
  })

  // 自定义表单属性测试
  it('应该支持自定义表单属性', () => {
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
        formProps: {
          inline: true,
          labelWidth: '100px',
        },
      },
    })

    const form = wrapper.findComponent(ElForm)
    expect(form.props('inline')).toBe(true)
    expect(form.props('labelWidth')).toBe('100px')
  })

  // 自定义操作插槽测试
  it('应该支持自定义操作插槽', async () => {
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
      },
      slots: {
        actions: '<button class="custom-action">自定义操作</button>',
      },
    })

    await nextTick()
    expect(wrapper.find('.custom-action').exists()).toBe(true)
  })

  // 表单重置测试
  it('应该正确重置表单', async () => {
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
        defaultValue: { name: '测试' },
      },
    })

    await nextTick()
    // 修改数据
    wrapper.vm.searchFormData = { name: '新值', status: 1 }
    await nextTick()

    // 重置表单
    wrapper.vm.onSearchReset()
    await nextTick()

    expect(wrapper.vm.searchFormData).toEqual({})
  })

  // ref 引用测试
  it('应该正确处理 form ref', () => {
    const formRef = ref()
    mount(SearchForm, {
      props: {
        fields: mockFields,
        form: formRef,
      },
    })

    expect(formRef.value).toBeDefined()
  })

  // 默认值更新测试
  it('应该响应默认值更新', async () => {
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
        defaultValue: { name: '初始值' },
      },
    })

    await nextTick()
    expect(wrapper.vm.searchFormData).toEqual({ name: '初始值' })

    // 更新默认值
    await wrapper.setProps({ defaultValue: { name: '新值', status: 1 } })
    await nextTick()

    expect(wrapper.vm.searchFormData).toEqual({ name: '新值', status: 1 })
  })

  // 字段过滤测试
  it('应该正确过滤 rules 和 required 属性', () => {
    const fieldsWithRules = [
      { prop: 'name', label: '名称', type: 'input', required: true, rules: [{ required: true, message: '必填' }] },
      { prop: 'email', label: '邮箱', type: 'input', rules: [{ type: 'email', message: '邮箱格式' }] },
    ]

    const wrapper = mount(SearchForm, {
      props: {
        fields: fieldsWithRules,
      },
    })

    // 传递给 ProFormFields 的字段不应包含 rules 和 required
    const formFields = wrapper.findComponent(ProFormFields)
    const fields = formFields.props('fields')
    fields.forEach((field: any) => {
      expect(field.rules).toBeUndefined()
      expect(field.required).toBeUndefined()
    })
  })

  // 隐藏标签测试
  it('应该支持隐藏标签', () => {
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
        showLabel: false,
      },
    })

    const formFields = wrapper.findComponent(ProFormFields)
    expect(formFields.props('showLabel')).toBe(false)
  })

  // expose 方法测试
  it('应该正确暴露方法', () => {
    const wrapper = mount(SearchForm, {
      props: {
        fields: mockFields,
      },
    })

    expect(wrapper.vm.searchFormData).toBeDefined()
    expect(wrapper.vm.onSearchReset).toBeDefined()
    expect(typeof wrapper.vm.onSearchReset).toBe('function')
  })
})

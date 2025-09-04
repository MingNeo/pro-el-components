const e=`/**
 * @vitest-environment jsdom
 */
import type { ProFormFieldsField } from '../types'
import { mount } from '@vue/test-utils'
import { ElCheckboxGroup, ElDatePicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect } from 'element-plus'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, markRaw, nextTick, ref } from 'vue'
import ProFormFields from '../index.vue'

describe('proFormFields组件', () => {
  let fields: ProFormFieldsField[]

  beforeEach(() => {
    // 在每个测试前重置测试数据
    fields = [
      {
        prop: 'username',
        label: '用户名',
        type: 'input',
        required: true,
      },
      {
        prop: 'gender',
        label: '性别',
        type: 'select',
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
        ],
      },
    ]
  })

  it('应该正确渲染表单项', () => {
    const wrapper = mount(ProFormFields, {
      props: {
        fields,
        modelValue: {},
      },
    })

    // 检查是否渲染了正确数量的表单项
    expect(wrapper.findAllComponents(ElInput)).toHaveLength(1)
    expect(wrapper.findAllComponents(ElSelect)).toHaveLength(1)
  })

  it('应该正确处理表单值的更新', async () => {
    const wrapper = mount(ProFormFields, {
      props: {
        fields,
        modelValue: {
          username: '',
        },
      },
    })

    // 模拟输入
    const input = wrapper.findComponent(ElInput)
    await input.setValue('测试用户')

    // 检查是否触发了更新事件
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual({
      username: '测试用户',
    })
  })

  it('应该正确处理viewMode模式', async () => {
    const wrapper = mount(ProFormFields, {
      props: {
        fields,
        modelValue: {
          username: '测试用户',
          gender: 'male',
        },
        viewMode: true,
      },
    })

    // 在viewMode下不应该渲染输入组件
    expect(wrapper.findComponent(ElInput).exists()).toBe(false)
    expect(wrapper.findComponent(ElSelect).exists()).toBe(false)

    await nextTick()
    // // 应该显示纯文本内容
    // expect(wrapper.text()).toContain('测试用户')
    // 应该显示格式化后的值
    const formItems = wrapper.findAll('.el-form-item__content')
    expect(formItems[0].text()).toBe('测试用户')
    expect(formItems[1].text()).toBe('男')
  })

  it('应该正确处理表单项的显示/隐藏逻辑', async () => {
    const dynamicFields: ProFormFieldsField[] = [
      {
        prop: 'type',
        label: '类型',
        type: 'select',
        options: [
          { label: '类型A', value: 'A' },
          { label: '类型B', value: 'B' },
        ],
      },
      {
        prop: 'extraField',
        label: '额外字段',
        type: 'input',
        show: values => values.type === 'A',
      },
    ]

    const wrapper = mount(ProFormFields, {
      props: {
        fields: dynamicFields,
        modelValue: {
          type: 'B',
        },
      },
    })

    // 初始状态下extraField应该是隐藏的
    expect(wrapper.findAllComponents(ElInput)).toHaveLength(0)

    // 更新type为A
    await wrapper.setProps({
      modelValue: {
        type: 'A',
      },
    })

    // extraField应该显示出来
    expect(wrapper.findAllComponents(ElInput)).toHaveLength(1)
  })

  it('应该正确处理日期类型的字段', async () => {
    const dateFields: ProFormFieldsField[] = [
      {
        prop: 'birthday',
        label: '生日',
        type: 'datePicker',
      },
    ]

    const wrapper = mount(ProFormFields, {
      props: {
        fields: dateFields,
        modelValue: {},
      },
    })

    expect(wrapper.findComponent(ElDatePicker).exists()).toBe(true)
  })

  it('应该正确处理数字输入类型', async () => {
    const numericFields: ProFormFieldsField[] = [
      {
        prop: 'age',
        label: '年龄',
        type: 'number',
        min: 0,
        max: 120,
      },
    ]

    const wrapper = mount(ProFormFields, {
      props: {
        fields: numericFields,
        modelValue: { age: 25 },
      },
    })

    const input = wrapper.findComponent(ElInputNumber)
    expect(input.exists()).toBe(true)
    await input.setValue(30)
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual({ age: 30 })
  })

  it('应该正确处理自定义验证规则', async () => {
    const fieldsWithValidation: ProFormFieldsField[] = [
      {
        prop: 'email',
        label: '邮箱',
        type: 'input',
        required: true,
        rules: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ],
      },
    ]

    const wrapper = mount(ProFormFields, {
      props: {
        fields: fieldsWithValidation,
        modelValue: {},
      },
    })

    const formItem = wrapper.findComponent(ElFormItem)
    expect(formItem.exists()).toBe(true)
    expect(formItem.vm.rules).toBeTruthy()
  })

  it('应该正确处理禁用状态', () => {
    const disabledFields: ProFormFieldsField[] = [
      {
        prop: 'username',
        label: '用户名',
        type: 'input',
        fieldProps: {
          disabled: true,
        },
      },
    ]

    const wrapper = mount(ProFormFields, {
      props: {
        fields: disabledFields,
        modelValue: { username: '测试用户' },
      },
    })

    const input = wrapper.findComponent(ElInput)
    expect(input.vm.disabled).toBe(true)
  })

  it('应该正确处理多选框组', async () => {
    const checkboxFields: ProFormFieldsField[] = [
      {
        prop: 'hobbies',
        label: '兴趣爱好',
        type: 'checkbox',
        options: [
          { label: '阅读', value: 'reading' },
          { label: '运动', value: 'sports' },
          { label: '音乐', value: 'music' },
        ],
      },
    ]

    const wrapper = mount(ProFormFields, {
      props: {
        fields: checkboxFields,
        modelValue: { hobbies: ['reading'] },
      },
    })

    const checkboxGroup = wrapper.findComponent(ElCheckboxGroup)
    expect(checkboxGroup.exists()).toBe(true)
  })

  // it('应该正确处理动态选项', async () => {
  //   const dynamicSelectField: ProFormFieldsField[] = [
  //     {
  //       prop: 'city',
  //       label: '城市',
  //       type: 'select',
  //       options: async () => {
  //         return [
  //           { label: '北京', value: 'beijing' },
  //           { label: '上海', value: 'shanghai' },
  //         ]
  //       },
  //     },
  //   ]

  //   const wrapper = mount(ProFormFields, {
  //     props: {
  //       fields: dynamicSelectField,
  //       modelValue: {},
  //     },
  //   })

  //   const select = wrapper.findComponent(ElSelect)
  //   expect(select.exists()).toBe(true)
  // })

  it('应该正确处理自定义Field', () => {
    const CustomComponent = markRaw({
      template: '<div class="custom-field">自定义内容</div>',
    })
    const wrapper = mount(ProFormFields, {
      props: {
        fields: [
          {
            prop: 'custom',
            label: '自定义字段',
            type: 'component',
            component: CustomComponent,
          },
        ],
        modelValue: {},
      },
    })

    expect(wrapper.find('.custom-field').exists()).toBe(true)
    expect(wrapper.find('.custom-field').text()).toBe('自定义内容')
  })

  // 表单验证测试
  it('应该正确处理表单验证', async () => {
    const TestComponent = defineComponent((props) => {
      const formRef = ref(null)

      return () => {
        // 渲染函数或 JSX
        return h(ElForm, { ref: formRef }, [
          h(ProFormFields, { fields: props.fields || [], modelValue: props.modelValue || {} }),
        ])
      }
    })

    const wrapper = mount(TestComponent, {
      props: {
        fields,
        modelValue: {},
      },
    })

    const formRef = wrapper.vm.formRef
    await nextTick()

    // 触发表单验证
    try {
      await formRef.validate()
      // 如果验证通过则测试失败,因为必填字段为空
      expect(true).toBe(false)
    }
    catch (errors) {
      // 验证应该失败,因为username是必填的
      expect(errors).toBeTruthy()
    }

    // 设置必填字段后重新验证
    await wrapper.setProps({
      modelValue: {
        username: '测试用户',
      },
    })

    // 现在验证应该通过
    await formRef.validate()
  })

  // 联动字段测试
  // it('应该正确处理字段联动', async () => {
  //   const dynamicFields = [...fields]
  //   dynamicFields.push({
  //     prop: 'city',
  //     label: '城市',
  //     type: 'select',
  //     options: [],
  //     visible: (formValues: any) => formValues.gender === 'male',
  //     watch: ['gender'],
  //   })

  //   const wrapper = mount(ProFormFields, {
  //     props: {
  //       fields: dynamicFields,
  //       modelValue: {
  //         gender: 'female',
  //       },
  //     },
  //   })

  //   // 初始时city字段应该不可见
  //   expect(wrapper.findAll('.el-form-item')).toHaveLength(4)

  //   // 改变性别为男性
  //   await wrapper.setProps({
  //     modelValue: {
  //       gender: 'male',
  //     },
  //   })

  //   await nextTick()
  //   // city字段应该变为可见
  //   expect(wrapper.findAll('.el-form-item')).toHaveLength(5)
  // })

  // 值格式化测试
  it('应该正确处理值格式化', async () => {
    const formatFields = [
      {
        prop: 'price',
        label: '价格',
        type: 'input',
        formatChangedValue: (value: string) => Number(value),
      },
    ]

    const wrapper = mount(ProFormFields, {
      props: {
        fields: formatFields,
        modelValue: { price: 100 },
      },
    })

    // 模拟输入
    const input = wrapper.findComponent(ElInput)
    await input.setValue('200')

    // 检查格式化后的值
    expect((wrapper.emitted('update:modelValue')![0] as any)?.[0].price).toBe(200)
  })

  // 栅格布局测试
  it('应该正确处理栅格布局', () => {
    const wrapper = mount(ProFormFields, {
      props: {
        fields,
        modelValue: {},
        column: 2,
      },
    })

    const formItems = wrapper.findAll('.el-col-12')
    expect(formItems.length).toBeGreaterThan(0)
  })
})
`;export{e as default};

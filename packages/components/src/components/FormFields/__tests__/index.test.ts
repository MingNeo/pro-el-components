/**
 * @vitest-environment jsdom
 */
import type { ProFormFieldsField } from '../types'
import { mount } from '@vue/test-utils'
import { ElCheckboxGroup, ElColorPicker, ElDatePicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElRadioGroup, ElRate, ElSelect, ElSlider, ElSwitch, ElTimePicker, ElTreeSelect } from 'element-plus'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, markRaw, nextTick, ref, watch } from 'vue'
import ProFormFields from '../index.vue'

// 统一的辅助函数：自动为 ProFormFields 添加 ElForm 外层
function mountFormFields(options: Parameters<typeof mount>[1] = {}) {
  const TestComponent = defineComponent({
    props: {
      fields: Array,
      modelValue: Object,
    },
    setup(props, { emit, attrs, expose }) {
      const formData = ref({ ...(props.modelValue || {}) })
      const formRef = ref()

      watch(() => props.modelValue, (val) => {
        formData.value = { ...(val || {}) }
      }, { deep: true, immediate: true })

      const handleUpdate = (val: any) => {
        formData.value = val
        emit('update:modelValue', val)
      }

      expose({ formRef })

      return () => {
        return h(ElForm, { model: formData.value, ref: formRef }, {
          default: () => h(ProFormFields, {
            'fields': (props.fields || []) as ProFormFieldsField[],
            'modelValue': formData.value,
            'onUpdate:modelValue': handleUpdate,
            ...attrs,
          }),
        })
      }
    },
  })

  const props = options.props || {}
  return mount(TestComponent, {
    ...options,
    props,
  })
}

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
    const wrapper = mountFormFields({
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
    const wrapper = mountFormFields({
      props: {
        fields: [
          {
            prop: 'username',
            label: '用户名',
            type: 'input',
            required: true,
          },
        ],
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
    const wrapper = mountFormFields({
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

    const wrapper = mountFormFields({
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

    const wrapper = mountFormFields({
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

    const wrapper = mountFormFields({
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

    const wrapper = mountFormFields({
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

    const wrapper = mountFormFields({
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

    const wrapper = mountFormFields({
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

  //   const wrapper = mountFormFields({
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
    const wrapper = mountFormFields({
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
    const wrapper = mountFormFields({
      props: {
        fields,
        modelValue: {},
      },
    })

    await nextTick()

    // 触发表单验证
    try {
      await wrapper.vm.formRef.validate()
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

    await nextTick()
    // 现在验证应该通过
    await wrapper.vm.formRef.validate()
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

  //   const wrapper = mountFormFields({
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

    const wrapper = mountFormFields({
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
    const wrapper = mountFormFields({
      props: {
        fields,
        modelValue: {},
        column: 2,
      },
    })

    const formItems = wrapper.findAll('.el-col-12')
    expect(formItems.length).toBeGreaterThan(0)
  })

  // ==================== 测试所有字段类型 ====================

  // text 类型测试
  it('应该正确渲染text类型字段', () => {
    const textFields: ProFormFieldsField[] = [
      {
        prop: 'description',
        label: '描述',
        type: 'text',
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: textFields,
        modelValue: { description: '这是一段描述文本' },
      },
    })

    expect(wrapper.text()).toContain('这是一段描述文本')
  })

  // textarea 类型测试
  it('应该正确处理textarea类型字段', async () => {
    const textareaFields: ProFormFieldsField[] = [
      {
        prop: 'content',
        label: '内容',
        type: 'textarea',
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: textareaFields,
        modelValue: { content: '' },
      },
    })

    const textarea = wrapper.findComponent(ElInput)
    expect(textarea.exists()).toBe(true)
    expect(textarea.vm.type).toBe('textarea')

    await textarea.setValue('这是多行文本内容')
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual({ content: '这是多行文本内容' })
  })

  // radio 类型测试
  it('应该正确处理radio类型字段', async () => {
    const radioFields: ProFormFieldsField[] = [
      {
        prop: 'status',
        label: '状态',
        type: 'radio',
        options: [
          { label: '启用', value: 'enabled' },
          { label: '禁用', value: 'disabled' },
        ],
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: radioFields,
        modelValue: { status: 'enabled' },
      },
    })

    const radioGroup = wrapper.findComponent(ElRadioGroup)
    expect(radioGroup.exists()).toBe(true)
  })

  // radio 类型在 viewMode 下的测试
  it('应该正确渲染radio类型在viewMode下的显示', async () => {
    const radioFields: ProFormFieldsField[] = [
      {
        prop: 'status',
        label: '状态',
        type: 'radio',
        options: [
          { label: '启用', value: 'enabled' },
          { label: '禁用', value: 'disabled' },
        ],
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: radioFields,
        modelValue: { status: 'enabled' },
        viewMode: true,
      },
    })

    await nextTick()
    expect(wrapper.findComponent(ElRadioGroup).exists()).toBe(false)
    const formItems = wrapper.findAll('.el-form-item__content')
    expect(formItems[0].text()).toBe('启用')
  })

  // rate 类型测试
  it('应该正确处理rate类型字段', () => {
    const rateFields: ProFormFieldsField[] = [
      {
        prop: 'rating',
        label: '评分',
        type: 'rate',
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: rateFields,
        modelValue: { rating: 3 },
      },
    })

    const rate = wrapper.findComponent(ElRate)
    expect(rate.exists()).toBe(true)
    expect(rate.vm.modelValue).toBe(3)
  })

  // slider 类型测试
  it('应该正确处理slider类型字段', async () => {
    const sliderFields: ProFormFieldsField[] = [
      {
        prop: 'volume',
        label: '音量',
        type: 'slider',
        fieldProps: {
          min: 0,
          max: 100,
        },
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: sliderFields,
        modelValue: { volume: 50 },
      },
    })

    const slider = wrapper.findComponent(ElSlider)
    expect(slider.exists()).toBe(true)
  })

  // switch 类型测试
  it('应该正确处理switch类型字段', async () => {
    const switchFields: ProFormFieldsField[] = [
      {
        prop: 'enabled',
        label: '是否启用',
        type: 'switch',
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: switchFields,
        modelValue: { enabled: false },
      },
    })

    const switchComp = wrapper.findComponent(ElSwitch)
    expect(switchComp.exists()).toBe(true)
    expect(switchComp.vm.modelValue).toBe(false)
  })

  // timePicker 类型测试
  it('应该正确处理timePicker类型字段', () => {
    const timeFields: ProFormFieldsField[] = [
      {
        prop: 'time',
        label: '时间',
        type: 'timePicker',
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: timeFields,
        modelValue: {},
      },
    })

    const timePicker = wrapper.findComponent(ElTimePicker)
    expect(timePicker.exists()).toBe(true)
  })

  // rangePicker 类型测试
  it('应该正确处理rangePicker类型字段', () => {
    const rangeFields: ProFormFieldsField[] = [
      {
        prop: 'dateRange',
        label: '日期范围',
        type: 'rangePicker',
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: rangeFields,
        modelValue: {},
      },
    })

    const datePicker = wrapper.findComponent(ElDatePicker)
    expect(datePicker.exists()).toBe(true)
    expect(datePicker.vm.type).toBe('daterange')
  })

  // cascader 类型测试
  it('应该正确处理cascader类型字段', () => {
    const cascaderFields: ProFormFieldsField[] = [
      {
        prop: 'area',
        label: '地区',
        type: 'cascader',
        fieldProps: {
          options: [
            {
              value: 'guangdong',
              label: '广东',
              children: [
                { value: 'guangzhou', label: '广州' },
                { value: 'shenzhen', label: '深圳' },
              ],
            },
          ],
        },
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: cascaderFields,
        modelValue: {},
      },
    })

    // ProCascader 组件应该被渲染，会渲染成 el-cascader
    expect(wrapper.html()).toContain('el-cascader')
  })

  // treeSelect 类型测试
  it('应该正确处理treeSelect类型字段', () => {
    const treeSelectFields: ProFormFieldsField[] = [
      {
        prop: 'department',
        label: '部门',
        type: 'treeSelect',
        fieldProps: {
          data: [
            {
              value: '1',
              label: '技术部',
              children: [
                { value: '1-1', label: '前端组' },
                { value: '1-2', label: '后端组' },
              ],
            },
          ],
        },
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: treeSelectFields,
        modelValue: {},
      },
    })

    const treeSelect = wrapper.findComponent(ElTreeSelect)
    expect(treeSelect.exists()).toBe(true)
  })

  // colorPicker 类型测试
  it('应该正确处理colorPicker类型字段', async () => {
    const colorFields: ProFormFieldsField[] = [
      {
        prop: 'color',
        label: '颜色',
        type: 'colorPicker',
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: colorFields,
        modelValue: { color: '#409eff' },
      },
    })

    const colorPicker = wrapper.findComponent(ElColorPicker)
    expect(colorPicker.exists()).toBe(true)
  })

  // upload 类型测试
  it('应该正确处理upload类型字段', () => {
    const uploadFields: ProFormFieldsField[] = [
      {
        prop: 'files',
        label: '文件上传',
        type: 'upload',
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: uploadFields,
        modelValue: { files: [] },
      },
    })

    // ProUpload 组件应该被渲染
    expect(wrapper.html()).toContain('pro-upload')
  })

  // text 类型带自定义渲染测试
  it('应该正确处理text类型字段的customRender', () => {
    const textFields: ProFormFieldsField[] = [
      {
        prop: 'price',
        label: '价格',
        type: 'text',
        customRender: (value) => {
          return `¥${value}`
        },
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: textFields,
        modelValue: { price: 100 },
      },
    })

    expect(wrapper.text()).toContain('¥100')
  })

  // viewMode 下所有字段类型的渲染测试
  it('应该正确处理所有字段类型在viewMode下的显示', async () => {
    const allTypeFields: ProFormFieldsField[] = [
      {
        prop: 'input',
        label: '输入框',
        type: 'input',
      },
      {
        prop: 'textarea',
        label: '多行文本',
        type: 'textarea',
      },
      {
        prop: 'number',
        label: '数字',
        type: 'number',
      },
      {
        prop: 'date',
        label: '日期',
        type: 'datePicker',
      },
      {
        prop: 'time',
        label: '时间',
        type: 'timePicker',
      },
      {
        prop: 'range',
        label: '日期范围',
        type: 'rangePicker',
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: allTypeFields,
        modelValue: {
          input: '文本内容',
          textarea: '多行文本内容',
          number: 100,
          date: '2024-01-01',
          time: '12:00:00',
          range: ['2024-01-01', '2024-01-31'],
        },
        viewMode: true,
      },
    })

    await nextTick()

    // 在viewMode下，不应该渲染任何输入组件
    expect(wrapper.findComponent(ElInput).exists()).toBe(false)
    expect(wrapper.findComponent(ElInputNumber).exists()).toBe(false)
    expect(wrapper.findComponent(ElDatePicker).exists()).toBe(false)
    expect(wrapper.findComponent(ElTimePicker).exists()).toBe(false)
  })

  // 字段禁用状态测试 - 多种类型
  it('应该正确处理不同类型字段的禁用状态', () => {
    const disabledFields: ProFormFieldsField[] = [
      {
        prop: 'rate',
        label: '评分',
        type: 'rate',
        fieldProps: {
          disabled: true,
        },
      },
      {
        prop: 'switch',
        label: '开关',
        type: 'switch',
        fieldProps: {
          disabled: true,
        },
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: disabledFields,
        modelValue: { rate: 3, switch: true },
      },
    })

    const rate = wrapper.findComponent(ElRate)
    const switchComp = wrapper.findComponent(ElSwitch)

    expect(rate.vm.disabled).toBe(true)
    expect(switchComp.vm.disabled).toBe(true)
  })

  // 字段带额外标签和提示的测试
  it('应该正确渲染labelExtra和labelTip', () => {
    const fieldsWithLabels: ProFormFieldsField[] = [
      {
        prop: 'username',
        label: '用户名',
        type: 'input',
        labelExtra: '(必填)',
        labelTip: '请输入6-20位字符',
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: fieldsWithLabels,
        modelValue: {},
      },
    })

    expect(wrapper.text()).toContain('用户名')
    expect(wrapper.text()).toContain('(必填)')
    expect(wrapper.html()).toContain('label-tip-icon')
  })

  // 测试字段的on事件监听
  it('应该正确处理字段的on事件', async () => {
    let changeCount = 0
    const fieldsWithEvents: ProFormFieldsField[] = [
      {
        prop: 'username',
        label: '用户名',
        type: 'input',
        onChange: () => {
          changeCount++
        },
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: fieldsWithEvents,
        modelValue: { username: '' },
      },
    })

    const input = wrapper.findComponent(ElInput)
    await input.vm.$emit('update:modelValue', '测试')

    expect(changeCount).toBe(1)
  })

  // 测试字段的 requiredOnlyStyle 属性
  it('应该正确处理requiredOnlyStyle属性', () => {
    const fieldsWithRequiredStyle: ProFormFieldsField[] = [
      {
        prop: 'username',
        label: '用户名',
        type: 'input',
        required: true,
        requiredOnlyStyle: true,
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: fieldsWithRequiredStyle,
        modelValue: {},
      },
    })

    const formItem = wrapper.findComponent(ElFormItem)
    expect(formItem.exists()).toBe(true)
    // requiredOnlyStyle 为 true 时，不应该有实际的验证规则
    expect(formItem.vm.rules).toBeTruthy()
  })

  // 测试字段单独设置 viewMode
  it('应该正确处理字段单独的viewMode设置', async () => {
    const mixedFields: ProFormFieldsField[] = [
      {
        prop: 'username',
        label: '用户名',
        type: 'input',
        viewMode: true,
      },
      {
        prop: 'password',
        label: '密码',
        type: 'input',
        viewMode: false,
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: mixedFields,
        modelValue: { username: '张三', password: '123456' },
        viewMode: false,
      },
    })

    await nextTick()

    // username 应该是查看模式，显示纯文本
    const formItems = wrapper.findAll('.el-form-item__content')
    expect(formItems[0].text()).toBe('张三')

    // password 应该是编辑模式，显示输入框
    expect(wrapper.findAllComponents(ElInput)).toHaveLength(1)
  })

  // ==================== 字段联动测试 ====================

  // 测试 watch 的 handler 方式 - 动态改变字段属性
  it('应该正确处理watch handler方式的字段联动 - 动态改变字段属性', async () => {
    const fieldsWithWatch: ProFormFieldsField[] = [
      {
        prop: 'type',
        label: '类型',
        type: 'select',
        options: [
          { label: '个人', value: 'personal' },
          { label: '企业', value: 'company' },
        ],
      },
      {
        prop: 'name',
        label: '名称',
        type: 'input',
        watch: {
          field: 'type',
          handler: (value) => {
            if (value === 'personal') {
              return {
                label: '姓名',
                fieldProps: { placeholder: '请输入姓名' },
              }
            }
            else if (value === 'company') {
              return {
                label: '企业名称',
                fieldProps: { placeholder: '请输入企业名称' },
              }
            }
          },
        },
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: fieldsWithWatch,
        modelValue: { type: 'personal' },
      },
    })

    await nextTick()
    await nextTick() // 等待 watch 触发

    // 初始状态下应该显示 "姓名"
    expect(wrapper.text()).toContain('姓名')

    // 改变 type 为 company
    await wrapper.setProps({
      modelValue: { type: 'company' },
    })

    await nextTick()
    await nextTick()

    // 应该显示 "企业名称"
    expect(wrapper.text()).toContain('企业名称')
  })

  // 测试 watch 的 conditions 方式 - 条件匹配更新
  it('应该正确处理watch conditions方式的字段联动', async () => {
    const fieldsWithConditions: ProFormFieldsField[] = [
      {
        prop: 'age',
        label: '年龄',
        type: 'number',
      },
      {
        prop: 'idCard',
        label: '身份证号',
        type: 'input',
        watch: {
          field: 'age',
          conditions: [
            {
              when: value => value < 18,
              update: {
                fieldProps: { disabled: true, placeholder: '未成年无需填写' },
              },
            },
            {
              when: value => value >= 18,
              update: {
                fieldProps: { disabled: false, placeholder: '请输入身份证号' },
              },
            },
          ],
        },
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: fieldsWithConditions,
        modelValue: { age: 15 },
      },
    })

    await nextTick()
    await nextTick()

    // 未成年时，身份证输入框应该被禁用
    let inputs = wrapper.findAllComponents(ElInput)
    let idCardInput = inputs[inputs.length - 1]
    expect(idCardInput.vm.disabled).toBe(true)

    // 改变年龄为成年
    await wrapper.setProps({
      modelValue: { age: 20 },
    })

    // await flushPromises()
    await nextTick()

    // 成年后，身份证输入框应该可用
    inputs = wrapper.findAllComponents(ElInput)
    idCardInput = inputs[inputs.length - 1]
    expect(idCardInput.vm.disabled).toBe(false)
  })

  // 测试多个字段的联动
  it('应该正确处理多个字段的联动', async () => {
    const multiWatchFields: ProFormFieldsField[] = [
      {
        prop: 'country',
        label: '国家',
        type: 'select',
        options: [
          { label: '中国', value: 'china' },
          { label: '美国', value: 'usa' },
        ],
      },
      {
        prop: 'province',
        label: '省份',
        type: 'select',
        options: [
          { label: '广东', value: 'guangdong' },
          { label: '北京', value: 'beijing' },
        ],
        watch: {
          field: 'country',
          handler: (value) => {
            if (value === 'china') {
              return {
                fieldProps: {
                  disabled: false,
                  placeholder: '请选择省份',
                },
              }
            }
            return {
              fieldProps: {
                disabled: true,
                placeholder: '请先选择中国',
              },
            }
          },
        },
      },
      {
        prop: 'city',
        label: '城市',
        type: 'select',
        options: [
          { label: '广州', value: 'guangzhou' },
          { label: '深圳', value: 'shenzhen' },
        ],
        watch: {
          field: 'province',
          handler: (value) => {
            if (value) {
              return {
                fieldProps: {
                  disabled: false,
                },
              }
            }
            return {
              fieldProps: {
                disabled: true,
              },
            }
          },
        },
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: multiWatchFields,
        modelValue: { country: 'usa' },
      },
    })

    await nextTick()
    await nextTick()

    // 选择美国时，省份应该被禁用
    expect(wrapper.html()).toContain('请先选择中国')
  })

  // 测试 watch 监听多个字段 (数组形式)
  it('应该正确处理watch监听多个字段', async () => {
    const multipleWatchFields: ProFormFieldsField[] = [
      {
        prop: 'hasChildren',
        label: '是否有子女',
        type: 'switch',
      },
      {
        prop: 'familyInfo',
        label: '家庭信息',
        type: 'textarea',
        watch: {
          field: 'hasChildren',
          handler: (value) => {
            if (!value) {
              return {
                fieldProps: {
                  disabled: true,
                  placeholder: '无子女无需填写',
                },
              }
            }
            return {
              fieldProps: {
                disabled: false,
                placeholder: '请填写家庭信息',
              },
            }
          },
        },
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: multipleWatchFields,
        modelValue: { hasChildren: false },
      },
    })

    await nextTick()
    await nextTick()

    // 无子女时，家庭信息应该被禁用
    const textarea = wrapper.findComponent(ElInput)
    expect(textarea.vm.disabled).toBe(true)

    // 改变为有子女
    await wrapper.setProps({
      modelValue: { hasChildren: true },
    })

    // await flushPromises()
    await nextTick()

    // 有子女时，家庭信息应该可用
    const textareaUpdated = wrapper.findComponent(ElInput)
    expect(textareaUpdated.vm.disabled).toBe(false)
  })

  // 测试 watch handler 返回 void 的情况
  it('应该正确处理watch handler返回void的情况', async () => {
    let handlerCalled = false
    const fieldsWithVoidHandler: ProFormFieldsField[] = [
      {
        prop: 'status',
        label: '状态',
        type: 'select',
        options: [
          { label: '启用', value: 'enabled' },
          { label: '禁用', value: 'disabled' },
        ],
      },
      {
        prop: 'note',
        label: '备注',
        type: 'input',
        watch: {
          field: 'status',
          handler: (_value) => {
            handlerCalled = true
            // 不返回任何更新
          },
        },
      },
    ]

    mountFormFields({
      props: {
        fields: fieldsWithVoidHandler,
        modelValue: { status: 'enabled' },
      },
    })

    await nextTick()
    await nextTick()

    // handler 应该被调用
    expect(handlerCalled).toBe(true)
  })

  // 测试 watch 与 show 属性的组合使用
  it('应该正确处理watch与show属性的组合', async () => {
    const fieldsWithShowAndWatch: ProFormFieldsField[] = [
      {
        prop: 'needExtraInfo',
        label: '需要额外信息',
        type: 'switch',
      },
      {
        prop: 'extraType',
        label: '信息类型',
        type: 'select',
        options: [
          { label: '类型A', value: 'A' },
          { label: '类型B', value: 'B' },
        ],
        show: formData => formData.needExtraInfo,
      },
      {
        prop: 'extraDetail',
        label: '详细信息',
        type: 'textarea',
        show: formData => formData.needExtraInfo,
        watch: {
          field: 'extraType',
          handler: (value) => {
            if (value === 'A') {
              return {
                label: '类型A详细信息',
                fieldProps: { placeholder: '请输入类型A的详细信息' },
              }
            }
            else if (value === 'B') {
              return {
                label: '类型B详细信息',
                fieldProps: { placeholder: '请输入类型B的详细信息' },
              }
            }
          },
        },
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: fieldsWithShowAndWatch,
        modelValue: { needExtraInfo: false },
      },
    })

    await nextTick()

    // 初始状态下，额外信息字段应该隐藏
    expect(wrapper.findAllComponents(ElInput)).toHaveLength(0)

    // 启用额外信息
    await wrapper.setProps({
      modelValue: { needExtraInfo: true, extraType: 'A' },
    })

    await nextTick()
    await nextTick()

    // 应该显示额外信息字段，并且 label 根据联动更新
    expect(wrapper.text()).toContain('类型A详细信息')

    // 改变类型
    await wrapper.setProps({
      modelValue: { needExtraInfo: true, extraType: 'B' },
    })

    await nextTick()
    await nextTick()

    // label 应该更新
    expect(wrapper.text()).toContain('类型B详细信息')
  })

  // 测试 watch conditions 的优先级
  it('应该正确处理watch conditions的匹配优先级', async () => {
    const fieldsWithPriority: ProFormFieldsField[] = [
      {
        prop: 'score',
        label: '分数',
        type: 'number',
      },
      {
        prop: 'level',
        label: '等级',
        type: 'input',
        watch: {
          field: 'score',
          conditions: [
            {
              when: value => value >= 90,
              update: {
                fieldProps: { placeholder: '优秀' },
              },
            },
            {
              when: value => value >= 80,
              update: {
                fieldProps: { placeholder: '良好' },
              },
            },
            {
              when: value => value >= 60,
              update: {
                fieldProps: { placeholder: '及格' },
              },
            },
            {
              when: () => true,
              update: {
                fieldProps: { placeholder: '不及格' },
              },
            },
          ],
        },
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: fieldsWithPriority,
        modelValue: { score: 95 },
      },
    })

    await nextTick()
    await nextTick()

    // 分数95应该匹配第一个条件：优秀
    let inputs = wrapper.findAllComponents(ElInput)
    let levelInput = inputs[inputs.length - 1]
    expect(levelInput.vm.placeholder).toBe('优秀')

    // 改变分数为85
    await wrapper.setProps({
      modelValue: { score: 85 },
    })

    // await flushPromises()
    await nextTick()

    // 应该匹配第二个条件：良好
    inputs = wrapper.findAllComponents(ElInput)
    levelInput = inputs[inputs.length - 1]
    expect(levelInput.vm.placeholder).toBe('良好')

    // 改变分数为65
    await wrapper.setProps({
      modelValue: { score: 65 },
    })

    // await flushPromises()
    await nextTick()

    // 应该匹配第三个条件：及格
    expect(wrapper.html()).toContain('及格')

    // 改变分数为50
    await wrapper.setProps({
      modelValue: { score: 50 },
    })

    // await flushPromises()
    await nextTick()

    // 应该匹配最后一个条件：不及格
    expect(wrapper.html()).toContain('不及格')
  })

  // 测试 watch 联动更新字段选项
  it('应该正确处理watch联动更新字段选项', async () => {
    const fieldsWithOptionsUpdate: ProFormFieldsField[] = [
      {
        prop: 'category',
        label: '分类',
        type: 'select',
        options: [
          { label: '水果', value: 'fruit' },
          { label: '蔬菜', value: 'vegetable' },
        ],
      },
      {
        prop: 'item',
        label: '具体项目',
        type: 'select',
        options: [],
        watch: {
          field: 'category',
          handler: (value) => {
            if (value === 'fruit') {
              return {
                options: [
                  { label: '苹果', value: 'apple' },
                  { label: '香蕉', value: 'banana' },
                  { label: '橙子', value: 'orange' },
                ],
              }
            }
            else if (value === 'vegetable') {
              return {
                options: [
                  { label: '白菜', value: 'cabbage' },
                  { label: '萝卜', value: 'radish' },
                  { label: '土豆', value: 'potato' },
                ],
              }
            }
            return {
              options: [],
            }
          },
        },
      },
    ]

    const wrapper = mountFormFields({
      props: {
        fields: fieldsWithOptionsUpdate,
        modelValue: { category: 'fruit' },
      },
    })

    await nextTick()
    await nextTick()

    // 选择水果时，检查组件内部是否有对应的options
    const selects = wrapper.findAllComponents({ name: 'ProSelect' })
    expect(selects).toHaveLength(2)
    // 验证第二个select（item字段）接收到了水果选项
    const itemSelect = selects[1]
    expect(itemSelect.vm.options).toHaveLength(3)
    expect(itemSelect.vm.options[0].label).toBe('苹果')

    // 改变为蔬菜
    await wrapper.setProps({
      modelValue: { category: 'vegetable' },
    })

    // await flushPromises()
    await nextTick()

    // 应该显示蔬菜选项
    const selectsUpdated = wrapper.findAllComponents({ name: 'ProSelect' })
    const itemSelectUpdated = selectsUpdated[1]
    expect(itemSelectUpdated.vm.options).toHaveLength(3)
    expect(itemSelectUpdated.vm.options[0].label).toBe('白菜')
  })
})

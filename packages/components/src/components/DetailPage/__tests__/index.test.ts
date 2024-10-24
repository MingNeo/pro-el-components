/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { ElCol } from 'element-plus'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import DetailPage from '../index.vue'

describe('pageDetail 组件', () => {
  // 基础配置
  const baseFields = [
    { label: '姓名', prop: 'name' },
    { label: '年龄', prop: 'age' },
    { label: '性别', prop: 'gender' },
  ]

  const baseData = {
    name: '张三',
    age: 25,
    gender: '男',
  }

  // 基础渲染测试
  it('应该正确渲染详情内容', async () => {
    const wrapper = mount(DetailPage, {
      props: {
        fields: baseFields,
        defaultValue: baseData,
      },
    })

    await nextTick()
    // 检查标题和字段渲染
    const items = wrapper.findAll('.el-form-item')
    expect(items).toHaveLength(3)
    expect(items[0].find('.el-form-item__label').text()).toBe('姓名')
    expect(items[0].find('.el-input input').exists()).toBe(true)
    expect((items[0].find('.el-input input').element as any).value).toBe('张三')
  })

  // 加载状态测试
  it('应该正确显示加载状态', async () => {
    const wrapper = mount(DetailPage, {
      props: {
        fields: baseFields,
        loading: true,
      },
    })

    await nextTick()

    expect((wrapper.find('.el-loading-mask').element as any).style.display).toBe('none')
    await nextTick()
    expect((wrapper.find('.el-loading-mask').element as any).style.display).toBe('')
  })

  // 分组显示测试
  it('应该正确处理分组显示', async () => {
    const groupedFields = [
      {
        title: '基本信息',
        fields: [
          { label: '姓名', prop: 'name' },
          { label: '年龄', prop: 'age' },
        ],
      },
      {
        title: '联系方式',
        fields: [
          { label: '电话', prop: 'phone' },
          { label: '邮箱', prop: 'email' },
        ],
      },
    ]

    const groupedData = {
      name: '张三',
      age: 25,
      phone: '13800138000',
      email: 'test@example.com',
    }

    const wrapper = mount(DetailPage, {
      props: {
        extraFields: groupedFields,
        defaultValue: groupedData,
      },
    })

    await nextTick()
    await nextTick()
    // 检查分组标题
    const titles = wrapper.findAll('.pro-section-header')
    expect(titles).toHaveLength(2)
    expect(titles[0].text()).toBe('基本信息')
    expect(titles[1].text()).toBe('联系方式')
  })

  // 列配置测试
  it('应该正确处理列配置', async () => {
    const wrapper = mount(DetailPage, {
      props: {
        fields: baseFields,
        defaultValue: baseData,
        column: 2,
      },
    })

    await nextTick()
    const descriptions = wrapper.findComponent(ElCol)
    expect(descriptions.props('span')).toBe(12)
  })

  // 联动显示测试
  it('应该正确联动显示', async () => {
    const conditionalFields = [
      {
        label: '姓名',
        prop: 'name',
      },
      {
        label: 'VIP信息',
        prop: 'vipInfo',
        show: (values: any) => values.isVip,
      },
    ]

    const wrapper = mount(DetailPage, {
      props: {
        fields: conditionalFields,
        defaultValue: {
          name: '张三',
          isVip: false,
          vipInfo: 'VIP会员',
        },
      },
    })

    await nextTick()
    // 非VIP时不应显示VIP信息
    expect(wrapper.findAll('.el-form-item')).toHaveLength(1)

    // 切换为VIP
    await wrapper.setProps({
      defaultValue: {
        name: '张三',
        isVip: true,
        vipInfo: 'VIP会员',
      },
    })

    await nextTick()
    // VIP时应显示VIP信息
    expect(wrapper.findAll('.el-form-item')).toHaveLength(2)
  })

  // 插槽测试
  it('应该支持自定义插槽', () => {
    const wrapper = mount(DetailPage, {
      props: {
        fields: baseFields,
        defaultValue: baseData,
      },
      slots: {
        header: '<div class="custom-header">自定义头部</div>',
        footer: '<div class="custom-footer">自定义底部</div>',
      },
    })

    expect(wrapper.find('.custom-header').exists()).toBe(true)
    expect(wrapper.find('.custom-footer').exists()).toBe(true)
  })

  // 值格式化测试
  it('应该正确处理预览模式值格式化', async () => {
    const formatFields = [
      {
        label: '创建时间',
        prop: 'createTime',
        format: 'YYYY-MM-DD',
      },
      {
        label: '金额',
        prop: 'amount',
        customRender: (value: number) => `￥${value.toFixed(2)}`,
      },
    ]

    const formatData = {
      createTime: '2024-03-15',
      amount: 1234.5,
    }

    const wrapper = mount(DetailPage, {
      props: {
        fields: formatFields,
        defaultValue: formatData,
        viewMode: true,
      },
    })

    await nextTick()
    const contents = wrapper.findAll('.el-form-item__content')
    expect(contents[0].text()).toBe('2024-03-15')
    expect(contents[1].text()).toBe('￥1234.50')
  })
})

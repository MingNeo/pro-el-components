import index from './index.vue'

export default {
  component: index,
}

export const indexStory = {
  args: {
    columns: [
      {
        title: '姓名',
        key: 'name',
      },
      {
        title: '电话',
        key: 'phone',
      },
      {
        title: '地址',
        key: 'address',
      },
      {
        title: '状态',
        key: 'status',
        mapping: [
          {
            label: '启用',
            value: 'enabled',
          },
          {
            label: '禁用',
            value: 'disabled',
          },
        ],
      },
      {
        title: '操作',
        key: 'actions',
        dataIndex: 'actions',
        width: 150,
        actions: [
          {
            text: '详情',
            onClick: () => {},
          },
          {
            text: '编辑',
            onClick: () => {},
          },
          {
            text: '删除',
            danger: true,
            onClick: (_record) => {},
            confirm: true,
            confirmText: '请确认是否删除？',
          },
        ],
      },
    ],
    data: [
      {
        name: '小明',
        phone: '13222222222',
        address: '北京市朝阳区',
        status: 'enabled',
      },
      {
        name: '小红',
        phone: '13222222222',
        address: '北京市朝阳区',
        status: 'disabled',
      },
    ],
  },
}

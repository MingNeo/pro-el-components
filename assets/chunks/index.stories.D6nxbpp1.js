const n=`import index from './index.vue'

export default {
  component: index,
}

export const indexStory = {
  args: {
    columns: [
      {
        label: '姓名',
        prop: 'name',
      },
      {
        label: '电话',
        prop: 'phone',
      },
      {
        label: '地址',
        prop: 'address',
      },
      {
        label: '状态',
        prop: 'status',
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
        label: '操作',
        prop: 'actions',
        columnType: 'actions',
        width: 150,
        actions: [
          {
            text: '详情',
            onClick: () => { },
          },
          {
            text: '编辑',
            onClick: () => { },
          },
          {
            text: '删除',
            danger: true,
            onClick: (_record: any) => { },
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
`;export{n as default};

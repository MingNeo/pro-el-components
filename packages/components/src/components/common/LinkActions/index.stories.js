import index from './index.vue'

export default {
  component: index,
}

export const indexStory = {
  args: {
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
        // permission: 'demoList:del',
      },
    ],
  },
}

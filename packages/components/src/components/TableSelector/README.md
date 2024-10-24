# TableSelector
表格选择器，可传入列表数据接口和查询条件进行筛选然后跨页选择，支持多选和单选，支持禁用某一行，支持本地数据分页。

如需弹窗中显示可直接使用ModalSelector。

<demo src="./demos/demo1.vue" />
## 使用方法
以下是一个单独使用的例子：
```html
<template>
  <TableSelector
    v-model="selectedUsers" :search-fields="searchFields" :service="getUserList" :columns="columns"
    row-key="userId"
    :set-row-disabled="setRowDisabled"
  />
</template>

<script>
import { getUserList } from '@/api/user'

const selectedUsers = ref([])

const searchFields = [
  {
    label: '姓名',
    prop: 'username',
    type: 'input',
  },
  {
    label: '手机号',
    prop: 'phoneNumber',
    type: 'input',
    fieldProps: {
      placeholder: '请输入手机号',
    },
  },
  {
    label: '性别',
    prop: 'gender',
    type: 'select',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
  {
    label: '状态',
    prop: 'status',
    type: 'radio',
    options: [
      { label: '已激活', value: 'active' },
      { label: '未激活', value: 'inactive' },
    ],
    fieldProps: {
      disabled: true,
    },
  },
]

const columns = [
  {
    label: 'id',
    prop: 'userId',
  },
  {
    label: '用户名',
    prop: 'username',
  },
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '手机号',
    prop: 'phoneNumber',
  },
  {
    label: '性别',
    key: 'gender',
  },
]

const setRowDisabled = (record: any) => record.userId === 1
</script>
```

### 参数列表
| 参数名         | 类型                                         | 描述                                                                        | 是否必填 | 默认值     |
| -------------- | -------------------------------------------- | --------------------------------------------------------------------------- | -------- | ---------- |
| searchFields   | SearchField[]                                | 搜索表单配置                                                                | 否       | -          |
| service        | UseTableListService                          | 列表数据接口                                                                | 是       | -          |
| data           | Record<string, any>[]                        | 列表数据，如果存在 service 则忽略 data，不存在 service 时 data 进行本地分页 | 否       | -          |
| columns        | ColumnsType                                  | Table组件columns属性                                                        | 是       | -          |
| type           | 'checkbox' \| 'radio'                        | 单选或多选                                                                  | 否       | 'checkbox' |
| modelValue     | Record<string, any> \| Record<string, any>[] | 已选中的值                                                                  | 否       | -          |

### Events

| 事件名称          | 回调参数                                     | 描述                         |
| ----------------- | -------------------------------------------- | ---------------------------- |
| update:modelValue | Record<string, any> \| Record<string, any>[] | 更改v-model绑定的值          |
| change            | Record<string, any> \| Record<string, any>[] | 触发change事件，返回选中数据 |

# TableSelector
表格选择器，可传入列表数据接口和查询条件进行筛选然后跨页选择，支持多选和单选，支持禁用某一行，支持本地数据分页。

如需弹窗中显示可直接使用ModalSelector。

<script setup>
  import demo1 from 'components/common/TableSelector/demos/demo1.vue'
  import demo1Code from 'components/common/TableSelector/demos/demo1.vue?raw'
</script>
<demo :comp="demo1" :code="demo1Code" />
### 使用方法
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
    name: 'username',
    type: 'input',
  },
  {
    label: '手机号',
    name: 'phoneNumber',
    type: 'input',
    fieldProps: {
      placeholder: '请输入手机号',
    },
  },
  {
    label: '性别',
    name: 'gender',
    type: 'select',
    fieldProps: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
  },
  {
    label: '状态',
    name: 'status',
    type: 'radio',
    fieldProps: {
      disabled: true,
      options: [
        { label: '已激活', value: 'active' },
        { label: '未激活', value: 'inactive' },
      ],
    },
  },
]

const columns = [
  {
    title: 'id',
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '手机号',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
  {
    title: '性别',
    key: 'gender',
    dataIndex: 'gender',
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
| rowKey         | string                                       | Table组件rowKey属性                                                         | 否       | 'id'       |
| nameKey        | string                                       | 多选时会展示选中的标签用来删除，展示的字段 key                              | 否       | 'name'     |
| type           | 'checkbox' \| 'radio'                        | 单选或多选                                                                  | 否       | 'checkbox' |
| setRowDisabled | Function                                     | 设置行不可选                                                                | 否       | -          |
| modelValue     | Record<string, any> \| Record<string, any>[] | 已选中的值                                                                  | 否       | -          |

### Events

| 事件名称          | 回调参数                                     | 描述                         |
| ----------------- | -------------------------------------------- | ---------------------------- |
| update:modelValue | Record<string, any> \| Record<string, any>[] | 更改v-model绑定的值          |
| change            | Record<string, any> \| Record<string, any>[] | 触发change事件，返回选中数据 |

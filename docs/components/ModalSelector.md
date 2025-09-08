# ModalSelector
弹窗选择器，使用自定义请求，包裹TableSelector，临时存储选中选项，点确认再返回

<script setup>
  import demo1 from '@/components/ModalSelector/demos/demo1.vue'
  import demo1Code from '@/components/ModalSelector/demos/demo1.vue?raw'
</script>
<demo :comp="demo1" :code="demo1Code" title="基础使用" />

## 使用方法
以下是一个单独使用的例子：
```html
<script>
import { getUserList } from '@/api/user'

const visible = ref(false)

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
]

const columns = [
  {
    label: 'id',
    prop: 'userId',
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
    prop: 'gender',
  },
]
</script>

<template>
  <el-button @click="visible = true">
    弹窗选择
  </el-button>
  <ProModalSelector
    v-model:visible="visible" :width="800" :search-fields="searchFields" :service="getUserList"
    :columns="columns" row-key="userId"
  />
</template>

```

### 参数列表
参数继承 TableSelector
| 参数名  | 类型                                         | 描述                          | 是否必填 | 默认值   |
| ------- | -------------------------------------------- | ----------------------------- | -------- | -------- |
| title   | string                                       | 弹窗标题                      | 否       | '请选择' |
| width   | number                                       | 弹窗宽度                      | 否       | -        |
| visible | boolean                                      | 双向绑定visible，弹窗显示隐藏 | 是       | -        |
| value   | Record<string, any> \| Record<string, any>[] | 已选中的值                    | 否       | -        |

### Events

| 事件名称       | 回调参数                                     | 描述                             |
| -------------- | -------------------------------------------- | -------------------------------- |
| update:visible | boolean                                      | 更改v-model:visible绑定的值      |
| confirm        | Record<string, any> \| Record<string, any>[] | 点击确认的回调事件，返回选中数据 |

# TableSelector
表格选择器，可传入列表数据接口和查询条件进行筛选然后跨页选择，支持多选和单选，支持禁用某一行，支持本地数据分页。

如需弹窗中显示可直接使用ModalSelector组件。

<script setup>
  import demo1 from '@/components/TableSelector/demos/demo1.vue'
  import demo1Code from '@/components/TableSelector/demos/demo1.vue?raw'
</script>
## 使用方法

<demo :comp="demo1" :code="demo1Code" title="基础使用" />

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

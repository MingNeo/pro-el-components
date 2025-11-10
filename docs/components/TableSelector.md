# TableSelector
表格选择器，可传入列表数据接口和查询条件进行筛选然后跨页选择，支持多选和单选，支持禁用某一行，支持本地数据分页。

如需弹窗中显示可直接使用ModalSelector组件。

<script setup>
  import sourceCode from '@/components/TableSelector/index.vue'
</script>

## 使用方法
在 columns 中设置某一行的 type 属性为 selection 即可开启多选
<demo src="@/components/TableSelector/demos/demo1.vue" title="多选" />
<demo src="@/components/TableSelector/demos/demo2.vue" title="单选" />
本组件可视为：ProTable + ProSearchForm + useTableSelection 的组合，也可参考自行在 ProTable 中配置
<demo :code="demo1Code" title="自行实现" />

### 参数列表
| 参数名                | 类型                                         | 描述                                                                        | 是否必填 | 默认值     |
| --------------------- | -------------------------------------------- | --------------------------------------------------------------------------- | -------- | ---------- |
| search-fields         | SearchField[]                                | 搜索表单配置                                                                | 否       | -          |
| service               | UseTableListService                          | 列表数据接口                                                                | 是       | -          |
| data                  | Record<string, any>[]                        | 列表数据，如果存在 service 则忽略 data，不存在 service 时 data 进行本地分页 | 否       | -          |
| columns               | ColumnsType                                  | Table组件columns属性                                                        | 是       | -          |
| row-key               | string                                       | Table组件rowKey属性                                                         | 否       | 'id'       |
| name-key              | string                                       | 多选时会展示选中的标签用来删除，展示的字段 key                              | 否       | 'name'     |
| type                  | 'checkbox' \| 'radio'                        | 单选或多选                                                                  | 否       | 'checkbox' |
| set-row-disabled      | Function                                     | 设置行不可选                                                                | 否       | -          |
| model-value           | Record<string, any> \| Record<string, any>[] | 已选中的值                                                                  | 否       | -          |
| highlight-current-row | boolean                                      | 开启单选                                                                    | 否       | -          |
| ...                   | any                                          | ProTable/ElTable 的所有其他属性                                             | 否       | -          |

### Events

| 事件名称          | 回调参数                                     | 描述                         |
| ----------------- | -------------------------------------------- | ---------------------------- |
| update:modelValue | Record<string, any> \| Record<string, any>[] | 更改v-model绑定的值          |
| change            | Record<string, any> \| Record<string, any>[] | 触发change事件，返回选中数据 |

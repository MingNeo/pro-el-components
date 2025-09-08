# ModalDetail组件
该组件为[ModalForm组件](./ModalForm.md)的进一步封装。

基于ProFormFields配置快速生成一个弹窗表单，包含编辑、创建、详情状态。
- 快速提供增/改/查看的能力，只需要配置下fields
- 自动处理表单校验
- 自动提交新增/更新请求
- 自动防止多次提交
- 关闭时自动清空弹窗内容

<script setup>
  import demo1 from '@/components/ModalDetail/demos/demo1.vue'
  import demo1Code from '@/components/ModalDetail/demos/demo1.vue?raw'
</script>

## 使用方法
<demo :comp="demo1" :code="demo1Code" title="基础用法" />
- 编辑模式下，点击提交时，会自动调用updateService，并传入表单数据
- 新增模式下，点击提交时，会自动调用createService，并传入表单数据

通过type指定模式：'add'|'edit'|'detail'，或通过以下规则自动判断。
- 当viewMode为true时，弹窗为详情弹窗
- 当viewMode为false 且 formData/defaultValue中包含id，则弹窗为编辑弹窗
- 当viewMode为false 且 formData/defaultValue 中不含id，弹窗为新增弹窗
- 可通过idKey配置数据项唯一标识属性名，默认为'id'

## API

| 属性             | 类型                                        | 默认值 | 是否必须 | 描述                                                       |
| ---------------- | ------------------------------------------- | ------ | -------- | ---------------------------------------------------------- |
| title            | string                                      | -      | 可选     | 模态框标题                                                 |
| width            | number                                      | 520    | 可选     | 模态框宽度                                                 |
| defaultValue     | Any                                         | -      | 可选     | 表单默认值                                                 |
| v-model:formData | Record<string, any>                         | -      | 可选     | 使用受控模式管理表单数据，使用该值时defaultValue无效       |
| viewMode         | Boolean                                     | false  | 可选     | 是否为查看模式                                             |
| idKey            | string                                      | 'id'   | 可选     | 数据项唯一标识属性名                                       |
| fields           | Array                                       | []     | 必须     | 表单项列表                                                 |
| column           | number                                      | 2      | 可选     | 表单列数                                                   |
| type             | `'edit' \| 'create' \| 'detail'`            | -      | 可选     | 模式。不指定则根据formData/defaultValue 是否包含id自动判断 |
| updateService    | `(formValues: Record<string, any>) => void` | -      | 可选     | 更新数据的服务方法                                         |
| createService    | `(formValues: Record<string, any>) => void` | -      | 可选     | 创建数据的服务方法                                         |
| propPrefix       | any[]                                       | -      | 可选     | 参考ProFormFields                                          |
| formItemProps    | `Record<string, any>`                       | -      | 可选     | 默认formItem配置，参考ProFormFields                        |

| 事件       | 参数                                        | 描述                                                                      |
| ---------- | ------------------------------------------- | ------------------------------------------------------------------------- |
| open       | `() => void`                                | 弹窗打开                                                                  |
| ok         | `(formValues: Record<string, any>) => void` | 用户提交数据并由请求成功后触发，如更新/创建成功后使用此事件触发列表页刷新 |
| formChange | `(formValues: Record<string, any>) => void` | 表单state变动时触发                                                       |

## 联动
参见 [ModalForm](./ModalForm.md)

## slot
参见 [ModalForm](./ModalForm.md)

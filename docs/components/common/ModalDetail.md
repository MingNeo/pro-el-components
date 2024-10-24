# ModalDetail组件
使用ModalDetail组件可以基于FormItemsBuilder配置快速生成一个弹窗表单，包含编辑、创建、详情状态。
该组件为[ModalForm组件](../ModalForm/README.md)的进一步封装。
可用于简单增删改的表单弹窗。提交时自动防止多次提交。

<script setup>
  import demo1 from 'components/common/ModalDetail/demos/demo1.vue'
  import demo1Code from 'components/common/ModalDetail/demos/demo1.vue?raw'
</script>
<demo :comp="demo1" :code="demo1Code" />

# 使用方法
- 当viewMode=true时，弹窗为详情弹窗
- 当viewMode=fase 且 formState/defaultValue中包含id，则弹窗为编辑弹窗，点击提交自动调用updateService
- 当viewMode=fase 且 formState/defaultValue 中不含id，弹窗为新增弹窗，点击提交自动调用createService

#### 直接配置表单
``` vue
<script setup>
import { createRegion, updateRegion } from '@/api/basicConfig/region'
const detailFields = computed(() => [
  {
    label: '币种',
    name: 'currencyName',
    required: true,
  },
  {
    label: '符号',
    name: 'currencySymbol',
  },
  {
    label: '单位',
    name: 'prefixPrice',
  },
  {
    label: '简码',
    name: 'currencyShortName',
  },
])

const modalInfo = ref({ visible: false, viewMode: false, data: {} })

function handleCreate() {
  modalInfo.value = { visible: true, viewMode: false, data: {} }
}

function handleEdit() {
  modalInfo.value = { visible: true, viewMode: false, data }
}

function handleDetail() {
  modalInfo.value = { visible: true, viewMode: true, data }
}
</script>

<template>
  <modal-detail
    :key="modalInfo.data?.id"
    v-model:visible="modalInfo.visible"
    :default-value="modalInfo.data"
    :view-mode="modalInfo.viewMode"
    :fields="detailFields"
    title="货币"
    :width="700"
    :create-service="createRegion"
    :update-service="updateRegion"
    @ok="onEditSubmit"
  />
</template>
```
可使用 v-model:formState 获取表单状态，或使用@formChange获取表单变化后的值

# API清单

| 属性              | 类型                                        | 默认值 | 是否必须 | 描述                                                                          |
| ----------------- | ------------------------------------------- | ------ | -------- | ----------------------------------------------------------------------------- |
| title             | String                                      | -      | 可选     | 模态框标题                                                                    |
| width             | Number                                      | 520    | 可选     | 模态框宽度                                                                    |
| visible           | Boolean                                     | false  | 必须     | 控制模态框显示/隐藏                                                           |
| defaultValue      | Any                                         | -      | 可选     | 表单默认值                                                                    |
| v-model:formState | Record<string, any>                         | -      | 可选     | 表单数据，如果需要使用表单数据，可以绑定formState，使用该值时defaultValue无效 |
| viewMode          | Boolean                                     | false  | 可选     | 是否为查看模式                                                                |
| idKey             | String                                      | 'id'   | 可选     | 数据项唯一标识属性名                                                          |
| fields            | Array                                       | []     | 必须     | 表单项列表                                                                    |
| column            | number                                      | 2      | 可选     | 表单列数                                                                      |
| type              | `'edit' \| 'create' \| 'detail'`            | -      | 可选     | 不指定则根据formState/defaultValue 是否包含id自动判断                         |
| updateService     | `(formValues: Record<string, any>) => void` | -      | 可选     | 更新数据的服务方法，当传入的数据中有id, 则自动使用更新服务                    |
| createService     | `(formValues: Record<string, any>) => void` | -      | 可选     | 创建数据的服务方法，当传入的数据中没有id, 则自动使用创建服务                  |
| onVisible         | `() => void`                                | -      | 可选     | 弹窗显示回调                                                                  |
| namePrefix        | any[]                                       | -      | 可选     | 参考formItemsBuilder                                                          |
| formItemOptions   | `Record<string, any>`                       | -      | 可选     | 默认formItem配置，参考formItemsBuilder                                        |

| 事件           | 参数                                        | 描述                                       |
| -------------- | ------------------------------------------- | ------------------------------------------ |
| update:visible | Boolean                                     | 控制模态框显示/隐藏                        |
| ok             | `(formValues: Record<string, any>) => void` | 用户点击模态框确认按钮时触发，返回表单数据 |
| formChange     | `(formValues: Record<string, any>) => void` | 表单state变动时触发                        |

## 联动
参见 [ModalForm](../ModalForm/README.md)

## slot
参见 [ModalForm](../ModalForm/README.md)

# ProModalForm
动态生成简单模态框表单及详情弹窗

- 几行配置即可生成弹窗表单
- 自动管理表单数据
- 支持表单联动
- 自动管理表单loading状态
- 模式：查看/编辑
- 关闭时自动清空弹窗内容

<script setup>
  import demo1 from '@/components/ModalForm/demos/demo1.vue'
  import demo1Code from '@/components/ModalForm/demos/demo1.vue?raw'
</script>

# 使用方法

<demo :comp="demo1" :code="demo1Code" title="基础使用" />

### 表单state
默认情况下，ProModalForm为非受控模式，formData由内部自行管理，提交表单时通过ok事件的回调函数获取formData。

但对于某些需要获取实时formData的特殊情况，如特殊联动等，可如下2种方式获取表单实时的formData

1、通过ref获取实时formData。受控与非受控模式（即不传入form-data，ProModalForm自行维护表单，通过defaultValue等设置默认值）均可使用。
```vue
<script lang="ts" setup>
const modalFormRef = ref(null)

// 表单数据：modalFormRef.value.formData
</script>

<template>
  <modal-form
    ref="modalFormRef"
    v-model="showModal"
    ...
  />
</template>
```

2、受控模式。
使用v-model:form-data定义并绑定表单数据，直接使用formData即可。
```vue
<script lang="ts" setup>
const formData = reactive({
  name: '',
  age: '',
  address: '',
})
</script>

<template>
  <modal-form
    v-model="showModal"
    v-model:form-data="formData"
    ...
  />
</template>
```

## 组件属性

### Props

| 属性名           | 类型                | 默认值    | 是否必填 | 描述                                                                         |
| ---------------- | ------------------- | --------- | -------- | ---------------------------------------------------------------------------- |
| title            | string              |           | 否       | 模态框的标题                                                                 |
| ref              | Ref                 |           | 否       | 可通过ref获取弹窗的表单                                                      |
| width            | number              | 520       | 否       | 宽度                                                                         |
| defaultValue     | any                 |           | 否       | 表单默认值，变化时会更新表单数据，但表单数据变化不会影响原始传入值           |
| v-model:formData | Record<string, any> |           | 否       | 表单数据，如果需要使用表单数据，可以绑定formData，使用该值时defaultValue无效 |
| viewMode         | boolean             | false     | 否       | 是否为只读模式            |
| idKey            | string              | "id"      | 否       | 提交更新或者创建服务时，作为主键的字段名                                     |
| fields           | `Field[]`           |           | 是       | 表单字段列表。[见ProFormFields](./FormFields.md)                    |
| column           | number              | 1         | 否       | 每行展示的列数                                                               |
| propPrefix       | (string             | number)[] | []       | 否                                                                           | 表单字段的名称前缀
| formItemProps    | Record<string, any> | {}        | 否       | 表单元素选项                                                                 |

### Events

| 事件名         | 回调参数                                    | 描述                           |
| -------------- | ------------------------------------------- | ------------------------------ |
| update:visible | `(visbile: Boolean) => void`                | 控制模态框是否显示的事件       |
| ok             | `(formValues: Record<string, any>) => void` | 点击模态框确认按钮后触发的事件 |
| formChange     | `(formValues: Record<string, any>) => void` | 表单state变动时触发            |

## 联动
参见 [ProFormFields](./FormFields.md#联动)

## Slot

ProModalForm组件提供了几个默认插槽`<slot />`，用于显示在模态框内容区域中。

下面是示例代码：

```html
<template>
  <ProModalForm v-model="showModal" :fields="fields" v-model:formData="data">
    <template #header>
      <!-- 这里用在表单内容顶部 -->
    </template>

    <template #extra>
      <!-- 这里用在表单内容底部 -->
    </template>

    <template #default="{ data, onChange, formRef }">
      <!-- 如果不使用内置的ProFormFields或者希望使用多个，可以在这里自定义，data为表单数据，数据变更后需手工触发onChange -->
        <form-items-builder
          :model-value="data"
          :column="props.column || 2"
          :view-mode="props.viewMode"
          :fields="props.fields"
          :form-item-props="props.formItemProps"
          @update:model-value="onChange"
        />
    </template>
  </ProModalForm>
</template>
```

# PageDetail组件
使用PageDetail组件可以使用FormItemsBuilder配置快速生成一个表单详情页，包含编辑、创建、详情状态。

<demo src="../../packages/components/src/components/src/layouts/PageDetail/demos/demo.vue" />

## 使用方法
- viewMode=true,  详情页
- viewMode=false & data.id 为空，新建页，id可使用idKey指定
- viewMode=false & data.id 不为空，编辑页，id可使用idKey指定

``` vue
<script setup>
import { createRegion, getRegionInfoById, updateRegion } from '@/api/basicConfig/region'
import useQuery from '@/composables/useQuery'
import useRequest from '@/composables/useRequest'

const query = useQuery().value
const { data, isLoading, execute } = useRequest(getRegionInfoById, { immediate: false })

const router = useRouter()
const detailFields = computed(() => [
  {
    label: '编码',
    name: 'regionCode',
    required: true,
  },
  {
    label: '名称',
    name: 'regionName',
  },
  {
    label: '简称',
    name: 'regionShortName',
  },
  {
    label: '别名',
    name: 'regionAlias',
  },
  {
    label: '时区',
    name: 'timeZone',
  },
  {
    label: '语言',
    name: 'regionLanguage',
  },
  {
    label: '币种',
    name: 'currency.currencyName',
  },
])

onMounted(() => {
  execute(query.id as any)
})

function handleOk() {
  router.back()
}

async function handleCancel(id: number) {
  router.back()
}
</script>

<template>
  <page-detail
    :loading="isLoading"
    :view-mode="!!query.viewMode"
    :default-value="data"
    :fields="detailFields"
    title="国家(地区)"
    :create-service="createRegion"
    :update-service="updateRegion"
    @ok="handleOk"
    @cancel="handleCancel"
  />
</template>
```

#### 自定义footerActions
默认显示取消、提交两个按钮，可以通过footerActions进行自定义。
```vue
<script lang="ts" setup>
function footerActions({ cancel, submit, submitLoading }: any) {
  return [
    {
      text: '取消',
      onClick: cancel,
    },
    {
      text: '保存',
      onClick: handleSave,
    },
    {
      text: '提交',
      onClick: submit,
      loading: submitLoading,
      type: 'primary',
    }
  ]
}
</script>

<template>
  <page-detail
    v-model:form-state="data"
    title="资源库管理"
    :loading="loading"
    :view-mode="props.viewMode"
    :fields="detailFields"
    :extra-fields="extraFields"
    :update-service="handleEditSubmit"
    :create-service="handleEditSubmit"
    :footer-actions="footerActions"
    @ok="onOk"
  />
</template>
```

## API清单

| 属性              | 类型                                                  | 默认值 | 是否必须 | 描述                                                                          |
| ----------------- | ----------------------------------------------------- | ------ | -------- | ----------------------------------------------------------------------------- |
| title             | String                                                | -      | 可选     | 模态框标题                                                                    |
| defaultValue      | Any                                                   | -      | 可选     | 表单默认值                                                                    |
| v-model:formState | Record<string, any>                                   | -      | 可选     | 表单数据，如果需要使用表单数据，可以绑定formState，使用该值时defaultValue无效 |
| viewMode          | Boolean                                               | false  | 可选     | 是否为查看模式                                                                |
| idKey             | String                                                | 'id'   | 可选     | 数据项唯一标识属性名                                                          |
| fields            | Array                                                 | []     | 可选     | 表单项列表，如果使用default slot或单独使用extraFields可不使用                 |
| extraFields       | { title?: string; fields: FormItemsBuilderField[] }[] | []     | 可选     | 扩展的表单项列表                                                              |
| footerActions     | ({ submit, cancel, submitLoading }) => any[]          | -      | 可选     | 底部操作按钮，默认为取消、提交                                                |
| showActions       | boolean                                               | -      | 可选     | 是否显示底部操作按钮                                                          |
| updateService     | `(formValues: Record<string, any>) => void`           | -      | 可选     | 更新数据的服务方法                                                            |
| createService     | `(formValues: Record<string, any>) => void`           | -      | 可选     | 创建数据的服务方法                                                            |

| 事件           | 类型                                        | 描述                                       |
| -------------- | ------------------------------------------- | ------------------------------------------ |
| update:visible | Boolean                                     | 控制模态框显示/隐藏                        |
| ok             | `(formValues: Record<string, any>) => void` | 用户点击模态框确认按钮时触发，返回表单数据 |

## slot
PageDetail组件提供了几个默认插槽`<slot />`，用于显示在内容区域中。
下面是示例代码：

```html
<template>
  <page-detail :fields="fields">
    <template #contentHeader>
      <!-- 这里用在表单内容顶部 -->
    </template>

    <template #contentExtra>
      <!-- 这里用在表单内容底部 -->
    </template>

    <!-- 使用此默认插槽时，fields无效，即完全自定义控制 -->
    <template #default="{ data, onChange, formRef }">
      <!-- 如果不使用内置的formItemsBuilder或者希望使用多个，可以在这里自定义，data为表单数据，数据变更后需手工触发onChange -->
        <card>
          <section-header title="基本信息" />
          <form-items-builder
            :model-value="data"
            :column="props.column || 2"
            :view-mode="props.viewMode"
            :fields="props.fields"
            :form-item-options="props.formItemOptions"
            :update-model-value="onChange"
          />
        </card>
    </template>
  </page-detail>
</template>
```

const e=`<script lang="ts" setup>
import type { ProFormFieldsField, ProFormFieldsFormData, ProFormFieldsProps } from './types'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElFormItem, ElTooltip } from 'element-plus'
import { ProField } from 'pro-el-components'
import { computed, ref, watch, withDefaults } from 'vue'
import FieldWrapper from './FieldWrapper.vue'
import { formatRangeData, getFormFieldProps, getFormItemCol, getformItemProps, getItemName, getPlaceholder, getRulesForColumn } from './helper'
import { useFieldWatch } from './hooks/useFieldWatch'
import Wrapper from './Wrapper.vue'
import 'pro-el-components/components/ButtonActions/style.css'
import 'pro-el-components/components/Field/style.css'
import './style.css'

defineOptions({
  name: 'ProFormFields',
})

const props = withDefaults(defineProps<ProFormFieldsProps>(), { showLabel: true, column: 3, fields: () => [], modelValue: () => ({}) })

const emit = defineEmits(['update:modelValue', 'change'])

const formValues = ref<ProFormFieldsFormData>(props.modelValue)

const fields = computed(() => {
  return props.fields.filter(v => typeof v?.show === 'function' ? v.show(formValues.value) : (v?.show ?? true))
})

watch(() => props.modelValue, val => (formValues.value = val || {}), { deep: true })

// 提供watch联动的能力
const { fieldUpdates } = useFieldWatch(props.fields, formValues)
const defaultColSpan = computed(() => getFormItemCol(props.column))

// 将 FormFields 的 type 映射到 ProField 的 fieldType
function mapFieldType(type: string = 'text') {
  const typeMap: Record<string, string> = {
    text: 'input',
    datePicker: 'date',
    timePicker: 'dateTime',
    rangePicker: 'dateRange',
    colorPicker: 'color',
    upload: 'file',
  }
  return typeMap[type || ''] || type
}

function onModelValueUpdate({ prop, formatChangedValue }: ProFormFieldsField, value: any) {
  const formatedValue = formatChangedValue ? formatChangedValue(value, formValues.value) : value
  formValues.value = { ...formValues.value, [prop]: formatedValue }
  emit('update:modelValue', formatRangeData(formValues.value, props.fields))
}

function onFieldChange({ prop, formatChangedValue, onChange, on }: ProFormFieldsField, value: any, ...args: any[]) {
  const formatedValue = formatChangedValue ? formatChangedValue(value, formValues.value) : value
  formValues.value = { ...formValues.value, [prop]: formatedValue }
  const onChangeFn = onChange || on?.change
  onChangeFn?.(formatedValue, formValues, value, ...args)
  emit('change', formValues.value)
}

const formItems = computed<ProFormFieldsField[]>(() => {
  return fields.value.map((item) => {
    const { prop, label, type = '', required, col = ({} as any), viewMode, options } = item
    const isViewMode = props.viewMode || viewMode
    col.span = col.span || getFormItemCol(item.column || props.column, col.span)
    const itemRules = getRulesForColumn(item)
    const itemValue = formValues.value[prop]
    const itemProps = getformItemProps(item.formItemProps, props.formItemProps)
    const itemPlaceholder = getPlaceholder(type, label)

    // 合并 watch 产生的更新
    const updates = fieldUpdates[prop] || {}

    return {
      ...item,
      ...updates, // 应用 watch 更新
      required,
      rules: itemRules,
      fieldProps: {
        ...(!isViewMode && itemPlaceholder ? { placeholder: itemPlaceholder } : {}),
        ...getFormFieldProps(item, itemValue, formValues.value),
        // 将 options 传递给 ProField（用于 select/radio/checkbox 等）
        ...(updates.options || options ? { options: updates.options || options } : {}),
        ...updates.fieldProps, // 最后应用 watch 更新的 fieldProps，确保优先级最高
      },
      col,
      itemValue,
      itemProps,
    }
  })
})
<\/script>

<template>
  <Wrapper v-if="formItems.length" :inline="props.inline" v-bind="props.row" class="pro-form-fields" :class="{ 'view-mode': viewMode }">
    <template v-for="(item) in formItems" :key="item.prop">
      <FieldWrapper :inline="props.inline" :class="item.class" :col="item.col">
        <ElFormItem
          :class="\`pro-form-fields_item \${viewMode ? 'view-mode' : ''}\`"
          :prop="getItemName(item.prop, props.propPrefix)"
          :label="showLabel && !item.labelExtra && !item.labelTip ? item.label : undefined"
          :rules="getRulesForColumn(item)"
          v-bind="item.itemProps"
        >
          <template v-if="showLabel && (item.labelExtra || item.labelTip)" #label>
            {{ item.label }}
            <span v-if="item.labelExtra" class="pro-form-fields_item__label-extra">{{ item.labelExtra }}</span>
            <ElTooltip v-if="item.labelTip" placement="top">
              <template #title>
                {{ item.labelTip }}
              </template>
              <QuestionFilled class="label-tip-icon" />
            </ElTooltip>
          </template>

          <!-- 自定义渲染 -->
          <div v-if="(viewMode || item.viewMode) && item.customRender" class="break-all">
            {{ item.customRender(formValues[item.prop], item, formValues) }}
          </div>

          <template v-else-if="item.type === 'text'">
            <div class="pro-form-field_content">
              {{ item.customRender ? item.customRender(formValues[item.prop], item, formValues) : formValues[item.prop] }}
            </div>
          </template>

          <!-- 自定义组件 -->
          <template v-else-if="item.type === 'component'">
            <component
              :is="item.component"
              :model-value="formValues[item.prop]"
              v-bind="item.fieldProps"
              :view-mode="viewMode || item.viewMode"
              @update:model-value="(val: any) => onModelValueUpdate(item, val)"
              @change="(val: any, ...args: any[]) => onFieldChange(item, val, ...args)"
              v-on="item.on || {}"
            />
          </template>

          <!-- 使用 ProField 渲染的字段类型 -->
          <ProField
            v-else
            :with-form-item="false"
            :model-value="formValues[item.prop]"
            :field-type="mapFieldType(item.type)"
            :field-props="item.fieldProps"
            :view-mode="viewMode || item.viewMode"
            @update:model-value="(val: any) => onModelValueUpdate(item, val)"
            @change="(val: any, ...args: any[]) => onFieldChange(item, val, ...args)"
            v-on="item.on || {}"
          />
        </ElFormItem>
      </FieldWrapper>
    </template>
    <slot :col-span="defaultColSpan" />
  </Wrapper>
</template>
`;export{e as default};

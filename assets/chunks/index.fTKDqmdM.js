const e=`<script lang="ts" setup>
import type { CheckboxGroupValueType } from 'element-plus'
import type { ProFormFieldsField, ProFormFieldsFormData, ProFormFieldsProps } from './types'
import { QuestionFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElCheckbox, ElCheckboxGroup, ElColorPicker, ElDatePicker, ElFormItem, ElInput, ElInputNumber, ElRadio, ElRadioGroup, ElRate, ElSlider, ElSwitch, ElTimePicker, ElTooltip, ElTreeSelect } from 'element-plus'
import { ProCascader, ProSelect, ProUpload } from 'pro-el-components'
import { computed, defineEmits, defineProps, ref, watch, withDefaults } from 'vue'
import FieldWrapper from './FieldWrapper.vue'
import { formatRangeData, getFormFieldProps, getFormItemCol, getformItemProps, getItemName, getPlaceholder, getRulesForColumn, renderView } from './helper'
import { useFieldWatch } from './hooks/useFieldWatch'
import Wrapper from './Wrapper.vue'
import 'pro-el-components/components/ButtonActions/style.css'
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

function onFieldChange({ prop, formatChangedValue, onChange }: ProFormFieldsField, value: any, ...args: any) {
  const formatedValue = formatChangedValue ? formatChangedValue(value, formValues.value) : value
  formValues.value[prop] = formatedValue
  try {
    onChange?.(formatedValue, formValues, value, ...args)
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log('form field onChange error', error)
  }
  emit('update:modelValue', formatRangeData(formValues.value, props.fields))
  emit('change', formValues.value)
}
const formItems = computed<ProFormFieldsField[]>(() => {
  return fields.value.map((item) => {
    const { prop, label, type = '', required, col = ({} as any) } = item
    col.span = col.span || getFormItemCol(item.column || props.column, col.span)
    const itemRules = getRulesForColumn(item)
    const itemValue = formValues.value[prop]
    const itemProps = getformItemProps(item.formItemProps, props.formItemProps)
    const itemPlaceholder = getPlaceholder(type, label)

    // 合并 watch 产生的更新
    const updates = fieldUpdates.value[prop] || {}

    return {
      ...item,
      ...updates, // 应用 watch 更新
      required,
      rules: itemRules,
      fieldProps: {
        placeholder: itemPlaceholder,
        ...getFormFieldProps(item, itemValue, formValues.value),
        ...updates.fieldProps, // 合并更新的 fieldProps
      },
      col,
      itemValue,
      itemProps,
    }
  })
})
<\/script>

<template>
  <Wrapper v-if="formItems.length" :inline="props.inline" :gutter="24" v-bind="props.row" class="pro-form-items-builder" :class="{ 'view-mode': viewMode }">
    <template v-for="(item) in formItems" :key="item.prop">
      <FieldWrapper :inline="props.inline" v-bind="item.col">
        <ElFormItem
          :class="\`pro-form-item \${viewMode ? 'view-mode' : ''}\`"
          :prop="getItemName(item.prop, props.propPrefix)"
          :label="showLabel && !item.labelExtra && !item.labelTip ? item.label : undefined"
          :rules="getRulesForColumn(item)"
          v-bind="item.itemProps"
        >
          <template v-if="showLabel && (item.labelExtra || item.labelTip)" #label>
            {{ item.label }}
            <span v-if="item.labelExtra" class="pro-form-item__label-extra">{{ item.labelExtra }}</span>
            <ElTooltip v-if="item.labelTip" placement="top">
              <template #title>
                {{ item.labelTip }}
              </template>
              <QuestionFilled class="label-tip-icon" />
            </ElTooltip>
          </template>
          <template v-if="(viewMode || item.viewMode) && item.type === 'component' && item.customRender">
            <slot name="fieldView" :field="item" :record="formValues" :text="formValues[item.prop]">
              <div class="break-all">
                {{ item.customRender(formValues[item.prop], item, formValues) }}
              </div>
            </slot>
          </template>
          <div v-else-if="(viewMode || item.viewMode) && item.customRender" class="break-all">
            {{ item.customRender(formValues[item.prop], item, formValues) }}
          </div>
          <!-- <template v-else-if="(viewMode || item.viewMode) && item.customRender">
            <slot name="fieldView" :field="item" :record="formValues" :text="formValues[item.prop]">
              <div v-if="item.customRender" class="break-all">
                {{ item.customRender(formValues[item.prop], item, formValues) }}
              </div>
              <div v-else-if="item.type === 'upload'">
                <ProUpload :file-list="formValues[item.prop]" v-bind="item.fieldProps" disabled />
              </div>
              <div v-else class="break-all">
                {{ renderView(formValues[item.prop], item) }}
              </div>
            </slot>
          </template> -->
          <template v-else-if="item.type === 'component'">
            <component
              :is="item.component" :model-value="formValues[item.prop]"
              v-bind="item.fieldProps"
              :view-mode="viewMode || item.viewMode"
              @update:model-value="(val: any) => onFieldChange(item, val)"
              @change="(val: any, ...args: any[]) => onFieldChange(item, val, ...args)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'text'">
            <div class="break-all">
              {{ item.customRender ? item.customRender(formValues[item.prop], item, formValues) : formValues[item.prop] }}
            </div>
          </template>
          <template v-else-if="item.type === 'select'">
            <ProSelect
              :model-value="formValues[item.prop]"
              :view-mode="viewMode || item.viewMode"
              :options="item.options"
              v-bind="item.fieldProps"
              @change="(val: any, ...args: any[]) => onFieldChange(item, val, ...args)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'rate'">
            <ElRate
              :model-value="formValues[item.prop]" :disabled="viewMode || item.viewMode" v-bind="item.fieldProps"
              @update:model-value="(val: any) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'radio'">
            <div v-if="viewMode || item.viewMode" class="break-all">
              {{ renderView(formValues[item.prop], item) }}
            </div>
            <ElRadioGroup
              v-else
              :model-value="formValues[item.prop]"
              v-bind="item.fieldProps"
              @update:model-value="(val: string | number | boolean | undefined) => onFieldChange(item, val)" v-on="item.on || {}"
            >
              <ElRadio v-for="cur in item.options || []" :key="cur.value" v-bind="cur">
                {{ cur.label }}
              </ElRadio>
            </ElRadioGroup>
          </template>
          <template v-else-if="item.type === 'checkbox'">
            <div v-if="viewMode || item.viewMode" class="break-all">
              {{ renderView(formValues[item.prop], item) }}
            </div>
            <ElCheckboxGroup
              v-else
              :model-value="formValues[item.prop]"
              v-bind="item.fieldProps"
              @update:model-value="(val: CheckboxGroupValueType) => onFieldChange(item, val)" v-on="item.on || {}"
            >
              <ElCheckbox v-for="cur in item.options || []" :key="cur.value" v-bind="cur">
                {{ cur.label }}
              </ElCheckbox>
            </ElCheckboxGroup>
          </template>
          <template v-else-if="item.type === 'datePicker'">
            <div v-if="viewMode || item.viewMode" class="break-all">
              {{ renderView(formValues[item.prop], item) }}
            </div>
            <ElDatePicker
              v-else
              :model-value="formValues[item.prop] ? dayjs(formValues[item.prop]).format(item.fieldProps?.valueFormat || 'YYYY-MM-DD') : ''"
              :format="item.fieldProps?.format || 'YYYY-MM-DD'"
              v-bind="item.fieldProps"
              @update:model-value="(value: any) => onFieldChange(item, value ? (item.fieldProps?.valueFormat ? dayjs(value).format(item.fieldProps?.valueFormat) : dayjs(value).valueOf()) : '')"
            />
          </template>
          <template v-else-if="item.type === 'rangePicker'">
            <div v-if="viewMode || item.viewMode" class="break-all">
              {{ renderView(formValues[item.prop], item) }}
            </div>
            <ElDatePicker
              v-else
              type="daterange"
              :model-value="formValues[item.prop] ? formValues[item.prop].map((v: any) => dayjs(v).format(item.fieldProps?.valueFormat || 'YYYY-MM-DD')) : []"
              :format="item.fieldProps?.format || 'YYYY-MM-DD'"
              :default-time="item.fieldProps?.defaultTime || [dayjs('2000-01-01 00:00:00').toDate(), dayjs('2000-01-01 23:59:59').toDate()]"
              v-bind="item.fieldProps"
              @update:model-value="(value: any) => onFieldChange(item, value)"
            />
          </template>
          <template v-else-if="item.type === 'timePicker'">
            <div v-if="viewMode || item.viewMode" class="break-all">
              {{ renderView(formValues[item.prop], item) }}
            </div>
            <ElTimePicker
              v-else
              :model-value="formValues[item.prop]"
              v-bind="item.fieldProps"
              @update:model-value="(val: any) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'cascader'">
            <ProCascader
              :model-value="formValues[item.prop]"
              v-bind="item.fieldProps"
              :view-mode="viewMode || item.viewMode"
              @update:model-value="(val) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'slider'">
            <ElSlider
              :model-value="formValues[item.prop]" v-bind="item.fieldProps" :disabled="viewMode || item.viewMode"
              @update:model-value="(val: any) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'switch'">
            <ElSwitch
              v-model="formValues[item.prop]" :disabled="viewMode || item.viewMode"
              v-bind="item.fieldProps" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'treeSelect'">
            <div v-if="viewMode || item.viewMode" class="break-all">
              {{ renderView(formValues[item.prop], item) }}
            </div>
            <ElTreeSelect
              v-else
              :model-value="formValues[item.prop]"
              v-bind="item.fieldProps"
              @change="(val: any, ...args: any[]) => onFieldChange(item, val, ...args)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'number'">
            <div v-if="viewMode || item.viewMode" class="break-all">
              {{ renderView(formValues[item.prop], item) }}
            </div>
            <ElInputNumber
              v-else
              :model-value="formValues[item.prop]"
              v-bind="item.fieldProps"
              @update:model-value="(val: any) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'textarea'">
            <div v-if="viewMode || item.viewMode" class="break-all">
              {{ formValues[item.prop] }}
            </div>
            <ElInput
              v-else
              type="textarea"
              :model-value="formValues[item.prop]"
              v-bind="item.fieldProps"
              @update:model-value="(val: any) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'colorPicker'">
            <ElColorPicker
              :model-value="formValues[item.prop]"
              v-bind="item.fieldProps" :disabled="viewMode || item.viewMode"
              @update:model-value="(val: any) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'upload'">
            <ProUpload
              :file-list="formValues[item.prop]"
              v-bind="item.fieldProps" :disabled="!!(viewMode || item.viewMode)"
              @update:file-list="(val) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>

          <template v-else>
            <div v-if="viewMode || item.viewMode" class="break-all">
              {{ formValues[item.prop] }}
            </div>
            <ElInput
              v-else
              :model-value="formValues[item.prop]"
              v-bind="item.fieldProps"
              @update:model-value="(val: string | number) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
        </ElFormItem>
      </FieldWrapper>
    </template>
    <slot :col-span="defaultColSpan" />
  </Wrapper>
</template>
`;export{e as default};

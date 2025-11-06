import type { Ref } from 'vue'
import type { ProFormFieldsField, ProFormFieldsFormData } from '../types'
import { computed, reactive, watch } from 'vue'

export interface WatchCondition {
  when: (value: any, form: ProFormFieldsFormData) => boolean
  update: Partial<ProFormFieldsField>
}

export interface FormItemWatch {
  field: string
  handler?: (value: any, form: ProFormFieldsFormData, field: ProFormFieldsField) => void | Partial<ProFormFieldsField>
  conditions?: WatchCondition[]
}

export function useFieldWatch(
  fields: ProFormFieldsField[],
  formValues: Ref<ProFormFieldsFormData>,
) {
  const fieldUpdates = reactive<Record<string, Partial<ProFormFieldsField>>>({})

  function setupFieldWatchers() {
    fields.forEach((field) => {
      if (!field.watch)
        return

      const watches = Array.isArray(field.watch) ? field.watch : [field.watch]

      watches.forEach((watchConfig) => {
        const watchSource = computed(() => formValues.value[watchConfig.field])

        const handleUpdate = (value: any) => {
          const currentFormValues = formValues.value

          // 处理 handler 方式
          if (watchConfig.handler) {
            const updates = watchConfig.handler(value, currentFormValues, field)
            if (updates)
              updateField(field.prop, updates)
          }

          // 处理 conditions 方式
          if (watchConfig.conditions) {
            for (const condition of watchConfig.conditions) {
              if (condition.when(value, currentFormValues)) {
                updateField(field.prop, condition.update)
                break // 匹配第一个符合条件的更新
              }
            }
          }
        }

        // 立即执行一次以设置初始状态
        handleUpdate(watchSource.value)

        // 设置 watch 监听后续变化
        watch(watchSource, handleUpdate)
      })
    })
  }

  function updateField(fieldName: string, updates: Partial<ProFormFieldsField>) {
    fieldUpdates[fieldName] = {
      ...(fieldUpdates[fieldName] || {}),
      ...updates,
      fieldProps: { // 深度合并 fieldProps
        ...(fieldUpdates[fieldName]?.fieldProps || {}),
        ...(updates.fieldProps || {}),
      },
    }
  }
  setupFieldWatchers()

  return {
    fieldUpdates,
  }
}

import type { Ref } from 'vue'
import type { ProFormFieldsField, ProFormFieldsFormData } from '../types'
import { onMounted, ref, watchEffect } from 'vue'

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
  const fieldUpdates = ref<Record<string, Partial<ProFormFieldsField>>>({})

  function setupFieldWatchers() {
    fields.forEach((field) => {
      if (!field.watch)
        return

      const watches = Array.isArray(field.watch) ? field.watch : [field.watch]

      watches.forEach((watch) => {
        watchEffect(() => {
          const value = formValues.value[watch.field]

          // 处理 handler 方式
          if (watch.handler) {
            const updates = watch.handler(value, formValues.value, field)
            if (updates)
              updateField(field.prop, updates)
          }

          // 处理 conditions 方式
          if (watch.conditions) {
            for (const condition of watch.conditions) {
              if (condition.when(value, formValues.value)) {
                updateField(field.prop, condition.update)
                break // 匹配第一个符合条件的更新
              }
            }
          }
        })
      })
    })
  }

  function updateField(fieldName: string, updates: Partial<ProFormFieldsField>) {
    fieldUpdates.value[fieldName] = {
      ...(fieldUpdates.value[fieldName] || {}),
      ...updates,
    }
  }

  onMounted(() => {
    setupFieldWatchers()
  })

  return {
    fieldUpdates,
  }
}

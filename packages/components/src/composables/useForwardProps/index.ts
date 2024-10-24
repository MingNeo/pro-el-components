import type { MaybeRefOrGetter } from 'vue'
import { camelize, computed, getCurrentInstance, toRef } from 'vue'

interface PropOptions {
  type?: any
  required?: boolean
  default?: any
}

/**
 * TypeScript 中的 `useForwardProps` 函数接收一组属性，并返回一个计算值，
 * 该计算值将默认属性与当前实例中已分配的属性结合在一起。
 * @param {T} props - `props` 参数是一个对象，表示传递给组件的属性。
 * @returns 结合默认属性、保留属性和已分配属性的计算值。
 */
export function useForwardProps<T extends Record<string, any>>(props: MaybeRefOrGetter<T>) {
  const vm = getCurrentInstance()
  // Default value for declared props
  const defaultProps = Object.keys(vm?.type.props ?? {}).reduce((prev, curr) => {
    const defaultValue = (vm?.type.props[curr] as PropOptions).default
    if (defaultValue !== undefined)
      prev[curr as keyof T] = defaultValue
    return prev
  }, {} as T)

  const refProps = toRef(props)
  return computed(() => {
    const preservedProps = {} as T
    const assignedProps = vm?.vnode.props ?? {}

    Object.keys(assignedProps).forEach((key) => {
      preservedProps[camelize(key) as keyof T] = assignedProps[key]
    })

    // 仅从 props 参数返回值
    return Object.keys({ ...defaultProps, ...preservedProps }).reduce((prev, curr) => {
      if (refProps.value[curr] !== undefined)
        prev[curr as keyof T] = refProps.value[curr]
      return prev
    }, {} as T)
  })
}

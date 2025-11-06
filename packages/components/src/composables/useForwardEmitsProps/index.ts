import type { MaybeRefOrGetter } from 'vue'
import { useEmitAsProps, useForwardProps } from 'pro-el-components'
import { computed } from 'vue'

/**
 * `useForwardEmitsProps` 函数接收 props 和一个可选的 emit 函数，并返回一个组合了解析后的 props 和 emits 的计算对象。
 * @param {T} props - `props` 参数的类型为 `T`，它是一个泛型类型，扩展了 `useForwardProps` 函数的参数。
 * 它代表传递给 `useForwardProps` 函数的 props 对象。
 * @param [emit] - `emit` 参数是一个用于发出事件的函数。它接收两个参数：`name`，表示要发出的事件的名称，
 * 以及 `args`，表示随事件传递的参数。
 * @returns 返回一个计算属性，该属性将解析后的 props 和 emits 作为 props 组合在一起。
 */
export function useForwardEmitsProps<T extends Record<string, any>, Name extends string>(props: MaybeRefOrGetter<T>, emit?: (name: Name, ...args: any[]) => void) {
  const parsedProps = useForwardProps(props)
  const emitsAsProps = emit ? useEmitAsProps(emit) : {}

  // return computed(() => ({
  //   ...parsedProps.value,
  //   ...emitsAsProps,
  // }))
  return computed(() => {
    return {
      ...parsedProps.value,
      ...emitsAsProps,
    }
  })
}

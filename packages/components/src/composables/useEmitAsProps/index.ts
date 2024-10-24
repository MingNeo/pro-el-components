import { camelize, getCurrentInstance, toHandlerKey } from 'vue'

// Vue没有事件转发功能，为了绑定emits，需要将事件转换为`onXXX`回调函数
// 问题: https://github.com/vuejs/core/issues/5917
/**
 * `useEmitAsProps`函数是一个TypeScript工具，它将发出的事件转换为Vue组件的props。
 * @param emit - `emit`参数是一个用于从组件发出事件的函数。它接收两个参数：`name`是待发出的事件名称，
 * `...args`是随事件传递的参数。
 * @returns 函数`useEmitAsProps`返回一个对象，该对象将事件名称映射到调用具有相应事件名称和参数的`emit`函数的函数。
 */
export function useEmitAsProps<Name extends string>(
  emit: (name: Name, ...args: any[]) => void,
) {
  const vm = getCurrentInstance()

  const events = vm?.type.emits as Name[]
  const result: Record<string, any> = {}

  if (!events?.length) {
    console.warn(
      `No emitted event found. Please check component: ${vm?.type.__name}`,
    )
  }

  events?.forEach((ev) => {
    result[toHandlerKey(camelize(ev))] = (...arg: any) => emit(ev, ...arg)
  })
  return result
}

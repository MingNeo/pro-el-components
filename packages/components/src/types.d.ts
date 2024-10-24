export type TypeNoReadonly<T> = {
  -readonly [K in keyof T]: T[K]
}
export type InstancePropsType<T extends abstract new (...args: any) => any> = Partial<TypeNoReadonly<InstanceType<T>['$props']>>

export type ComponentType<T> =
  T extends new (...args: any) => any ? 1 :
    T extends (...args: any) => any ? 2 :
      0

export type ComponentProps<T> =
  T extends new (...args: any) => { $props: infer P } ? NonNullable<P> :
    T extends (props: infer P, ...args: any) => any ? P :
      Record<string, never>

export type ComponentSlots<T> =
  T extends new (...args: any) => { $slots: infer S } ? NonNullable<S> :
    T extends (props: any, ctx: { slots: infer S, attrs: any, emit: any }, ...args: any) => any ? NonNullable<S> :
      Record<string, never>

export type ComponentEmit<T> =
  T extends new (...args: any) => { $emit: infer E } ? NonNullable<E> :
    Record<string, never>

export type ComponentExposed<T> =
  T extends new (...args: any) => infer E ? E :
    T extends (props: any, ctx: any, expose: (exposed: infer E) => any, ...args: any) => any ? NonNullable<E> :
      Record<string, never>

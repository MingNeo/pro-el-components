/**
 * 解绑对象引用，返回一个新的对象副本
 * @param obj 需要解绑的对象
 * @returns 解绑后的新对象
 */
export function unbind<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (Array.isArray(obj))
    return obj.map(item => unbind(item)) as unknown as T

  return Object.keys(obj as object).reduce((acc, key) => {
    acc[key] = unbind((obj as any)[key])
    return acc
  }, {} as any)
}

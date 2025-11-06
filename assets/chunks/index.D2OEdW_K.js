const n=`import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface PageStorageOptions {
  key?: string // 自定义存储键名
  immediate?: boolean // 是否立即从存储中恢复数据
}

export function usePageStorage<T>(initialValue: T, options: PageStorageOptions = {}) {
  const { immediate = true } = options
  const data = ref<T>(initialValue)

  // 生成唯一的存储键，结合路由路径确保不同页面数据隔离
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  const storageKey = \`page_storage_\${options.key || pathname.replace(/^\\//, '_')}\`

  // 存储数据和时间戳
  const saveToStorage = (value: T) => {
    const saveData = {
      timestamp: Date.now(),
      data: value,
    }
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(saveData))
    }
    catch (e) {
      console.error('Failed to save page storage:', e)
    }
  }

  // 从存储中恢复数据
  const loadFromStorage = () => {
    try {
      const stored = sessionStorage.getItem(storageKey)

      if (!stored)
        return

      const { data: storedData } = JSON.parse(stored)
      // 检查数据是否过期（24小时后自动失效）
      // if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      //   clearStorage()
      //   return
      // }
      data.value = storedData
    }
    catch (e) {
      console.error('Failed to load page storage:', e)
    }
  }

  // 清除存储的数据
  const clearStorage = () => {
    sessionStorage.removeItem(storageKey)
  }

  // 监听数据变化自动存储
  watch(
    () => data.value,
    (newValue) => {
      saveToStorage(newValue)
    },
    { deep: true },
  )

  // 组件挂载时加载数据
  onMounted(() => {
    if (immediate)
      loadFromStorage()
  })

  // 组件卸载前清除数据
  onBeforeUnmount(() => {
    clearStorage()
  })

  return {
    data,
    clear: clearStorage,
    save: saveToStorage,
    load: loadFromStorage,
  }
}
`;export{n as default};

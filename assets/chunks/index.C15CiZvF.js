const e=`import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export interface PageStorageOptions {
  key?: string // 自定义存储键名
  immediate?: boolean // 是否立即从存储中恢复数据
}

export function usePageStorage<T>(initialValue: T, options: PageStorageOptions = {}) {
  const route = useRoute()
  const data = ref<T>(initialValue)

  // 生成唯一的存储键，结合路由路径确保不同页面数据隔离
  const storageKey = \`page_storage_\${options.key || route.path}\`

  // 获取存储的时间戳键
  // const timestampKey = \`\${storageKey}_timestamp\`

  // 存储数据和时间戳
  const saveToStorage = (value: T) => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(value))
      // sessionStorage.setItem(timestampKey, Date.now().toString())
    }
    catch (e) {
      console.error('Failed to save page storage:', e)
    }
  }

  // 从存储中恢复数据
  const loadFromStorage = () => {
    try {
      // const timestamp = sessionStorage.getItem(timestampKey)
      const stored = sessionStorage.getItem(storageKey)

      // if (!timestamp || !stored)
      //   return
      if (!stored)
        return

      // 检查数据是否过期（24小时后自动失效）
      // const expired = Date.now() - Number.parseInt(timestamp) > 24 * 60 * 60 * 1000
      // if (expired) {
      //   clearStorage()
      //   return
      // }

      data.value = JSON.parse(stored)
    }
    catch (e) {
      console.error('Failed to load page storage:', e)
    }
  }

  // 清除存储的数据
  const clearStorage = () => {
    sessionStorage.removeItem(storageKey)
    // sessionStorage.removeItem(timestampKey)
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
    if (options.immediate !== false)
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
`;export{e as default};

# useUrlData

一个用于处理 URL 查询参数的 Vue Composable。它提供了一种简单的方式来读取、更新和管理 URL 查询参数。

## 特性

- 自动类型转换（支持数组和数字类型）
- 支持默认值
- 响应式查询参数
- 自动 URL 同步
- 支持浏览器前进/后退操作

## 使用方法
```ts
import { useUrlData } from '@your-package/components'
// 基础用法
const { urlData, setUrlParam, resetUrlDataUrlData, removeUrlParam } = useUrlData()
// 设置查询参数
urlData.value = {
  name: 'test', // 普通字符串
  age: 18, // 数字类型
  tags: ['vue'], // 数组类型
  status: [1, 2, 3] // 数组类型
}
// URL 结果：
// ?name=test&agenum=18&tags_arr=vue&statusarr=1,2,3
```
## API

### 参数

#### UseQueryOptions

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| defaults | `Record<string, any>` | `{}` | 默认的查询参数值 |

### 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| urlData | `Ref<Record<string, any>>` | 响应式的查询参数对象 |
| setUrlParam | `(key: string, value: any) => void` | 更新单个查询参数 |
| resetUrlData | `() => void` | 重置查询参数到默认值 |
| removeUrlParam | `(key: string) => void` | 移除指定的查询参数 |

### 类型转换规则

查询参数会根据值的类型自动添加后缀标识：

- 数组类型：添加 `__arr` 后缀
  ```ts
  // 代码：{ tags: ['vue'] }
  // URL：tags__arr=vue

  // 代码：{ status: [1, 2, 3] }
  // URL：status__arr=1,2,3
  ```

- 数字类型：添加 `__num` 后缀
  ```ts
  // 代码：{ age: 18 }
  // URL：age__num=18
  ```

- 字符串类型：无后缀
  ```ts
  // 代码：{ name: 'test' }
  // URL：name=test
  ```

## 示例

### 基础用法
```ts
const { urlData } = useUrlData()
// 设置查询参数
urlData.value = {
  search: 'vue',
  page: 1,
  tags: ['frontend']
}
```

### 使用默认值
```ts
const { urlData } = useUrlData({
  defaults: {
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt'
  }
})
```
### 更新单个参数
```ts
const { setUrlParam } = useUrlData()
// 更新页码
setUrlParam('page', 2)
// 更新标签
setUrlParam('tags', ['vue', 'react'])
```

### 重置和移除参数
```ts
const { resetUrlData, removeUrlParam } = useUrlData()
// 重置所有参数到默认值
resetUrlData()
// 移除特定参数
removeUrlParam('search')
```

## 注意事项

1. 该 hooks 仅在浏览器环境中工作，如果需要 SSR 支持，需要额外处理。
2. URL 中的查询参数会自动添加类型标识后缀（`__num`、`__arr`），这是为了确保类型信息的准确传递。
3. 当使用浏览器的前进/后退按钮时，查询参数会自动同步。

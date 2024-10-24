# useSelection

一个用于管理列表多选状态的 Hook。

- 管理选中状态
- 支持全选/取消全选
- 支持单个选择/取消选择
- 自动判断全选/部分选中状态
- 支持自定义 rowKey
- 支持默认选中项

## 基础用法

<demo src="@/composables/useSelection/demos/demo.vue" />

## API

### 参数

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 数据源, 仅用于比对是否全部选中 | `(string \| number \| Record<string, any>)[]` | `[]` |
| rowKey | 行数据的唯一键字段名或获取函数，仅data为`Record<string, any>[]`时有效 | `string \| ((row: T) => string \| number)` | `'id'` |
| defaultSelected | 默认选中的键值数组 | `(string \| number)[]` | `[]` |

### 返回值

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| selectedKeys | 已选择的键值数组 | `Ref<(string \| number)[]>` |
| isAllSelected | 是否全选 | `ComputedRef<boolean>` |
| isPartialSelected | 是否部分选中 | `ComputedRef<boolean>` |
| toggleSelect | 切换选择单个项目 | `(row: T, selected?: boolean) => void` |
| toggleSelectAll | 切换选择全部 | `(selected?: boolean) => void` |
| isSelected | 判断某项是否被选中 | `(row: T) => boolean` |

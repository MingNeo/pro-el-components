# Select
基于element-plus的Select组件二次封装。扩充以下功能：

- 设置service，自动获取全量数据
- 设置viewMode，用于详情页等回显模式

<script setup>
  import Demo1 from '@/components/Select/demos/demo1.vue'
  import Demo1Code from '@/components/Select/demos/demo1.vue?raw'
</script>
<demo :comp="Demo1" :code="Demo1Code" title="基础使用" />

## 使用方法

## API
继承自element-plus的Select组件，以下为差异的API
| 参数     | 说明                   | 类型                   | 默认值  |
| -------- | ---------------------- | ---------------------- | ------- |
| service  | 获取全量数据的service  | `() => Promise<any[]>` | -       |
| viewMode | 是否为详情页等回显模式 | `boolean`              | `false` |

## 事件

| 事件   | 说明                       | 类型                                                                   |
| ------ | -------------------------- | ---------------------------------------------------------------------- |
| change | 选中值发生变化时的回调函数 | `(selectedValue: Id[] \| Array<Id[]>, selectedOptions: any[]) => void` |

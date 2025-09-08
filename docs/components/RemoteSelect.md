# RemoteSelect
基于element-plus的Select组件二次封装。

- 专用于远程数据，且数据量较大，需要分页加载
- 设置service，自动获取分页数据
- 设置fillBackService，用于详情页等回显模式

<script setup>
  import Demo1 from '@/components/RemoteSelect/demos/demo1.vue'
  import Demo1Code from '@/components/RemoteSelect/demos/demo1.vue?raw'
</script>
<demo :comp="Demo1" :code="Demo1Code" title="基础用法" />

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

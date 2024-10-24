<script setup lang="ts">
interface PropsType {
  tabs: { name: string, id: string }[]
  activeKey?: string
}
const props = withDefaults(defineProps<PropsType>(), {
  activeKey: '1',
})
const emits = defineEmits(['update:activeKey'])
const activeKey = ref(props.activeKey)
const tabs = toRef(props, 'tabs')

watch(activeKey, (newValue: string) => {
  emits('update:activeKey', newValue)
})
</script>

<template>
  <div class="tabs-container" v-bind="$attrs">
    <el-tabs v-model:activeKey="activeKey">
      <el-tab-pane v-for="item in tabs" :key="item.id">
        <template #tab>
          <span>
            {{ item.name }}
            <apple-outlined />
          </span>
        </template>
        <slot name="tabContent" />
      </el-tab-pane>
      <template #rightExtra>
        <slot name="extraActions" />
      </template>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
  .tabs-container {
    background-color: #ffffff;
    // padding-inline: 20px;
    // padding-bottom: 10px;
  }
</style>

<script lang="ts" setup>
  defineProps<{
    showBack?: boolean
    title?: string
    actions?: any[]
    tabs?: string[]
    tabActiveKey?: number
  }>()

  const emit = defineEmits(['cancel', 'update:tabActiveKey'])

  const query = useQuery()

  function handleCancel() {
    emit('cancel')
  }

  function handleUpdateTabActiveKey(...args: any) {
    query.value = {}
    setTimeout(() => {
      emit('update:tabActiveKey', ...args)
    }, 100)
  }
</script>

<template>
  <div class="header t-page-header" v-bind="$attrs">
    <div class="title">
      <Icon v-if="showBack" icon="icon-park-outline:left" class="back-icon" @click="handleCancel" />
      <slot name="title">
        <div v-if="title" class="mr-[10px]">
          {{ title }}
        </div>

        <tabs v-if="tabs" :active-key="tabActiveKey" @update:active-key="handleUpdateTabActiveKey">
          <el-tab-pane v-for="(item, index) in tabs" :key="index" :tab="item" />
        </tabs>
      </slot>
    </div>

    <div class="text-right">
      <slot name="actions">
        <ButtonActions v-if="actions?.length" class="footer" :actions="actions" />
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .header {
    position: relative;
    z-index: 2;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 14px 24px;
    box-shadow: 0px 2px 6px -5px rgba(0, 0, 0, 0.04), 0px 2px 6px rgba(0, 0, 0, 0.06);

    .title {
      display: flex;
      align-items: center;
    }

    .back-icon {
      margin-right: 8px;
      cursor: pointer;
    }
  }
</style>

<style lang="scss">
  .pro-page-header {

    .ant-tabs-top>.ant-tabs-nav::before,
    .ant-tabs-bottom>.ant-tabs-nav::before,
    .ant-tabs-top>div>.ant-tabs-nav::before,
    .ant-tabs-bottom>div>.ant-tabs-nav::before {
      display: none
    }

    .ant-tabs-top>.ant-tabs-nav,
    .ant-tabs-bottom>.ant-tabs-nav,
    .ant-tabs-top>div>.ant-tabs-nav,
    .ant-tabs-bottom>div>.ant-tabs-nav {
      margin: 0;
    }
  }
</style>

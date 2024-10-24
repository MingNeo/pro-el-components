<script setup lang="ts">
  defineOptions({ inheritAttrs: false })

  const props = defineProps(['title', 'actions', 'style', 'showIcon'])

  const attrs = useAttrs()
</script>

<template>
  <div class="common-section-header" :style="style" v-bind="$attrs">
    <div class="common-section-header-left" :class="{ 'cursor-pointer': !!attrs.onClick }" @click="attrs.onClick">
      <slot name="title">
        <div v-if="props.showIcon ?? true" class="common-section-header-icon" />
        <div class="common-section-header-title">
          {{ title || '' }}
        </div>
      </slot>
      <slot name="leftExtra" />
    </div>
    <div class="common-section-header-right">
      <ButtonActions :actions="actions" />
      <slot name="actions" />
    </div>
  </div>
</template>

<style lang="scss">
  .common-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .common-section-header-left,
    .common-section-header-right {
      display: flex;
      align-items: center;

      &>* {
        margin-right: 8px;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    &-icon {
      width: 4px;
      height: 10px;
      border-radius: 5px 0 5px 0;
      background: linear-gradient(181.09deg, #007AFF 48.27%, rgba(0, 87, 255, 0.38) 95.6%);
    }

    &-title {
      font-size: 16px;
      line-height: 24px;
    }
  }
</style>

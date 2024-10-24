<script lang="ts" setup>
  defineOptions({ inheritAttrs: false })

  provide('isInListPageContent', true)
</script>

<template>
  <div class="pro-list-page-content w-full bg-white px-[16px] pt-0 pb-[14px] shadow-[0px_4px_2px_-1px_rgba(0,0,0,0.06)] rounded-2">
    <section-header class="h-[50px] mb-0" v-bind="$attrs">
      <template #icon>
        <slot name="icon" />
      </template>
      <template #title>
        <slot name="title" />
      </template>
      <template #leftExtra>
        <slot name="leftExtra" />
      </template>
      <template #actions>
        <slot name="actions" />
      </template>
    </section-header>

    <slot />
    </section-header>
  </div>
</template>

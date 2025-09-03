<script setup lang="ts">
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import './style.css'

interface MenuItem {
  key: string
  title: string
  path?: string
  children?: MenuItem[]
}

defineOptions({
  name: 'ProSideBar',
})

const props = defineProps<{
  menus: MenuItem[]
  selectedKey: string
  openKeys: string[]
  collapsed: boolean
}>()
</script>

<template>
  <div class="pro-sidebar-container">
    <div class="sidebar-menu-container">
      <ElMenu
        :default-active="props.selectedKey"
        :default-openeds="props.openKeys"
        class="sidebar-menu"
        :collapse="props.collapsed"
        v-bind="$attrs"
      >
        <template v-for="(item) in props.menus">
          <ElSubMenu v-if="item.children" :key="`sub-menu-${item.key}`" :index="item.key">
            <template #title>
              {{ item.title }}
            </template>
            <ElMenuItem v-for="(subItem) in item.children" :key="subItem.key" @click="subItem.path && $router.push(subItem.path)">
              {{ subItem.title }}
            </ElMenuItem>
          </ElSubMenu>
          <ElMenuItem v-else :key="item.key" @click="item.path && $router.push(item.path)">
            <span>{{ item.title }}</span>
          </ElMenuItem>
        </template>
      </ElMenu>
    </div>
  </div>
</template>

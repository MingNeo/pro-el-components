const n=`<script setup lang="ts">
import { Star } from '@element-plus/icons-vue'
import { ElIcon, ElMessage } from 'element-plus'
import SectionHeader from '../index.vue'

const actions: any[] = [
  {
    text: '新增',
    type: 'primary',
    onClick: () => {
      ElMessage('点击新增')
    },
  },
  {
    text: '刷新',
    onClick: () => {
      ElMessage('点击刷新')
    },
  },
]
<\/script>

<template>
  <div class="space-y-8 p-2">
    <!-- 基础用法 -->
    <SectionHeader
      title="基础标题"
      :actions="actions"
    />

    <!-- 带副标题 -->
    <SectionHeader
      title="带副标题的标题"
      subtitle="这是一段副标题描述文本"
      :actions="actions"
      bordered
    />

    <!-- 不同尺寸 -->
    <SectionHeader
      title="小尺寸"
      size="small"
      :actions="actions"
    />

    <!-- 自定义插槽 -->
    <SectionHeader :actions="actions">
      <template #left>
        <div class="flex items-center gap-2">
          <ElIcon class="text-yellow-500">
            <Star />
          </ElIcon>
          <span>自定义左侧内容</span>
        </div>
      </template>
      <template #right>
        <div>
          自定义右侧内容
        </div>
      </template>
    </SectionHeader>
  </div>
</template>
`;export{n as default};

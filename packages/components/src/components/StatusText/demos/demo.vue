<script setup lang="ts">
import StatusText from '../index.vue'
</script>

<template>
  <div class="p-5 bg-gray-100 rounded-lg text-gray-800">
    <h5 class="mt-5 mb-2.5 text-gray-500">
      基础用法
    </h5>
    <div class="flex gap-2">
      <StatusText status="normal" text="准备状态" />
      <StatusText status="success" text="成功状态" />
      <StatusText status="error" text="错误状态" />
      <StatusText status="warning" text="警告状态" />
    </div>

    <h5 class="mt-5 mb-2.5 text-gray-500">
      尺寸
    </h5>
    <div class="flex gap-2">
      <StatusText status="success" text="小尺寸" size="small" />
      <StatusText status="success" text="默认尺寸" />
      <StatusText status="success" text="大尺寸" size="large" />
    </div>

    <h5 class="mt-5 mb-2.5 text-gray-500">
      线状效果
    </h5>
    <div class="flex gap-2">
      <StatusText status="success" text="线状成功" mode="line" />
      <StatusText status="error" text="线状错误" mode="line" />
      <StatusText status="warning" text="线状警告" mode="line" />
    </div>

    <h5 class="mt-5 mb-2.5 text-gray-500">
      填充效果
    </h5>
    <div class="flex gap-2">
      <StatusText status="success" text="填充成功" mode="filled" />
      <StatusText status="error" text="填充错误" mode="filled" />
      <StatusText status="warning" text="填充警告" mode="filled" />
    </div>

    <h5 class="mt-5 mb-2.5 text-gray-500">
      胶囊样式
    </h5>
    <div class="flex gap-2">
      <StatusText status="success" text="成功" mode="pill" />
      <StatusText status="warning" text="警告" mode="pill" />
      <StatusText status="error" text="错误" mode="pill" />
    </div>

    <h5 class="mt-5 mb-2.5 text-gray-500">
      渐变效果
    </h5>
    <div class="flex gap-2">
      <StatusText status="success" text="渐变成功" mode="gradient" />
      <StatusText status="error" text="渐变错误" mode="gradient" />
      <StatusText status="warning" text="渐变警告" mode="gradient" />
    </div>

    <h5 class="mt-5 mb-2.5 text-gray-500">
      发光效果
    </h5>
    <div class="flex gap-2">
      <StatusText status="processing" text="发光处理中" mode="glow" />
      <StatusText status="success" text="发光成功" mode="glow" />
    </div>

    <h5 class="mt-5 mb-2.5 text-gray-500">
      动画效果
    </h5>
    <div class="flex gap-2">
      <StatusText status="processing" text="脉冲动画" animation="pulse" />
      <StatusText status="success" text="波浪动画" animation="wave" />
    </div>
  </div>
</template>

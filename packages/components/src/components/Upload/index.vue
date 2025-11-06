<script lang="ts" setup>
import type { UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ElButton, ElDialog, ElIcon, ElUpload } from 'element-plus'
import { ref } from 'vue'
import './style.css'

defineOptions({
  name: 'ProUpload',
})

defineProps<{
  buttonText?: string
}>()

const previewUrl = ref('')
const previewShow = ref(false)

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  previewUrl.value = uploadFile.url!
  previewShow.value = true
}
</script>

<template>
  <ElUpload
    class="pro-upload"
    v-bind="$attrs"
    :on-preview="$attrs.onPreview || handlePictureCardPreview"
  >
    <template v-if="$attrs.listType === 'text'">
      <ElIcon><Plus /></ElIcon>
    </template>
    <template v-else>
      <ElButton class="pro-upload_button">
        <ElIcon><Plus /></ElIcon>
        <span>{{ buttonText || '上传' }}</span>
      </ElButton>
    </template>
  </ElUpload>

  <ElDialog v-model="previewShow" class="pro-upload_preview-dialog">
    <img class="pro-upload_preview-image" :src="previewUrl" alt="">
  </ElDialog>
</template>

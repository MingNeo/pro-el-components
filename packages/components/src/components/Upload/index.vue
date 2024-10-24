<script lang="ts" setup>
import type { UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ElDialog, ElIcon, ElUpload } from 'element-plus'
import { ref } from 'vue'

interface ProUpload extends Partial<UploadProps> {
}

defineOptions({
  name: 'ProUpload',
})

const props = withDefaults(defineProps<ProUpload>(), {
  listType: 'picture-card',
})

const previewUrl = ref('')
const previewShow = ref(false)

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  previewUrl.value = uploadFile.url!
  previewShow.value = true
}
</script>

<template>
  <ElUpload
    v-bind="props"
    :on-preview="props.onPreview || handlePictureCardPreview"
  >
    <ElIcon><Plus /></ElIcon>
  </ElUpload>

  <ElDialog v-model="previewShow">
    <img w-full :src="previewUrl" alt="Preview Image">
  </ElDialog>
</template>

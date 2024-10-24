<script lang="ts" setup>
  import { ref } from 'vue'
  import { Plus } from '@element-plus/icons-vue'
  import type { UploadProps, UploadUserFile } from 'element-plus'

  interface ProUpload extends UploadProps {
  }

  const props = defineProps<ProUpload>()

  const dialogImageUrl = ref('')
  const dialogVisible = ref(false)

  const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
  }
</script>

<template>
  <el-upload
    list-type="picture-card"
    v-bind="props"
    :on-preview="props.onPreview || handlePictureCardPreview"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image">
  </el-dialog>
</template>

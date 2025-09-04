const e=`<script lang="ts" setup>
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElDialog, ElIcon, ElImage, ElMessage, ElUpload } from 'element-plus'
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  modelValue?: string | string[]
  viewMode?: boolean
  multiple?: boolean // 是否支持多图片上传
  maxSize?: number // 单位MB
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const fileList = ref<UploadUserFile[]>([])

// 将已有的图片URL转换为文件列表
watchEffect(() => {
  if (props.modelValue) {
    const urls = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
    fileList.value = urls.map(url => ({
      name: url.split('/').pop() || '',
      url,
    }))
  }
  else {
    fileList.value = []
  }
})

// 上传前验证
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }

  if (props.maxSize) {
    const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize
    if (!isLtMaxSize) {
      ElMessage.error(\`图片大小不能超过 \${props.maxSize}MB!\`)
      return false
    }
  }

  return true
}

// 处理上传成功
function handleSuccess(response: any) {
  // 这里假设服务器返回的是 {url: 'xxx'} 格式
  const imageUrl = response.url
  const newValue = props.multiple
    ? [...(Array.isArray(props.modelValue) ? props.modelValue : []), imageUrl]
    : imageUrl

  emit('update:modelValue', newValue)
  emit('change', newValue)
}

// 处理删除
function handleRemove(file: UploadUserFile) {
  const urls = fileList.value
    .filter(f => f.url !== file.url)
    .map(f => f.url)

  emit('update:modelValue', props.multiple ? urls : urls[0])
  emit('change', props.multiple ? urls : urls[0])
}

// 预览大图
const previewVisible = ref(false)
const previewUrl = ref('')

function handlePreview(file: UploadUserFile) {
  previewUrl.value = file.url || ''
  previewVisible.value = true
}
<\/script>

<template>
  <div class="image-uploader-field">
    <!-- 查看模式 -->
    <template v-if="viewMode">
      <div class="image-preview-list">
        <div
          v-for="file in fileList"
          :key="file.url"
          class="image-preview-item"
          @click="handlePreview(file)"
        >
          <ElImage
            :src="file.url || ''"
            fit="cover"
            :preview-src-list="[file.url || '']"
          />
        </div>
      </div>
    </template>

    <!-- 编辑模式 -->
    <template v-else>
      <ElUpload
        :file-list="fileList"
        :multiple="multiple"
        action="/api/upload"
        list-type="picture-card"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
        :on-preview="handlePreview"
      >
        <ElIcon><Plus /></ElIcon>
      </ElUpload>

      <!-- 图片预览弹窗 -->
      <ElDialog v-model="previewVisible" title="预览">
        <img :src="previewUrl" style="width: 100%">
      </ElDialog>
    </template>
  </div>
</template>

<style scoped>
  .image-uploader-field {
    width: 100%;
  }

  .image-preview-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .image-preview-item {
    width: 100px;
    height: 100px;
    cursor: pointer;
  }

  .image-preview-item :deep(.el-image) {
    width: 100%;
    height: 100%;
  }
</style>
`;export{e as default};

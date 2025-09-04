const n=`<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRequest } from '@/composables/useRequest'
import { useUrlData } from '@/composables/useUrlData'
import DetailPage from '../index.vue'

const { urlData } = useUrlData()
const { data, isLoading, execute } = useRequest(getRegionInfoById, { immediate: false })

const viewMode = ref(!!(urlData as any).viewMode)
const detailFields = computed(() => [
  {
    label: '编码',
    prop: 'regionCode',
    required: true,
  },
  {
    label: '名称',
    prop: 'regionName',
  },
  {
    label: '简称',
    prop: 'regionShortName',
  },
  {
    label: '别名',
    prop: 'regionAlias',
  },
  {
    label: '时区',
    prop: 'timeZone',
  },
  {
    label: '语言',
    prop: 'regionLanguage',
  },
  {
    label: '币种',
    prop: 'currencyName',
  },
])

onMounted(() => {
  execute(urlData.value.id as any)
})

function handleOk() {
  // router.back()
}

function handleBack() {
  // 如果绑定了back事件回调，则使用绑定的回调
  // 如果不绑定back事件回调时，则默认使用history.back()返回
}
<\/script>

<script lang="ts">
// mock 请求
async function getRegionInfoById(_params: Record<string, any>) {
  return {
    id: 1,
    regionCode: '1',
    currencyName: '人民币',
  }
}
<\/script>

<template>
  <el-switch v-model="viewMode" class="mb-2" active-text="预览" inactive-text="编辑" />
  <DetailPage
    :loading="isLoading"
    :view-mode="viewMode"
    :default-value="data"
    :fields="detailFields"
    :title="data?.id ? \`编辑国家(地区)\` : \`创建国家(地区)\`"
    :create-service="(values) => console.log('createService', values)"
    :update-service="(values) => console.log('updateService', values)"
    @ok="handleOk"
    @back="handleBack"
  />
</template>
`;export{n as default};

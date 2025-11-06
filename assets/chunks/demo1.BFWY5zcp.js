const e=`<script setup lang="ts">
import { ElRadioButton, ElRadioGroup } from 'element-plus'
import { computed, ref } from 'vue'
import DetailPage from '../index.vue'
import * as api from './api'

const mode = ref<'create' | 'edit' | 'detail'>('create')
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

function handleOk() {
  // router.back()
}

function handleBack() {
  // 如果绑定了back事件回调，则使用绑定的回调
  // 如果不绑定back事件回调时，则默认使用history.back()返回
}
<\/script>

<template>
  <ElRadioGroup v-model="mode" class="p-2" size="small">
    <ElRadioButton label="新建" value="create" />
    <ElRadioButton label="编辑" value="edit" />
    <ElRadioButton label="查看" value="detail" />
  </ElRadioGroup>
  <DetailPage
    :type="mode"
    :fields="detailFields"
    :get-data-service="api.getRegionInfo"
    :title="(mode) => \`\${{ create: '创建', edit: '编辑', detail: '查看' }[mode]}国家(地区)\`"
    :create-service="(values) => api.createRegion(values)"
    :update-service="(values) => api.updateRegion(values)"
    @ok="handleOk"
    @back="handleBack"
  />
</template>
`;export{e as default};

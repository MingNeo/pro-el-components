const e=`<script setup lang="ts">
import { ElSwitch } from 'element-plus'
import { computed, ref } from 'vue'
import DetailPage from '../index.vue'

const viewMode = ref(false)
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
  <ElSwitch v-model="viewMode" class="p-2" active-text="查看" inactive-text="编辑" />
  <DetailPage
    :title="(type) => \`\${{ create: '创建', edit: '编辑', detail: '查看' }[type]}国家(地区)\`"
    :view-mode="viewMode"
    :fields="detailFields"
    :get-data-service="getRegionInfoById"
    :create-service="(values) => console.log('createService', values)"
    :update-service="(values) => console.log('updateService', values)"
    @ok="() => console.log('ok')"
    @back="() => console.log('back')"
  />
</template>
`;export{e as default};

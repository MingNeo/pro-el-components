const n=`<script lang="ts" setup>
import { ElButton, ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import ModalDetail from '../index.vue'

const mockData = {
  id: 1,
  currencyName: '人民币',
  currencySymbol: '¥',
  prefixPrice: '元',
}

const detailFields = computed(() => [
  {
    label: '币种',
    prop: 'currencyName',
    required: true,
  },
  {
    label: '符号',
    prop: 'currencySymbol',
  },
  {
    label: '单位',
    prop: 'prefixPrice',
  },
  {
    label: '简码',
    prop: 'currencyShortName',
  },
])

const modalInfo = ref({ visible: false, viewMode: false, data: {} as any })

function handleCreate() {
  modalInfo.value = { visible: true, viewMode: false, data: {} }
}

function handleEdit() {
  modalInfo.value = { visible: true, viewMode: false, data: mockData }
}

function handleDetail() {
  modalInfo.value = { visible: true, viewMode: true, data: mockData }
}

function onEditSubmit(_value: any) {
  ElMessage.success('onOk')
}
<\/script>

<template>
  <div class="p-2">
    <ElButton @click="handleCreate">
      创建货币
    </ElButton>
    <ElButton @click="handleEdit">
      编辑货币
    </ElButton>
    <ElButton @click="handleDetail">
      查看货币详情
    </ElButton>
  </div>
  <ModalDetail
    :key="modalInfo.data?.id"
    v-model="modalInfo.visible"
    :default-value="modalInfo.data"
    :view-mode="modalInfo.viewMode"
    :fields="detailFields"
    :title="{ edit: '编辑货币', create: '创建货币', detail: '查看货币详情' }"
    :width="700"
    :create-service="(values) => { }"
    :update-service="(values) => { }"
    @ok="onEditSubmit"
  />
</template>
`;export{n as default};

<script lang="ts" setup>
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
      name: 'currencyName',
      required: true,
    },
    {
      label: '符号',
      name: 'currencySymbol',
    },
    {
      label: '单位',
      name: 'prefixPrice',
    },
    {
      label: '简码',
      name: 'currencyShortName',
    },
  ])

  const modalInfo = ref({ visible: false, viewMode: false, data: {} })

  // function handleCreate() {
  //   modalInfo.value = { visible: true, data: {} }
  // }

  function handleEdit() {
    modalInfo.value = { visible: true, data: mockData }
  }

  function handleDetail() {
    modalInfo.value = { visible: true, viewMode: true, data: mockData }
  }

  function onEditSubmit(_value: any) {
    ElMessage.success('onOk')
  }
</script>

<template>
  <button-actions>
    <el-button @click="modalInfo = { visible: true }">
      创建货币
    </el-button>
    <el-button @click="handleEdit">
      编辑货币
    </el-button>
    <el-button @click="handleDetail">
      查看货币详情
    </el-button>
  </button-actions>
  {{ modalInfo }}
  <ModalDetail
    :key="modalInfo.data?.id"
    v-model:visible="modalInfo.visible"
    :default-value="modalInfo.data"
    :view-mode="modalInfo.viewMode"
    :fields="detailFields"
    title="货币"
    :width="700"
    :create-service="(values) => { }"
    :update-service="(values) => { }"
    @ok="onEditSubmit"
  />
</template>

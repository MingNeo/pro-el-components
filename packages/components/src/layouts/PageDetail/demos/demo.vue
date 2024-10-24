<script setup lang="ts">
  import useQuery from '@/composables/useQuery'
  import useRequest from '@/composables/useRequest'

  const query = useQuery().value
  const { data, isLoading, execute } = useRequest(getRegionInfoById, { immediate: false })

  const detailFields = computed(() => [
    {
      label: '编码',
      name: 'regionCode',
      required: true,
    },
    {
      label: '名称',
      name: 'regionName',
    },
    {
      label: '简称',
      name: 'regionShortName',
    },
    {
      label: '别名',
      name: 'regionAlias',
    },
    {
      label: '时区',
      name: 'timeZone',
    },
    {
      label: '语言',
      name: 'regionLanguage',
    },
    {
      label: '币种',
      name: 'currency.currencyName',
    },
  ])

  onMounted(() => {
    execute(query.id as any)
  })

  function handleOk() {
    // router.back()
  }

  async function handleCancel(id: number) {
    // router.back()
  }
</script>

<script lang="ts">
  // mock 请求
  async function getRegionInfoById(_params: Record<string, any>) {
    return {
      gender: '男',
      name: '小明',
      nickname: '用户',
      phone: '132xxxxxxxxx',
      userId: 1,
    }
  }
</script>

<template>
  <page-detail
    :loading="isLoading"
    :view-mode="!!query.viewMode"
    :default-value="data"
    :fields="detailFields"
    :title="data?.id ? `编辑国家(地区)` : `创建国家(地区)`"
    :create-service="(values) => console.log('createService', values)"
    :update-service="(values) => console.log('updateService', values)"
    @ok="handleOk"
    @cancel="handleCancel"
  />
</template>

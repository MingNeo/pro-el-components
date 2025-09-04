const n=`<script setup lang="ts">
import { ref } from 'vue'
import RemoteSelect from '../index.vue'

const value1 = ref(undefined)
const value2 = ref([0, 1])
const value3 = ref(undefined)
const value4 = ref(1)
const value5 = ref(1)

async function mockService(params: Record<string, any>) {
  // 模拟异步请求
  await new Promise(resolve => setTimeout(resolve, 100))

  const list = Array.from({ length: 10 }).map((_, index) => ({
    id: index + (params.pageNo - 1) * 10,
    name: \`选项\${index + (params.pageNo - 1) * 10}\`,
  }))

  return {
    total: 100,
    data: list,
  }
}

async function mockFillBackService(ids: number[]) {
  return ids.map(id => ({
    id,
    name: \`选项\${id}\`,
  }))
}
<\/script>

<template>
  <div class="space-y-4 p-4">
    <div>
      <p class="mb-2">
        基础用法:
      </p>
      <RemoteSelect
        v-model="value1"
        :service="mockService"
        style="width: 200px"
      />
    </div>

    <div>
      <p class="mb-2">
        多选模式:
      </p>
      <RemoteSelect
        v-model="value2"
        :service="mockService"
        multiple
        style="width: 200px"
      />
    </div>

    <div>
      <p class="mb-2">
        本地搜索:
      </p>
      <RemoteSelect
        v-model="value3"
        :service="mockService"
        filterable
        :search-in-local="true"
        style="width: 200px"
      />
    </div>

    <div>
      <p class="mb-2">
        远程搜索:
      </p>
      <RemoteSelect
        v-model="value4"
        :service="mockService"
        filterable
        style="width: 200px"
      />
    </div>

    <div>
      <p class="mb-2">
        回显模式:
      </p>
      <RemoteSelect
        v-model="value4"
        :service="mockService"
        :fill-back-service="mockFillBackService"
        style="width: 200px"
      />
    </div>

    <div>
      <p class="mb-2">
        只读模式:
      </p>
      <RemoteSelect
        v-model="value5"
        :service="mockService"
        :view-mode="true"
        style="width: 200px"
      />
    </div>
  </div>
</template>
`;export{n as default};

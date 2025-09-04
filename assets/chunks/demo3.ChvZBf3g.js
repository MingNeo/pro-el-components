const e=`<script setup>
import { DeleteFilled } from '@element-plus/icons-vue'
import { ElButton, ElCard, ElForm, ElIcon, ElSwitch } from 'element-plus'
import { computed, ref } from 'vue'
import ProFormFields from '../index.vue'

const data = ref({
  users: [{
    name: '',
    gender: 'female',
    phone: '13222222222',
  }],
})

const viewMode = ref(false)
const formRef = ref()

const fields = computed(() => [
  {
    label: '姓名',
    prop: 'name',
    type: 'input',
    required: true,
  },
  {
    label: '电话',
    prop: 'phone',
    type: 'input',
  },
  {
    label: '性别',
    prop: 'gender',
    type: 'select',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
])

function removeUser(index) {
  data.value.users.splice(index, 1)
}

function addUser() {
  formRef.value.validate()
  setTimeout(() => {
    data.value.users.push({})
  }, 100)
}

function handleSubmit() {
  formRef.value.validate()
}
<\/script>

<template>
  <ElCard header="动态多行表单">
    <ElSwitch v-model="viewMode" class="mb-2" active-text="预览" inactive-text="编辑" />
    <ElForm ref="formRef" :model="data">
      <div
        v-for="(user, index) in data.users"
        :key="index"
        class="flex justify-between items-center"
      >
        <!-- 深层嵌套需要使用propPrefix来为内部的formItem绑定不同的表单项 -->
        <ProFormFields
          v-model="data.users[index]"
          class="flex-1"
          :prop-prefix="['users', index]"
          :column="3"
          :view-mode="viewMode"
          :fields="fields"
        />
        <ElIcon v-if="!viewMode" class="ml-[20px] h-[32px] leading-[32px] mb-[18px]" @click="removeUser(index)">
          <DeleteFilled />
        </ElIcon>
      </div>
      <ElButton v-if="!viewMode" @click="addUser">
        Add
      </ElButton>
      <ElButton v-if="!viewMode" type="primary" @click="handleSubmit">
        submit
      </ElButton>
    </ElForm>
    <h5 class="mt-4">
      FormData:
    </h5>
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
  </ElCard>
</template>
`;export{e as default};

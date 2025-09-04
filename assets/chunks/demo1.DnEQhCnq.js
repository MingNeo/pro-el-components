const e=`<script lang="ts" setup>
import { ElFormItem, ElSwitch } from 'element-plus'
import { ref } from 'vue'
import ProField from '../index.vue'

const textValue = ref('')
const numberValue = ref(0)
const dateValue = ref('')
const dateRangeValue = ref([])
const selectValue = ref(null)
const multipleSelectValue = ref(null)
const rateValue = ref(null)
const radioValue = ref(null)
const checkboxValue = ref([])
const colorValue = ref(null)
const cascaderValue = ref(null)
const imageValue = ref('https://picsum.photos/200/300?random=1')
const fileValue = ref([{
  name: '文件1',
  url: 'https://picsum.photos/200/300?random=1',
}])
const viewMode = ref(false)
<\/script>

<template>
  <div class="demo-container">
    <ElSwitch v-model="viewMode" active-text="预览" inactive-text="编辑" />
    <ElFormItem label="文本" prop="text">
      <ProField
        v-model="textValue"
        value-type="input"
        :view-mode="viewMode"
        :field-props="{ placeholder: '请输入文本' }"
      />
    </ElFormItem>

    <ElFormItem label="数字" prop="number">
      <ProField
        v-model="numberValue"
        value-type="number"
        :view-mode="viewMode"
        :field-props="{ placeholder: '请输入数字' }"
      />
    </ElFormItem>

    <ElFormItem label="密码" prop="password">
      <ProField
        v-model="textValue"
        value-type="password"
        :view-mode="viewMode"
        :field-props="{ placeholder: '请输入密码' }"
      />
    </ElFormItem>

    <ElFormItem label="日期" prop="date">
      <ProField
        v-model="dateValue"
        value-type="date"
        :view-mode="viewMode"
        :field-props="{ placeholder: '请选择日期' }"
      />
    </ElFormItem>

    <ElFormItem label="日期区间" prop="date">
      <ProField
        v-model="dateRangeValue"
        value-type="dateRange"
        :view-mode="viewMode"
        :field-props="{ placeholder: '请选择日期' }"
      />
    </ElFormItem>

    <ElFormItem label="单选" prop="select">
      <ProField
        v-model="selectValue"
        value-type="select"
        :view-mode="viewMode"
        :field-props="{
          placeholder: '请选择',
          options: [
            { label: '选项1', value: 1 },
            { label: '选项2', value: 2 },
          ],
        }"
      />
    </ElFormItem>

    <ElFormItem label="多选" prop="select">
      <ProField
        v-model="multipleSelectValue"
        value-type="select"
        :view-mode="viewMode"
        :field-props="{
          placeholder: '请选择',
          multiple: true,
          options: [
            { label: '选项1', value: 1 },
            { label: '选项2', value: 2 },
          ],
        }"
      />
    </ElFormItem>

    <ElFormItem label="评分" prop="rate">
      <ProField
        v-model="rateValue"
        value-type="rate"
        :view-mode="viewMode"
      />
    </ElFormItem>

    <ElFormItem label="单选" prop="radio">
      <ProField
        v-model="radioValue"
        value-type="radio"
        :view-mode="viewMode"
        :field-props="{ options: [{ label: '选项1', value: 1 }, { label: '选项2', value: 2 }] }"
      />
    </ElFormItem>

    <ElFormItem label="多选" prop="checkbox">
      <ProField
        v-model="checkboxValue"
        value-type="checkbox"
        :view-mode="viewMode"
        :field-props="{ options: [{ label: '选项1', value: 1 }, { label: '选项2', value: 2 }] }"
      />
    </ElFormItem>

    <ElFormItem label="颜色" prop="color">
      <ProField
        v-model="colorValue"
        value-type="color"
        :view-mode="viewMode"
      />
    </ElFormItem>

    <ElFormItem label="级联" prop="cascader">
      <ProField
        v-model="cascaderValue"
        value-type="cascader"
        :view-mode="viewMode"
      />
    </ElFormItem>

    <ElFormItem label="图片" prop="image">
      <ProField
        v-model="imageValue"
        value-type="image"
        :view-mode="viewMode"
      />
    </ElFormItem>

    <ElFormItem label="文件" prop="file">
      <ProField
        v-model="fileValue"
        value-type="file"
        :view-mode="viewMode"
      />
    </ElFormItem>
  </div>
</template>

<style scoped>
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
`;export{e as default};

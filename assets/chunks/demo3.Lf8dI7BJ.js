const e=`<script setup>
import { ref } from 'vue'
import SubmitTextarea from '../index.vue'

const value = ref('')
<\/script>

<template>
  <SubmitTextarea v-model="value" :min-height="60" :tool-in-bottom="true" />
</template>
`;export{e as default};

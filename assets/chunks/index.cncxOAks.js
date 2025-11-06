const n=`<script setup lang="ts">
import { ElButton, ElCheckbox, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus'
import { useSecondsCountdown } from 'pro-el-components'
import { reactive, ref } from 'vue'
import './style.css'

interface QuickLoginProps {
  /** 获取验证码的方法 */
  getCaptcha: () => Promise<any>
  /** 登录方法 */
  login: (values: Record<string, any>) => Promise<void>
  /** 倒计时时长（秒） */
  countdownDuration?: number
  /** 错误提示自定义文案 */
  errorMessages?: {
    captchaFailed?: string
    loginFailed?: string
  }
  /** 自定义类名 */
  className?: string
}

defineOptions({
  name: 'ProQuickLogin',
})

const props = withDefaults(defineProps<QuickLoginProps>(), {
  countdownDuration: 60,
  errorMessages: () => ({
    captchaFailed: '获取验证码失败！',
    loginFailed: '登录失败！',
  }),
  className: '',
})

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'captchaSent'): void
}>()

const formData = reactive({
  username: '',
  code: '',
  remember: false,
})

const rules = ref({
  username: [{
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  }],
  code: [{
    required: true,
    message: '请输入验证码',
    trigger: 'blur',
  }],
})

const { start, formattedTime, isCounting } = useSecondsCountdown(props.countdownDuration)
async function handleGetCaptcha() {
  start()
  try {
    await props.getCaptcha()
    emit('captchaSent')
  }
  catch (error: any) {
    return ElMessage.error(\`\${props.errorMessages.captchaFailed}\${error.message}\`)
  }
}

async function handleSubmit() {
  try {
    await props.login(formData)
    emit('success')
  }
  catch (error: any) {
    return ElMessage.error(\`\${props.errorMessages.loginFailed}\${error.message}\`)
  }
}
<\/script>

<template>
  <div class="pro-quick-login" :class="[props.className]">
    <slot name="header">
      <div class="quick-login__title">
        <slot name="title">
          登录
        </slot>
      </div>
    </slot>

    <ElForm
      :model="formData"
      class="quick-login__form"
      :rules="rules"
      @finish="handleSubmit"
    >
      <slot name="formHeader" />

      <ElFormItem prop="username">
        <slot name="usernameInput">
          <ElInput v-model="formData.username" placeholder="请输入账号" />
        </slot>
      </ElFormItem>

      <ElFormItem prop="code">
        <slot name="codeInput">
          <ElInput v-model="formData.code" show-password placeholder="验证码">
            <template #append>
              <slot name="captcha-button" :is-counting="isCounting" :time="formattedTime" :on-get-captcha="handleGetCaptcha">
                <div v-if="isCounting">
                  <span>{{ formattedTime }}秒后重发</span>
                </div>
                <div v-else class="captcha-button" @click="handleGetCaptcha">
                  <span>获取验证码</span>
                </div>
              </slot>
            </template>
          </ElInput>
        </slot>
      </ElFormItem>

      <ElFormItem>
        <slot name="submitButton">
          <ElButton :disabled="!formData.remember" class="quick-login__submit" type="primary" @click="handleSubmit">
            登录
          </ElButton>
        </slot>
      </ElFormItem>

      <slot name="agreement">
        <div class="quick-login__agreement">
          <ElCheckbox v-model="formData.remember" />
          <slot name="agreementText">
            我已阅读并同意 <a href="">《用户协议》</a> 和 <a href="">《隐私政策》</a>
          </slot>
        </div>
      </slot>

      <slot name="footer">
        <div class="quick-login__footer">
          <a href="">注册</a>
          <a href="">忘记密码</a>
        </div>
      </slot>
    </ElForm>
  </div>
</template>
`;export{n as default};

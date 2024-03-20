<script lang="tsx" setup>
import { onMounted, reactive, ref, unref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  ElButton,
  ElCheckbox,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElLink,
  ElRow
} from 'element-plus'
// import { useForm } from '@/hooks/web/useForm'
import { getCaptcha, getRouter, getUserInfo, loginApi } from '@/api/login'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import { Captcha, UserLoginType } from '@/api/login/types'

import { useUserStore } from '@/store/modules/user'

const rules = reactive<FormRules<UserLoginType>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captchaCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})
const emit = defineEmits(['to-register'])

const appStore = useAppStore()

const userStore = useUserStore()

const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push } = useRouter()

const captcha = ref<Captcha>({ enable: true })
const loadCaptcha = async () => {
  const { r, g, b, a } = appStore.getIsDark
    ? { r: 32, g: 35, b: 40, a: 200 }
    : { r: 255, g: 255, b: 255, a: 200 }
  const c = await getCaptcha(r, g, b, a, 120, 38)
  captcha.value = c.data
  form.captchaId = c.data.captchaId
}

const remember = ref(userStore.getRememberMe)

const initLoginInfo = async () => {
  const loginInfo = userStore.getLoginInfo
  if (loginInfo) {
    const { username, password } = loginInfo
    form.password = password
    form.username = username
  }
  await loadCaptcha()
}
onMounted(() => {
  initLoginInfo()
})

const loading = ref(false)

const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

const form = reactive<UserLoginType>({
  username: null,
  password: null,
  captchaCode: null,
  captchaId: null
})

const ruleFormRef = ref<FormInstance>()
// 登录
const login = async (formRef: FormInstance | undefined) => {
  if (!formRef) {
    return
  }
  await formRef.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      try {
        const res = await loginApi(form)

        if (res) {
          // 是否记住我
          if (unref(remember)) {
            userStore.setLoginInfo(form)
          } else {
            userStore.setLoginInfo(undefined)
          }
          userStore.setToken(res.data.token)
          userStore.setRememberMe(unref(remember))
          const userInfo = await getUserInfo()
          userStore.setUserInfo(userInfo.data)
          // 是否使用动态路由
          if (appStore.getDynamicRouter) {
            await getRoleRouter()
          } else {
            await permissionStore.generateRoutes('static').catch(() => {})
            permissionStore.getAddRouters.forEach((route) => {
              addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
            })
            permissionStore.setIsAddRouters(true)
            await push({ path: redirect.value || permissionStore.addRouters[0].path })
          }
        } else {
          await loadCaptcha()
        }
      } finally {
        loading.value = false
      }
    }
  })
}

// 获取角色信息
const getRoleRouter = async () => {
  if (appStore.getDynamicRouter && appStore.getServerDynamicRouter) {
    const res = await getRouter()
    if (res) {
      const routers = res.data || []
      userStore.setRoleRouters(routers)

      await permissionStore.generateRoutes('server', routers).catch(() => {})

      permissionStore.getAddRouters.forEach((route) => {
        addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
      })
      permissionStore.setIsAddRouters(true)
      await push({ path: redirect.value || permissionStore.addRouters[0].path })
    }
  }
}

// 去注册页面
const toRegister = () => {
  emit('to-register')
}
</script>

<template>
  <el-form
    size="large"
    label-position="top"
    hide-required-asterisk
    ref="ruleFormRef"
    :model="form"
    status-icon
    :rules="rules"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
  >
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item>
          <h2 class="text-2xl font-bold text-center w-[100%]">登录</h2>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item v-if="captcha.enable" label="验证码" prop="captchaCode">
          <div class="w-[70%] flex">
            <el-input v-model.number="form.captchaCode" />
          </div>
          <div class="w-[30%] flex">
            <img
              :src="captcha.imageBase64"
              @click="loadCaptcha"
              alt="captcha"
              style=" margin-left: 10px;border-radius: 3px"
            />
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item>
          <div class="flex justify-between items-center w-[100%]">
            <el-checkbox v-model="remember" label="记住我" size="small" />
            <el-link type="primary" :underline="false"> 忘记密码</el-link>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="login(ruleFormRef)" class="w-[100%]">
            登录
          </el-button>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item>
          <el-button class="w-[100%]" @click="toRegister">注册</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

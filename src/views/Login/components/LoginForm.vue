<script setup lang="tsx">
import { onMounted, reactive, ref, unref, watch } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCheckbox, ElInput, ElLink } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { getCaptcha, getRouter, getUserInfo, loginApi } from '@/api/login'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import { UserLoginType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { Icon } from '@/components/Icon'
import { useUserStore } from '@/store/modules/user'
import { BaseButton } from '@/components/Button'

const { required } = useValidator()

const emit = defineEmits(['to-register'])

const appStore = useAppStore()

const userStore = useUserStore()

const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push } = useRouter()

const { t } = useI18n()

const rules = {
  username: [required()],
  password: [required()],
  captchaCode: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="text-2xl font-bold text-center w-[100%]">{t('login.login')}</h2>
        }
      }
    }
  },
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: '请输入用户名'
    }
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: '请输入密码'
    }
  },
  {
    field: 'captchaCode',
    label: '验证码',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (formData) => {
          return (
            <>
              <div class="w-[70%] flex">
                <ElInput v-model={formData.captchaCode} placeholder={t('login.codePlaceholder')} />
              </div>
              <div class="w-[25%] flex" style="margin-left: 10px; height: 38px;">
                <img src={captchaImg.value} onClick={loadCaptcha} alt="captcha" />
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between items-center w-[100%]">
                <ElCheckbox v-model={remember.value} label={t('login.remember')} size="small" />
                <ElLink type="primary" underline={false}>
                  {t('login.forgetPassword')}
                </ElLink>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <BaseButton
                  loading={loading.value}
                  type="primary"
                  class="w-[100%]"
                  onClick={signIn}
                >
                  {t('login.login')}
                </BaseButton>
              </div>
              <div class="w-[100%] mt-15px">
                <BaseButton class="w-[100%]" onClick={toRegister}>
                  {t('login.register')}
                </BaseButton>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'other',
    component: 'Divider',
    label: t('login.otherLogin'),
    componentProps: {
      contentPosition: 'center'
    }
  },
  {
    field: 'otherIcon',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between w-[100%]">
                <Icon
                  icon="ant-design:github-filled"
                  size={iconSize}
                  class="cursor-pointer ant-icon"
                  color={iconColor}
                  hoverColor={hoverColor}
                />
                <Icon
                  icon="ant-design:wechat-filled"
                  size={iconSize}
                  class="cursor-pointer ant-icon"
                  color={iconColor}
                  hoverColor={hoverColor}
                />
                <Icon
                  icon="ant-design:alipay-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
                <Icon
                  icon="ant-design:weibo-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
              </div>
            </>
          )
        }
      }
    }
  }
])

const iconSize = 30

const remember = ref(userStore.getRememberMe)

const initLoginInfo = () => {
  const loginInfo = userStore.getLoginInfo
  if (loginInfo) {
    const { username, password } = loginInfo
    setValues({ username, password })
  }
}
onMounted(() => {
  initLoginInfo()
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose, setValues } = formMethods

const loading = ref(false)

const iconColor = '#999'

const hoverColor = 'var(--el-color-primary)'

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
const captchaImg = ref<string>('')
const captchaId = ref<string>('')

const loadCaptcha = () => {
  getCaptcha(41, 49, 70, 255).then((res) => {
    captchaImg.value = res.data.imageBase64
    captchaId.value = res.data.captchaId
  })
}

loadCaptcha()

// 登录
const signIn = async () => {
  const formRef = await getElFormExpose()
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const formData = await getFormData<UserLoginType>()
      formData.captchaId = captchaId.value
      try {
        const res = await loginApi(formData)

        if (res) {
          // 是否记住我
          if (unref(remember)) {
            userStore.setLoginInfo(formData)
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
          loadCaptcha()
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
  <Form
    :schema="schema"
    :rules="rules"
    label-position="top"
    :hide-required-asterisk="true"
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    @register="formRegister"
  />
</template>

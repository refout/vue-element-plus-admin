export interface UserLoginType {
  username: string | null
  password: string | null
  captchaId?: string | null
  captchaCode?: string | null
}

export interface UserTokenType {
  token: string
}

export interface UserType {
  id: string
  username: string
  nickname: string
  email: string
  phone: string
  gender: string
  avatar: string

  // password: string
  // role: string
  // roleId: string
}

export interface Captcha {
  captchaId?: string
  imageBase64?: string
  enable: boolean
}

export interface UserLoginType {
  username: string
  password: string
  captchaId: string
  captchaCode: string
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

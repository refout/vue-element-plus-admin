import { Option } from '@/api/type/option'
import { BaseApi, BaseDomain } from '@/api'

const baseUrl: string = '/sys/user'

export const { pageApi, infoApi, addApi, editApi, delAllApi } = new BaseApi(baseUrl)

export interface User extends BaseDomain {
  username: string
  password: string
  nickname: string
  email: string
  phone: string
  gender: string
  avatar: string
  state: Option
}

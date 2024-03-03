import request from '@/axios'
import { PageIn, PageOut } from '@/api/type/page'
import { Option } from '@/api/type/option'

const baseUrl: string = '/sys/user'

export const pageApi = (data: PageIn<User | {}>): Promise<IResponse<PageOut<User>>> => {
  return request.post({ url: baseUrl + '/page', data })
}

export interface User {
  id: bigint
  username: string
  password: string
  nickname: string
  email: string
  phone: string
  gender: string
  avatar: string
  state: Option
}

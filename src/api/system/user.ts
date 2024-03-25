import { Option } from '@/api/type/option'
import { BaseApi, BaseDomain } from '@/api'

const baseUrl: string = '/sys/user'

export const { pageApi, infoApi, addApi, editApi, deleteApi, deleteAllApi } = new BaseApi<User>(
  baseUrl
)

export const changeUsageApi = (
  id: bigint,
  state: Option | string | number | boolean
): Promise<IResponse<User>> => editApi({ id, state })

export interface User extends BaseDomain {
  username?: string
  password?: string
  nickname?: string
  email?: string
  phone?: string
  gender?: string
  avatar?: string
  state?: Option | string | number | boolean
}

import request from '@/axios'
import type { UserLoginType, UserTokenType, UserType } from './types'

export const loginApi = (data: UserLoginType): Promise<IResponse<UserTokenType>> => {
  return request.post({ url: '/login', data })
}

export const getUserInfo = (): Promise<IResponse<UserType>> => {
  return request.get({ url: '/info' })
}

export const getRouter = (): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/router' })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.delete({ url: '/logout' })
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    code: string
    data: {
      list: UserType[]
      total: number
    }
  }>({ url: '/mock/user/list', params })
}

interface RoleParams {
  roleName: string
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/mock/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/mock/role/list2', params })
}

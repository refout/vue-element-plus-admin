import request from '@/axios'
import type { UserLoginType, UserTokenType, UserType } from './types'
import { Captcha } from './types'

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

export const getCaptcha = (
  r: number,
  g: number,
  b: number,
  a: number,
  width: number,
  height: number
): Promise<IResponse<Captcha>> => {
  return request.get({ url: `/captcha/${r}/${g}/${b}/${a}/${width}/${height}` })
}

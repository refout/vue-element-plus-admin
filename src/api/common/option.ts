import request from '@/axios'
import { Option } from '@/api/type/option'

const baseUrl: string = '/common/option'

const baseApi = (type: string): Promise<IResponse<Option[]>> => {
  return request.get({ url: baseUrl + type })
}

export const successOptionApi = () => baseApi('/success')
export const genderOptionApi = () => baseApi('/gender')
export const processOptionApi = () => baseApi('/process')
export const usageOptionApi = () => baseApi('/usage')
export const normalOptionApi = () => baseApi('/normal')

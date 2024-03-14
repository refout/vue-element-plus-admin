import { BaseApi, BaseDomain } from '@/api'

const baseUrl: string = '/sys/config'

export const { pageApi, infoApi, editApi } = new BaseApi(baseUrl)

export interface Config extends BaseDomain {
  name?: string
  value: string
  belong?: string
  app?: string
  historyValue?: { value: string; time: string }
  remark?: string
}

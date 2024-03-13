import { PageIn, PageOut } from '@/api/type/page'
import request from '@/axios'

export interface BaseDomain {
  id: bigint
  createTime?: Date
  createBy?: string
  updateTime?: Date
  updateBy?: string
}

export class BaseApi<T extends BaseDomain> {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  public pageApi = (data: PageIn<T | {}>): Promise<IResponse<PageOut<T>>> => {
    return request.post({ url: this.baseUrl + '/page', data })
  }

  public infoApi = (id: bigint): Promise<IResponse<T>> => {
    return request.get({ url: this.baseUrl + id })
  }

  public addApi = (data: T): Promise<IResponse<T>> => {
    return request.post({ url: this.baseUrl, data })
  }

  public editApi = (data: T): Promise<IResponse<T>> => {
    return request.put({ url: this.baseUrl, data })
  }

  public delApi = (id: bigint): Promise<IResponse<T>> => {
    return request.delete({ url: this.baseUrl + '/' + id })
  }

  public delAllApi = (ids: bigint[]): Promise<IResponse<T>> => {
    return request.delete({ url: this.baseUrl + '/all', data: { ids } })
  }
}

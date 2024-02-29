import request from '@/axios'
import { PageIn } from '@/api/type/page'

export const page = (data: PageIn<any>) => {
  console.log(data)
  return request.post({ url: '/sys/user/page', data })
}

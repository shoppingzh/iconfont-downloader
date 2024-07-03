import { Readable } from 'stream'
import http from '../http/index'

/**
 * 加载图标包
 * 
 * @param token 
 * @param pid 
 * @returns 
 */
export async function loadStream(token: string, pid: string): Promise<Readable> {
  const stream = await http<unknown, Readable>({
    url: '/project/download.zip',
    method: 'get',
    params: {
      pid,
    },
    responseType: 'stream',
    headers: {
      cookie: `EGG_SESS_ICONFONT=${token}`
    },
  })
  return stream
}

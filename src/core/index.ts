import http from '../http/index'

/**
 * 将图标包下载到流里
 * 
 * @param token 
 * @param pid 
 * @returns 
 */
export async function download(token: string, pid: string): Promise<ReadableStream> {
  const stream = await http<any, ReadableStream>({
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

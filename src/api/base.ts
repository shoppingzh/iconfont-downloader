import { loadStream } from '@/core'
import { stream2Buffer } from '@/utils'
import AdmZip from 'adm-zip'

export interface BaseOptions {
  token: string
  pid: string
}

function checkRequiredParams(token: string, pid: string) {
  if (!token) throw new Error('缺少token参数')
  if (!pid) throw new Error('缺少pid参数')
}

export async function loadZip(token: string, pid: string) {
  checkRequiredParams(token, pid)
  const stream = await loadStream(token, pid)
  const buffer = await stream2Buffer(stream)
  let zip: AdmZip
  try {
    zip = new AdmZip(buffer)
  } catch {
    throw new Error('下载内容错误，请检查token与pid参数！')
  }

  return zip
}

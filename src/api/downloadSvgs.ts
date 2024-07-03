import { loadStream } from '@/core'
import { BaseOptions } from './base'
import { stream2Buffer } from '@/utils'
import AdmZip from 'adm-zip'
import { Duplex, Readable } from 'stream'
import { parse } from '@/svg'
import fs from 'fs'
import path from 'path'

type FilenameMapper = (iconName: string) => string
export interface DownloadSvgOptions extends BaseOptions {
  filename?: FilenameMapper
  destDir?: string
}

function getFilename(iconName: string, fn: FilenameMapper) {
  let filename
  if (fn) {
    filename = fn(iconName)
  }
  if (!filename) {
    filename = iconName
  }
  return `${filename}.svg`
}

export async function downloadSvgs(options: DownloadSvgOptions): Promise<Readable | void> {
  const { token, pid, destDir, filename: filenameFn, } = options
  const stream = await loadStream(token, pid)
  const buffer = await stream2Buffer(stream)
  const zip = new AdmZip(buffer)
  const entry = zip.getEntries().find(entry => !entry.isDirectory && entry.name && /^iconfont\.js$/.test(entry.name))
  if (!entry) return Promise.reject('没有找到包含svg的javascript文件！')
  const content = entry.getData().toString('utf-8')
  const result = parse(content)

  if (destDir) {
    result.forEach(item => {
      const filename = getFilename(item.id, filenameFn)
      fs.writeFileSync(path.resolve(destDir, filename), item.svg, { encoding: 'utf-8' })
    })
  } else {
    const newZip = new AdmZip()
    result.forEach(item => {
      const filename = getFilename(item.id, filenameFn)
      newZip.addFile(filename, Buffer.from(item.svg, 'utf-8'))
    })
    const stream = new Duplex()
    stream.push(newZip.toBuffer())
    stream.push(null)
    return stream
  }
}

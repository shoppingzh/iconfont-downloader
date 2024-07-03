import { BaseOptions, loadZip } from './base'
import AdmZip from 'adm-zip'
import { Duplex, Readable } from 'stream'
import { parse } from '@/svg'
import fs from 'fs'
import path from 'path'

type FilenameMapper = (iconName: string) => string
export interface DownloadSvgOptions extends BaseOptions {
  /** 文件名映射函数 */
  filename?: FilenameMapper
  /** 目标目录 */
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

/**
 * 下载svg集合
 * 
 * 当传递了destDir参数时，文件会下载到该参数对应的目录里；
 * 否则，将通过一个压缩包流的形式返回
 * 
 * @param options 
 * @returns 
 */
export async function downloadSvgs(options: DownloadSvgOptions): Promise<Readable | void> {
  const { token, pid, destDir, filename: filenameFn, } = options
  const zip = await loadZip(token, pid)
  const entry = zip.getEntries().find(entry => !entry.isDirectory && entry.name && /^iconfont\.js$/.test(entry.name))
  if (!entry) throw new Error('没有找到包含svg的javascript文件！')
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

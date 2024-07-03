import AdmZip, { IZipEntry } from 'adm-zip'
import { Duplex, Readable } from 'stream'
import { BaseOptions, loadZip } from './base'

interface DownloadPicks {
  css?: boolean
  font?: boolean
  svg?: boolean
}
export interface DownloadOptions extends BaseOptions {
  destDir: string
  picks?: DownloadPicks
}
type PickTestRegExps = Record<keyof DownloadPicks, RegExp>

const DEFAULT_PICKS: DownloadPicks = {
  css: true,
  font: true,
  svg: true,
}

const PICK_TEST_REG_EXPS: PickTestRegExps = {
  css: /\.css$/,
  font: /\.(woff|woff2|ttf)$/,
  svg: /\.svg$/
}

/**
 * 下载图标包(两种方式：1.传递了destDir，下载到文件夹里 2. 否则下载到流里)
 * 
 * @param options 
 * @returns 
 */
export async function download(options: DownloadOptions): Promise<Readable | void> {
  const { token, pid, destDir, picks = DEFAULT_PICKS } = options
  const zip = await loadZip(token, pid)

  const pickEntries = zip.getEntries().reduce((all, entry) => {
    const isDir = entry.isDirectory
    if (isDir) return all
    const filename = entry.name || ''
    for (const [type, isPick] of Object.entries(picks)) {
      const pass = PICK_TEST_REG_EXPS[type as keyof DownloadPicks].test(filename)
      if (!pass || !isPick) continue
      all.push(entry)
    }
    return all
  }, [] as IZipEntry[])


  if (destDir) {
    for (const entry of pickEntries) {
      zip.extractEntryTo(entry, destDir, false, true)
    }
  } else {
    const newZip = new AdmZip()
    for (const entry of pickEntries) {
      newZip.addFile(entry.name, entry.getData())
    }
    const stream = new Duplex()
    stream.push(newZip.toBuffer())
    stream.push(null)
    return stream
  }
}

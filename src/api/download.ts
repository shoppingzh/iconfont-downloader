import { loadStream } from '@/core'
import { stream2Buffer } from '@/utils'
import AdmZip, { IZipEntry } from 'adm-zip'
import { Duplex, Readable } from 'stream'

interface BaseOptions {
  token: string
  pid: string
}
interface DownloadPicks {
  css?: boolean
  font?: boolean
  svg?: boolean
}
interface DownloadOptions extends BaseOptions {
  destDir: string
  picks?: DownloadPicks
}

const DEFAULT_PICKS: DownloadPicks = {
  css: true,
  font: true,
  svg: true,
}

type PickTestRegExps = Record<keyof DownloadPicks, RegExp>
const PICK_TEST_REG_EXPS: PickTestRegExps = {
  css: /\.css$/,
  font: /\.(woff|woff2|ttf)$/,
  svg: /\.css$/
}

export async function download(options: DownloadOptions): Promise<Readable | void> {
  const { token, pid, destDir, picks = DEFAULT_PICKS } = options
  const stream = await loadStream(token, pid)
  const buffer = await stream2Buffer(stream)
  const zip = new AdmZip(buffer)

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

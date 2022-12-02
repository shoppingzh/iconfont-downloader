import axios from 'axios'
import { createWriteStream, mkdirSync, PathLike, readdirSync, rmSync } from 'fs'
import AdmZip from 'adm-zip'
import { extname, resolve } from 'path'
import fs from 'fs-extra'

const TEMP = resolve(__dirname, '../.tmp')

rmSync(TEMP, { force: true, recursive: true })
mkdirSync(TEMP)

interface Options {
  pid: string,
  token: string,
  destDir: string,
}

async function pipStream(data: any, path: PathLike) {
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(path)
    stream.on('error', reject)
    stream.on('finish', resolve)
    data.pipe(stream)
  })
}

function isUsefulFile(filename: string) {
  return ['.css', '.woff', '.woff2', '.svg', '.ttf'].indexOf(extname(filename)) >= 0
    && /^iconfont/.test(filename)
}

export async function download(options: Options) {
  const { data } = await axios({
    url: 'https://www.iconfont.cn/api/project/download.zip',
    params: {
      pid: options.pid,
    },
    responseType: 'stream',
    headers: {
      cookie: `EGG_SESS_ICONFONT=${options.token}`
    }
  })
  const zipFile = resolve(TEMP, './download.zip')
  await pipStream(data, zipFile)

  const az = new AdmZip(zipFile)
  az.extractAllTo(TEMP, true)
  const dirs = readdirSync(TEMP, { withFileTypes: true }).filter(o => o.isDirectory() && /^font_/.test(o.name))
  if (!dirs.length) return
  const dir = resolve(TEMP, dirs[0].name)
  readdirSync(dir, { withFileTypes: true })
    .filter(o => o.isFile() && isUsefulFile(o.name))
    .forEach(o => {
      fs.copyFileSync(resolve(dir, o.name), resolve(options.destDir, o.name))
    })
  // 删掉tmp目录
  rmSync(TEMP, { force: true, recursive: true })
}


import axios from 'axios'
import { createWriteStream, existsSync, mkdirSync, PathLike, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import AdmZip from 'adm-zip'
import path from 'path'
import fs from 'fs-extra'

const TEMP = path.resolve(__dirname, '../.tmp')

rmSync(TEMP, { force: true, recursive: true })
mkdirSync(TEMP)

interface BaseOptions {
  token: string,
  pid: string,
}

interface DownloadOptions extends BaseOptions {
  destDir: string,
}

interface DownloadSvgsOptions extends BaseOptions {
  filename: (iconName: string) => string,
  destDir: string,
}

interface SvgParsed {
  id: string,
  content: string,
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
  return ['.css', '.woff', '.woff2', '.svg', '.ttf'].indexOf(path.extname(filename)) >= 0
    && /^iconfont/.test(filename)
}

async function downloadAndUnzip(token: string, pid: string) {
  return new Promise<string>(async(resolve, reject) => {
    try {
      const { data } = await axios({
        url: 'https://www.iconfont.cn/api/project/download.zip',
        params: {
          pid
        },
        responseType: 'stream',
        headers: {
          cookie: `EGG_SESS_ICONFONT=${token}`
        }
      })
      const zipFile = path.resolve(TEMP, './download.zip')
      await pipStream(data, zipFile)
    
      const az = new AdmZip(zipFile)
      az.extractAllTo(TEMP, true)
      const dirs = readdirSync(TEMP, { withFileTypes: true }).filter(o => o.isDirectory() && /^font_/.test(o.name))
      if (!dirs.length) return reject(new Error('文件格式错误'))

      resolve(path.resolve(TEMP, dirs[0].name))
    } catch (err) {
      reject(err)
    }
  })
}

export async function download(options: DownloadOptions) {
  const dir = await downloadAndUnzip(options.token, options.pid)
  readdirSync(dir, { withFileTypes: true })
    .filter(o => o.isFile() && isUsefulFile(o.name))
    .forEach(o => {
      fs.copyFileSync(path.resolve(dir, o.name), path.resolve(options.destDir, o.name))
    })
  // 删掉tmp目录
  // rmSync(TEMP, { force: true, recursive: true })
}

const JS_SVG_RE = /window\.\w+?\s*=\s*'(.*?)'/

interface Attr {
  name: string,
  value: string,
}

function parseAttrs(content: string): Record<string, string> {
  const re = new RegExp(/(\w+)\s*=\s*"(.*?)"/, 'g')
  let result: RegExpExecArray | null
  const attrs: Record<string, string> = {}
  // eslint-disable-next-line no-cond-assign
  while (result = re.exec(content)) {
    attrs[result[1]] = result[2]
  }
  return attrs
}

function parseSvgs(content: string): SvgParsed[] {
  const re = new RegExp(/<symbol\s*(.*?)\s*>(.*?)(?:<\/symbol>)/, 'g')
  let result: RegExpExecArray | null
  const list: SvgParsed[] = []
  // eslint-disable-next-line no-cond-assign
  while (result = re.exec(content)) {
    const classname = result[1]
    const inner = result[2]
    const attrs = parseAttrs(classname)
    list.push({
      id: attrs.id,
      content: `<svg width="150" height="150" ${classname}>${inner}</svg>`,
    })
  }

  return list
}

async function loadSvgs(options: BaseOptions) {
  const dir = await downloadAndUnzip(options.token, options.pid)
  const svgJsPath = path.resolve(dir, 'iconfont.js')
  if (!existsSync(svgJsPath)) throw new Error('不存在iconfont.js文件！')
  const content = readFileSync(svgJsPath, { encoding: 'utf-8' })
  const re = new RegExp(JS_SVG_RE, 'g')
  const result = re.exec(content)
  if (!result) throw new Error('没有找到svg内容！')
  const svg = result[1]
  const svgs = parseSvgs(svg)
  return svgs
}

export async function downloadSvgs(options: DownloadSvgsOptions) {
  const svgs = await loadSvgs(options)
  svgs.forEach(svg => {
    const filename = options.filename ? options.filename(svg.id) : svg.id
    writeFileSync(path.resolve(options.destDir, `${filename}.svg`), svg.content, { encoding: 'utf-8' })
  })
}

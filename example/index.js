import { dirname, resolve } from 'path'
import { download, downloadSvgs } from 'iconfont-downloader'
import { createWriteStream, existsSync, mkdirSync, readFileSync, rm, rmSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function mkDirIfNotExist(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
  }
}

const tokenFile = resolve(__dirname, 'token')
if (!existsSync(tokenFile)) {
  throw new Error('请在该目录下新建token文件，并将iconfont token复制到文件内！')
}

const PID = '3838794'
const TOKEN = readFileSync(tokenFile, { encoding: 'utf-8' })

const destDir1 = resolve(__dirname, 'dist')
rmSync(destDir1, { force: true, recursive: true })
mkdirSync(destDir1);

(async() => {
  await download({
    pid: PID,
    token: TOKEN,
    destDir: destDir1,
  })
  const stream = await download({
    pid: PID,
    token: TOKEN,
    picks: {
      css: false,
      font: true,
      svg: false,
    }
  })
  const fileStream = createWriteStream(resolve(destDir1, 'download.zip'))
  stream.pipe(fileStream)

  const destDir2 = resolve(__dirname, 'dist/svg')
  mkDirIfNotExist(destDir2)

  await downloadSvgs({
    pid: PID,
    token: TOKEN,
    destDir: destDir2,
    filename: name => name.replace(/^icon-(.*)$/g, '$1'),
  })

  const stream2 = await downloadSvgs({
    pid: PID,
    token: TOKEN,
    filename: name => name.replace(/^icon-(.*)$/g, 'svg-$1'),
  })
  const fileStream2 = createWriteStream(resolve(destDir1, 'svgs.zip'))
  stream2.pipe(fileStream2)
})()

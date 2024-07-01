import { dirname, resolve } from 'path'
import { download, } from 'iconfont-downloader'
import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'fs'
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

const PID = '3781277';
(async() => {
  const destDir1 = resolve(__dirname, 'dist')
  mkDirIfNotExist(destDir1)
  await download({
    pid: PID,
    token: readFileSync(tokenFile, { encoding: 'utf-8' }),
    destDir: destDir1,
    picks: {
      css: true,
      font: false,
      svg: false,
    }
  })
  const stream = await download({
    pid: PID,
    token: readFileSync(tokenFile, { encoding: 'utf-8' }),
    picks: {
      css: false,
      font: true,
      svg: false,
    }
  })
  const fileStream = createWriteStream(resolve(destDir1, 'download.zip'))
  stream.pipe(fileStream)

  // const destDir2 = resolve(__dirname, 'dist/svg')
  // mkDirIfNotExist(destDir2)

  // await downloadSvgs({
  //   pid: PID,
  //   token: readFileSync(tokenFile, { encoding: 'utf-8' }),
  //   destDir: destDir2,
  //   filename: name => name.replace(/^icon-(.*)$/g, '$1'),
  // })
})()

const path = require('path')
const { download, downloadSvgs } = require('iconfont-downloader')
const { existsSync, mkdirSync, readFileSync } = require('fs')

function mkDirIfNotExist(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
  }
}

const tokenFile = path.resolve(__dirname, 'token')
if (!existsSync(tokenFile)) {
  throw new Error('请在该目录下新建token文件，并将iconfont token复制到文件内！')
}

const PID = '3781277'

;(async() => {
  const destDir1 = path.resolve(__dirname, 'dist')
  mkDirIfNotExist(destDir1)
  await download({
    pid: PID,
    token: readFileSync(tokenFile, { encoding: 'utf-8'}),
    destDir: destDir1,
  })
  
  const destDir2 = path.resolve(__dirname, 'dist/svg')
  mkDirIfNotExist(destDir2)
  
  await downloadSvgs({
    pid: PID,
    token: readFileSync(tokenFile, { encoding: 'utf-8'}),
    destDir: destDir2,
    filename: name => name.replace(/^icon-(.*)$/g, '$1'),
  })
})()


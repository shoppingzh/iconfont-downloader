const path = require('path')
const { download } = require('iconfont-downloader')
const { existsSync, mkdirSync, readFileSync } = require('fs')


const tokenFile = path.resolve(__dirname, 'token')
if (!existsSync(tokenFile)) {
  throw new Error('请在该目录下新建token文件，并将iconfont token复制到文件内！')
}

const destDir = path.resolve(__dirname, 'dist')
if (!existsSync(destDir)) {
  mkdirSync(destDir)
}


download({
  pid: '3781277',
  token: readFileSync(tokenFile, { encoding: 'utf-8'}),
  destDir
})


# iconfont-downloader

iconfont图标包下载工具

## 安装

```bash
pnpm i iconfont-downloader
# yarn add iconfont-downloader
# npm i iconfont-downloader
```

## 使用

```ts
import { download } from 'iconfont-downloader'

download({
  pid: '123456',
  token: 'abc123',
  destFile: './fonts'
})
```

## 参数

- `pid(string)`: 项目id
- `token(string)`: iconfont的token，登录iconfont后，打开F12控制台，名为`EGG_SESS_ICONFONT`的cookie即为该token
- `destFile(string)`: 下载的文件存放的目录


# iconfont-downloader

iconfont图标包下载工具

## 安装

```bash
pnpm i iconfont-downloader
# yarn add iconfont-downloader
# npm i iconfont-downloader
```

## 使用

**下载字体包**

```ts
import { download } from 'iconfont-downloader'

download({
  pid: '123456',
  token: 'abc123',
  destDir: './fonts'
})
```

**参数**

- `token(string)`: iconfont的token，登录iconfont后，打开F12控制台，名为`EGG_SESS_ICONFONT`的cookie即为该token
- `pid(string)`: 项目id
- `destDir(string)`: 下载的文件存放的目录

***

**下载SVG包**

```ts
import { downloadSvgs } from 'iconfont-downloader'

downloadSvgs({
  pid: '123456',
  token: 'abc123',
  destDir: './svgs'
})
```

**参数**

- `token(string)`: iconfont登录token
- `pid(string)`: 项目ID
- `destDir(string)`: 目标目录
- `filename((iconName: string) => string)`: svg文件名重写

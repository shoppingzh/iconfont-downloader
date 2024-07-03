# iconfont-downloader

iconfont图标包下载工具

## 安装

```bash
pnpm i iconfont-downloader
# yarn add iconfont-downloader
# npm i iconfont-downloader
```

## 使用

### 下载字体包

```ts
import { download } from 'iconfont-downloader'

download({
  pid: '123456',
  token: 'abc123',
  destDir: './fonts',
  picks: {
    css: true,
  }
})
```

**参数**

- `token(string)`: iconfont的token，登录iconfont后，打开F12控制台，名为`EGG_SESS_ICONFONT`的cookie即为该token
- `pid(string)`: 项目id
- `destDir(string)`: 下载的文件存放的目录
- `picks(DownloadPicks)`: 挑选图标包中的文件类型

```ts
interface DownloadPicks {
  css?: boolean
  font?: boolean
  svg?: boolean
}
```

**返回值**

`Promise<Readable | void>`


如果不需要将文件下载到指定目录里，可以不传递 `destDir` 参数，这样，函数会返回一个可读的流：

```ts
const stream = await download({
  pid: '123456',
  token: 'abc123',
})
// 使用这个流..
```


### 下载SVG包

> iconfont的图标包是不包含每个图标的单独svg文件的，而是将所有svg代码置于一个 `.js` 文件中，然后通过 `symbol` 引用的方式去使用。

但是，有时候我们需要所有的单独svg文件，此时，使用以下方法就非常方便了。

下面的代码演示了，将图标包的svg解析出来，并以一个一个文件的形式存放在 `svgs` 目录下。

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

同样，此方法如果不设置 `destDir` ，也会返回一个包含了所有svg文件的压缩包流。

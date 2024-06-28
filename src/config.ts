import os from 'os'
import fs from 'fs'
import path from 'path'

export default {
  tempDir: fs.mkdtempSync(path.join(os.tmpdir(), 'iconfont-downloader')),
}

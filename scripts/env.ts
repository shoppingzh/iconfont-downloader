import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

const env = process.env.NODE_ENV
const filepath = path.resolve(__dirname, `../.env.${env}`)

let config: Record<string, any> = Object.create(null)

if (filepath && fs.existsSync(filepath)) {
  config = dotenv.parse(fs.readFileSync(filepath, { encoding: 'utf8' }))
}

// 以防被环境配置文件覆盖
config.NODE_ENV = env

export default config
